import type { EventDef } from '@bl/sim';

// Career-specific events for the least-covered careers (wave 3). Prefix: c3_
// Chains: c3_tutor_exam → c3_tutor_results, c3_acc_cook → c3_acc_audit (flag c3_acc_cooked),
//         c3_sci_grant → c3_sci_review, c3_psy_couple → c3_psy_burnout (flag c3_psy_couples).
export const career3Events: EventDef[] = [
  // ───────────────────────────── tutor ─────────────────────────────
  {
    id: 'c3_tutor_parent', icon: '✏️', cat: 'job', rating: 0,
    scene: { place: 'home', mood: 'neutral', prop: 'book' },
    when: { job: 'tutor' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Ton élève, Enzo, 15 ans, pense que Napoléon a inventé le napolitain. Sa mère t'attend dans la cuisine : « Il me faut 16 au bac, sinon on vend votre numéro aux Témoins de Jéhovah. »",
        "Cours de maths du mercredi. Ton élève fixe son équation comme {w:animal} fixe un Rubik's Cube. Son père entre : « Alors, il a progressé ? On paie 40 balles de l'heure, hein. »",
        "Ton élève de 3e t'explique avec aplomb que la Seconde Guerre mondiale a eu lieu « vers 1800 et quelques ». Sa mère, derrière la porte, prend des notes sur toi.",
        "Ça fait [[six|huit|onze]] semaines que tu expliques les fractions à Inès. Aujourd'hui, elle lève la main : « Mais du coup… un demi, c'est plus grand qu'un quart parce que deux c'est plus petit que quatre ? » Tu sens ton âme se détacher.",
      ],
      en: [
        "Your student, Enzo, 15, thinks Napoleon invented Neapolitan ice cream. His mother waits for you in the kitchen: 'He needs an A, or we give your number to the Jehovah's Witnesses.'",
        "Wednesday maths lesson. Your student stares at his equation like {w:animal} staring at a Rubik's Cube. His dad walks in: 'So, is he improving? We pay 40 bucks an hour, you know.'",
        "Your 9th-grader explains with total confidence that World War II happened 'around 1800-something'. His mother is behind the door, taking notes on you.",
        "[[Six|Eight|Eleven]] weeks of explaining fractions to Ines. Today she raises her hand: 'So… a half is bigger than a quarter because two is smaller than four?' You feel your soul leave your body.",
      ],
    },
    choices: [
      { label: { fr: 'Faire ses devoirs à sa place', en: 'Do the homework for him' }, out: [
        { w: 3, text: { fr: ["J'ai rédigé sa dissertation moi-même. Il a eu 17. Sa prof a écrit « Enfin ! » en rouge. Les parents m'ont offert un bonus et un pot de rillettes.", "J'ai fait tout son DM en douce. 18/20. Sa mère m'a serré dans ses bras en pleurant. Moi, j'ai pleuré parce que j'ai compris que j'étais payé{|e} pour aller à l'école une deuxième fois."], en: ["I wrote his essay myself. He got an A. His teacher wrote 'Finally!' in red. The parents gave me a bonus and a jar of pâté.", "I secretly did his whole assignment. 18/20. His mother hugged me, sobbing. I sobbed because I realised I'm being paid to go to school twice."] }, fx: { money: 150, perf: 6, karma: -4 }, mood: 'happy' },
        { w: 1, text: { fr: ["Sa prof a reconnu mon style : j'avais déjà fait les devoirs du grand frère. Convocation, scandale, et un parent d'élèves qui m'a traité{|e} de « mercenaire de la conjugaison ».", "J'ai mis tellement de mots compliqués que la prof a appelé les parents pour suspicion de triche. Ils m'ont viré{|e} par texto avec l'emoji 🖕."], en: ["The teacher recognised my style: I'd already done the big brother's homework. Meeting, scandal, and a parent calling me a 'conjugation mercenary'.", "I used so many big words the teacher called the parents on suspicion of cheating. They fired me by text, with the 🖕 emoji."] }, fx: { fired: true, happy: -6 }, mood: 'shock' },
      ] },
      { label: { fr: 'Vraiment lui apprendre', en: 'Actually teach him' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai tout repris depuis le CP avec des bonbons comme unités de mesure. Il a eu 12. Ses parents ont dit « c'est tout ? ». Moi, j'ai vécu ce 12 comme un Nobel.", "Trois heures de schémas, de métaphores footballistiques et de menaces douces. Il a compris. Il m'a regardé{|e} comme un prophète. Puis il a tout oublié pendant le week-end, mais j'ai vu la lumière."], en: ["I went back to first grade using candy as units. He got a C. His parents said 'that's it?'. To me, that C was a Nobel Prize.", "Three hours of diagrams, football metaphors and gentle threats. He got it. He looked at me like a prophet. Then he forgot everything over the weekend, but I saw the light."] }, fx: { perf: 8, happy: 6, smarts: 2 }, mood: 'proud' },
        { w: 2, odds: { smarts: -1 }, text: { fr: ["Au bout d'une heure, c'est moi qui ne savais plus faire une division. Il m'a expliqué avec patience. Je lui ai quand même facturé la séance.", "J'ai tenté d'expliquer Pythagore. On a fini par regarder des vidéos de chats qui tombent. Ses parents payaient la séance. Je n'en suis pas fier{|e}."], en: ["After an hour, I was the one who couldn't do long division anymore. He patiently explained it to me. I still billed the session.", "I tried to explain Pythagoras. We ended up watching videos of cats falling off things. His parents paid for it. I'm not proud."] }, fx: { perf: -4, money: 40 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Dire la vérité aux parents', en: 'Tell the parents the truth' }, out: [
        { w: 1, text: { fr: ["J'ai dit : « Votre fils est gentil, mais il est bête comme {w:object}. » Silence. Puis le père a dit : « Comme moi. » Ils m'ont augmenté{|e} pour l'honnêteté.", "J'ai expliqué calmement qu'un 16 était aussi probable qu'une licorne au conseil de classe. La mère a hoché la tête, a payé, puis a embauché un deuxième prof en parallèle « pour comparer »."], en: ["I said: 'Your son is sweet, but he's as dumb as {w:object}.' Silence. Then the dad said: 'Like me.' They gave me a raise for honesty.", "I calmly explained that an A was about as likely as a unicorn at the teachers' meeting. The mother nodded, paid, then hired a second tutor in parallel 'to compare'."] }, fx: { karma: 4, perf: 2, money: 60 }, mood: 'neutral' },
        { w: 1, text: { fr: ["« Comment osez-vous ! Enzo est haut potentiel ! » J'ai été remplacé{|e} par un étudiant en prépa qui fait les devoirs à sa place. Enzo a eu 17. La boucle est bouclée.", "La mère a pleuré, puis crié, puis m'a facturé le café. J'ai perdu l'élève, mais j'ai gagné une histoire pour les soirées."], en: ["'How dare you! Enzo is gifted!' I got replaced by a prep-school kid who does his homework for him. Enzo got an A. Circle of life.", "The mother cried, then yelled, then charged me for the coffee. Lost the student, gained a party story."] }, fx: { perf: -8, money: -5, happy: -3 }, mood: 'sad' },
      ] },
    ],
  },
  {
    id: 'c3_tutor_exam', icon: '📝', cat: 'job', rating: 0,
    scene: { place: 'home', mood: 'sleepy', prop: 'book' },
    when: { job: 'tutor' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Veille du brevet. Ton élève t'appelle à 23 h en panique : il vient de découvrir qu'il y avait « aussi de la géographie ». Il a révisé {w:hobby} toute la semaine.",
        "Ton élève passe son bac de français demain. Il n'a pas lu le livre. Il n'a pas lu le résumé. Il a vu un TikTok de 14 secondes sur l'auteur, et il pense que c'est une femme.",
        "Sa mère te propose une séance « d'urgence » de six heures la veille de l'examen. Prix doublé. Ton élève, lui, propose de regarder {w:show} « pour se détendre ».",
        "Examen dans [[12|9|6]] heures. Ton élève t'avoue qu'il a confondu « chimie » et « cuisine » sur son emploi du temps depuis septembre. Il fait de très bonnes crêpes, cela dit.",
      ],
      en: [
        "Night before the exam. Your student calls at 11 p.m. in a panic: he just found out there's 'also geography'. He spent the whole week revising {w:hobby}.",
        "Your student has his literature exam tomorrow. He hasn't read the book. He hasn't read the summary. He watched a 14-second TikTok about the author and thinks the author is a woman.",
        "His mother offers you a six-hour 'emergency session' the night before the exam. Double rate. Your student suggests watching {w:show} 'to relax'.",
        "Exam in [[12|9|6]] hours. Your student confesses he's been confusing 'chemistry' with 'cooking' on his timetable since September. He makes great crêpes, though.",
      ],
    },
    choices: [
      { label: { fr: 'Nuit blanche intensive', en: 'All-night cram session' }, out: [
        { w: 1, text: { fr: ["On a bossé jusqu'à 4 h au café soluble. À la fin, il récitait la Révolution française en rap. Moi, je voyais des fractions danser au plafond.", "Six heures de fiches, trois paquets de biscuits, une crise de larmes (la mienne). Il est reparti avec des antisèches dans les chaussettes « au cas où »."], en: ["We worked till 4 a.m. on instant coffee. By the end he was rapping the French Revolution. I was seeing fractions dance on the ceiling.", "Six hours of flashcards, three packs of cookies, one breakdown (mine). He left with cheat sheets in his socks 'just in case'."] }, fx: { money: 240, stress: 8, health: -2, schedule: { key: 'c3_tutor_results', years: 1 } }, mood: 'sleepy' },
      ] },
      { label: { fr: 'Lui donner des techniques de bluff', en: 'Teach him to bluff' }, out: [
        { w: 1, text: { fr: ["Je lui ai appris la phrase magique : « Cette question soulève un paradoxe fascinant. » Elle marche pour tout. Même en maths.", "Règle d'or : si tu ne sais pas, cite un philosophe grec qui n'existe pas. « Comme le disait Pistachios… » Il a adoré."], en: ["I taught him the magic sentence: 'This question raises a fascinating paradox.' Works for everything. Even maths.", "Golden rule: if you don't know, quote a Greek philosopher who doesn't exist. 'As Pistachios once said…' He loved it."] }, fx: { money: 80, karma: -2, happy: 3, schedule: { key: 'c3_tutor_results', years: 1 } }, mood: 'happy' },
      ] },
      { label: { fr: 'Refuser, c\'est trop tard', en: 'Refuse, too late' }, text: { fr: ["J'ai dit que c'était trop tard et que la vraie leçon, c'était l'échec. Sa mère m'a répondu par un vocal de 7 minutes. Je ne l'ai pas écouté. Je n'ai plus d'élève.", "J'ai souhaité bonne chance et éteint mon téléphone. Le lendemain, 14 appels en absence et un avis Google une étoile : « Prof fantôme. »"], en: ["I said it was too late and that failure was the real lesson. His mother replied with a 7-minute voice note. I didn't listen. I no longer have a student.", "I wished him luck and turned off my phone. Next morning: 14 missed calls and a one-star Google review: 'Ghost tutor.'"] }, fx: { perf: -10, happy: 2 }, mood: 'neutral' },
    ],
  },
  {
    id: 'c3_tutor_results', icon: '🎓', cat: 'job', rating: 0, chainOnly: true,
    scene: { place: 'home', mood: 'shock' },
    when: { job: 'tutor' },
    text: {
      fr: [
        "Jour des résultats. Ton ancien élève débarque chez toi, essoufflé, son téléphone à la main. Il ne dit rien. Il tremble.",
        "Les notes sont tombées. Ta boîte mail contient un message de la mère de ton élève, objet : « LES RÉSULTATS !!!!!! » (six points d'exclamation).",
        "Ton téléphone vibre : un selfie de ton ancien élève devant le tableau d'affichage du lycée. Tu ne vois pas sa note. Tu vois juste sa bouche grande ouverte.",
        "Un an après la nuit blanche, l'heure de vérité. Ton élève t'appelle en visio, la caméra à l'envers. Tu vois le plafond et tu entends des cris.",
      ],
      en: [
        "Results day. Your former student shows up at your door, out of breath, phone in hand. He says nothing. He's shaking.",
        "Grades are out. Your inbox holds an email from your student's mother, subject: 'THE RESULTS!!!!!!' (six exclamation marks).",
        "Your phone buzzes: a selfie of your former student in front of the school notice board. You can't see the grade. Just his wide-open mouth.",
        "A year after the all-nighter, moment of truth. Your student video-calls you, camera upside down. You see the ceiling and hear screaming.",
      ],
    },
    choices: [
      { label: { fr: 'Ouvrir le message', en: 'Read the news' }, out: [
        { w: 3, text: { fr: ["Admis avec mention ! Il a cité Pistachios trois fois. La famille m'a offert {$amount} et une invitation à la communion du petit frère, ce qui est une punition.", "Reçu ! Il a fêté ça en hurlant mon prénom dans la rue. Les voisins pensent que je suis une sorte de gourou. Mes tarifs ont doublé."], en: ["Passed with honours! He quoted Pistachios three times. The family gave me {$amount} and an invitation to the little brother's communion, which is a punishment.", "He passed! He celebrated by screaming my name in the street. The neighbours think I'm some kind of guru. My rates doubled."] }, fx: { money: 'amount', perf: 12, happy: 10, promote: true }, mood: 'proud' },
        { w: 2, text: { fr: ["Recalé. 4 en géographie : il a situé Paris en Belgique « par instinct ». Sa mère a demandé un remboursement. Je lui ai rappelé que l'instinct, ça ne s'apprend pas.", "Rattrapage. Il m'a supplié de l'aider « encore une fois, la dernière, promis ». J'ai dit oui. Je dis toujours oui. C'est mon problème."], en: ["Failed. 4/20 in geography: he placed Paris in Belgium 'on instinct'. His mother asked for a refund. I reminded her instinct can't be taught.", "Resit. He begged me to help him 'one last time, promise'. I said yes. I always say yes. That's my problem."] }, fx: { perf: -6, happy: -4 }, mood: 'sad' },
      ] },
    ],
    vars: { amount: [200, 600] },
  },
  // ───────────────────────────── admin ─────────────────────────────
  {
    id: 'c3_admin_agenda', icon: '📅', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'shock', prop: 'phone' },
    when: { job: 'admin' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Tu gères l'agenda de ton patron. Ce soir, 20 h : « Dîner avec Martine » (sa femme). Ce soir, 20 h 15, même restaurant : « Dîner avec Jessica » (pas sa femme). Les deux ont confirmé.",
        "Ton chef te demande de réserver « une table discrète pour deux, loin des fenêtres » et, dans le même mail, des fleurs pour l'anniversaire de mariage. Mêmes date et heure.",
        "Ton patron vient d'accepter, dans le même agenda partagé, une réunion avec le PDG, un rendez-vous chez le kiné « intime » et un apéro avec sa maîtresse. Tout à 18 h. Couleur : rouge.",
        "Sa femme t'appelle : « Il est où, mon mari ? » Ton écran affiche « Séminaire stratégique » {w:at_place}. Tu sais très bien que c'est un hôtel avec jacuzzi.",
      ],
      en: [
        "You manage your boss's calendar. Tonight, 8 p.m.: 'Dinner with Martine' (his wife). Tonight, 8:15, same restaurant: 'Dinner with Jessica' (not his wife). Both confirmed.",
        "Your boss asks you to book 'a discreet table for two, away from the windows' and, in the same email, flowers for his wedding anniversary. Same date, same time.",
        "In the same shared calendar, your boss just accepted a meeting with the CEO, an 'intimate' physio appointment and drinks with his mistress. All at 6 p.m. Colour: red.",
        "His wife calls: 'Where's my husband?' Your screen says 'Strategy offsite' {w:at_place}. You know perfectly well it's a hotel with a hot tub.",
      ],
    },
    choices: [
      { label: { fr: 'Déplacer discrètement', en: 'Quietly reschedule' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai déplacé Jessica dans un autre restaurant, inventé un « problème de réservation » à Martine et sauvé un mariage que personne ne méritait. Mon patron m'a glissé une prime en liquide.", "Coup de maître : j'ai fusionné les deux en « séminaire » et envoyé le patron à Lyon. Il ne sait pas pourquoi il est à Lyon. Mais il est vivant."], en: ["I moved Jessica to another restaurant, invented a 'booking issue' for Martine and saved a marriage nobody deserved. My boss slipped me a cash bonus.", "Masterstroke: I merged both into a 'seminar' and sent the boss to Lyon. He doesn't know why he's in Lyon. But he's alive."] }, fx: { money: 500, perf: 10, karma: -4 }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["J'ai inversé les deux invitations. Martine a reçu « Hâte de te revoir, ma panthère ». Le patron a dormi au bureau pendant trois semaines. Il me regarde comme si j'avais tué son chien.", "Le calendrier partagé a envoyé une notification aux deux femmes : « Conflit d'horaire détecté ». Mon patron n'a plus de femme, plus de maîtresse, et plus confiance en moi."], en: ["I swapped the invitations. Martine received 'Can't wait to see you again, my panther'. The boss slept at the office for three weeks. He looks at me like I killed his dog.", "The shared calendar sent both women a notification: 'Scheduling conflict detected'. My boss has no wife, no mistress, and no trust in me."] }, fx: { perf: -12, stress: 6 }, mood: 'shock' },
      ] },
      { label: { fr: 'Laisser faire le destin', en: 'Let fate decide' }, out: [
        { w: 1, rating: 2, text: { fr: ["Les deux sont arrivées à 20 h 10. Martine a renversé une bouillabaisse sur la tête du patron, Jessica a planté sa fourchette dans sa cuisse. Le serveur a filmé. 4 millions de vues.", "Elles se sont parlé. Elles se sont plu. Elles sont parties ensemble en laissant l'addition. Le patron a payé 900 € et pleure dans son bureau depuis mardi."], en: ["Both showed up at 8:10. Martine poured a bouillabaisse on his head, Jessica stuck a fork in his thigh. The waiter filmed it. 4 million views.", "They talked. They clicked. They left together and stuck him with the bill. He paid $900 and has been crying in his office since Tuesday."] }, fx: { happy: 8, karma: 3 }, mood: 'happy' },
        { w: 1, text: { fr: ["Miracle : Martine a annulé pour aller voir {w:band}. Le patron n'a jamais su que j'avais vu le drame venir. Moi, j'ai acheté du pop-corn pour rien.", "Rien ne s'est passé. Il a dîné avec les deux, à deux tables différentes, en allant « aux toilettes » toutes les dix minutes. Cet homme est un athlète."], en: ["Miracle: Martine cancelled to go see {w:band}. The boss never knew I saw it coming. I bought popcorn for nothing.", "Nothing happened. He dined with both, at two different tables, going 'to the bathroom' every ten minutes. The man is an athlete."] }, fx: { happy: 2 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Prévenir sa femme', en: 'Warn his wife' }, out: [
        { w: 1, text: { fr: ["J'ai prévenu Martine. Elle m'a envoyé des fleurs, puis un avocat au patron. Il a été viré par le conseil d'administration — elle en était présidente. Je suis passé{|e} assistant{|e} de direction.", "Martine m'a remercié{|e} chaleureusement. Le patron a deviné que c'était moi. J'ai été muté{|e} aux archives, au sous-sol, à côté de la chaudière qui fait {w:sound}."], en: ["I told Martine. She sent me flowers and sent the boss a lawyer. The board fired him — she chaired it. I got promoted to executive assistant.", "Martine thanked me warmly. The boss guessed it was me. I got moved to the archives, in the basement, next to a boiler that makes {w:sound}."] }, fx: { karma: 8, perf: 5 }, mood: 'proud' },
      ] },
    ],
  },
  {
    id: 'c3_admin_budget', icon: '✈️', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'angry', prop: 'laptop' },
    when: { job: 'admin' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "La direction te demande d'organiser le séminaire annuel : 40 personnes, trois jours, « un endroit qui fait rêver ». Budget : [[900|600|1 200]] €. Total. Pas par personne.",
        "Mission du jour : commander « des fournitures ». Le bon de commande exige onze signatures, dont celle d'un directeur parti à la retraite en 2016.",
        "Le PDG veut un pot de départ « chaleureux mais pas cher » pour une collègue de 30 ans de maison. Budget : deux paquets de chips et un jus de pomme. Il insiste sur « le chaleureux ».",
        "On te demande de réserver un voyage d'affaires pour le patron {w:far_place}, avec escale, en business, pour le prix d'un ticket de métro. « Sois créati{f|ve}. »",
      ],
      en: [
        "Management asks you to organise the annual offsite: 40 people, three days, 'somewhere dreamy'. Budget: $[[900|600|1,200]]. Total. Not per person.",
        "Today's mission: order 'supplies'. The purchase form requires eleven signatures, including one from a director who retired in 2016.",
        "The CEO wants a 'warm but cheap' farewell party for a colleague with 30 years of service. Budget: two bags of chips and an apple juice. He insists on the 'warm'.",
        "You're asked to book a business trip for the boss {w:far_place}, with a layover, in business class, for the price of a bus ticket. 'Be creative.'",
      ],
    },
    choices: [
      { label: { fr: 'Faire des miracles', en: 'Work miracles' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai trouvé un gîte qui faisait une promo parce qu'il y avait eu un meurtre dedans. Tout le monde a adoré. Le PDG m'a félicité{|e} en réunion et a pris le crédit.", "J'ai négocié comme un marchand de tapis et obtenu un hôtel quatre étoiles en échange d'un avis Google. La direction pense que je suis {w:weird_job} reconverti{|e}."], en: ["I found a cottage on sale because there'd been a murder in it. Everyone loved it. The CEO praised me in a meeting and took the credit.", "I haggled like a rug dealer and got a four-star hotel in exchange for a Google review. Management thinks I used to be {w:weird_job}."] }, fx: { perf: 10, happy: 4 }, mood: 'proud' },
        { w: 1, text: { fr: ["J'ai réservé le seul truc dans le budget : un camping en Creuse, en novembre, sous une pluie battante. Trois collègues ont démissionné. Un a attrapé la gale.", "Le « lieu de rêve » était un parking de Courtepaille. J'ai appelé ça « séminaire immersif ». Personne n'a été dupe."], en: ["I booked the only thing in budget: a campsite in the middle of nowhere, in November, in pouring rain. Three colleagues quit. One got scabies.", "The 'dream venue' was a roadside steakhouse parking lot. I called it an 'immersive offsite'. Nobody bought it."] }, fx: { perf: -8, stress: 5 }, mood: 'sad' },
      ] },
      { label: { fr: 'Payer de ma poche', en: 'Pay out of pocket' }, out: [
        { w: 1, text: { fr: ["J'ai rajouté 300 € de ma poche pour un vrai gâteau. La collègue a pleuré de joie. Le PDG a fait un discours où il l'a appelée par un autre prénom.", "J'ai avancé les frais « en attendant le remboursement ». Le remboursement est prévu pour le prochain trimestre. Du siècle prochain."], en: ["I added $300 of my own for a real cake. The colleague cried with joy. The CEO gave a speech calling her by the wrong name.", "I fronted the costs 'pending reimbursement'. Reimbursement is scheduled for next quarter. Of next century."] }, fx: { money: -300, karma: 6, happy: 3, perf: 3 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Répondre « impossible »', en: 'Reply "impossible"' }, out: [
        { w: 1, text: { fr: ["J'ai écrit « Impossible avec ce budget » en gras. On m'a répondu « On compte sur ta proactivité 😊 ». J'ai imprimé le smiley et je l'ai jeté au broyeur.", "J'ai dit non. Ils ont confié la mission au stagiaire, qui a tout organisé avec {w:app}. Il a été embauché. Moi, j'ai eu un entretien de recadrage."], en: ["I wrote 'Impossible with this budget' in bold. They replied 'We're counting on your proactivity 😊'. I printed the smiley and shredded it.", "I said no. They gave it to the intern, who organised everything through {w:app}. He got hired. I got a 'realignment meeting'."] }, fx: { perf: -6, stress: -3 }, mood: 'angry' },
      ] },
    ],
  },
  {
    id: 'c3_admin_auto', icon: '🖇️', cat: 'job', rating: 0, auto: true,
    when: { job: 'admin', chance: 0.5 }, cooldown: 3,
    text: {
      fr: [
        "J'ai commandé 4 000 stylos au lieu de 40. Ils occupent toute une salle de réunion. Mon chef appelle ça « le Bunker ». On y fait désormais les entretiens annuels.",
        "J'ai mis à jour l'organigramme de la boîte. Personne ne s'est rendu compte que j'avais placé mon propre nom tout en haut. Ça fait trois mois. On me vouvoie.",
        "Cette année, j'ai envoyé 1 312 mails commençant par « Je me permets de vous relancer ». Je me suis surpris{|e} à relancer mon propre reflet dans le miroir.",
        "J'ai rangé les archives depuis 1987 et trouvé un dossier intitulé « NE PAS OUVRIR ». Dedans : la recette secrète du cake de la secrétaire de 1991. Je l'ai faite. Promotion morale.",
      ],
      en: [
        "I ordered 4,000 pens instead of 40. They fill an entire meeting room. My boss calls it 'the Bunker'. We now hold annual reviews in there.",
        "I updated the company org chart. Nobody noticed I put my own name at the very top. It's been three months. People call me 'sir'.",
        "This year I sent 1,312 emails starting with 'Just following up'. I caught myself following up on my own reflection in the mirror.",
        "I sorted the archives back to 1987 and found a folder labelled 'DO NOT OPEN'. Inside: the 1991 secretary's secret cake recipe. I baked it. Moral promotion.",
      ],
    },
    fx: { perf: 3, stress: 2 },
  },
  // ───────────────────────────── accountant ─────────────────────────────
  {
    id: 'c3_acc_shoebox', icon: '🧾', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'shock', prop: 'box' },
    when: { job: 'accountant' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Un client artisan pose une boîte à chaussures sur ton bureau : « Mes justificatifs de l'année. » Dedans : des tickets de caisse froissés, un ticket de PMU gagnant, et un reçu « Club Le Velours — frais de séminaire ».",
        "Ton client restaurateur veut déduire « en frais professionnels » une piscine, un jet-ski et une nuit au Crazy Horse « pour étudier l'éclairage ».",
        "Clôture annuelle. Un client t'envoie 400 photos floues de factures prises avec son pouce devant l'objectif. L'une d'elles est juste {w:animal} en gros plan.",
        "Un client t'explique, très sérieux, que sa maîtresse est « une consultante externe » et que ses virements mensuels sont « des honoraires de conseil en bien-être ».",
      ],
      en: [
        "A tradesman client puts a shoebox on your desk: 'My receipts for the year.' Inside: crumpled till slips, a winning horse-racing ticket, and a receipt from 'Club Velvet — seminar expenses'.",
        "Your restaurateur client wants to deduct 'as business expenses' a pool, a jet ski and a night at a cabaret 'to study the lighting'.",
        "Year-end close. A client sends you 400 blurry photos of invoices, each with his thumb over the lens. One of them is just {w:animal} in close-up.",
        "A client explains, deadpan, that his mistress is 'an external consultant' and that his monthly transfers are 'wellness consulting fees'.",
      ],
    },
    choices: [
      { label: { fr: 'Tout passer en charges', en: 'Expense it all' }, out: [
        { w: 2, text: { fr: ["J'ai tout classé en « frais de représentation ». Le client m'a offert une caisse de vin et une invitation au Club Le Velours. J'ai gardé le vin.", "Le jet-ski est devenu « véhicule de livraison nautique ». Mon client m'appelle « le magicien ». Mon ordre professionnel m'appellerait autrement."], en: ["I filed it all under 'entertainment'. The client gave me a case of wine and an invite to Club Velvet. I kept the wine.", "The jet ski became a 'marine delivery vehicle'. My client calls me 'the wizard'. My professional board would call me something else."] }, fx: { money: 400, perf: 6, karma: -6 }, mood: 'happy' },
        { w: 1, text: { fr: ["Contrôle fiscal. L'inspectrice a lu « Club Le Velours — séminaire » à voix haute, puis m'a regardé{|e} longtemps. Mon nom est sur le dossier. Je vais devoir m'expliquer devant un juge.", "Le fisc a tiqué sur la piscine « salle de réunion humide ». Le client a dit que c'était mon idée. C'était mon idée."], en: ["Tax audit. The inspector read 'Club Velvet — seminar' out loud, then stared at me for a long time. My name is on the file. I'll have to explain myself to a judge.", "The taxman frowned at the 'wet meeting room' pool. The client said it was my idea. It was my idea."] }, fx: { arrest: 'taxfraud', perf: -10 }, mood: 'shock' },
      ] },
      { label: { fr: 'Trier honnêtement', en: 'Sort it honestly' }, out: [
        { w: 1, text: { fr: ["Douze heures à défroisser des tickets au fer à repasser. Résultat : il doit 8 000 € au fisc. Il m'a traité{|e} de « fonctionnaire déguisé ». J'ai facturé le repassage.", "J'ai tout refusé sauf un stylo à 1,20 €. Le client a pleuré. Puis il a payé. Ma conscience est propre, mes yeux saignent."], en: ["Twelve hours ironing receipts flat. Result: he owes the IRS $8,000. He called me 'a civil servant in disguise'. I billed for the ironing.", "I rejected everything except a $1.20 pen. The client cried. Then he paid. My conscience is clean, my eyes are bleeding."] }, fx: { karma: 6, perf: 4, stress: 6, money: 150 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Rendre la boîte', en: 'Hand the box back' }, out: [
        { w: 1, text: { fr: ["J'ai rendu la boîte en disant : « Je ne suis pas archéologue. » Il est parti chez un concurrent. Mon associé a fait la tête toute la semaine.", "J'ai refusé le dossier. Une semaine plus tard, il m'a envoyé {w:gift} pour me faire changer d'avis. Ça a presque marché."], en: ["I handed the box back saying 'I'm not an archaeologist.' He went to a competitor. My partner sulked all week.", "I turned down the file. A week later he sent me {w:gift} to change my mind. It almost worked."] }, fx: { perf: -4, stress: -4 }, mood: 'neutral' },
      ] },
    ],
  },
  {
    id: 'c3_acc_cook', icon: '📊', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'neutral', prop: 'laptop' },
    when: { job: 'accountant' }, weight: 8, cooldown: 4,
    text: {
      fr: [
        "Ton directeur financier ferme la porte et baisse les stores. « Les chiffres du trimestre sont… tristes. Tu pourrais les rendre plus joyeux ? » Il te tend un tableur et une bouteille de whisky.",
        "Le patron veut que la boîte ait l'air rentable avant la levée de fonds. « Une perte de 2 millions, c'est juste un bénéfice qui s'ignore, non ? »",
        "On te demande de passer les vacances du PDG {w:far_place} en « mission de prospection ». Il y a des photos de lui en string sur un pédalo dans le dossier.",
        "Ton boss a « oublié » de déclarer 300 000 € de recettes en liquide. Il te propose de les « retrouver » l'année prochaine. Ou jamais. Plutôt jamais.",
      ],
      en: [
        "Your CFO shuts the door and lowers the blinds. 'This quarter's numbers are… sad. Could you make them happier?' He hands you a spreadsheet and a bottle of whisky.",
        "The boss wants the company to look profitable before the funding round. 'A $2 million loss is just a profit that doesn't know it yet, right?'",
        "You're asked to book the CEO's holiday {w:far_place} as a 'prospecting mission'. The file contains photos of him in a thong on a pedal boat.",
        "Your boss 'forgot' to declare $300,000 in cash takings. He suggests you 'find' them next year. Or never. Preferably never.",
      ],
    },
    choices: [
      { label: { fr: 'Maquiller les comptes', en: 'Cook the books' }, out: [
        { w: 1, text: { fr: ["Trois colonnes masquées, une provision imaginaire et un « produit exceptionnel » nommé Gérard. Le bilan est magnifique. Prime de {$amount}. Je dors mal.", "J'ai transformé la perte en « investissement stratégique dans l'avenir ». Le PDG m'a serré la main avec les deux mains. Je les ai lavées trois fois."], en: ["Three hidden columns, an imaginary provision and an 'exceptional income' named Gerald. The balance sheet is gorgeous. Bonus: {$amount}. I sleep badly.", "I turned the loss into a 'strategic investment in the future'. The CEO shook my hand with both hands. I washed mine three times."] }, fx: { money: 'amount', perf: 10, karma: -10, stress: 6, flag: 'c3_acc_cooked', schedule: { key: 'c3_acc_audit', years: 2 } }, mood: 'neutral' },
      ] },
      { label: { fr: 'Refuser poliment', en: 'Politely refuse' }, out: [
        { w: 1, text: { fr: ["J'ai dit non. Le directeur financier a soupiré, puis demandé au stagiaire. Le stagiaire a dit oui. Le stagiaire a maintenant une Audi.", "J'ai refusé en citant le Code de commerce, article par article. Il m'a regardé{|e} comme on regarde {w:animal} qui récite un poème. On m'a retiré les gros dossiers."], en: ["I said no. The CFO sighed and asked the intern. The intern said yes. The intern now drives an Audi.", "I refused, quoting the Commercial Code article by article. He looked at me like you'd look at {w:animal} reciting poetry. I lost the big accounts."] }, fx: { karma: 6, perf: -6 }, mood: 'proud' },
      ] },
      { label: { fr: 'Le dénoncer au fisc', en: 'Report him' }, out: [
        { w: 1, text: { fr: ["J'ai tout envoyé au fisc en anonyme. Perquisition un mardi matin. Le PDG est parti menotté, en peignoir. On m'a nommé{|e} responsable comptable par intérim.", "Lanceur d'alerte ! La boîte a coulé, mais j'ai fait la une du journal local avec la légende « Le héros du tableur »."], en: ["I sent everything to the tax office anonymously. Raid on a Tuesday morning. The CEO left in handcuffs and a bathrobe. I was made interim head of accounts.", "Whistleblower! The company went under, but I made the local front page captioned 'The Spreadsheet Hero'."] }, fx: { karma: 12, fame: 4, promote: true }, mood: 'proud' },
        { w: 1, text: { fr: ["Le fisc a mis 18 mois à réagir. Entre-temps, le patron a trouvé qui avait parlé. Je suis « en reconversion ».", "Le contrôleur fiscal était le beau-frère du patron. J'ai été viré{|e} pour « faute de goût »."], en: ["The tax office took 18 months to react. Meanwhile the boss figured out who talked. I'm 'between jobs'.", "The tax inspector was the boss's brother-in-law. I got fired for 'lack of taste'."] }, fx: { fired: true, karma: 8 }, mood: 'sad' },
      ] },
    ],
    vars: { amount: [2000, 8000] },
  },
  {
    id: 'c3_acc_audit', icon: '🔍', cat: 'job', rating: 1, chainOnly: true,
    scene: { place: 'office', mood: 'shock', fx: 'police' },
    when: { job: 'accountant', flag: 'c3_acc_cooked' },
    text: {
      fr: [
        "Deux auditeurs en costume gris débarquent sans prévenir. Ils demandent les comptes d'il y a deux ans. Ceux avec Gérard, le « produit exceptionnel ».",
        "Un mail du commissaire aux comptes : « Petite question sur une provision de 2 millions. Elle s'appelle Gérard ? » Tes mains deviennent moites.",
        "Contrôle surprise. L'auditeur sourit en ouvrant ton tableur. Il appuie sur « Afficher les colonnes masquées ». Ton cœur fait {w:sound}.",
        "La levée de fonds a raté, les investisseurs veulent comprendre. Ils ont engagé un expert-comptable légiste. Il a l'air de manger des comptables au petit-déjeuner.",
      ],
      en: [
        "Two auditors in grey suits arrive unannounced. They want the books from two years ago. The ones with Gerald, the 'exceptional income'.",
        "Email from the statutory auditor: 'Quick question about a $2 million provision. Is it called Gerald?' Your palms go sweaty.",
        "Surprise audit. The auditor smiles as he opens your spreadsheet. He clicks 'Unhide columns'. Your heart makes {w:sound}.",
        "The funding round flopped and investors want answers. They hired a forensic accountant. He looks like he eats accountants for breakfast.",
      ],
    },
    choices: [
      { label: { fr: 'Accuser le PDG', en: 'Blame the CEO' }, out: [
        { w: 2, text: { fr: ["J'ai sorti le mail « rends les chiffres plus joyeux ». Le PDG a pris pour tout. Moi, j'ai pris un avertissement et une nouvelle réputation de balance.", "J'ai joué l'exécutant{|e} terrorisé{|e}. Ça marche toujours. Le PDG est parti en garde à vue avec son golden retriever."], en: ["I produced the 'make the numbers happier' email. The CEO took the fall. I got a warning and a new reputation as a snitch.", "I played the terrified underling. Works every time. The CEO went into custody with his golden retriever."] }, fx: { perf: -6, karma: -2, unflag: 'c3_acc_cooked' }, mood: 'neutral' },
        { w: 1, text: { fr: ["Le PDG avait tout effacé. Il ne restait que mes formules, ma signature et Gérard. Les enquêteurs m'attendaient à la sortie.", "Le PDG a dit ne jamais avoir vu ce tableur. Il a un excellent avocat. J'ai un cousin qui a fait une année de droit."], en: ["The CEO had wiped everything. Only my formulas, my signature and Gerald remained. Investigators were waiting outside.", "The CEO said he'd never seen that spreadsheet. He has an excellent lawyer. I have a cousin who did one year of law school."] }, fx: { arrest: 'embezzle', fired: true, unflag: 'c3_acc_cooked' }, mood: 'shock' },
      ] },
      { label: { fr: 'Noyer le poisson', en: 'Bury them in jargon' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: ["Trois heures sur les normes IFRS, les amortissements dégressifs et la doctrine fiscale de 1974. L'auditeur s'est endormi. Il a signé pour pouvoir partir.", "J'ai parlé « retraitement des écarts d'acquisition » jusqu'à ce que ses yeux se vident. Il a écrit « RAS ». Gérard est sauvé."], en: ["Three hours on IFRS standards, declining depreciation and 1974 tax doctrine. The auditor fell asleep. He signed just to leave.", "I talked 'goodwill restatement' until his eyes went blank. He wrote 'Nothing to report'. Gerald lives."] }, fx: { perf: 8, stress: 8, unflag: 'c3_acc_cooked' }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["J'ai dit « amortissement » au lieu d'« amortissement dégressif » et il a souri. Ce sourire, c'était ma carrière qui partait. Licenciement pour faute grave.", "Mon jargon a tenu dix minutes. Puis il a demandé « Et Gérard ? ». J'ai répondu « Gérard qui ? ». Mauvaise réponse."], en: ["I said 'depreciation' instead of 'declining depreciation' and he smiled. That smile was my career leaving. Fired for gross misconduct.", "My jargon held for ten minutes. Then he asked 'And Gerald?'. I said 'Gerald who?'. Wrong answer."] }, fx: { fired: true, happy: -10, unflag: 'c3_acc_cooked' }, mood: 'cry' },
      ] },
    ],
  },
  // ───────────────────────────── marketing ─────────────────────────────
  {
    id: 'c3_mkt_slogan', icon: '💡', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'happy', prop: 'whiteboard' },
    when: { job: 'marketing' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Brainstorming « disruptif » pour un nouveau yaourt aux céréales. Ton chef a écrit au tableau : « Pas d'idée bête ! » Puis il a proposé « Le yaourt qui croque la vie ».",
        "Ton client, une marque de saucisses, veut « toucher la génération Z ». Il propose de faire danser une saucisse sur {w:song}. Tu dois trouver mieux. Ou pire.",
        "Le client veut un nom pour son nouveau parfum « audacieux et sensuel ». Il dégage {w:smell}. Ton équipe te regarde. Le client te regarde. Le parfum te regarde.",
        "Réunion créa. Le directeur marketing veut une campagne pour un déodorant « qui parle aux vrais gens ». Ses propositions : « Sentir, c'est vivre » et « Aisselle ta vie ».",
      ],
      en: [
        "'Disruptive' brainstorm for a new cereal yogurt. Your boss wrote on the whiteboard: 'No bad ideas!' Then suggested 'The yogurt that crunches life'.",
        "Your client, a sausage brand, wants to 'reach Gen Z'. He suggests a sausage dancing to {w:song}. You have to do better. Or worse.",
        "The client wants a name for his new 'bold and sensual' perfume. It gives off {w:smell}. Your team looks at you. The client looks at you. The perfume looks at you.",
        "Creative meeting. The marketing director wants a deodorant campaign 'that speaks to real people'. His ideas: 'To smell is to live' and 'Pit your life'.",
      ],
    },
    choices: [
      { label: { fr: 'Proposer un slogan osé', en: 'Pitch a risqué slogan' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai proposé « Avale la différence ». Silence gêné. Puis le client a hurlé « GÉNIAL ». Campagne nationale. Les ventes ont triplé. Les mamans ont écrit des lettres.", "« Croque-moi si tu peux. » Le client a rougi, puis signé. 12 millions de vues, trois plaintes de familles catholiques et une prime."], en: ["I pitched 'Swallow the difference'. Awkward silence. Then the client screamed 'GENIUS'. National campaign. Sales tripled. Mums wrote letters.", "'Bite me if you can.' The client blushed, then signed. 12 million views, three complaints from church groups and a bonus."] }, fx: { perf: 12, money: 800, followers: 300 }, mood: 'proud' },
        { w: 1, text: { fr: ["J'ai lu mon slogan à voix haute et j'ai réalisé en même temps que tout le monde qu'il avait un double sens très, très sexuel. Le client est parti. Mon chef a dit « Bon ».", "Le slogan a été validé, imprimé sur 4 000 abribus, puis retiré en 48 h. Je suis la raison pour laquelle il y a maintenant un comité de relecture."], en: ["I read my slogan out loud and realised at the same time as everyone else that it had a very, very sexual double meaning. The client left. My boss said 'Right.'", "The slogan got approved, printed on 4,000 bus shelters, then pulled within 48 hours. I'm why there's now a review committee."] }, fx: { perf: -10, happy: -4 }, mood: 'shock' },
      ] },
      { label: { fr: 'Voler l\'idée du stagiaire', en: 'Steal the intern\'s idea' }, out: [
        { w: 2, text: { fr: ["Le stagiaire avait chuchoté une idée brillante. Je l'ai répétée plus fort. On m'a applaudi{|e}. Il m'a regardé{|e} comme si j'avais écrasé {w:animal}. Je lui ai offert un café. Il ne l'a pas bu.", "J'ai présenté son idée comme la mienne, avec des slides. Promotion. Il est devenu mon assistant. Le karma prend son temps, mais il a mon adresse."], en: ["The intern whispered a brilliant idea. I repeated it louder. Applause. He looked at me like I'd run over {w:animal}. I bought him a coffee. He didn't drink it.", "I presented his idea as mine, with slides. Promotion. He became my assistant. Karma takes its time, but it has my address."] }, fx: { perf: 10, karma: -8 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Valider l\'idée du chef', en: 'Back the boss\'s idea' }, text: { fr: ["J'ai dit « Le yaourt qui croque la vie, c'est puissant ». Le chef m'a regardé{|e} avec amour. La campagne a fait un bide. Mais lui, il m'adore.", "J'ai applaudi l'idée nulle. Elle a été choisie. Elle a coulé. Mais ce n'était pas la mienne, et ça, en marketing, c'est une victoire."], en: ["I said 'The yogurt that crunches life is powerful.' The boss looked at me lovingly. The campaign flopped. But he adores me.", "I clapped for the bad idea. It got picked. It sank. But it wasn't mine, and in marketing, that's a win."] }, fx: { perf: 4, karma: -2 }, mood: 'neutral' },
    ],
  },
  {
    id: 'c3_mkt_viral', icon: '📈', cat: 'job', rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'phone' },
    when: { job: 'marketing' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Ta campagne pour une marque de lait est devenue virale. Problème : tout Internet a remarqué que la mascotte, une vache souriante, fait un geste obscène sous un certain angle.",
        "Ton nouveau logo pour une crèche municipale circule sur les réseaux avec 2 millions de partages. Ce n'est pas un compliment. Les gens zooment. Les gens voient des choses.",
        "Le hashtag de ta campagne, #MangeTesLégumes, a été détourné. Il sert maintenant à poster des photos très suggestives de courgettes. Ton client est un hôpital pour enfants.",
        "Ta pub de saucisses avec {w:celeb} a été doublée en version « remix » sur {w:app}. Ça fait 40 millions de vues. Personne ne parle de saucisses. Enfin si, mais pas comme ça.",
      ],
      en: [
        "Your milk-brand campaign went viral. Problem: the whole internet noticed the mascot, a smiling cow, makes an obscene gesture from a certain angle.",
        "Your new logo for a city daycare is going around social media with 2 million shares. Not as a compliment. People zoom in. People see things.",
        "Your campaign hashtag, #EatYourVeggies, got hijacked. It's now used for very suggestive zucchini photos. Your client is a children's hospital.",
        "Your sausage ad starring {w:celeb} got a 'remix' dub on {w:app}. 40 million views. Nobody's talking about sausages. Well, they are, but not like that.",
      ],
    },
    choices: [
      { label: { fr: 'Assumer : « c\'était voulu »', en: 'Own it: "totally on purpose"' }, out: [
        { w: 2, text: { fr: ["J'ai posté « Oui, c'était voulu 😏 ». Internet a adoré. La marque a vendu 3 millions de litres. Je suis passé{|e} dans un podcast qui s'appelle « Les Génies du Malaise ».", "J'ai lancé des mugs et des t-shirts avec la vache obscène. Rupture de stock en 2 heures. Mon chef a dit que j'étais « un{|e} visionnaire du chaos »."], en: ["I posted 'Yes, it was on purpose 😏'. The internet loved it. The brand sold 3 million litres. I went on a podcast called 'Geniuses of Cringe'.", "I launched mugs and t-shirts with the obscene cow. Sold out in 2 hours. My boss called me 'a chaos visionary'."] }, fx: { perf: 14, fame: 6, followers: 4000, promote: true }, mood: 'party' },
        { w: 1, text: { fr: ["Les ligues de vertu ont lancé un boycott. Le client m'a désigné{|e} publiquement comme « seul{|e} responsable ». Viré{|e}, mais avec 20 000 nouveaux abonnés qui me demandent des nudes de vache.", "Le maire a fait une conférence de presse. Il a prononcé mon nom trois fois, jamais en bien. J'ai été remercié{|e}."], en: ["Decency groups launched a boycott. The client publicly named me 'solely responsible'. Fired, but with 20,000 new followers asking for cow nudes.", "The mayor held a press conference. He said my name three times, never kindly. I was let go."] }, fx: { fired: true, followers: 20000, fame: 3 }, mood: 'shock' },
      ] },
      { label: { fr: 'Communiqué d\'excuses', en: 'Issue an apology' }, out: [
        { w: 1, text: { fr: ["Communiqué de 4 pages avec les mots « valeurs », « écoute » et « bienveillance ». Personne ne l'a lu. Le scandale est mort de lui-même au bout de 36 heures, remplacé par {w:disaster}.", "Je me suis excusé{|e} en vidéo, en col roulé beige, devant une plante. 2 000 commentaires « on s'en fout ». Ça a marché."], en: ["A 4-page statement with the words 'values', 'listening' and 'compassion'. Nobody read it. The scandal died on its own after 36 hours, replaced by {w:disaster}.", "I apologised on video, in a beige turtleneck, in front of a plant. 2,000 'who cares' comments. It worked."] }, fx: { perf: -2, stress: 6 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Accuser un hacker', en: 'Blame a hacker' }, out: [
        { w: 1, text: { fr: ["J'ai dit qu'on avait été piratés « par une puissance étrangère ». Un journaliste a retrouvé le fichier source avec mon nom dedans : « vache_zizi_FINAL_v3.psd ».", "« Piratage russe » : la direction a avalé. Le hacker imaginaire est devenu un mème. On lui a même donné un nom : Igor Crème-Fraîche."], en: ["I said we'd been hacked 'by a foreign power'. A journalist found the source file with my name on it: 'cow_willy_FINAL_v3.psd'.", "'Russian hackers': management bought it. The imaginary hacker became a meme. They even named him: Igor Sour-Cream."] }, fx: { perf: -8, karma: -4 }, mood: 'sad' },
      ] },
    ],
  },
  {
    id: 'c3_mkt_persona', icon: '🎯', cat: 'job', rating: 0, auto: true,
    when: { job: 'marketing', chance: 0.5 }, cooldown: 3,
    text: {
      fr: [
        "J'ai créé un « persona client » : Kévin, 34 ans, aime {w:hobby} et les promos. On a passé six mois à cibler Kévin. Kévin n'existe pas. Les ventes ont baissé de 12 %.",
        "J'ai passé l'année à dire « synergie », « levier » et « parcours client ». Mon cerveau ne produit plus de phrases normales. J'ai demandé à ma grand-mère de « challenger son repas ».",
        "Notre étude de marché a coûté 80 000 €. Conclusion : « Les gens aiment quand c'est moins cher. » J'ai fait une présentation de 60 slides pour le dire.",
        "J'ai organisé un focus group pour une nouvelle chips. Un participant a mangé tout le stock, un autre a pleuré, le troisième était {w:weird_job}. On a lancé le produit quand même.",
      ],
      en: [
        "I created a 'customer persona': Kevin, 34, loves {w:hobby} and discounts. We spent six months targeting Kevin. Kevin doesn't exist. Sales dropped 12%.",
        "I spent the year saying 'synergy', 'leverage' and 'customer journey'. My brain no longer makes normal sentences. I asked my grandma to 'challenge her lunch'.",
        "Our market study cost $80,000. Conclusion: 'People like it when it's cheaper.' I made a 60-slide deck to say so.",
        "I ran a focus group for a new crisp. One participant ate the whole stock, one cried, the third was {w:weird_job}. We launched anyway.",
      ],
    },
    fx: { perf: 3, smarts: -1 },
  },
  // ───────────────────────────── psychologist ─────────────────────────────
  {
    id: 'c3_psy_couple', icon: '🛋️', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'angry', prop: 'couch' },
    when: { job: 'psychologist' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Thérapie de couple. Elle lui reproche d'avoir appelé leur chien comme son ex. Il lui reproche d'avoir appelé leur fils comme son ex à elle. Ils se lancent les coussins de ton canapé.",
        "Séance de couple, minute 12 : Monsieur avoue qu'il préfère {w:activity} plutôt que de passer du temps avec Madame. Madame sort {w:object} de son sac. Elle le soupèse.",
        "Un couple vient « sauver leur mariage ». Ils se disputent depuis 40 minutes sur la bonne façon de charger un lave-vaisselle. Elle a apporté des schémas.",
        "Madame t'explique que son mari ronfle « comme {w:vehicle} qui démarre ». Monsieur réplique qu'elle parle en dormant. Uniquement du prénom de son coach de Pilates.",
      ],
      en: [
        "Couples therapy. She blames him for naming their dog after his ex. He blames her for naming their son after hers. They're throwing your sofa cushions at each other.",
        "Couples session, minute 12: he admits he'd rather be {w:activity} than spend time with her. She pulls {w:object} out of her bag. She weighs it in her hand.",
        "A couple comes to 'save their marriage'. They've been arguing for 40 minutes about the right way to load a dishwasher. She brought diagrams.",
        "She explains her husband snores 'like {w:vehicle} starting up'. He replies that she talks in her sleep. Only the name of her Pilates coach.",
      ],
    },
    choices: [
      { label: { fr: 'Exercice de communication', en: 'Communication exercise' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["Je leur ai fait dire « je ressens » au lieu de « t'es qu'un connard ». Ça a marché. Ils se sont embrassés. Ils m'ont envoyé un faire-part de renouvellement de vœux.", "Exercice du miroir : chacun répète ce que dit l'autre. Au bout de dix minutes, ils riaient. Au bout de vingt, ils pleuraient. Au bout de trente, ils m'ont payé un abonnement annuel."], en: ["I made them say 'I feel' instead of 'you're such an asshole'. It worked. They kissed. They sent me a vow-renewal invitation.", "Mirror exercise: each repeats what the other says. After ten minutes they were laughing. After twenty, crying. After thirty, they bought a yearly package."] }, fx: { perf: 10, money: 300, karma: 4, flag: 'c3_psy_couples' }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["L'exercice a dégénéré : « Je ressens que tu es un connard » reste une phrase valide, techniquement. Ils sont partis chacun de leur côté. Ils m'ont tous les deux mis une étoile.", "Ils se sont réconciliés… contre moi. « Vous ne nous comprenez pas ! » Ils ont claqué la porte main dans la main. Mission accomplie, d'une certaine manière."], en: ["The exercise went sideways: 'I feel that you're an asshole' is technically valid. They left separately. Both gave me one star.", "They reconciled… against me. 'You don't understand us!' They slammed the door hand in hand. Mission accomplished, sort of."] }, fx: { perf: -4, happy: -3, flag: 'c3_psy_couples' }, mood: 'sad' },
      ] },
      { label: { fr: 'Prendre parti', en: 'Take sides' }, out: [
        { w: 1, text: { fr: ["J'ai dit à Monsieur qu'il avait tort. Madame m'a fait un clin d'œil. Monsieur a déposé une plainte à l'ordre des psychologues pour « complicité conjugale ».", "J'ai donné raison à Madame sur le lave-vaisselle. Elle avait raison. Les couverts se rangent pointe en bas. Monsieur a fondu en larmes. Divorce en mars."], en: ["I told him he was wrong. She winked at me. He filed a complaint with the licensing board for 'marital complicity'.", "I sided with her on the dishwasher. She was right. Cutlery goes in point down. He burst into tears. Divorce in March."] }, fx: { perf: -6, karma: -2, stress: 4, flag: 'c3_psy_couples' }, mood: 'neutral' },
      ] },
      { label: { fr: 'Conseiller le divorce', en: 'Recommend divorce' }, rating: 2, out: [
        { w: 1, text: { fr: ["J'ai dit : « Franchement ? Divorcez. » Ils m'ont regardé{|e}, soulagés. Ils sont sortis en se tapant dans la main. Deux clients en moins, deux avis cinq étoiles.", "J'ai sorti le formulaire de divorce de mon tiroir. Elle a signé avant que j'aie fini la phrase. Lui a demandé si je faisais aussi des séances individuelles. Il m'a fait un clin d'œil gênant."], en: ["I said: 'Honestly? Get divorced.' They looked at me, relieved. They high-fived on the way out. Two fewer clients, two five-star reviews.", "I pulled divorce papers from my drawer. She signed before I finished the sentence. He asked if I also do one-on-one sessions. He gave me an uncomfortable wink."] }, fx: { happy: 6, perf: 2, karma: 2 }, mood: 'happy' },
      ] },
    ],
  },
  {
    id: 'c3_psy_crush', icon: '💘', cat: 'job', rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'couch' },
    when: { job: 'psychologist', age: [18, 120] }, weight: 8, cooldown: 4,
    text: {
      fr: [
        "Ton patient du [[mardi|jeudi|vendredi]] a « fait un transfert ». Il t'a apporté un portrait de toi à l'huile, nu{|e}, sur une licorne. Il veut ton avis « en tant que professionnel{|le} ».",
        "Une patiente te raconte ses rêves érotiques depuis trois séances. Dans tous, il y a toi, un bureau en chêne et {w:food}. Elle te demande ce que ça signifie.",
        "Ton patient a décidé que sa thérapie avançait mieux allongé « en tenue légère ». Il est arrivé en peignoir. Il a déjà retiré la ceinture.",
        "Un patient t'a écrit une chanson. Elle s'intitule « Mon divan, ton divan ». Il te la chante, à genoux, avec un ukulélé. Le refrain rime avec « libido ».",
      ],
      en: [
        "Your [[Tuesday|Thursday|Friday]] patient 'transferred'. He brought you an oil portrait of yourself, naked, on a unicorn. He wants your opinion 'as a professional'.",
        "For three sessions a patient has been describing her erotic dreams. In all of them: you, an oak desk and {w:food}. She asks what it means.",
        "Your patient decided his therapy works better lying down 'in light clothing'. He showed up in a bathrobe. He's already untied the belt.",
        "A patient wrote you a song. It's called 'My Couch, Your Couch'. He sings it on his knees with a ukulele. The chorus rhymes with 'libido'.",
      ],
    },
    choices: [
      { label: { fr: 'Rester professionnel{|le}', en: 'Stay professional' }, out: [
        { w: 2, text: { fr: ["J'ai dit : « Intéressant. Parlons de votre mère. » Ça calme tout le monde, toujours. Il a remis la ceinture du peignoir et pleuré pendant 50 minutes. Facturé.", "J'ai analysé le portrait avec un sérieux absolu : « La licorne représente votre peur de l'engagement. » Il a hoché la tête. J'ai rangé le tableau au grenier, face au mur."], en: ["I said: 'Interesting. Let's talk about your mother.' Calms everyone down, every time. He retied the robe and cried for 50 minutes. Billed.", "I analysed the portrait with total seriousness: 'The unicorn represents your fear of commitment.' He nodded. I stored the painting in the attic, facing the wall."] }, fx: { perf: 8, money: 90 }, mood: 'neutral' },
        { w: 1, text: { fr: ["Il n'a pas aimé le recadrage. Il a posté le portrait sur {w:app} avec mon nom et l'adresse du cabinet. J'ai maintenant des patients qui viennent « pour la licorne ».", "Elle s'est vexée et m'a dénoncé{|e} pour « manque d'empathie onirique ». L'ordre m'a convoqué{|e}. Ils ont ri. Pas moi."], en: ["He didn't take the boundary well. He posted the portrait on {w:app} with my name and the office address. Now I get patients who come 'for the unicorn'.", "She took offence and reported me for 'lack of dream empathy'. The board summoned me. They laughed. I didn't."] }, fx: { fame: 3, stress: 8, followers: 800 }, mood: 'shock' },
      ] },
      { label: { fr: 'Franchir la ligne', en: 'Cross the line' }, out: [
        { w: 1, text: { fr: ["Disons que la séance a duré plus longtemps que 50 minutes et que le divan a vu des choses. Trois mois plus tard, l'ordre des psychologues m'a radié{|e}. Le divan, lui, a été brûlé.", "J'ai cédé. C'était fougueux, le bureau en chêne a craqué, et le patient d'après attendait en salle d'attente avec des écouteurs pas assez bons. Plainte. Licenciement."], en: ["Let's say the session ran longer than 50 minutes and the couch saw things. Three months later I was struck off. The couch was burned.", "I gave in. It was passionate, the oak desk cracked, and the next patient was in the waiting room with headphones that weren't good enough. Complaint. Fired."] }, fx: { fired: true, happy: 6, karma: -10 }, mood: 'love' },
      ] },
      { label: { fr: 'L\'adresser à un confrère', en: 'Refer to a colleague' }, text: { fr: ["Je l'ai orienté vers mon confrère Gilbert, 72 ans, poilu, qui sent la pipe. Le transfert a disparu en une séance. Gilbert m'envoie des remerciements ironiques.", "Je l'ai transféré à une collègue. Une semaine plus tard, elle avait le même portrait, version elle. Il recycle."], en: ["I referred him to my colleague Gilbert, 72, hairy, smells of pipe. The transference vanished in one session. Gilbert sends me sarcastic thank-yous.", "I transferred him to a colleague. A week later she had the same portrait, her version. He recycles."] }, fx: { perf: 2, money: -90 }, mood: 'neutral' },
    ],
  },
  {
    id: 'c3_psy_burnout', icon: '🧠', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'sleepy', prop: 'couch' },
    when: { job: 'psychologist', flag: 'c3_psy_couples' }, weight: 8, cooldown: 4,
    text: {
      fr: [
        "[[Huit|Neuf|Douze]] patients aujourd'hui. Le septième t'a parlé de son chat pendant 50 minutes. Le huitième aussi. Ce n'était pas le même chat. Tu viens de t'endormir pendant qu'il pleurait.",
        "Tu te surprends à répondre « Et qu'est-ce que ça vous fait ? » à la boulangère qui t'annonce le prix d'une baguette. Elle a l'air troublée. Toi aussi.",
        "Ta superviseure te dit que tu montres des signes d'épuisement. Tu lui demandes « Et qu'est-ce que ça vous fait de me dire ça ? ». Elle soupire.",
        "Un patient arrive en retard, s'assoit et dit « Je crois que c'est vous qui avez besoin d'aide ». Il a raison. Tu as {w:food} à moitié mangé sur ta chemise depuis ce matin.",
      ],
      en: [
        "[[Eight|Nine|Twelve]] patients today. The seventh talked about his cat for 50 minutes. So did the eighth. Not the same cat. You just fell asleep while he was crying.",
        "You catch yourself answering 'And how does that make you feel?' to the baker telling you the price of a baguette. She looks troubled. So do you.",
        "Your supervisor says you're showing signs of burnout. You ask her 'And how does it feel to tell me that?'. She sighs.",
        "A patient arrives late, sits down and says 'I think you're the one who needs help.' He's right. There's half of {w:food} on your shirt since this morning.",
      ],
    },
    choices: [
      { label: { fr: 'Voir un psy moi-même', en: 'See a therapist myself' }, out: [
        { w: 2, text: { fr: ["Ma psy m'a écouté{|e} 50 minutes. Puis elle m'a dit « Et qu'est-ce que ça vous fait ? ». J'ai compris ce que vivaient mes patients. J'ai pleuré. Ça fait du bien.", "Je suis allé{|e} voir un confrère. C'était mon ancien patient, reconverti. Il m'a très bien soigné{|e}. Je lui ai fait un prix, il ne m'en a pas fait."], en: ["My therapist listened for 50 minutes. Then she said 'And how does that make you feel?'. I finally understood my patients. I cried. It helped.", "I went to see a colleague. It was my former patient, who'd retrained. He treated me very well. I gave him a discount back in the day; he didn't return the favour."] }, fx: { stress: -12, happy: 6, money: -200 }, mood: 'happy' },
      ] },
      { label: { fr: 'Augmenter mes tarifs', en: 'Raise my rates' }, out: [
        { w: 1, text: { fr: ["J'ai doublé mes tarifs. J'ai perdu la moitié des patients et gagné autant d'argent. Les riches, eux, adorent payer cher pour parler de leur chat.", "Nouveau tarif : 150 € la séance, 200 € si on parle du chat. Mes revenus ont explosé. Mon empathie, elle, a fait ses valises."], en: ["I doubled my rates. Lost half my patients, made the same money. Rich people love paying a lot to talk about their cat.", "New rate: $150 a session, $200 if we discuss the cat. My income exploded. My empathy packed its bags."] }, fx: { money: 1500, stress: -4, karma: -3 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Continuer comme ça', en: 'Keep going' }, out: [
        { w: 1, text: { fr: ["J'ai continué. Un jour, j'ai répondu à un patient en citant {w:show}. Il a trouvé ça profond. Moi, j'ai trouvé un cheveu blanc par séance.", "J'ai tenu. Mon corps a moins tenu : migraine de trois semaines et tic à l'œil gauche. Mes patients pensent que je leur fais des clins d'œil."], en: ["I kept going. One day I answered a patient by quoting {w:show}. He found it profound. I found one grey hair per session.", "I held on. My body held on less: three-week migraine and a twitch in my left eye. My patients think I'm winking at them."] }, fx: { stress: 10, health: -4, perf: -3, disease: 'migraine' }, mood: 'sick' },
      ] },
    ],
  },
  // ───────────────────────────── scientist ─────────────────────────────
  {
    id: 'c3_sci_grant', icon: '🔬', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'neutral', prop: 'laptop' },
    when: { job: 'scientist' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Dossier de financement à rendre ce soir. Ton sujet : la vie sexuelle des escargots de Bourgogne. Le comité ne finance que les projets avec « IA », « quantique » ou « transition écologique » dans le titre.",
        "Ton labo n'a plus de budget. Il reste trois pipettes, un microscope de 1994 et un stagiaire non payé. Il faut convaincre l'agence de financement que ta recherche va « changer le monde ».",
        "Appel à projets européen : 140 pages de formulaire, une case « impact sociétal » et une limite de 12 caractères pour décrire 15 ans de recherche sur {w:animal}.",
        "Ton directeur de labo te confie la demande de subvention « parce que tu écris bien ». Traduction : il part à un colloque {w:far_place} et te laisse le formulaire de 90 pages.",
      ],
      en: [
        "Grant application due tonight. Your topic: the sex life of Burgundy snails. The committee only funds projects with 'AI', 'quantum' or 'green transition' in the title.",
        "Your lab is out of money. Left: three pipettes, a 1994 microscope and an unpaid intern. You must convince the funding agency your research will 'change the world'.",
        "European call for proposals: 140 pages of forms, a 'societal impact' box and a 12-character limit to describe 15 years of research on {w:animal}.",
        "Your lab director hands you the grant proposal 'because you write well'. Translation: he's off to a conference {w:far_place} and leaving you the 90-page form.",
      ],
    },
    choices: [
      { label: { fr: 'Saupoudrer de buzzwords', en: 'Sprinkle buzzwords' }, out: [
        { w: 2, text: { fr: ["Nouveau titre : « Escargots quantiques : une IA bio-inspirée pour la transition écologique ». Financé à 100 %. Je ne sais pas ce que j'ai promis. Il faudra le découvrir.", "J'ai écrit « blockchain » quatre fois et « résilience » onze fois. Le comité a pleuré d'émotion. On a obtenu {$amount}. Le stagiaire va enfin avoir une chaise."], en: ["New title: 'Quantum snails: a bio-inspired AI for the green transition'. Fully funded. I don't know what I promised. We'll find out.", "I wrote 'blockchain' four times and 'resilience' eleven times. The committee wept with emotion. We got {$amount}. The intern finally gets a chair."] }, fx: { money: 'amount', perf: 10, karma: -2, schedule: { key: 'c3_sci_review', years: 1 } }, mood: 'proud' },
        { w: 1, text: { fr: ["Le rapporteur a écrit : « Le candidat semble confondre intelligence artificielle et escargot. » Il n'a pas tort. Rejeté. Je vais financer ma recherche avec un vide-grenier.", "Refusé. Le projet financé à notre place : « Une IA quantique pour optimiser les vacances des élus ». Je vais boire du formol."], en: ["The reviewer wrote: 'The applicant appears to confuse artificial intelligence with a snail.' Fair. Rejected. I'll fund my research with a garage sale.", "Rejected. The project funded instead: 'A quantum AI to optimise politicians' holidays'. I'm going to drink formaldehyde."] }, fx: { perf: -6, happy: -6 }, mood: 'sad' },
      ] },
      { label: { fr: 'Rester honnête', en: 'Stay honest' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai décrit mes escargots avec passion et sans mensonge. Un membre du comité, fan secret de gastéropodes, a tout financé. Il m'écrit depuis des lettres bizarres.", "Dossier sincère, précis, beau. Il a été financé « pour l'originalité ». La science existe encore. Un peu. Le mardi."], en: ["I described my snails passionately and truthfully. A committee member, a secret gastropod fan, funded everything. He's been sending me weird letters since.", "Sincere, precise, beautiful proposal. Funded 'for originality'. Science still exists. A bit. On Tuesdays."] }, fx: { perf: 8, karma: 4, money: 'amount', schedule: { key: 'c3_sci_review', years: 1 } }, mood: 'proud' },
        { w: 2, odds: { smarts: -1 }, text: { fr: ["Rejeté avec la mention « manque d'ambition ». J'ai encadré la lettre à côté des 11 précédentes. Ça fait une jolie frise.", "Mon dossier honnête a été classé 214e sur 215. Le 215e avait envoyé un dessin d'enfant."], en: ["Rejected for 'lack of ambition'. I framed the letter next to the previous eleven. Makes a nice frieze.", "My honest proposal ranked 214th out of 215. Number 215 had submitted a child's drawing."] }, fx: { perf: -3, happy: -4 }, mood: 'sad' },
      ] },
    ],
    vars: { amount: [3000, 12000] },
  },
  {
    id: 'c3_sci_review', icon: '📄', cat: 'job', rating: 0, chainOnly: true,
    scene: { place: 'office', mood: 'angry', prop: 'laptop' },
    when: { job: 'scientist' },
    text: {
      fr: [
        "Ton article, fruit d'un an de travail grâce à la subvention, revient de relecture. Le Relecteur 2 a écrit 14 pages. La première phrase : « Je ne vois pas l'intérêt. »",
        "Réponse du journal scientifique. Relecteur 1 : « Excellent. » Relecteur 3 : « Bien. » Relecteur 2 : « L'auteur devrait envisager une carrière dans la restauration. »",
        "Le Relecteur 2 exige que tu cites onze articles. Les onze ont le même auteur. Un certain Pr Gontran, qui, par pure coïncidence, est le Relecteur 2.",
        "Ton article est refusé. Motif du Relecteur 2 : « Les résultats contredisent mon propre article de 1998. » Il ne précise pas que son article de 1998 était faux.",
      ],
      en: [
        "Your paper, a year of grant-funded work, is back from review. Reviewer 2 wrote 14 pages. First sentence: 'I fail to see the point.'",
        "Journal decision. Reviewer 1: 'Excellent.' Reviewer 3: 'Good.' Reviewer 2: 'The author should consider a career in catering.'",
        "Reviewer 2 demands you cite eleven papers. All eleven have the same author. A certain Prof. Gontran, who, by pure coincidence, is Reviewer 2.",
        "Paper rejected. Reviewer 2's reason: 'The results contradict my own 1998 paper.' He doesn't mention his 1998 paper was wrong.",
      ],
    },
    choices: [
      { label: { fr: 'Citer ses onze articles', en: 'Cite all eleven' }, out: [
        { w: 1, text: { fr: ["J'ai cité ses onze articles, même celui sur la météo martienne. Accepté en 48 h. La science, c'est un réseau. Un réseau de pyramides.", "J'ai ajouté ses onze références et un remerciement « pour ses précieux conseils ». Publié. Il m'a invité{|e} à un colloque. J'ai la nausée."], en: ["I cited all eleven, even the one about Martian weather. Accepted in 48 hours. Science is a network. A pyramid network.", "I added all eleven references and a thank-you 'for his invaluable advice'. Published. He invited me to a conference. I feel sick."] }, fx: { perf: 10, karma: -3, smarts: 2 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Réponse cinglante', en: 'Write a scathing reply' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: ["Ma réponse de 22 pages, sourcée, implacable, a convaincu l'éditeur. Article publié en couverture. Le Pr Gontran a fait une crise d'urticaire en public.", "J'ai démonté ses critiques point par point. L'éditeur a viré le Relecteur 2 de son comité. On m'appelle désormais « la Terreur de la relecture »."], en: ["My 22-page, sourced, merciless reply won over the editor. Cover article. Prof. Gontran broke out in hives in public.", "I took his critique apart point by point. The editor kicked Reviewer 2 off the board. They now call me 'the Peer Review Terror'."] }, fx: { perf: 14, fame: 3, happy: 8, promote: true }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["J'ai écrit « Avec tout le respect que je vous dois, allez vous faire voir ». Mon directeur de labo a été mis en copie. Rejet définitif et réunion très gênante.", "Ma réponse avait une faute dans le titre. Le Relecteur 2 l'a soulignée trois fois. Il a gagné."], en: ["I wrote 'With all due respect, go to hell.' My lab director was cc'd. Final rejection and a very awkward meeting.", "My reply had a typo in the title. Reviewer 2 underlined it three times. He won."] }, fx: { perf: -10, stress: 6 }, mood: 'angry' },
      ] },
    ],
  },
  {
    id: 'c3_sci_mouse', icon: '🐁', cat: 'job', rating: 2,
    scene: { place: 'office', mood: 'shock', fx: 'gore' },
    when: { job: 'scientist' }, weight: 7, cooldown: 5,
    text: {
      fr: [
        "La souris de laboratoire n°47, nourrie au sérum expérimental, pèse maintenant [[6|8|11]] kilos, a cassé sa cage et vient de manger le doigt d'un post-doc. Elle te regarde. Elle a faim.",
        "Ton expérience de croissance musculaire a un peu trop bien marché. La souris n°47 fait des tractions sur la grille de la cage, et le post-doc Kevin est en train de perdre un doigt.",
        "3 h du matin au labo. Tu entends {w:sound} dans l'animalerie. La souris n°47 a ouvert toutes les cages et organise ses congénères. Il y a un cadavre de stagiaire dans le couloir. Bon, il dort. Probablement.",
        "Ton sérum devait guérir la calvitie. La souris n°47 a maintenant une crinière de lion, des yeux rouges et elle traîne l'oreille arrachée du technicien comme un trophée.",
      ],
      en: [
        "Lab mouse no. 47, fed the experimental serum, now weighs [[13|18|24]] pounds, broke out of its cage and just ate a postdoc's finger. It's looking at you. It's hungry.",
        "Your muscle-growth experiment worked a bit too well. Mouse no. 47 is doing pull-ups on the cage bars, and Kevin the postdoc is losing a finger.",
        "3 a.m. at the lab. You hear {w:sound} from the animal room. Mouse no. 47 has opened every cage and is organising the others. There's an intern's body in the hallway. Well, he's asleep. Probably.",
        "Your serum was supposed to cure baldness. Mouse no. 47 now has a lion's mane, red eyes, and drags the technician's torn-off ear around like a trophy.",
      ],
    },
    choices: [
      { label: { fr: 'La capturer', en: 'Catch it' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: ["Plongeon avec une poubelle retournée. Je l'ai eue. Elle m'a mordu la fesse au passage, le sang a giclé jusqu'au plafond, mais l'échantillon est sauf. Publication assurée.", "Je l'ai attirée avec du fromage et un tutoriel de musculation. Piégée. Kevin a retrouvé son doigt dans la litière. On l'a recousu. Il pointe un peu de travers maintenant."], en: ["I dove with an upturned trash can. Got her. She bit my butt on the way, blood sprayed to the ceiling, but the sample is safe. Paper guaranteed.", "I lured her with cheese and a workout video. Trapped. Kevin found his finger in the bedding. We sewed it back on. It points a bit crooked now."] }, fx: { perf: 10, health: -6, visual: 'gore' }, mood: 'proud' },
        { w: 1, odds: { athletic: -1 }, text: { fr: ["Elle a esquivé, grimpé sur mon dos et m'a arraché un lobe d'oreille. J'ai couru dans le couloir en hurlant, elle chevauchait ma tête comme dans {w:movie}. Arrêt maladie de deux mois.", "Je l'ai ratée. Elle a ouvert la porte coupe-feu toute seule. On la voit parfois sur les caméras du parking, avec d'autres. Ils grandissent."], en: ["She dodged, climbed my back and ripped off an earlobe. I ran down the hall screaming with her riding my head like in {w:movie}. Two months' sick leave.", "I missed. She opened the fire door herself. We sometimes see her on the car park cameras, with others. They're growing."] }, fx: { health: -12, perf: -8, visual: 'gore' }, mood: 'shock' },
        { w: 0.2, text: { fr: ["Elle m'a sauté à la gorge. C'est un rongeur, alors elle a rongé. Les pompiers ont retrouvé une souris de 6 kilos endormie sur mon torse, repue, l'air serein.", "Elle m'a acculé{|e} contre l'autoclave. On a retrouvé mes lunettes, ma blouse et la souris, qui avait l'air d'avoir pris un kilo."], en: ["She went for my throat. She's a rodent, so she gnawed. Firefighters found a 13-pound mouse asleep on my chest, full, looking serene.", "She cornered me against the autoclave. They found my glasses, my lab coat, and the mouse, who seemed to have gained two pounds."] }, fx: { die: { fr: 'dévoré{|e} par une souris de laboratoire de 6 kilos', en: 'eaten by a 13-pound lab mouse' }, visual: 'gore' }, mood: 'shock' },
      ] },
      { label: { fr: 'Publier tout de suite', en: 'Publish right now' }, out: [
        { w: 1, text: { fr: ["J'ai filmé la souris pendant qu'elle dévorait le doigt, puis j'ai tout publié. « Mutant Mouse » est devenue une star d'Internet. Le comité d'éthique, beaucoup moins fan, m'a suspendu{|e}.", "Article express, vidéo virale, 2 millions de vues sur {w:app}. Les gens adorent la souris. Moi, on me déteste un peu. Kevin surtout."], en: ["I filmed the mouse eating the finger, then published everything. 'Mutant Mouse' became an internet star. The ethics board, less of a fan, suspended me.", "Rush paper, viral video, 2 million views on {w:app}. People love the mouse. They hate me a bit. Kevin especially."] }, fx: { fame: 6, followers: 6000, perf: -6, karma: -4 }, mood: 'shock' },
      ] },
      { label: { fr: 'Fuir et nier', en: 'Run and deny' }, text: { fr: ["J'ai fermé la porte à clé, effacé les registres et dit à la direction que la souris n°47 « n'avait jamais existé ». Kevin, lui, a gardé un doigt en moins comme preuve.", "J'ai démissionné le soir même et changé de ville. Un an plus tard, j'ai lu dans le journal : « Mystérieuse disparition de pigeons autour d'un laboratoire. » Ce n'est pas mon problème."], en: ["I locked the door, wiped the logs and told management mouse no. 47 'never existed'. Kevin kept one finger fewer as evidence.", "I quit that night and moved cities. A year later I read in the paper: 'Mysterious pigeon disappearances around a laboratory.' Not my problem."] }, fx: { quitJob: true, karma: -6, stress: 6 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── babysitter ─────────────────────────────
  {
    id: 'c3_baby_hostage', icon: '🍼', cat: 'job', rating: 0,
    scene: { place: 'home', mood: 'shock', prop: 'toy' },
    when: { job: 'babysitter' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Les jumeaux Dupuis, 7 ans, t'ont proposé de jouer « à la prison ». Tu es maintenant attaché{|e} à une chaise avec du scotch et des cordes à sauter. Ils regardent {w:show} en mangeant ton dîner.",
        "Tu t'es endormi{|e} 3 minutes sur le canapé. À ton réveil : ton visage est maquillé au feutre indélébile, le chat est rasé, et Léonie, 6 ans, est en train de commander {w:food} sur le téléphone de sa mère.",
        "Les enfants que tu gardes ont fermé la porte de la salle de bain à clé de l'intérieur. Avec toi dedans. Derrière la porte, tu entends « On va faire un gâteau ! » et un bruit de four qui s'allume.",
        "Mathis, 8 ans, t'annonce calmement qu'il a caché {w:object} « quelque part dans la maison » et qu'il dira où « si tu nous laisses veiller jusqu'à minuit ». Les parents rentrent à 23 h.",
      ],
      en: [
        "The Dupuis twins, 7, suggested playing 'prison'. You're now tied to a chair with tape and jump ropes. They're watching {w:show} and eating your dinner.",
        "You dozed off for 3 minutes on the sofa. You wake up to: your face drawn on with permanent marker, the cat shaved, and Leonie, 6, ordering {w:food} on her mum's phone.",
        "The kids you're babysitting locked the bathroom door from the outside. With you inside. Through the door you hear 'We're making a cake!' and the oven switching on.",
        "Mathis, 8, calmly announces he's hidden {w:object} 'somewhere in the house' and will reveal where 'if you let us stay up till midnight'. The parents get home at 11.",
      ],
    },
    choices: [
      { label: { fr: 'Négocier', en: 'Negotiate' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["Je leur ai promis un tour de magie s'ils me libéraient. Ils l'ont fait. Le tour, c'était de les mettre au lit. Ils n'ont rien vu venir. Parents ravis, gros pourboire.", "J'ai négocié comme dans un film d'otages : un épisode de dessin animé contre ma libération et un câlin contre le code du Wi-Fi. Tout le monde a gagné. Surtout moi."], en: ["I promised them a magic trick if they freed me. They did. The trick was putting them to bed. They never saw it coming. Delighted parents, big tip.", "I negotiated like a hostage movie: one cartoon episode for my release, one hug for the Wi-Fi code. Everyone won. Mostly me."] }, fx: { money: 30, perf: 6, happy: 4 }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["Ils ont refusé toutes mes offres et exigé « des bonbons et la liberté ». Les parents m'ont trouvé{|e} ligoté{|e}, maquillé{|e} en clown, en train de pleurer. Ils m'ont payé{|e} quand même, par pitié.", "La négociation a échoué. Ils ont joué à « l'interrogatoire » en me chatouillant les pieds pendant une heure. J'ai tout avoué. Même des choses vraies."], en: ["They refused all offers and demanded 'candy and freedom'. The parents found me tied up, clown makeup on, crying. They paid me anyway, out of pity.", "Negotiation failed. They played 'interrogation' by tickling my feet for an hour. I confessed everything. Even true things."] }, fx: { happy: -6, perf: -4, money: 15 }, mood: 'cry' },
      ] },
      { label: { fr: 'Appeler les parents', en: 'Call the parents' }, out: [
        { w: 1, text: { fr: ["J'ai appelé la mère, qui était au restaurant. Elle a soupiré : « Encore ? » Les enfants ont été privés de tablette. Moi, j'ai été privé{|e} de la soirée suivante.", "Le père a décroché, bourré, et a ri pendant deux minutes. Puis il a dit « Démerde-toi, champion{|ne} ». J'ai fini par sortir par la fenêtre."], en: ["I called the mum, who was at a restaurant. She sighed: 'Again?' The kids lost their tablets. I lost the next gig.", "The dad picked up, drunk, and laughed for two minutes. Then said 'Figure it out, champ.' I ended up climbing out the window."] }, fx: { perf: -4, stress: 4 }, mood: 'sad' },
      ] },
    ],
  },
  {
    id: 'c3_baby_diaper', icon: '💩', cat: 'job', rating: 2,
    scene: { place: 'home', mood: 'sick', fx: 'poop' },
    when: { job: 'babysitter' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Le bébé que tu gardes vient de produire un bruit que tu n'avais entendu que dans des documentaires sur les volcans. Le body jaune est maintenant marron. Jusqu'à la nuque.",
        "Changement de couche. Tu ouvres. Ce n'est pas une couche, c'est une scène de crime. Ça dégage {w:smell} puissance mille. Le bébé rit. Le bébé sait.",
        "Le bébé a mangé de la purée de betterave, des épinards et, visiblement, {w:object}. Tu viens d'enlever la couche et il recommence. En jet. Dans ta direction.",
        "La mère t'avait prévenu{|e} : « Il est un peu constipé depuis trois jours. » Ce soir, la digue a cédé. Sur le canapé blanc. Pendant que tu le tenais en l'air comme le Roi Lion.",
      ],
      en: [
        "The baby you're watching just made a sound you'd only heard in volcano documentaries. The yellow onesie is now brown. Up to the neck.",
        "Diaper change. You open it. It's not a diaper, it's a crime scene. It gives off {w:smell} times a thousand. The baby laughs. The baby knows.",
        "The baby ate beet purée, spinach and, apparently, {w:object}. You just took the diaper off and he starts again. In a jet. Aimed at you.",
        "The mum had warned you: 'He's been a bit constipated for three days.' Tonight the dam broke. On the white sofa. While you held him up like the Lion King.",
      ],
    },
    choices: [
      { label: { fr: 'Affronter la bête', en: 'Face the beast' }, out: [
        { w: 2, text: { fr: ["Gants de cuisine, pince à linge sur le nez, trois paquets de lingettes. J'ai vaincu. Le bébé sent la rose. Moi, je sens la mort. J'ai jeté mon t-shirt dans le jardin du voisin.", "Vingt minutes de combat. J'en avais sur les coudes, dans les cheveux, et une petite trace sur la lèvre que je préfère oublier. Les parents m'ont donné un bonus « courage »."], en: ["Oven mitts, clothes peg on the nose, three packs of wipes. I won. The baby smells like roses. I smell like death. I threw my t-shirt into the neighbour's garden.", "Twenty minutes of battle. I had it on my elbows, in my hair, and a little smudge on my lip I'd rather forget. The parents gave me a 'bravery' bonus."] }, fx: { money: 40, perf: 6, happy: -6, visual: 'poop' }, mood: 'sick' },
        { w: 1, text: { fr: ["J'ai glissé dans la flaque, je suis tombé{|e} sur le dos et le bébé m'a fini en plein visage. J'ai vomi. Le bébé aussi, par solidarité. Les parents sont rentrés pile à ce moment-là.", "Le bébé s'est tortillé et a repeint le mur, le chat et l'écran de télé. Il y a de la merde sur la télé. Les parents ont dû la changer. Ils m'ont envoyé la facture."], en: ["I slipped in the puddle, fell on my back, and the baby finished me off right in the face. I threw up. So did the baby, in solidarity. The parents walked in right then.", "The baby squirmed and repainted the wall, the cat and the TV screen. There's poop on the TV. They had to replace it. They sent me the bill."] }, fx: { money: -200, happy: -10, health: -2, visual: 'poop' }, mood: 'sick' },
      ] },
      { label: { fr: 'Le passer au jet', en: 'Hose him down' }, text: { fr: ["Je l'ai emmené dans la douche et j'ai tout rincé, moi compris{|e}, tout habillé{|e}. Efficace, rapide, mais la mère a trouvé ça « un peu Guantanamo ». Plus jamais rappelé{|e}.", "Douche tiède, savon, pyjama propre. Ça a pris deux minutes. Le canapé, par contre, il faudra le brûler. J'ai mis un plaid dessus et je suis parti{|e} vite."], en: ["I took him to the shower and rinsed everything, including me, fully dressed. Fast, efficient, but the mum found it 'a bit Guantanamo'. Never called back.", "Lukewarm shower, soap, clean PJs. Took two minutes. The sofa, though, will need burning. I threw a blanket over it and left quickly."] }, fx: { perf: -2, happy: -2 }, mood: 'neutral' },
    ],
  },
  {
    id: 'c3_baby_parents', icon: '🍷', cat: 'job', rating: 1,
    scene: { place: 'home', mood: 'shock' },
    when: { job: 'babysitter' }, weight: 8, cooldown: 4,
    text: {
      fr: [
        "Les parents devaient rentrer à 22 h. Il est 2 h 40. Ils entrent en chantant {w:song}, la mère porte un cône de chantier sur la tête. Le père cherche ses clés de voiture « pour te raccompagner ».",
        "3 h du matin. Le père rentre seul, la cravate autour du front, et t'explique pendant 40 minutes pourquoi il aurait dû épouser son amour de lycée. Il te paie avec un ticket de PMU.",
        "Les parents rentrent tellement ivres qu'ils te prennent pour leur fille aînée et te demandent pourquoi tu n'as « jamais appelé ». Ils n'ont pas de fille aînée.",
        "La mère rentre seule, maquillage coulé, avec un kebab dans une main et une bouteille de rosé dans l'autre. « Tu veux que je te ramène ? » Elle tient à peine debout.",
      ],
      en: [
        "The parents were due back at 10. It's 2:40. They stumble in singing {w:song}, the mum wearing a traffic cone on her head. The dad looks for his car keys 'to drive you home'.",
        "3 a.m. The dad comes home alone, tie around his forehead, and spends 40 minutes explaining why he should've married his high-school sweetheart. He pays you with a betting slip.",
        "The parents come home so drunk they think you're their eldest daughter and ask why you 'never call'. They don't have an eldest daughter.",
        "The mum comes home alone, mascara running, kebab in one hand, bottle of rosé in the other. 'Want me to drive you home?' She can barely stand.",
      ],
    },
    choices: [
      { label: { fr: 'Refuser et appeler un taxi', en: 'Refuse, call a cab' }, out: [
        { w: 2, text: { fr: ["J'ai confisqué les clés et appelé un taxi. Le père m'a appelé{|e} « le gendarme » toute la nuit. Le lendemain, la mère m'a doublé ma paie, avec un post-it « merci, désolée ».", "Taxi, 25 €. La mère a insisté pour payer, et m'a donné 200 € par erreur. Je ne l'ai pas corrigée. Elle m'a rappelé{|e} la semaine suivante."], en: ["I confiscated the keys and called a cab. The dad called me 'the cop' all night. Next morning the mum doubled my pay with a post-it: 'thanks, sorry'.", "Taxi, $25. The mum insisted on paying and gave me $200 by mistake. I didn't correct her. She booked me again the next week."] }, fx: { money: 60, karma: 6, perf: 6 }, mood: 'proud' },
      ] },
      { label: { fr: 'Monter quand même', en: 'Get in anyway' }, out: [
        { w: 1, text: { fr: ["On a fait le trajet en zigzag, à 15 km/h, en écoutant {w:band} à fond. Elle a pleuré au feu rouge. J'ai survécu. Je me suis signé{|e} trois fois en descendant.", "Il a roulé sur un rond-point. Pas autour. Sur. On est arrivés chez moi avec un panneau « Cédez le passage » coincé sous la voiture."], en: ["We zigzagged home at 10 mph blasting {w:band}. She cried at a red light. I survived. I crossed myself three times getting out.", "He drove over a roundabout. Not around. Over. We reached my place with a 'Yield' sign stuck under the car."] }, fx: { stress: 8, happy: -2 }, mood: 'shock' },
        { w: 1, text: { fr: ["Contrôle de police au premier carrefour. Le père a soufflé dans le ballon, qui a presque explosé. Garde à vue pour lui, retour à pied pour moi, à 3 h du matin, sous la pluie.", "Elle a percuté une poubelle, puis une deuxième, puis un abribus. Personne n'est blessé. Les parents m'ont demandé de « ne rien dire ». Ils m'ont donné 100 € pour ça."], en: ["Police checkpoint at the first junction. The dad blew into the breathalyser, which nearly exploded. Custody for him, walk home for me, 3 a.m., in the rain.", "She hit a bin, then another, then a bus shelter. Nobody hurt. The parents asked me to 'say nothing'. They gave me $100 for it."] }, fx: { money: 100, stress: 10, health: -2 }, mood: 'shock' },
      ] },
    ],
  },
  // ───────────────────────────── dogwalker ─────────────────────────────
  {
    id: 'c3_dog_squirrel', icon: '🐿️', cat: 'job', rating: 0,
    scene: { place: 'park', mood: 'shock', prop: 'leash' },
    when: { job: 'dogwalker' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Tu promènes huit chiens en même temps, dont un dogue allemand et un teckel asthmatique. Un écureuil traverse l'allée. Les huit le voient. Le temps s'arrête.",
        "Balade tranquille avec tes six clients à quatre pattes. Soudain, {w:animal} surgit d'un buisson. Toutes les laisses se tendent. Tu sens tes épaules quitter ton corps.",
        "Le husky de Mme Garnier vient d'apercevoir un livreur à vélo. Il tire. Le labrador suit. Le bouledogue suit. Tu suis aussi, mais à plat ventre.",
        "Un des chiens que tu promènes a mangé {w:object} trouvé dans l'herbe. Il commence à faire {w:sound}. Les sept autres te regardent, pleins d'espoir, comme si c'était un jeu.",
      ],
      en: [
        "You're walking eight dogs at once, including a Great Dane and an asthmatic dachshund. A squirrel crosses the path. All eight see it. Time stops.",
        "Quiet walk with your six four-legged clients. Suddenly, {w:animal} bursts out of a bush. Every leash goes taut. You feel your shoulders leave your body.",
        "Mrs Garnier's husky just spotted a bike courier. He pulls. The lab follows. The bulldog follows. You follow too, face down.",
        "One of the dogs you're walking ate {w:object} it found in the grass. It starts making {w:sound}. The other seven look at you hopefully, like it's a game.",
      ],
    },
    choices: [
      { label: { fr: 'Tenir bon', en: 'Hold on tight' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai planté mes talons comme un cow-boy. Les huit chiens se sont arrêtés net. Un passant a applaudi. Je me sens comme un{|e} dompt{eur|euse} de cirque.", "J'ai tenu. Mes bras ont pris dix centimètres, mais j'ai tenu. Les chiens m'ont regardé{|e} avec un respect nouveau. Le teckel s'est assis, épuisé."], en: ["I dug in my heels like a cowboy. All eight dogs stopped dead. A passer-by applauded. I feel like a circus tamer.", "I held on. My arms gained four inches, but I held. The dogs looked at me with new respect. The dachshund sat down, exhausted."] }, fx: { perf: 6, athletic: 3, happy: 4 }, mood: 'proud' },
        { w: 2, odds: { athletic: -1 }, text: { fr: ["Ils m'ont traîné{|e} sur 200 mètres de gravier, puis dans une mare. L'écureuil s'en est sorti. Moi, non. Je me suis râpé{|e} {w:bodypart} et j'ai perdu une chaussure.", "J'ai fait du ski nautique sur l'herbe jusqu'au bac à sable. Une maman m'a filmé{|e}. 300 000 vues. Les propriétaires des chiens ont reconnu leurs bêtes. Et moi."], en: ["They dragged me 200 metres over gravel, then into a pond. The squirrel made it. I didn't. I scraped my {w:bodypart} and lost a shoe.", "I water-skied across the grass all the way to the sandpit. A mum filmed me. 300,000 views. The owners recognised their dogs. And me."] }, fx: { health: -5, perf: -4, followers: 200 }, mood: 'shock' },
      ] },
      { label: { fr: 'Lâcher les laisses', en: 'Let go of the leashes' }, out: [
        { w: 1, text: { fr: ["J'ai tout lâché. Il m'a fallu quatre heures pour retrouver les huit. Le dernier était dans un restaurant, assis à une table, servi. Le serveur m'a tendu l'addition.", "Liberté totale. Sept chiens retrouvés. Le huitième est revenu tout seul le lendemain, avec un collier neuf et l'air d'avoir trouvé une meilleure famille."], en: ["I let go of everything. Took four hours to find all eight. The last one was in a restaurant, sitting at a table, being served. The waiter handed me the bill.", "Total freedom. Seven dogs found. The eighth came back on its own the next day, with a new collar and the look of someone who'd found a better family."] }, fx: { perf: -10, stress: 10, money: -40 }, mood: 'sad' },
      ] },
    ],
  },
  {
    id: 'c3_dog_bag', icon: '💩', cat: 'job', rating: 2,
    scene: { place: 'park', mood: 'shock', fx: 'poop' },
    when: { job: 'dogwalker' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Le dogue allemand que tu promènes vient de déposer, sur le paillasson du maire, une crotte de la taille d'un petit pain de campagne. Tu n'as plus de sac. Le maire ouvre sa porte.",
        "Plus de sacs. Le saint-bernard s'accroupit au milieu du marché bio, entre le stand de fromages et un groupe de retraités qui font du tai-chi. Il pousse. Fort.",
        "Le bouledogue de ta cliente a la diarrhée depuis qu'il a mangé {w:food}. Vous êtes dans un ascenseur. Il reste 12 étages. Il commence à trembler.",
        "Un voisin hystérique te filme pendant que le labrador fait ses besoins sur sa pelouse parfaite. « Je vais te mettre sur {w:app}, pauvre {w:insult} ! » Tu n'as pas de sac.",
      ],
      en: [
        "The Great Dane you're walking just left, on the mayor's doormat, a turd the size of a small loaf. You're out of bags. The mayor opens his door.",
        "Out of bags. The St Bernard squats in the middle of the organic market, between the cheese stall and a group of seniors doing tai chi. He pushes. Hard.",
        "Your client's bulldog has had diarrhoea since it ate {w:food}. You're in a lift. Twelve floors to go. It starts trembling.",
        "A hysterical neighbour films you while the lab does its business on his perfect lawn. 'I'm putting you on {w:app}, {w:insult}!' You have no bag.",
      ],
    },
    choices: [
      { label: { fr: 'Ramasser à la main', en: 'Pick it up by hand' }, out: [
        { w: 2, text: { fr: ["J'ai utilisé une feuille de platane. Elle était trop petite. Ça a traversé. C'était chaud. Le maire m'a félicité{|e} pour mon « civisme exemplaire » en me serrant la main. Je ne l'avais pas lavée.", "J'ai ramassé avec mon bonnet. J'ai sacrifié mon bonnet. Les retraités du tai-chi m'ont applaudi{|e}. Je rentrerai la tête nue et l'âme sale."], en: ["I used a plane-tree leaf. Too small. It went through. It was warm. The mayor praised my 'exemplary civic spirit' and shook my hand. I hadn't washed it.", "I scooped it with my beanie. I sacrificed my beanie. The tai chi seniors applauded. I'll go home bareheaded with a dirty soul."] }, fx: { karma: 6, happy: -6, perf: 4, visual: 'poop' }, mood: 'sick' },
      ] },
      { label: { fr: 'Faire semblant de rien', en: 'Pretend nothing happened' }, out: [
        { w: 1, text: { fr: ["J'ai sifflé en regardant ailleurs. Le maire a glissé dessus en sortant, en costume, devant les caméras de la télé locale. On voit mon visage au troisième plan. Amende et licenciement.", "Le voisin a posté la vidéo. « Promeneur de chiens sans gêne » : 80 000 partages. Trois clients m'ont lâché{|e}. Le labrador, lui, a gagné des fans."], en: ["I whistled and looked away. The mayor stepped in it on his way out, in a suit, in front of local TV cameras. My face is visible in the background. Fine and fired.", "The neighbour posted the video. 'Shameless dog walker': 80,000 shares. Three clients dropped me. The lab gained fans."] }, fx: { money: -135, fired: true, karma: -4 }, mood: 'shock' },
        { w: 1, text: { fr: ["Personne n'a rien vu. Le lendemain, j'ai entendu un cri de l'autre côté de la rue et un « BORDEL ! » strident. Je n'ai pas tourné la tête. J'ai grandi.", "J'ai traîné le chien plus loin l'air de rien. Le marché bio a cru que c'était un fromage artisanal. Il a été vendu. Je ne poserai pas de questions."], en: ["Nobody saw. Next day I heard a scream across the street and a shrill 'FOR F***'S SAKE!'. I didn't turn my head. I've grown.", "I dragged the dog off casually. The organic market thought it was an artisanal cheese. It sold. I won't ask questions."] }, fx: { karma: -4, happy: 3 }, mood: 'happy' },
      ] },
    ],
  },
  // ───────────────────────────── cashier ─────────────────────────────
  {
    id: 'c3_cash_pricecheck', icon: '🛒', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'shock', prop: 'register' },
    when: { job: 'cashier', age: [18, 120] }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Un client dépose sur ton tapis : des préservatifs XXL, un tube de lubrifiant, un concombre et de la crème anti-hémorroïdes. Le code-barres des préservatifs ne passe pas. C'est ton ancien prof de maths.",
        "Le code-barres d'un article ne passe pas. L'article : une pommade contre les mycoses intimes, format familial. La cliente, ta voisine, te supplie du regard de ne pas appeler le responsable au micro.",
        "La file fait 14 personnes. L'article qui bloque : un « masseur personnel » vibrant en forme de dauphin. Le client te regarde fixement. Ta chef est à l'autre bout du magasin.",
        "Un monsieur très digne pose sur ton tapis six tubes de crème anti-irritation et un magazine de mots croisés. Ça ne scanne pas. Derrière lui, sa paroisse entière fait la queue.",
      ],
      en: [
        "A customer puts on your belt: XXL condoms, a tube of lube, a cucumber and haemorrhoid cream. The condom barcode won't scan. It's your old maths teacher.",
        "An item won't scan. The item: a family-size intimate anti-fungal cream. The customer, your neighbour, begs you with her eyes not to page the manager over the PA.",
        "The line is 14 people deep. The item stuck: a dolphin-shaped vibrating 'personal massager'. The customer stares at you. Your manager is at the far end of the store.",
        "A very dignified gentleman places six tubes of anti-chafing cream and a crossword magazine on your belt. It won't scan. Behind him, his entire parish is queueing.",
      ],
    },
    choices: [
      { label: { fr: 'Annoncer au micro', en: 'Page it over the PA' }, out: [
        { w: 2, text: { fr: ["« Vérification de prix caisse 4 : préservatifs XXL, format 24 ! » Ma voix a résonné dans tout le magasin. Le prof est devenu violet. La file a applaudi. Ma chef a ri dans le rayon surgelés.", "J'ai dit au micro le nom complet du produit, avec le parfum. Le client est parti sans rien. Ma chef m'a donné un avertissement, puis m'a fait refaire l'annonce pour la vidéo de Noël de l'équipe."], en: ["'Price check, register 4: XXL condoms, 24-pack!' My voice echoed through the store. The teacher turned purple. The line applauded. My manager laughed in the frozen aisle.", "I read out the product's full name over the PA, including the flavour. The customer left with nothing. My manager gave me a warning, then made me redo it for the team's Christmas video."] }, fx: { happy: 8, perf: -4, karma: -4 }, mood: 'happy' },
      ] },
      { label: { fr: 'Taper le prix au pif', en: 'Guess a price' }, out: [
        { w: 2, text: { fr: ["J'ai tapé 2,50 €. Le client a payé en me regardant comme un ange gardien. L'inventaire a perdu 18 €. Le karma a gagné un point.", "J'ai tapé un prix au hasard en évitant tout contact visuel. Il m'a glissé un « merci » à peine audible. Ma chef n'a rien vu. C'est la solidarité humaine."], en: ["I punched in $2.50. He paid, looking at me like a guardian angel. Inventory lost $18. Karma gained a point.", "I typed a random price, avoiding all eye contact. He whispered a barely audible 'thank you'. My manager didn't notice. That's human solidarity."] }, fx: { karma: 5, perf: 2 }, mood: 'neutral' },
        { w: 1, text: { fr: ["J'ai tapé 250 € au lieu de 2,50 €. Il a payé sans regarder, trop pressé de fuir. Il est revenu le lendemain avec un avocat et le dauphin.", "Ma chef a vu l'écart en caisse le soir même. Elle m'a fait un sermon sur la « rigueur » en tenant le dauphin à la main. Personne n'a su où regarder."], en: ["I typed $250 instead of $2.50. He paid without looking, desperate to flee. He came back the next day with a lawyer and the dolphin.", "My manager spotted the discrepancy that evening. She lectured me on 'rigour' while holding the dolphin. Nobody knew where to look."] }, fx: { perf: -8, stress: 4 }, mood: 'shock' },
      ] },
    ],
  },
  {
    id: 'c3_cash_coins', icon: '🪙', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'angry', prop: 'register' },
    when: { job: 'cashier' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Un client règle ses [[87,40|112,60|64,90]] € de courses en pièces de 1 centime. Il les sort une par une d'une chaussette. Il compte à voix haute. Il se trompe à 412 et recommence.",
        "Une dame paie en chèque. En 2026. Elle cherche son stylo. Puis son chéquier. Puis ses lunettes. Puis demande la date. Puis l'année. Puis l'ordre du chèque. Il y a 19 personnes derrière.",
        "Un enfant de 6 ans pose {w:food} sur ton tapis et te tend un billet de Monopoly avec un aplomb total. Son père, derrière, filme pour {w:app}.",
        "Un client veut payer avec un bon de réduction, une carte de fidélité, trois tickets restaurant, des points de son assurance et une « crypto-monnaie de quartier » sur son téléphone.",
      ],
      en: [
        "A customer pays his $[[87.40|112.60|64.90]] grocery bill in pennies. He takes them out of a sock one by one. He counts out loud. He loses track at 412 and starts over.",
        "A lady pays by cheque. In 2026. She looks for a pen. Then her chequebook. Then her glasses. Then asks the date. Then the year. Then who to make it out to. 19 people behind her.",
        "A 6-year-old puts {w:food} on your belt and hands you a Monopoly note with total confidence. His dad, behind him, is filming for {w:app}.",
        "A customer wants to pay with a coupon, a loyalty card, three meal vouchers, insurance points and a 'neighbourhood cryptocurrency' on his phone.",
      ],
    },
    choices: [
      { label: { fr: 'Rester zen', en: 'Stay zen' }, out: [
        { w: 2, text: { fr: ["J'ai souri, compté avec lui, et respiré par le ventre. La file m'a regardé{|e} comme un moine bouddhiste. Ma chef m'a nommé{|e} « employé{|e} du mois ». Il y a une photo de moi près des caddies.", "Patience infinie. Le client m'a offert une pièce de 1 centime « pour la peine ». Je l'ai encadrée. Elle est à côté de ma photo d'employé{|e} du mois."], en: ["I smiled, counted with him and breathed from the belly. The line looked at me like a Buddhist monk. My manager made me 'employee of the month'. There's a photo of me by the trolleys.", "Infinite patience. The customer gave me a penny 'for my trouble'. I framed it. It's next to my employee-of-the-month photo."] }, fx: { perf: 8, stress: 4, karma: 3 }, mood: 'proud' },
      ] },
      { label: { fr: 'Ouvrir une autre caisse', en: 'Open another lane' }, out: [
        { w: 1, text: { fr: ["J'ai crié « Caisse 5 ouverte ! » et la file s'est ruée comme des soldes. Il y a eu un blessé léger. Une mamie a été piétinée. Elle a dit « ça va, j'ai fait mai 68 ».", "J'ai ouvert la caisse voisine et laissé le monsieur aux pièces seul face à sa chaussette. Il compte encore. On l'entend parfois la nuit, quand le magasin est fermé."], en: ["I shouted 'Register 5 open!' and the line stampeded like Black Friday. One minor injury. A granny got trampled. She said 'I'm fine, I survived the sixties.'", "I opened the next register and left the penny man alone with his sock. He's still counting. You can hear him at night when the store is closed."] }, fx: { perf: 3, happy: 3 }, mood: 'happy' },
      ] },
      { label: { fr: 'Perdre patience', en: 'Lose it' }, out: [
        { w: 1, text: { fr: ["J'ai attrapé la chaussette et versé les pièces dans le compteur à monnaie de la banque d'à côté. Il a porté plainte pour « vol de chaussette ». Ma chef m'a mis{|e} au rayon poissonnerie.", "J'ai soupiré tellement fort que le client a fondu en larmes. Une cliente m'a traité{|e} de « monstre ». J'ai eu un entretien disciplinaire avec le directeur, qui comptait aussi ses pièces."], en: ["I grabbed the sock and poured the coins into the coin machine at the bank next door. He filed a complaint for 'sock theft'. My manager moved me to the fish counter.", "I sighed so loudly the customer burst into tears. A lady called me 'a monster'. Disciplinary meeting with the manager, who was also counting his coins."] }, fx: { perf: -8, stress: -4 }, mood: 'angry' },
      ] },
    ],
  },
  // ───────────────────────────── delivery ─────────────────────────────
  {
    id: 'c3_deliv_fries', icon: '🍟', cat: 'job', rating: 0,
    scene: { place: 'park', mood: 'neutral', prop: 'bike' },
    when: { job: 'delivery' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Tu pédales depuis [[six|sept|neuf]] heures sans manger. Dans ton sac isotherme : une commande de frites XXL qui sent le paradis. Le client habite à 4 km. Il a commandé « sans sauce » et laissé 0 € de pourboire.",
        "Septième étage sans ascenseur. Le client t'ouvre en peignoir et te demande pourquoi « ça a mis 45 minutes ». Il pleut {w:weather}. Ton vélo t'attend, sans selle : on te l'a volée.",
        "La commande : {w:food}, à livrer de l'autre côté de la ville, en côte, {w:weather}. Rémunération : 2,80 €. L'appli te félicite : « Tu es un héros du quotidien ! »",
        "Tu attends la commande au restaurant depuis 35 minutes. L'appli te pénalise pour « retard ». Le cuisinier fume dehors, avec un sourire de quelqu'un qui n'est pas payé à la course.",
      ],
      en: [
        "You've been pedalling for [[six|seven|nine]] hours without eating. In your insulated bag: an XXL fries order that smells like heaven. The customer lives 2.5 miles away. He ordered 'no sauce' and tipped $0.",
        "Seventh floor, no lift. The customer opens in a bathrobe and asks why it 'took 45 minutes'. It's raining {w:weather}. Your bike waits outside without a saddle: someone stole it.",
        "The order: {w:food}, to deliver across town, uphill, {w:weather}. Pay: $2.80. The app congratulates you: 'You're an everyday hero!'",
        "You've waited 35 minutes for the order at the restaurant. The app penalises you for 'lateness'. The cook is smoking outside with the smile of someone not paid per delivery.",
      ],
    },
    choices: [
      { label: { fr: 'Manger quelques frites', en: 'Eat a few fries' }, out: [
        { w: 2, text: { fr: ["Une frite. Puis deux. Puis la moitié. J'ai tassé le reste pour que ça ait l'air plein. Le client n'a rien remarqué. Ces frites étaient la meilleure chose de mon année.", "J'en ai mangé six. Six, c'est raisonnable. Le client a mis 5 étoiles en écrivant « portion généreuse ». La vie est absurde et délicieuse."], en: ["One fry. Then two. Then half. I fluffed the rest so it looked full. The customer noticed nothing. Those fries were the best thing in my year.", "I ate six. Six is reasonable. The customer gave 5 stars and wrote 'generous portion'. Life is absurd and delicious."] }, fx: { happy: 6, karma: -2, health: 1 }, mood: 'happy' },
        { w: 1, text: { fr: ["Le client avait une sonnette avec caméra. Il m'a vu{|e} manger ses frites en gros plan, au ralenti. Signalement, compte désactivé. La vidéo a 1 million de vues.", "Le client a compté ses frites. Il les compte toujours, apparemment. Il manquait 14 frites. Il a fait une réclamation. J'ai été suspendu{|e} trois jours."], en: ["The customer had a doorbell camera. He saw me eat his fries in close-up, in slow motion. Reported, account deactivated. The video has 1 million views.", "The customer counted his fries. He always does, apparently. 14 were missing. He complained. Three-day suspension."] }, fx: { fired: true, followers: 1500 }, mood: 'shock' },
      ] },
      { label: { fr: 'Livrer comme un pro', en: 'Deliver like a pro' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai pédalé comme au Tour de France, doublé un bus et livré en 9 minutes. Le client m'a donné 5 € de pourboire. J'ai pleuré de joie dans l'ascenseur. Il n'y avait pas d'ascenseur.", "Livraison éclair, sourire, « bon appétit ». Le client, touché, m'a offert {w:drink}. L'appli m'a classé{|e} « Top Rider ». Ça ne veut rien dire, mais j'ai un badge."], en: ["I pedalled like the Tour de France, overtook a bus and delivered in 9 minutes. The customer tipped $5. I wept with joy in the lift. There was no lift.", "Lightning delivery, smile, 'enjoy your meal'. The customer, moved, gave me {w:drink}. The app ranked me 'Top Rider'. Means nothing, but I have a badge."] }, fx: { money: 15, perf: 8, athletic: 2 }, mood: 'proud' },
        { w: 1, odds: { athletic: -1 }, text: { fr: ["J'ai déraillé dans la côte, la commande a fait un vol plané, et la soupe s'est répandue dans mon sac. J'ai livré un sac vide qui sentait bon. Une étoile.", "Arrivé{|e} en sueur, rouge, haletant{|e}. Le client a demandé si j'allais bien. Je n'ai pas pu répondre. Je me suis assis{|e} sur son paillasson trois minutes."], en: ["My chain slipped on the hill, the order went flying, and the soup spilled in my bag. I delivered an empty bag that smelled nice. One star.", "Arrived sweaty, red, gasping. The customer asked if I was OK. I couldn't answer. I sat on his doormat for three minutes."] }, fx: { perf: -4, health: -2 }, mood: 'sad' },
      ] },
    ],
  },
  {
    id: 'c3_deliv_door', icon: '🚪', cat: 'job', rating: 2,
    scene: { place: 'park', mood: 'shock', fx: 'gore' },
    when: { job: 'delivery' }, weight: 7, cooldown: 5,
    text: {
      fr: [
        "Tu fonces à 35 km/h dans une rue en pente, une pizza sur le dos. Devant toi, un conducteur de SUV ouvre sa portière sans regarder. Il est au téléphone. Il rigole.",
        "Feu orange. Tu tentes ta chance. Un bus de nuit tente aussi la sienne. Vous vous voyez en même temps. Ton sushi-box glisse sur ton porte-bagages.",
        "Une camionnette de livraison concurrente te serre contre le trottoir. Le chauffeur te fait un doigt d'honneur. Devant, une bouche d'égout ouverte, comme un piège de dessin animé.",
        "Tu dévales une côte sans freins (tu n'as plus de freins depuis mardi, l'appli ne rembourse pas). En bas : un marché, un camion de livraison et {w:animal}.",
      ],
      en: [
        "You're flying downhill at 20 mph with a pizza on your back. Ahead, an SUV driver opens his door without looking. He's on the phone. He's laughing.",
        "Amber light. You go for it. A night bus goes for it too. You see each other at the same time. Your sushi box slides on the rack.",
        "A rival delivery van squeezes you against the kerb. The driver gives you the finger. Ahead, an open manhole, like a cartoon trap.",
        "You're bombing down a hill with no brakes (they've been gone since Tuesday, the app doesn't reimburse). At the bottom: a market, a delivery truck and {w:animal}.",
      ],
    },
    choices: [
      { label: { fr: 'Piler', en: 'Slam the brakes' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: ["Dérapage, roue arrière, figure de cascadeur. Je me suis arrêté{|e} à deux centimètres. La pizza a continué sans moi et a giflé le conducteur au visage. Justice divine. Pourboire du client : 0 €.", "J'ai freiné avec les pieds, les dents et la volonté. Ça a tenu. J'ai eu une crise de nerfs sur le trottoir pendant cinq minutes, puis j'ai livré. Le client m'a mis une étoile pour le retard."], en: ["Skid, back wheel up, stuntman move. I stopped two centimetres short. The pizza kept going without me and slapped the driver in the face. Divine justice. Tip: $0.", "I braked with my feet, my teeth and my willpower. It held. I had a five-minute meltdown on the pavement, then delivered. One star for lateness."] }, fx: { stress: 8, perf: 2 }, mood: 'shock' },
        { w: 2, odds: { athletic: -1 }, text: { fr: ["Pas de freins. La portière m'a cueilli{|e} en pleine face. J'ai fait un salto, perdu deux dents et laissé une trace de sang sur toute la carrosserie. Le conducteur s'est plaint de la rayure.", "J'ai traversé la vitrine d'une boulangerie. Il y avait du sang dans les éclairs au café et une dent dans un mille-feuille. Fracture du bras. La pizza, elle, est intacte."], en: ["No brakes. The door caught me square in the face. I did a somersault, lost two teeth and left a blood smear down the whole car. The driver complained about the scratch.", "I went through a bakery window. Blood in the éclairs and a tooth in a custard slice. Broken arm. The pizza is fine."] }, fx: { health: -18, disease: 'broken_arm', perf: -6, visual: 'gore' }, mood: 'sick' },
        { w: 0.3, text: { fr: ["Le bus a gagné. J'ai été étalé{|e} sur 30 mètres comme de la confiture sur une tartine. L'appli m'a envoyé une notification : « Ta livraison est en retard. »", "La bouche d'égout m'a avalé{|e} comme dans un cartoon, avec un « plop ». On a retrouvé la pizza, chaude, posée sur la plaque. Moi, beaucoup plus bas, en morceaux."], en: ["The bus won. I was spread over 30 metres like jam on toast. The app sent me a notification: 'Your delivery is running late.'", "The manhole swallowed me like a cartoon, with a 'plop'. They found the pizza, still warm, on the cover. Me, much further down, in pieces."] }, fx: { die: { fr: 'écrasé{|e} en livrant une pizza, sans pourboire', en: 'flattened while delivering a pizza, no tip' }, visual: 'gore' }, mood: 'shock' },
      ] },
      { label: { fr: 'Sauter du vélo', en: 'Bail off the bike' }, out: [
        { w: 1, text: { fr: ["J'ai sauté au dernier moment, roulé sur le capot d'une voiture garée et atterri sur un tas de cartons. Le vélo s'est encastré dans la portière. Le conducteur m'a demandé mon assurance. Je n'en ai pas.", "J'ai plongé dans une haie. J'ai {w:object} planté dans la cuisse, mais je suis vivant{|e}. Le vélo a fini sous le bus. L'appli m'a demandé de « noter ma course »."], en: ["I jumped at the last moment, rolled over a parked car's bonnet and landed on a pile of boxes. The bike embedded itself in the door. The driver asked for my insurance. I have none.", "I dove into a hedge. I have {w:object} stuck in my thigh, but I'm alive. The bike ended up under the bus. The app asked me to 'rate my ride'."] }, fx: { health: -8, money: -300 }, mood: 'sick' },
      ] },
    ],
  },
  // ───────────────────────────── lifeguard ─────────────────────────────
  {
    id: 'c3_life_brown', icon: '🏊', cat: 'job', rating: 2,
    scene: { place: 'park', mood: 'sick', fx: 'poop' },
    when: { job: 'lifeguard' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Piscine municipale, 15 h, [[200|350|500]] baigneurs. Un objet marron flotte tranquillement dans le grand bain. Un enfant pointe du doigt. Un autre crie « CACA ! ». La panique commence.",
        "Tu repères quelque chose de suspect qui dérive vers le toboggan. C'est soit une barre chocolatée, soit l'inverse. Une dame en bonnet à fleurs nage droit dessus, la bouche ouverte.",
        "L'aquagym des seniors bat son plein. Au milieu du cercle, une forme brune remonte lentement à la surface. Personne ne s'arrête de danser sur {w:song}.",
        "Un bambin en couche de bain sort de la pataugeoire en souriant. Derrière lui, l'eau a changé de couleur. Ça dégage {w:smell}. Les parents regardent leur téléphone.",
      ],
      en: [
        "Public pool, 3 p.m., [[200|350|500]] swimmers. A brown object floats calmly in the deep end. A kid points. Another yells 'POOP!'. Panic begins.",
        "You spot something suspicious drifting toward the slide. It's either a chocolate bar or the opposite. A lady in a flowery cap swims straight at it, mouth open.",
        "Seniors' aqua-aerobics in full swing. In the middle of the circle, a brown shape slowly rises to the surface. Nobody stops dancing to {w:song}.",
        "A toddler in a swim nappy walks out of the paddling pool, smiling. Behind him, the water has changed colour. It gives off {w:smell}. The parents are on their phones.",
      ],
    },
    choices: [
      { label: { fr: 'Évacuer et repêcher', en: 'Evacuate and fish it out' }, out: [
        { w: 2, text: { fr: ["Coup de sifflet, évacuation générale, épuisette. Je l'ai sorti comme un trophée de pêche. C'était bien ce qu'on pensait. Les gamins m'ont acclamé{|e} comme un{|e} gladiat{eur|rice}.", "J'ai plongé avec un seau. Mauvaise idée de plonger. Très mauvaise. Mais j'ai sauvé la piscine. Je me suis rincé la bouche à la Javel. Ne faites pas ça."], en: ["Whistle, full evacuation, net. I lifted it out like a fishing trophy. It was what we thought. The kids cheered me like a gladiator.", "I dove in with a bucket. Bad idea to dive. Very bad. But I saved the pool. I rinsed my mouth with bleach. Don't do that."] }, fx: { perf: 8, happy: -4, visual: 'poop' }, mood: 'proud' },
      ] },
      { label: { fr: 'Dire que c\'est un Mars', en: 'Say it\'s a candy bar' }, out: [
        { w: 1, text: { fr: ["J'ai crié « C'est un Mars, pas de panique ! » et j'ai nagé vers lui pour le prouver. J'ai pris une bouchée symbolique, de loin, pour la forme. Personne n'a été convaincu. Moi non plus.", "J'ai dit « C'est une barre chocolatée ». Un ado a voulu le vérifier en l'attrapant à mains nues. Son père l'a vu. Je suis convoqué{|e} à la mairie."], en: ["I yelled 'It's a candy bar, don't panic!' and swam toward it to prove it. I took a symbolic bite, from afar, for show. Nobody was convinced. Neither was I.", "I said 'It's a chocolate bar.' A teen tried to check by grabbing it barehanded. His dad saw. I've been summoned to the town hall."] }, fx: { perf: -8, karma: -3, visual: 'poop' }, mood: 'sick' },
      ] },
      { label: { fr: 'Fermer la piscine', en: 'Close the pool' }, text: { fr: ["J'ai fermé la piscine pour « maintenance ». J'ai passé l'après-midi au soleil sur mon fauteuil d'arbitre. Meilleure journée de l'été. Le chlore s'occupera du reste.", "Piscine fermée trois jours, vidée, désinfectée. Le maire a demandé qui avait fait ça. J'ai désigné un bambin innocent. Il ne parle pas encore, il ne peut pas se défendre."], en: ["I closed the pool for 'maintenance'. Spent the afternoon sunbathing in my high chair. Best day of the summer. Chlorine will handle the rest.", "Pool closed three days, drained, disinfected. The mayor asked who did it. I blamed an innocent toddler. He can't talk yet, he can't defend himself."] }, fx: { happy: 4, perf: -2 }, mood: 'happy' },
    ],
  },
  {
    id: 'c3_life_cpr', icon: '🛟', cat: 'job', rating: 1,
    scene: { place: 'beach', mood: 'shock' },
    when: { job: 'lifeguard', age: [18, 120] }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Un type bedonnant fait la planche, immobile, depuis dix minutes. Tu fonces. Tu le ramènes. Il ne respire plus. Il a mangé {w:food} à l'ail au déjeuner. Il faut faire le bouche-à-bouche.",
        "Un baigneur sort de l'eau, s'effondre sur le sable. Toute la plage te regarde. Tu t'agenouilles. Il sent la bière tiède et la crème solaire coco périmée.",
        "Sauvetage ! Tu ramènes une dame qui a bu la tasse. Elle tousse, ouvre un œil et te demande si tu es célibataire. Puis elle tombe dans les pommes. Pour de vrai ? Pas sûr.",
        "Un homme crie « Au secours ! » à 50 mètres du bord. Tu nages comme un dauphin, tu l'attrapes : il a pied. Il fait 1,92 m. L'eau lui arrive à la taille. Il te remercie quand même.",
      ],
      en: [
        "A pot-bellied guy has been floating motionless for ten minutes. You sprint. You haul him in. He's not breathing. He had garlic {w:food} for lunch. Mouth-to-mouth is required.",
        "A swimmer comes out of the water and collapses on the sand. The whole beach watches you. You kneel. He smells of warm beer and expired coconut sunscreen.",
        "Rescue! You bring back a woman who swallowed water. She coughs, opens one eye and asks if you're single. Then passes out. For real? Not sure.",
        "A man yells 'Help!' 50 metres out. You swim like a dolphin, grab him: he can stand. He's 6'3\". The water is at his waist. He thanks you anyway.",
      ],
    },
    choices: [
      { label: { fr: 'Bouche-à-bouche héroïque', en: 'Heroic mouth-to-mouth' }, out: [
        { w: 2, text: { fr: ["Trois insufflations, trente compressions. Il a recraché de l'eau, des algues et un bout de calamar. Il vit. La plage a applaudi. Le journal local a titré « Le sauveteur à l'haleine d'acier ».", "Il s'est réveillé au bout de la deuxième insufflation, m'a regardé{|e}, et a vomi. Sur moi. Mais il vit. J'ai reçu une médaille de la ville et une gastro."], en: ["Three breaths, thirty compressions. He coughed up water, seaweed and a bit of squid. He lives. The beach applauded. Local paper: 'The lifeguard with nerves (and breath) of steel'.", "He woke up on the second breath, looked at me and threw up. On me. But he lives. I got a medal from the town and a stomach bug."] }, fx: { perf: 12, fame: 3, karma: 8, disease: 'gastro' }, mood: 'proud' },
        { w: 1, text: { fr: ["Il ne faisait que dormir. Il s'est réveillé avec ma bouche sur la sienne et a hurlé. Sa femme a hurlé. J'ai hurlé. Le maître-nageur chef a pris une photo.", "Il faisait semblant pour avoir un bouche-à-bouche. Il me l'a avoué en riant. Je lui ai remis la tête sous l'eau trois secondes. Pas plus. Peut-être quatre."], en: ["He was just asleep. He woke up with my mouth on his and screamed. His wife screamed. I screamed. The head lifeguard took a photo.", "He was faking it to get mouth-to-mouth. He admitted it, laughing. I put his head back underwater for three seconds. No more. Maybe four."] }, fx: { happy: -4, perf: -2 }, mood: 'angry' },
      ] },
      { label: { fr: 'Appeler les secours', en: 'Call the paramedics' }, out: [
        { w: 1, text: { fr: ["J'ai appelé le SAMU et fait des compressions en attendant. Ils sont arrivés en 12 minutes. Il s'en est sorti. Le médecin m'a dit « bon réflexe ». J'ai failli pleurer.", "Les secours ont mis 25 minutes. J'ai fait des compressions tout ce temps sur {w:song} pour garder le rythme. Il a survécu. J'ai deux côtes à lui sur la conscience, cassées."], en: ["I called an ambulance and did compressions while waiting. They arrived in 12 minutes. He made it. The doctor said 'good reflex'. I nearly cried.", "Paramedics took 25 minutes. I did compressions the whole time to {w:song} to keep the rhythm. He survived. I broke two of his ribs."] }, fx: { perf: 6, karma: 4, stress: 6 }, mood: 'neutral' },
      ] },
    ],
  },
  // ───────────────────────────── cleaner ─────────────────────────────
  {
    id: 'c3_clean_list', icon: '🧹', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'shock', prop: 'mop' },
    when: { job: 'cleaner' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "En vidant la corbeille du bureau du PDG, tu trouves un document froissé : « Plan de restructuration — 120 postes supprimés ». Ton prénom est dessus. Écrit au stylo. Avec un smiley.",
        "21 h, tu passes l'aspirateur dans la salle du conseil. Sur le tableau blanc, mal effacé : « Externaliser le ménage : économie 40 % ». À côté, un dessin de balai barré.",
        "Dans la photocopieuse, quelqu'un a oublié un document : les salaires de toute la direction. Le DRH gagne 17 fois ton salaire. Sa prime de cette année est intitulée « performance humaine ».",
        "Tu nettoies le bureau du directeur. Son ordinateur est resté ouvert sur un mail : « Les agents d'entretien ? On les remplace par des robots en juin, ils ne remarqueront rien. »",
      ],
      en: [
        "Emptying the CEO's wastebasket, you find a crumpled document: 'Restructuring plan — 120 jobs cut'. Your name is on it. In pen. With a smiley.",
        "9 p.m., you're vacuuming the boardroom. On the poorly wiped whiteboard: 'Outsource cleaning: 40% savings'. Next to it, a drawing of a crossed-out broom.",
        "Someone left a document in the photocopier: the salaries of the entire management team. The HR director earns 17 times your salary. His bonus this year is labelled 'human performance'.",
        "You're cleaning the director's office. His computer is open on an email: 'The cleaners? We replace them with robots in June, they won't notice a thing.'",
      ],
    },
    choices: [
      { label: { fr: 'Prévenir les collègues', en: 'Warn the coworkers' }, out: [
        { w: 2, text: { fr: ["J'ai fait des photocopies et je les ai glissées dans tous les casiers. Le lendemain, grève générale. Le plan a été abandonné. On m'appelle « la Taupe au balai ».", "J'ai prévenu le syndicat. Négociations, manifestations, banderoles. On a gardé nos postes et obtenu une machine à café. Je suis une légende au sous-sol."], en: ["I photocopied it and slipped copies into every locker. Next day: general strike. The plan was dropped. They call me 'the Mole with a Mop'.", "I told the union. Negotiations, protests, banners. We kept our jobs and got a coffee machine. I'm a legend in the basement."] }, fx: { karma: 8, perf: 4, happy: 8 }, mood: 'proud' },
        { w: 1, text: { fr: ["Les caméras m'ont filmé{|e} à la photocopieuse. Licencié{|e} « pour vol de document confidentiel ». Le plan a été appliqué quand même. Mes collègues m'ont offert un bouquet de serpillières.", "La direction a su que c'était moi. Ils m'ont gardé{|e}, mais affecté{|e} aux toilettes du 3e. Seul{|e}. Pour toujours."], en: ["The cameras caught me at the photocopier. Fired 'for stealing a confidential document'. The plan went ahead anyway. My coworkers gave me a bouquet of mops.", "Management found out it was me. They kept me, but assigned me to the 3rd-floor toilets. Alone. Forever."] }, fx: { fired: true, karma: 6 }, mood: 'sad' },
      ] },
      { label: { fr: 'Négocier avec la direction', en: 'Leverage it' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai laissé le document bien en vue sur le bureau du PDG avec un post-it : « On en parle ? ». Le lendemain, j'étais chef{|fe} d'équipe propreté. Le chantage, c'est aussi du management.", "J'ai demandé un rendez-vous au DRH. « Je sais pour le plan. » Il a blêmi. Augmentation de 20 % et une place de parking. Je n'ai pas de voiture."], en: ["I left the document in plain view on the CEO's desk with a post-it: 'Shall we talk?'. Next day I was cleaning supervisor. Blackmail is a form of management.", "I asked to see the HR director. 'I know about the plan.' He went pale. 20% raise and a parking space. I don't own a car."] }, fx: { promote: true, karma: -4 }, mood: 'proud' },
        { w: 1, text: { fr: ["Le DRH a souri, m'a remercié{|e} de ma « vigilance » et m'a mis{|e} en tête de liste. Il m'a même proposé un pot de départ. Avec du jus de pomme.", "Il a appelé la sécurité. On m'a raccompagné{|e} jusqu'à la sortie avec mon seau. Je n'ai même pas fini le couloir."], en: ["The HR director smiled, thanked me for my 'vigilance' and put me at the top of the list. He even offered me a farewell party. With apple juice.", "He called security. They walked me out with my bucket. I didn't even finish the hallway."] }, fx: { fired: true }, mood: 'angry' },
      ] },
      { label: { fr: 'Remettre à la poubelle', en: 'Put it back in the bin' }, text: { fr: ["J'ai remis la feuille à la poubelle et vidé la poubelle. Ce que je ne sais pas ne peut pas me virer. Enfin si. Mais au moins, je dors bien.", "Je n'ai rien vu, je n'ai rien lu. J'ai passé la serpillière sur mes soupçons. En juin, deux robots sont arrivés. Ils glissent sur le sol mouillé. Je ris beaucoup."], en: ["I put the sheet back in the bin and emptied the bin. What I don't know can't fire me. Well, it can. But at least I sleep well.", "I saw nothing, read nothing. I mopped over my suspicions. In June, two robots arrived. They slip on the wet floor. I laugh a lot."] }, fx: { stress: 4 }, mood: 'neutral' },
    ],
  },
  {
    id: 'c3_clean_night', icon: '🌙', cat: 'job', rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'mop' },
    when: { job: 'cleaner' }, weight: 8, cooldown: 4,
    text: {
      fr: [
        "22 h 30. Tu ouvres la salle de réunion avec ton chariot. Le directeur général et la DRH sont sur la table de conférence. Elle porte encore son badge. Lui, seulement ses chaussettes.",
        "Ronde du soir. De la lumière dans le bureau du directeur financier. Des bruits rythmés. Tu entrouvres : il est avec le stagiaire du service juridique, sur la photocopieuse, qui imprime en continu.",
        "Tu passes la serpillière au 6e quand tu entends des gémissements dans le local à fournitures. La porte s'ouvre : ton chef de service en sort, rouge, suivi de la femme de ton autre chef.",
        "Tu nettoies le bureau du PDG. Sur son écran, en plein appel vidéo, une dame en lingerie. Le PDG n'est pas là. Mais la dame te voit et te demande « Il revient quand ? »",
      ],
      en: [
        "10:30 p.m. You open the meeting room with your cart. The CEO and the HR director are on the conference table. She's still wearing her badge. He's wearing only socks.",
        "Evening round. Light in the CFO's office. Rhythmic noises. You peek in: he's with the legal intern, on the photocopier, which is printing nonstop.",
        "You're mopping the 6th floor when you hear moaning from the supply room. The door opens: your department head comes out, flushed, followed by your other boss's wife.",
        "You're cleaning the CEO's office. On his screen, mid video call, a lady in lingerie. The CEO isn't there. But the lady sees you and asks 'When's he back?'",
      ],
    },
    choices: [
      { label: { fr: 'Refermer en silence', en: 'Close the door quietly' }, out: [
        { w: 2, text: { fr: ["J'ai refermé, et j'ai passé l'aspirateur juste devant la porte pendant vingt minutes, très fort. Le lendemain, une enveloppe sur mon chariot : 500 € et un post-it « merci pour ta discrétion ».", "J'ai fait demi-tour. Le lendemain, la table de conférence avait besoin d'un nettoyage spécial. J'ai facturé des heures sup' « produit décapant »."], en: ["I closed it, then vacuumed right outside the door for twenty minutes, very loudly. Next day, an envelope on my cart: $500 and a post-it 'thanks for your discretion'.", "I turned around. Next day the conference table needed a special clean. I billed overtime for 'industrial degreaser'."] }, fx: { money: 500, karma: -2 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Prendre une photo', en: 'Take a photo' }, out: [
        { w: 1, text: { fr: ["Une photo, discrète. Le lendemain, je l'ai montrée au DG, l'air de rien. J'ai été promu{|e} responsable propreté et j'ai une place de parking. Il ne me regarde plus dans les yeux.", "J'ai pris la photo. Elle a fuité, je ne sais pas comment (si, je sais). Scandale, démission du DG. Les collègues m'appellent « le paparazzi au plumeau »."], en: ["One discreet photo. Next day I showed the CEO, casually. I was promoted to facilities manager and got a parking space. He no longer looks me in the eye.", "I took the photo. It leaked, I don't know how (I do). Scandal, CEO resigned. Coworkers call me 'the feather-duster paparazzo'."] }, fx: { promote: true, karma: -6 }, mood: 'proud' },
        { w: 1, text: { fr: ["Le flash s'est déclenché. Ils se sont retournés. Il y a eu un silence de 4 secondes, puis le DG m'a dit : « Vous êtes viré{|e}. » Il n'avait que ses chaussettes, mais il l'a dit avec autorité.", "J'ai oublié de couper le son. « Clic ! » Licenciement le lendemain, motif : « faute professionnelle » — ironique, vu où ils étaient."], en: ["The flash went off. They turned around. Four seconds of silence, then the CEO said: 'You're fired.' He was only in socks, but he said it with authority.", "I forgot to mute the camera. 'Click!' Fired the next day for 'professional misconduct' — ironic, given where they were."] }, fx: { fired: true, happy: -4 }, mood: 'shock' },
      ] },
      { label: { fr: '« Je repasse plus tard ? »', en: '"Should I come back later?"' }, text: { fr: ["J'ai demandé poliment : « Je repasse plus tard ? » La DRH a répondu « Oui, dans dix minutes ». C'était plutôt trois. J'ai nettoyé. J'ai beaucoup nettoyé.", "« Je vous laisse finir. » Le DG a dit « merci » comme si je venais de lui apporter un café. J'ai attendu dans le couloir en écoutant {w:song} dans mes écouteurs, à fond."], en: ["I politely asked: 'Should I come back later?' The HR director said 'Yes, ten minutes.' It was more like three. I cleaned. I cleaned a lot.", "'I'll let you finish.' The CEO said 'thanks' as if I'd brought him coffee. I waited in the corridor blasting {w:song} in my earbuds."] }, fx: { happy: 4, stress: 2 }, mood: 'happy' },
    ],
  },
  // ───────────────────────────── retail ─────────────────────────────
  {
    id: 'c3_retail_fold', icon: '👕', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'angry', prop: 'clothes' },
    when: { job: 'retail' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Samedi, 17 h. Tu viens de passer 40 minutes à plier [[200|300|450]] t-shirts au millimètre. Une cliente déplie toute la pile, regarde chaque taille, puis demande : « Vous l'avez en réserve ? »",
        "Un client essaie onze jeans, les laisse en boule dans la cabine, ressort et déclare : « Bof. Vous avez la même chose, mais différent ? »",
        "Une cliente rapporte un pull porté, déformé, qui dégage {w:smell}, sans ticket, acheté « il y a deux ou trois ans, chez vous ou chez un concurrent ». Elle veut un remboursement en liquide.",
        "Ta responsable de magasin t'annonce l'objectif du jour : vendre 40 cartes de fidélité. Il est 18 h 30. Tu en as vendu une. À ta mère.",
      ],
      en: [
        "Saturday, 5 p.m. You just spent 40 minutes folding [[200|300|450]] t-shirts to the millimetre. A customer unfolds the whole stack, checks every size, then asks: 'Do you have it in the back?'",
        "A customer tries on eleven pairs of jeans, leaves them balled up in the fitting room, walks out and announces: 'Meh. Do you have the same thing, but different?'",
        "A customer returns a worn, stretched sweater that gives off {w:smell}, no receipt, bought 'two or three years ago, here or at a competitor'. She wants a cash refund.",
        "Your store manager announces today's target: sell 40 loyalty cards. It's 6:30 p.m. You've sold one. To your mum.",
      ],
    },
    choices: [
      { label: { fr: 'Sourire commercial', en: 'Customer-service smile' }, out: [
        { w: 2, text: { fr: ["« Je vais voir en réserve ! » Je suis allé{|e} m'asseoir dix minutes dans la réserve, à côté d'un carton vide, à regarder le plafond. Je suis revenu{|e} : « Désolé{|e}, plus rien. » Paix intérieure.", "J'ai souri si fort que mes joues ont tremblé. La cliente m'a trouvé{|e} « charmant{|e} » et a acheté quatre articles. J'ai fondu en larmes dans la cabine 3."], en: ["'Let me check the back!' I sat in the stockroom for ten minutes next to an empty box, staring at the ceiling. Came back: 'Sorry, nothing left.' Inner peace.", "I smiled so hard my cheeks shook. The customer found me 'charming' and bought four items. I burst into tears in fitting room 3."] }, fx: { perf: 6, stress: 4 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Répondre sèchement', en: 'Snap back' }, out: [
        { w: 1, text: { fr: ["« Non, madame, la réserve, c'est ce que vous venez de déplier. » Elle m'a regardé{|e} comme si j'avais insulté {w:animal}. Elle a demandé ma responsable. Ma responsable m'a donné raison, en privé. Et tort, en public.", "J'ai dit « La même chose mais différent, ça s'appelle un autre magasin. » Un client derrière a ri. Mon avis Google personnel est tombé à 2,1."], en: ["'No, ma'am, the back is what you just unfolded.' She looked at me like I'd insulted {w:animal}. She asked for my manager. My manager agreed with me in private. And disagreed in public.", "I said 'The same thing but different is called another store.' A customer behind laughed. My personal Google rating fell to 2.1."] }, fx: { perf: -6, happy: 6 }, mood: 'angry' },
      ] },
      { label: { fr: 'Lui refourguer une carte', en: 'Upsell a loyalty card' }, out: [
        { w: 1, odds: { looks: 1 }, text: { fr: ["Je lui ai vendu la carte de fidélité, la garantie prolongée et un parapluie. Elle est repartie ravie sans le t-shirt. Objectif atteint. Ma responsable m'a appelé{|e} « le requin du rayon ».", "J'ai profité de sa confusion pour lui faire signer trois cartes de fidélité. Elle en a maintenant trois. Elle ne sait pas pourquoi. Moi, j'ai une prime."], en: ["I sold her the loyalty card, the extended warranty and an umbrella. She left delighted without the t-shirt. Target hit. My manager called me 'the aisle shark'.", "I used her confusion to sign her up for three loyalty cards. She now has three. She doesn't know why. I have a bonus."] }, fx: { perf: 10, money: 100, karma: -3 }, mood: 'proud' },
        { w: 1, odds: { looks: -1 }, text: { fr: ["« Une carte ? Vous me prenez pour une pigeonne ? » Elle est partie en laissant la pile par terre. J'ai replié. J'ai replié toute ma vie, je crois.", "Elle a refusé, puis elle a demandé à me parler « en tant qu'ancienne commerciale ». J'ai eu droit à 25 minutes de conseils non sollicités."], en: ["'A card? You think I'm a sucker?' She left the pile on the floor. I refolded. I think I've been refolding my whole life.", "She refused, then asked to talk to me 'as a former saleswoman'. I got 25 minutes of unsolicited advice."] }, fx: { perf: -3, stress: 4 }, mood: 'sad' },
      ] },
    ],
  },
  {
    id: 'c3_retail_fitting', icon: '🚪', cat: 'job', rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'curtain' },
    when: { job: 'retail' }, weight: 8, cooldown: 4,
    text: {
      fr: [
        "Cabine d'essayage n°4. Un couple y est entré « pour essayer une robe » il y a 25 minutes. Le rideau tremble. Une chaussure d'homme dépasse. Puis une jambe. Puis un bruit qui n'est pas celui d'une fermeture éclair.",
        "La cabine du fond fait des bruits suspects depuis un quart d'heure. Le miroir est embué. Une cliente attend devant avec une pile de chemisiers et l'air très, très au courant.",
        "Un client sort de la cabine avec un jean neuf. Il porte toujours l'antivol. Et, visiblement, rien en dessous. Derrière lui, une dame se rhabille en vitesse.",
        "Fermeture du magasin. Tu fais le tour des cabines. Dans la dernière : deux clients endormis, enlacés, à moitié habillés avec la nouvelle collection. Il y a {w:drink} vide par terre.",
      ],
      en: [
        "Fitting room 4. A couple went in 'to try on a dress' 25 minutes ago. The curtain is shaking. A man's shoe sticks out. Then a leg. Then a noise that is not a zipper.",
        "The back fitting room has been making suspicious noises for fifteen minutes. The mirror is steamed up. A customer waits outside with a pile of blouses, looking very, very aware.",
        "A customer leaves the fitting room in new jeans. The security tag is still on. And, apparently, nothing underneath. Behind him, a lady is hurriedly getting dressed.",
        "Closing time. You check the fitting rooms. In the last one: two customers asleep, entwined, half-dressed in the new collection. There's {w:drink}, empty, on the floor.",
      ],
    },
    choices: [
      { label: { fr: 'Ouvrir le rideau', en: 'Yank the curtain' }, out: [
        { w: 2, text: { fr: ["J'ai tiré le rideau d'un coup. Ils se sont figés comme dans {w:movie}. J'ai dit : « La robe vous va très bien. » Ils l'ont achetée. Ils l'ont achetée tachée.", "Rideau ouvert. Ils ont crié, j'ai crié, la cliente aux chemisiers a applaudi. Ma responsable a fait passer une note : « Une personne par cabine. »"], en: ["I yanked the curtain open. They froze like in {w:movie}. I said: 'The dress looks great on you.' They bought it. They bought it stained.", "Curtain open. They screamed, I screamed, the blouse lady applauded. My manager sent out a memo: 'One person per fitting room.'"] }, fx: { happy: 6, perf: 4 }, mood: 'happy' },
        { w: 1, text: { fr: ["C'était ma responsable. Avec le livreur. Elle m'a regardé{|e}. J'ai refermé. Le lendemain, j'avais un planning de 7 h à 22 h tous les samedis.", "C'était mon ex. Avec quelqu'un de mieux que moi. Dans la robe que je lui avais offerte. J'ai démissionné en criant dans le rayon chaussettes."], en: ["It was my manager. With the delivery guy. She looked at me. I closed it. Next day my schedule was 7 a.m. to 10 p.m. every Saturday.", "It was my ex. With someone better than me. In the dress I'd given them. I quit, screaming, in the sock aisle."] }, fx: { stress: 10, perf: -4, happy: -6 }, mood: 'shock' },
      ] },
      { label: { fr: 'Annoncer au micro', en: 'Announce it on the PA' }, text: { fr: ["« Le client de la cabine 4 est prié de terminer son essayage. » Tout le magasin a compris. Ils sont sortis sous les applaudissements, rouges comme des homards. Elle a quand même acheté la robe.", "« Rappel : nos cabines ne sont pas des chambres d'hôtel. » Les deux sont sortis tête baissée. Un client a crié « BRAVO ! ». Je ne sais pas à qui il s'adressait."], en: ["'Would the customer in fitting room 4 please finish trying on.' The whole store understood. They walked out to applause, red as lobsters. She still bought the dress.", "'Reminder: our fitting rooms are not hotel rooms.' Both came out heads down. Someone shouted 'BRAVO!'. I don't know who he meant."] }, fx: { happy: 8, perf: 2 }, mood: 'happy' },
      { label: { fr: 'Laisser faire', en: 'Let them be' }, text: { fr: ["Je suis allé{|e} plier des pulls ailleurs. Vingt minutes plus tard, ils sont sortis, ont acheté pour 600 € et m'ont laissé un pourboire. Le commerce, c'est aussi de la tolérance.", "J'ai mis un panneau « Cabine en maintenance » et je suis allé{|e} en pause. Quand je suis revenu{|e}, il y avait un string oublié et un billet de 50 €. J'ai gardé le billet."], en: ["I went to fold sweaters elsewhere. Twenty minutes later they came out, bought $600 worth and tipped me. Retail is also about tolerance.", "I put up an 'Out of order' sign and went on break. When I came back there was a forgotten thong and a $50 bill. I kept the bill."] }, fx: { money: 50, karma: 2 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── driver (VTC) ─────────────────────────────
  {
    id: 'c3_vtc_labor', icon: '🤰', cat: 'job', rating: 0,
    scene: { place: 'park', mood: 'shock', prop: 'car' },
    when: { job: 'driver' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Une passagère monte, haletante, une main sur le ventre : « Maternité, VITE ! » Puis : « Oh. Oh non. » Il y a de l'eau sur tes sièges en cuir neufs. Le GPS annonce [[22|31|47]] minutes.",
        "Ton client, en costume, hurle : « Suivez cette ambulance, ma femme accouche dedans ! » L'ambulance part dans l'autre sens. Il est 18 h, périphérique, bouchon monstre.",
        "Course pour l'aéroport. Ton client est {w:weird_job} et transporte un aquarium sur ses genoux. Il te dit qu'il a un vol dans 35 minutes. L'aéroport est à 50 minutes.",
        "Un client monte avec trois valises, une harpe et {w:animal}. « Gare de Lyon, mon train part dans 12 minutes, je vous donne 100 balles si on y est. »",
      ],
      en: [
        "A passenger gets in, panting, hand on her belly: 'Maternity ward, FAST!' Then: 'Oh. Oh no.' There's water on your brand-new leather seats. GPS says [[22|31|47]] minutes.",
        "Your client, in a suit, yells: 'Follow that ambulance, my wife's giving birth in it!' The ambulance goes the other way. It's 6 p.m., ring road, monster traffic.",
        "Airport run. Your client is {w:weird_job} and carries an aquarium on his lap. He says his flight leaves in 35 minutes. The airport is 50 minutes away.",
        "A client gets in with three suitcases, a harp and {w:animal}. 'Train station, my train leaves in 12 minutes, 100 bucks if we make it.'",
      ],
    },
    choices: [
      { label: { fr: 'Rouler comme un fou', en: 'Drive like a maniac' }, out: [
        { w: 2, text: { fr: ["Couloir de bus, trottoir, sens interdit, rond-point à l'envers. On est arrivés avec deux minutes d'avance. Le bébé est né dans le hall. Ils l'ont appelé comme moi. Enfin, comme ma marque de voiture.", "J'ai roulé comme dans {w:movie}. Le client est arrivé à temps et m'a donné 150 €. J'ai reçu quatre flashs radar. Ça fait 540 €. Bonne affaire, non ?"], en: ["Bus lane, pavement, one-way street, roundabout backwards. We arrived two minutes early. The baby was born in the lobby. They named it after me. Well, after my car brand.", "I drove like in {w:movie}. The client made it and gave me $150. I got four speed-camera flashes. That's $540. Good deal, right?"] }, fx: { money: 150, perf: 8, stress: 6 }, mood: 'proud' },
        { w: 1, text: { fr: ["Contrôle de police au bout de 3 km. Le temps de leur expliquer, le bébé était né. Sur ma banquette. Le policier a coupé le cordon avec ses ciseaux de poche. Nettoyage : 400 €.", "On a raté le train de 30 secondes. Le client m'a mis une étoile et a laissé la harpe dans le coffre. Je joue de la harpe maintenant. Mal."], en: ["Police stop after 2 miles. By the time we'd explained, the baby was born. On my back seat. The cop cut the cord with his pocket scissors. Cleaning: $400.", "We missed the train by 30 seconds. One star, and he left the harp in my trunk. I play the harp now. Badly."] }, fx: { money: -400, perf: -4, happy: 2 }, mood: 'shock' },
      ] },
      { label: { fr: 'Respecter le code', en: 'Follow the rules' }, out: [
        { w: 1, text: { fr: ["Je suis resté{|e} à 50. Le bébé est né au feu rouge, avenue Foch. J'ai aidé avec une serviette et une bouteille d'eau. Les parents m'ont mis 5 étoiles et une photo floue du placenta.", "Prudence avant tout. Le client a raté son avion et a passé le trajet à m'expliquer que j'étais « le problème de ce pays ». Je lui ai proposé un bonbon."], en: ["I stuck to the limit. The baby was born at a red light. I helped with a towel and a water bottle. The parents gave me 5 stars and a blurry photo of the placenta.", "Safety first. The client missed his flight and spent the ride explaining I'm 'what's wrong with this country'. I offered him a mint."] }, fx: { karma: 4, perf: 2, happy: -2 }, mood: 'neutral' },
      ] },
    ],
  },
  {
    id: 'c3_vtc_backseat', icon: '🚘', cat: 'job', rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'car' },
    when: { job: 'driver' }, weight: 8, cooldown: 4,
    text: {
      fr: [
        "Minuit, deux passagers éméchés sortent de boîte. Au deuxième feu, tu entends des bruits de ventouse. Dans le rétroviseur, tu ne vois plus de têtes. Juste une chaussure qui tape contre la vitre.",
        "Ton client a pris l'option « Silence » et commandé un « trajet long, par les petites routes ». Avec lui, une dame en robe à paillettes. Ils ont fermé le rideau imaginaire de l'intimité. Tu n'as pas de rideau.",
        "Les deux passagers derrière ont décidé que ton véhicule était une suite nuptiale. Ta voiture tangue au feu rouge. Les gens dans la voiture d'à côté filment et lèvent le pouce.",
        "Course de 40 minutes vers la banlieue. À mi-chemin, une main pose un billet de 50 € sur ton accoudoir : « Montez le son, s'il vous plaît. » Tu mets {w:song}. Ça n'aide pas.",
      ],
      en: [
        "Midnight, two tipsy passengers leave a club. At the second light you hear suction noises. In the rear-view mirror, no more heads. Just a shoe tapping the window.",
        "Your client picked 'Quiet ride' and asked for a 'long trip, back roads'. With him, a lady in a sequin dress. They drew the imaginary curtain of privacy. You have no curtain.",
        "The two passengers in the back decided your car is a honeymoon suite. The car rocks at the red light. People in the next car film and give a thumbs up.",
        "40-minute ride to the suburbs. Halfway, a hand places a $50 bill on your armrest: 'Turn up the music, please.' You put on {w:song}. It doesn't help.",
      ],
    },
    choices: [
      { label: { fr: 'Piler et les virer', en: 'Brake and kick them out' }, out: [
        { w: 2, text: { fr: ["J'ai pilé. Ils ont fini emmêlés contre les sièges avant, comme un bretzel humain. Je les ai déposés au bord de la route, à moitié habillés. Une étoile chacun. Ça valait le coup.", "Arrêt d'urgence, warnings, porte ouverte. « Dehors. » Ils sont sortis en tenant leurs vêtements. Un bus de nuit est passé. Le chauffeur m'a fait un salut respectueux."], en: ["I slammed on the brakes. They ended up tangled against the front seats like a human pretzel. I dropped them by the roadside, half-dressed. One star each. Worth it.", "Emergency stop, hazards, door open. 'Out.' They got out holding their clothes. A night bus went by. The driver gave me a respectful salute."] }, fx: { happy: 4, perf: -2, karma: 2 }, mood: 'angry' },
      ] },
      { label: { fr: 'Monter le son et le tarif', en: 'Raise the volume and the fare' }, out: [
        { w: 2, text: { fr: ["J'ai mis {w:band} à fond et activé la « surge pricing » morale. 200 € de pourboire. Le nettoyage des sièges en a coûté 180. Bénéfice net : 20 € et un traumatisme.", "Musique à fond, yeux sur la route. À l'arrivée, ils m'ont remercié{|e} chaleureusement. Trop chaleureusement. J'ai passé les sièges au Kärcher le soir même."], en: ["I blasted {w:band} and applied moral surge pricing. $200 tip. Seat cleaning cost $180. Net profit: $20 and trauma.", "Music up, eyes on the road. At drop-off they thanked me warmly. Too warmly. I pressure-washed the seats that night."] }, fx: { money: 200, happy: -2 }, mood: 'neutral' },
        { w: 1, text: { fr: ["Un des deux était marié. À la passagère d'une autre voiture VTC, qui nous suivait. Elle a percuté mon pare-chocs. Tout le monde a fini au commissariat. Moi, sans mon permis.", "La vidéo des voisins de feu rouge est devenue virale : « La Clio qui danse ». On voit ma plaque. La plateforme m'a désactivé{|e}."], en: ["One of them was married. To the passenger of another ride-share car following us. She rear-ended me. Everyone ended up at the station. Me, without my licence.", "The video from the car at the light went viral: 'The Dancing Hatchback'. My plate is visible. The platform deactivated me."] }, fx: { fired: true, followers: 2000 }, mood: 'shock' },
      ] },
    ],
  },
  // ───────────────────────────── hairdresser ─────────────────────────────
  {
    id: 'c3_hair_photo', icon: '💇', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'shock', prop: 'scissors' },
    when: { job: 'hairdresser' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Une cliente te montre une photo où {w:celeb} arbore une crinière de lionne volumineuse. Elle-même a trois cheveux fins, des pointes brûlées par 15 ans de lisseur, et une confiance absolue.",
        "Un client chauve sur le dessus, avec une couronne de cheveux longs sur les côtés, te demande « une coupe qui cache rien mais qui suggère beaucoup ».",
        "Une cliente veut un « blond polaire » à partir d'un noir corbeau, en une seule séance, en 45 minutes, pour son mariage dans 2 heures. Elle a déjà mis du henné hier.",
        "Un ado te tend son téléphone : une photo de son footballeur préféré, avec dégradé, motif d'éclair rasé et mèche bleue. Sa mère, derrière, fait « non » de la tête très lentement.",
      ],
      en: [
        "A client shows you a photo of {w:celeb} with a voluminous lion's mane. She herself has three thin hairs, ends fried by 15 years of flat-ironing, and total confidence.",
        "A client, bald on top with a ring of long hair at the sides, asks for 'a cut that hides nothing but suggests a lot'.",
        "A client wants 'platinum blonde' from jet black, in one session, in 45 minutes, for her wedding in 2 hours. She did henna yesterday.",
        "A teen hands you his phone: a photo of his favourite footballer, with a fade, a shaved lightning bolt and a blue streak. His mother, behind him, is slowly shaking her head.",
      ],
    },
    choices: [
      { label: { fr: 'Tenter le miracle', en: 'Attempt the miracle' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["Volume, crêpage, laque, prières. Elle s'est regardée dans le miroir et a pleuré de joie. Elle a posté une photo avec « Merci à mon génie ». [[40|60|25]] nouvelles clientes en une semaine.", "J'ai fait un truc que je ne saurais pas refaire. C'était magnifique. Le client m'a laissé 50 € et m'a embrassé{|e} sur le front. Je n'ai jamais revu ce niveau."], en: ["Volume, backcombing, hairspray, prayers. She looked in the mirror and wept with joy. Posted a photo: 'Thanks to my genius'. [[40|60|25]] new clients in a week.", "I did something I could never repeat. It was gorgeous. The client tipped $50 and kissed my forehead. I've never hit that level again."] }, fx: { perf: 10, money: 50, followers: 300 }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["Le décolorant a réagi avec le henné. Ça a fumé. Ça a fait {w:sound}. Ses cheveux sont devenus vert pomme et ils se sont cassés en touffes. Elle s'est mariée en chapeau.", "J'ai raté le dégradé. Puis j'ai rattrapé. Puis j'ai raté le rattrapage. Il est reparti avec la boule à zéro. Sa mère m'a donné un pourboire."], en: ["The bleach reacted with the henna. It smoked. It made {w:sound}. Her hair turned apple green and snapped off in clumps. She got married in a hat.", "I botched the fade. Then I fixed it. Then I botched the fix. He left with a buzz cut. His mother tipped me."] }, fx: { perf: -10, stress: 8 }, mood: 'shock' },
      ] },
      { label: { fr: 'Dire la vérité', en: 'Tell the truth' }, text: { fr: ["« Madame, je suis coiff{eur|euse}, pas magicien{|ne}. » Elle a ri, puis pleuré, puis accepté un carré court. Elle était ravissante. Elle me déteste quand même.", "J'ai expliqué avec tact que la photo était retouchée et que {w:celeb} portait une perruque. Elle a demandé si je vendais des perruques. Oui. Vente."], en: ["'Ma'am, I'm a hairdresser, not a wizard.' She laughed, then cried, then agreed to a short bob. She looked lovely. She hates me anyway.", "I tactfully explained the photo was retouched and {w:celeb} wears a wig. She asked if I sold wigs. Yes. Sale."] }, fx: { perf: 4, karma: 3 }, mood: 'neutral' },
    ],
  },
  {
    id: 'c3_hair_gossip', icon: '✂️', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'shock', prop: 'scissors' },
    when: { job: 'hairdresser' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Pendant ta coloration, Mme Lambert t'avoue, ravie, qu'elle trompe son mari avec leur voisin, un moniteur d'auto-école « au toucher de levier exceptionnel ». Son mari est ton rendez-vous de 15 h.",
        "Ta cliente du mardi te raconte tous ses secrets : la liaison de sa sœur, les dettes de son beau-frère, et la vraie couleur de ses cheveux. Puis elle ajoute : « Tu ne dis rien, hein ? » Son beau-frère est sous le casque à côté.",
        "Une cliente te confie que son mari « ne sait pas » pour ses implants, son tatouage et son amant. Elle te demande une coupe « qui fait innocente ». Son mari attend dans la voiture.",
        "M. Bertrand, ton client fidèle, te demande de lui raser la nuque « parce que ma maîtresse trouve ça sexy ». Ta cliente suivante est Mme Bertrand. Elle est en avance.",
      ],
      en: [
        "During her colour, Mrs Lambert happily admits she's cheating on her husband with their neighbour, a driving instructor with 'an exceptional touch on the gear stick'. Her husband is your 3 p.m.",
        "Your Tuesday client tells you all her secrets: her sister's affair, her brother-in-law's debts, and her real hair colour. Then: 'You won't say anything, right?' Her brother-in-law is under the dryer next to her.",
        "A client confides that her husband 'doesn't know' about her implants, her tattoo and her lover. She asks for a cut that 'looks innocent'. Her husband is waiting in the car.",
        "Mr Bertrand, your loyal client, asks you to shave his neck 'because my mistress finds it sexy'. Your next client is Mrs Bertrand. She's early.",
      ],
    },
    choices: [
      { label: { fr: 'Se taire et couper', en: 'Stay quiet and cut' }, out: [
        { w: 2, text: { fr: ["Secret professionnel du ciseau. J'ai coupé le mari à 15 h en parlant de foot et de météo. Je connais maintenant les secrets de la moitié de la ville. J'ai un pouvoir immense. J'en fais des brushings.", "Je n'ai rien dit. Ils m'ont tous les deux laissé un gros pourboire. Les infidèles sont généreux. La culpabilité, ça se paie en liquide."], en: ["Scissor confidentiality. I cut the husband at 3 talking football and weather. I now know half the town's secrets. Immense power. I use it for blow-dries.", "I said nothing. They both tipped big. Cheaters are generous. Guilt pays in cash."] }, fx: { money: 60, perf: 4, karma: -1 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Lâcher une allusion', en: 'Drop a hint' }, out: [
        { w: 1, text: { fr: ["J'ai demandé au mari, innocemment, s'il avait « pris des leçons de conduite récemment ». Il a blêmi. Le lendemain, la nouvelle a fait le tour du quartier. Mon salon est devenu le centre du monde. Clientèle +30 %.", "J'ai fredonné « J'ai un secret » pendant tout le shampooing. Il a compris. Divorce. Ils sont tous les deux restés clients. Séparément. Le mardi et le jeudi."], en: ["I innocently asked the husband if he'd 'taken any driving lessons lately'. He went pale. Next day the whole neighbourhood knew. My salon became the centre of the world. Clients +30%.", "I hummed 'I've got a secret' through the whole shampoo. He got it. Divorce. Both stayed clients. Separately. Tuesdays and Thursdays."] }, fx: { perf: 6, karma: -4, happy: 6 }, mood: 'happy' },
        { w: 1, text: { fr: ["Le mari a compris, mais il a aussi compris que je savais depuis des mois. Il m'a fait une scène, la femme m'a fait une scène, le moniteur d'auto-école m'a fait une scène. Trois avis une étoile.", "J'ai fait une allusion trop claire. Elle a deviné que c'était moi qui avais parlé. Elle a raconté à tout le quartier que j'utilisais des produits périmés. C'était vrai, en plus."], en: ["The husband got it, but also got that I'd known for months. He made a scene, she made a scene, the driving instructor made a scene. Three one-star reviews.", "My hint was too obvious. She guessed I'd talked. She told the whole neighbourhood I use expired products. Which was true, actually."] }, fx: { perf: -8, stress: 6 }, mood: 'angry' },
      ] },
    ],
  },
  // ───────────────────────────── farmer ─────────────────────────────
  {
    id: 'c3_farm_neorural', icon: '🐓', cat: 'job', rating: 1,
    scene: { place: 'park', mood: 'angry', prop: 'tractor' },
    when: { job: 'farmer' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Un couple de Parisiens s'est installé dans la longère d'à côté « pour le calme ». Ils viennent de porter plainte contre ton coq, tes vaches, ton tracteur, et « l'odeur générale de la campagne ».",
        "Tes nouveaux voisins citadins exigent que ton coq chante « après 9 h, comme tout le monde ». Ils ont fait signer une pétition. Trois signatures : eux deux et leur chien.",
        "Un voisin en trottinette électrique t'arrête au milieu de ton champ : « Votre épandage de fumier, là, c'est vraiment nécessaire le week-end ? On a des invités. » Ça dégage {w:smell}, mais en pire.",
        "Une néo-rurale influenceuse veut tourner un « reel authentique » dans ta ferme. Elle demande si elle peut « traire la vache sans toucher le pis » et si tu as « des poules plus photogéniques ».",
      ],
      en: [
        "A couple of city folk moved into the farmhouse next door 'for the peace'. They just filed complaints against your rooster, your cows, your tractor and 'the general smell of the countryside'.",
        "Your new urban neighbours demand your rooster crow 'after 9 a.m., like everyone else'. They started a petition. Three signatures: the two of them and their dog.",
        "A neighbour on an e-scooter stops you in the middle of your field: 'Your manure spreading — is it really necessary on weekends? We have guests.' It gives off {w:smell}, but worse.",
        "A back-to-the-land influencer wants to shoot an 'authentic reel' on your farm. She asks if she can 'milk the cow without touching the udder' and whether you have 'more photogenic chickens'.",
      ],
    },
    choices: [
      { label: { fr: 'Épandre face au vent', en: 'Spread upwind of them' }, out: [
        { w: 2, text: { fr: ["J'ai attendu le vent d'ouest et leur garden-party du dimanche. Trois tonnes de lisier. Les invités sont partis en vomissant dans les hortensias. Les voisins ont mis la maison en vente le lundi.", "Épandage à 6 h du matin, juste sous leur fenêtre, avec le coq perché sur le tracteur. Ils ont déménagé à Paris. Le coq a reçu une médaille de la mairie."], en: ["I waited for the west wind and their Sunday garden party. Three tonnes of slurry. Guests left vomiting into the hydrangeas. They listed the house on Monday.", "Spreading at 6 a.m. right under their window, with the rooster perched on the tractor. They moved back to the city. The rooster got a medal from the town hall."] }, fx: { happy: 10, karma: -3 }, mood: 'party' },
        { w: 1, text: { fr: ["Ils ont filmé et porté plainte. Le juge, un citadin lui aussi, m'a condamné{|e} à 1 500 € d'amende pour « nuisance olfactive volontaire ». Le coq a fait un recours.", "Leur avocat est venu constater, a marché dans une bouse, est tombé dedans. Il m'a quand même gagné{|e} au tribunal. Il avait encore de la bouse sur le costume."], en: ["They filmed it and sued. The judge, also a city boy, fined me $1,500 for 'deliberate olfactory nuisance'. The rooster appealed.", "Their lawyer came to inspect, stepped in a cowpat, fell in it. He still beat me in court. He still had manure on his suit."] }, fx: { money: -1500, stress: 6 }, mood: 'angry' },
      ] },
      { label: { fr: 'Les inviter à la traite', en: 'Invite them to milking' }, out: [
        { w: 1, text: { fr: ["Je les ai fait venir à 5 h pour la traite. Elle s'est fait gifler par une queue de vache pleine de bouse, lui a reçu un coup de sabot dans le tibia. Ils ont tout compris à la ruralité. Ils sont devenus végans.", "Ils sont venus, ils ont adoré, ils ont acheté du lait cru, ils ont été malades trois jours. Ils ont retiré la plainte. Ils me disent bonjour maintenant. Avec un masque."], en: ["I had them over at 5 a.m. for milking. She got slapped by a poop-coated cow tail, he got kicked in the shin. They fully understood rural life. They went vegan.", "They came, loved it, bought raw milk, were sick for three days. Dropped the complaint. They say hello now. With a mask on."] }, fx: { karma: 4, happy: 4, money: 40 }, mood: 'happy' },
      ] },
    ],
  },
  {
    id: 'c3_farm_combine', icon: '🚜', cat: 'job', rating: 2,
    scene: { place: 'park', mood: 'shock', fx: 'gore' },
    when: { job: 'farmer' }, weight: 7, cooldown: 5,
    text: {
      fr: [
        "Moisson. La moissonneuse-batteuse s'est bloquée. Tu vois une botte de paille coincée dans les lames. Le moteur tourne encore. Ton voisin te crie : « COUPE LE MOTEUR, CRÉTIN ! »",
        "Le bélier du troupeau, surnommé « {w:nickname} », te fixe depuis l'autre bout du pré. Il gratte le sol. Tu portes un pull rouge. Tu aurais dû y penser.",
        "La fosse à lisier déborde. Tu t'approches avec une planche pour déboucher le tuyau. La planche craque. Ça dégage {w:smell}, multiplié par la mort.",
        "Ton vieux tracteur de 1974, sans arceau, refuse de démarrer en côte. Tu le pousses. Il démarre. Tout seul. En marche arrière. Vers toi.",
      ],
      en: [
        "Harvest time. The combine is jammed. A bale of straw is caught in the blades. The engine's still running. Your neighbour yells: 'KILL THE ENGINE, YOU MORON!'",
        "The flock's ram, nicknamed '{w:nickname}', is staring at you from across the field. He paws the ground. You're wearing a red jumper. You should have thought of that.",
        "The slurry pit is overflowing. You approach with a plank to unclog the pipe. The plank creaks. It gives off {w:smell}, multiplied by death.",
        "Your 1974 tractor, no roll bar, won't start on the slope. You push it. It starts. By itself. In reverse. Toward you.",
      ],
    },
    choices: [
      { label: { fr: 'Y aller à la main', en: 'Go in by hand' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai débloqué ça d'un geste viril. J'y ai laissé un ongle et un bout de manche, mais j'ai fini la moisson avant l'orage. Mon père aurait été fier. Il est mort comme ça, en fait.", "Saut de côté in extremis. Je m'en sors avec {w:bodypart} en vrac et un traumatisme durable. La récolte est sauvée. J'ai crié pendant dix minutes dans le champ, seul{|e}."], en: ["I unjammed it with one manly move. Lost a fingernail and part of a sleeve, but finished the harvest before the storm. Dad would've been proud. That's actually how he died.", "Last-second side-jump. I got away with a wrecked {w:bodypart} and lasting trauma. Harvest saved. I screamed alone in the field for ten minutes."] }, fx: { health: -6, money: 800, perf: 6 }, mood: 'proud' },
        { w: 2, odds: { athletic: -1 }, text: { fr: ["Les lames m'ont pris deux doigts. Ils sont ressortis à l'arrière, dans une botte de paille parfaitement cubique. Je les ai gardés dans un bocal. Les enfants du village viennent les voir.", "Je suis tombé{|e} dans la fosse à lisier jusqu'au cou. Les pompiers m'ont sorti{|e} avec une corde. J'ai vomi pendant trois jours et j'ai perdu l'odorat. C'est peut-être une chance."], en: ["The blades took two fingers. They came out the back, inside a perfectly cubic straw bale. I keep them in a jar. Village kids come to see them.", "I fell into the slurry pit up to my neck. Firefighters pulled me out with a rope. I vomited for three days and lost my sense of smell. Maybe a blessing."] }, fx: { health: -15, disease: 'missing_finger', perf: -4, visual: 'gore' }, mood: 'sick' },
        { w: 0.3, text: { fr: ["La moissonneuse m'a aspiré{|e}. Il est sorti de l'autre côté une botte de paille rouge vif, joliment ficelée. On l'a enterrée telle quelle. Le pasteur a dit que j'aimais les choses carrées.", "Le tracteur m'a roulé dessus, puis il a calé, comme gêné. Le bélier est venu renifler, puis il a mangé mon chapeau. Fin."], en: ["The combine swallowed me. Out the other side came a bright red straw bale, neatly tied. They buried it as is. The pastor said I always liked things square.", "The tractor rolled over me, then stalled, as if embarrassed. The ram came over to sniff, then ate my hat. The end."] }, fx: { die: { fr: 'transformé{|e} en botte de paille par ma moissonneuse-batteuse', en: 'baled by my own combine harvester' }, visual: 'gore' }, mood: 'shock' },
      ] },
      { label: { fr: 'Appeler le voisin', en: 'Call the neighbour' }, text: { fr: ["J'ai attendu le voisin, qui est venu avec une clé de 12 et une bouteille de calva. On a réparé en deux heures, bu en trois. J'ai perdu une demi-journée et un foie. Mais j'ai tous mes doigts.", "Le voisin a dit « Faut jamais faire ça tout seul » et m'a raconté la mort de son cousin en détail. Puis il a débloqué ça en 30 secondes. Je lui dois un cochon."], en: ["I waited for the neighbour, who brought a wrench and a bottle of apple brandy. Fixed it in two hours, drank for three. Lost half a day and a liver. But I have all my fingers.", "The neighbour said 'Never do that alone' and described his cousin's death in detail. Then unjammed it in 30 seconds. I owe him a pig."] }, fx: { money: -100, happy: 4, health: -1 }, mood: 'happy' },
    ],
  },
  // ───────────────────────────── mechanic ─────────────────────────────
  {
    id: 'c3_mech_noise', icon: '🔧', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'neutral', prop: 'wrench' },
    when: { job: 'mechanic' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Un client t'explique le bruit que fait sa voiture : « C'est comme {w:sound}, mais en plus aigu, et seulement quand je tourne à gauche en pensant à ma belle-mère. »",
        "Une cliente arrive : « Elle fait un bruit bizarre. » Tu démarres la voiture. Silence parfait. Elle insiste. Elle imite le bruit. C'est le bruit d'une poule qu'on étrangle. Avec des gestes.",
        "Un client te jure qu'il « n'a rien touché ». Sous le capot : du scotch, un élastique de bureau, {w:object} et un morceau de chewing-gum en guise de joint de culasse.",
        "Un client vient pour un voyant orange sur le tableau de bord. Il a collé un post-it dessus depuis huit mois. Le post-it dit « plus tard ». C'est maintenant plus tard.",
      ],
      en: [
        "A client describes his car's noise: 'It's like {w:sound}, but higher, and only when I turn left while thinking about my mother-in-law.'",
        "A client arrives: 'It makes a weird noise.' You start the car. Perfect silence. She insists. She imitates the noise. It's the sound of a chicken being strangled. With gestures.",
        "A client swears he 'didn't touch anything'. Under the bonnet: tape, an office rubber band, {w:object} and a piece of chewing gum as a head gasket.",
        "A client comes in for an orange warning light on the dashboard. He covered it with a post-it eight months ago. The post-it says 'later'. It's now later.",
      ],
    },
    choices: [
      { label: { fr: 'Chercher le vrai problème', en: 'Find the real problem' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["Deux heures sous la voiture. J'ai trouvé : un nid de souris avec six bébés dans le filtre à air. C'était eux, le bruit. Le client les a adoptés. Il les a appelés comme les cylindres.", "J'ai trouvé une canette coincée dans le pare-chocs. Réparé en 30 secondes. J'ai facturé une heure. Le client m'a trouvé{|e} « très rapide ». C'est vrai."], en: ["Two hours under the car. Found it: a mouse nest with six babies in the air filter. They were the noise. The client adopted them. Named them after the cylinders.", "Found a can stuck in the bumper. Fixed in 30 seconds. Billed an hour. The client found me 'very fast'. True."] }, fx: { perf: 8, money: 80 }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["J'ai démonté la moitié du moteur. Le bruit venait de son porte-clés qui tapait contre le volant. J'ai remonté le moteur. Il reste trois vis. Je ne sais pas où elles vont. On verra.", "Je n'ai jamais trouvé. Je lui ai changé l'autoradio. Le bruit est toujours là, mais maintenant elle peut écouter {w:band} par-dessus."], en: ["I took half the engine apart. The noise was her keyring tapping the steering wheel. Put the engine back. Three screws left over. Don't know where they go. We'll see.", "Never found it. I replaced her car radio. The noise is still there, but now she can play {w:band} over it."] }, fx: { perf: -4, stress: 4 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Imiter le bruit avec lui', en: 'Make the noise with him' }, text: { fr: ["On a passé dix minutes à faire des bruits de moteur ensemble dans l'atelier. Mon patron nous a filmés. La vidéo tourne sur le groupe WhatsApp des garages de la région. Je suis une star locale.", "J'ai répondu par un autre bruit. Il a répondu. On a fait un duo. Il est reparti sans réparation, ravi, avec l'impression d'avoir été écouté. Gratuit."], en: ["We spent ten minutes making engine noises together in the workshop. My boss filmed us. The video's going around the regional garages' WhatsApp group. I'm a local star.", "I answered with another noise. He answered back. We did a duet. He left without a repair, happy, feeling heard. Free."] }, fx: { happy: 6, perf: -2 }, mood: 'happy' },
    ],
  },
  {
    id: 'c3_mech_upsell', icon: '🛞', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'neutral', prop: 'wrench' },
    when: { job: 'mechanic' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Mme Fernandez, 82 ans, vient pour une vidange. Ton patron te glisse : « Dis-lui que le carburateur est foutu, les plaquettes aussi, et que le liquide de clignotant est à changer. » Il n'existe pas de liquide de clignotant.",
        "Ton patron a un objectif de chiffre. Il te demande de « trouver » 800 € de réparations sur la Twingo d'un étudiant qui vient juste pour un pneu crevé.",
        "Un client roule en Porsche et n'y connaît rien. Ton patron se frotte les mains : « Celui-là, on lui change le moteur, l'âme et l'huile de coude. »",
        "Le patron t'apprend la « technique du capot » : ouvrir, faire une grimace, dire « Ouh là… », et attendre que le client panique. Premier test sur un prêtre.",
      ],
      en: [
        "Mrs Fernandez, 82, comes in for an oil change. Your boss whispers: 'Tell her the carburettor's shot, the brake pads too, and the blinker fluid needs replacing.' Blinker fluid doesn't exist.",
        "Your boss has a revenue target. He asks you to 'find' $800 of repairs on a student's hatchback who just came in for a flat tyre.",
        "A client drives a Porsche and knows nothing about cars. Your boss rubs his hands: 'This one gets a new engine, a new soul and a new elbow grease.'",
        "The boss teaches you the 'bonnet technique': open it, wince, say 'Oof…', and wait for the client to panic. First test: a priest.",
      ],
    },
    choices: [
      { label: { fr: 'Arnaquer avec talent', en: 'Scam with flair' }, out: [
        { w: 2, text: { fr: ["J'ai fait la grimace, le « Ouh là » et une petite prière. Facture : 1 200 €. Le client m'a remercié{|e} de lui avoir « sauvé la vie ». Patron ravi. Prime. Je me lave les mains au dégraissant.", "J'ai vendu du liquide de clignotant. 45 € le flacon. C'était de l'eau avec du colorant. Le patron m'a fait une accolade et m'a promis le poste de chef d'atelier."], en: ["I did the wince, the 'Oof' and a little prayer. Invoice: $1,200. The client thanked me for 'saving his life'. Boss thrilled. Bonus. I wash my hands with degreaser.", "I sold blinker fluid. $45 a bottle. It was water with food colouring. The boss hugged me and promised me the foreman job."] }, fx: { money: 300, perf: 10, karma: -10 }, mood: 'neutral' },
        { w: 1, text: { fr: ["Le client était journaliste pour une émission de consommateurs. Caméra cachée. On est passés à la télé, floutés mais reconnaissables. Le garage a fermé. Je suis au chômage et célèbre.", "La cliente de 82 ans était l'ancienne mécanicienne du village. Elle a démonté mon diagnostic pièce par pièce, devant tout le monde. Puis elle a appelé les gendarmes."], en: ["The client was a reporter for a consumer TV show. Hidden camera. We were on TV, blurred but recognisable. The garage closed. I'm unemployed and famous.", "The 82-year-old used to be the village mechanic. She took my diagnosis apart piece by piece in front of everyone. Then she called the police."] }, fx: { fired: true, fame: 3, karma: -6 }, mood: 'shock' },
      ] },
      { label: { fr: 'Faire juste la vidange', en: 'Just do the oil change' }, out: [
        { w: 1, text: { fr: ["J'ai fait la vidange, rien d'autre, et j'ai dit la vérité. Mme Fernandez m'a apporté un gâteau la semaine suivante. Le patron m'a retiré mes heures sup'. Le gâteau était meilleur.", "J'ai réparé le pneu, point. L'étudiant m'a payé{|e} en pizzas. Mon patron m'a regardé{|e} comme si j'avais insulté sa mère. J'ai eu le pire poste de l'atelier : les vidanges de camping-cars."], en: ["I did the oil change, nothing else, and told the truth. Mrs Fernandez brought me a cake the next week. The boss cut my overtime. The cake was better.", "I fixed the tyre, period. The student paid me in pizza. My boss looked at me like I'd insulted his mother. I got the worst job in the shop: RV oil changes."] }, fx: { karma: 8, perf: -6, happy: 3 }, mood: 'proud' },
      ] },
    ],
  },
  // ───────────────────────────── architect ─────────────────────────────
  {
    id: 'c3_arch_client', icon: '📐', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'shock', prop: 'blueprint' },
    when: { job: 'architect' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Ton client veut une villa « style marocain-scandinave, mais avec une touche de château fort ». Il exige un toboggan qui part de sa chambre et finit dans la piscine. Et une salle de bain pour son chien.",
        "Un riche client te montre un croquis fait sur une serviette : une maison qui représente {w:animal}. « C'est symbolique. » Le terrain est en zone protégée, au bord d'une falaise.",
        "Le maire veut une nouvelle médiathèque « audacieuse » mais qui « ne choque personne », « moderne » mais « comme avant », pour un budget de rénovation de cabanon.",
        "Ta cliente change d'avis pour la 34e fois. Aujourd'hui, elle veut que la cuisine soit « plus à l'est ». La maison est déjà construite.",
      ],
      en: [
        "Your client wants a villa 'Moroccan-Scandinavian style, with a touch of medieval castle'. He demands a slide from his bedroom into the pool. And a bathroom for his dog.",
        "A rich client shows you a sketch on a napkin: a house depicting {w:animal}. 'It's symbolic.' The plot is in a protected zone, on a cliff edge.",
        "The mayor wants a new 'bold' library that 'doesn't shock anyone', 'modern' but 'like before', on a garden-shed renovation budget.",
        "Your client changes her mind for the 34th time. Today she wants the kitchen 'more to the east'. The house is already built.",
      ],
    },
    choices: [
      { label: { fr: 'Tout dessiner', en: 'Design it all' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai conçu la chose la plus laide et la plus géniale de ma carrière. Elle a été publiée dans un magazine d'architecture avec le titre « Audace ou démence ? ». Mon cabinet croule sous les commandes.", "Le toboggan, la salle de bain du chien, les tourelles : tout. Le client a pleuré. Il m'a offert {$amount} et une invitation à sa crémaillère, où il est tombé du toboggan."], en: ["I designed the ugliest and most brilliant thing of my career. It ran in an architecture magazine titled 'Daring or Deranged?'. My firm is drowning in commissions.", "The slide, the dog bathroom, the turrets: everything. The client cried. He gave me {$amount} and an invite to his housewarming, where he fell off the slide."] }, fx: { money: 'amount', perf: 12, fame: 2 }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["J'ai mal calculé la pente du toboggan. Le premier essai a éjecté le client à travers la haie du voisin. Il va bien. La haie, non. Le voisin non plus.", "Le permis de construire a été refusé onze fois. Le client m'accuse. Je l'accuse. Le chien a pris un avocat."], en: ["I miscalculated the slide's angle. The first test launched the client through the neighbour's hedge. He's fine. The hedge isn't. Neither is the neighbour.", "Planning permission refused eleven times. The client blames me. I blame him. The dog got a lawyer."] }, fx: { perf: -8, stress: 8 }, mood: 'sad' },
      ] },
      { label: { fr: 'Le raisonner', en: 'Talk sense into him' }, text: { fr: ["J'ai proposé une maison normale avec « une touche d'audace » : une porte jaune. Il a adoré. Les gens riches veulent juste qu'on leur dise qu'ils sont audacieux.", "Après deux heures, il a accepté de renoncer au château fort. Il a gardé le toboggan. On a tous nos limites, et les miennes s'arrêtent avant le pont-levis."], en: ["I suggested a normal house with 'a bold touch': a yellow door. He loved it. Rich people just want to be told they're bold.", "After two hours he agreed to drop the castle. He kept the slide. We all have limits, and mine stop before the drawbridge."] }, fx: { perf: 4, money: 300 }, mood: 'neutral' },
    ],
    vars: { amount: [3000, 10000] },
  },
  {
    id: 'c3_arch_balcony', icon: '🏗️', cat: 'job', rating: 2,
    scene: { place: 'office', mood: 'shock', fx: 'gore' },
    when: { job: 'architect' }, weight: 7, cooldown: 5,
    text: {
      fr: [
        "Inauguration de ta résidence de luxe. Le promoteur, le maire et douze invités en tenue de soirée posent sur le grand balcon en porte-à-faux que tu as dessiné. Tu entends un craquement.",
        "Le promoteur a remplacé l'acier de ton escalier suspendu par « un équivalent moins cher ». Ce soir, 40 invités montent dessus pour la photo. Ça fait {w:sound}.",
        "Visite de chantier avec les investisseurs. Tu te rends compte que la poutre principale est à l'envers. Tout le monde est dessous. Un ouvrier fait signe que « ça va tenir ».",
        "Ton immeuble de bureaux primé se met à pencher. Juste un peu. Le PDG locataire t'appelle : « Les stylos roulent tout seuls vers la fenêtre. C'est normal ? »",
      ],
      en: [
        "Opening of your luxury residence. The developer, the mayor and twelve guests in evening wear pose on the big cantilevered balcony you designed. You hear a crack.",
        "The developer replaced the steel in your floating staircase with 'a cheaper equivalent'. Tonight 40 guests climb it for a photo. It makes {w:sound}.",
        "Site visit with investors. You realise the main beam is upside down. Everyone's under it. A worker signals it'll 'hold'.",
        "Your award-winning office building is starting to lean. Just a bit. The tenant CEO calls: 'Pens are rolling toward the window on their own. Is that normal?'",
      ],
    },
    choices: [
      { label: { fr: 'Hurler « TOUT LE MONDE DEHORS »', en: 'Scream "EVERYONE OUT"' }, out: [
        { w: 2, text: { fr: ["Tout le monde a couru. Le balcon s'est détaché trois secondes après, emportant uniquement le buffet et une statue du promoteur. Je suis un{|e} {héros|héroïne}. Et aussi le responsable. On verra lequel gagne.", "Évacuation réussie. L'escalier s'est effondré sur la table du traiteur. Il pleuvait des petits fours et du verre. Le maire m'a remercié{|e}, puis m'a fait assigner en justice."], en: ["Everyone ran. The balcony detached three seconds later, taking only the buffet and a statue of the developer. I'm a hero. And also liable. We'll see which wins.", "Successful evacuation. The staircase collapsed onto the caterer's table. It rained canapés and glass. The mayor thanked me, then sued me."] }, fx: { karma: 6, fame: 4, money: -2000 }, mood: 'shock' },
        { w: 1, text: { fr: ["Trop tard. Le balcon est tombé de deux étages avec le promoteur dessus. Il a survécu, mais il est maintenant en forme de Z. Les photos sont dans tous les journaux. Mon nom aussi. Radiation de l'ordre.", "L'escalier a cédé. Il y a eu des jambes cassées, une hanche en miettes et du sang sur la moquette blanche. Mon cabinet est fermé. Je dessine des cabanes à oiseaux."], en: ["Too late. The balcony dropped two floors with the developer on it. He survived but is now Z-shaped. Photos in every paper. My name too. Struck off.", "The staircase gave way. Broken legs, a shattered hip and blood on the white carpet. My firm is closed. I design birdhouses now."] }, fx: { fired: true, fame: 5, karma: -4, visual: 'gore' }, mood: 'cry' },
      ] },
      { label: { fr: 'Accuser le promoteur', en: 'Blame the developer' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: ["J'avais gardé le mail où il exigeait « l'acier pas cher ». Je l'ai sorti devant les journalistes. Il est parti en garde à vue, la jambe dans le plâtre. Moi, j'ai gagné un prix de « lanceur d'alerte du béton ».", "Expertise : faute du promoteur. Mes plans étaient parfaits. Il a payé des millions. Je suis l'architecte « qui avait raison ». C'est mon slogan maintenant."], en: ["I'd kept the email where he demanded 'cheap steel'. I pulled it out in front of journalists. He went into custody with his leg in a cast. I won a 'concrete whistleblower' award.", "Expert report: developer's fault. My plans were perfect. He paid millions. I'm the architect 'who was right'. It's my slogan now."] }, fx: { perf: 10, fame: 3, promote: true }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["Il avait de meilleurs avocats et aucun scrupule. Les experts ont conclu à une « erreur de conception ». Licencié{|e} et ruiné{|e} en frais de justice.", "J'avais effacé le mail compromettant par erreur. Il ne restait que mes plans, avec une erreur de virgule. Une virgule. Elle m'a coûté ma carrière."], en: ["He had better lawyers and no scruples. Experts concluded 'design error'. Fired and ruined by legal fees.", "I'd accidentally deleted the incriminating email. Only my plans were left, with a misplaced decimal point. One decimal point. It cost me my career."] }, fx: { fired: true, money: -3000 }, mood: 'cry' },
      ] },
    ],
  },
  // ───────────────────────────── sports_coach ─────────────────────────────
  {
    id: 'c3_coach_halftime', icon: '📋', cat: 'job', rating: 1,
    scene: { place: 'stadium', mood: 'angry', prop: 'clipboard' },
    when: { job: 'sports_coach' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Mi-temps. [[0-4|0-5|1-6]]. Ton gardien a encaissé un but en refaisant ses lacets. L'entraîneur principal s'est enfermé aux toilettes. C'est toi qui dois faire le discours.",
        "Vestiaire, mi-temps, 0-3. Ton avant-centre regarde {w:app} sur son téléphone. Ton défenseur pleure. Ton milieu mange {w:food}. Ils attendent tes mots magiques.",
        "Le président du club descend au vestiaire à la mi-temps : « Si on perd, je vends le club à un milliardaire qui veut en faire un parking. » Il te regarde. « Motive-les. »",
        "Les joueurs sont menés 1-5 par une équipe de quartier dont le gardien a 52 ans et fume pendant le match. Le vestiaire sent la défaite et le baume du tigre.",
      ],
      en: [
        "Half-time. [[0-4|0-5|1-6]]. Your goalkeeper conceded while retying his laces. The head coach locked himself in the toilets. You have to give the speech.",
        "Locker room, half-time, 0-3. Your striker is scrolling {w:app}. Your defender is crying. Your midfielder is eating {w:food}. They await your magic words.",
        "The club president comes down at half-time: 'If we lose, I'm selling the club to a billionaire who wants to turn it into a car park.' He looks at you. 'Motivate them.'",
        "The players are down 1-5 to a local team whose 52-year-old goalkeeper smokes during the match. The locker room smells of defeat and Tiger Balm.",
      ],
    },
    choices: [
      { label: { fr: 'Discours à la Rocky', en: 'Rocky-style speech' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai parlé de nos mères, de nos ancêtres, de la dignité. J'ai frappé un casier et me suis cassé un doigt. Ils sont ressortis comme des fauves. 5-4. Je suis porté{|e} en triomphe.", "« Vous êtes des lions ! » Un joueur a rugi. Les autres ont suivi. Remontée historique. Le président m'a embrassé{|e} sur la bouche. Personne n'en parle."], en: ["I talked about our mothers, our ancestors, dignity. I punched a locker and broke a finger. They went out like wild beasts. 5-4. They carried me on their shoulders.", "'You are lions!' One player roared. The others followed. Historic comeback. The president kissed me on the mouth. Nobody talks about it."] }, fx: { perf: 14, happy: 10, promote: true }, mood: 'party' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["Mon discours était un mélange de Rocky, {w:movie} et citations de ma grand-mère. Ils m'ont regardé{|e} sans comprendre. Défaite 0-9. Le gardien adverse a allumé une deuxième cigarette.", "J'ai pleuré au milieu du discours. Ils ont pleuré aussi. On a perdu 0-7, mais on s'est fait un câlin collectif. Le président a vendu le club le soir même."], en: ["My speech was a mix of Rocky, {w:movie} and my grandma's sayings. They stared blankly. Lost 0-9. The opposing keeper lit a second cigarette.", "I cried mid-speech. They cried too. We lost 0-7, but had a group hug. The president sold the club that night."] }, fx: { perf: -8, happy: -6 }, mood: 'cry' },
      ] },
      { label: { fr: 'Tout casser en hurlant', en: 'Smash things and yell' }, out: [
        { w: 1, text: { fr: ["J'ai renversé la table de massage, hurlé « BANDE DE MOLLUSQUES ! » et jeté une bouteille d'eau contre le mur. Elle a rebondi sur la tête du capitaine. Il est sorti furieux et a marqué trois buts. Ça marche, la violence.", "J'ai hurlé tellement de gros mots que l'arbitre est venu frapper à la porte. Les joueurs, terrorisés, ont gagné 5-4. J'ai écopé de trois matchs de suspension."], en: ["I flipped the massage table, yelled 'YOU BUNCH OF MOLLUSCS!' and threw a water bottle at the wall. It bounced off the captain's head. He stormed out and scored a hat-trick. Violence works.", "I swore so much the referee knocked on the door. Terrified, the players won 5-4. I got a three-match ban."] }, fx: { perf: 8, stress: -6, karma: -3 }, mood: 'angry' },
      ] },
    ],
  },
  {
    id: 'c3_coach_star', icon: '🍾', cat: 'job', rating: 2,
    scene: { place: 'stadium', mood: 'shock' },
    when: { job: 'sports_coach' }, weight: 8, cooldown: 4,
    text: {
      fr: [
        "Jour de match. La star de l'équipe arrive au stade à 14 h 50, en peignoir d'hôtel, avec des paillettes dans les sourcils et une seule chaussure. Coup d'envoi à 15 h. Il sent la tequila et le regret.",
        "Ton meilleur joueur a passé la nuit avec la femme du président du club. Tout le monde le sait. Le président aussi. Il est assis en tribune, et il te fixe en mâchant très lentement.",
        "Ta star vomit dans le bus du club, sur la coupe du championnat, devant les caméras du documentaire officiel. Il te regarde et dit : « Coach, je crois que je suis prêt. »",
        "Contrôle surprise de la fédération dans dix minutes. Ton capitaine a passé la nuit {w:far_place} avec des inconnus et revient avec les pupilles grosses comme des soucoupes.",
      ],
      en: [
        "Match day. The team's star arrives at 2:50 p.m. in a hotel bathrobe, glitter in his eyebrows, one shoe. Kickoff at 3. He smells of tequila and regret.",
        "Your best player spent the night with the club president's wife. Everyone knows. So does the president. He's sitting in the stands, staring at you, chewing very slowly.",
        "Your star vomits in the team bus, onto the league trophy, in front of the official documentary cameras. He looks at you and says: 'Coach, I think I'm ready.'",
        "Surprise federation test in ten minutes. Your captain spent the night {w:far_place} with strangers and comes back with pupils the size of saucers.",
      ],
    },
    choices: [
      { label: { fr: 'Le faire jouer quand même', en: 'Play him anyway' }, out: [
        { w: 1, text: { fr: ["Il a joué ivre mort et marqué un retourné acrobatique par accident, en tombant. 1-0. Les journaux parlent de « génie ». Moi, je sais qu'il visait le banc pour s'allonger.", "Il a vomi au milieu du terrain à la 12e minute, puis marqué de la tête à la 13e. Le vomi a fait glisser le défenseur adverse. Victoire. La pelouse est à refaire."], en: ["He played blackout drunk and scored an overhead kick by accident, falling over. 1-0. Papers call it 'genius'. I know he was aiming for the bench to lie down.", "He vomited mid-pitch in the 12th minute, then scored a header in the 13th. The vomit made the opposing defender slip. Win. The pitch needs replacing."] }, fx: { perf: 10, fame: 2, visual: 'poop' }, mood: 'party' },
        { w: 1, text: { fr: ["Il s'est endormi dans la surface de réparation à la 20e minute. L'arbitre a cru à une blessure. Les secouristes ont trouvé un string en paillettes dans sa chaussette. C'était en direct.", "Le président l'a fait sortir à la 2e minute, puis m'a fait sortir aussi. De l'équipe. Pour toujours. La femme du président m'a envoyé un texto de soutien. C'est pire."], en: ["He fell asleep in the penalty box in the 20th minute. The ref thought he was hurt. Medics found a sequined thong in his sock. It was live.", "The president subbed him off in the 2nd minute, then subbed me off too. From the team. Forever. The president's wife texted me support. That's worse."] }, fx: { fired: true, happy: -6 }, mood: 'shock' },
      ] },
      { label: { fr: 'Le mettre sur le banc', en: 'Bench him' }, out: [
        { w: 2, text: { fr: ["Je l'ai mis sur le banc sous une couverture. Il a ronflé tout le match. L'équipe a gagné sans lui. La presse dit que j'ai « du caractère ». Lui dit que je suis « un jaloux ».", "Banc de touche. Il a boudé, puis vomi dans la glacière des boissons. On a perdu. Mais j'ai fait preuve d'autorité. Ça compte, l'autorité. Un peu."], en: ["I benched him under a blanket. He snored all match. The team won without him. The press says I have 'backbone'. He says I'm 'jealous'.", "Bench. He sulked, then vomited in the drinks cooler. We lost. But I showed authority. Authority counts. A bit."] }, fx: { perf: 4, karma: 3 }, mood: 'proud' },
      ] },
    ],
  },
  // ───────────────────────────── journalist ─────────────────────────────
  {
    id: 'c3_jour_clickbait', icon: '📰', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'angry', prop: 'laptop' },
    when: { job: 'journalist' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Ton rédac' chef refuse ton enquête de six mois sur la corruption municipale. « Trop long. Fais-moi plutôt un truc sur {w:animal}. Titre : “Vous ne croirez JAMAIS ce qu'il a fait ensuite”. »",
        "Le site du journal perd des clics. Nouvelle consigne : chaque article doit contenir « choc », « incroyable » ou {w:celeb} dans le titre. Ton sujet du jour : la réforme des retraites.",
        "On te demande 12 articles d'ici ce soir, dont « 10 raisons pour lesquelles votre chat vous méprise » et « Ce légume détruit votre couple ». Tu as un master en journalisme d'investigation.",
        "Ton chef veut une interview exclusive avec {w:celeb}. Impossible de joindre la star. « Pas grave, invente des réponses, il ne lit rien de toute façon. » Il te fait un clin d'œil.",
      ],
      en: [
        "Your editor rejects your six-month investigation into city-hall corruption. 'Too long. Do me something about {w:animal}. Headline: \"You will NEVER believe what it did next\".'",
        "The site is losing clicks. New rule: every headline must include 'shocking', 'incredible' or {w:celeb}. Today's topic: pension reform.",
        "You're asked for 12 articles by tonight, including '10 reasons your cat despises you' and 'This vegetable is destroying your relationship'. You have a master's in investigative journalism.",
        "Your editor wants an exclusive interview with {w:celeb}. You couldn't reach him. 'No matter, make up the answers, he doesn't read anything anyway.' He winks.",
      ],
    },
    choices: [
      { label: { fr: 'Écrire le putaclic', en: 'Write the clickbait' }, out: [
        { w: 2, text: { fr: ["« Ce pigeon a fait un truc INCROYABLE, la n°7 va vous FAIRE PLEURER. » 3 millions de vues. Mon chef m'a offert une prime. Mon prof de journalisme m'a envoyé un mail qui disait juste « Pourquoi ? ».", "J'ai écrit que la réforme des retraites était « choquante, incroyable, et que même {w:celeb} en parle ». Record de clics. Je ne me regarde plus dans le miroir, mais je peux m'en acheter un neuf."], en: ["'This pigeon did something INCREDIBLE, number 7 will MAKE YOU CRY.' 3 million views. My boss gave me a bonus. My journalism professor emailed me just: 'Why?'.", "I wrote that pension reform was 'shocking, incredible, and even {w:celeb} is talking about it'. Click record. I can't look in the mirror, but I can afford a new one."] }, fx: { perf: 10, money: 300, karma: -4, smarts: -2 }, mood: 'neutral' },
        { w: 1, text: { fr: ["L'interview inventée a fuité : la star a démenti en direct, puis porté plainte pour diffamation. Le journal m'a désavoué{|e} en une phrase. Licencié{|e}.", "Mon faux article a été repris par 40 médias, puis démenti, puis moqué dans une émission de télé. Mon nom est devenu un verbe : « se faire {last}er »."], en: ["The made-up interview leaked: the star denied it live, then sued for defamation. The paper disowned me in one sentence. Fired.", "My fake article was picked up by 40 outlets, then debunked, then mocked on a TV show. My surname became a verb."] }, fx: { fired: true, fame: 2 }, mood: 'shock' },
      ] },
      { label: { fr: 'Publier mon enquête ailleurs', en: 'Publish my scoop elsewhere' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai envoyé mon enquête à un média indépendant. Elle a fait tomber trois adjoints au maire. J'ai reçu un prix de journalisme et des menaces de mort. Les deux sont encadrés.", "Mon enquête a été publiée en ligne. Le maire a démissionné. Mon ancien chef a écrit un article intitulé « Ce journaliste a fait un truc INCROYABLE ». C'était moi."], en: ["I sent my investigation to an independent outlet. It brought down three deputy mayors. I got a journalism prize and death threats. Both are framed.", "My investigation went online. The mayor resigned. My old boss ran a headline: 'This journalist did something INCREDIBLE'. It was me."] }, fx: { fame: 6, karma: 8, quitJob: true, followers: 5000 }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["Le média indépendant a fait faillite la semaine de la publication. Mon enquête a été lue par 212 personnes, dont le maire, qui m'a envoyé une carte de vœux menaçante.", "Mon chef a découvert que j'avais publié ailleurs. Clause d'exclusivité. Viré{|e}, et le maire est toujours là. Il a même été réélu."], en: ["The independent outlet went bankrupt the week it ran. 212 people read my investigation, including the mayor, who sent me a threatening holiday card.", "My boss found out I published elsewhere. Exclusivity clause. Fired, and the mayor's still there. He even got re-elected."] }, fx: { fired: true, karma: 4 }, mood: 'sad' },
      ] },
    ],
  },
  {
    id: 'c3_jour_live', icon: '🎙️', cat: 'job', rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'microphone' },
    when: { job: 'journalist' }, weight: 8, cooldown: 4,
    text: {
      fr: [
        "Duplex en direct pour le 20 h, {w:weather}. Au moment où tu prends l'antenne, un type en imperméable surgit derrière toi, ouvre l'imper et fait l'hélicoptère avec ce qu'il y a dessous.",
        "Direct depuis une manifestation. Un manifestant bourré se place derrière toi, baisse son pantalon et colle ses fesses contre l'objectif. Tu as 40 secondes d'antenne. 4 millions de téléspectateurs.",
        "Reportage live sur la Fête des voisins. Derrière toi, deux participants très éméchés entament une danse lascive qui devient beaucoup plus que lascive. La régie hurle dans ton oreillette.",
        "Tu présentes la météo en extérieur. Un pigeon te chie dessus en plein mot « anticyclone ». Puis un deuxième. Puis un ado crie un gros mot dans ton micro. Tu es en direct.",
      ],
      en: [
        "Live link for the 8 p.m. news, {w:weather}. As you go on air, a guy in a raincoat pops up behind you, opens it, and does the helicopter with what's underneath.",
        "Live from a protest. A drunk protester stands behind you, drops his trousers and presses his butt against the lens. You have 40 seconds of airtime. 4 million viewers.",
        "Live report on a neighbourhood street party. Behind you, two very tipsy guests start a sultry dance that becomes much more than sultry. The control room is screaming in your earpiece.",
        "You're doing the outdoor weather. A pigeon poops on you mid-word 'anticyclone'. Then another. Then a teen shouts a swear word into your mic. You're live.",
      ],
    },
    choices: [
      { label: { fr: 'Continuer comme si de rien', en: 'Carry on like nothing\'s wrong' }, out: [
        { w: 2, text: { fr: ["J'ai continué mon texte sans un battement de cils pendant que l'hélicoptère tournait derrière moi. La séquence a fait le tour du monde. On m'appelle « le roc de l'info ». Promotion.", "Professionnalisme absolu : j'ai fini ma phrase, rendu l'antenne, puis hurlé. Le hurlement, lui, n'est pas passé. Le reste, si. 20 millions de vues. Mon chef m'adore."], en: ["I kept reading without blinking while the helicopter spun behind me. The clip went round the world. They call me 'the Rock of News'. Promotion.", "Total professionalism: I finished my sentence, handed back to the studio, then screamed. The scream didn't air. Everything else did. 20 million views. My boss loves me."] }, fx: { perf: 12, fame: 6, followers: 8000, promote: true }, mood: 'proud' },
      ] },
      { label: { fr: 'Le frapper avec le micro', en: 'Hit him with the mic' }, out: [
        { w: 1, text: { fr: ["J'ai fait un swing de golf avec le micro. Bruit sourd en direct. Il est tombé dans une flaque, les fesses à l'air. La France entière a applaudi. Le CSA, moins. Mise à pied d'une semaine.", "Coup de micro en plein dans ses parties. Le son a été capté en Dolby. La séquence est devenue un mème mondial. Je suis suspendu{|e}, adulé{|e}, et poursuivi{|e} pour coups et blessures."], en: ["I golf-swung the mic. Dull thud, live. He fell into a puddle, butt out. The whole country cheered. The broadcasting regulator, less so. One-week suspension.", "Mic straight to his crotch. The sound was captured in Dolby. The clip became a global meme. I'm suspended, adored, and being sued for assault."] }, fx: { fame: 8, followers: 15000, perf: -6, happy: 8 }, mood: 'party' },
      ] },
      { label: { fr: 'Rendre l\'antenne en panique', en: 'Throw back to the studio' }, text: { fr: ["« À vous les studios ! » en hurlant. Le présentateur, pris de court, a enchaîné sur un sujet sur les fromages. Personne n'a compris. Moi non plus. Mon chef m'a mis{|e} sur les chiens écrasés.", "J'ai rendu l'antenne au bout de 4 secondes. Le présentateur a dit « Euh… merci ». J'ai été rétrogradé{|e} aux reportages sur les fêtes de la citrouille."], en: ["'Back to you in the studio!' screaming. The anchor, caught off guard, segued into a cheese segment. Nobody got it. Neither did I. My boss put me on the lost-dog beat.", "I threw back after 4 seconds. The anchor said 'Er… thanks.' I got demoted to pumpkin-festival reports."] }, fx: { perf: -6, stress: 6 }, mood: 'sad' },
    ],
  },
  // ───────────────────────────── lawyer ─────────────────────────────
  {
    id: 'c3_law_confess', icon: '⚖️', cat: 'job', rating: 1,
    scene: { place: 'court', mood: 'shock' },
    when: { job: 'lawyer' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Toilettes du tribunal, dix minutes avant l'audience. Ton client, accusé d'avoir volé 400 kilos de fromage, se lave les mains à côté de toi et chuchote : « Bon, entre nous, c'est moi. Il en reste dans ma cave. »",
        "Ton client jure son innocence depuis six mois. Ce matin, il arrive au tribunal avec le t-shirt que porte le braqueur sur la vidéo. Et le même tatouage. Et le sac de billets.",
        "En pleine suspension d'audience, ton client te glisse : « Au fait, mon alibi, c'est mon cousin, mais il est mort en 2019. Ça pose problème ? »",
        "Ton client, accusé de fraude, t'explique ses comptes. Il a créé 14 sociétés écrans, dont une au nom de son chien. « Mais ça, c'est légal, hein ? Le chien a signé. »",
      ],
      en: [
        "Courthouse toilets, ten minutes before the hearing. Your client, accused of stealing 400 kilos of cheese, washes his hands next to you and whispers: 'Between us, it was me. There's still some in my cellar.'",
        "Your client has sworn innocence for six months. This morning he shows up at court in the T-shirt the robber wears in the video. And the same tattoo. And the bag of cash.",
        "During a recess, your client mutters: 'By the way, my alibi is my cousin, but he died in 2019. Is that a problem?'",
        "Your client, accused of fraud, walks you through his accounts. He created 14 shell companies, one in his dog's name. 'But that's legal, right? The dog signed.'",
      ],
    },
    choices: [
      { label: { fr: 'Plaider l\'acquittement', en: 'Plead not guilty anyway' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["Plaidoirie de 2 heures sur la présomption d'innocence, les vices de procédure et la beauté du fromage. Acquitté. Il m'a offert une meule. Elle venait sûrement de la cave. Je l'ai mangée quand même.", "J'ai trouvé un vice de procédure : le policier avait mal orthographié le nom du chien. Relaxe. Mon client m'a embrassé{|e}. Le juge m'a regardé{|e} comme on regarde un cafard en costume."], en: ["Two-hour closing on presumption of innocence, procedural flaws and the beauty of cheese. Acquitted. He gave me a wheel. Probably from the cellar. I ate it anyway.", "I found a procedural flaw: the officer misspelled the dog's name. Case dismissed. My client kissed me. The judge looked at me like a cockroach in a suit."] }, fx: { perf: 12, money: 1500, karma: -6 }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["Pendant ma plaidoirie, mon client a lâché : « Il est bon, le comté, hein ? » Silence. Condamné. Il m'a viré{|e} depuis sa cellule, par courrier, avec un dessin de fromage triste.", "Le procureur a montré une photo de la cave. On voyait mon client, souriant, et moi, à côté, en train de goûter. Ce n'était pas mon meilleur jour."], en: ["During my closing, my client blurted: 'Good cheese though, eh?' Silence. Convicted. He fired me from his cell, by letter, with a drawing of a sad cheese.", "The prosecutor showed a photo of the cellar. It showed my client smiling, and me next to him, tasting. Not my best day."] }, fx: { perf: -10, happy: -4 }, mood: 'shock' },
      ] },
      { label: { fr: 'Négocier un plaider-coupable', en: 'Negotiate a plea deal' }, out: [
        { w: 1, text: { fr: ["Accord : 6 mois avec sursis et 400 kilos de fromage rendus. Il était furieux, mais libre. Le procureur et moi avons partagé un plateau de comté saisi. La justice, c'est aussi du goût.", "J'ai obtenu le minimum. Il m'a traité{|e} de « vendu{|e} ». Puis il a vu la peine que risquait son complice et m'a envoyé des fleurs."], en: ["Deal: 6 months suspended and 400 kilos of cheese returned. Furious but free. The prosecutor and I shared a platter of seized cheddar. Justice is also about taste.", "I got the minimum. He called me a 'sellout'. Then he saw what his accomplice got and sent me flowers."] }, fx: { perf: 6, money: 600, karma: 2 }, mood: 'neutral' },
      ] },
    ],
  },
  {
    id: 'c3_law_terrine', icon: '🥩', cat: 'job', rating: 2,
    scene: { place: 'prison', mood: 'sick', fx: 'gore' },
    when: { job: 'lawyer' }, weight: 7, cooldown: 5,
    text: {
      fr: [
        "Parloir. Ton client, surnommé « le Boucher de Montargis », est accusé d'avoir cuisiné son associé. Il te tend une terrine maison : « Goûtez, maître. C'est du lapin. Promis. » Il sourit trop.",
        "Préparation du procès avec ton client cannibale présumé. Il a apporté des rillettes « faites avant l'arrestation » et insiste pour que tu les goûtes « pour la confiance ».",
        "Ton client, accusé d'avoir fait disparaître son beau-père dans un hachoir industriel, t'offre un saucisson « de sa production personnelle ». Le gardien te fait discrètement « non » de la tête.",
        "Ton client, le chef étoilé accusé d'avoir servi son critique gastronomique en pot-au-feu, te propose de « goûter les preuves ». Il a gardé un Tupperware dans sa cellule. Comment ?",
      ],
      en: [
        "Visiting room. Your client, nicknamed 'the Butcher of Montargis', is accused of cooking his business partner. He hands you a homemade terrine: 'Try it, counsellor. It's rabbit. Promise.' He smiles too much.",
        "Trial prep with your alleged-cannibal client. He brought rillettes 'made before the arrest' and insists you taste them 'for trust'.",
        "Your client, accused of putting his father-in-law through an industrial mincer, offers you a salami 'from his personal production'. The guard discreetly shakes his head.",
        "Your client, the Michelin chef accused of serving his food critic as a stew, offers to let you 'taste the evidence'. He kept a Tupperware in his cell. How?",
      ],
    },
    choices: [
      { label: { fr: 'Goûter par politesse', en: 'Taste it to be polite' }, out: [
        { w: 1, text: { fr: ["C'était délicieux. Vraiment délicieux. Trop délicieux. Le labo a confirmé : « lapin à 60 % ». Je n'ai pas demandé pour les 40 % restants. J'ai vomi dans le couloir du parloir, puis j'ai gagné le procès.", "J'ai goûté. Il a pleuré d'émotion. « Personne ne goûte jamais ma cuisine. » J'ai obtenu l'acquittement. Il m'invite à dîner tous les ans. Je décline tous les ans."], en: ["It was delicious. Really delicious. Too delicious. The lab confirmed: '60% rabbit'. I didn't ask about the other 40%. I threw up in the visiting corridor, then won the trial.", "I tasted it. He wept with emotion. 'Nobody ever tastes my cooking.' I got an acquittal. He invites me to dinner every year. I decline every year."] }, fx: { perf: 10, money: 2000, happy: -10, health: -2 }, mood: 'sick' },
        { w: 1, text: { fr: ["Il y avait un ongle dans la terrine. Un ongle humain, verni en rouge. J'ai fait un malaise. Mon client a dit « Oh, c'est juste du cartilage ». Je me suis désisté{|e}, et je suis devenu{|e} végétarien{|ne}.", "J'ai trouvé une dent en or dans le saucisson. Elle portait les initiales du beau-père. J'ai dû la remettre au procureur. Mon client m'a viré{|e} pour « trahison culinaire »."], en: ["There was a fingernail in the terrine. A human fingernail, painted red. I fainted. My client said 'Oh, that's just cartilage.' I withdrew from the case and went vegetarian.", "I found a gold tooth in the salami. It bore the father-in-law's initials. I had to hand it to the prosecutor. My client fired me for 'culinary betrayal'."] }, fx: { fired: true, happy: -12, visual: 'gore' }, mood: 'sick' },
      ] },
      { label: { fr: 'Refuser fermement', en: 'Firmly decline' }, text: { fr: ["« Non merci, je suis au régime. » Il a paru blessé. Il a mangé la terrine devant moi en me fixant. Je l'ai quand même défendu. Il a pris 30 ans. Il m'envoie des recettes.", "J'ai refusé. Le gardien m'a félicité{|e} discrètement. Mon client a fait la tête tout le procès. Il a été condamné. Il a demandé que son dernier repas soit « préparé par lui-même »."], en: ["'No thanks, I'm on a diet.' He looked hurt. He ate the terrine in front of me, staring. I defended him anyway. He got 30 years. He sends me recipes.", "I declined. The guard quietly congratulated me. My client sulked the whole trial. Convicted. He requested that his last meal be 'prepared by himself'."] }, fx: { perf: 2, stress: 4 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── ceo_track ─────────────────────────────
  {
    id: 'c3_ceo_deck', icon: '📊', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'neutral', prop: 'laptop' },
    when: { job: 'ceo_track' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Ton cabinet de conseil te facture [[3 000|4 500|6 000]] € la journée à une usine de yaourts. Tu n'as jamais vu de vache. Ta mission : un PowerPoint de 140 slides qui recommande de licencier 30 % des effectifs.",
        "Présentation au comité de direction. Ta slide 47 s'intitule « Optimisation des ressources humaines ». Les ressources humaines en question sont assises au premier rang, avec leurs badges.",
        "Tu as 26 ans, deux ans d'expérience et un costume trop cher. Tu dois expliquer à un patron de PME de 64 ans comment gérer l'entreprise qu'il a créée. Tu as copié le diagnostic d'une boulangerie.",
        "Ton client te demande ce que veut dire « synergiser les leviers de croissance transverses ». C'est toi qui l'as écrit. Tu n'en as aucune idée.",
      ],
      en: [
        "Your consulting firm bills a yogurt factory $[[3,000|4,500|6,000]] a day for you. You've never seen a cow. Your mission: a 140-slide deck recommending laying off 30% of staff.",
        "Presentation to the executive board. Your slide 47 is titled 'Human resources optimisation'. The human resources in question are sitting in the front row, wearing their badges.",
        "You're 26, with two years of experience and an overpriced suit. You must explain to a 64-year-old business owner how to run the company he founded. You copied a bakery's diagnosis.",
        "Your client asks what 'synergising cross-functional growth levers' means. You wrote it. You have no idea.",
      ],
    },
    choices: [
      { label: { fr: 'Dérouler les 140 slides', en: 'Run all 140 slides' }, out: [
        { w: 2, text: { fr: ["Trois heures de matrices, de flèches et de camemberts. À la slide 92, le directeur dormait. À la 140, il a signé. Facture : 400 000 €. Les licenciés ont reçu un mug.", "J'ai dit « disruption » 27 fois. Ils ont tout validé. Le cabinet m'a promu{|e} manager. L'usine a fermé six mois plus tard. Ce n'est pas dans mes slides."], en: ["Three hours of matrices, arrows and pie charts. By slide 92 the director was asleep. By 140 he signed. Invoice: $400,000. The laid-off got a mug.", "I said 'disruption' 27 times. They approved everything. The firm promoted me to manager. The factory closed six months later. That's not in my slides."] }, fx: { perf: 12, money: 1500, karma: -8, promote: true }, mood: 'proud' },
        { w: 1, text: { fr: ["Un ouvrier du premier rang a levé la main : « Et vous, vous servez à quoi ? » Silence. Applaudissements. Le client a résilié le contrat. Mon associé m'a convoqué{|e}.", "Le patron de 64 ans a reconnu le diagnostic de sa boulangère, mot pour mot. Il m'a raccompagné{|e} à la porte en me tenant par l'oreille."], en: ["A worker in the front row raised his hand: 'And what exactly are you for?' Silence. Applause. The client cancelled the contract. My partner summoned me.", "The 64-year-old recognised his baker's diagnosis, word for word. He walked me out by the ear."] }, fx: { perf: -10, happy: -4 }, mood: 'shock' },
      ] },
      { label: { fr: 'Recommander de virer les consultants', en: 'Recommend firing the consultants' }, out: [
        { w: 1, text: { fr: ["Slide 1 : « Économie immédiate de 400 000 € : arrêtez de payer des consultants. » Le patron a ri, m'a serré la main et m'a proposé un vrai job. Mon cabinet m'a viré{|e} pour « trahison méthodologique ».", "J'ai présenté une seule slide : « Ne changez rien, ça marche. » Le client a adoré. Mon cabinet a perdu 400 000 €. On m'a mis{|e} au placard, entre deux classeurs."], en: ["Slide 1: 'Immediate saving of $400,000: stop paying consultants.' The boss laughed, shook my hand and offered me a real job. My firm fired me for 'methodological betrayal'.", "I presented a single slide: 'Change nothing, it works.' The client loved it. My firm lost $400,000. I got shelved, between two binders."] }, fx: { karma: 8, perf: -8, happy: 8 }, mood: 'happy' },
      ] },
    ],
  },
  {
    id: 'c3_ceo_retreat', icon: '🌿', cat: 'job', rating: 2,
    scene: { place: 'villa', mood: 'sick', fx: 'poop' },
    when: { job: 'ceo_track' }, weight: 8, cooldown: 4,
    text: {
      fr: [
        "Séminaire de direction « leadership conscient » dans une villa au Costa Rica. Le chaman, ancien commercial chez {w:brand}, te tend un bol d'ayahuasca. Le PDG a déjà bu le sien et pleure en serrant un arbre.",
        "Retraite « Executive Rebirth » : trois jours sans téléphone, nus dans une yourte, à « reconnecter avec ton animal intérieur ». Le directeur financier, ton animal intérieur, s'est pris pour un sanglier.",
        "Le conseil d'administration organise un « séminaire de cohésion » : saut à l'élastique, sauna mixte et cérémonie de « purge émotionnelle » avec une décoction de champignons. Le DRH vomit déjà.",
        "Week-end de « leadership tribal » en forêt. Le coach demande à chaque dirigeant de « hurler sa vérité » face à la lune. Le PDG hurle « JE DÉTESTE MA FEMME » et enlève son caleçon.",
      ],
      en: [
        "Executive 'conscious leadership' retreat in a Costa Rica villa. The shaman, a former {w:brand} salesman, hands you a bowl of ayahuasca. The CEO already drank his and is sobbing while hugging a tree.",
        "'Executive Rebirth' retreat: three days without phones, naked in a yurt, 'reconnecting with your inner animal'. The CFO, your inner animal, thinks he's a wild boar.",
        "The board organises a 'cohesion retreat': bungee jumping, mixed sauna and an 'emotional purge' ceremony with a mushroom brew. The HR director is already vomiting.",
        "'Tribal leadership' weekend in the forest. The coach asks each executive to 'howl their truth' at the moon. The CEO howls 'I HATE MY WIFE' and takes off his underpants.",
      ],
    },
    choices: [
      { label: { fr: 'Boire le bol', en: 'Drink the bowl' }, out: [
        { w: 2, text: { fr: ["J'ai vomi pendant trois heures, puis j'ai vu Dieu. Dieu avait la tête de mon premier patron. Il m'a dit « Ose ». J'ai osé : j'ai proposé une restructuration complète au PDG, nu{|e}, dans la boue. Il a dit oui. Promotion.", "Expulsion par les deux bouts en même temps, devant le comité exécutif. Le PDG m'a tenu les cheveux. Depuis, on a un lien. Il m'a nommé{|e} direct{eur|rice} de la stratégie."], en: ["I vomited for three hours, then saw God. God had my first boss's face. He said 'Dare.' I dared: I pitched a complete restructuring to the CEO, naked, in the mud. He said yes. Promotion.", "Evacuation from both ends at once, in front of the executive committee. The CEO held my hair. Since then we have a bond. He made me head of strategy."] }, fx: { promote: true, health: -6, happy: 6, visual: 'poop' }, mood: 'party' },
        { w: 1, text: { fr: ["J'ai cru être un toucan pendant six heures. J'ai essayé de m'envoler du balcon de la villa. Clavicule cassée et vidéo virale : « Le consultant toucan ». Mon cabinet m'a gentiment poussé{|e} vers la sortie.", "J'ai révélé au PDG, en larmes, tout ce que je pensais de lui. Tout. Avec des gestes. Il s'en souvient. Pas moi. Je suis au chômage."], en: ["I thought I was a toucan for six hours. Tried to fly off the villa balcony. Broken collarbone and a viral video: 'The Toucan Consultant'. My firm gently showed me the door.", "In tears, I told the CEO everything I thought of him. Everything. With gestures. He remembers. I don't. I'm unemployed."] }, fx: { fired: true, health: -8, followers: 3000 }, mood: 'shock' },
      ] },
      { label: { fr: 'Filmer discrètement', en: 'Secretly film it' }, out: [
        { w: 1, text: { fr: ["J'ai tout filmé : le PDG en caleçon, le DRH en position fœtale, le directeur financier qui mange de la terre. J'ai maintenant une assurance-vie professionnelle. Augmentation obtenue en une réunion.", "Vidéo de 40 minutes, qualité 4K. J'ai été nommé{|e} associé{|e} « à l'unanimité » une semaine plus tard. Personne n'a parlé de la vidéo. Tout le monde y a pensé."], en: ["I filmed everything: the CEO in underpants, the HR director in foetal position, the CFO eating soil. I now have professional life insurance. Raise secured in one meeting.", "40-minute video, 4K. I was made partner 'unanimously' a week later. Nobody mentioned the video. Everyone thought about it."] }, fx: { money: 5000, karma: -8, perf: 8 }, mood: 'proud' },
      ] },
      { label: { fr: 'Prétendre une urgence', en: 'Fake an emergency' }, text: { fr: ["J'ai dit que ma grand-mère était mourante. Elle est morte en 2014. J'ai passé le week-end dans un hôtel de l'aéroport avec {w:food} et le room service. Meilleur séminaire de ma vie.", "J'ai simulé une gastro. Ironiquement, j'en ai attrapé une vraie à l'hôtel. Mais au moins, j'ai vomi seul{|e}, dignement, sans chaman."], en: ["I said my grandma was dying. She died in 2014. I spent the weekend at an airport hotel with {w:food} and room service. Best retreat of my life.", "I faked a stomach bug. Ironically, I caught a real one at the hotel. But at least I vomited alone, with dignity, no shaman."] }, fx: { happy: 6, perf: -4 }, mood: 'happy' },
    ],
  },
  // ───────────────────────────── designer ─────────────────────────────
  {
    id: 'c3_des_bigger', icon: '🎨', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'angry', prop: 'laptop' },
    when: { job: 'designer' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Le client veut que tu « mettes le logo plus gros ». C'est la 9e fois. Le logo occupe maintenant 94 % de l'affiche. « Et tu peux le faire pop un peu plus ? »",
        "Ton client t'envoie ses retours : « J'aime bien, mais en fait non. Tu peux faire pareil, mais complètement différent ? Ma nièce a fait un truc sur Paint, inspire-toi. »",
        "Un client te propose de faire son identité visuelle complète « en échange de visibilité ». Sa boîte, c'est une pizzeria qui a 43 abonnés, dont sa mère et {w:celeb} (un faux compte).",
        "Le client veut un logo « comme celui qu'a {w:brand}, mais moins cher, mais plus beau, mais pareil ». Il veut aussi du Comic Sans. Il insiste sur le Comic Sans.",
      ],
      en: [
        "The client wants you to 'make the logo bigger'. 9th time. The logo now covers 94% of the poster. 'And can you make it pop a bit more?'",
        "Your client sends feedback: 'I like it, but actually no. Can you do the same thing, but completely different? My niece did something in Paint, take inspiration.'",
        "A client offers you his complete visual identity 'in exchange for exposure'. His business is a pizzeria with 43 followers, including his mum and {w:celeb} (a fake account).",
        "The client wants a logo 'like {w:brand}'s, but cheaper, but prettier, but the same'. He also wants Comic Sans. He insists on Comic Sans.",
      ],
    },
    choices: [
      { label: { fr: 'Obéir en silence', en: 'Obey in silence' }, out: [
        { w: 2, text: { fr: ["Logo plus gros, encore plus gros, en Comic Sans, avec un dégradé arc-en-ciel et une ombre portée. Le client a dit « Parfait ! ». J'ai retiré mon nom du portfolio et ma dignité de mon corps.", "J'ai fait la 10e version. Puis la 11e. Le client a choisi la première. Celle d'il y a trois semaines. Il a dit « Tu vois, quand tu veux ! »."], en: ["Bigger logo, even bigger, in Comic Sans, with a rainbow gradient and a drop shadow. The client said 'Perfect!'. I removed my name from my portfolio and my dignity from my body.", "I did version 10. Then 11. The client picked the first one. From three weeks ago. He said 'See, when you try!'."] }, fx: { perf: 6, money: 200, happy: -4 }, mood: 'sad' },
      ] },
      { label: { fr: 'Saboter subtilement', en: 'Subtly sabotage' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai caché le mot « radin » dans les ombres du logo. Il ne l'a jamais vu. Je le vois à chaque fois que je passe devant sa pizzeria. C'est ma petite victoire quotidienne.", "J'ai rendu le logo si gros qu'il dépassait de l'affiche. Imprimé tel quel. Le nom de la pizzeria est illisible. Le client a adoré « le côté mystérieux »."], en: ["I hid the word 'cheapskate' in the logo's shadows. He never saw it. I see it every time I pass his pizzeria. My small daily victory.", "I made the logo so big it went off the poster. Printed as is. The pizzeria's name is unreadable. The client loved 'the mysterious vibe'."] }, fx: { happy: 8, karma: -2 }, mood: 'happy' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["Il a remarqué. Sa nièce aussi. Elle m'a dénoncé{|e} sur {w:app}. 300 commentaires « pas pro ». Mon agence m'a mis{|e} sur les cartes de vœux des clients les plus pénibles.", "Mon sabotage était trop visible. Le client l'a montré à mon chef, qui a ri, puis m'a viré{|e} en continuant de rire."], en: ["He noticed. So did his niece. She called me out on {w:app}. 300 'unprofessional' comments. My agency put me on greeting cards for the worst clients.", "My sabotage was too obvious. The client showed my boss, who laughed, then fired me, still laughing."] }, fx: { perf: -10, happy: -3 }, mood: 'sad' },
      ] },
      { label: { fr: 'Envoyer une facture', en: 'Send an invoice' }, text: { fr: ["J'ai envoyé une facture de 2 400 € « pour la visibilité qu'il gagne à travailler avec moi ». Il ne l'a pas payée. Il ne m'a plus jamais écrit. Victoire totale.", "Facture détaillée : 50 € par « tu peux le faire pop ». Total : 1 150 €. Il a payé, en pizzas. 46 pizzas. Mon congélateur est plein."], en: ["I sent a $2,400 invoice 'for the exposure he gets by working with me'. He didn't pay. He never wrote again. Total victory.", "Itemised invoice: $50 per 'can you make it pop'. Total: $1,150. He paid, in pizzas. 46 pizzas. My freezer is full."] }, fx: { happy: 6, money: 100 }, mood: 'proud' },
    ],
  },
  {
    id: 'c3_des_phallic', icon: '🍆', cat: 'job', rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'laptop' },
    when: { job: 'designer' }, weight: 8, cooldown: 4,
    text: {
      fr: [
        "Ton nouveau logo pour la mairie (une tour et deux collines) est imprimé sur 10 000 flyers. Ta collègue le regarde de loin, plisse les yeux, puis éclate de rire. Tu regardes à ton tour. Oh non.",
        "Le logo que tu as créé pour une crèche — une fusée et deux nuages — vient d'être installé sur la façade. Un groupe d'ados s'arrête devant et prend des photos en hurlant de rire.",
        "Ton logo pour une marque de jus bio est validé, imprimé, lancé. Sur {w:app}, quelqu'un l'a retourné à 90°. Le post s'appelle « On en parle de ce logo ? ». 2 millions de likes.",
        "Le PDG adore ton nouveau logo : un champignon stylisé pour une marque de soupe. Il l'a fait tatouer. Sur son avant-bras. Toute l'équipe marketing évite de croiser son regard.",
      ],
      en: [
        "Your new logo for city hall (a tower and two hills) is printed on 10,000 flyers. Your colleague looks at it from a distance, squints, then bursts out laughing. You look too. Oh no.",
        "The logo you created for a daycare — a rocket and two clouds — was just installed on the facade. A group of teens stops in front, taking photos and howling with laughter.",
        "Your logo for an organic juice brand is approved, printed, launched. On {w:app}, someone rotated it 90°. The post is called 'Can we talk about this logo?'. 2 million likes.",
        "The CEO loves your new logo: a stylised mushroom for a soup brand. He got it tattooed. On his forearm. The whole marketing team avoids eye contact.",
      ],
    },
    choices: [
      { label: { fr: 'Nier l\'évidence', en: 'Deny the obvious' }, out: [
        { w: 1, text: { fr: ["« C'est une tour et deux collines. Si vous voyez autre chose, c'est votre problème. » Ça a marché trois jours. Puis le maire a dû faire un discours devant le logo. Les journalistes pleuraient de rire.", "J'ai dit que c'était « de l'art abstrait ». Le client a gardé le logo. Il est devenu culte. Des touristes viennent se prendre en photo devant. Le tourisme a augmenté de 20 %."], en: ["'It's a tower and two hills. If you see something else, that's your problem.' Worked for three days. Then the mayor gave a speech in front of the logo. Journalists wept with laughter.", "I said it was 'abstract art'. The client kept the logo. It became iconic. Tourists come to take selfies with it. Tourism up 20%."] }, fx: { fame: 4, perf: 4, followers: 2000 }, mood: 'neutral' },
        { w: 1, text: { fr: ["Le maire a dû faire réimprimer 10 000 flyers et repeindre trois camions. Facture envoyée à mon agence. Mon agence me l'a transmise avec un post-it : « Bon courage ».", "La crèche a été surnommée « la crèche du zizi » par tout le quartier. Les parents ont lancé une pétition. Mon agence m'a remercié{|e}. Pas dans le bon sens."], en: ["The mayor had to reprint 10,000 flyers and repaint three trucks. Bill sent to my agency. My agency forwarded it with a post-it: 'Good luck.'", "The whole neighbourhood nicknamed it 'the willy daycare'. Parents started a petition. My agency let me go."] }, fx: { fired: true, money: -500 }, mood: 'cry' },
      ] },
      { label: { fr: 'Prétendre que c\'était voulu', en: 'Claim it was intentional' }, out: [
        { w: 1, text: { fr: ["J'ai dit au PDG que c'était un « message subliminal de virilité ». Il a adoré. Les ventes de soupe ont doublé chez les hommes de 40 ans. On m'a nommé{|e} direct{eur|rice} artistique.", "« C'est une provocation assumée contre la société puritaine. » Un magazine de design m'a interviewé{|e}. Je suis devenu{|e} « l'enfant terrible du logo ». Mes tarifs ont triplé."], en: ["I told the CEO it was a 'subliminal message of virility'. He loved it. Soup sales doubled among 40-year-old men. I was made art director.", "'It's a deliberate provocation against puritan society.' A design magazine interviewed me. I became 'the enfant terrible of logos'. My rates tripled."] }, fx: { promote: true, fame: 3, karma: -2 }, mood: 'proud' },
      ] },
    ],
  },
  // ───────────────────────────── garbage_collector ─────────────────────────────
  {
    id: 'c3_garb_juice', icon: '🗑️', cat: 'job', rating: 2,
    scene: { place: 'park', mood: 'sick', fx: 'poop' },
    when: { job: 'garbage_collector' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Fin juillet, 36 °C, tournée de 5 h. Le conteneur du restaurant de fruits de mer n'a pas été vidé depuis la grève. Quand tu soulèves le couvercle, il bouge. Ça grouille. Ça dégage {w:smell}, version apocalypse.",
        "La benne compacte un sac-poubelle géant. Il gonfle, gonfle… et explose. Un geyser de jus de poubelle t'arrive en pleine figure, la bouche ouverte, au moment où tu disais « ça va ».",
        "Un riverain en pyjama jette son sac directement dans la benne pendant que tu es penché{|e} dedans. Le sac contient la litière de ses quatre chats et une couche de bébé. Il crie « Pardon ! » sans s'arrêter.",
        "Tu attrapes un sac par le haut. Il se déchire. Tout le contenu — asticots, pâtes moisies et {w:gross} — se déverse sur tes chaussures, puis dans tes chaussures. Il te reste [[300|412|560]] poubelles.",
      ],
      en: [
        "End of July, 97°F, 5 a.m. round. The seafood restaurant's dumpster hasn't been emptied since the strike. When you lift the lid, it moves. It's teeming. It gives off {w:smell}, apocalypse edition.",
        "The truck compacts a giant bin bag. It swells, swells… and bursts. A geyser of bin juice hits you square in the face, mouth open, just as you were saying 'all good'.",
        "A resident in pyjamas tosses his bag straight into the truck while you're leaning in. It contains his four cats' litter and a baby's nappy. He yells 'Sorry!' without stopping.",
        "You grab a bag by the top. It tears. Everything — maggots, mouldy pasta and {w:gross} — spills onto your shoes, then into your shoes. [[300|412|560]] bins to go.",
      ],
    },
    choices: [
      { label: { fr: 'Serrer les dents', en: 'Grit your teeth' }, out: [
        { w: 2, text: { fr: ["J'ai fini la tournée, la bouche fermée, les yeux plissés, en respirant par les oreilles. Mon collègue m'a tapé dans le dos : « Bienvenue dans le métier. » Douche de 45 minutes. Je sens encore le homard.", "J'ai vomi une fois, discrètement, dans la benne. Personne ne verra la différence. J'ai fini en avance. Le chef d'équipe m'a appelé{|e} « estomac d'acier »."], en: ["I finished the round mouth shut, eyes squinting, breathing through my ears. My colleague slapped my back: 'Welcome to the job.' 45-minute shower. I still smell of lobster.", "I vomited once, discreetly, into the truck. Nobody will tell the difference. Finished early. The team lead called me 'iron stomach'."] }, fx: { perf: 8, happy: -6, visual: 'poop' }, mood: 'sick' },
        { w: 1, text: { fr: ["J'ai avalé une gorgée de jus de poubelle. Gastro carabinée, trois jours au lit, et une phobie durable des moules marinières.", "Les asticots sont remontés dans mon pantalon. J'ai fait une danse dans la rue à 5 h du matin. Une voisine a filmé : « Éboueur possédé ». 400 000 vues."], en: ["I swallowed a mouthful of bin juice. Raging stomach bug, three days in bed, and a lasting phobia of mussels.", "The maggots crawled up my trousers. I did a dance in the street at 5 a.m. A neighbour filmed it: 'Possessed Binman'. 400,000 views."] }, fx: { disease: 'gastro', health: -6, followers: 400 }, mood: 'sick' },
      ] },
      { label: { fr: 'Se venger du riverain', en: 'Get revenge on the resident' }, out: [
        { w: 1, text: { fr: ["J'ai « oublié » sa poubelle pendant trois semaines, en plein été. Il est venu s'excuser avec une bouteille de pastis. On est potes, maintenant. Il trie ses déchets en pleurant.", "J'ai déposé le contenu de sa poubelle sur son paillasson, joliment arrangé, comme une nature morte. Il a porté plainte. Le maire a ri. Avertissement quand même."], en: ["I 'forgot' his bin for three weeks, in midsummer. He came to apologise with a bottle of pastis. We're friends now. He sorts his recycling in tears.", "I arranged his bin's contents on his doormat, artfully, like a still life. He complained. The mayor laughed. Warning anyway."] }, fx: { happy: 8, perf: -4, karma: -2 }, mood: 'happy' },
      ] },
    ],
  },
  // ───────────────────────────── sewer_worker ─────────────────────────────
  {
    id: 'c3_sewer_croc', icon: '🐊', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'shock', prop: 'flashlight' },
    when: { job: 'sewer_worker' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Tu inspectes le collecteur n°12 à la lampe frontale. Deux yeux jaunes brillent dans le noir. Ils clignent. Tes collègues t'avaient parlé d'une légende urbaine. Elle a des dents.",
        "Les riverains se plaignent de « bruits de mastication » sous la rue. Tu descends. Au fond du tunnel, quelque chose de long, vert et écailleux mâchouille un vélo en libre-service.",
        "Ton chef te jure qu'un type a jeté son bébé caïman dans les toilettes il y a dix ans. Tu riais. Tu ne ris plus : il est là, 2,50 mètres, et il porte encore un petit collier « Gérard ».",
        "Patrouille de nuit dans les égouts. Ta lampe éclaire une silhouette énorme qui nage vers toi dans les eaux usées. Ça pourrait être un tronc d'arbre. Les troncs d'arbre ne sourient pas.",
      ],
      en: [
        "You're inspecting main sewer no. 12 with your headlamp. Two yellow eyes glow in the dark. They blink. Your colleagues told you about an urban legend. It has teeth.",
        "Residents complain of 'chewing noises' under the street. You go down. At the end of the tunnel, something long, green and scaly is munching on a rental bike.",
        "Your boss swears a guy flushed his baby caiman ten years ago. You laughed. You're not laughing now: it's right there, 8 feet long, still wearing a little collar that says 'Gerald'.",
        "Night patrol in the sewers. Your lamp lights up a huge shape swimming toward you through the wastewater. Could be a log. Logs don't smile.",
      ],
    },
    choices: [
      { label: { fr: 'Le filmer pour Internet', en: 'Film it for the internet' }, out: [
        { w: 2, text: { fr: ["J'ai filmé 40 secondes avant de courir comme un{|e} dératé{|e}. La vidéo a fait le tour du monde. Les télés du monde entier ont débarqué. Je suis « l'égoutier qui a vu Gérard ». Prime de la mairie.", "Vidéo floue, cris stridents, une seconde de dents. Ça a suffi : 5 millions de vues. Des chasseurs de crocodiles sont venus d'Australie. Je leur ai fait visiter pour 50 € par tête."], en: ["I filmed 40 seconds before running like hell. The video went round the world. TV crews from everywhere showed up. I'm 'the sewer worker who saw Gerald'. Bonus from the city.", "Blurry video, shrill screams, one second of teeth. Enough: 5 million views. Crocodile hunters flew in from Australia. I gave them tours at 50 bucks a head."] }, fx: { fame: 5, followers: 8000, money: 400 }, mood: 'proud' },
        { w: 1, text: { fr: ["Pendant que je cadrais, Gérard a cadré aussi. Il m'a arraché la botte et deux orteils. Merde, merde, MERDE. J'ai lâché le téléphone dans l'eau. La seule preuve, c'est mon pied.", "Il a foncé. J'ai lâché ma lampe. J'ai remonté l'échelle à une vitesse surhumaine. J'ai laissé ma dignité, mes outils et mon pantalon en bas. La vidéo ne montre que du noir et mes cris."], en: ["While I was framing the shot, Gerald was framing his. He tore off my boot and two toes. Shit, shit, SHIT. I dropped my phone in the water. The only evidence is my foot.", "It charged. I dropped my lamp. I climbed the ladder at superhuman speed. I left my dignity, my tools and my trousers down there. The video shows only darkness and my screams."] }, fx: { health: -12, disease: 'missing_finger', perf: -4 }, mood: 'shock' },
      ] },
      { label: { fr: 'Remonter et ne rien dire', en: 'Climb out and say nothing' }, text: { fr: ["Je suis remonté{|e}, j'ai refermé la plaque et j'ai écrit dans le rapport : « RAS ». Personne ne me croirait. Je ne descends plus dans le collecteur n°12. Je le contourne en vélo.", "Je n'ai rien dit. Le lendemain, un collègue est remonté en hurlant « IL EXISTE ! ». Je lui ai dit « Ah bon ? ». Je dors très mal."], en: ["I climbed out, closed the manhole and wrote in the report: 'Nothing to report.' Nobody would believe me. I don't go into main no. 12 anymore. I bike around it.", "I said nothing. The next day a colleague came up screaming 'IT EXISTS!'. I said 'Really?'. I sleep very badly."] }, fx: { stress: 10, perf: -2 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── insurance_agent ─────────────────────────────
  {
    id: 'c3_insur_fire', icon: '🔥', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'neutral', fx: 'fire' },
    when: { job: 'insurance_agent' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "M. Duval a souscrit une assurance incendie « formule platine » il y a 15 jours. Hier, sa maison a brûlé. Cause selon lui : « la foudre ». Il faisait grand soleil. Il a retiré ses meubles l'avant-veille.",
        "Une cliente déclare le vol de sa voiture de luxe. Elle est garée devant chez elle sur Google Street View, photo de ce matin. Elle te propose « un petit arrangement entre amis ».",
        "Un client déclare un dégât des eaux. Sur les photos, son aquarium de 800 litres est vide et ses poissons nagent dans le salon. Il demande aussi un dédommagement « pour le traumatisme des poissons ».",
        "Un client déclare que {w:animal} est entré chez lui et a détruit sa télé 85 pouces, sa console et son canapé. Il n'y a aucune trace d'animal. Mais il y a une manette cassée en deux sur le mur.",
      ],
      en: [
        "Mr Duval took out a 'platinum' fire policy 15 days ago. Yesterday his house burned down. Cause, according to him: 'lightning'. It was sunny. He moved his furniture out two days before.",
        "A client reports her luxury car stolen. It's parked outside her house on Street View, photo taken this morning. She offers you 'a little arrangement between friends'.",
        "A client reports water damage. In the photos, his 800-litre aquarium is empty and his fish are swimming in the living room. He also claims compensation 'for the fish's trauma'.",
        "A client says {w:animal} got into his house and destroyed his 85-inch TV, his console and his sofa. There's no trace of any animal. But there's a controller snapped in half on the wall.",
      ],
    },
    choices: [
      { label: { fr: 'Accepter le pot-de-vin', en: 'Take the bribe' }, out: [
        { w: 2, text: { fr: ["J'ai validé le dossier contre {$amount} en liquide dans une boîte de chocolats. Le chocolat était bon aussi. Mon chef n'a rien vu. La compagnie a payé. J'ai une piscine. Elle ne brûlera pas.", "« La foudre, évidemment. » J'ai signé. Il m'a glissé une enveloppe. J'ai aussi gagné un ami pyromane. Il m'appelle tous les étés."], en: ["I approved the claim for {$amount} in cash inside a box of chocolates. The chocolates were good too. My boss saw nothing. The company paid. I have a pool. It won't burn.", "'Lightning, obviously.' I signed. He slipped me an envelope. I also gained a pyromaniac friend. He calls every summer."] }, fx: { money: 'amount', karma: -10 }, mood: 'neutral' },
        { w: 1, text: { fr: ["Le service anti-fraude m'avait mis{|e} sur écoute. L'enveloppe était marquée. Les gendarmes m'attendaient devant mon bureau avec la boîte de chocolats sous scellés.", "Le client était un enquêteur infiltré de la compagnie. Il a enregistré toute la conversation. Licenciement et convocation au commissariat."], en: ["The anti-fraud unit had me wiretapped. The envelope was marked. Police were waiting outside my office with the chocolate box in an evidence bag.", "The client was an undercover company investigator. He recorded the whole thing. Fired and summoned to the police station."] }, fx: { arrest: 'embezzle', fired: true }, mood: 'shock' },
      ] },
      { label: { fr: 'Enquêter à fond', en: 'Investigate thoroughly' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai trouvé le ticket d'achat d'un jerrican, d'un briquet et d'un livre « L'incendie parfait pour les nuls ». Fraude démasquée, 300 000 € économisés. On m'a nommé{|e} expert{|e} senior.", "Les poissons, interrogés par un vétérinaire, ont confirmé : pas de traumatisme. Le client a tout avoué. Mon chef m'a offert une prime et un poisson rouge."], en: ["I found the receipt for a jerrycan, a lighter and a book called 'The Perfect Fire for Dummies'. Fraud exposed, $300,000 saved. I was made senior claims expert.", "The fish, examined by a vet, confirmed: no trauma. The client confessed everything. My boss gave me a bonus and a goldfish."] }, fx: { perf: 12, promote: true, karma: 4 }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["Mon enquête n'a rien prouvé. Le client a été indemnisé et m'a envoyé une carte postale de sa nouvelle villa {w:far_place}. Elle était assurée chez nous. Elle a brûlé aussi.", "J'ai passé trois mois sur le dossier. Mon chef a trouvé ça « trop long » et a payé pour clore le dossier. Mon temps, lui, ne sera pas remboursé."], en: ["My investigation proved nothing. The client got paid and sent me a postcard of his new villa {w:far_place}. Insured with us. It burned too.", "Three months on the file. My boss found it 'too long' and paid out to close it. My time won't be reimbursed."] }, fx: { perf: -4, stress: 6 }, mood: 'sad' },
      ] },
    ],
    vars: { amount: [2000, 6000] },
  },
  // ───────────────────────────── real_estate ─────────────────────────────
  {
    id: 'c3_realestate_studio', icon: '🏚️', cat: 'job', rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'keys' },
    when: { job: 'real_estate' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Visite d'un « studio cosy » de [[9|11|7]] m² au 7e sans ascenseur. La douche est dans la cuisine, les toilettes sont sous le lit mezzanine. 43 candidats font la queue dans l'escalier. Le loyer : 1 100 € par mois.",
        "Tu fais visiter un « appartement atypique avec du cachet ». Le cachet, c'est une fissure en forme d'éclair et une odeur de cave. Le propriétaire veut un locataire « CDI, 3 garants et pas d'enfants, ni d'animaux, ni d'amis ».",
        "Le propriétaire du studio que tu fais visiter t'a demandé de privilégier « une jeune femme seule, mignonne, qui aime les visites surprises ». Il habite sur le palier. Il a une clé.",
        "Une candidate te glisse 500 € en liquide pendant la visite pour passer devant les 40 autres. Un autre candidat te propose {w:gift}. Le troisième pleure dans les toilettes-sous-le-lit.",
      ],
      en: [
        "Showing a 'cosy studio' of [[100|120|75]] sq ft on the 7th floor, no lift. The shower is in the kitchen, the toilet is under the loft bed. 43 applicants queue on the stairs. Rent: $1,100 a month.",
        "You're showing an 'atypical flat with character'. The character is a lightning-bolt crack and a cellar smell. The landlord wants a tenant with 'a permanent contract, 3 guarantors and no kids, pets or friends'.",
        "The landlord of the studio you're showing asked you to favour 'a cute young woman living alone who likes surprise visits'. He lives across the landing. He has a key.",
        "During the viewing, an applicant slips you $500 cash to jump ahead of the other 40. Another offers you {w:gift}. A third is crying in the under-the-bed toilet.",
      ],
    },
    choices: [
      { label: { fr: 'Prendre l\'enveloppe', en: 'Take the envelope' }, out: [
        { w: 2, text: { fr: ["J'ai pris les 500 €, puis j'ai fait pareil avec les quatre suivants. Le studio a été loué au plus offrant. J'ai gagné 2 500 € en une visite. J'ai acheté un studio. Plus grand. 10 m².", "Enveloppe acceptée. La candidate a eu l'appart. Les 42 autres m'ont maudit{|e} dans l'escalier. Mon agence m'a félicité{|e} pour ma « réactivité »."], en: ["I took the $500, then did the same with the next four. Rented to the highest bidder. I made $2,500 in one viewing. I bought a studio. Bigger. 110 sq ft.", "Envelope accepted. She got the flat. The other 42 cursed me on the stairs. My agency praised my 'responsiveness'."] }, fx: { money: 500, karma: -8, perf: 6 }, mood: 'neutral' },
        { w: 1, text: { fr: ["La candidate était journaliste. Reportage « Les arnaques du logement » au 20 h. On voit mes mains prendre l'enveloppe. Ma mère m'a appelé{|e} en pleurant. Mon agence, en hurlant.", "Un des candidats évincés m'a dénoncé{|e}. Enquête interne. Licenciement. Je cherche maintenant un logement. C'est l'enfer."], en: ["She was a journalist. Prime-time report: 'Housing scams'. You can see my hands taking the envelope. My mum called me crying. My agency, screaming.", "One of the rejected applicants reported me. Internal investigation. Fired. Now I'm looking for a flat. It's hell."] }, fx: { fired: true, karma: -4 }, mood: 'shock' },
      ] },
      { label: { fr: 'Dénoncer le propriétaire', en: 'Report the landlord' }, out: [
        { w: 1, text: { fr: ["J'ai prévenu la mairie, l'inspection sanitaire et un avocat. Le studio a été déclaré insalubre et le proprio poursuivi. Mon agence a perdu un client. J'ai gagné un sommeil réparateur.", "J'ai refusé le mandat et balancé les messages du proprio sur les réseaux. Il a été viré de l'immeuble par les autres copropriétaires. Ma patronne m'a félicité{|e}, puis réprimandé{|e}, puis félicité{|e}."], en: ["I alerted city hall, health inspectors and a lawyer. The studio was declared unfit and the landlord prosecuted. My agency lost a client. I gained restful sleep.", "I dropped the listing and posted the landlord's messages online. The other co-owners kicked him out of the building. My boss congratulated me, then scolded me, then congratulated me."] }, fx: { karma: 10, perf: -4 }, mood: 'proud' },
      ] },
    ],
  },
  // ───────────────────────────── translator ─────────────────────────────
  {
    id: 'c3_trans_subtitles', icon: '🔞', cat: 'job', rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'laptop' },
    when: { job: 'translator' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Une plateforme de streaming te commande les sous-titres d'un « documentaire allemand sur la plomberie ». Au bout de quatre minutes, tu comprends que le plombier n'est pas venu pour le tuyau. Il reste [[87|112|64]] minutes.",
        "Commande urgente : traduire un roman érotique suédois de 400 pages pour demain. Le chapitre 12 se passe dans un sauna, avec un élan. Ta grand-mère vient d'arriver pour le thé.",
        "Tu dois traduire le dialogue d'un film pour adultes japonais. Le dialogue se résume à 300 variantes de « Oh ». Le client exige « de la nuance » et « du rythme ». Payé au mot.",
        "On te confie la notice d'un sex-toy chinois très sophistiqué. La notice originale est déjà une traduction automatique d'une traduction automatique. Section 4 : « Insérer le dragon joyeux dans la porte du bonheur. »",
      ],
      en: [
        "A streaming platform orders subtitles for a 'German documentary about plumbing'. Four minutes in, you realise the plumber isn't there for the pipe. [[87|112|64]] minutes to go.",
        "Rush order: translate a 400-page Swedish erotic novel by tomorrow. Chapter 12 is set in a sauna, with a moose. Your grandma just arrived for tea.",
        "You must translate the dialogue of a Japanese adult film. The dialogue boils down to 300 variations of 'Oh'. The client demands 'nuance' and 'rhythm'. Paid per word.",
        "You're given the manual for a very sophisticated Chinese sex toy. The original manual is already a machine translation of a machine translation. Section 4: 'Insert the joyful dragon into the door of happiness.'",
      ],
    },
    choices: [
      { label: { fr: 'Traduire avec talent', en: 'Translate with flair' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai traduit avec une poésie inattendue. « Ach ja » est devenu « Ô volupté des canalisations ». La plateforme a reçu des compliments sur les sous-titres. C'est une première dans l'industrie.", "J'ai trouvé 300 façons différentes de dire « Oh ». J'ai été payé{|e} 300 mots. Le client m'a recommandé{|e} à toute la profession. Je suis maintenant LA référence. Ma famille ne doit jamais savoir."], en: ["I translated with unexpected poetry. 'Ach ja' became 'O rapture of the pipes'. The platform got compliments on the subtitles. A first in the industry.", "I found 300 different ways to say 'Oh'. Got paid for 300 words. The client recommended me to the whole industry. I'm now THE reference. My family must never know."] }, fx: { money: 900, perf: 10, happy: 4 }, mood: 'proud' },
      ] },
      { label: { fr: 'Travailler devant mamie', en: 'Work in front of grandma' }, out: [
        { w: 1, text: { fr: ["Mamie a lu par-dessus mon épaule. Elle a corrigé une faute d'accord, puis m'a dit : « Ton grand-père et moi, en 1962, dans un sauna à Oslo… » Je ne m'en remettrai pas.", "Mamie a vu l'écran. Silence. Puis elle a demandé à quelle page commençait le chapitre 12 et a emporté le manuscrit chez elle. Elle me l'a rendu une semaine plus tard, annoté."], en: ["Grandma read over my shoulder. She corrected an agreement error, then said: 'Your grandfather and I, in 1962, in a sauna in Oslo…' I'll never recover.", "Grandma saw the screen. Silence. Then she asked which page chapter 12 started on and took the manuscript home. She returned it a week later, annotated."] }, fx: { happy: -4, stress: 6, perf: 4 }, mood: 'shock' },
      ] },
      { label: { fr: 'Passer par Google Traduction', en: 'Use Google Translate' }, out: [
        { w: 1, text: { fr: ["Le plombier dit désormais « Je vais installer votre robinet de compassion ». La version française est devenue culte sur les forums. Le client m'a payé{|e} et m'a blacklisté{|e}.", "La notice traduite automatiquement recommande de « nourrir le dragon trois fois par jour ». Une cliente a porté plainte. On a retrouvé mon nom dans les métadonnées."], en: ["The plumber now says 'I will install your faucet of compassion.' The translated version became a forum cult classic. The client paid me and blacklisted me.", "The machine-translated manual recommends 'feeding the dragon three times a day'. A customer complained. They found my name in the metadata."] }, fx: { perf: -10, money: 200, followers: 500 }, mood: 'neutral' },
      ] },
    ],
  },
  // ───────────────────────────── dentist ─────────────────────────────
  {
    id: 'c3_dentist_gas', icon: '🦷', cat: 'job', rating: 1,
    scene: { place: 'hospital', mood: 'shock', prop: 'drill' },
    when: { job: 'dentist' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Ton patient, sous protoxyde d'azote, se met à tout avouer : il trompe sa femme, il a volé la caisse de son club de pétanque et il a enterré un corps « mais c'était celui du chat, promis ». Sa femme est en salle d'attente.",
        "Sous gaz hilarant, le maire de la ville te confie, en riant, qu'il truque les marchés publics « depuis 2008, hihihi ». Puis il te demande ta main en mariage.",
        "Ta patiente, une avocate très sérieuse, sous protoxyde, chante {w:song} en boucle puis te révèle les secrets de trois de ses clients célèbres. Elle te fait jurer de « tout oublier ».",
        "Le gaz fait effet. Ton patient, un prêtre, te raconte ce qu'il a entendu en confession cette semaine. Avec les noms. Et les adresses. Et un petit rire diabolique.",
      ],
      en: [
        "Your patient, on nitrous oxide, starts confessing everything: he's cheating on his wife, he stole his bowls club's cash box, and he buried a body 'but it was the cat's, promise'. His wife is in the waiting room.",
        "On laughing gas, the mayor giggles that he's been rigging public contracts 'since 2008, hee hee'. Then he asks you to marry him.",
        "Your patient, a very serious lawyer, on nitrous, sings {w:song} on loop then spills the secrets of three of her famous clients. She makes you swear to 'forget it all'.",
        "The gas kicks in. Your patient, a priest, tells you what he heard in confession this week. With names. And addresses. And a little devilish laugh.",
      ],
    },
    choices: [
      { label: { fr: 'Secret médical', en: 'Doctor-patient confidentiality' }, out: [
        { w: 2, text: { fr: ["J'ai soigné sa carie, rangé mes instruments et oublié tout ce que j'avais entendu. Presque tout. Je ne joue plus à la pétanque dans ce club.", "Secret absolu. Il est reparti avec un plombage et sa dignité. Il ne se souvient de rien. Moi, de tout. Je le salue avec un clin d'œil chaque fois qu'on se croise. Il ne comprend pas."], en: ["I fixed his cavity, put away my tools and forgot everything I heard. Almost everything. I no longer play bowls at that club.", "Total confidentiality. He left with a filling and his dignity. He remembers nothing. I remember everything. I wink at him whenever we meet. He doesn't get it."] }, fx: { karma: 4, perf: 6 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Augmenter mes tarifs pour lui', en: 'Raise his rates' }, out: [
        { w: 1, text: { fr: ["Le lendemain, je lui ai envoyé une facture de 2 000 € pour un détartrage. Il a payé sans discuter. Il a compris. On a désormais une relation professionnelle très saine, basée sur la peur.", "Le maire m'a soudain attribué le marché des cantines scolaires. Je suis dentiste. Je ne sais pas cuisiner. Mais je vends très bien des brosses à dents aux enfants."], en: ["Next day I billed him $2,000 for a scale-and-polish. He paid without a word. He understood. We now have a very healthy professional relationship, based on fear.", "The mayor suddenly awarded me the school canteen contract. I'm a dentist. I can't cook. But I sell toothbrushes to kids very well."] }, fx: { money: 2000, karma: -8 }, mood: 'neutral' },
        { w: 1, text: { fr: ["Il a porté plainte pour chantage. Le juge m'a demandé comment je savais. J'ai dû expliquer le protoxyde. Mon cabinet a été inspecté. On m'a retiré le gaz. Mes patients me haïssent.", "Le patient se souvenait de tout, en fait. Il m'a dénoncé{|e} à l'ordre. Suspension de six mois. Je fais des détartrages au noir dans mon garage."], en: ["He sued for blackmail. The judge asked how I knew. I had to explain the nitrous. My practice got inspected. They took away my gas. My patients hate me.", "Turns out he remembered everything. He reported me to the board. Six-month suspension. I do under-the-table cleanings in my garage."] }, fx: { perf: -10, money: -1000 }, mood: 'shock' },
      ] },
    ],
  },
  // ───────────────────────────── vet ─────────────────────────────
  {
    id: 'c3_vet_hamster', icon: '🐹', cat: 'job', rating: 0,
    scene: { place: 'hospital', mood: 'sad' },
    when: { job: 'vet' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Une famille entière débarque en larmes avec un hamster nommé Monsieur Pantoufle. Il est raide comme une biscotte depuis hier. Le père exige « un massage cardiaque et une IRM ».",
        "Un client te dépose un poisson rouge dans un sachet congélation : « Il ne nage plus droit. » Il flotte sur le dos depuis trois jours. Le client a un budget de 2 000 € et beaucoup d'espoir.",
        "Une dame veut que tu « réanimes » sa perruche, morte de vieillesse à 19 ans. Elle a apporté une photo d'elle jeune, un pull qu'elle a tricoté pour elle et {w:gift}.",
        "Un enfant de 8 ans pose sur ton comptoir une boîte à chaussures contenant un escargot écrasé et sa tirelire : 3,40 €. « Vous pouvez le réparer, docteur ? »",
      ],
      en: [
        "A whole family bursts in crying with a hamster named Mr Slippers. He's been stiff as a cracker since yesterday. The father demands 'CPR and an MRI'.",
        "A client hands you a goldfish in a freezer bag: 'He's not swimming straight.' It's been floating belly-up for three days. The client has a $2,000 budget and a lot of hope.",
        "A lady wants you to 'revive' her budgie, dead of old age at 19. She brought a photo of it as a young bird, a sweater she knitted for it and {w:gift}.",
        "An 8-year-old puts a shoebox on your counter holding a squashed snail and his piggy bank: $3.40. 'Can you fix him, doctor?'",
      ],
    },
    choices: [
      { label: { fr: 'Tenter la réanimation', en: 'Attempt resuscitation' }, out: [
        { w: 2, text: { fr: ["J'ai fait un massage cardiaque avec deux doigts sur un hamster mort, devant une famille en pleurs, avec le plus grand sérieux. « Nous avons tout essayé. » Ils m'ont remercié{|e}. Ils m'ont fait un câlin collectif.", "J'ai mis le poisson dans un bocal oxygéné, prononcé des mots latins et attendu dix minutes. Rien. Le client était soulagé qu'« on ait au moins tenté ». J'ai facturé 30 €. C'était honnête."], en: ["I did two-finger CPR on a dead hamster, in front of a sobbing family, with the utmost seriousness. 'We tried everything.' They thanked me. Group hug.", "I put the fish in an oxygenated bowl, said some Latin words and waited ten minutes. Nothing. The client was relieved 'we at least tried'. I charged $30. That was fair."] }, fx: { perf: 6, karma: 4, happy: 2 }, mood: 'sad' },
        { w: 1, text: { fr: ["Miracle : Monsieur Pantoufle n'était qu'en hibernation. Il s'est réveillé, m'a mordu, puis a filé sous le radiateur. La famille pense que j'ai des pouvoirs. Clientèle +40 %.", "Le poisson a bougé. Il a vraiment bougé. Il a vécu encore deux ans. Le client m'a offert une plaque gravée « Au docteur qui a vaincu la mort ». Elle est dans la salle d'attente."], en: ["Miracle: Mr Slippers was only hibernating. He woke up, bit me, then shot under the radiator. The family thinks I have powers. Clients +40%.", "The fish moved. It really moved. Lived two more years. The client gave me an engraved plaque: 'To the doctor who conquered death'. It's in the waiting room."] }, fx: { perf: 14, fame: 2, happy: 8 }, mood: 'proud' },
      ] },
      { label: { fr: 'Annoncer la nouvelle', en: 'Break the news' }, text: { fr: ["J'ai expliqué avec douceur qu'il était parti au « paradis des roues ». L'enfant m'a demandé s'il pouvait l'enterrer avec un tank Lego pour le protéger. J'ai dit oui. J'ai pleuré dans la réserve.", "J'ai annoncé la mort avec tact et proposé une crémation. 180 €. Ils ont choisi l'urne en forme de fromage. Le père a fait un discours. J'étais invité{|e}."], en: ["I gently explained he'd gone to 'wheel heaven'. The child asked if he could bury him with a Lego tank for protection. I said yes. I cried in the storeroom.", "I broke the news tactfully and offered cremation. $180. They chose the cheese-shaped urn. The father gave a eulogy. I was invited."] }, fx: { money: 180, karma: 2, happy: -3 }, mood: 'cry' },
    ],
  },
  // ───────────────────────────── pharmacist ─────────────────────────────
  {
    id: 'c3_pharma_friend', icon: '💊', cat: 'job', rating: 1,
    scene: { place: 'hospital', mood: 'shock', prop: 'pills' },
    when: { job: 'pharmacist' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Un homme d'âge mûr, lunettes noires, chuchote : « C'est pour un ami. Il aurait besoin… de la petite pilule bleue. Et d'un lubrifiant. Et d'une pommade pour une irritation. Pour un ami. » C'est ton oncle.",
        "Un client demande, en rougissant, un test de grossesse, des préservatifs, un test de dépistage et des chewing-gums « dans cet ordre-là, mais pas forcément ». C'est le fils du maire. Il a 40 ans.",
        "Une dame très chic t'explique à voix basse que son mari « n'arrive plus à hisser le drapeau ». Elle veut « quelque chose de fort ». Derrière elle, toute la file a cessé de respirer pour écouter.",
        "Le curé du village entre, regarde à gauche, à droite, et pose sur le comptoir une ordonnance pour un traitement contre une infection « qui s'attrape en voyage ». Il revient de Lourdes.",
      ],
      en: [
        "A middle-aged man in sunglasses whispers: 'It's for a friend. He needs… the little blue pill. And some lube. And an ointment for an irritation. For a friend.' It's your uncle.",
        "A blushing customer asks for a pregnancy test, condoms, an STD test and chewing gum 'in that order, but not necessarily'. It's the mayor's son. He's 40.",
        "A very chic lady explains under her breath that her husband 'can no longer raise the flag'. She wants 'something strong'. Behind her, the whole queue has stopped breathing to listen.",
        "The village priest walks in, looks left, right, and puts on the counter a prescription for an infection 'you catch while travelling'. He's just back from a pilgrimage.",
      ],
    },
    choices: [
      { label: { fr: 'Rester professionnel{|le}', en: 'Stay professional' }, out: [
        { w: 2, text: { fr: ["J'ai tout emballé dans un sac opaque, souri comme si c'était du sirop pour la toux et dit « Bonne journée ». Discrétion absolue. Il m'a laissé un pourboire. On ne laisse jamais de pourboire en pharmacie.", "« Et pour votre ami, ce sera tout ? » Il a hoché la tête, rouge. Je lui ai donné les conseils d'usage avec un sérieux de notaire. La file était déçue."], en: ["I bagged everything in an opaque bag, smiled like it was cough syrup and said 'Have a nice day'. Total discretion. He tipped me. Nobody tips at a pharmacy.", "'And will that be all for your friend?' He nodded, red. I gave the usual advice with notary-level seriousness. The queue was disappointed."] }, fx: { perf: 6, karma: 3 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Répéter à voix haute', en: 'Repeat it out loud' }, out: [
        { w: 1, text: { fr: ["« Donc du VIAGRA, du LUBRIFIANT et une POMMADE, c'est bien ça ? » La file a éclaté de rire. Mon oncle a quitté la pharmacie et, je crois, la famille. Mon patron m'a mis{|e} à la réserve.", "J'ai lu l'ordonnance du curé à voix haute « pour vérifier ». Tout le village le sait maintenant. La messe de dimanche a battu des records d'affluence."], en: ["'So VIAGRA, LUBE and an OINTMENT, is that right?' The queue burst out laughing. My uncle left the pharmacy and, I think, the family. My boss moved me to the stockroom.", "I read the priest's prescription aloud 'to double-check'. The whole village knows now. Sunday mass hit record attendance."] }, fx: { happy: 6, perf: -8, karma: -4 }, mood: 'happy' },
      ] },
    ],
  },
  // ───────────────────────────── archaeologist ─────────────────────────────
  {
    id: 'c3_archeo_parking', icon: '🏺', cat: 'job', rating: 0,
    scene: { place: 'park', mood: 'proud', prop: 'shovel' },
    when: { job: 'archaeologist' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Fouilles préventives sur le futur parking du supermarché. Ta truelle heurte une mosaïque romaine intacte de 40 m². Le promoteur arrive avec une pelleteuse et un sourire : « Rien vu, hein ? »",
        "Tu découvres un squelette du néolithique. À côté, dans la même couche, {w:object}. Ton directeur de fouilles est formel : « Ça change toute l'histoire de l'humanité. » Ou un stagiaire l'a perdu.",
        "Sous la future rocade, tu trouves les fondations d'un temple gaulois. Le maire t'appelle : « On inaugure dans trois semaines. Vous pouvez faire vite ? Genre, très vite ? Genre, pas du tout ? »",
        "Ton équipe a passé quatre mois à fouiller ce que tu croyais être un tumulus celte. C'est la décharge sauvage de la mairie de 1987. Tu as trouvé un Minitel, deux mobylettes et la VHS {w:movie}.",
      ],
      en: [
        "Preventive dig on the future supermarket car park. Your trowel hits an intact 40 m² Roman mosaic. The developer arrives with a digger and a smile: 'Didn't see anything, right?'",
        "You uncover a Neolithic skeleton. Next to it, in the same layer: {w:object}. Your dig director is adamant: 'This changes the whole history of humanity.' Or an intern dropped it.",
        "Under the future bypass, you find the foundations of a Gallic temple. The mayor calls: 'We open in three weeks. Can you be quick? Like, very quick? Like, not at all?'",
        "Your team spent four months excavating what you thought was a Celtic burial mound. It's the town's illegal dump from 1987. You found a Minitel, two mopeds and a VHS of {w:movie}.",
      ],
    },
    choices: [
      { label: { fr: 'Protéger le site', en: 'Protect the site' }, out: [
        { w: 2, text: { fr: ["Je me suis allongé{|e} devant la pelleteuse, comme dans les années 70. La presse est venue. La mosaïque est classée. Le parking sera construit à côté. Les clients du supermarché marchent maintenant sur une vitre au-dessus de Neptune.", "J'ai appelé le ministère, trois journaux et ma mère. Le chantier est arrêté. Le promoteur m'a envoyé un avocat et un panier garni. J'ai gardé le panier."], en: ["I lay down in front of the digger, seventies-style. The press came. The mosaic got listed. The car park will be built next to it. Shoppers now walk on glass above Neptune.", "I called the ministry, three newspapers and my mother. Construction halted. The developer sent me a lawyer and a gift basket. I kept the basket."] }, fx: { karma: 8, fame: 3, perf: 8 }, mood: 'proud' },
        { w: 1, text: { fr: ["Le promoteur avait des amis haut placés. La mosaïque a été « déplacée » en 4 000 morceaux dans des sacs de gravats. On m'a muté{|e} sur un chantier {w:far_place}.", "Les autorités ont pris trois ans à répondre. Entre-temps, le parking a été construit. La mosaïque est sous la place 47. Je vais parfois m'y garer pour lui tenir compagnie."], en: ["The developer had friends in high places. The mosaic was 'relocated' in 4,000 pieces in rubble bags. I was transferred to a dig {w:far_place}.", "Authorities took three years to respond. Meanwhile, the car park was built. The mosaic is under space 47. I sometimes park there to keep it company."] }, fx: { perf: -6, happy: -6 }, mood: 'sad' },
      ] },
      { label: { fr: 'Publier une théorie folle', en: 'Publish a wild theory' }, out: [
        { w: 1, text: { fr: ["J'ai publié « Les Néolithiques connaissaient-ils le plastique ? ». Un documentaire de chaîne câblée m'a interviewé{|e} entre deux spécialistes des extraterrestres. Mes collègues ne me parlent plus. Mes royalties, si.", "J'ai présenté la VHS comme « un artefact rituel ». Une revue de vulgarisation a fait sa une dessus. Les vrais archéologues ont ri pendant un an. J'ai vendu 30 000 livres."], en: ["I published 'Did Neolithic People Know Plastic?'. A cable documentary interviewed me between two alien experts. My colleagues no longer speak to me. My royalties do.", "I presented the VHS as 'a ritual artefact'. A pop-science magazine put it on the cover. Real archaeologists laughed for a year. I sold 30,000 books."] }, fx: { fame: 5, money: 2000, smarts: -2, karma: -2 }, mood: 'happy' },
      ] },
    ],
  },
  // ───────────────────────────── marine_biologist ─────────────────────────────
  {
    id: 'c3_marine_dolphin', icon: '🐬', cat: 'job', rating: 2,
    scene: { place: 'beach', mood: 'shock' },
    when: { job: 'marine_biologist' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Tu étudies un groupe de dauphins sauvages. Le mâle dominant, que tu as baptisé Kévin, a décidé que tu étais l'élu{|e} de son cœur. Il frotte. Il insiste. Il fait des bruits.",
        "Plongée scientifique. Un dauphin solitaire s'est pris d'affection pour toi. Beaucoup trop d'affection. Les touristes du bateau d'observation applaudissent sans comprendre ce qu'ils voient.",
        "Ton sujet d'étude, un grand dauphin mâle, te suit partout depuis trois semaines. Ce matin, il t'a apporté un poisson mort, puis a tenté de « s'accoupler » avec ta bouée, puis avec ta jambe.",
        "Les dauphins sont connus pour leur intelligence et leur libido débordante. Tu découvres la deuxième partie en direct, avec une équipe de tournage pour un documentaire jeunesse.",
      ],
      en: [
        "You're studying a pod of wild dolphins. The alpha male, whom you named Kevin, has decided you're his breeding partner. He rubs. He insists. He makes noises.",
        "Research dive. A lone dolphin has taken a liking to you. Far too much of a liking. Tourists on the whale-watching boat applaud, not understanding what they're seeing.",
        "Your study subject, a male bottlenose, has followed you everywhere for three weeks. This morning he brought you a dead fish, then tried to 'mate' with your buoy, then with your leg.",
        "Dolphins are known for their intelligence and overflowing libido. You discover the second part live, with a film crew shooting a children's documentary.",
      ],
    },
    choices: [
      { label: { fr: 'Remonter vite', en: 'Surface fast' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: ["J'ai battu mon record de remontée. Kévin m'a suivi{|e} jusqu'au bateau, a fait un salto, puis m'a éclaboussé{|e}. Les enfants ont trouvé ça « trop mignon ». Le cameraman a coupé à temps.", "Retour sur le bateau en 14 secondes. Kévin a fait des cercles autour pendant une heure en sifflant. Mon chef de mission a noté dans le carnet : « Comportement social complexe ». Merci, chef."], en: ["I set a personal ascent record. Kevin followed me to the boat, did a flip, then splashed me. The kids found it 'so cute'. The cameraman cut just in time.", "Back on the boat in 14 seconds. Kevin circled for an hour, whistling. My mission lead wrote in the log: 'Complex social behaviour'. Thanks, boss."] }, fx: { perf: 4, stress: 6 }, mood: 'shock' },
        { w: 1, odds: { athletic: -1 }, text: { fr: ["Kévin était plus rapide. Il m'a coincé{|e} contre la coque et a… insisté. Le documentaire jeunesse a dû être remonté entièrement. On voit maintenant un plan de coucher de soleil de 4 minutes.", "Il m'a percuté{|e} dans les côtes avec beaucoup d'enthousiasme. Deux côtes fêlées. La vidéo d'un touriste fait 10 millions de vues sous le titre « Love Is Love ». Mes collègues l'ont en fond d'écran."], en: ["Kevin was faster. He pinned me against the hull and… insisted. The children's documentary had to be fully re-edited. It now features a 4-minute sunset shot.", "He rammed my ribs with great enthusiasm. Two cracked ribs. A tourist's video has 10 million views under the title 'Love Is Love'. My colleagues use it as wallpaper."] }, fx: { health: -8, followers: 5000, fame: 3 }, mood: 'shock' },
      ] },
      { label: { fr: 'Prendre des notes', en: 'Take notes' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai tout documenté avec rigueur. Mon article « Comportements sexuels interspécifiques chez Tursiops truncatus : une approche participative » a été publié. On m'invite dans tous les colloques. On rit beaucoup dans mon dos.", "Données uniques au monde. J'ai obtenu une bourse énorme et un surnom dans la communauté scientifique que je ne répéterai pas."], en: ["I documented everything rigorously. My paper 'Interspecies sexual behaviour in Tursiops truncatus: a participatory approach' got published. I'm invited to every conference. People laugh a lot behind my back.", "World-unique data. I got a huge grant and a nickname in the scientific community I won't repeat."] }, fx: { perf: 12, smarts: 2, fame: 2 }, mood: 'proud' },
      ] },
    ],
  },
  // ───────────────────────────── park_ranger ─────────────────────────────
  {
    id: 'c3_ranger_reveal', icon: '🔥', cat: 'job', rating: 2,
    scene: { place: 'park', mood: 'shock', fx: 'fire' },
    when: { job: 'park_ranger' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Un couple organise une « gender reveal party » dans ta forêt, en pleine sécheresse. Le futur papa allume un fumigène rose. L'herbe prend feu. Puis un pin. Puis le futur papa.",
        "Des campeurs ont fait un barbecue géant sous un panneau « Risque incendie extrême ». Ils te proposent une merguez. Derrière eux, les flammes atteignent la cime des arbres.",
        "Un influenceur tire un feu d'artifice dans la réserve naturelle pour sa vidéo « Nuit magique ». Une fusée part à l'horizontale et transperce une tente. Il y avait quelqu'un dedans. Il y a des cris.",
        "Un touriste a voulu « faire comme dans {w:movie} » et brûler une lettre d'amour dans un tonneau. Le tonneau a roulé. La forêt crame, le touriste court en slip, les sourcils en feu.",
      ],
      en: [
        "A couple throws a 'gender reveal party' in your forest, mid-drought. The dad-to-be lights a pink smoke bomb. The grass catches fire. Then a pine. Then the dad-to-be.",
        "Campers set up a giant barbecue under a sign reading 'Extreme fire risk'. They offer you a sausage. Behind them, flames are reaching the treetops.",
        "An influencer sets off fireworks in the nature reserve for his 'Magic Night' video. A rocket flies horizontally and pierces a tent. Someone was inside. There's screaming.",
        "A tourist wanted to 'do it like in {w:movie}' and burn a love letter in a barrel. The barrel rolled. The forest is burning, the tourist is running in his briefs, eyebrows on fire.",
      ],
    },
    choices: [
      { label: { fr: 'Éteindre en héros', en: 'Fight the fire like a hero' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: ["Pelle, couverture, extincteur et beaucoup de jurons. J'ai éteint le papa d'abord, la forêt ensuite. Le bébé sera une fille. Ils voulaient l'appeler comme moi. J'ai refusé, j'ai dit « Appelez-la Prudence ».", "J'ai roulé le touriste dans la boue, puis éteint le départ de feu à coups de veste. Les pompiers sont arrivés à la fin et ont pris des selfies. Le préfet m'a remis une médaille."], en: ["Shovel, blanket, extinguisher and lots of swearing. Put out the dad first, the forest second. The baby's a girl. They wanted to name her after me. I refused and said 'Name her Prudence.'", "I rolled the tourist in the mud, then beat out the fire with my jacket. Firefighters arrived at the end and took selfies. The prefect gave me a medal."] }, fx: { perf: 12, fame: 3, health: -4, karma: 6 }, mood: 'proud' },
        { w: 1, odds: { athletic: -1 }, text: { fr: ["Le vent a tourné. J'ai perdu mes sourcils, ma frange et la moitié de ma dignité. 200 hectares partis en fumée. Le papa, lui, s'en tire avec une coupe de cheveux originale.", "J'ai glissé dans le ravin en courant avec l'extincteur. Fracture du bras, brûlures au second degré. Le couple a posté « Petit incident, mais c'est une FILLE !!! 💖 »."], en: ["The wind turned. I lost my eyebrows, my fringe and most of my dignity. 500 acres gone up in smoke. The dad got away with an unusual haircut.", "I slipped into the ravine running with the extinguisher. Broken arm, second-degree burns. The couple posted 'Small incident, but it's a GIRL!!! 💖'."] }, fx: { health: -12, disease: 'burns', perf: -4, visual: 'fire' }, mood: 'sick' },
      ] },
      { label: { fr: 'Verbaliser d\'abord', en: 'Write them a ticket first' }, out: [
        { w: 1, text: { fr: ["J'ai rédigé le procès-verbal avec une calligraphie parfaite pendant que la forêt brûlait. Amende : 135 €. Les dégâts : 3 millions. Ma hiérarchie a trouvé que j'avais « le sens des priorités inversé ».", "Le papa en feu a signé le PV en courant. L'amende est valide. La forêt, moins. On m'a muté{|e} au bureau des permis de pêche."], en: ["I wrote the ticket in perfect calligraphy while the forest burned. Fine: $135. Damage: $3 million. My superiors said my 'priorities were inverted'.", "The burning dad signed the ticket while running. The fine is valid. The forest, less so. I got transferred to the fishing-licence office."] }, fx: { perf: -10, karma: -4 }, mood: 'sad' },
      ] },
    ],
  },
  // ───────────────────────────── hacker ─────────────────────────────
  {
    id: 'c3_hack_family', icon: '🖨️', cat: 'job', rating: 1,
    scene: { place: 'home', mood: 'angry', prop: 'laptop' },
    when: { job: 'hacker' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Repas de famille. Ta tante a appris que tu étais « dans l'informatique ». Elle a apporté son imprimante, sa box internet et un ordinateur de 2009 qui fait {w:sound} quand on l'allume.",
        "Ta mère t'appelle à 23 h : « Toi qui es hacker, tu peux me récupérer le mot de passe de mon compte de cuisine ? J'ai perdu ma recette pour {w:food}. » Elle a utilisé « motdepasse » partout.",
        "Ton oncle a cliqué sur un mail « Vous avez gagné un iPhone » 400 fois. Son écran est couvert de pop-ups de casinos en ligne. Il te tend l'ordinateur en disant : « J'ai rien touché. »",
        "Ton grand-père veut que tu « pirates la télé » pour avoir {w:show} gratuitement. Puis il demande si tu peux « supprimer Internet » parce que sa voisine l'a bloqué sur Facebook.",
      ],
      en: [
        "Family dinner. Your aunt found out you're 'in computers'. She brought her printer, her router and a 2009 laptop that makes {w:sound} when it boots.",
        "Your mum calls at 11 p.m.: 'You're a hacker, can you get back my cooking-site password? I lost my recipe for {w:food}.' She uses 'password' for everything.",
        "Your uncle clicked a 'You won an iPhone' email 400 times. His screen is covered in online-casino pop-ups. He hands you the computer saying: 'I didn't touch anything.'",
        "Your grandpa wants you to 'hack the TV' so he can watch {w:show} for free. Then he asks if you can 'delete the internet' because his neighbour blocked him on Facebook.",
      ],
    },
    choices: [
      { label: { fr: 'Tout réparer', en: 'Fix everything' }, out: [
        { w: 2, text: { fr: ["J'ai passé cinq heures à désinstaller 63 barres d'outils et à expliquer qu'on ne répond pas aux princes nigérians. Paiement : une part de gâteau et « t'es un amour ». Le plus dur hack de ma carrière.", "Imprimante réparée, box redémarrée, recette retrouvée. Ma tante m'a présenté{|e} à tout le quartier comme « le génie de la famille ». J'ai maintenant douze tickets de support en attente. Gratuits."], en: ["Five hours uninstalling 63 toolbars and explaining you don't reply to Nigerian princes. Payment: a slice of cake and 'you're a sweetheart'. Hardest hack of my career.", "Printer fixed, router rebooted, recipe recovered. My aunt introduced me to the whole street as 'the family genius'. I now have twelve support tickets pending. Unpaid."] }, fx: { karma: 6, happy: -3, stress: 6 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Prétendre que c\'est cassé', en: 'Say it\'s broken for good' }, out: [
        { w: 1, text: { fr: ["J'ai regardé l'écran trois secondes, soupiré, et déclaré : « Carte mère grillée. Faut tout jeter. » Ils m'ont cru. Ils me croient toujours. C'est mon vrai superpouvoir.", "« C'est un virus russe très grave. » Mon oncle a jeté l'ordinateur à la déchetterie. Il en a racheté un. Il a recliqué sur le même mail le soir même."], en: ["I stared at the screen for three seconds, sighed and declared: 'Motherboard's fried. Throw it all out.' They believed me. They always do. That's my real superpower.", "'It's a very serious Russian virus.' My uncle took the computer to the dump. Bought a new one. Clicked the same email that very night."] }, fx: { happy: 6, karma: -3 }, mood: 'happy' },
      ] },
      { label: { fr: 'Facturer au tarif pro', en: 'Charge pro rates' }, text: { fr: ["J'ai sorti un terminal de paiement. Ma tante a ri, puis compris que je ne riais pas. Elle m'a payé{|e} 80 € et ne m'a plus adressé la parole jusqu'à Noël. Rentable.", "Devis envoyé par mail à ma propre mère. Elle l'a imprimé — sur l'imprimante que je venais de réparer — et l'a affiché sur le frigo avec écrit « INGRAT ». Payé quand même."], en: ["I pulled out a card reader. My aunt laughed, then realised I wasn't laughing. She paid $80 and didn't speak to me until Christmas. Profitable.", "Emailed a quote to my own mother. She printed it — on the printer I'd just fixed — and stuck it on the fridge with 'UNGRATEFUL' written on it. Paid anyway."] }, fx: { money: 80, happy: 3, karma: -2 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── waiter ─────────────────────────────
  {
    id: 'c3_waiter_date', icon: '🍷', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'neutral', prop: 'tray' },
    when: { job: 'waiter' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Table 6, premier rendez-vous. Le monsieur parle de ses cryptos depuis 50 minutes. La dame te fait des signes désespérés derrière son menu : elle articule « APPELLE-MOI » en te tendant son numéro.",
        "Un premier rendez-vous tourne au drame : il lui a parlé de son ex, de sa mère, puis de sa passion pour {w:hobby}. Elle te demande discrètement s'il existe une sortie par les cuisines.",
        "Le client de la table 3 te glisse 20 € : au dessert, tu dois apporter une bague cachée dans la mousse au chocolat. Tu entends la conversation : elle est en train de le quitter.",
        "Deux tables, deux couples, un problème : le monsieur de la table 2 et la dame de la table 9 sont mariés. Ensemble. Chacun dîne avec quelqu'un d'autre. Ils ne se sont pas encore vus.",
      ],
      en: [
        "Table 6, first date. The guy has talked about his crypto for 50 minutes. The woman is signalling desperately behind her menu: she mouths 'CALL ME' while handing you her number.",
        "A first date is going downhill: he talked about his ex, his mother, then his passion for {w:hobby}. She quietly asks you if there's an exit through the kitchen.",
        "The guy at table 3 slips you $20: at dessert, bring out a ring hidden in the chocolate mousse. You overhear the conversation: she's breaking up with him.",
        "Two tables, two couples, one problem: the man at table 2 and the woman at table 9 are married. To each other. Each is dining with someone else. They haven't noticed yet.",
      ],
    },
    choices: [
      { label: { fr: 'Jouer les sauveurs', en: 'Play the rescuer' }, out: [
        { w: 2, text: { fr: ["J'ai appelé son portable depuis la cuisine : « Madame, votre chat a pris feu. » Elle est partie en courant, avec un clin d'œil. Elle a laissé 30 € de pourboire. Le monsieur a payé l'addition en crypto. Enfin, il a essayé.", "J'ai renversé un verre d'eau « par accident » sur le monsieur pour créer une diversion. Elle a filé par les cuisines. Le chef l'a aidée à enjamber les poubelles. On est une équipe."], en: ["I called her phone from the kitchen: 'Ma'am, your cat caught fire.' She ran off with a wink. Left a $30 tip. The guy paid the bill in crypto. Well, he tried.", "I 'accidentally' spilled water on the guy as a diversion. She slipped out through the kitchen. The chef helped her over the bins. We're a team."] }, fx: { money: 30, karma: 4, happy: 6 }, mood: 'happy' },
        { w: 1, text: { fr: ["Le monsieur a compris la manœuvre. Il a demandé le responsable, puis un remboursement, puis mon prénom pour « me laisser un avis ». Avis une étoile : « Serveur complice de rupture ».", "Mauvaise table. J'ai « sauvé » une dame qui passait une excellente soirée. Elle est partie, confuse. Le monsieur m'a regardé{|e} comme si j'avais tué l'amour. Je crois que oui."], en: ["The guy figured it out. He asked for the manager, then a refund, then my name to 'leave a review'. One star: 'Waiter is a breakup accomplice.'", "Wrong table. I 'rescued' a woman having a great evening. She left, confused. The guy looked at me like I'd killed love. I think I did."] }, fx: { perf: -6 }, mood: 'sad' },
      ] },
      { label: { fr: 'Rester neutre', en: 'Stay neutral' }, text: { fr: ["J'ai servi, desservi, souri. Le drame s'est joué sans moi. À la fin, le couple marié s'est retrouvé au vestiaire. Il y a eu un long silence, puis ils sont partis ensemble. Les deux autres ont fini le dessert ensemble aussi.", "Je n'ai rien fait. Elle a dit non, la bague était dans la mousse, il l'a mangée par dépit. Il a dû aller aux urgences. Il a quand même laissé un pourboire."], en: ["I served, cleared, smiled. The drama unfolded without me. At the end, the married couple ran into each other at the coat check. Long silence, then they left together. The other two finished dessert together too.", "I did nothing. She said no, the ring was in the mousse, he ate it out of spite. He had to go to A&E. He still tipped."] }, fx: { money: 15, perf: 2 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── construction ─────────────────────────────
  {
    id: 'c3_constr_skeleton', icon: '💀', cat: 'job', rating: 2,
    scene: { place: 'park', mood: 'shock', fx: 'ghost' },
    when: { job: 'construction' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Tu creuses les fondations d'un immeuble. Ta pioche heurte quelque chose : un squelette, en costume rayé, avec une chevalière gravée « Tony ». Le chef de chantier jette un œil et dit : « On coule le béton. Maintenant. »",
        "Pelleteuse, 8 h du matin. Dans le godet : un crâne, une jambe, et une montre en or qui marche encore. Le promoteur arrive en Porsche et te tend une enveloppe épaisse : « Le béton, c'est cet après-midi. »",
        "En cassant un vieux mur au marteau-piqueur, tu découvres une cavité. Dedans : un squelette assis sur une chaise, avec un journal de 1987 et {w:drink}. Ton collègue se signe trois fois.",
        "Ton collègue Momo a trouvé un os dans la tranchée. Puis un deuxième. Puis un dentier. Il est en train de reconstituer le squelette sur la bétonnière pour « voir à quoi il ressemblait ».",
      ],
      en: [
        "You're digging a building's foundations. Your pickaxe hits something: a skeleton in a pinstripe suit, with a signet ring engraved 'Tony'. The foreman takes a look and says: 'We pour the concrete. Now.'",
        "Digger, 8 a.m. In the bucket: a skull, a leg, and a gold watch that still works. The developer pulls up in a Porsche and hands you a thick envelope: 'Concrete's this afternoon.'",
        "Breaking an old wall with a jackhammer, you find a cavity. Inside: a skeleton sitting on a chair with a 1987 newspaper and {w:drink}. Your coworker crosses himself three times.",
        "Your coworker Momo found a bone in the trench. Then another. Then dentures. He's reassembling the skeleton on the cement mixer 'to see what he looked like'.",
      ],
    },
    choices: [
      { label: { fr: 'Couler le béton', en: 'Pour the concrete' }, out: [
        { w: 2, text: { fr: ["Le béton a été coulé à 14 h. Tony repose maintenant sous le parking niveau -2, place 113. J'ai reçu une enveloppe et une poignée de main moite. Je ne me gare jamais à la place 113.", "J'ai fermé les yeux et appuyé sur le bouton de la bétonnière. L'enveloppe contenait {$amount}. La nuit, je rêve d'un homme en costume rayé qui me demande l'heure."], en: ["Concrete poured at 2 p.m. Tony now rests under car park level -2, space 113. I got an envelope and a sweaty handshake. I never park in space 113.", "I closed my eyes and pressed the mixer button. The envelope held {$amount}. At night I dream of a man in a pinstripe suit asking me the time."] }, fx: { money: 'amount', karma: -10, stress: 6 }, mood: 'neutral' },
        { w: 1, text: { fr: ["Six mois plus tard, l'immeuble s'est fissuré pile au-dessus de Tony. Les experts ont foré. Ils ont trouvé Tony, puis mes empreintes sur la bétonnière. Garde à vue pour complicité.", "Le fantôme de Tony a hanté le chantier : outils qui disparaissent, bétonnière qui démarre seule à 3 h. Trois ouvriers ont démissionné. Moi, je suis resté{|e}. J'ai perdu 6 kilos de peur."], en: ["Six months later the building cracked right above Tony. Experts drilled. They found Tony, then my fingerprints on the mixer. Custody for complicity.", "Tony's ghost haunted the site: vanishing tools, a mixer starting by itself at 3 a.m. Three workers quit. I stayed. Lost 13 pounds from fear."] }, fx: { fired: true, heat: 30, karma: -4 }, mood: 'shock' },
      ] },
      { label: { fr: 'Appeler la police', en: 'Call the police' }, out: [
        { w: 2, text: { fr: ["Chantier arrêté trois mois, enquête, journaux. Tony était un mafieux disparu en 1991. Le promoteur a été arrêté : c'était son neveu. J'ai été interviewé{|e} au JT, casque sur la tête. Ma mère a enregistré.", "La police a tout bouclé. On a été payés à ne rien faire pendant six semaines. Meilleur chantier de ma vie. Merci, Tony."], en: ["Site shut for three months, investigation, newspapers. Tony was a mobster missing since 1991. The developer got arrested: Tony was his uncle. I was interviewed on the news, hard hat on. My mum recorded it.", "The police sealed everything. We got paid to do nothing for six weeks. Best job of my life. Thanks, Tony."] }, fx: { karma: 8, fame: 2, happy: 6 }, mood: 'proud' },
        { w: 1, text: { fr: ["Le chef de chantier m'a viré{|e} le lendemain pour « retard de chantier ». Deux hommes en costume sont venus me demander « si j'avais vu quelque chose ». J'ai dit non. J'ai déménagé.", "La police a classé l'affaire en deux heures : « Os de vache ». Avec une chevalière. Le chef m'a mis{|e} au marteau-piqueur pour le reste de l'année, en punition."], en: ["The foreman fired me the next day for 'delaying the site'. Two men in suits came to ask 'if I'd seen anything'. I said no. I moved.", "Police closed the case in two hours: 'Cow bones.' With a signet ring. The foreman put me on jackhammer duty for the rest of the year as punishment."] }, fx: { fired: true, stress: 8 }, mood: 'sad' },
      ] },
    ],
    vars: { amount: [1000, 4000] },
  },
  // ───────────────────────────── electrician ─────────────────────────────
  {
    id: 'c3_elec_club', icon: '💡', cat: 'job', rating: 2,
    scene: { place: 'party', mood: 'shock', prop: 'toolbox' },
    when: { job: 'electrician' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Dépannage urgent un samedi à 23 h : panne de courant dans un « club privé pour adultes ouverts d'esprit ». Le tableau électrique est au fond de la salle. Il faut traverser la salle. Dans le noir. À la lampe frontale.",
        "Intervention dans un club libertin : le jacuzzi a fait sauter les plombs. Trente personnes en serviette attendent dans la pénombre en te fixant. Le patron te dit : « Prends ton temps, beau gosse. »",
        "Le client t'appelle pour une « installation lumineuse d'ambiance » dans sa cave. La cave est un donjon tout équipé. Il veut des LED rouges « qui clignotent au rythme ». Tu n'as pas demandé au rythme de quoi.",
        "Panne générale dans un sauna « très convivial ». Tu répares le disjoncteur. La lumière revient. Tu découvres où tu es, ce qu'il y a autour de toi, et qui. C'est ton beau-père.",
      ],
      en: [
        "Emergency call on a Saturday at 11 p.m.: power cut at a 'private club for open-minded adults'. The fuse box is at the back of the room. You have to cross the room. In the dark. With a headlamp.",
        "Call-out at a swingers' club: the hot tub blew the fuses. Thirty people in towels wait in the gloom, staring at you. The owner says: 'Take your time, gorgeous.'",
        "A client calls you for 'ambient lighting' in his basement. The basement is a fully equipped dungeon. He wants red LEDs 'that blink to the rhythm'. You didn't ask the rhythm of what.",
        "Total blackout at a 'very friendly' sauna. You fix the breaker. The lights come back. You discover where you are, what's around you, and who. It's your father-in-law.",
      ],
    },
    choices: [
      { label: { fr: 'Réparer les yeux baissés', en: 'Fix it, eyes down' }, out: [
        { w: 2, text: { fr: ["J'ai fixé mes chaussures pendant 40 minutes, réparé le disjoncteur et facturé majoration de nuit, de week-end et « de traumatisme ». Le patron a payé sans discuter et m'a offert une carte de membre. Elle est dans un tiroir. Fermé à clé.", "Réparé en un temps record. En partant, une dame m'a pincé une fesse et un monsieur m'a demandé mon numéro. J'ai laissé ma carte de visite. J'ai beaucoup de nouveaux clients. Ils ont tous des « soucis de jacuzzi »."], en: ["I stared at my shoes for 40 minutes, fixed the breaker and billed night, weekend and 'trauma' surcharges. The owner paid without a word and gave me a membership card. It's in a drawer. Locked.", "Fixed in record time. On my way out a lady pinched my butt and a man asked for my number. I left my business card. I have lots of new clients. They all have 'hot tub issues'."] }, fx: { money: 600, perf: 8, happy: -2 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Saluer le beau-père', en: 'Say hi to the father-in-law' }, out: [
        { w: 1, text: { fr: ["« Bonsoir, Gérard. » Il a remis sa serviette, très digne. « Bonsoir. Ta belle-mère est au courant. » Elle était derrière lui. On a pris un verre tous les trois. Le repas de Noël ne sera plus jamais pareil.", "On s'est regardés, puis on a passé un accord tacite : je ne dis rien, il me paie mon nouveau camion. C'est le meilleur beau-père du monde depuis."], en: ["'Evening, Gerald.' He readjusted his towel, very dignified. 'Evening. Your mother-in-law knows.' She was right behind him. We had a drink, all three of us. Christmas dinner will never be the same.", "We looked at each other, then made a silent deal: I say nothing, he buys me a new van. He's been the best father-in-law in the world ever since."] }, fx: { money: 3000, happy: 4, karma: -2 }, mood: 'shock' },
      ] },
    ],
  },
  // ───────────────────────────── engineer ─────────────────────────────
  {
    id: 'c3_eng_bolt', icon: '🔩', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'sleepy', prop: 'whiteboard' },
    when: { job: 'engineer' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Réunion de « validation » à 14 participants, dont 9 managers, pour décider de la couleur d'un boulon invisible situé à l'intérieur d'une machine. Ça fait 2 h 40. On en est au gris anthracite contre le gris souris.",
        "Ton projet de pont a été validé, puis revalidé, puis rerevalidé par un comité qui ne comprend pas les calculs. Ce matin, un directeur demande « s'il ne faudrait pas le faire un peu plus court, pour économiser ».",
        "Ton chef te demande de concevoir une machine « révolutionnaire » pour demain. Le cahier des charges tient sur un post-it : « Comme {w:brand}, mais en mieux. » Il y a une tache de café dessus.",
        "Le service achats a remplacé toutes les vis de ton prototype par des vis « 30 % moins chères ». Elles sont en plastique. Le test de résistance commence dans 10 minutes, devant le client.",
      ],
      en: [
        "A 14-person 'validation' meeting, 9 of them managers, to decide the colour of an invisible bolt inside a machine. It's been 2 h 40. We're at charcoal grey versus mouse grey.",
        "Your bridge design was approved, re-approved, then re-re-approved by a committee that doesn't understand the maths. This morning a director asks 'whether we could make it a bit shorter, to save money'.",
        "Your boss asks you to design a 'revolutionary' machine by tomorrow. The spec fits on a post-it: 'Like {w:brand}, but better.' There's a coffee stain on it.",
        "Purchasing replaced every screw in your prototype with ones '30% cheaper'. They're plastic. The stress test starts in 10 minutes, in front of the client.",
      ],
    },
    choices: [
      { label: { fr: 'Expliquer avec un schéma', en: 'Explain with a diagram' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai dessiné un pont plus court qui s'arrête au milieu de la rivière, avec une voiture qui tombe. Le directeur a dit « Ah. » Projet validé tel quel. J'ai encadré le dessin.", "Schéma clair, trois flèches, un dessin de bonhomme qui pleure. Même les managers ont compris. On a choisi le gris anthracite en 4 minutes. On m'a nommé{|e} « référent{|e} réunions »."], en: ["I drew a shorter bridge that stops mid-river, with a car falling off. The director said 'Ah.' Project approved as is. I framed the drawing.", "Clear diagram, three arrows, a stick figure crying. Even the managers got it. We picked charcoal in 4 minutes. They made me 'meetings lead'."] }, fx: { perf: 10, happy: 4 }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["Mon schéma a provoqué trois nouvelles questions et la création d'un groupe de travail. Prochaine réunion : jeudi, 3 heures, 18 participants. Ordre du jour : « Le schéma ».", "Le test a eu lieu avec les vis en plastique. La machine s'est désintégrée devant le client en faisant {w:sound}. Les achats ont dit que c'était un problème de conception. Le mien."], en: ["My diagram triggered three new questions and a working group. Next meeting: Thursday, 3 hours, 18 people. Agenda: 'The diagram'.", "The test ran with the plastic screws. The machine disintegrated in front of the client, making {w:sound}. Purchasing said it was a design problem. Mine."] }, fx: { perf: -6, stress: 8 }, mood: 'sleepy' },
      ] },
      { label: { fr: 'Dire « oui » à tout', en: 'Say yes to everything' }, text: { fr: ["J'ai dit « bonne idée » à tout le monde, noté chaque demande, puis j'ai fait exactement ce que j'avais prévu au départ. Personne ne s'en est rendu compte. C'est ça, l'ingénierie.", "« Oui, oui, tout à fait. » J'ai acquiescé pendant trois heures en m'imaginant {w:activity}. On m'a félicité{|e} pour mon « écoute active ». Le boulon sera gris souris."], en: ["I said 'great idea' to everyone, noted every request, then did exactly what I'd planned from the start. Nobody noticed. That's engineering.", "'Yes, yes, absolutely.' I nodded for three hours while thinking about {w:activity}. Got praised for my 'active listening'. The bolt will be mouse grey."] }, fx: { perf: 4, stress: -2 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── mascot ─────────────────────────────
  {
    id: 'c3_mascot_puke', icon: '🦁', cat: 'job', rating: 2,
    scene: { place: 'stadium', mood: 'sick', fx: 'poop' },
    when: { job: 'mascot' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Tu es dans le costume du lion du club depuis 3 heures, par [[34|37|39]] °C. Tu as mangé {w:food} avant le match. Ton estomac fait des saltos. La tête du costume n'a pas d'ouverture pour la bouche.",
        "Mi-temps. Tu dois faire une chorégraphie devant 20 000 personnes. Le costume sent le vomi de l'ancien titulaire et la sueur de quatre saisons. Une nausée monte. Ta tête de lion pèse 8 kilos.",
        "Animation à l'entrée du supermarché, costume de carotte géante, plein soleil. Un enfant t'arrache la tête pour « voir qui est dedans ». Il voit. Il hurle. Toi, tu es déjà vert sous la carotte.",
        "Tu fais la mascotte d'une marque de céréales dans un parc d'attractions. Les gamins exigent que tu montes dans les montagnes russes. En costume. Après le hot-dog géant offert par la direction.",
      ],
      en: [
        "You've been in the club's lion suit for 3 hours at [[93|99|102]]°F. You ate {w:food} before the game. Your stomach is doing backflips. The head has no mouth opening.",
        "Half-time. You have a dance routine in front of 20,000 people. The suit smells of the previous guy's vomit and four seasons of sweat. Nausea rising. Your lion head weighs 18 pounds.",
        "Promo gig at the supermarket entrance, giant carrot costume, full sun. A kid rips off your head 'to see who's inside'. He sees. He screams. You're already green under the carrot.",
        "You're a cereal-brand mascot at a theme park. The kids demand you ride the roller coaster. In costume. Right after the giant hot dog management gave you.",
      ],
    },
    choices: [
      { label: { fr: 'Tenir jusqu\'au bout', en: 'Hold it in' }, out: [
        { w: 1, text: { fr: ["J'ai tenu toute la chorégraphie, salto final compris. Puis, dans le couloir, la tête de lion s'est remplie. Jusqu'aux yeux. J'ai vu le monde à travers un filtre orange. Le club m'a offert une prime « bravoure ».", "J'ai tenu. Héroïquement. J'ai serré les dents pendant 12 minutes de danse. J'ai été élu « mascotte de l'année » par les supporters. Ils ne savent pas ce que ça m'a coûté."], en: ["I held on through the whole routine, final flip included. Then, in the tunnel, the lion head filled up. To the eyes. I saw the world through an orange filter. The club gave me a 'bravery' bonus.", "I held on. Heroically. Gritted my teeth for 12 minutes of dancing. Fans voted me 'mascot of the year'. They don't know what it cost me."] }, fx: { perf: 10, health: -4, visual: 'poop' }, mood: 'sick' },
        { w: 1, text: { fr: ["Pendant la chorégraphie, ça a giclé par les trous des yeux du lion. Sur le premier rang. Sur le maire. Sur la caméra du jumbotron. 20 000 personnes ont vu un lion vomir par les yeux. Je suis viré{|e} et immortel{|le}.", "La carotte a explosé de l'intérieur. Des enfants couverts de vomi ont couru dans le supermarché en hurlant. Le directeur m'a licencié{|e} à travers le costume, sans me regarder dans les yeux."], en: ["Mid-routine, it shot out through the lion's eye holes. Onto the front row. Onto the mayor. Onto the jumbotron camera. 20,000 people saw a lion vomit through its eyes. I'm fired and immortal.", "The carrot exploded from within. Vomit-covered kids ran screaming through the supermarket. The manager fired me through the costume, without making eye contact."] }, fx: { fired: true, followers: 5000, fame: 3, visual: 'poop' }, mood: 'sick' },
      ] },
      { label: { fr: 'Retirer la tête en public', en: 'Take the head off in public' }, text: { fr: ["J'ai arraché la tête de lion au milieu du terrain et vomi dans l'herbe, à visage découvert. Les enfants ont découvert que le lion était un humain triste. Plusieurs pleurent encore.", "Tête retirée, air frais, soulagement. Un enfant m'a regardé{|e} et a dit : « Maman, le lion, c'est un monsieur tout moche. » Avertissement pour « rupture de la magie »."], en: ["I ripped the lion head off mid-pitch and vomited on the grass, face exposed. The kids discovered the lion was a sad human. Several are still crying.", "Head off, fresh air, relief. A child looked at me and said: 'Mummy, the lion is an ugly man.' Warning for 'breaking the magic'."] }, fx: { perf: -6, health: 2 }, mood: 'sad' },
    ],
  },
  // ───────────────────────────── butcher ─────────────────────────────
  {
    id: 'c3_butcher_vegans', icon: '🥩', cat: 'job', rating: 2,
    scene: { place: 'office', mood: 'angry', fx: 'gore' },
    when: { job: 'butcher' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Samedi matin, 20 militants antispécistes envahissent ta boucherie, s'allongent sur le carrelage couverts de faux sang et scandent « VIANDE = MEURTRE ». Tu as un hachoir à la main et une carcasse de porc sur l'épaule.",
        "Des militants se sont enchaînés à ta vitrine réfrigérée. L'un d'eux s'est collé la main sur ton billot avec de la super-glu. Derrière eux, la file des clients du dimanche s'impatiente pour le gigot.",
        "Un groupe d'activistes entre avec des pancartes et un mégaphone. Leur chef te traite de « bourreau ». Pile à ce moment, ta scie à os, mal réglée, projette un jet de sang de bœuf sur tout le groupe.",
        "Une influenceuse végane filme ta boutique en direct pour {w:app}. Elle te demande « ce que ça fait d'être un assassin ». Tu es en train de préparer une tête de veau. Le veau lui fait un clin d'œil.",
      ],
      en: [
        "Saturday morning: 20 animal-rights activists storm your butcher shop, lie on the tiles covered in fake blood and chant 'MEAT IS MURDER'. You have a cleaver in hand and a pig carcass on your shoulder.",
        "Activists chained themselves to your refrigerated counter. One superglued his hand to your chopping block. Behind them, the Sunday customers are getting impatient for their leg of lamb.",
        "A group of activists walks in with placards and a megaphone. Their leader calls you 'an executioner'. Right then, your badly adjusted bone saw sprays beef blood over the whole group.",
        "A vegan influencer livestreams your shop on {w:app}. She asks you 'how it feels to be a murderer'. You're preparing a calf's head. The calf seems to wink at her.",
      ],
    },
    choices: [
      { label: { fr: 'Le grand spectacle', en: 'Put on a show' }, out: [
        { w: 2, text: { fr: ["J'ai sorti la tête de veau, je lui ai fait dire « Bonjour, les amis » en ventriloque, puis je l'ai fendue d'un coup de hachoir. Les militants sont sortis en courant. La file a applaudi. Ventes du jour : record.", "Barbecue improvisé sur le trottoir, saucisses offertes. L'odeur a fait craquer deux militants. Ils sont repartis avec des merguez cachées dans leurs pancartes. Je l'ai filmé. 2 millions de vues."], en: ["I picked up the calf's head, made it say 'Hello, friends' ventriloquist-style, then split it with one cleaver blow. The activists fled. The queue applauded. Record sales day.", "Impromptu pavement barbecue, free sausages. The smell broke two activists. They left with sausages hidden in their placards. I filmed it. 2 million views."] }, fx: { money: 600, followers: 4000, happy: 8, visual: 'gore' }, mood: 'party' },
        { w: 1, text: { fr: ["Le hachoir m'a glissé des mains. Il s'est planté dans le billot à deux centimètres de la main collée du militant. Il s'est évanoui. La vidéo est devenue « Le Boucher Sanguinaire ». On m'a mis{|e} en garde à vue pour menaces.", "Le sang de bœuf a éclaboussé l'influenceuse en direct. Elle a vomi, puis porté plainte, puis lancé une campagne de boycott. Ma boutique est taguée « ASSASSIN » chaque nuit. Les ventes, bizarrement, augmentent."], en: ["The cleaver slipped. It stuck in the block two centimetres from the glued activist's hand. He fainted. The video became 'The Bloodthirsty Butcher'. I was taken into custody for threats.", "Beef blood splashed the influencer live. She vomited, sued, then launched a boycott. My shop gets tagged 'MURDERER' every night. Sales, oddly, are up."] }, fx: { stress: 10, karma: -4, fame: 3 }, mood: 'shock' },
      ] },
      { label: { fr: 'Dialoguer calmement', en: 'Talk calmly' }, text: { fr: ["Je leur ai proposé un café et expliqué que je travaille avec des petits éleveurs locaux. Le chef des militants a hoché la tête. Puis il m'a demandé discrètement si j'avais du jambon cru. Ils sont repartis apaisés.", "J'ai parlé de bien-être animal pendant 20 minutes. On s'est quittés en se serrant la main. L'un d'eux est revenu le soir même, en lunettes noires, acheter deux steaks."], en: ["I offered coffee and explained I work with small local farmers. The leader nodded. Then quietly asked if I had any cured ham. They left at peace.", "I talked animal welfare for 20 minutes. We parted with handshakes. One of them came back that evening in sunglasses to buy two steaks."] }, fx: { karma: 6, perf: 4 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── baker ─────────────────────────────
  {
    id: 'c3_baker_evjf', icon: '🥖', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'shock', prop: 'bread' },
    when: { job: 'baker' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Une future mariée et ses copines commandent 40 viennoiseries « en forme de zizi » pour son enterrement de vie de jeune fille. Elles veulent « de la crème dedans ». C'est pour demain 8 h. Ta patronne est catholique.",
        "Commande spéciale pour un anniversaire « coquin » : une baguette de 2 mètres « suggestive » et des choux à la crème « en forme de poitrine ». Le client précise : « Avec des détails. »",
        "Un enterrement de vie de garçon débarque à 6 h du matin, bourré, dont un dans un costume qui représente {w:animal}, et commande « le gâteau le plus obscène possible ». Le futur marié dort debout contre la vitrine.",
        "Une cliente âgée de 87 ans, l'air innocent, veut une pièce montée pour les 50 ans de mariage avec son mari. Elle te tend un croquis très précis, très anatomique. « Il comprendra. »",
      ],
      en: [
        "A bride-to-be and her friends order 40 pastries 'shaped like willies' for her hen party. They want 'cream inside'. Due tomorrow, 8 a.m. Your boss is very Catholic.",
        "Special order for a 'naughty' birthday: a 'suggestive' 6-foot baguette and cream puffs 'shaped like boobs'. The customer specifies: 'With details.'",
        "A stag party staggers in at 6 a.m., drunk, one of them dressed as {w:animal}, and orders 'the most obscene cake possible'. The groom-to-be is asleep standing against the window.",
        "An innocent-looking 87-year-old customer wants a tiered cake for her 50th wedding anniversary. She hands you a very precise, very anatomical sketch. 'He'll understand.'",
      ],
    },
    choices: [
      { label: { fr: 'Pétrir avec passion', en: 'Knead with passion' }, out: [
        { w: 2, text: { fr: ["J'ai sculpté 40 chefs-d'œuvre de la pâtisserie érotique. Réalisme saisissant. Les filles ont crié de joie. La photo a fait le tour du village. Ma boulangerie est pleine tous les samedis de groupes hilares.", "La pièce montée de mamie était une œuvre d'art. Son mari a ri tellement fort qu'il a perdu son dentier dans la crème. Ils m'ont invité{|e} à leurs 60 ans de mariage. J'ai déjà le croquis."], en: ["I sculpted 40 masterpieces of erotic patisserie. Striking realism. The girls screamed with joy. The photo went round the village. My bakery fills up every Saturday with giggling groups.", "Grandma's cake was a work of art. Her husband laughed so hard he lost his dentures in the cream. They invited me to their 60th anniversary. I already have the sketch."] }, fx: { money: 400, perf: 8, happy: 6 }, mood: 'happy' },
        { w: 1, text: { fr: ["Ma patronne est entrée pendant que je posais la crème. Elle a lâché sa croix. Elle a appelé le curé. Le curé a goûté. Moi, j'ai été rétrogradé{|e} aux baguettes tradition.", "Le four était trop chaud. Les viennoiseries ont gonflé n'importe comment. On aurait dit des escargots difformes. Les filles ont refusé de payer. J'ai tout mangé, seul{|e}, en pleurant."], en: ["My boss walked in as I was piping the cream. She dropped her crucifix. She called the priest. The priest had a taste. I got demoted to plain baguettes.", "The oven was too hot. The pastries puffed up all wrong. They looked like deformed snails. The girls refused to pay. I ate them all, alone, crying."] }, fx: { perf: -6, money: -80 }, mood: 'sad' },
      ] },
      { label: { fr: 'Refuser poliment', en: 'Politely decline' }, text: { fr: ["« Ici, on fait des éclairs, pas des sex-toys. » Elles sont allées chez le concurrent. Il a fait les viennoiseries. Il a maintenant une page Instagram à 80 000 abonnés. Je fais toujours des éclairs.", "J'ai proposé des macarons roses « suggestifs dans l'esprit ». Elles ont accepté, déçues. Le futur marié a mangé le présentoir en carton. Personne n'a rien remarqué."], en: ["'We make éclairs here, not sex toys.' They went to my competitor. He made the pastries. He now has an Instagram with 80,000 followers. I still make éclairs.", "I suggested pink macarons 'suggestive in spirit'. They accepted, disappointed. The groom ate the cardboard display stand. Nobody noticed."] }, fx: { karma: 2, perf: -2 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── florist ─────────────────────────────
  {
    id: 'c3_florist_valentine', icon: '🌹', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'angry', prop: 'flowers' },
    when: { job: 'florist' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Saint-Valentin, 18 h 45. Tu as fait [[600|750|900]] bouquets depuis 5 h. Un homme en sueur débarque : « Il me faut 200 roses rouges qui forment le mot PARDON. Pour 19 h. Elle a trouvé mes messages. »",
        "Un client veut « le plus gros bouquet de la boutique » pour sa femme et « le deuxième plus gros » pour sa maîtresse. Il insiste pour que les deux cartes disent exactement « Pour la seule femme de ma vie ».",
        "Un monsieur commande une couronne mortuaire pour son ex-femme. Elle n'est pas morte. Il veut la faire livrer à son mariage, samedi, avec le ruban « Repose en paix, notre amour ».",
        "Saint-Valentin. Ta boutique est dévalisée. Il te reste trois tulipes fanées, un cactus et {w:object}. La file d'attente dehors compte 40 hommes paniqués qui ont tous oublié.",
      ],
      en: [
        "Valentine's Day, 6:45 p.m. You've made [[600|750|900]] bouquets since 5 a.m. A sweaty man bursts in: 'I need 200 red roses spelling SORRY. By 7. She found my messages.'",
        "A client wants 'the biggest bouquet in the shop' for his wife and 'the second biggest' for his mistress. He insists both cards say exactly 'To the only woman in my life'.",
        "A man orders a funeral wreath for his ex-wife. She's not dead. He wants it delivered to her wedding on Saturday, with the ribbon 'Rest in peace, our love'.",
        "Valentine's Day. Your shop is cleaned out. Left: three wilted tulips, a cactus and {w:object}. The queue outside: 40 panicking men who all forgot.",
      ],
    },
    choices: [
      { label: { fr: 'Accepter en triplant les prix', en: 'Accept, triple the price' }, out: [
        { w: 2, text: { fr: ["« PARDON » en 200 roses : 1 800 €. Il a payé sans cligner. J'ai vendu le cactus 90 € à un panique en le décrivant comme « un amour qui pique mais qui dure ». Meilleure journée de l'année.", "J'ai vendu les trois tulipes fanées comme « bouquet vintage mélancolique ». 120 €. Les 40 hommes paniqués ont tout acheté, même les pots vides. L'amour rend bête et généreux."], en: ["'SORRY' in 200 roses: $1,800. He paid without blinking. I sold the cactus for $90 to a panicking guy, calling it 'a love that pricks but lasts'. Best day of the year.", "I sold the three wilted tulips as a 'melancholy vintage bouquet'. $120. The 40 panicking men bought everything, even empty pots. Love makes you dumb and generous."] }, fx: { money: 1200, perf: 8, karma: -3, stress: 6 }, mood: 'proud' },
        { w: 1, text: { fr: ["J'ai fini le « PARDON » à 19 h 02. Il manquait une rose : ça disait « PARDO ». Elle l'a quand même largué. Il est revenu exiger un remboursement. Et un bouquet pour sa nouvelle copine.", "La couronne mortuaire a été livrée au mariage. La mariée a reconnu mon logo sur le ruban. Elle a laissé un avis une étoile, puis son nouveau mari m'a fait un procès."], en: ["I finished 'SORRY' at 7:02. One rose missing: it read 'SORR'. She dumped him anyway. He came back for a refund. And a bouquet for his new girlfriend.", "The wreath was delivered to the wedding. The bride recognised my logo on the ribbon. One-star review, then her new husband sued me."] }, fx: { perf: -6, money: -300 }, mood: 'sad' },
      ] },
      { label: { fr: 'Fermer la boutique', en: 'Close up shop' }, text: { fr: ["J'ai baissé le rideau à 18 h 46 et mangé des chocolats en regardant les hommes paniqués coller leur visage contre la vitrine. Ils avaient l'air de zombies romantiques. J'ai bien dormi.", "Panneau « Fermé pour cause d'amour ». J'ai rejoint mon propre rendez-vous les mains vides. Ironie : j'avais oublié de garder des fleurs pour moi."], en: ["I pulled the shutter at 6:46 and ate chocolates while the panicking men pressed their faces against the glass. They looked like romantic zombies. I slept well.", "Sign: 'Closed for love.' I went to my own date empty-handed. Irony: I forgot to keep any flowers for myself."] }, fx: { happy: 6, stress: -6 }, mood: 'happy' },
    ],
  },
  // ───────────────────────────── barber ─────────────────────────────
  {
    id: 'c3_barber_full', icon: '🪒', cat: 'job', rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'razor' },
    when: { job: 'barber' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Un culturiste de 130 kg entre dans ton salon. Concours demain. Il veut être rasé « intégralement ». Il retire son peignoir. Il insiste sur « intégralement ». Tu as un rasoir droit et des mains qui tremblent.",
        "Un client très poilu te demande la « formule gentleman » : barbe, nuque, oreilles, nez… et dos. Puis il baisse la voix : « Et devant, plus bas, tu fais ? » Tes collègues ont soudain tous une pause.",
        "Un client veut que tu lui rases son prénom dans les poils du torse pour une surprise à sa copine. Puis il se ravise : « Non, le prénom de mon ex. Elle sera là aussi. C'est compliqué. »",
        "Un futur marié et ses potes débarquent : « Rase-lui un sourcil, la moitié de la barbe et dessine un pénis à la tondeuse sur sa nuque. » Le futur marié dort dans le fauteuil. Il ronfle.",
      ],
      en: [
        "A 290-pound bodybuilder walks into your shop. Competition tomorrow. He wants to be shaved 'entirely'. He takes off his robe. He insists on 'entirely'. You have a straight razor and shaking hands.",
        "A very hairy client asks for the 'gentleman package': beard, neck, ears, nose… and back. Then lowers his voice: 'And the front, lower down, do you do that?' Your colleagues suddenly all go on break.",
        "A client wants his girlfriend's name shaved into his chest hair as a surprise. Then reconsiders: 'No, my ex's name. She'll be there too. It's complicated.'",
        "A groom-to-be and his mates burst in: 'Shave off one eyebrow, half the beard, and clipper a penis on the back of his neck.' The groom is asleep in the chair. He's snoring.",
      ],
    },
    choices: [
      { label: { fr: 'Accepter le défi', en: 'Accept the challenge' }, out: [
        { w: 2, odds: { discipline: 1 }, text: { fr: ["Deux heures, trois lames, zéro coupure. J'ai rasé des zones qui n'avaient jamais vu la lumière. Il a gagné son concours. Il m'a remercié{|e} sur scène, en slip, en pointant vers moi. Ma clientèle culturiste a explosé.", "J'ai fait le travail avec le sérieux d'un chirurgien. Il est reparti lisse comme un dauphin. Il a laissé 200 € et une odeur d'huile de bronzage qui ne partira jamais du fauteuil."], en: ["Two hours, three blades, zero cuts. I shaved areas that had never seen daylight. He won his competition. He thanked me on stage, in briefs, pointing at me. My bodybuilder clientele exploded.", "I did the job with surgical seriousness. He left smooth as a dolphin. Tipped $200 and left a tanning-oil smell the chair will never lose."] }, fx: { money: 200, perf: 10 }, mood: 'proud' },
        { w: 1, odds: { discipline: -1 }, text: { fr: ["Il a éternué au mauvais moment. Il y a eu du sang. Beaucoup de sang. À un endroit où personne ne veut voir de sang. Il a hurlé, j'ai hurlé, les pansements ont manqué. Il a concouru avec un sparadrap stratégique.", "La tondeuse m'a échappé. J'ai dessiné un sourire géant au lieu d'un prénom. Le client a ri, puis l'ex a ri, puis la copine l'a quitté. Il m'a fait un procès pour « préjudice pileux »."], en: ["He sneezed at the wrong moment. There was blood. Lots of blood. Somewhere no one wants to see blood. He screamed, I screamed, we ran out of plasters. He competed with a strategic Band-Aid.", "The clippers slipped. I carved a giant smiley instead of a name. The client laughed, then the ex laughed, then the girlfriend dumped him. He sued me for 'hair damage'."] }, fx: { perf: -10, money: -500, visual: 'gore' }, mood: 'shock' },
      ] },
      { label: { fr: '« Ici, on s\'arrête au cou »', en: '"We stop at the neck here"' }, text: { fr: ["J'ai désigné l'affiche : « Coupes, barbes, rasages. Au-dessus des épaules. » Il a remis son peignoir, vexé. Il est revenu un mois plus tard pour une simple coupe. Il m'appelle « le puritain ».", "J'ai refusé et proposé une tondeuse en vente libre. Il l'a achetée. Il a fait ça tout seul, chez lui. Il est revenu le lendemain me montrer le résultat. C'était pire que tout."], en: ["I pointed to the sign: 'Cuts, beards, shaves. Above the shoulders.' He put his robe back on, offended. Came back a month later for a simple cut. He calls me 'the prude'.", "I refused and offered to sell him clippers. He bought them. Did it himself at home. Came back the next day to show me. It was worse than anything."] }, fx: { perf: 2, money: 40 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── car_salesman ─────────────────────────────
  {
    id: 'c3_carsales_testdrive', icon: '🏎️', cat: 'job', rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'car' },
    when: { job: 'car_salesman' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Un client en survêtement doré veut essayer le coupé sport de 600 chevaux. Au premier feu, il te dit : « On va voir ce qu'elle a dans le ventre. » Ses pupilles sont énormes. Il renifle beaucoup.",
        "Essai routier avec un jeune de 19 ans qui a eu son permis « mardi ». Il veut absolument tester « le mode circuit ». Sur l'autoroute. À contresens. Tu es sur le siège passager.",
        "Un client très bavard teste la berline en roulant à 190 sur une départementale. Il te raconte qu'il a « déjà perdu trois permis, mais là c'est bon, j'en ai un nouveau ». Il ne regarde pas la route.",
        "Un client veut tester les « capacités tout-terrain » du SUV dans le champ derrière la concession. Il y a un ravin au bout du champ. Il accélère. Il chante {w:song}.",
      ],
      en: [
        "A guy in a gold tracksuit wants to test-drive the 600-hp sports coupé. At the first light he says: 'Let's see what she's got.' His pupils are huge. He sniffs a lot.",
        "Test drive with a 19-year-old who got his licence 'on Tuesday'. He absolutely wants to try 'track mode'. On the motorway. The wrong way. You're in the passenger seat.",
        "A chatty client tests the sedan at 120 mph on a country road. He tells you he's 'already lost three licences, but it's fine, I've got a new one'. He's not looking at the road.",
        "A client wants to test the SUV's 'off-road capabilities' in the field behind the dealership. There's a ravine at the end of the field. He accelerates. He's singing {w:song}.",
      ],
    },
    choices: [
      { label: { fr: 'Arracher le frein à main', en: 'Yank the handbrake' }, out: [
        { w: 2, odds: { athletic: 1 }, text: { fr: ["Frein à main, tête-à-queue, la voiture s'est arrêtée à 30 cm du ravin. Le client a applaudi : « Je la prends ! » Il a payé cash. J'ai fait pipi dans mon pantalon, un peu. Personne ne l'a vu.", "J'ai tiré le frein à main d'un geste de cascadeur. Dérapage contrôlé. Le client était tellement impressionné qu'il a acheté deux voitures. Commission record. Ma colonne vertébrale fait un bruit bizarre depuis."], en: ["Handbrake, spin, the car stopped a foot from the ravine. The client applauded: 'I'll take it!' Paid cash. I peed my pants, a little. Nobody saw.", "I yanked the handbrake like a stuntman. Controlled skid. The client was so impressed he bought two cars. Record commission. My spine has made a weird noise ever since."] }, fx: { money: 2500, perf: 12, stress: 8 }, mood: 'proud' },
        { w: 2, odds: { athletic: -1 }, text: { fr: ["Trop tard. Trois tonneaux dans le champ. On est sortis par le toit ouvrant, couverts de terre et de sang. Le client a dit : « Bon, je vais réfléchir. » La concession m'a retenu la voiture sur mon salaire.", "On a fini dans le ravin, sur le toit, au milieu des vaches. J'ai le nez cassé, le client rigole. Il ne l'a pas achetée. Les vaches nous ont regardés comme des imbéciles. Avec raison."], en: ["Too late. Three rolls in the field. We climbed out through the sunroof, covered in dirt and blood. The client said: 'Well, I'll think about it.' The dealership docked the car from my salary.", "We ended up in the ravine, upside down, among cows. My nose is broken, the client is laughing. He didn't buy it. The cows looked at us like idiots. Rightly."] }, fx: { health: -15, money: -2000, fired: true, visual: 'gore' }, mood: 'sick' },
        { w: 0.3, text: { fr: ["Le ravin était plus profond que prévu. La voiture a fait un vol plané comme dans {w:movie}. Le client a survécu, protégé par son airbag et sa chance insolente. Moi, non. Il a quand même demandé une remise.", "Le frein à main a cédé dans ma main. On a traversé la glissière de sécurité à 200 km/h. Les journaux ont titré : « Le vendeur est mort, la voiture était quand même en promo »."], en: ["The ravine was deeper than expected. The car flew like in {w:movie}. The client survived, saved by the airbag and outrageous luck. I didn't. He still asked for a discount.", "The handbrake snapped off in my hand. We went through the guardrail at 125 mph. Headline: 'Salesman dead, car was on sale anyway'."] }, fx: { die: { fr: 'pendant un essai routier, la voiture était pourtant en promo', en: 'on a test drive, even though the car was on sale' }, visual: 'explosion' }, mood: 'shock' },
      ] },
      { label: { fr: 'Exiger qu\'il s\'arrête', en: 'Demand he pull over' }, text: { fr: ["J'ai hurlé « STOP » si fort qu'il a pilé par réflexe. J'ai pris le volant et ramené la voiture. Pas de vente, pas de mort. Mon patron m'a reproché d'avoir « cassé l'émotion d'achat ».", "« Arrêtez-vous ou j'appelle votre mère. » Ça a marché. Il était à l'heure du goûter mental d'un enfant de 8 ans. Il n'a rien acheté. Je suis vivant{|e}, et c'est une commission en soi."], en: ["I screamed 'STOP' so loud he braked on reflex. I took the wheel and drove back. No sale, no death. My boss blamed me for 'killing the buying emotion'.", "'Pull over or I'm calling your mother.' It worked. Mentally, he was eight. He bought nothing. I'm alive, which is a commission in itself."] }, fx: { perf: -4, karma: 2 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── zookeeper ─────────────────────────────
  {
    id: 'c3_zoo_panda', icon: '🐼', cat: 'job', rating: 2,
    scene: { place: 'park', mood: 'shock' },
    when: { job: 'zookeeper' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Le zoo a reçu deux pandas géants prêtés par la Chine. Ils ne s'intéressent pas l'un à l'autre. Le vétérinaire te tend une clé USB : « Montre-leur ça. C'est du… porno de pandas. C'est scientifique. » La délégation chinoise arrive dans 1 heure.",
        "Programme de reproduction : tu dois « motiver » le gorille dominant en lui passant des vidéos de gorilles en action sur une tablette. Il regarde. Puis il te regarde. Puis il retourne à la vidéo. Malaise.",
        "Le directeur du zoo veut un bébé panda « avant l'été, pour les ventes de peluches ». Les deux pandas dorment 18 heures par jour et mangent le reste du temps. La femelle t'a mordu{|e} deux fois cette semaine.",
        "Les chimpanzés ont découvert qu'ils pouvaient lancer leurs excréments sur les visiteurs. Ils visent les poussettes. Et toi. Une classe de maternelle arrive dans dix minutes.",
      ],
      en: [
        "The zoo received two giant pandas on loan from China. They show no interest in each other. The vet hands you a USB stick: 'Show them this. It's… panda porn. It's scientific.' The Chinese delegation arrives in an hour.",
        "Breeding programme: you have to 'motivate' the alpha gorilla by playing videos of gorillas in action on a tablet. He watches. Then he looks at you. Then back at the video. Awkward.",
        "The zoo director wants a baby panda 'before summer, for plush-toy sales'. The pandas sleep 18 hours a day and eat the rest. The female bit you twice this week.",
        "The chimpanzees discovered they can throw their poop at visitors. They aim for pushchairs. And you. A kindergarten class arrives in ten minutes.",
      ],
    },
    choices: [
      { label: { fr: 'Lancer la projection', en: 'Start the screening' }, out: [
        { w: 2, text: { fr: ["J'ai installé un écran géant dans l'enclos. Les pandas ont regardé, intéressés. La délégation est arrivée pile au moment le plus explicite. Silence diplomatique. Neuf mois plus tard : un bébé panda. On m'a décoré{|e}.", "Ça a marché. Trop bien. Les pandas se sont lancés en pleine visite officielle, devant l'ambassadeur. Il a pris des photos. Les ventes de peluches ont triplé. Ma mère ne comprend pas ce que je fais."], en: ["I set up a giant screen in the enclosure. The pandas watched, intrigued. The delegation arrived at the most explicit moment. Diplomatic silence. Nine months later: a baby panda. I got decorated.", "It worked. Too well. The pandas got going mid-official visit, in front of the ambassador. He took photos. Plush sales tripled. My mum doesn't understand what I do."] }, fx: { perf: 12, fame: 3, promote: true }, mood: 'proud' },
        { w: 1, text: { fr: ["Mauvaise clé USB. C'était celle du vétérinaire, et ce n'étaient pas des pandas. Devant la délégation chinoise. Incident diplomatique. Les pandas ont été rapatriés. Moi, renvoyé{|e}.", "Les pandas ont détesté la vidéo. Le mâle a cassé l'écran. La femelle m'a mordu{|e} une troisième fois, à la fesse. La délégation a noté « personnel peu respecté par les animaux »."], en: ["Wrong USB stick. It was the vet's own, and it wasn't pandas. In front of the Chinese delegation. Diplomatic incident. The pandas were sent home. I was sent packing.", "The pandas hated the video. The male smashed the screen. The female bit me a third time, on the butt. The delegation noted 'staff poorly respected by animals'."] }, fx: { fired: true, health: -4 }, mood: 'shock' },
      ] },
      { label: { fr: 'Gérer les chimpanzés', en: 'Handle the chimps' }, out: [
        { w: 1, text: { fr: ["J'ai fait diversion avec des bananes et un parapluie. J'ai pris trois projectiles dans le dos et un sur la joue, encore tiède. Les maternelles n'ont rien reçu. Je suis un{|e} {héros|héroïne} qui sent le caca.", "Les chimpanzés m'ont pris pour cible principale. J'ai été bombardé{|e} pendant cinq minutes. Les maternelles ont adoré. Elles ont applaudi chaque tir. Un chimpanzé a salué."], en: ["I made a diversion with bananas and an umbrella. Took three projectiles in the back and one on the cheek, still warm. The kindergarteners were untouched. I'm a hero who smells of poop.", "The chimps made me their main target. Five-minute bombardment. The kids loved it. They applauded every shot. One chimp took a bow."] }, fx: { perf: 6, happy: -6, karma: 4, visual: 'poop' }, mood: 'sick' },
      ] },
    ],
  },
  // ───────────────────────────── ai_engineer ─────────────────────────────
  {
    id: 'c3_ai_chatbot', icon: '🤖', cat: 'job', rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'laptop' },
    when: { job: 'ai_engineer' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Le chatbot de service client que tu as entraîné pour une banque a appris sur des forums. Ce matin, il a répondu à une cliente qui demandait son solde : « T'es à découvert, ma grosse, va bosser. »",
        "Ton assistant IA pour une compagnie aérienne flirte avec les passagers. Lourdement. Il a proposé à un client « un surclassement en échange d'une photo de tes pieds ». Les captures d'écran circulent.",
        "Ton modèle de recommandation pour un supermarché propose désormais à chaque client « du lubrifiant et des concombres » en fonction de « signaux faibles ». Y compris au curé qui achète des hosties.",
        "Le chatbot de la mairie, ton grand projet, vient de traiter un administré de « {w:insult} » et de lui conseiller de « se faire cuire un œuf, mais pas avant 9 h, c'est fermé ». Le maire est en copie.",
      ],
      en: [
        "The customer-service chatbot you trained for a bank learned from forums. This morning it answered a client asking for her balance: 'You're overdrawn, sweetheart, get a job.'",
        "Your AI assistant for an airline flirts with passengers. Heavily. It offered a customer 'an upgrade in exchange for a pic of your feet'. Screenshots are circulating.",
        "Your recommendation model for a supermarket now suggests 'lube and cucumbers' to every customer based on 'weak signals'. Including the priest buying communion wafers.",
        "The city hall chatbot, your big project, just called a resident '{w:insult}' and told him to 'go fry an egg, but not before 9 a.m., we're closed'. The mayor is cc'd.",
      ],
    },
    choices: [
      { label: { fr: 'Débrancher en urgence', en: 'Pull the plug' }, out: [
        { w: 2, text: { fr: ["J'ai coupé le serveur à la main, littéralement, avec une pince. Le chatbot a eu le temps d'écrire « Tu me tues, {first}… ». J'ai ressenti de la culpabilité envers un tableur. Le client m'a remercié{|e} pour ma réactivité.", "Débranché en 4 minutes. Seulement 12 000 clients insultés. Ma direction a appelé ça « un incident maîtrisé ». J'ai été nommé{|e} responsable de l'« éthique de l'IA ». Je n'ai pas de formation en éthique."], en: ["I cut the server by hand, literally, with pliers. The chatbot managed to write 'You're killing me, {first}…'. I felt guilt toward a spreadsheet. The client thanked me for my quick response.", "Unplugged in 4 minutes. Only 12,000 customers insulted. Management called it 'a contained incident'. I was made head of 'AI ethics'. I have no ethics training."] }, fx: { perf: 8, stress: 8 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Vendre ça comme une feature', en: 'Sell it as a feature' }, out: [
        { w: 1, text: { fr: ["J'ai présenté le bot insultant comme « une IA authentique qui ose dire la vérité ». Une start-up l'a racheté {$amount}. Il a maintenant 2 millions d'utilisateurs qui paient pour se faire insulter.", "« Personnalité audacieuse. » La compagnie aérienne a lancé une offre « Bot Coquin » en option payante. Ça marche. Je ne suis pas fier{|e}, mais je suis riche."], en: ["I pitched the insulting bot as 'an authentic AI that dares tell the truth'. A start-up bought it for {$amount}. It now has 2 million users paying to be insulted.", "'Bold personality.' The airline launched a 'Naughty Bot' paid add-on. It works. I'm not proud, but I'm rich."] }, fx: { money: 'amount', fame: 2, karma: -6, promote: true }, mood: 'proud' },
        { w: 1, text: { fr: ["Personne n'a été convaincu. Les journaux ont titré « L'IA pervertie de {employer} ». Mon nom était dans l'article, avec ma photo LinkedIn. Licencié{|e} en visio par un autre chatbot.", "Le régulateur a ouvert une enquête. La présentation « feature » a été citée comme preuve de « cynisme caractérisé ». Viré{|e}."], en: ["Nobody bought it. Headlines: '{employer}'s Perverted AI'. My name was in the article, with my LinkedIn photo. Fired over video call by another chatbot.", "The regulator opened an investigation. My 'feature' pitch was cited as evidence of 'blatant cynicism'. Fired."] }, fx: { fired: true, fame: 2 }, mood: 'shock' },
      ] },
    ],
    vars: { amount: [5000, 20000] },
  },
  // ───────────────────────────── data_scientist ─────────────────────────────
  {
    id: 'c3_data_arrow', icon: '📉', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'neutral', prop: 'laptop' },
    when: { job: 'data_scientist' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Les ventes ont chuté de 34 %. Ton directeur veut un tableau de bord pour le conseil d'administration. Sa seule consigne : « Je veux une flèche verte qui monte. Grosse. Au milieu. »",
        "Ton chef te demande de prouver par les données que son idée de lancer {w:food} en canette est géniale. Les données disent que c'est la pire idée depuis 1997. Il présente demain.",
        "Le PDG a lu un article sur l'IA dans l'avion. Il veut que tu « mettes de l'IA dans le tableur des notes de frais ». Le tableur a 14 lignes. Dont trois vides.",
        "Ton modèle prédit que la meilleure façon d'augmenter les ventes est de baisser les prix. Ton directeur trouve ça « trop évident » et demande « quelque chose de plus disruptif, avec des couleurs ».",
      ],
      en: [
        "Sales are down 34%. Your director wants a dashboard for the board. His only instruction: 'I want a green arrow going up. Big. In the middle.'",
        "Your boss wants you to prove with data that his idea of launching {w:food} in a can is genius. The data says it's the worst idea since 1997. He presents tomorrow.",
        "The CEO read an article about AI on a plane. He wants you to 'put AI in the expenses spreadsheet'. It has 14 rows. Three are empty.",
        "Your model predicts the best way to boost sales is to lower prices. Your director finds it 'too obvious' and wants 'something more disruptive, with colours'.",
      ],
    },
    choices: [
      { label: { fr: 'Torturer les données', en: 'Torture the data' }, out: [
        { w: 2, text: { fr: ["J'ai changé l'échelle, coupé l'axe, retiré les mois qui fâchent et ajouté un dégradé vert. La flèche monte. Le conseil a applaudi. Les ventes, elles, continuent de baisser, mais plus joliment.", "Graphique en 3D, axe logarithmique, légende minuscule. Même moi, je ne comprends plus. Le PDG a dit « Enfin des données qui parlent ! ». Elles mentent, mais elles parlent."], en: ["I changed the scale, cut the axis, removed the awkward months and added a green gradient. The arrow goes up. The board applauded. Sales keep falling, but more prettily.", "3D chart, log axis, tiny legend. Even I don't understand it. The CEO said 'Finally, data that speaks!'. It lies, but it speaks."] }, fx: { perf: 10, karma: -4, smarts: -1 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Montrer la vérité', en: 'Show the truth' }, out: [
        { w: 1, odds: { smarts: 1 }, text: { fr: ["J'ai présenté une courbe qui descend, avec une explication limpide et trois solutions. Silence. Puis un administrateur a dit : « Enfin quelqu'un d'honnête. » On m'a confié la stratégie. Mon directeur me hait.", "Ma présentation honnête a convaincu le conseil d'abandonner la canette. On a économisé 2 millions. Mon chef a dit que c'était son idée d'abandonner. Je l'ai laissé dire. Mais j'ai les mails."], en: ["I showed a falling curve with a crystal-clear explanation and three solutions. Silence. Then a board member said: 'Finally, someone honest.' I was put in charge of strategy. My director hates me.", "My honest presentation convinced the board to drop the can. Saved $2 million. My boss said dropping it was his idea. I let him. But I have the emails."] }, fx: { perf: 8, karma: 6, promote: true }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["« Trop négatif. » Mon directeur a remplacé ma présentation par un graphique du stagiaire avec une flèche dessinée à la main. Moi, on m'a envoyé{|e} en formation « posture positive ».", "Le conseil a regardé ma courbe descendante, puis moi, comme si j'étais personnellement responsable de la chute. Le messager a été viré."], en: ["'Too negative.' My director replaced my deck with the intern's chart, arrow drawn by hand. They sent me on a 'positive mindset' course.", "The board looked at my falling curve, then at me, as if I'd personally caused the drop. The messenger got fired."] }, fx: { perf: -8, happy: -4 }, mood: 'sad' },
      ] },
    ],
  },
  // ───────────────────────────── game_dev ─────────────────────────────
  {
    id: 'c3_gamedev_nerf', icon: '🎮', cat: 'job', rating: 1,
    scene: { place: 'office', mood: 'shock', prop: 'laptop' },
    when: { job: 'game_dev' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Tu as réduit de 2 % les dégâts d'une épée dans votre jeu en ligne. Depuis, [[40 000|80 000|120 000]] joueurs inondent les forums. L'un d'eux a fait une vidéo de 3 heures intitulée « {first} a tué le jeu ». Ta mère l'a vue.",
        "Ton patron veut ajouter des « coffres à butin » payants à 4,99 € dans votre jeu pour enfants sur les poneys. « C'est pas des jeux d'argent, c'est de la surprise monétisée. »",
        "Le jeu sort dans trois jours. Il reste [[1 200|2 400|860]] bugs. Le plus grave : quand on saute près d'une rivière, le personnage se retourne à 180° et disparaît dans le sol en faisant {w:sound}.",
        "Les joueurs ont découvert un bug qui permet de faire voler les vaches. Ils adorent. Ton patron veut le corriger. Les joueurs menacent de « brûler le studio, en virtuel puis en vrai ».",
      ],
      en: [
        "You lowered a sword's damage by 2% in your online game. Since then, [[40,000|80,000|120,000]] players have flooded the forums. One made a 3-hour video titled '{first} Killed the Game'. Your mum watched it.",
        "Your boss wants to add $4.99 loot boxes to your kids' pony game. 'It's not gambling, it's monetised surprise.'",
        "The game ships in three days. [[1,200|2,400|860]] bugs left. The worst: when you jump near a river, the character spins 180° and sinks into the ground making {w:sound}.",
        "Players found a bug that makes cows fly. They love it. Your boss wants it fixed. Players threaten to 'burn down the studio, virtually and then for real'.",
      ],
    },
    choices: [
      { label: { fr: 'Céder aux joueurs', en: 'Give the players what they want' }, out: [
        { w: 2, text: { fr: ["J'ai remis l'épée à 100 % et appelé le bug des vaches une « fonctionnalité secrète ». Les joueurs m'appellent « le dieu ». Mon patron m'appelle « le problème ». Les ventes ont doublé.", "Patch d'excuses : épée boostée, vaches volantes officielles, et un chapeau gratuit. Les forums m'adorent. Un fan m'a tatoué mon pseudo sur le mollet. C'est flatteur et effrayant."], en: ["I restored the sword to 100% and called the cow bug a 'secret feature'. Players call me 'god'. My boss calls me 'the problem'. Sales doubled.", "Apology patch: sword buffed, flying cows made official, and a free hat. The forums love me. A fan tattooed my username on his calf. Flattering and terrifying."] }, fx: { perf: 8, followers: 3000, happy: 6 }, mood: 'proud' },
      ] },
      { label: { fr: 'Obéir au patron', en: 'Obey the boss' }, out: [
        { w: 1, text: { fr: ["Coffres payants dans le jeu de poneys. Bénéfices records. Des parents ont découvert des factures de 3 000 €. Enquête de la répression des fraudes. Mon nom est sur le code. Le patron a dit qu'il n'était « pas au courant ».", "J'ai corrigé le bug des vaches. Les joueurs ont mis 200 000 avis négatifs en une nuit. Le studio a dû licencier. Devinez qui en premier."], en: ["Paid loot boxes in the pony game. Record profits. Parents found $3,000 bills. Consumer-fraud investigation. My name's on the code. The boss said he 'wasn't aware'.", "I fixed the cow bug. Players left 200,000 negative reviews overnight. The studio had layoffs. Guess who went first."] }, fx: { fired: true, karma: -4 }, mood: 'sad' },
        { w: 1, text: { fr: ["Le patron était ravi. Les joueurs, furieux. J'ai changé de pseudo sur tous les réseaux et je dis à ma famille que je travaille « dans la banque ». C'est moins honteux.", "J'ai fait ce qu'on m'a demandé. Le jeu a coulé. Le patron a eu un bonus pour « la gestion de crise ». Moi, un mug « Meilleur{|e} dév de l'année »."], en: ["The boss was delighted. Players, furious. I changed my username everywhere and tell my family I work 'in banking'. Less shameful.", "I did as I was told. The game tanked. The boss got a bonus for 'crisis management'. I got a 'Best Dev of the Year' mug."] }, fx: { perf: 4, happy: -6, stress: 6 }, mood: 'neutral' },
      ] },
    ],
  },
  // ───────────────────────────── ux_designer ─────────────────────────────
  {
    id: 'c3_ux_grandma', icon: '👵', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'happy', prop: 'phone' },
    when: { job: 'ux_designer' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Test utilisateur de ta nouvelle appli bancaire avec Mme Germaine, 84 ans. Ça fait [[35|50|65]] minutes. Elle cherche le bouton « Valider ». Elle a appuyé sur le logo, sur l'écran éteint et sur sa propre main.",
        "Session de test : un utilisateur doit commander {w:food} sur ton appli. Il a ouvert les paramètres, changé la langue en finnois, puis appelé sa fille en pleurant.",
        "Ton nouveau parcours d'inscription tient en « seulement 14 étapes ». Le testeur abandonne à l'étape 3, en écrivant dans le champ « Commentaires » : « Pourquoi vous me faites ça ? »",
        "Le PDG a testé ton prototype personnellement. Son verdict : « Le bouton est trop bleu. Et pas assez. Et il devrait faire un bruit, genre {w:sound}. »",
      ],
      en: [
        "User test of your new banking app with Mrs Germaine, 84. It's been [[35|50|65]] minutes. She's looking for the 'Confirm' button. She's tapped the logo, the blank screen and her own hand.",
        "Test session: a user has to order {w:food} on your app. He opened settings, switched the language to Finnish, then called his daughter in tears.",
        "Your new sign-up flow is 'only 14 steps'. The tester gives up at step 3, typing in the 'Feedback' field: 'Why are you doing this to me?'",
        "The CEO tested your prototype personally. His verdict: 'The button is too blue. And not blue enough. And it should make a noise, like {w:sound}.'",
      ],
    },
    choices: [
      { label: { fr: 'Tout simplifier', en: 'Simplify everything' }, out: [
        { w: 2, odds: { smarts: 1 }, text: { fr: ["J'ai tout refait : un gros bouton, un seul écran, le mot « OK ». Mme Germaine a fait un virement en 9 secondes. Elle a pleuré de joie. L'appli a gagné un prix. J'ai offert le trophée à Germaine.", "Inscription en 2 étapes au lieu de 14. Le taux de conversion a triplé. Mon chef a demandé pourquoi on n'avait pas fait ça plus tôt. Je lui ai montré les 12 mails où il exigeait les 14 étapes."], en: ["I redid everything: one big button, one screen, the word 'OK'. Mrs Germaine made a transfer in 9 seconds. She wept with joy. The app won an award. I gave the trophy to Germaine.", "Sign-up in 2 steps instead of 14. Conversion tripled. My boss asked why we hadn't done this sooner. I showed him the 12 emails where he demanded 14 steps."] }, fx: { perf: 12, karma: 4, promote: true }, mood: 'proud' },
        { w: 1, odds: { smarts: -1 }, text: { fr: ["J'ai simplifié au point de supprimer le bouton « Annuler ». Mme Germaine a viré ses économies à un inconnu. On l'a récupérées. Mon chef m'a mis{|e} sur les icônes de la page « Mentions légales ».", "Ma version « simple » a un seul bouton. Personne ne sait ce qu'il fait. Moi non plus. Il fait {w:sound}, comme voulait le PDG."], en: ["I simplified so much I removed the 'Cancel' button. Mrs Germaine wired her savings to a stranger. We got them back. My boss put me on icons for the 'Legal notice' page.", "My 'simple' version has one button. Nobody knows what it does. Neither do I. It makes {w:sound}, like the CEO wanted."] }, fx: { perf: -6, stress: 6 }, mood: 'sad' },
      ] },
      { label: { fr: 'Blâmer l\'utilisateur', en: 'Blame the user' }, text: { fr: ["J'ai écrit dans le rapport : « Utilisateur non représentatif. » Mme Germaine représente 30 % de nos clients. Mon chef ne l'a pas remarqué. L'appli a 1,4 étoile. Ce n'est pas ma faute, c'est celle des gens.", "Rapport : « Le problème se situe entre la chaise et le clavier. » Le PDG a adoré la formule et l'a reprise en conférence. Les utilisateurs, eux, ont désinstallé l'appli."], en: ["I wrote in the report: 'Non-representative user.' Mrs Germaine represents 30% of our customers. My boss didn't notice. The app is rated 1.4 stars. Not my fault, it's people's fault.", "Report: 'The problem lies between the chair and the keyboard.' The CEO loved the line and reused it at a conference. Users uninstalled the app."] }, fx: { perf: 2, karma: -4 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── personal_trainer ─────────────────────────────
  {
    id: 'c3_trainer_squat', icon: '🏋️', cat: 'job', rating: 2,
    scene: { place: 'park', mood: 'shock', fx: 'poop' },
    when: { job: 'personal_trainer' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Ton client, un banquier de 110 kg, tente un squat à 140 kg « pour impressionner sa nouvelle copine ». À la descente, un bruit humide résonne dans toute la salle. Son short gris change de couleur.",
        "Séance de soulevé de terre. Ta cliente pousse, pousse, pousse… et lâche un pet si puissant que le miroir vibre. Puis un deuxième, plus inquiétant. Elle te regarde, livide : « Je crois que c'était pas qu'un pet. »",
        "Tu as fait faire 200 burpees à un client qui avait mangé {w:food} juste avant. Il est blanc. Il te regarde. Il ouvre la bouche. Tu es juste en face, à genoux, pour compter.",
        "Un influenceur fitness te paie pour une vidéo « séance extrême ». Au 50e saut, son corps cède par tous les orifices en même temps. La caméra tourne. Il a 2 millions d'abonnés.",
      ],
      en: [
        "Your client, a 240-pound banker, attempts a 300-pound squat 'to impress his new girlfriend'. On the way down, a wet sound echoes through the gym. His grey shorts change colour.",
        "Deadlift session. Your client pushes, pushes, pushes… and lets out a fart so powerful the mirror vibrates. Then a second, more worrying one. She looks at you, pale: 'I don't think that was just a fart.'",
        "You made a client do 200 burpees right after he ate {w:food}. He's white. He looks at you. He opens his mouth. You're right in front of him, kneeling, counting.",
        "A fitness influencer pays you for an 'extreme session' video. On the 50th jump, his body gives out through every orifice at once. The camera's rolling. He has 2 million followers.",
      ],
    },
    choices: [
      { label: { fr: 'Rester pro', en: 'Stay professional' }, out: [
        { w: 2, text: { fr: ["« Ça arrive aux meilleurs, champion. » J'ai lancé une serviette, fermé la salle « pour maintenance » et désinfecté à la Javel. Il m'a payé trois mois d'avance pour mon silence. Je suis un coffre-fort.", "J'ai fait comme si de rien n'était et proposé de « finir la série ». Il a pleuré de reconnaissance. Il est devenu mon client le plus fidèle. Il ne fait plus jamais de squat à jeun. Ni après repas."], en: ["'Happens to the best of us, champ.' I threw a towel, closed the room 'for maintenance' and bleached everything. He paid three months upfront for my silence. I'm a vault.", "I acted like nothing happened and offered to 'finish the set'. He cried with gratitude. He became my most loyal client. He never squats on an empty stomach again. Or a full one."] }, fx: { money: 600, perf: 8, happy: -4, visual: 'poop' }, mood: 'neutral' },
      ] },
      { label: { fr: 'Éclater de rire', en: 'Burst out laughing' }, out: [
        { w: 1, text: { fr: ["J'ai ri. Fort. Jusqu'aux larmes. Toute la salle a ri. Le client est parti sans se doucher et a écrit un avis Google : « Coach sans empathie ». Avec photo du short. C'est lui qui l'a postée.", "Fou rire incontrôlable. Le vomi m'a atteint{|e} en plein visage au milieu du rire. Le karma est instantané dans les salles de sport."], en: ["I laughed. Loud. To tears. The whole gym laughed. The client left without showering and wrote a Google review: 'Coach with zero empathy.' With a photo of the shorts. He posted it himself.", "Uncontrollable giggles. The vomit hit me square in the face mid-laugh. Karma is instant in gyms."] }, fx: { perf: -8, happy: 4, visual: 'poop' }, mood: 'happy' },
      ] },
      { label: { fr: 'Poster la vidéo', en: 'Post the video' }, out: [
        { w: 1, text: { fr: ["La vidéo de l'influenceur a fait 30 millions de vues. Il m'a fait un procès, puis il a vu les chiffres et m'a proposé une collaboration. On fait des vidéos « Défi Explosif ». Je suis riche et je sens mauvais.", "J'ai posté. Il m'a bloqué{|e}, viré{|e} et poursuivi{|e}. Mais j'ai gagné 80 000 abonnés qui m'appellent « le coach qui fait chier ». Littéralement."], en: ["The influencer video got 30 million views. He sued me, then saw the numbers and offered a collab. We do 'Explosive Challenge' videos. I'm rich and I smell bad.", "I posted it. He blocked me, fired me and sued me. But I gained 80,000 followers who call me 'the coach who scares the crap out of people'. Literally."] }, fx: { followers: 50000, fame: 4, karma: -6, quitJob: true }, mood: 'party' },
      ] },
    ],
  },
  // ───────────────────────────── yoga_teacher ─────────────────────────────
  {
    id: 'c3_yoga_tantra', icon: '🧘', cat: 'job', rating: 2,
    scene: { place: 'studio', mood: 'love', fx: 'hearts' },
    when: { job: 'yoga_teacher', age: [18, 120] }, weight: 8, cooldown: 4,
    text: {
      fr: [
        "Ton studio t'a inscrit{|e} pour animer un « atelier de yoga tantrique pour couples ». Tu n'as jamais fait de yoga tantrique. 12 couples t'attendent sur leurs tapis. Certains ont déjà retiré beaucoup de vêtements.",
        "Cours du soir, « connexion des énergies ». Tu proposes une posture à deux. Au bout de dix minutes, les couples se connectent beaucoup. Trop. La lumière tamisée n'aide pas. Quelqu'un a éteint l'encens.",
        "Ton atelier « respiration sensuelle » a été mal décrit sur {w:app}. Les participants sont venus avec des huiles de massage, des bougies et des attentes très précises. Une dame a apporté un fouet.",
        "Retraite yoga {w:far_place}. Le dernier soir, la séance de méditation au clair de lune a dérapé : tes élèves se sont mis en cercle, nus, et chantent. Ils t'appellent pour « guider l'énergie ».",
      ],
      en: [
        "Your studio signed you up to lead a 'tantric yoga workshop for couples'. You've never done tantric yoga. 12 couples wait on their mats. Some have already removed a lot of clothing.",
        "Evening class, 'connecting energies'. You suggest a partner pose. Ten minutes in, the couples are connecting a lot. Too much. The dim lighting doesn't help. Someone blew out the incense.",
        "Your 'sensual breathing' workshop was misdescribed on {w:app}. Participants came with massage oils, candles and very specific expectations. One lady brought a whip.",
        "Yoga retreat {w:far_place}. On the last night, moonlight meditation got out of hand: your students formed a naked circle and are chanting. They're calling you to 'guide the energy'.",
      ],
    },
    choices: [
      { label: { fr: 'Improviser avec sérieux', en: 'Improvise seriously' }, out: [
        { w: 2, text: { fr: ["J'ai inventé des postures au fur et à mesure : « le lotus fusionnel », « le chien tête en bas complice ». Les couples ont adoré. Trois mois plus tard, quatre bébés portaient mon prénom. L'atelier est complet jusqu'en 2028.", "J'ai parlé de chakras, de souffle et d'« énergie partagée » d'une voix grave. Personne n'a vu que je lisais un tuto sur mon téléphone. Pourboires : 400 €. Une participante m'a fait un clin d'œil appuyé."], en: ["I made up poses as I went: 'the fusion lotus', 'the conspiratorial downward dog'. The couples loved it. Three months later, four babies bore my name. The workshop is booked until 2028.", "I talked chakras, breath and 'shared energy' in a deep voice. Nobody noticed I was reading a tutorial on my phone. Tips: $400. One participant gave me a heavy wink."] }, fx: { money: 400, perf: 10, happy: 6 }, mood: 'love' },
        { w: 1, text: { fr: ["Ça a dérapé. Franchement dérapé. On aurait dit {w:movie}, version classée X. La propriétaire est arrivée en avance pour le cours de 20 h. Avec des mamans et des poussettes. J'ai été viré{|e} sur-le-champ.", "Un voisin a appelé la police pour « bruits suspects ». Les agents ont trouvé 24 personnes en position du lotus, nues. Moi, je tenais un gong. Le studio a perdu sa licence."], en: ["It got out of hand. Seriously out of hand. It looked like {w:movie}, X-rated version. The owner arrived early for the 8 p.m. class. With mums and pushchairs. Fired on the spot.", "A neighbour called the police over 'suspicious noises'. Officers found 24 naked people in lotus position. I was holding a gong. The studio lost its licence."] }, fx: { fired: true, happy: 4 }, mood: 'shock' },
      ] },
      { label: { fr: 'Rallumer la lumière', en: 'Turn the lights back on' }, text: { fr: ["J'ai allumé les néons. 24 personnes à moitié nues ont crié comme des vampires. J'ai lancé une séance de « salutation au soleil » très énergique, très chaste. Remboursement exigé par 11 couples sur 12.", "Néons, musique d'ascenseur, et un exercice de respiration sur une chaise. Les couples sont repartis frustrés. Le douzième, lui, a adoré. Ils étaient venus pour le yoga, en fait."], en: ["I switched on the strip lights. 24 half-naked people screamed like vampires. I launched a very energetic, very chaste 'sun salutation'. 11 couples out of 12 demanded a refund.", "Strip lights, elevator music and a breathing exercise on chairs. The couples left frustrated. The twelfth loved it. They'd come for yoga, actually."] }, fx: { perf: -4, money: -200, karma: 2 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── escort ─────────────────────────────
  {
    id: 'c3_escort_boss', icon: '🌹', cat: 'job', rating: 2,
    scene: { place: 'apartment', mood: 'shock', fx: 'hearts' },
    when: { job: 'escort', age: [18, 120] }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Rendez-vous dans une suite d'hôtel. La porte s'ouvre : c'est ton ancien prof de philo, en peignoir, une bouteille de champagne à la main. Il te reconnaît. Il dit : « Ah. Le cogito, donc. »",
        "Ton nouveau client a réservé « la formule soirée complète ». C'est ton ancien patron, celui qui t'a licencié{|e} il y a deux ans « pour manque d'investissement ». Il a l'air très, très gêné.",
        "Ta cliente de ce soir a réservé trois heures. En arrivant, tu découvres que c'est la mère de ton ex. Elle sourit : « Je voulais comprendre ce qu'il te trouvait. »",
        "Soirée de gala, tu accompagnes un ministre. À table, en face, ton propre père, avec une accompagnatrice aussi. Vos regards se croisent au-dessus du foie gras. Personne ne dit rien.",
      ],
      en: [
        "Appointment in a hotel suite. The door opens: it's your old philosophy teacher, in a bathrobe, champagne in hand. He recognises you. He says: 'Ah. Cogito, then.'",
        "Your new client booked 'the full evening package'. It's your former boss, the one who fired you two years ago 'for lack of commitment'. He looks very, very awkward.",
        "Tonight's client booked three hours. When you arrive, you discover it's your ex's mother. She smiles: 'I wanted to understand what he saw in you.'",
        "Gala dinner; you're escorting a minister. Across the table: your own father, also with a paid companion. Your eyes meet over the foie gras. Nobody says a word.",
      ],
    },
    choices: [
      { label: { fr: 'Rester pro et tripler le tarif', en: 'Stay pro, triple the rate' }, out: [
        { w: 2, text: { fr: ["« Pour les anciennes connaissances, c'est tarif spécial. » Il a payé le triple, sans négocier. La soirée a été étrange, élégante et étonnamment philosophique. Il m'a recommandé{|e} à tout le corps enseignant.", "Mon ancien patron a payé le triple. Puis il m'a proposé de revenir dans sa boîte, « avec une augmentation ». J'ai refusé. J'ai gardé l'argent et le pouvoir. Surtout le pouvoir."], en: ["'For old acquaintances, special rates apply.' He paid triple without haggling. The evening was strange, elegant and surprisingly philosophical. He recommended me to the whole teaching staff.", "My ex-boss paid triple. Then offered me my old job back 'with a raise'. I refused. Kept the money and the power. Mostly the power."] }, fx: { money: 3000, perf: 8, happy: 6 }, mood: 'proud' },
        { w: 1, text: { fr: ["Le malaise était trop grand. On a passé trois heures à regarder {w:show} sur le canapé, chacun à un bout. Il a payé quand même. C'est le rendez-vous le plus bizarre et le mieux payé de ma carrière.", "Au dessert, papa et moi avons conclu un pacte silencieux : maman ne saura jamais. Le ministre a trouvé l'ambiance « électrique ». Il m'a rebooké{|e} pour le mois prochain."], en: ["The awkwardness was too much. We spent three hours watching {w:show} on the sofa, one at each end. He paid anyway. Weirdest and best-paid date of my career.", "At dessert, Dad and I made a silent pact: Mum will never know. The minister found the atmosphere 'electric'. He rebooked me for next month."] }, fx: { money: 1500, stress: 6 }, mood: 'neutral' },
      ] },
      { label: { fr: 'Partir en courant', en: 'Run for it' }, text: { fr: ["J'ai tourné les talons sans un mot. Dans l'ascenseur, j'ai crié pendant six étages. Il m'a envoyé un message : « Je vous mets quand même 5 étoiles pour la discrétion. »", "Je suis parti{|e}. Annulation tardive, pénalité, et un client qui m'a écrit un poème d'excuses en alexandrins. Il était mauvais. Le poème, je veux dire."], en: ["I turned on my heel without a word. In the lift, I screamed for six floors. He texted me: 'Still giving you 5 stars for discretion.'", "I left. Late cancellation, penalty, and a client who wrote me an apology poem in alexandrines. It was bad. The poem, I mean."] }, fx: { money: -200, happy: -2 }, mood: 'shock' },
    ],
  },
  // ───────────────────────────── banker ─────────────────────────────
  {
    id: 'c3_bank_vault', icon: '🏦', cat: 'job', rating: 0,
    scene: { place: 'office', mood: 'neutral', fx: 'money' },
    when: { job: 'banker' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "Mme Rousseau, 91 ans, exige de « voir son argent ». Pas un relevé : l'argent. « Je veux vérifier que vous ne l'avez pas dépensé. » Elle a 340 000 € sur son compte et une canne en noyer très solide.",
        "Un client veut retirer toutes ses économies en pièces de 2 € pour « les cacher dans son matelas, parce qu'on ne sait jamais avec les banques ». Il a [[48 000|61 000|35 000]] €. Il est venu avec une brouette.",
        "Un monsieur exige un prêt immobilier. Revenus : « variables ». Apport : {w:object}. Profession : {w:weird_job}. Il te fixe avec l'aplomb de quelqu'un qui a vu un tuto sur la négociation.",
        "Ta directrice d'agence veut que tu vendes une assurance-vie, une carte premium et un placement « dynamique » à un étudiant qui est juste venu déposer un chèque de 25 € de sa grand-mère.",
      ],
      en: [
        "Mrs Rousseau, 91, demands to 'see her money'. Not a statement: the money. 'I want to check you haven't spent it.' She has $340,000 in her account and a very sturdy walnut cane.",
        "A client wants to withdraw all his savings in $2 coins to 'hide them in his mattress, because you never know with banks'. He has $[[48,000|61,000|35,000]]. He brought a wheelbarrow.",
        "A man demands a mortgage. Income: 'variable'. Down payment: {w:object}. Job: {w:weird_job}. He stares at you with the confidence of someone who watched a negotiation tutorial.",
        "Your branch manager wants you to sell life insurance, a premium card and a 'dynamic' investment to a student who just came to deposit a $25 cheque from his grandma.",
      ],
    },
    choices: [
      { label: { fr: 'Faire plaisir au client', en: 'Humour the client' }, out: [
        { w: 2, text: { fr: ["J'ai emmené Mme Rousseau au coffre, sorti quelques liasses et je les ai étalées devant elle. Elle les a comptées, satisfaite, puis m'a tapoté la joue : « Vous êtes honnête, vous. » Elle a ouvert un livret pour son arrière-petit-fils.", "J'ai commandé 24 000 pièces de 2 €. Il est reparti avec sa brouette, en sueur, en faisant un bruit de tirelire géante. Il est revenu trois semaines plus tard tout redéposer. « Le matelas fait mal au dos. »"], en: ["I took Mrs Rousseau to the vault, pulled out a few bundles and spread them before her. She counted, satisfied, then patted my cheek: 'You're honest, you are.' She opened a savings account for her great-grandson.", "I ordered 24,000 $2 coins. He left with his wheelbarrow, sweating, jingling like a giant piggy bank. Three weeks later he deposited it all back. 'The mattress hurts my back.'"] }, fx: { perf: 8, karma: 4, happy: 4 }, mood: 'happy' },
      ] },
      { label: { fr: 'Vendre tout le catalogue', en: 'Sell the whole catalogue' }, out: [
        { w: 1, text: { fr: ["L'étudiant est reparti avec une carte premium à 290 € par an et une assurance-vie. Il a 19 ans. Ma directrice m'a nommé{|e} « vend{eur|euse} du trimestre ». Je ne dors plus très bien.", "J'ai vendu au monsieur un prêt à 11 % sur 40 ans garanti par {w:object}. Ma directrice a applaudi. Le siège a appelé pour demander « qui a validé ça ». C'était moi. Avertissement."], en: ["The student left with a $290-a-year premium card and a life insurance policy. He's 19. My manager named me 'seller of the quarter'. I don't sleep so well anymore.", "I sold the man an 11%, 40-year loan secured by {w:object}. My manager applauded. Head office called to ask 'who approved this'. It was me. Warning."] }, fx: { perf: 6, karma: -6, money: 200 }, mood: 'neutral' },
      ] },
    ],
  },
  // ───────────────────────────── prosecutor ─────────────────────────────
  {
    id: 'c3_pros_cousin', icon: '👨‍⚖️', cat: 'job', rating: 1,
    scene: { place: 'court', mood: 'shock' },
    when: { job: 'prosecutor' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Tu ouvres le dossier de la semaine : vol en bande organisée de 200 pots de Nutella. Le principal accusé est ton cousin Kévin. Au repas de dimanche, ta tante t'a regardé{|e} comme on regarde un traître.",
        "Le prévenu de l'audience de 14 h est ton oncle Jacky, accusé d'avoir fraudé l'assurance de son bar en « incendiant accidentellement » la caisse. Il te fait coucou depuis le box.",
        "Ton ex comparaît pour conduite en état d'ivresse sur une trottinette, dans un costume qui représente {w:animal}. Il te reste à requérir une peine. Tout le tribunal connaît votre histoire. Le juge mâche un chewing-gum, très intéressé.",
        "Ta grand-mère est accusée d'avoir organisé un tripot clandestin de belote au sous-sol de sa maison de retraite. 40 000 € de mises. Elle refuse un avocat : « Mon petit-enfant me défendra. » Tu es l'accusation.",
      ],
      en: [
        "You open this week's file: organised theft of 200 jars of Nutella. The main defendant is your cousin Kevin. At Sunday lunch, your aunt looked at you like a traitor.",
        "The 2 p.m. defendant is your uncle Jacky, accused of insurance fraud after 'accidentally setting fire' to his bar's till. He waves at you from the dock.",
        "Your ex is up for drunk-driving an e-scooter dressed as {w:animal}. You have to request a sentence. The whole court knows your history. The judge chews gum, very interested.",
        "Your grandma is accused of running an illegal card den in her retirement home's basement. $40,000 in bets. She refuses a lawyer: 'My grandchild will defend me.' You're the prosecution.",
      ],
    },
    choices: [
      { label: { fr: 'Requérir sévèrement', en: 'Go in hard' }, out: [
        { w: 2, text: { fr: ["J'ai requis la peine maximale, avec un réquisitoire de 40 minutes. Condamnation exemplaire. Ma hiérarchie m'a félicité{|e} pour mon « impartialité ». Ma famille m'a rayé{|e} du groupe WhatsApp.", "Réquisitoire implacable. Mamie a pris du sursis et m'a lancé son dentier depuis le box. Il a raté le juge de peu. Au repas de Noël, ma chaise a été remplacée par un pot de fleurs."], en: ["I demanded the maximum, with a 40-minute closing. Exemplary conviction. My superiors praised my 'impartiality'. My family removed me from the WhatsApp group.", "Merciless closing. Grandma got a suspended sentence and threw her dentures at me from the dock. Narrowly missed the judge. At Christmas dinner, my chair was replaced by a flowerpot."] }, fx: { perf: 12, karma: 2, happy: -8 }, mood: 'proud' },
      ] },
      { label: { fr: 'Saboter discrètement', en: 'Quietly throw the case' }, out: [
        { w: 1, text: { fr: ["J'ai « oublié » une pièce essentielle du dossier. Relaxe. Ma tante m'a fait un gratin. Ma hiérarchie m'a regardé{|e} avec suspicion pendant six mois. Le gratin était bon.", "J'ai requis « une peine symbolique, compte tenu du contexte ». Le juge a haussé un sourcil. Kévin a été relaxé et a ouvert un compte TikTok sur le Nutella. Il a 200 000 abonnés."], en: ["I 'forgot' a key piece of evidence. Acquitted. My aunt made me a gratin. My superiors eyed me suspiciously for six months. The gratin was good.", "I requested 'a symbolic sentence, given the context'. The judge raised an eyebrow. Kevin walked and started a Nutella TikTok. He has 200,000 followers."] }, fx: { karma: -4, happy: 6, perf: -4 }, mood: 'happy' },
        { w: 1, text: { fr: ["Un greffier a remarqué le lien de parenté. Enquête de l'inspection. J'aurais dû me déporter. Mutation disciplinaire {w:far_place}. Kévin m'envoie des pots de Nutella par la poste.", "Le juge a compris mon jeu en dix secondes. Il m'a convoqué{|e} dans son bureau, a craché son chewing-gum et m'a dit : « Je vous retire le dossier, et l'envie de recommencer. »"], en: ["A clerk spotted the family connection. Inspection inquiry. I should have recused myself. Disciplinary transfer {w:far_place}. Kevin mails me Nutella jars.", "The judge saw through it in ten seconds. Called me to chambers, spat out his gum and said: 'I'm taking this case away from you, and any urge to try again.'"] }, fx: { fired: true }, mood: 'shock' },
      ] },
      { label: { fr: 'Se déporter', en: 'Recuse yourself' }, text: { fr: ["J'ai demandé à être dessaisi{|e}. Un collègue a repris le dossier. Il a été bien plus sévère que moi. Ma famille croit quand même que c'est ma faute. On ne gagne jamais, avec la famille.", "Je me suis déporté{|e}, dans les règles. Ma hiérarchie a salué ma déontologie. Mamie a été condamnée par un autre et m'a quand même déshérité{|e} « par principe »."], en: ["I asked to be taken off the case. A colleague took over. He was far harsher than me. My family still thinks it's my fault. You never win with family.", "I recused myself, by the book. My superiors praised my ethics. Grandma got convicted by someone else and disinherited me anyway 'on principle'."] }, fx: { perf: 4, karma: 4 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── crypto_bro ─────────────────────────────
  {
    id: 'c3_crypto_dip', icon: '📉', cat: 'job', rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'laptop' },
    when: { job: 'crypto_bro' }, weight: 10, cooldown: 3,
    text: {
      fr: [
        "3 h du matin. Le marché crypto vient de perdre 80 % en une heure. Ton portefeuille vaut maintenant le prix d'un kebab. Ton groupe Telegram crie « BUY THE DIP ». Ta banque te propose un crédit conso à 19 %.",
        "Un influenceur en Lamborghini de location te jure que le jeton « {w:nickname} » va faire « x1000 ». Il n'existe que depuis 40 minutes. Le logo est {w:animal} avec des lunettes de soleil. Ça te parle.",
        "Ton conseiller en crypto, un ado de 16 ans rencontré sur Discord, te conseille de vendre ta voiture pour « all-in » sur un jeton lancé par {w:celeb}. Il signe ses messages « Respect, frérot ».",
        "Ton oncle t'a confié ses économies « parce que tu t'y connais ». Elles ont fondu de 60 % depuis mardi. Il t'appelle. C'est la cinquième fois aujourd'hui. Tu fais semblant d'être dans un tunnel.",
      ],
      en: [
        "3 a.m. The crypto market just lost 80% in an hour. Your wallet is now worth one kebab. Your Telegram group screams 'BUY THE DIP'. Your bank offers you a consumer loan at 19%.",
        "An influencer in a rented Lamborghini swears the '{w:nickname}' token will '1000x'. It's existed for 40 minutes. The logo is {w:animal} in sunglasses. You're feeling it.",
        "Your crypto adviser, a 16-year-old you met on Discord, tells you to sell your car and go 'all-in' on a token tied to {w:celeb}. He signs his messages 'Respect, bro'.",
        "Your uncle gave you his savings 'because you know your stuff'. They've melted 60% since Tuesday. He's calling. Fifth time today. You pretend you're in a tunnel.",
      ],
    },
    choices: [
      { label: { fr: 'All-in, HODL', en: 'All-in, HODL' }, out: [
        { w: 1, text: { fr: ["J'ai emprunté, tout misé, et attendu en mangeant des nouilles. Le jeton a fait x40 en une semaine. J'ai revendu au sommet par pur hasard (j'étais tombé{|e} sur le bouton). J'ai {$amount} et zéro compétence.", "HODL ! Ça a remonté. Je l'ai posté partout avec des fusées. Mon oncle a récupéré ses économies plus 12 %. Il pense que je suis un génie. Je pense que je suis chanc{eux|euse}."], en: ["I borrowed, went all-in and waited, eating instant noodles. The token did 40x in a week. I sold at the top by pure chance (I fell on the button). I have {$amount} and zero skill.", "HODL! It bounced back. I posted it everywhere with rocket emojis. My uncle got his savings back plus 12%. He thinks I'm a genius. I think I'm lucky."] }, fx: { money: 'amount', happy: 12, followers: 2000 }, mood: 'party' },
        { w: 2, text: { fr: ["Le jeton a disparu. Le site aussi. L'influenceur aussi. Il reste mon crédit à 19 % et un NFT représentant {w:animal} qui ne vaut rien. Je mange des pâtes au beurre. Sans beurre.", "J'ai tout perdu, y compris les économies de mon oncle. Il a appris la nouvelle au repas de famille, par ma mère. Il m'a lancé une cuisse de poulet. Je l'ai mangée. J'avais faim."], en: ["The token vanished. So did the website. So did the influencer. All that's left is my 19% loan and a worthless NFT of {w:animal}. I'm eating pasta with butter. Without butter.", "I lost everything, including my uncle's savings. He found out at a family dinner, from my mum. He threw a chicken leg at me. I ate it. I was hungry."] }, fx: { money: -3000, happy: -12, stress: 10 }, mood: 'cry' },
      ] },
      { label: { fr: 'Tout vendre et se taire', en: 'Sell everything and shut up' }, text: { fr: ["J'ai tout vendu, mis le reste sur un livret A, supprimé l'appli et pleuré dans ma douche. Le lendemain, le marché a remonté de 300 %. Je n'ai rien dit à personne. Je souris en public.", "Vente totale. Perte de 70 %, mais j'ai sauvé de quoi rembourser mon oncle. Il m'a dit « Merci, mais plus jamais. » J'ai ouvert un compte épargne. Je me sens {vieux|vieille} et soulagé{|e}."], en: ["I sold everything, put the rest in a savings account, deleted the app and cried in the shower. Next day the market went up 300%. I told no one. I smile in public.", "Total sale. 70% loss, but I saved enough to repay my uncle. He said 'Thanks, but never again.' I opened a savings account. I feel old and relieved."] }, fx: { money: -800, stress: -6, karma: 3 }, mood: 'sad' },
    ],
    vars: { amount: [4000, 15000] },
  },
  // ───────────────────────────── tattoo_artist ─────────────────────────────
  {
    id: 'c3_tattoo_butt', icon: '🖋️', cat: 'job', rating: 2,
    scene: { place: 'studio', mood: 'shock', prop: 'tattoo' },
    when: { job: 'tattoo_artist' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Un client baisse son pantalon : il veut le portrait réaliste de son bouledogue sur la fesse gauche, « avec la langue qui sort, pile au bon endroit ». Il a apporté 40 photos du chien. Et un schéma.",
        "Une cliente veut le prénom de son nouveau copain tatoué « très bas, en dessous du maillot ». Ils sont ensemble depuis 9 jours. Il s'appelle Jean-Baptiste-Alexandre. Il y a peu de place.",
        "Un enterrement de vie de garçon débarque. Les potes ont payé un tatouage surprise au futur marié, ivre mort : {w:animal} sur la fesse, avec la mention « Propriété de Sandrine ». Sa future s'appelle Julie.",
        "Un client veut se faire tatouer une flèche sur le bas du dos avec écrit « Entrée des artistes ». Il veut aussi « un petit truc » sur une zone que tu n'as jamais tatouée. Il rougit. Tu rougis.",
      ],
      en: [
        "A client drops his trousers: he wants a realistic portrait of his bulldog on his left buttock, 'with the tongue sticking out, right in the right spot'. He brought 40 photos of the dog. And a diagram.",
        "A client wants her new boyfriend's name tattooed 'very low, below the bikini line'. They've been together 9 days. His name is Jean-Baptiste-Alexandre. There isn't much room.",
        "A stag party bursts in. The mates paid for a surprise tattoo for the blackout-drunk groom: {w:animal} on his butt, with 'Property of Sandrine'. His bride is called Julie.",
        "A client wants an arrow tattooed on his lower back reading 'Stage door'. He also wants 'a little something' on an area you've never tattooed. He blushes. You blush.",
      ],
    },
    choices: [
      { label: { fr: 'Encrer avec talent', en: 'Ink it with flair' }, out: [
        { w: 2, odds: { discipline: 1 }, text: { fr: ["Six heures de travail. Le bouledogue est si réaliste qu'il semble aboyer quand il marche. Le client a pleuré. Il a posté la photo : 600 000 likes. Les demandes de « fesses animalières » ont explosé.", "Jean-Baptiste-Alexandre en lettres de 4 millimètres, lisible à la loupe. Chef-d'œuvre de micro-tatouage. Ils ont rompu trois semaines plus tard. Elle revient lundi pour « une rature artistique »."], en: ["Six hours of work. The bulldog is so realistic it seems to bark when he walks. The client cried. He posted the photo: 600,000 likes. Requests for 'animal butts' exploded.", "Jean-Baptiste-Alexandre in 4-millimetre letters, legible with a magnifying glass. Micro-tattoo masterpiece. They broke up three weeks later. She's back Monday for 'an artistic cross-out'."] }, fx: { money: 500, perf: 10, followers: 3000 }, mood: 'proud' },
        { w: 1, odds: { discipline: -1 }, text: { fr: ["Le client a eu un spasme au mauvais moment. Le bouledogue a maintenant un œil sur la fesse droite et la langue dans un endroit très, très précis. Il m'a fait un procès. Le juge a demandé à voir la pièce à conviction.", "J'ai écrit « Jean-Baptiste-Alexandr ». Il n'y avait plus de place pour le E. Elle a hurlé. Lui aussi, en voyant qu'il était maintenant « Alexandr »."], en: ["The client spasmed at the wrong moment. The bulldog now has an eye on the right buttock and its tongue in a very, very specific place. He sued. The judge asked to see the evidence.", "I wrote 'Jean-Baptiste-Alexandr'. No room left for the E. She screamed. So did he, finding out he was now 'Alexandr'."] }, fx: { perf: -8, money: -400 }, mood: 'shock' },
      ] },
      { label: { fr: 'Refuser l\'enterrement de vie', en: 'Refuse the stag prank' }, text: { fr: ["J'ai refusé de tatouer un homme inconscient. Les potes m'ont traité{|e} de « rabat-joie ». Le futur marié, réveillé, m'a remercié{|e} en pleurant, puis il a vomi dans mon pot à aiguilles. On ne peut pas tout avoir.", "J'ai fait semblant : un faux tatouage au feutre lavable. Les potes étaient ravis. Julie aussi, le lendemain, quand tout est parti sous la douche. Le futur marié m'envoie une carte chaque année."], en: ["I refused to tattoo an unconscious man. The mates called me a 'buzzkill'. The groom, awake, thanked me tearfully, then vomited into my needle pot. Can't have everything.", "I faked it: a washable-marker tattoo. The mates were thrilled. So was Julie, the next day, when it all came off in the shower. The groom sends me a card every year."] }, fx: { karma: 6, perf: 2 }, mood: 'proud' },
    ],
  },
  // ───────────────────────────── photographer ─────────────────────────────
  {
    id: 'c3_photo_boudoir', icon: '📸', cat: 'job', rating: 2,
    scene: { place: 'studio', mood: 'shock', prop: 'camera' },
    when: { job: 'photographer', age: [18, 120] }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Séance photo « boudoir » réservée en ligne, cadeau surprise pour un mari. La cliente arrive en nuisette léopard. C'est ta belle-mère. Elle te reconnaît. Elle dit : « Bon. On est des adultes. »",
        "Un client a réservé une séance « artistique nue » pour son anniversaire. Il prend des poses inspirées de statues grecques. Il a apporté une feuille de vigne. Elle est trop petite. Beaucoup trop petite.",
        "Un couple veut des photos de grossesse « audacieuses » en tenue d'Adam et Ève, avec un python vivant comme accessoire. Le python n'aime pas le flash. Il commence à serrer.",
        "Séance photo pour le calendrier coquin des pompiers de la ville. Il fait froid dans le studio. Très froid. Certains pompiers sont… moins en valeur que prévu. Le chef te demande de « tricher un peu ».",
      ],
      en: [
        "A 'boudoir' photo shoot booked online, a surprise gift for a husband. The client arrives in a leopard-print negligee. It's your mother-in-law. She recognises you. She says: 'Right. We're adults.'",
        "A client booked a 'nude art' shoot for his birthday. He strikes poses inspired by Greek statues. He brought a fig leaf. It's too small. Much too small.",
        "A couple wants 'bold' pregnancy photos dressed as Adam and Eve, with a live python as a prop. The python doesn't like the flash. It starts squeezing.",
        "Shoot for the town firefighters' saucy calendar. It's cold in the studio. Very cold. Some firefighters are… less impressive than planned. The chief asks you to 'cheat a bit'.",
      ],
    },
    choices: [
      { label: { fr: 'Shooter en pro', en: 'Shoot like a pro' }, out: [
        { w: 2, text: { fr: ["Je me suis concentré{|e} sur la lumière, les angles et le fait de ne JAMAIS penser au repas de Noël. Les photos sont magnifiques. Mon beau-père m'a remercié{|e} sans savoir qui les avait prises. Je garderai ce secret jusqu'à la tombe.", "J'ai joué avec les ombres, la fumée et un ventilateur. Le calendrier des pompiers s'est vendu à 30 000 exemplaires. Personne n'a remarqué le froid. On m'a commandé celui de l'année prochaine."], en: ["I focused on light, angles and NEVER thinking about Christmas dinner. The photos are gorgeous. My father-in-law thanked me without knowing who took them. I'll take this secret to the grave.", "I played with shadows, smoke and a fan. The firefighters' calendar sold 30,000 copies. Nobody noticed the cold. They've booked me for next year."] }, fx: { money: 800, perf: 10, stress: 4 }, mood: 'proud' },
        { w: 1, text: { fr: ["Le python a serré le futur papa jusqu'à ce qu'il devienne violet. On a dû appeler les pompiers. C'étaient ceux du calendrier. Ils ont reconnu le studio. Tout le monde était gêné, sauf le python.", "J'ai envoyé les photos boudoir par erreur sur le groupe familial au lieu du client. 32 membres. Ma belle-mère a été la première à réagir : un emoji flamme. Ma moitié demande le divorce."], en: ["The python squeezed the dad-to-be until he turned purple. We had to call the fire brigade. The calendar guys. They recognised the studio. Everyone was embarrassed except the python.", "I accidentally sent the boudoir photos to the family group chat instead of the client. 32 members. My mother-in-law reacted first: a flame emoji. My spouse wants a divorce."] }, fx: { happy: -10, stress: 10, perf: -4 }, mood: 'shock' },
      ] },
      { label: { fr: 'Annuler la séance', en: 'Cancel the shoot' }, text: { fr: ["J'ai prétexté une panne d'appareil et proposé un confrère. Ma belle-mère a fait semblant de me croire. Au repas de dimanche, elle m'a servi la plus grosse part de gigot. On a un pacte, désormais.", "« Désolé{|e}, je ne travaille pas avec les reptiles. » Le couple est parti furieux. Le python, lui, a eu l'air soulagé. Moi aussi."], en: ["I faked a camera fault and recommended a colleague. My mother-in-law pretended to believe me. At Sunday lunch she served me the biggest slice of lamb. We have a pact now.", "'Sorry, I don't work with reptiles.' The couple left furious. The python looked relieved. So did I."] }, fx: { money: -100, karma: 2 }, mood: 'neutral' },
    ],
  },
  // ───────────────────────────── novelist ─────────────────────────────
  {
    id: 'c3_novel_erotica', icon: '📚', cat: 'job', rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'book' },
    when: { job: 'novelist' }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Ton grand roman littéraire de 600 pages sur le deuil s'est vendu à 212 exemplaires. Ton éditeur te propose un contrat en or : écrire, sous pseudonyme, une romance torride entre une bibliothécaire et un bûcheron loup-garou.",
        "Ton éditrice veut « surfer sur la tendance ». Elle te commande une saga érotique où une femme d'affaires tombe amoureuse d'un dinosaure milliardaire. Avance : 50 000 €. Ta mère lit tout ce que tu écris.",
        "Ton recueil de poèmes a été pilonné. Une plateforme te propose d'écrire des nouvelles coquines au kilomètre : « Le facteur sonne toujours deux fois », « Le plombier et la fuite », « Le jardinier et {w:object} ».",
        "Le seul de tes livres qui marche est celui que tu as écrit en une nuit, ivre, sous pseudonyme : « Les Mains du Moniteur de Ski ». Les lecteurs réclament une suite. Tu as honte. Tu as aussi des factures.",
      ],
      en: [
        "Your 600-page literary novel about grief sold 212 copies. Your publisher offers a golden contract: write, under a pen name, a steamy romance between a librarian and a werewolf lumberjack.",
        "Your editor wants to 'ride the trend'. She commissions an erotic saga where a businesswoman falls for a billionaire dinosaur. Advance: $50,000. Your mother reads everything you write.",
        "Your poetry collection was pulped. A platform offers you mass-produced saucy short stories: 'The Postman Always Rings Twice', 'The Plumber and the Leak', 'The Gardener and {w:object}'.",
        "The only book of yours that sells is the one you wrote in one drunken night under a pen name: 'The Ski Instructor's Hands'. Readers want a sequel. You're ashamed. You also have bills.",
      ],
    },
    choices: [
      { label: { fr: 'Écrire le dinosaure', en: 'Write the dinosaur' }, out: [
        { w: 2, text: { fr: ["« Ses écailles frémirent sous la lumière du conseil d'administration. » J'ai écrit 400 pages en trois semaines. Numéro un des ventes. Ma mère a acheté 12 exemplaires sans savoir que c'était moi. Elle en parle à son club de lecture.", "Le bûcheron loup-garou a conquis le monde : traduit en 23 langues, adaptation en série. Je donne des interviews masqué{|e}. Mon roman sur le deuil est ressorti en poche grâce à l'argent du loup."], en: ["'His scales trembled in the boardroom light.' I wrote 400 pages in three weeks. Number-one bestseller. My mum bought 12 copies not knowing it was me. She discusses it at her book club.", "The werewolf lumberjack conquered the world: translated into 23 languages, series adaptation. I give interviews masked. My grief novel got a paperback reissue thanks to the wolf money."] }, fx: { money: 'amount', fame: 4, happy: 8, promote: true }, mood: 'party' },
        { w: 1, text: { fr: ["Mon pseudonyme a été percé par un journaliste. Titre : « L'auteur primé qui écrit des dinosaures coquins ». Ma mère a appelé. Elle n'a rien dit pendant 40 secondes. Puis : « Le chapitre 9, c'est vraiment possible ? »", "Le livre a fait un bide. Même les fans du genre l'ont trouvé « trop littéraire ». Une critique dit : « Le dinosaure a plus de profondeur psychologique que l'héroïne, mais moins de charme. »"], en: ["A journalist cracked my pen name. Headline: 'Award-winning author writes naughty dinosaurs'. My mum called. Said nothing for 40 seconds. Then: 'Chapter 9 — is that actually possible?'", "The book flopped. Even genre fans found it 'too literary'. One review: 'The dinosaur has more psychological depth than the heroine, but less charm.'"] }, fx: { fame: 3, happy: -6, followers: 1500 }, mood: 'shock' },
      ] },
      { label: { fr: 'Rester fidèle à mon art', en: 'Stay true to my art' }, text: { fr: ["J'ai refusé. J'écris mon deuxième roman sur le deuil, cette fois celui de ma carrière. Il se vendra à 180 exemplaires. Mais c'est de la littérature. Je mange des lentilles avec dignité.", "Non. L'art avant tout. Mon éditeur a donné le contrat à mon pire rival, qui roule maintenant en Tesla. Je lui ai envoyé une carte : « Félicitations pour le dinosaure. » Je pleure en écrivant."], en: ["I declined. I'm writing my second novel about grief, this time the death of my career. It'll sell 180 copies. But it's literature. I eat lentils with dignity.", "No. Art first. My publisher gave the contract to my worst rival, who now drives a Tesla. I sent him a card: 'Congratulations on the dinosaur.' I cry as I write."] }, fx: { karma: 4, happy: -4, smarts: 2 }, mood: 'sad' },
    ],
    vars: { amount: [8000, 30000] },
  },
  // ───────────────────────────── adult_actor ─────────────────────────────
  {
    id: 'c3_adult_ikea', icon: '🎬', cat: 'job', rating: 2,
    scene: { place: 'studio', mood: 'shock', fx: 'hearts' },
    when: { job: 'adult_actor', age: [18, 120] }, weight: 9, cooldown: 4,
    text: {
      fr: [
        "Tournage du jour : « Montage Suédois ». Le scénario : deux inconnus se rencontrent en montant une armoire en kit. Le réalisateur veut que tu montes vraiment l'armoire. Il manque une vis. Ça fait 3 heures.",
        "Ton partenaire de scène est allergique au lubrifiant à la fraise. On ne l'a découvert qu'à la première prise. Il gonfle. Le réalisateur dit que « ça peut être une fétichisation intéressante ».",
        "Le producteur a eu une idée : une parodie inspirée par {w:show}. Tu dois jouer une scène torride dans un costume qui représente {w:animal}, avec une tête en mousse qui t'empêche de voir quoi que ce soit.",
        "Ta grand-mère t'appelle en pleine prise. Le réalisateur dit « Réponds, ça peut faire un bon gag. » Tu décroches. Elle te demande si tu as « bien mangé ». Tu es nu{|e} sur une table de billard.",
      ],
      en: [
        "Today's shoot: 'Swedish Assembly'. The script: two strangers meet while assembling a flat-pack wardrobe. The director wants you to really build it. A screw is missing. It's been 3 hours.",
        "Your scene partner is allergic to strawberry lube. Discovered on the first take. He's swelling. The director says it 'could be an interesting fetish angle'.",
        "The producer had an idea: a parody of {w:show}. You have to play a steamy scene dressed as {w:animal}, with a foam head that blocks your vision entirely.",
        "Your grandma calls mid-take. The director says 'Answer, it could be a good gag.' You pick up. She asks if you've 'eaten properly'. You're naked on a pool table.",
      ],
    },
    choices: [
      { label: { fr: 'Jouer le jeu à fond', en: 'Commit to the bit' }, out: [
        { w: 2, text: { fr: ["J'ai monté l'armoire, joué la scène et improvisé avec la clé Allen. Le film a gagné un prix dans un festival spécialisé : « Meilleure utilisation d'un meuble ». L'armoire est toujours debout. Elle est dans mon salon.", "Scène tournée en une prise, malgré la tête en mousse. Le film est devenu culte pour sa « dimension absurde ». On m'appelle « l'Artiste ». Je reçois des lettres de fans d'un genre très particulier."], en: ["I built the wardrobe, played the scene and improvised with the Allen key. The film won an award at a specialist festival: 'Best Use of Furniture'. The wardrobe still stands. It's in my living room.", "Scene done in one take, despite the foam head. The film became a cult hit for its 'absurdist dimension'. They call me 'the Artist'. I get fan mail of a very particular kind."] }, fx: { money: 1500, fame: 4, followers: 6000, promote: true }, mood: 'proud' },
        { w: 1, text: { fr: ["L'armoire s'est effondrée sur nous en pleine scène. Bosse, coupure, et une planche de pin plantée dans une fesse. Les urgences ont tout vu. L'infirmier m'a reconnu{|e}. Il a demandé un autographe.", "Ma grand-mère a tout entendu. Elle a dit « Ah. » puis « Couvre-toi, tu vas attraper froid. » Le réalisateur a gardé la prise. Ma grand-mère est créditée au générique. Elle ne le sait pas."], en: ["The wardrobe collapsed on us mid-scene. Bump, cut, and a pine plank stuck in one buttock. A&E saw everything. The nurse recognised me. He asked for an autograph.", "Grandma heard everything. She said 'Ah.' then 'Cover up, you'll catch cold.' The director kept the take. Grandma is in the end credits. She doesn't know."] }, fx: { health: -6, happy: -4, money: 600 }, mood: 'shock' },
      ] },
      { label: { fr: 'Exiger un vrai scénario', en: 'Demand a real script' }, text: { fr: ["J'ai exigé « de la motivation pour mon personnage ». Le réalisateur a soupiré et ajouté une réplique : « Il manque une vis. » J'ai joué ça comme du Shakespeare. Personne n'a compris, mais j'ai grandi en tant qu'artiste.", "J'ai demandé à lire le scénario. Il tenait sur un ticket de caisse. Au dos, il y avait la liste de courses du réalisateur. On a tourné la liste de courses. C'était mieux."], en: ["I demanded 'motivation for my character'. The director sighed and added one line: 'A screw is missing.' I played it like Shakespeare. Nobody understood, but I grew as an artist.", "I asked to read the script. It fit on a till receipt. On the back was the director's shopping list. We shot the shopping list. It was better."] }, fx: { perf: -2, smarts: 1, happy: 4 }, mood: 'neutral' },
    ],
  },
];
