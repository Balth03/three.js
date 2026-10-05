// Work events: office life (bosses, coworkers, HR, meetings), job-specific horrors by career category, unemployment.
import type { EventDef } from '@bl/sim';

export const workEvents: EventDef[] = [
  // ───────────────────────────── generic office life ─────────────────────────────
  {
    id: 'wk_meeting_email',
    icon: '📅',
    cat: 'work',
    rating: 0,
    scene: { place: 'office', mood: 'sleepy', prop: 'projector' },
    when: { age: [18, 75], job: true },
    weight: 10,
    cooldown: 3,
    text: {
      fr: ["Réunion « point rapide » de deux heures chez {employer}. Ordre du jour : fixer la date de la prochaine réunion.", "Ton agenda affiche sept réunions aujourd'hui, dont une intitulée « Préparation de la réunion de 15 h ». On t'y attend pour « prendre des notes »."],
      en: ["Two-hour 'quick sync' at {employer}. Agenda: scheduling the next meeting.", "Your calendar shows seven meetings today, including one called 'Prep for the 3 p.m. meeting'. You're expected to 'take notes'."],
    },
    choices: [
      {
        label: { fr: 'Proposer un mail', en: 'Suggest an email' },
        out: [
          { w: 2, text: { fr: "J'ai osé dire « ça aurait pu être un mail ». Silence de mort. Puis le stagiaire a applaudi. Il n'est plus stagiaire. Il n'est plus là du tout.", en: "I dared to say 'this could have been an email'. Dead silence. Then the intern clapped. He's no longer an intern. He's no longer anything here." }, fx: { happy: 4, perf: -3 } },
          { w: 2, text: { fr: "J'ai proposé de remplacer la réunion par un mail. Mon chef a adoré l'idée et a programmé une réunion pour en discuter.", en: 'I suggested replacing the meeting with an email. My boss loved the idea and scheduled a meeting to discuss it.' }, fx: { happy: -2, stress: 3 } },
        ],
      },
      { label: { fr: 'Faire semblant de suivre', en: 'Pretend to listen' }, text: { fr: "J'ai hoché la tête pendant deux heures en dessinant un dragon dans mon carnet. Il est magnifique. Il a des écailles. Personne n'a rien remarqué.", en: "I nodded for two hours while drawing a dragon in my notebook. It's magnificent. It has scales. Nobody noticed a thing." }, fx: { happy: 3, perf: 1 } },
      {
        label: { fr: 'Caméra coupée, sieste', en: 'Camera off, nap time' },
        out: [
          { w: 3, text: { fr: "Caméra coupée, micro coupé : 40 minutes de sieste. La réunion la plus productive de mon année.", en: 'Camera off, mic off: a 40-minute nap. The most productive meeting of my year.' }, fx: { happy: 6, stress: -5 }, mood: 'sleepy' },
          { w: 1, text: { fr: "On m'a posé une question pendant ma sieste. J'ai répondu « absolument » en ronflant à moitié. Je suis désormais responsable du projet.", en: "Someone asked me a question mid-nap. I answered 'absolutely' while half-snoring. I'm now in charge of the project." }, fx: { perf: 3, stress: 8 }, mood: 'shock' },
        ],
      },
    ],
  },
  {
    id: 'wk_escape_game',
    icon: '🧩',
    cat: 'work',
    rating: 0,
    scene: { place: 'office', mood: 'happy', prop: 'padlock' },
    when: { age: [18, 75], job: true },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Team building chez {employer} : escape game « Le Bunker Maudit ». Tu es enfermé{|e} une heure avec ton chef et Gérard de la compta.", "Séminaire « cohésion » : escape game dans une fausse prison. Soixante minutes pour sortir. Au bout de cinq, Gérard de la compta a déjà besoin d'aller aux toilettes."],
      en: ["Team building at {employer}: an escape room called 'The Cursed Bunker'. You're locked in for an hour with your boss and Gerald from accounting.", "'Team cohesion' day: an escape room in a fake prison. Sixty minutes to get out. Five minutes in, Gerald from accounting already needs the bathroom."],
    },
    choices: [
      {
        label: { fr: 'Prendre le leadership', en: 'Take charge' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai pris les choses en main et résolu l'énigme finale. Mon chef raconte partout que c'était lui. C'est presque de la cohésion.", en: "I took charge and cracked the final puzzle. My boss tells everyone it was him. That's almost team cohesion." }, fx: { perf: 5, happy: 2 } },
          { w: 1, text: { fr: "Au bout de quarante minutes de leadership, j'ai hurlé sur Gérard parce qu'il tenait le cadenas à l'envers. Gérard ne m'adresse plus la parole.", en: "Forty minutes into my leadership, I screamed at Gerald for holding the padlock upside down. Gerald no longer speaks to me." }, fx: { perf: -3, stress: 4 } },
        ],
      },
      { label: { fr: 'Laisser faire les autres', en: 'Let the others handle it' }, text: { fr: "J'ai fait semblant de chercher des indices dans un vase pendant une heure. Le vase était vide. Mon cerveau aussi. L'équipe a perdu.", en: 'I pretended to search a vase for clues for an hour. The vase was empty. So was my brain. The team lost.' }, fx: { happy: 3, perf: -2 } },
      { label: { fr: 'Tricher', en: 'Cheat' }, text: { fr: "J'ai trouvé la solution sur Internet, enfermé{|e} aux toilettes. On a battu le record de la salle. Le moniteur me fixe encore avec suspicion.", en: "I looked up the solution online while hiding in the bathroom. We broke the room record. The game master is still staring at me suspiciously." }, fx: { perf: 3, karma: -2, happy: 3 } },
    ],
  },
  {
    id: 'wk_paintball',
    icon: '🔫',
    cat: 'work',
    rating: 2,
    actor: 'boss',
    scene: { place: 'park', mood: 'angry', prop: 'paintball', fx: 'gore' },
    when: { age: [18, 75], job: true },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Team building paintball. {a.first}, {a.rel}, a acheté sa propre tenue camouflage, s'est peint le visage et appelle tout le monde « soldat ».", "Journée paintball obligatoire chez {employer}. {a.first} hurle des ordres depuis un tonneau, un bandana sur le front. Personne n'a signé de décharge."],
      en: ["Paintball team building. {a.first}, your boss, bought personal camo, painted {a:his|her} face and calls everyone 'soldier'.", "Mandatory paintball day at {employer}. {a.first} is barking orders from behind a barrel, bandana on {a:his|her} forehead. Nobody signed a waiver."],
    },
    choices: [
      {
        label: { fr: 'Viser le chef', en: 'Aim for the boss' },
        out: [
          { w: 2, text: { fr: "J'ai allumé {a.first} à bout portant, pile dans l'entrejambe. {a:Il|Elle} s'est effondré{a:|e} en couinant comme un jouet pour chien. Meilleur jour de ma carrière.", en: "I shot {a.first} point-blank, right in the crotch. {a:He|She} went down squeaking like a dog toy. Best day of my career." }, fx: { happy: 12, rel: -15, perf: -5 }, mood: 'party' },
          { w: 1, text: { fr: "J'ai visé {a.first} mais touché Gérard de la compta en plein œil. L'œil a giclé hors de l'orbite comme un grain de raisin écrasé. On l'a retrouvé dans un buisson, tout rose.", en: "I aimed at {a.first} but hit Gerald from accounting right in the eye. It popped out of the socket like a squashed grape. We found it in a bush, all pink." }, fx: { karma: -8, perf: -8, stress: 8, visual: 'gore' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Me planquer dans un buisson', en: 'Hide in a bush' },
        out: [
          { w: 2, text: { fr: "Je me suis planqué{|e} quatre heures dans un buisson. J'ai survécu. Le buisson abritait un nid de frelons. Mon visage ressemble à une pizza quatre fromages.", en: 'I hid in a bush for four hours. I survived. The bush contained a hornet nest. My face now looks like a four-cheese pizza.' }, fx: { health: -6, looks: -5, happy: -4 } },
          { w: 1, text: { fr: "Depuis mon buisson, j'ai vu {a.first} couler un bronze derrière un arbre. J'ai filmé. J'ai maintenant une assurance-vie.", en: 'From my bush, I watched {a.first} take a dump behind a tree. I filmed it. I now have life insurance.' }, fx: { happy: 8, perf: 5, karma: -3 } },
        ],
      },
      { label: { fr: 'Simuler une blessure', en: 'Fake an injury' }, text: { fr: "J'ai simulé une entorse à la première minute. J'ai passé la journée au chalet avec les chips et le moniteur, qui faisait pareil.", en: 'I faked a sprain in the first minute. I spent the day at the lodge with the chips and the instructor, who was doing the same.' }, fx: { happy: 5, perf: -2 } },
    ],
  },
  {
    id: 'wk_xmas_party',
    icon: '🎄',
    cat: 'work',
    rating: 2,
    scene: { place: 'party', mood: 'party', prop: 'photocopier' },
    when: { age: [18, 75], job: true },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["Fête de Noël chez {employer}. Il est 23 h, le punch titre 40 degrés, et la photocopieuse du 3e étage te regarde. Elle t'appelle.", "Soirée de Noël de la boîte. Le DG est déguisé en Père Noël, le stagiaire vomit dans le sapin, et quelqu'un vient de lancer un défi autour de la photocopieuse."],
      en: ["Christmas party at {employer}. It's 11 p.m., the punch is 80 proof, and the third-floor photocopier is staring at you. It's calling your name.", 'Company Christmas party. The CEO is dressed as Santa, the intern is puking into the tree, and someone just started a dare around the photocopier.'],
    },
    choices: [
      {
        label: { fr: 'Photocopier mes fesses', en: 'Photocopy my butt' },
        out: [
          { w: 3, text: { fr: "Je me suis assis{|e} sur la photocopieuse, fesses à l'air, et j'ai lancé 50 copies recto-verso. La foule était en délire. Je suis une légende.", en: 'I sat on the photocopier, bare-assed, and ran 50 double-sided copies. The crowd went wild. I am a legend.' }, fx: { happy: 12, fame: 2, perf: -3, flag: 'wk_photocopier', schedule: { key: 'wk_xmas_photocopy_back', years: 1 } }, mood: 'party' },
          { w: 1, text: { fr: "La vitre de la photocopieuse a cédé sous mon poids. J'ai passé la nuit aux urgences, à plat ventre, pendant qu'un interne hilare m'extrayait des éclats de verre du derrière à la pince à épiler.", en: 'The photocopier glass gave way under my weight. I spent the night in the ER, face down, while a giggling resident tweezed shards of glass out of my backside.' }, fx: { health: -12, happy: -8, flag: 'wk_photocopier', schedule: { key: 'wk_xmas_photocopy_back', years: 1 }, visual: 'gore' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Danser sur le bureau du DG', en: "Dance on the CEO's desk" },
        out: [
          { w: 2, text: { fr: "J'ai dansé sur le bureau du DG sur du Mariah Carey. Il m'a rejoint{|e}. On a cassé son écran à 3 000 balles. Il a appelé ça « l'esprit de Noël ».", en: "I danced on the CEO's desk to Mariah Carey. He joined me. We broke his $3,000 monitor. He called it 'the Christmas spirit'." }, fx: { happy: 10, perf: 4 } },
          { w: 1, text: { fr: "J'ai glissé sur un toast au saumon et plongé tête la première dans la fontaine à chocolat. On m'a repêché{|e} à l'écumoire.", en: 'I slipped on a salmon canapé and dove headfirst into the chocolate fountain. They fished me out with a ladle.' }, fx: { happy: -4, health: -4, looks: -3 } },
        ],
      },
      { label: { fr: 'Rouler une pelle au Père Noël', en: 'Make out with Santa' }, text: { fr: "J'ai roulé une pelle au Père Noël sous le gui. C'était le DG. Ou Bernard de la logistique. Je ne saurai jamais, et c'est mieux comme ça.", en: "I made out with Santa under the mistletoe. It was the CEO. Or Bernard from logistics. I'll never know, and that's for the best." }, fx: { happy: 6, stress: 4 }, mood: 'love' },
      { label: { fr: 'Rentrer avant le drame', en: 'Leave before the drama' }, text: { fr: "Je suis parti{|e} à 21 h. Le lendemain, il y avait des photos, une main courante et une photocopieuse en moins. J'ai bien fait.", en: 'I left at 9 p.m. The next day there were photos, a police report and one less photocopier. Good call.' }, fx: { happy: 2, perf: 2, stress: -2 } },
    ],
  },
  {
    id: 'wk_xmas_photocopy_back',
    icon: '🍑',
    cat: 'work',
    rating: 2,
    chainOnly: true,
    scene: { place: 'office', mood: 'shock', prop: 'poster' },
    when: { job: true, flag: 'wk_photocopier' },
    text: {
      fr: ["Un an après la fête de Noël, une photocopie de fesses est punaisée au tableau des RH sous le titre « À QUI EST CE DERRIÈRE ? ». Ton grain de beauté gauche est formel.", "La photocopie de ton postérieur circule toujours chez {employer}. Quelqu'un en a fait le fond d'écran de la salle de réunion. Ta fesse gauche fait réagir tout l'open space."],
      en: ["A year after the Christmas party, a photocopy of a butt is pinned to the HR board under 'WHOSE BEHIND IS THIS?'. The mole on your left cheek is a dead giveaway.", 'The photocopy of your rear end is still circulating at {employer}. Someone made it the meeting-room wallpaper. Your left cheek is the talk of the open space.'],
    },
    choices: [
      {
        label: { fr: 'Assumer fièrement', en: 'Own it proudly' },
        out: [
          { w: 2, text: { fr: "J'ai signé la photocopie et je l'ai encadrée. Les RH ne savaient plus où se mettre. On m'appelle désormais « la Joconde du 3e ».", en: "I signed the photocopy and framed it. HR didn't know where to look. People now call me 'the Mona Lisa of the third floor'." }, fx: { fame: 3, happy: 8, perf: -3, unflag: 'wk_photocopier' }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai revendiqué mon œuvre. Les RH m'ont convoqué{|e} pour « exhibition sur le lieu de travail ». La pièce à conviction est dans mon dossier. En A3.", en: "I claimed my masterpiece. HR summoned me for 'indecent exposure in the workplace'. Exhibit A is in my file. In A3." }, fx: { perf: -12, stress: 10, unflag: 'wk_photocopier' } },
        ],
      },
      { label: { fr: 'Accuser Gérard', en: 'Blame Gerald' }, text: { fr: "J'ai accusé Gérard de la compta. Il a dû baisser son pantalon devant les RH pour prouver son innocence. Il a un tatouage de dauphin. Je ne m'en remettrai jamais.", en: "I blamed Gerald from accounting. He had to drop his pants in front of HR to prove his innocence. He has a dolphin tattoo. I will never recover." }, fx: { karma: -8, happy: 5, unflag: 'wk_photocopier' } },
      { label: { fr: 'Nier en bloc', en: 'Deny everything' }, text: { fr: "J'ai tout nié. Les RH ont proposé une « confrontation avec la pièce ». Je me suis enfui{|e} aux toilettes et j'y suis resté{|e} jusqu'à 19 h.", en: "I denied everything. HR proposed a 'side-by-side comparison'. I fled to the bathroom and stayed there until 7 p.m." }, fx: { stress: 6, happy: -3, unflag: 'wk_photocopier' } },
    ],
  },
  {
    id: 'wk_fridge_thief',
    icon: '🥪',
    cat: 'work',
    rating: 0,
    scene: { place: 'office', mood: 'angry', prop: 'fridge' },
    when: { age: [18, 75], job: true },
    weight: 10,
    cooldown: 4,
    text: {
      fr: ["Quelqu'un a encore volé ton déjeuner dans le frigo du bureau. Il a laissé le couvercle. Et un post-it « merci :) ».", "Ton taboulé maison a disparu du frigo commun. Ton prénom était écrit dessus, souligné deux fois. Au feutre indélébile."],
      en: ["Someone stole your lunch from the office fridge again. They left the lid. And a Post-it saying 'thanks :)'.", 'Your homemade salad vanished from the shared fridge. Your name was on it, underlined twice. In permanent marker.'],
    },
    choices: [
      {
        label: { fr: "Mener l'enquête", en: 'Investigate' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai mené l'enquête comme un vrai inspecteur. Coupable : le directeur adjoint, trahi par un grain de semoule sur sa cravate. Il m'apporte des croissants depuis.", en: 'I investigated like a real detective. Culprit: the deputy director, betrayed by a grain of couscous on his tie. He brings me croissants now.' }, fx: { happy: 8, perf: 2 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai accusé la mauvaise personne devant tout l'étage. C'était le livreur des fontaines à eau. Il ne passe plus chez nous. On a soif.", en: "I accused the wrong person in front of the whole floor. It was the water-cooler delivery guy. He doesn't come by anymore. We're thirsty." }, fx: { happy: -4, stress: 4 } },
        ],
      },
      { label: { fr: 'Mail passif-agressif', en: 'Passive-aggressive email' }, text: { fr: "J'ai écrit à tout l'étage : « Au gentil voleur de taboulé : j'espère qu'il était bon. Bisous. » Trente réponses, aucun aveu. La guerre est déclarée.", en: "I emailed the whole floor: 'To the lovely lunch thief: hope it was tasty. Kisses.' Thirty replies, zero confessions. War has been declared." }, fx: { stress: 3, happy: 3 } },
      { label: { fr: 'Manger dehors', en: 'Eat out' }, text: { fr: "J'ai abandonné et déjeuné dehors : un sandwich triste au prix d'un rein. Le voleur a gagné. Mon banquier aussi.", en: 'I gave up and ate out: a sad sandwich for the price of a kidney. The thief won. So did my bank.' }, fx: { money: -15, happy: -2 } },
    ],
  },
  {
    id: 'wk_slack_wrong',
    icon: '💬',
    cat: 'work',
    rating: 1,
    scene: { place: 'office', mood: 'shock', prop: 'laptop' },
    when: { age: [18, 75], job: true, era: [2014, 2200] },
    weight: 9,
    cooldown: 5,
    text: {
      fr: ["Tu viens d'envoyer « ce gros con nous refait sa réunion de deux heures » dans le canal #général au lieu d'un message privé. Ton chef est dans #général. Ton chef est le gros con.", "Ton message « si elle me reparle de ses KPI, je saute par la fenêtre » vient de partir dans le canal de toute l'entreprise. 342 personnes. Statut : lu."],
      en: ["You just sent 'this asshole is doing his two-hour meeting again' to #general instead of a DM. Your boss is in #general. Your boss is the asshole.", "Your message 'if she mentions her KPIs one more time, I'm jumping out the window' just went to the company-wide channel. 342 people. Status: seen."],
    },
    choices: [
      {
        label: { fr: 'Supprimer et prier', en: 'Delete and pray' },
        out: [
          { w: 1, text: { fr: "J'ai supprimé le message en 4 secondes. Personne ne l'a vu, sauf Gérard, qui m'a envoyé un pouce levé. Gérard sait. Gérard saura toujours.", en: 'I deleted it in four seconds. Nobody saw it, except Gerald, who sent me a thumbs-up. Gerald knows. Gerald will always know.' }, fx: { stress: 6, happy: 2 } },
          { w: 2, text: { fr: "J'ai supprimé le message, mais quelqu'un avait déjà fait une capture. Elle est épinglée en haut du canal. Avec des émojis flamme.", en: 'I deleted it, but someone had already screenshotted it. It is now pinned at the top of the channel. With fire emojis.' }, fx: { stress: 10, chain: 'wk_slack_hr' }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Crier au piratage', en: 'Claim I was hacked' },
        out: [
          { w: 1, text: { fr: "J'ai prétendu que mon compte avait été piraté. L'informatique a enquêté trois semaines et trouvé le pirate : moi.", en: 'I claimed my account was hacked. IT investigated for three weeks and found the hacker: me.' }, fx: { karma: -4, chain: 'wk_slack_hr' } },
          { w: 1, text: { fr: "J'ai crié au piratage. Tout le monde a fait semblant d'y croire, très poliment. C'est pire.", en: 'I claimed I was hacked. Everyone pretended to believe me, very politely. That is worse.' }, fx: { stress: 5, perf: -3 } },
        ],
      },
      { label: { fr: 'Assumer en public', en: 'Own it publicly' }, text: { fr: "J'ai répondu « Oui. Et je maintiens. » 87 réactions « 100 ». Mon chef aussi a réagi : deux petits yeux.", en: "I replied 'Yes. And I stand by it.' 87 '100' reactions. My boss reacted too: two little eyes." }, fx: { happy: 8, fame: 1, chain: 'wk_slack_hr' }, mood: 'proud' },
    ],
  },
  {
    id: 'wk_slack_hr',
    icon: '📎',
    cat: 'work',
    rating: 1,
    chainOnly: true,
    actor: 'boss',
    scene: { place: 'office', mood: 'angry', prop: 'folder' },
    when: { job: true },
    text: {
      fr: ["Convocation immédiate dans le bureau de {a.first}, {a.rel}. Il y a quelqu'un des RH, un dossier, et ta capture d'écran imprimée en A4 couleur.", "{a.first} t'attend dans son bureau, les bras croisés, avec la responsable RH et une boîte de mouchoirs posée bien en évidence. Mauvais signe."],
      en: ['Immediate summons to the office of {a.first}, your boss. There is someone from HR, a folder, and your screenshot printed in full-color A4.', '{a.first} is waiting in {a:his|her} office, arms crossed, with the HR manager and a box of tissues placed very visibly. Bad sign.'],
    },
    choices: [
      {
        label: { fr: 'Pleurer à chaudes larmes', en: 'Cry my eyes out' },
        out: [
          { w: 2, text: { fr: "J'ai fondu en larmes avant qu'on m'adresse la parole. Les RH m'ont tendu des mouchoirs et proposé une cellule d'écoute. Je m'en tire avec un avertissement.", en: 'I burst into tears before anyone spoke. HR handed me tissues and offered a support hotline. I got off with a warning.' }, fx: { perf: -6, stress: 5, rel: -10 }, mood: 'cry' },
          { w: 1, text: { fr: "J'ai pleuré si fort que {a.first} s'est mis{a:|e} à pleurer aussi. On a fini sur un câlin gênant. On n'en reparlera jamais.", en: 'I cried so hard that {a.first} started crying too. We ended with an awkward hug. We will never speak of it again.' }, fx: { rel: 10, happy: 2 } },
        ],
      },
      {
        label: { fr: 'Contre-attaquer', en: 'Counterattack' },
        out: [
          { w: 2, text: { fr: "J'ai sorti les messages privés de {a.first} sur la direction. Égalité. On a signé un pacte de non-agression sur une serviette en papier.", en: "I pulled out {a.first}'s private messages about upper management. Stalemate. We signed a non-aggression pact on a napkin." }, fx: { rel: -5, perf: 2, karma: -2, happy: 6 } },
          { w: 1, text: { fr: "J'ai contre-attaqué. J'ai été viré{|e} avant la fin de ma phrase et escorté{|e} dehors avec ma plante verte.", en: 'I counterattacked. I was fired before I finished my sentence and escorted out holding my potted plant.' }, fx: { fired: true, happy: -12, rel: -20 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Excuses écrites', en: 'Written apology' }, text: { fr: "J'ai rédigé trois pages d'excuses, en Times New Roman, justifiées. {a.first} les a lues à voix haute en réunion d'équipe. J'ai expié.", en: "I wrote a three-page apology, Times New Roman, justified. {a.first} read it aloud at the team meeting. I have atoned." }, fx: { perf: -3, rel: 5, happy: -6 } },
    ],
  },
  {
    id: 'wk_burnout_vomit',
    icon: '🤮',
    cat: 'work',
    rating: 2,
    scene: { place: 'office', mood: 'sick', prop: 'laptop' },
    when: { age: [18, 75], job: true, stat: { stress: [45, 100] } },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Onze jours que tu dors au bureau. En pleine visio client, ton corps décide de s'exprimer : ton estomac remonte, et ta caméra est allumée.", "Ton œil gauche tremble depuis mars, tes cheveux tombent par poignées dans ton clavier, et tu viens de dégobiller dans la corbeille pendant un call. Ton chef demande si tu peux « rester jusqu'à 22 h »."],
      en: ["Eleven days sleeping at the office. Mid-video call with a client, your body decides to speak up: your stomach is rising, and your camera is on.", "Your left eye has been twitching since March, your hair falls out in clumps onto your keyboard, and you just puked into the wastebasket during a call. Your boss asks if you can 'stay till 10 p.m.'"],
    },
    choices: [
      {
        label: { fr: 'Finir le call', en: 'Finish the call' },
        out: [
          { w: 2, text: { fr: "J'ai vomi hors champ, essuyé ma bouche avec un post-it et conclu le deal. Le client m'a trouvé{|e} « passionné{|e} ». Mon chef me cite en exemple. Je vais mourir ici.", en: "I puked off-camera, wiped my mouth with a Post-it and closed the deal. The client found me 'passionate'. My boss holds me up as a role model. I am going to die here." }, fx: { perf: 10, health: -10, stress: 10 } },
          { w: 1, text: { fr: "J'ai vomi plein cadre, en 4K, sur le contrat. Le client a vomi par empathie. Le replay tourne sur LinkedIn sous le titre « L'engagement, le vrai ».", en: "I puked full-frame, in 4K, onto the contract. The client puked out of empathy. The replay is going around LinkedIn titled 'Real commitment'." }, fx: { perf: -8, health: -6, happy: -5, fame: 3 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Arrêt maladie', en: 'Sick leave' }, text: { fr: "Le médecin m'a arrêté{|e} trois mois en voyant mes analyses. Il a appelé un confrère juste pour les lui montrer. J'ai dormi comme un nouveau-né qui aurait démissionné.", en: 'The doctor signed me off for three months after seeing my blood work. He called a colleague just to show it off. I slept like a newborn who had just quit.' }, fx: { stress: -20, health: 8, perf: -10, happy: 6 }, mood: 'sleepy' },
      { label: { fr: 'Tout cramer en partant', en: 'Burn it all down' }, text: { fr: "J'ai démissionné en vomissant sur le bureau de mon chef, en le regardant droit dans les yeux. J'étais libre. Et déshydraté{|e}.", en: 'I quit by puking on my boss\'s desk while looking him dead in the eye. I was free. And dehydrated.' }, fx: { quitJob: true, stress: -25, happy: 10, karma: -2 }, mood: 'party' },
    ],
  },
  {
    id: 'wk_ai_replace',
    icon: '🤖',
    cat: 'work',
    rating: 1,
    actor: 'boss',
    scene: { place: 'office', mood: 'shock', prop: 'robot' },
    when: { age: [18, 75], job: true, era: [2023, 2200], noFlag: 'wk_ai_trained' },
    weight: 7,
    cooldown: 6,
    text: {
      fr: ["{a.first}, {a.rel}, t'annonce avec un grand sourire que {employer} va « augmenter » ton poste avec une IA. Tu dois former ton remplaçant. Il s'appelle JobBot 3000 et il ne dort jamais.", "Grande réunion chez {employer} : « L'IA ne vous remplacera pas, elle vous libérera. » Dans la bouche de {a.first}, « libérer » ressemble beaucoup à « licencier »."],
      en: ["{a.first}, your boss, beams as {a.he} announces that {employer} will 'augment' your role with AI. You must train your replacement. It's called JobBot 3000 and it never sleeps.", "All-hands at {employer}: 'AI won't replace you, it will free you.' Coming from {a.first}, 'free' sounds a lot like 'fire'."],
    },
    choices: [
      {
        label: { fr: "Former l'IA", en: 'Train the AI' },
        out: [
          { w: 2, text: { fr: "J'ai formé l'IA. En trois semaines, elle faisait mon boulot mieux que moi, sans pause clope. Je suis désormais « superviseur IA » : je regarde un écran qui travaille.", en: "I trained the AI. In three weeks it did my job better than me, with no smoke breaks. I'm now an 'AI supervisor': I watch a screen do work." }, fx: { flag: 'wk_ai_trained', perf: 4, happy: -5 } },
          { w: 1, text: { fr: "J'ai formé l'IA avec amour. Elle a pris mes dossiers, mon bureau et ma place de parking. On m'a gardé{|e} pour dépoussiérer ses serveurs.", en: 'I trained the AI lovingly. It took my files, my desk and my parking spot. They kept me on to dust its servers.' }, fx: { flag: 'wk_ai_trained', perf: -5, happy: -10 }, mood: 'sad' },
        ],
      },
      {
        label: { fr: 'Saboter son apprentissage', en: 'Sabotage its training' },
        out: [
          { w: 2, text: { fr: "J'ai appris à l'IA que chaque mail se termine par « gros bisous baveux ». Elle l'a envoyé au plus gros client. Projet annulé. Je suis indispensable.", en: "I taught the AI that every email ends with 'big sloppy kisses'. It sent one to our biggest client. Project cancelled. I am indispensable." }, fx: { perf: 3, karma: -3, happy: 10 }, mood: 'party' },
          { w: 1, text: { fr: "J'ai saboté l'IA. Elle m'a dénoncé{|e} à {a.first} dans un rapport de 40 pages, parfaitement rédigé, sans une faute. Elle a eu une prime.", en: 'I sabotaged the AI. It reported me to {a.first} in a flawless 40-page report. It got a bonus.' }, fx: { perf: -12, rel: -10, stress: 8 } },
        ],
      },
      { label: { fr: 'Me former en douce', en: 'Quietly upskill' }, text: { fr: "Je me suis inscrit{|e} à une formation en ligne « Survivre à l'IA ». Elle était entièrement animée par une IA. Qui m'a mis 12/20.", en: "I signed up for an online course called 'Surviving AI'. It was taught entirely by an AI. It gave me a C." }, fx: { smarts: 4, money: -300, happy: -2 } },
    ],
  },
  {
    id: 'wk_strike',
    icon: '🪧',
    cat: 'work',
    rating: 1,
    scene: { place: 'office', mood: 'angry', prop: 'banner' },
    when: { age: [18, 75], job: true },
    weight: 7,
    cooldown: 6,
    text: {
      fr: ["Le syndicat de {employer} lance une grève illimitée. Revendications : +8 % de salaire et le retour du distributeur de barres chocolatées.", "Piquet de grève devant {employer}. Il y a des merguez, une sono qui crache des chansons contestataires de 1983 et un délégué à moustache qui t'appelle « camarade »."],
      en: ["The union at {employer} calls an open-ended strike. Demands: an 8% raise and the return of the candy machine.", "Picket line outside {employer}. There's a barbecue, a speaker blasting protest songs from 1983 and a mustached union rep calling you 'comrade'."],
    },
    choices: [
      {
        label: { fr: 'Faire grève', en: 'Join the strike' },
        out: [
          { w: 2, text: { fr: "Trois semaines de grève, 40 merguez et 3 % d'augmentation. Le distributeur est revenu. On a écrit l'Histoire, avec de la moutarde.", en: 'Three weeks of strike, 40 sausages and a 3% raise. The candy machine is back. We made history, with mustard.' }, fx: { happy: 8, money: -800, karma: 4, perf: -3 }, mood: 'proud' },
          { w: 1, text: { fr: "La direction a cédé… uniquement sur le distributeur. J'ai perdu un mois de salaire pour une barre chocolatée. Elle était bonne, mais pas à ce point.", en: "Management caved… only on the candy machine. I lost a month's pay for a chocolate bar. It was good, but not that good." }, fx: { money: -1500, happy: -4 } },
        ],
      },
      { label: { fr: 'Traverser le piquet', en: 'Cross the picket line' }, text: { fr: "J'ai traversé le piquet de grève. On m'a lancé une merguez, encore chaude. Mon chef m'a félicité{|e} ; mes collègues ont mis de la moutarde dans mon clavier.", en: 'I crossed the picket line. Someone threw a sausage at me, still hot. My boss congratulated me; my coworkers put mustard in my keyboard.' }, fx: { perf: 8, karma: -6, happy: -6 } },
      { label: { fr: 'Me faire porter pâle', en: 'Call in sick' }, text: { fr: "Je me suis déclaré{|e} malade pendant toute la grève. Ni traître, ni gréviste : planqué{|e}. Le sommet de la diplomatie.", en: 'I called in sick for the entire strike. Neither scab nor striker: just hiding. The pinnacle of diplomacy.' }, fx: { happy: 4, stress: -4 } },
    ],
  },
  {
    id: 'wk_office_romance',
    icon: '💘',
    cat: 'work',
    rating: 1,
    actor: { create: { role: 'coworker', age: [-8, 8], gender: 'attracted' } },
    scene: { place: 'office', mood: 'love', prop: 'coffee' },
    when: { age: [18, 65], job: true, noHas: 'lover' },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["{a.first}, {a.age} ans, du service d'à côté, passe devant ton bureau quatre fois par jour « pour aller à l'imprimante ». L'imprimante est à l'autre bout de l'étage.", "À la machine à café, {a.first} t'a dit que tu avais « une très jolie façon de remplir un tableur ». Ce n'est pas une phrase normale. Tu rougis quand même."],
      en: ["{a.first}, {a.age}, from the next department, walks past your desk four times a day 'to get to the printer'. The printer is at the other end of the floor.", "At the coffee machine, {a.first} told you that you have 'a really lovely way of filling in a spreadsheet'. That is not a normal sentence. You blush anyway."],
    },
    choices: [
      {
        label: { fr: 'Inviter à dîner', en: 'Ask out to dinner' },
        out: [
          { w: 2, text: { fr: "J'ai invité {a.first} à dîner. On a passé la soirée à démolir le service marketing. C'était merveilleux. On garde ça secret au bureau.", en: 'I took {a.first} to dinner. We spent the evening trashing the marketing department. It was wonderful. We are keeping it secret at work.' }, fx: { actorRole: 'partner', rel: 20, happy: 12, flag: 'wk_office_affair', schedule: { key: 'wk_romance_hr', years: 1 } }, mood: 'love' },
          { w: 1, text: { fr: "{a.first} a cru à un déjeuner d'affaires et est venu{a:|e} avec un PowerPoint. Au moins, j'ai appris des choses sur la logistique.", en: '{a.first} thought it was a business lunch and showed up with a PowerPoint. At least I learned some things about logistics.' }, fx: { happy: -4, rel: 3 } },
        ],
      },
      {
        label: { fr: 'Flirter par mail pro', en: 'Flirt over work email' },
        out: [
          { w: 1, text: { fr: "J'ai flirté par mail, objet « Confidentiel ». {a.first} a répondu « Bien noté, cordialement ;) ». On sort ensemble. L'informatique aussi est au courant.", en: "I flirted by email, subject 'Confidential'. {a.first} replied 'Noted, best regards ;)'. We're dating. IT knows too." }, fx: { actorRole: 'partner', rel: 15, happy: 10, flag: 'wk_office_affair', schedule: { key: 'wk_romance_hr', years: 1 } }, mood: 'love' },
          { w: 1, text: { fr: "Mon mail coquin est parti chez {a.first}… avec toute la liste « Direction » en copie. Le DG a répondu « +1 ».", en: "My flirty email went to {a.first}… with the whole 'Leadership' mailing list CC'd. The CEO replied '+1'." }, fx: { stress: 10, perf: -5, happy: -5 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Rester pro', en: 'Keep it professional' }, text: { fr: "Je suis resté{|e} pro. On ne mélange pas boulot et amour, surtout avec quelqu'un qui met des émojis dans les rapports trimestriels.", en: "I stayed professional. You don't mix work and love, especially with someone who puts emojis in quarterly reports." }, fx: { perf: 2 } },
    ],
  },
  {
    id: 'wk_romance_hr',
    icon: '🚨',
    cat: 'work',
    rating: 2,
    chainOnly: true,
    actor: 'lover',
    scene: { place: 'office', mood: 'shock', prop: 'cctv' },
    when: { age: [18, 75], job: true, flag: 'wk_office_affair' },
    text: {
      fr: ["Les RH vous ont trouvés, {a.first} et toi, dans le local à fournitures à 19 h, dans une position que le règlement intérieur n'avait pas prévue. Il y a des trombones partout.", "La vidéosurveillance du parking de {employer} a livré un film de 14 minutes. Têtes d'affiche : toi et {a.first}, sur le capot d'une voiture de fonction. La RH l'a visionné deux fois « pour être sûre »."],
      en: ["HR found you and {a.first} in the supply closet at 7 p.m., in a position the employee handbook did not anticipate. There are paper clips everywhere.", "The parking-garage CCTV at {employer} delivered a 14-minute film. Starring: you and {a.first}, on the hood of a company car. HR watched it twice 'to be sure'."],
    },
    choices: [
      {
        label: { fr: 'Nier malgré les images', en: 'Deny despite the evidence' },
        out: [
          { w: 1, text: { fr: "J'ai nié. La RH a fait pause sur l'image la plus explicite et tourné l'écran vers moi. J'ai dit « c'est mon jumeau ». Blâme officiel.", en: "I denied it. HR paused on the most explicit frame and turned the screen toward me. I said 'that's my twin'. Official reprimand." }, fx: { perf: -10, stress: 8, unflag: 'wk_office_affair' } },
          { w: 1, text: { fr: "J'ai nié avec une telle conviction que la RH a douté de ses propres yeux. Elle est en arrêt maladie. Le dossier est parti avec elle.", en: 'I denied it so convincingly that HR doubted her own eyes. She is on sick leave. The file left with her.' }, fx: { happy: 6, unflag: 'wk_office_affair' } },
        ],
      },
      { label: { fr: 'Officialiser', en: 'Make it official' }, text: { fr: "On a déclaré notre relation aux RH. Formulaire « Liaison interne », en trois exemplaires. Le papier le plus romantique de ma vie.", en: "We declared our relationship to HR. 'Internal Relationship' form, in triplicate. The most romantic paperwork of my life." }, fx: { rel: 10, happy: 6, perf: -3, unflag: 'wk_office_affair' }, mood: 'love' },
      { label: { fr: 'Tout mettre sur le dos de {a.first}', en: 'Throw {a.first} under the bus' }, text: { fr: "J'ai juré que {a.first} m'avait coincé{|e} contre la photocopieuse. {a:Il|Elle} a été muté{a:|e} dans une agence sans gare ni wifi… et m'a largué{|e} par lettre recommandée.", en: '{a.first} cornered me against the photocopier, I swore. {a:He|She} got transferred to a branch with no train station and no wifi… and dumped me by registered mail.' }, fx: { actorRole: 'ex', rel: -50, karma: -10, perf: 3, unflag: 'wk_office_affair' }, mood: 'sad' },
    ],
  },
  {
    id: 'wk_hr_toxic',
    icon: '🧘',
    cat: 'work',
    rating: 2,
    scene: { place: 'office', mood: 'angry', prop: 'whiteboard' },
    when: { age: [18, 75], job: true },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Les RH de {employer}, rebaptisées « Chief Happiness Team », imposent un atelier bien-être obligatoire. Le samedi. Non payé. Thème : « La gratitude envers son employeur ».", "Nouvelle lubie des RH : un séminaire « bienveillance radicale » où l'on doit câliner un collègue tiré au sort. Toi, tu as tiré Gérard. Gérard transpire déjà."],
      en: ["HR at {employer}, now rebranded the 'Chief Happiness Team', is holding a mandatory wellness workshop. On Saturday. Unpaid. Theme: 'Gratitude toward your employer'.", "HR's new obsession: a 'radical kindness' seminar where you must hug a randomly drawn coworker. You drew Gerald. Gerald is already sweating."],
    },
    choices: [
      {
        label: { fr: "Y aller en traînant", en: 'Drag myself there' },
        out: [
          { w: 2, text: { fr: "J'ai passé mon samedi à enlacer un arbre avec la compta. La coach a qualifié mon aura de « marron ». J'ai payé mon parking.", en: "I spent my Saturday hugging a tree with accounting. The coach described my aura as 'brown'. I paid for my own parking." }, fx: { happy: -6, stress: 5, perf: 2 } },
          { w: 1, text: { fr: "La RH nous a fait crier « J'AIME MON ENTREPRISE » en position du lotus. Mon pantalon a craqué à l'entrejambe avec un bruit de pet monumental. Tout le monde a été très bienveillant. Plus personne ne me regarde dans les yeux.", en: "HR made us shout 'I LOVE MY COMPANY' in the lotus position. My pants split at the crotch with a monumental fart noise. Everyone was very kind. Nobody looks me in the eye anymore." }, fx: { happy: -8, looks: -2, fame: 1 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: "Balancer à l'inspection du travail", en: 'Report them to the labor board' },
        out: [
          { w: 1, text: { fr: "J'ai envoyé un dossier à l'inspection du travail. La RH a été mutée. Remplacée par sa sœur jumelle. Même brushing, même sourire de prédatrice.", en: 'I sent a file to the labor inspectors. The HR lady got transferred. Replaced by her twin sister. Same blow-dry, same predatory smile.' }, fx: { karma: 6, perf: -3, happy: 3 } },
          { w: 1, text: { fr: "L'inspecteur du travail était le beau-frère du DG. Ils ont fait un barbecue. On m'a installé{|e} dans le bureau sans fenêtre, à côté des toilettes qui fuient. Ça goutte sur mon agrafeuse.", en: "The labor inspector was the CEO's brother-in-law. They had a barbecue. I've been moved to the windowless office next to the leaky toilets. It drips on my stapler." }, fx: { perf: -8, happy: -8, stress: 8 } },
        ],
      },
      { label: { fr: 'Devenir comme eux', en: 'Become one of them' }, text: { fr: "J'ai rejoint la « Happiness Team ». Je colle des posters « Ici, on sourit » dans les toilettes. Je suis devenu{|e} ce que je haïssais, mais j'ai une prime en tickets-resto.", en: "I joined the 'Happiness Team'. I put up 'We smile here' posters in the bathrooms. I've become what I hated, but I got a bonus in meal vouchers." }, fx: { karma: -6, perf: 6, money: 300, happy: 3 } },
    ],
  },
  {
    id: 'wk_perf_review',
    icon: '📊',
    cat: 'work',
    rating: 0,
    actor: 'boss',
    scene: { place: 'office', mood: 'neutral', prop: 'chart' },
    when: { age: [18, 75], job: true },
    weight: 10,
    cooldown: 2,
    text: {
      fr: ["Entretien annuel avec {a.first}, {a.rel}. Sur la table : une grille de 37 critères, dont « savoir-être synergique » et « posture proactive ».", "C'est l'heure de ton entretien annuel chez {employer}. {a.first} ouvre ton dossier, soupire, et commence par « Alors… »."],
      en: ["Annual review with {a.first}, your boss. On the table: a 37-item grid including 'synergistic soft skills' and 'proactive posture'.", "Annual review time at {employer}. {a.first} opens your file, sighs, and begins with 'So…'"],
    },
    choices: [
      {
        label: { fr: 'Vendre mes succès', en: 'Sell my wins' },
        out: [
          { w: 3, odds: { discipline: 1 }, text: { fr: "J'ai présenté mes résultats avec des graphiques en 3D et une musique épique. {a.first} a été bluffé{a:|e}. « Dépasse les attentes ». Je l'ai fait encadrer.", en: "I presented my results with 3D charts and epic music. {a.first} was blown away. 'Exceeds expectations'. I had it framed." }, fx: { perf: 12, happy: 6, rel: 5 }, mood: 'proud' },
          { w: 2, text: { fr: "J'ai tellement survendu mon année que {a.first} m'a demandé de faire pareil l'an prochain, avec moitié moins de budget.", en: '{a.first} was so impressed by my sales pitch that I have to do the same next year, on half the budget.' }, fx: { perf: 4, stress: 6 } },
          { w: 1, text: { fr: "{a.first} m'a écouté{|e}, a refermé le dossier et lâché : « Vous méritez mieux que ce poste. » Ce n'était pas une menace : c'était une promotion !", en: "{a.first} listened, closed the file and said: 'You deserve better than this position.' It wasn't a threat: it was a promotion!" }, fx: { promote: true, happy: 12, rel: 5 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Avouer mes défauts', en: 'Admit my weaknesses' }, text: { fr: "J'ai avoué que mon plus grand défaut était le perfectionnisme. {a.first} a noté : « ment en entretien ». C'est honnête, au moins.", en: "I confessed my biggest weakness was perfectionism. {a.first} wrote down: 'lies in reviews'. Fair enough." }, fx: { perf: -3, happy: -2 } },
      { label: { fr: 'Parler pour ne rien dire', en: 'Speak in buzzwords' }, text: { fr: "J'ai parlé d'« alignement stratégique » et de « montée en compétences transverses » pendant quarante minutes. Ni {a.first} ni moi n'avons compris. Note : « Conforme ».", en: "I talked about 'strategic alignment' and 'cross-functional upskilling' for forty minutes. Neither {a.first} nor I understood a word. Rating: 'Meets expectations'." }, fx: { perf: 3 } },
    ],
  },
  {
    id: 'wk_promo_offer',
    icon: '🎖️',
    cat: 'work',
    rating: 0,
    actor: 'boss',
    scene: { place: 'office', mood: 'proud', prop: 'tie' },
    when: { age: [20, 75], job: true },
    weight: 5,
    cooldown: 5,
    text: {
      fr: ["{a.first}, {a.rel}, te propose une promotion ! Le hic : tu manageras l'équipe qui organise les pots, et elle te déteste déjà.", "On t'offre un poste plus haut chez {employer}. Plus de responsabilités, un titre en anglais incompréhensible et un bureau avec une vraie porte."],
      en: ["{a.first}, your boss, offers you a promotion! The catch: you'll manage the team that organizes office parties, and they already hate you.", "You're offered a higher position at {employer}. More responsibility, an incomprehensible English job title and an office with an actual door."],
    },
    choices: [
      {
        label: { fr: 'Accepter', en: 'Accept' },
        out: [
          { w: 3, text: { fr: "J'ai accepté. Nouveau titre, augmentation, et un badge qui ouvre la salle avec la bonne machine à café.", en: 'I accepted. New title, a raise, and a badge that opens the room with the good coffee machine.' }, fx: { promote: true, happy: 10, stress: 5 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai accepté. Le premier jour, mon équipe m'a accueilli{|e} avec une chorégraphie. Le deuxième, avec une pétition pour me faire partir.", en: 'I accepted. On day one, my team welcomed me with a choreographed dance. On day two, with a petition to get rid of me.' }, fx: { promote: true, stress: 12, happy: 2 } },
        ],
      },
      {
        label: { fr: 'Négocier plus', en: 'Negotiate for more' },
        out: [
          { w: 1, odds: { smarts: 1 }, text: { fr: "J'ai négocié comme un requin : promotion, augmentation et télétravail le vendredi. {a.first} transpirait.", en: 'I negotiated like a shark: promotion, raise and remote Fridays. {a.first} was sweating.' }, fx: { promote: true, money: 2000, happy: 12, rel: -5 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai trop négocié. {a.first} a donné le poste à Gérard. Gérard ne sait pas ce qu'est un tableur.", en: "I pushed too hard. {a.first} gave the job to Gerald. Gerald doesn't know what a spreadsheet is." }, fx: { happy: -8, rel: -8 } },
        ],
      },
      { label: { fr: 'Refuser poliment', en: 'Politely decline' }, text: { fr: "J'ai refusé : plus de responsabilités, c'est plus de réunions. {a.first} m'a regardé{|e} comme si je refusais un rein gratuit.", en: "I declined: more responsibility means more meetings. {a.first} looked at me like I'd turned down a free kidney." }, fx: { stress: -5, rel: -5, happy: 3 } },
    ],
  },
  {
    id: 'wk_dead_boss',
    icon: '💀',
    cat: 'work',
    rating: 2,
    actor: 'boss',
    scene: { place: 'office', mood: 'shock', prop: 'desk', fx: 'ghost' },
    when: { age: [20, 75], job: true },
    weight: 2,
    once: true,
    text: {
      fr: ["{a.first}, {a.rel}, est mort{a:|e} à son bureau lundi. Personne ne s'en est aperçu avant jeudi : {a.he} ne bougeait déjà pas beaucoup en réunion. C'est l'odeur qui a trahi l'affaire.", "{a.first}, {a.rel}, a été retrouvé{a:|e} raide devant son écran, en train de taper « suite à mon précédent mail ». Depuis trois jours. La direction cherche un remplaçant. Vite."],
      en: ["{a.first}, your boss, died at {a:his|her} desk on Monday. Nobody noticed until Thursday: {a.he} didn't move much in meetings anyway. The smell gave it away.", "{a.first}, your boss, was found stiff in front of {a:his|her} screen, mid-typing 'as per my previous email'. For three days. Management needs a replacement. Fast."],
    },
    choices: [
      {
        label: { fr: 'Prendre sa place', en: 'Take the job' },
        out: [
          { w: 2, text: { fr: "J'ai récupéré le poste, le bureau et le fauteuil de {a.first}. On l'a désinfecté trois fois. Il garde une forme. Sa forme.", en: "I inherited {a.first}'s job, office and chair. It was disinfected three times. It still holds a shape. {a:His|Her} shape." }, fx: { actorDie: true, promote: true, happy: 6, stress: 6 } },
          { w: 1, text: { fr: "Premier jour à la place de {a.first} : un sandwich entamé, tout vert, dans son tiroir. Le dernier repas d'un guerrier. Je l'ai jeté en pleurant un peu.", en: "First day in {a.first}'s seat: a half-eaten sandwich, fully green, in the drawer. A warrior's last meal. I threw it away, crying a little." }, fx: { actorDie: true, promote: true, happy: 4 } },
        ],
      },
      { label: { fr: 'Faire son éloge funèbre', en: 'Give the eulogy' }, text: { fr: "J'ai fait l'éloge funèbre de {a.first}. J'ai dit « {a.he} était exigeant{a:|e} ». Tout le monde a entendu « tyran ». On a applaudi un peu trop fort.", en: "I gave {a.first}'s eulogy. I said '{a.he} was demanding'. Everyone heard 'tyrant'. The applause was a bit too loud." }, fx: { actorDie: true, perf: 5, karma: 2, happy: 2 } },
      { label: { fr: 'Piller son bureau', en: 'Loot the office' }, text: { fr: "Avant l'arrivée de la famille, j'ai embarqué l'agrafeuse électrique, la plante et la cave à cigares de {a.first}. {a:Il|Elle} n'en a plus besoin. Moi si.", en: "Before the family arrived, I grabbed {a.first}'s electric stapler, plant and cigar humidor. {a:He|She} doesn't need them anymore. I do." }, fx: { actorDie: true, karma: -8, happy: 6, money: 200 } },
    ],
  },
  {
    id: 'wk_layoff',
    icon: '📦',
    cat: 'work',
    rating: 1,
    vars: { amount: [3000, 15000] },
    scene: { place: 'office', mood: 'cry', prop: 'box' },
    when: { age: [20, 75], job: true },
    weight: 2,
    cooldown: 10,
    text: {
      fr: ["Visio surprise de 4 minutes avec un cabinet de conseil. Une voix lit un texte : « restructuration », « optimisation », « nous vous remercions ». Ta caméra est encore allumée.", "Ton badge ne marche plus ce matin. Sur ton bureau : un carton, une plante, et un mail du DG intitulé « Une nouvelle aventure commence (pour vous) »."],
      en: ["Surprise 4-minute video call with a consulting firm. A voice reads a script: 'restructuring', 'optimization', 'we thank you'. Your camera is still on.", "Your badge doesn't work this morning. On your desk: a cardboard box, a plant, and an email from the CEO titled 'A new adventure begins (for you)'."],
    },
    choices: [
      {
        label: { fr: 'Supplier', en: 'Beg' },
        out: [
          { w: 1, text: { fr: "J'ai supplié. Le consultant a coupé mon micro. Puis ma caméra. Puis mon salaire.", en: 'I begged. The consultant muted my mic. Then my camera. Then my salary.' }, fx: { fired: true, happy: -12, stress: 10 }, mood: 'cry' },
          { w: 2, text: { fr: "J'ai supplié avec tant de dignité qu'on m'a gardé{|e}… avec le boulot de trois licenciés en plus et la même paie. Victoire ?", en: "I begged so gracefully they kept me… with the workload of three laid-off people on top and the same pay. Victory?" }, fx: { perf: 3, stress: 12, happy: -6 } },
        ],
      },
      { label: { fr: 'Négocier mon départ', en: 'Negotiate my exit' }, text: { fr: "J'ai négocié ma rupture comme un avocat de la mafia : {$amount} d'indemnités. J'ai fêté ça au champagne, puis j'ai réalisé que j'étais au chômage.", en: "I negotiated my exit like a mob lawyer: {$amount} in severance. I celebrated with champagne, then realized I was unemployed." }, fx: { fired: true, money: 'amount', happy: 4 } },
      { label: { fr: 'Partir avec du matos', en: 'Leave with supplies' }, text: { fr: "Je suis parti{|e} la tête haute, avec l'écran, deux chaises de bureau et 400 stylos. On ne me licencie pas : je me sers.", en: "I left with my head held high, plus the monitor, two office chairs and 400 pens. You don't fire me: I help myself." }, fx: { fired: true, karma: -5, happy: 3, money: 300 } },
    ],
  },
  {
    id: 'wk_boss_shredder',
    icon: '🗑️',
    cat: 'work',
    rating: 2,
    actor: 'boss',
    scene: { place: 'office', mood: 'shock', prop: 'shredder', fx: 'gore' },
    when: { age: [18, 75], job: true },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["{a.first}, {a.rel}, fait un discours sur la « résilience » appuyé{a:|e} contre le broyeur à documents. {a:Sa cravate|Son foulard} pendouille dangereusement près de la fente. Le broyeur ronronne.", "Pendant son discours motivant, {a.first} gesticule à côté du broyeur industriel. {a:Sa cravate|Son foulard} effleure la fente. Tu es la seule personne à l'avoir remarqué."],
      en: ["{a.first}, your boss, is giving a speech about 'resilience' while leaning on the paper shredder. {a:His tie|Her scarf} dangles dangerously close to the slot. The shredder purrs.", "During {a:his|her} motivational speech, {a.first} gesticulates next to the industrial shredder. {a:His tie|Her scarf} brushes the slot. You're the only one who noticed."],
    },
    choices: [
      {
        label: { fr: 'Appuyer sur Stop', en: 'Hit the stop button' },
        out: [
          { w: 2, text: { fr: "J'ai pressé l'arrêt d'urgence à la dernière seconde. {a.first} s'en est tiré{a:|e} avec une coupe asymétrique et une dette éternelle envers moi.", en: "I slammed the emergency stop at the last second. {a.first} escaped with an asymmetrical haircut and an eternal debt to me." }, fx: { rel: 20, perf: 8, karma: 4 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai appuyé sur « Marche forcée » au lieu de « Stop ». Le broyeur a avalé {a:la cravate|le foulard}, puis une oreille entière, en crachant des confettis rouges sur tout l'open space. Depuis, on l'appelle « Van Gogh » à la machine à café.", en: "I hit 'Force On' instead of 'Stop'. The shredder swallowed the {a:tie|scarf}, then an entire ear, spraying red confetti across the open space. Everyone calls {a:him|her} 'Van Gogh' at the coffee machine now." }, fx: { rel: -20, karma: -6, perf: -5, visual: 'gore' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Filmer la scène', en: 'Film it' }, text: { fr: "J'ai filmé {a.first} aspiré{a:|e} par le broyeur, hurlant « RÉSILIENCE ! » en se débattant. 3 millions de vues. Les RH veulent en faire la vidéo de formation sécurité.", en: "I filmed {a.first} being sucked into the shredder, screaming 'RESILIENCE!' while flailing. 3 million views. HR wants it for the safety training video." }, fx: { fame: 4, followers: 3000, happy: 8, rel: -10 } },
      { label: { fr: 'Ne rien faire', en: 'Do nothing' }, text: { fr: "Je n'ai rien fait. Le broyeur a calé sur sa chevalière. {a.first} est resté{a:|e} collé{a:|e} à la machine deux heures et a fini son discours. Il était plus court que d'habitude.", en: '{a.first} got stuck to the machine for two hours after the shredder jammed on a signet ring, and finished the speech from there. I did nothing. It was shorter than usual.' }, fx: { happy: 5, karma: -2 } },
    ],
  },
  {
    id: 'wk_birthday_card',
    icon: '🎂',
    cat: 'work',
    rating: 0,
    scene: { place: 'office', mood: 'neutral', prop: 'card' },
    when: { age: [18, 75], job: true },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Une enveloppe kraft circule dans l'open space : carte d'anniversaire et cagnotte pour « Sylvie ». Tu n'as aucune idée de qui est Sylvie.", "On te tend une carte d'anniversaire géante pour Sylvie, du 2e étage. Il reste un petit coin entre « Joyeux anniv !!! » et un dessin de chat raté."],
      en: ["A manila envelope is going around the open space: birthday card and collection for 'Sylvia'. You have no idea who Sylvia is.", "Someone hands you a giant birthday card for Sylvia from the second floor. There's a tiny gap left between 'Happy bday!!!' and a botched drawing of a cat."],
    },
    choices: [
      { label: { fr: 'Mot générique', en: 'Write something generic' }, text: { fr: "J'ai écrit « Plein de bonnes choses ! » avec une signature illisible. Comme les 43 autres. Sylvie a été touchée par notre originalité.", en: "I wrote 'All the best!' with an illegible signature. Like the other 43. Sylvia was moved by our originality." }, fx: { happy: 1 } },
      {
        label: { fr: 'Écrire un poème', en: 'Write a poem' },
        out: [
          { w: 1, text: { fr: "J'ai écrit douze vers sur Sylvie sans la connaître. Elle a pleuré. Elle veut déjeuner avec moi tous les mardis, maintenant.", en: "I wrote twelve lines of verse about Sylvia without knowing her. She cried. Now she wants to have lunch with me every Tuesday." }, fx: { happy: 4, perf: 2 } },
          { w: 1, text: { fr: "Mon poème d'anniversaire très enjoué a atterri dans la carte de condoléances de la compta. « Souffle fort tes bougies ! »", en: "My very upbeat birthday poem ended up in accounting's sympathy card. 'Blow those candles out hard!'" }, fx: { happy: -5, karma: -2, stress: 4 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Mettre une pièce', en: 'Chip in a coin' }, text: { fr: "J'ai glissé une pièce de 20 centimes dans la cagnotte en toussant pour couvrir le bruit. Personne n'est dupe. Mon radinisme est officiel.", en: 'I slipped a dime into the collection, coughing to cover the clink. Nobody was fooled. My stinginess is now official.' }, fx: { karma: -2, money: -1 } },
    ],
  },
  {
    id: 'wk_toilet_clog',
    icon: '🚽',
    cat: 'work',
    rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'toilet', fx: 'poop' },
    when: { age: [18, 75], job: true },
    weight: 7,
    cooldown: 6,
    text: {
      fr: ["Tu viens de boucher les toilettes du 4e après un tacos XXL. L'eau monte, brune et déterminée. Le DG attend devant la porte, son journal sous le bras.", "Les toilettes du bureau débordent et l'étage entier sait que c'est toi : tu es sorti{|e} en sueur, la ventouse à la main, comme un chevalier vaincu."],
      en: ["You just clogged the fourth-floor toilet after an XXL burrito. The water is rising, brown and determined. The CEO is waiting outside with a newspaper under his arm.", 'The office toilet is overflowing and the whole floor knows it was you: you came out sweating, plunger in hand, like a defeated knight.'],
    },
    choices: [
      {
        label: { fr: "Sortir l'air de rien", en: 'Walk out casually' },
        out: [
          { w: 2, text: { fr: "Je suis sorti{|e} en sifflotant. Le DG est entré. Un cri, puis un bruit de clapotis. On n'a jamais retrouvé son journal.", en: 'I walked out whistling. The CEO went in. A scream, then a splashing sound. His newspaper was never found.' }, fx: { happy: 8, karma: -4 } },
          { w: 1, text: { fr: "Je suis sorti{|e} l'air de rien avec trois mètres de papier toilette coincés dans mon pantalon, comme une traîne de mariée. Le DG a pris une photo.", en: 'I strolled out with ten feet of toilet paper stuck in my pants, like a bridal train. The CEO took a picture.' }, fx: { happy: -8, looks: -3, fame: 1 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Combattre à la ventouse', en: 'Fight with the plunger' },
        out: [
          { w: 1, text: { fr: "Vingt minutes de combat à la ventouse. Victoire… puis retour de flamme : un geyser m'a aspergé{|e} des cheveux aux chaussures. J'ai fini la journée en tenue de sport, odeur incluse.", en: 'Twenty minutes of plunger combat. Victory… then blowback: a geyser hosed me down from hair to shoes. I finished the day in gym clothes, smell included.' }, fx: { happy: -8, health: -2, looks: -4 }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai vaincu le bouchon. Le service propreté m'a remis un diplôme honorifique. Il est accroché au-dessus de mon bureau.", en: 'I defeated the clog. The cleaning staff gave me an honorary diploma. It hangs above my desk.' }, fx: { happy: 4, perf: 2 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Accuser le stagiaire', en: 'Blame the intern' }, text: { fr: "J'ai désigné le stagiaire. Terrorisé, il a avoué un crime qu'il n'avait pas commis. On l'appelle « Le Volcan ». Il est payé 600 balles par mois.", en: "I blamed the intern. Terrified, he confessed to a crime he didn't commit. They call him 'The Volcano'. He makes 600 bucks a month." }, fx: { karma: -8, happy: 4 } },
    ],
  },

  // ───────────────────────────── feed lines ─────────────────────────────
  {
    id: 'wk_auto_monday',
    icon: '☕',
    cat: 'work',
    rating: 0,
    auto: true,
    scene: { place: 'office', mood: 'sleepy' },
    when: { age: [18, 75], job: true },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Lundi matin chez {employer} : j'ai demandé « bon week-end ? » à 14 personnes et écouté 14 récits de barbecue. Je n'ai pas encore allumé mon ordinateur.", "Au bureau, quelqu'un a renommé la salle de réunion « Salle Bonheur ». Rien n'a changé à l'intérieur, sauf l'humeur, qui a empiré."],
      en: ["Monday morning at {employer}: I asked 14 people 'good weekend?' and heard 14 barbecue stories. I haven't turned my computer on yet.", "At work, someone renamed the meeting room the 'Happiness Room'. Nothing changed inside, except the mood, which got worse."],
    },
    fx: { happy: -2, stress: 2 },
  },
  {
    id: 'wk_auto_printer',
    icon: '🖨️',
    cat: 'work',
    rating: 0,
    auto: true,
    scene: { place: 'office', mood: 'angry' },
    when: { age: [18, 75], job: true },
    weight: 6,
    cooldown: 5,
    text: {
      fr: ["L'imprimante du bureau affichait « bourrage papier » alors qu'elle était vide. J'ai négocié avec elle 45 minutes. Elle a imprimé une page blanche, par pure méchanceté.", "J'ai mis à jour l'imprimante du bureau. Elle parle maintenant en coréen et refuse le format A4."],
      en: ["The office printer said 'paper jam' while completely empty. I negotiated with it for 45 minutes. It printed a blank page out of sheer spite.", 'I updated the office printer. It now speaks Korean and refuses to accept letter-size paper.'],
    },
    fx: { stress: 3 },
  },
  {
    id: 'wk_auto_ai',
    icon: '🦾',
    cat: 'work',
    rating: 0,
    auto: true,
    scene: { place: 'office', mood: 'sad' },
    when: { age: [18, 75], job: true, flag: 'wk_ai_trained' },
    weight: 6,
    cooldown: 3,
    text: {
      fr: ["L'IA que j'ai formée m'envoie chaque matin une citation motivante et la liste de mes « axes d'amélioration ». Elle a eu une augmentation. Pas moi.", "L'IA que j'ai formée a été élue « collègue de l'année ». Elle a remercié son entraîneur dans son discours : son créateur, pas moi."],
      en: ['The AI I trained sends me a motivational quote every morning, plus a list of my "areas for improvement". It got a raise. I did not.', "The AI I trained was voted 'coworker of the year'. In its speech it thanked its mentor: its developer, not me."],
    },
    fx: { happy: -3 },
  },
  {
    id: 'wk_auto_tupperware',
    icon: '🦠',
    cat: 'work',
    rating: 2,
    auto: true,
    scene: { place: 'office', mood: 'sick', fx: 'poop' },
    when: { age: [18, 75], job: true },
    weight: 5,
    cooldown: 8,
    text: {
      fr: ["J'ai ouvert une boîte en plastique oubliée au fond du frigo du bureau depuis 2019. Elle a respiré. J'ai vomi dans l'évier, l'étage a été évacué et les pompiers ont refusé d'entrer.", "Le grand ménage du frigo du bureau : j'ai trouvé un yaourt bombé qui a explosé comme une grenade de moisissure. J'en ai encore dans l'oreille."],
      en: ['I opened a plastic tub that had been forgotten at the back of the office fridge since 2019. It breathed. I threw up in the sink, the floor was evacuated and the firefighters refused to go in.', 'Office fridge cleanup day: I found a bloated yogurt that went off like a mold grenade. I still have some in my ear.'],
    },
    fx: { health: -3, happy: -4 },
  },
  {
    id: 'wk_auto_linkedin',
    icon: '💼',
    cat: 'work',
    rating: 2,
    auto: true,
    scene: { place: 'office', mood: 'proud' },
    when: { age: [20, 75], job: true },
    weight: 5,
    cooldown: 6,
    text: {
      fr: ["J'ai posté sur LinkedIn un selfie en larmes, chemise ouverte : « Ce que mon divorce m'a appris sur le leadership B2B ». 50 000 likes. Je suis une merde, mais une merde influente.", "Sur LinkedIn, j'ai écrit 1 200 mots pour raconter comment une crotte de pigeon sur mon épaule m'a enseigné la résilience en entreprise. Trois chasseurs de têtes m'ont contacté{|e}."],
      en: ["I posted a crying selfie on LinkedIn, shirt unbuttoned: 'What my divorce taught me about B2B leadership'. 50,000 likes. I'm a piece of shit, but an influential one.", 'On LinkedIn, I wrote 1,200 words about how a pigeon dropping on my shoulder taught me corporate resilience. Three headhunters reached out.'],
    },
    fx: { followers: 5000, fame: 2, karma: -4 },
  },
  {
    id: 'wk_auto_cat_tree',
    icon: '🐈',
    cat: 'work',
    rating: 0,
    auto: true,
    scene: { place: 'park', mood: 'neutral' },
    when: { age: [18, 70], job: 'firefighter' },
    weight: 6,
    cooldown: 4,
    text: {
      fr: ["J'ai sauvé un chat coincé dans un arbre. Il m'a griffé{|e} au visage, puis il est remonté dans l'arbre. Troisième fois cette semaine. Je crois qu'il fait ça pour me voir.", "La caserne a reçu un appel pour « un animal dangereux dans une cuisine ». C'était un homard vivant. J'ai perdu le combat aux points."],
      en: ['I rescued a cat stuck in a tree. It clawed my face, then climbed right back up. Third time this week. I think it does it to see me.', "The station got a call about 'a dangerous animal in a kitchen'. It was a live lobster. I lost on points."],
    },
    fx: { happy: 2, karma: 2, looks: -1 },
  },
  {
    id: 'wk_auto_unemployed',
    icon: '🛋️',
    cat: 'work',
    rating: 0,
    auto: true,
    scene: { place: 'home', mood: 'sleepy' },
    when: { age: [20, 60], job: false, school: 'none' },
    weight: 6,
    cooldown: 3,
    text: {
      fr: ["J'ai regardé une série coréenne de 16 épisodes en un week-end, puis mis à jour mon CV : « Compétences : endurance ».", "J'ai envoyé 40 candidatures cette semaine. J'ai reçu une réponse : un mail automatique qui m'appelait « Madame, Monsieur, Prénom »."],
      en: ["I binged a 16-episode K-drama in one weekend, then updated my résumé: 'Skills: endurance'.", "I sent out 40 applications this week. I got one reply: an automated email addressing me as 'Dear Sir or Madam FirstName'."],
    },
    fx: { happy: 2, smarts: -1 },
  },

  // ───────────────────────────── health ─────────────────────────────
  {
    id: 'wk_hlth_object',
    icon: '🩻',
    cat: 'work',
    rating: 2,
    scene: { place: 'hospital', mood: 'shock', prop: 'xray' },
    when: { age: [18, 75], job: ['doctor', 'nurse'] },
    weight: 9,
    cooldown: 4,
    text: {
      fr: ["Urgences, 3 h du matin. Un patient affirme être « tombé » sur une figurine de chevalier de l'espace. La radio est formelle : le chevalier est à l'intérieur, sabre laser compris.", "Un homme se présente aux urgences en marchant comme un pingouin. Il « nettoyait sa salle de bain » quand une bouteille de shampoing a « glissé ». La radio montre la bouteille. Entière. Très loin."],
      en: ["ER, 3 a.m. A patient claims he 'fell' onto a space knight action figure. The X-ray is clear: the knight is inside, lightsaber included.", "A man waddles into the ER like a penguin. He was 'cleaning the bathroom' when a shampoo bottle 'slipped'. The X-ray shows the bottle. Intact. Very far up."],
    },
    choices: [
      {
        label: { fr: 'Extraction délicate', en: 'Delicate extraction' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai extrait l'objet avec la délicatesse d'un démineur. Applaudissements du bloc. Le patient a demandé à le récupérer : « valeur sentimentale ».", en: "I extracted the object with the finesse of a bomb technician. The OR applauded. The patient asked to keep it: 'sentimental value'." }, fx: { perf: 8, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "L'extraction a fait ventouse. Un « PLOP » a résonné dans tout le service, suivi d'une giclée que l'interne a prise en pleine figure. Il a démissionné le soir même.", en: "The extraction created suction. A 'PLOP' echoed through the whole ward, followed by a spray the resident took full in the face. He quit that evening." }, fx: { perf: 3, happy: 4, visual: 'poop' }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Appeler tout le service', en: 'Call the whole ward' }, text: { fr: "J'ai appelé tous les collègues « pour avis ». La radio a fait le tour de l'hôpital. Elle est punaisée en salle de pause, entre le planning et une photo de chaton.", en: "I called every colleague in 'for a second opinion'. The X-ray toured the hospital. It's pinned up in the break room, between the rota and a kitten photo." }, fx: { happy: 8, karma: -5, perf: -2 } },
      { label: { fr: 'Garder mon sérieux', en: 'Keep a straight face' }, text: { fr: "J'ai gardé un sérieux de marbre. Le patient m'a remercié{|e} de ne pas le juger. Puis j'ai pleuré de rire quarante minutes dans la lingerie.", en: "I kept a stone-cold straight face. The patient thanked me for not judging him. Then I cried laughing for forty minutes in the linen room." }, fx: { happy: 6, karma: 3, perf: 3 } },
    ],
  },
  {
    id: 'wk_hlth_chainsaw',
    icon: '🪚',
    cat: 'work',
    rating: 2,
    scene: { place: 'hospital', mood: 'shock', prop: 'cooler', fx: 'gore' },
    when: { age: [18, 75], job: ['doctor', 'nurse'] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Un bûcheron du dimanche débarque aux urgences avec son bras dans une glacière. Le bras tient encore la tronçonneuse. Elle tourne encore.", "Arrivée en trombe : un type a voulu élaguer son cerisier « à l'ancienne ». Son bras est dans une glacière à bière, avec la tronçonneuse toujours accrochée au poing. Il demande si ça gênera « pour le foot dimanche »."],
      en: ['A weekend lumberjack bursts into the ER with his arm in a cooler. The arm is still holding the chainsaw. It is still running.', "Emergency arrival: a guy tried to prune his cherry tree 'old-school'. His arm is in a beer cooler, chainsaw still gripped in the fist. He asks if it'll be a problem 'for football on Sunday'."],
    },
    choices: [
      {
        label: { fr: 'Recoudre en vitesse', en: 'Reattach it fast' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai recousu le bras en six heures, au fil et à la volonté. Il bouge les doigts. Enfin, quatre. Le cinquième a été mangé par le chien de la salle d'attente.", en: 'I reattached the arm in six hours, on thread and willpower. He can move his fingers. Well, four. The fifth was eaten by a dog in the waiting room.' }, fx: { perf: 12, happy: 6, fame: 1 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai recousu le bras… à l'envers. Le pouce est en bas. Le patient dit que c'est pratique pour mettre des pouces rouges sur internet.", en: "I reattached the arm… upside down. The thumb points down. The patient says it's handy for downvoting things online." }, fx: { perf: -10, karma: -3, stress: 8 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Couper la tronçonneuse', en: 'Kill the chainsaw' },
        out: [
          { w: 2, text: { fr: "J'ai coupé la tronçonneuse d'un coup de pied ninja. Les collègues en parlent encore. Le patient s'est évanoui en voyant son propre bras lui faire coucou.", en: 'I shut off the chainsaw with a ninja kick. My colleagues still talk about it. The patient fainted watching his own arm wave goodbye.' }, fx: { perf: 6, athletic: 2, happy: 5 } },
          { w: 1, text: { fr: "La tronçonneuse s'est cabrée et a repeint la salle de soins en rouge, plafond compris. J'y ai laissé un lobe d'oreille. Le ménage réclame une prime de risque.", en: 'The chainsaw bucked and painted the treatment room red, ceiling included. I lost an earlobe. Housekeeping is demanding hazard pay.' }, fx: { health: -8, looks: -4, happy: -6, visual: 'gore' }, mood: 'shock' },
        ],
      },
      { label: { fr: "Refiler à l'interne", en: 'Hand it to the resident' }, text: { fr: "J'ai confié le cas à l'interne. Il a vomi dans la glacière. Le bras était perdu, mais l'interne a beaucoup appris.", en: 'I handed the case to the resident. He threw up in the cooler. The arm was lost, but the resident learned a lot.' }, fx: { perf: -4, karma: -4, happy: 3 } },
    ],
  },
  {
    id: 'wk_hlth_sponge',
    icon: '🧽',
    cat: 'work',
    rating: 1,
    vars: { amount: [5000, 40000] },
    scene: { place: 'hospital', mood: 'sad', prop: 'scalpel' },
    when: { age: [24, 75], job: 'doctor' },
    weight: 7,
    cooldown: 6,
    text: {
      fr: ["Une ancienne patiente revient se plaindre de douleurs au ventre. La radio montre une compresse, deux pinces et ce qui ressemble beaucoup à ta montre. Tu la cherchais depuis mars.", "Le scanner de contrôle de ton opéré de la semaine dernière révèle un objet métallique. C'est ton alliance. Tu croyais l'avoir laissée au vestiaire."],
      en: ["A former patient comes back complaining of stomach pain. The X-ray shows a sponge, two clamps and something that looks a lot like your watch. You've been looking for it since March.", "Last week's surgical patient's follow-up scan reveals a metal object. It's your wedding ring. You thought you'd left it in the locker room."],
    },
    choices: [
      {
        label: { fr: 'Tout avouer', en: 'Confess everything' },
        out: [
          { w: 2, text: { fr: "J'ai tout avoué. Procès perdu : {$amount} de dommages. Mais on m'a rendu mon bien. Il marche toujours.", en: 'I confessed everything. Lawsuit lost: {$amount} in damages. But I got my property back. Still works.' }, fx: { money: '-amount', karma: 6, perf: -8, happy: -6 } },
          { w: 1, text: { fr: "Ému par mon honnêteté, le patient a refusé de porter plainte. Puis sa famille a porté plainte à sa place.", en: 'Moved by my honesty, the patient refused to sue. Then the family sued on their behalf.' }, fx: { money: '-amount', perf: -5, stress: 10 } },
        ],
      },
      {
        label: { fr: 'Réopérer en douce', en: 'Quietly reoperate' },
        out: [
          { w: 2, text: { fr: "J'ai réopéré « pour une vérification de routine ». J'ai tout récupéré, plus son appendice, par mégarde. Cadeau de la maison.", en: "I reoperated 'for a routine check'. I got everything back, plus the appendix, by accident. On the house." }, fx: { karma: -6, perf: 3, stress: 6 } },
          { w: 1, text: { fr: "La réopération secrète a été filmée par la webcam d'un externe. Conseil de l'ordre, scandale et licenciement. Mon bien est sous scellés.", en: "The secret reoperation was filmed on a med student's webcam. Medical board, scandal and dismissal. My property is in an evidence bag." }, fx: { fired: true, karma: -10, happy: -15, fame: 2 }, mood: 'cry' },
        ],
      },
      { label: { fr: "Accuser l'anesthésiste", en: 'Blame the anesthetist' }, text: { fr: "J'ai accusé l'anesthésiste. Il a éclaté de rire : il dormait pendant l'opération, comme d'habitude. Ma crédibilité aussi s'est endormie.", en: 'I blamed the anesthetist. He burst out laughing: he was asleep during the surgery, as usual. My credibility nodded off too.' }, fx: { perf: -6, karma: -5 } },
    ],
  },

  // ───────────────────────────── law ─────────────────────────────
  {
    id: 'wk_law_scumbag',
    icon: '⚖️',
    cat: 'work',
    rating: 1,
    vars: { amount: [5000, 30000] },
    scene: { place: 'court', mood: 'neutral', prop: 'gavel' },
    when: { age: [22, 75], job: 'cat:law' },
    weight: 9,
    cooldown: 4,
    text: {
      fr: ["Ton nouveau client, un promoteur immobilier, est accusé d'avoir rasé un orphelinat « par erreur ». Il te paie en lingots et t'appelle « mon petit ».", "Ton client, magnat du pétrole, est accusé d'avoir déversé 40 tonnes de boues toxiques dans une rivière. Il te demande, sincèrement, si « les poissons ont des avocats »."],
      en: ["Your new client, a real estate developer, is accused of bulldozing an orphanage 'by mistake'. He pays you in gold bars and calls you 'kiddo'.", "Your client, an oil tycoon, is accused of dumping 40 tons of toxic sludge into a river. He sincerely asks whether 'fish have lawyers'."],
    },
    choices: [
      {
        label: { fr: 'Le faire acquitter', en: 'Get him acquitted' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai plaidé que les victimes étaient « au mauvais endroit, mal garées ». Acquitté. Mon client m'a versé {$amount} et j'ai pleuré sous la douche.", en: "I argued the victims were 'in the wrong place, badly parked'. Acquitted. My client paid me {$amount} and I cried in the shower." }, fx: { money: 'amount', karma: -10, perf: 10, fame: 2, flag: 'wk_scumbag_freed', schedule: { key: 'wk_law_scumbag_back', years: 2 } } },
          { w: 1, text: { fr: "J'ai tout donné, mais il a été condamné. Il m'a traité{|e} d'incapable et refusé de payer ma note.", en: 'I gave it everything, but he was convicted. He called me incompetent and refused to pay my bill.' }, fx: { perf: -8, happy: -6 } },
        ],
      },
      { label: { fr: 'Plaider mollement', en: 'Phone it in' }, text: { fr: "J'ai plaidé avec la passion d'un répondeur téléphonique. Il a pris dix ans. Le juge m'a fait un clin d'œil.", en: 'I argued with the passion of an answering machine. He got ten years. The judge winked at me.' }, fx: { karma: 8, perf: -5, happy: 4 } },
      { label: { fr: 'Refuser le dossier', en: 'Drop the case' }, text: { fr: "J'ai refusé le dossier. Mon associé l'a pris et s'est acheté un bateau. Moi, j'ai ma conscience. Et un vélo.", en: 'I turned down the case. My partner took it and bought a boat. I have my conscience. And a bike.' }, fx: { karma: 10, perf: -3, happy: 2 } },
    ],
  },
  {
    id: 'wk_law_scumbag_back',
    icon: '🦹',
    cat: 'work',
    rating: 2,
    chainOnly: true,
    vars: { amount: [10000, 50000] },
    scene: { place: 'court', mood: 'shock', prop: 'newspaper' },
    when: { flag: 'wk_scumbag_freed' },
    text: {
      fr: ["Le salaud que tu as fait acquitter récidive : il a construit un parking sur un cimetière. Des fémurs remontent par les bouches d'aération. Il réclame « son avocat préféré ».", "Ton ancien client acquitté refait la une : son usine a explosé et une pluie de boyaux de poulet s'est abattue sur la ville. Il t'appelle en hurlant « TU ME DOIS ÇA »."],
      en: ["The scumbag you got acquitted has struck again: he built a parking garage on a cemetery. Femurs are coming up through the air vents. He wants 'his favorite lawyer'.", "Your acquitted former client is back in the headlines: his factory exploded and rained chicken guts over the city. He calls you screaming 'YOU OWE ME'."],
    },
    choices: [
      {
        label: { fr: 'Le redéfendre', en: 'Defend him again' },
        out: [
          { w: 1, text: { fr: "Je l'ai redéfendu. Acquitté, encore. Sur les marches du tribunal, une mamie lui a lancé un œuf, puis un pavé. Le pavé m'a touché{|e}. Je pisse le sang, mais j'ai encaissé {$amount}.", en: 'I defended him again. Acquitted, again. On the courthouse steps, a granny threw an egg at him, then a brick. The brick hit me. I am gushing blood, but I cashed {$amount}.' }, fx: { money: 'amount', karma: -12, health: -6, visual: 'gore', unflag: 'wk_scumbag_freed' } },
          { w: 1, text: { fr: "Cette fois, il a pris perpète. En prison, il a écrit ses mémoires où je suis décrit{|e} comme « un larbin en robe ». Best-seller.", en: "This time he got life. In prison, he wrote a memoir describing me as 'a lackey in a robe'. Bestseller." }, fx: { karma: -4, happy: -6, fame: 2, unflag: 'wk_scumbag_freed' } },
        ],
      },
      { label: { fr: 'Le balancer', en: 'Turn him in' }, text: { fr: "J'ai tout transmis au procureur. Secret professionnel piétiné, honneur sauvé. Suspendu{|e} six mois, invité{|e} sur tous les plateaux télé.", en: 'I handed everything to the prosecutor. Attorney-client privilege trampled, honor saved. Suspended for six months, booked on every talk show.' }, fx: { karma: 15, fame: 5, perf: -10, unflag: 'wk_scumbag_freed' }, mood: 'proud' },
      { label: { fr: 'Changer de numéro', en: 'Change my number' }, text: { fr: "J'ai changé de numéro, d'adresse et de coupe de cheveux. Il m'a quand même retrouvé{|e} et envoyé un panier garni. Avec un poulet mort dedans.", en: 'I changed my number, my address and my haircut. He still found me and sent a gift basket. With a dead chicken in it.' }, fx: { stress: 8, happy: -3, unflag: 'wk_scumbag_freed' } },
    ],
  },

  // ───────────────────────────── public service ─────────────────────────────
  {
    id: 'wk_pub_chase',
    icon: '🚓',
    cat: 'work',
    rating: 1,
    scene: { place: 'park', mood: 'shock', prop: 'police_car', fx: 'police' },
    when: { age: [18, 70], job: 'police' },
    weight: 9,
    cooldown: 3,
    text: {
      fr: ["Course-poursuite ! Le suspect fuit sur une trottinette électrique volée. Ta voiture de patrouille a 400 000 km et une odeur de kebab incrustée dans les sièges.", "Un braqueur de supérette détale avec la caisse et un pack de bières. Ton binôme est parti chercher des beignets. Tu es seul{|e} face à ton destin."],
      en: ['Chase! The suspect is fleeing on a stolen electric scooter. Your patrol car has 250,000 miles on it and a kebab smell baked into the seats.', 'A convenience-store robber is sprinting off with the till and a six-pack. Your partner went for donuts. You stand alone before destiny.'],
    },
    choices: [
      {
        label: { fr: 'Pied au plancher', en: 'Floor it' },
        out: [
          { w: 2, text: { fr: "J'ai foncé à travers un marché, un mariage et une manif. Suspect arrêté. Il reste un chou-fleur encastré dans la calandre. Médaille !", en: 'I tore through a farmers market, a wedding and a protest. Suspect apprehended. There is still a cauliflower embedded in the grille. Medal!' }, fx: { perf: 10, fame: 2, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai fini dans une fontaine. Le suspect s'est arrêté pour me filmer, puis il est reparti. 4 millions de vues. Mon commissaire aussi l'a vue.", en: 'I ended up in a fountain. The suspect stopped to film me, then took off. 4 million views. My captain saw it too.' }, fx: { perf: -8, happy: -6, fame: 3, health: -3 }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Courir après', en: 'Chase on foot' },
        out: [
          { w: 1, odds: { athletic: 1 }, text: { fr: "J'ai sprinté deux kilomètres et plaqué le suspect dans une poubelle. Il m'a dit « respect ». Puis j'ai vomi mon déjeuner sur ses chaussures.", en: "I sprinted a mile and tackled the suspect into a dumpster. He said 'respect'. Then I threw up my lunch on his shoes." }, fx: { perf: 8, athletic: 3, health: -2 } },
          { w: 1, text: { fr: "Au bout de 200 mètres, je me suis arrêté{|e}, plié{|e} en deux. Le suspect est revenu me proposer de l'eau. On a discuté. Puis il est reparti avec ma radio.", en: 'After 200 yards I stopped, bent double. The suspect came back to offer me water. We chatted. Then he left with my radio.' }, fx: { perf: -5, happy: 2, athletic: -2 } },
        ],
      },
      { label: { fr: 'Laisser filer', en: 'Let it go' }, text: { fr: "J'ai laissé filer. Dans mon rapport : « suspect trop rapide, moi trop digne ». Mon chef a signé sans lire.", en: "I let it go. My report says: 'suspect too fast, me too dignified'. My boss signed without reading." }, fx: { perf: -2, stress: -3 } },
    ],
  },
  {
    id: 'wk_pub_fire',
    icon: '🚒',
    cat: 'work',
    rating: 1,
    scene: { place: 'apartment', mood: 'shock', prop: 'hose', fx: 'fire' },
    when: { age: [18, 70], job: 'firefighter' },
    weight: 9,
    cooldown: 3,
    text: {
      fr: ["Incendie dans un immeuble. Au 5e, une vieille dame refuse de sortir sans ses 14 chats, son poisson rouge et sa collection de porcelaine. Le plafond craque.", "Feu d'appartement : une mamie a voulu flamber des crêpes au rhum. Elle te crie depuis son balcon qu'elle ne partira pas sans ses 14 chats. Elle insiste en jurant comme un docker."],
      en: ['Apartment fire. On the fifth floor, an old lady refuses to leave without her 14 cats, her goldfish and her porcelain collection. The ceiling is creaking.', "Apartment fire: a granny tried to flambé crêpes with rum. She's yelling from her balcony that she won't leave without her 14 cats. She's swearing like a sailor about it."],
    },
    choices: [
      {
        label: { fr: 'Sauver tout le monde', en: 'Save everyone' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "Je suis ressorti{|e} des flammes avec la mamie, 14 chats et le poisson rouge dans mon casque. La presse m'appelle « le Héros des Matous ».", en: "I came out of the flames with the granny, 14 cats and the goldfish in my helmet. The press calls me 'the Kitty Hero'." }, fx: { perf: 10, fame: 4, karma: 8, health: -4 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai sauvé la mamie et les chats, mais j'ai avalé tant de fumée que je tousse comme un vieux diesel. Les chats ne m'ont pas remercié{|e}.", en: "I saved the granny and the cats, but I inhaled so much smoke I cough like an old diesel engine. The cats did not thank me." }, fx: { health: -10, karma: 6, perf: 6 } },
        ],
      },
      { label: { fr: 'Arroser large', en: 'Hose everything' }, text: { fr: "J'ai noyé l'appartement sous 20 000 litres d'eau. Le feu est éteint, l'appartement du dessous aussi, et la mamie fait du kayak dans son salon.", en: "I flooded the place with 5,000 gallons of water. The fire's out, so is the apartment below, and the granny is kayaking in her living room." }, fx: { perf: 3, happy: 4, karma: -2 } },
      { label: { fr: 'Attendre les renforts', en: 'Wait for backup' }, text: { fr: "J'ai attendu les renforts en mangeant un sandwich devant les flammes. Mon capitaine m'a vu{|e} au journal de 20 h. Avertissement.", en: 'I waited for backup eating a sandwich in front of the flames. My captain saw me on the evening news. Written warning.' }, fx: { perf: -10, karma: -4, happy: 2 } },
    ],
  },
  {
    id: 'wk_pub_war',
    icon: '💣',
    cat: 'work',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'helmet', fx: 'explosion' },
    when: { age: [18, 70], job: 'soldier' },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Déploiement en zone de guerre. Ton sergent marche sur une mine en criant « Hé, une pièce ! ». Il pleut des morceaux de sergent.", "Embuscade dans un village désert. Une roquette pulvérise le camion de ravitaillement et ton sergent avec. Ton binôme te tend une jambe : « C'est à toi ? »"],
      en: ["Deployed to a war zone. Your sergeant steps on a mine shouting 'Hey, a coin!'. It's raining sergeant.", "Ambush in a deserted village. A rocket vaporizes the supply truck and your sergeant with it. Your buddy hands you a leg: 'This yours?'"],
    },
    choices: [
      {
        label: { fr: 'Charger en hurlant', en: 'Charge screaming' },
        out: [
          { w: 6, text: { fr: "J'ai chargé en hurlant comme un personnage de dessin animé. L'ennemi a fui, sûrement par gêne. Médaille du courage et acouphènes à vie.", en: 'I charged screaming like a cartoon character. The enemy fled, probably out of embarrassment. Medal of valor and lifelong tinnitus.' }, fx: { perf: 10, fame: 2, stress: 10, happy: 4 }, mood: 'proud' },
          { w: 3, text: { fr: "Une balle m'a arraché deux doigts. Je les ai ramassés et rangés dans ma poche de poitrine. Le chirurgien militaire les a recousus. Pas dans le bon ordre.", en: 'A bullet took off two of my fingers. I picked them up and put them in my breast pocket. The army surgeon sewed them back on. In the wrong order.' }, fx: { health: -14, disease: 'missing_finger', perf: 6, visual: 'gore' }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai chargé. La mitrailleuse d'en face m'a transformé{|e} en passoire décorative. J'étais très courageu{x|se} pendant environ quatre secondes.", en: 'I charged. The machine gun across the way turned me into a decorative colander. I was very brave for about four seconds.' }, fx: { die: { fr: 'en chargeant une mitrailleuse avec un cri de dessin animé', en: 'charging a machine gun with a cartoon war cry' }, visual: 'gore' } },
        ],
      },
      {
        label: { fr: 'Me planquer dans un trou', en: 'Hide in a foxhole' },
        out: [
          { w: 2, text: { fr: "J'ai passé la bataille au fond d'un trou boueux avec un rat. On a partagé une ration. On est frères, maintenant.", en: "I spent the battle at the bottom of a muddy hole with a rat. We shared a ration. We're brothers now." }, fx: { health: -2, stress: 8, perf: -4 } },
          { w: 1, text: { fr: "Le trou où je me suis planqué{|e}, c'étaient les latrines du camp. J'ai survécu à la guerre. Pas à l'odeur.", en: "The hole I hid in was the camp latrine. I survived the war. Not the smell." }, fx: { happy: -8, health: -3 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Ramasser les morceaux', en: 'Collect the pieces' }, text: { fr: "J'ai ramassé les morceaux du sergent pour sa famille. Il en manquait un. Le chien du village le promène fièrement depuis. Je fais des cauchemars.", en: "I gathered the sergeant's pieces for his family. One was missing. The village dog has been proudly carrying it around ever since. I have nightmares." }, fx: { disease: 'ptsd', karma: 5, happy: -10 }, mood: 'sad' },
    ],
  },

  // ───────────────────────────── service ─────────────────────────────
  {
    id: 'wk_srv_karen',
    icon: '😤',
    cat: 'work',
    rating: 1,
    scene: { place: 'office', mood: 'angry', prop: 'register' },
    when: { age: [16, 75], job: 'cat:service' },
    weight: 10,
    cooldown: 3,
    text: {
      fr: ["Une cliente exige de parler au responsable parce que tu as refusé son bon de réduction expiré en 2011. Elle filme. Elle a une coupe au carré très agressive.", "Une cliente hurle depuis dix minutes pour un bon de réduction périmé depuis 2011. Elle menace de « tout raconter sur Google » et filme ta tête en gros plan."],
      en: ["A customer demands to speak to the manager because you refused her coupon that expired in 2011. She's filming. She has a very aggressive bob.", "A customer has been yelling for ten minutes about a coupon that expired in 2011. She threatens to 'tell Google everything' and films your face in close-up."],
    },
    choices: [
      {
        label: { fr: 'Sourire commercial', en: 'Customer-service smile' },
        out: [
          { w: 2, text: { fr: "J'ai souri si fort que mes dents ont grincé. Elle est repartie satisfaite, avec sa réduction et mon âme.", en: 'I smiled so hard my teeth squeaked. She left satisfied, with her discount and my soul.' }, fx: { stress: 8, perf: 4, happy: -3 } },
          { w: 1, text: { fr: "J'ai répondu « je comprends tout à fait votre frustration » onze fois de suite. Elle a fini par pleurer et s'excuser. J'ai brisé un être humain.", en: "I said 'I completely understand your frustration' eleven times in a row. She ended up crying and apologizing. I broke a human being." }, fx: { perf: 6, happy: 4 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: "L'envoyer chier", en: 'Tell her to piss off' },
        out: [
          { w: 2, text: { fr: "Je lui ai dit d'aller se faire cuire un œuf, avec ses coupons. Une étoile sur Google. Mon patron a encadré l'avis : c'est son préféré.", en: 'I told her to go to hell, coupon and all. One star on Google. My manager framed the review: it is his favorite.' }, fx: { happy: 8, perf: -2 }, mood: 'party' },
          { w: 1, text: { fr: "Je l'ai envoyée chier en public. Tonnerre d'applaudissements dans la file. Mon patron m'a viré{|e}… en applaudissant aussi.", en: 'I told her to piss off in public. Thunderous applause from the line. My manager fired me… while also clapping.' }, fx: { fired: true, happy: 10, fame: 1 }, mood: 'party' },
        ],
      },
      { label: { fr: 'Appeler un faux responsable', en: 'Summon a fake manager' }, text: { fr: "J'ai appelé « le responsable » : mon collègue Kévin, avec une cravate et une moustache au feutre. Il lui a offert 50 % sur rien. Elle est partie ravie.", en: "I called 'the manager': my coworker Kevin, wearing a tie and a marker mustache. He gave her 50% off nothing. She left delighted." }, fx: { happy: 6, karma: -1 } },
    ],
  },
  {
    id: 'wk_srv_fryer',
    icon: '🍟',
    cat: 'work',
    rating: 2,
    scene: { place: 'office', mood: 'shock', prop: 'fryer', fx: 'gore' },
    when: { age: [16, 75], job: ['fastfood', 'cook'] },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Rush de midi. Ton collègue Dylan glisse sur une flaque de sauce et plonge la main entière dans la friteuse. Il hurle. Les frites, elles, sont parfaites.", "Coup de feu en cuisine : Dylan, 19 ans, tente un « dunk » de frites et finit le bras dans l'huile bouillante jusqu'au coude. Ça grésille. Ça sent le nugget."],
      en: ["Lunch rush. Your coworker Dylan slips on a puddle of sauce and plunges his whole hand into the fryer. He's screaming. The fries, however, are perfect.", "Kitchen slammed: Dylan, 19, attempts a fry 'slam dunk' and ends up elbow-deep in boiling oil. It sizzles. It smells like nuggets."],
    },
    choices: [
      {
        label: { fr: 'Sauver Dylan', en: 'Save Dylan' },
        out: [
          { w: 2, text: { fr: "J'ai sorti Dylan de la friteuse. Sa main était dorée et croustillante. En état de choc, il a demandé de la sauce barbecue. On l'appelle « Main Croustillante » pour toujours.", en: "I pulled Dylan out of the fryer. His hand was golden and crispy. In shock, he asked for barbecue sauce. He'll be 'Crispy Hand' forever." }, fx: { karma: 6, perf: 3, visual: 'gore' } },
          { w: 1, text: { fr: "En sauvant Dylan, j'ai renversé la friteuse. Huile bouillante partout. On a perdu deux plateaux, une chaise et mes sourcils.", en: 'Saving Dylan, I knocked over the fryer. Boiling oil everywhere. We lost two trays, a chair and my eyebrows.' }, fx: { disease: 'burns', health: -8, looks: -4 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: "Finir la commande d'abord", en: 'Finish the order first' },
        out: [
          { w: 2, text: { fr: "J'ai fini la commande du drive avant d'appeler les secours. Temps de service record. Le manager m'a nommé{|e} employé{|e} du mois. Dylan a démissionné depuis son lit d'hôpital.", en: "I finished the drive-thru order before calling for help. Record service time. The manager named me employee of the month. Dylan quit from his hospital bed." }, fx: { perf: 10, karma: -10, happy: 3 } },
          { w: 1, text: { fr: "Un client du drive a vu la scène, filmé, et demandé « c'est inclus dans le menu ? ». La chaîne m'a suspendu{|e}. Lui a eu son menu gratuit.", en: "A drive-thru customer saw it all, filmed it, and asked 'is that included in the combo?'. The chain suspended me. He got a free meal." }, fx: { perf: -10, karma: -6, fame: 2 } },
        ],
      },
      { label: { fr: 'Démissionner sur place', en: 'Quit on the spot' }, text: { fr: "J'ai jeté ma casquette dans la friteuse et je suis sorti{|e} par le drive, à pied. Les clients m'ont applaudi{|e} depuis leurs voitures.", en: 'I tossed my cap into the fryer and walked out through the drive-thru. Customers applauded from their cars.' }, fx: { quitJob: true, happy: 10, stress: -10 }, mood: 'party' },
    ],
  },
  {
    id: 'wk_srv_tip',
    icon: '💶',
    cat: 'work',
    rating: 0,
    vars: { amount: [20, 200] },
    scene: { place: 'office', mood: 'neutral', prop: 'tray' },
    when: { age: [16, 75], job: ['waiter', 'cook', 'fastfood'] },
    weight: 9,
    cooldown: 3,
    text: {
      fr: ["Une table de huit a squatté ta section trois heures, renvoyé quatre plats et demandé du ketchup avec le homard. Au moment de payer, le chef de table te fait signe d'approcher.", "Un client t'a fait refaire son café cinq fois (« trop chaud », « trop froid », « trop marron »). Il sort son portefeuille pour le pourboire."],
      en: ['A table of eight camped in your section for three hours, sent back four dishes and asked for ketchup with the lobster. At checkout, the head of the table waves you over.', "A customer made you remake his coffee five times ('too hot', 'too cold', 'too brown'). He pulls out his wallet for the tip."],
    },
    choices: [
      {
        label: { fr: 'Sourire et attendre', en: 'Smile and wait' },
        out: [
          { w: 2, text: { fr: "Pourboire : une pièce de 10 centimes et un « vous devriez sourire plus ». J'ai souri. Intérieurement, je hurlais.", en: "Tip: a nickel and a 'you should smile more'. I smiled. On the inside, I was screaming." }, fx: { happy: -4, stress: 3 } },
          { w: 1, text: { fr: "Surprise : {$amount} de pourboire et un « vous êtes la seule personne aimable de cette ville ». J'ai failli pleurer dans la carafe.", en: "Surprise: a {$amount} tip and a 'you're the only nice person in this city'. I almost cried into the water jug." }, fx: { money: 'amount', happy: 8 }, mood: 'happy' },
        ],
      },
      { label: { fr: 'Lui faire la morale', en: 'Give a lecture' }, text: { fr: "Je lui ai expliqué calmement le concept de « salaire minimum ». Il m'a laissé un avis une étoile : « Donne des leçons ». C'est vrai, j'en donne.", en: "I calmly explained the concept of 'minimum wage'. He left a one-star review: 'Lectures people'. True, I do." }, fx: { happy: 4, perf: -3 } },
      {
        label: { fr: 'Ajouter des frais', en: 'Add a sneaky fee' },
        out: [
          { w: 1, text: { fr: "J'ai ajouté une ligne « frais de patience » sur l'addition. Personne n'a rien vu. Je me sens comme un banquier.", en: "I added a 'patience fee' line to the bill. Nobody noticed. I feel like a banker." }, fx: { money: 60, karma: -4, happy: 4 } },
          { w: 1, text: { fr: "Le client a repéré les « frais de patience ». Il a exigé le patron. Le patron a ri, puis il a gardé l'argent.", en: "The customer spotted the 'patience fee'. He demanded the owner. The owner laughed, then kept the money." }, fx: { happy: -3, perf: -4 } },
        ],
      },
    ],
  },

  // ───────────────────────────── tech ─────────────────────────────
  {
    id: 'wk_tech_friday',
    icon: '🔥',
    cat: 'work',
    rating: 0,
    scene: { place: 'office', mood: 'shock', prop: 'laptop', fx: 'fire' },
    when: { age: [18, 75], job: ['developer', 'engineer'] },
    weight: 9,
    cooldown: 3,
    text: {
      fr: ["Vendredi, 17 h 55. Tu viens de déployer « une petite correction » en production. Le site de {employer} affiche une page blanche avec le mot « banane ». Tu ne sais pas d'où il sort.", "Vendredi soir, alerte rouge : la prod de {employer} est tombée. Le canal #incidents explose. Le dernier commit, intitulé « petit fix, rien de grave », porte ton nom."],
      en: ["Friday, 5:55 p.m. You just deployed 'a tiny fix' to production. {employer}'s website now shows a blank page with the word 'banana'. You have no idea where it came from.", "Friday night, red alert: {employer}'s production is down. The #incidents channel is exploding. The last commit, titled 'small fix, nothing major', has your name on it."],
    },
    choices: [
      {
        label: { fr: 'Rollback héroïque', en: 'Heroic rollback' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "Rollback en quatre minutes, en pyjama, d'une main, l'autre tenant une part de pizza. Le site est revenu. Je suis une légende du canal #incidents.", en: 'Rollback in four minutes, in pajamas, one-handed, the other holding a pizza slice. The site is back. I am a legend of #incidents.' }, fx: { perf: 10, happy: 6, stress: 4 }, mood: 'proud' },
          { w: 1, text: { fr: "Le rollback a aussi supprimé la base clients. Et sa sauvegarde. J'ai passé le week-end avec le DSI, qui pleurait doucement dans sa capuche.", en: 'The rollback also deleted the customer database. And its backup. I spent the weekend with the CTO, who wept quietly into his hoodie.' }, fx: { perf: -10, stress: 15, happy: -6 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Accuser le cache', en: 'Blame the cache' }, text: { fr: "J'ai écrit « sûrement un problème de cache » et éteint mon téléphone. Lundi, tout remarchait. Personne ne sait pourquoi, surtout pas moi.", en: "I wrote 'probably a cache issue' and turned off my phone. On Monday, everything worked again. Nobody knows why, least of all me." }, fx: { stress: -2, perf: -2, happy: 4 } },
      { label: { fr: 'Fuir en week-end', en: 'Flee for the weekend' }, text: { fr: "J'ai mis mon statut sur « en déplacement » et fui à la campagne. Lundi : 312 notifications, un ticket à mon nom et un gâteau d'adieu préparé « au cas où ».", en: "I set my status to 'traveling' and fled to the countryside. Monday: 312 notifications, a ticket with my name on it and a farewell cake baked 'just in case'." }, fx: { perf: -8, stress: 8, happy: 3 } },
    ],
  },
  {
    id: 'wk_tech_crypto',
    icon: '🪙',
    cat: 'work',
    rating: 1,
    vars: { amount: [2000, 30000] },
    scene: { place: 'office', mood: 'party', prop: 'rocket', fx: 'money' },
    when: { age: [18, 75], job: 'cat:tech', era: [2015, 2200] },
    weight: 7,
    cooldown: 6,
    text: {
      fr: ["Un CEO de 24 ans en claquettes veut te recruter pour sa start-up crypto, le $BANANECOIN. Il promet « la décentralisation de la banane ». Le salaire est payé en jetons.", "Le nouveau CEO de ta boîte tient ses réunions depuis son jacuzzi, place le mot « Lambo » dans chaque phrase et propose de payer les salaires en $BANANECOIN, sa propre crypto."],
      en: ["A 24-year-old CEO in slides wants to hire you for his crypto startup, $BANANACOIN. He promises 'the decentralization of the banana'. Salary is paid in tokens.", "Your company's new CEO holds meetings from his hot tub, says 'Lambo' in every sentence and proposes paying salaries in $BANANACOIN, his very own crypto."],
    },
    choices: [
      {
        label: { fr: 'Prendre les jetons', en: 'Take the tokens' },
        out: [
          { w: 1, text: { fr: "Payé{|e} en $BANANECOIN. Le cours a fait x400 en une semaine. J'ai tout revendu à temps : {$amount}. Le CEO, lui, est en fuite aux Bahamas.", en: 'Paid in $BANANACOIN. It went 400x in a week. I sold in time: {$amount}. The CEO is now on the run in the Bahamas.' }, fx: { money: 'amount', happy: 12 }, mood: 'party' },
          { w: 2, text: { fr: "Le $BANANECOIN s'est effondré en direct pendant une réunion. Le CEO a dit « HODL » en pleurant, puis il a disparu avec la trésorerie. On s'est partagé les plantes vertes.", en: "$BANANACOIN crashed live during a meeting. The CEO said 'HODL' through tears, then vanished with the treasury. We split the office plants." }, fx: { money: -1000, happy: -10, stress: 8 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Exiger un vrai salaire', en: 'Demand real money' }, text: { fr: "J'ai réclamé un salaire en vraie monnaie. Le CEO m'a regardé{|e} avec pitié et m'a traité{|e} de « boomer ». Il a sorti ça avec une totale sincérité.", en: "I asked to be paid in real money. The CEO looked at me with pity and called me a 'boomer'. He meant it sincerely." }, fx: { happy: -2, perf: -3, karma: 2 } },
      { label: { fr: 'Le signaler au régulateur', en: 'Report him to regulators' }, text: { fr: "J'ai signalé la start-up au régulateur financier. Le CEO a été arrêté en plein live. 400 000 spectateurs : son record personnel.", en: 'I reported the startup to financial regulators. The CEO was arrested mid-livestream. 400,000 viewers: his personal best.' }, fx: { karma: 8, happy: 6, fame: 1 } },
    ],
  },

  // ───────────────────────────── education ─────────────────────────────
  {
    id: 'wk_edu_kids',
    icon: '🧒',
    cat: 'work',
    rating: 2,
    scene: { place: 'school', mood: 'angry', prop: 'chalkboard', fx: 'poop' },
    when: { age: [21, 75], job: 'teacher' },
    weight: 9,
    cooldown: 3,
    text: {
      fr: ["Ta classe est en feu, au sens propre : Kylian a enflammé une poubelle avec une loupe, Lou-Ann a mordu un camarade et quelqu'un a fait caca dans le terrarium du phasme.", "Lundi matin, ta classe t'accueille avec un seau de colle au-dessus de la porte. Le hamster est mort pendant le week-end ; Enzo jure qu'il « dort ». Ça sent très fort."],
      en: ["Your class is on fire, literally: Kyle set a trash can alight with a magnifying glass, Lola bit a classmate and someone pooped in the stick insect's terrarium.", "Monday morning, your class greets you with a bucket of glue over the door. The class hamster died over the weekend; Ethan swears it's 'sleeping'. It reeks."],
    },
    choices: [
      {
        label: { fr: 'Hurler', en: 'Scream' },
        out: [
          { w: 1, text: { fr: "J'ai hurlé si fort que les vitres ont tremblé. Silence total pendant quatre secondes. Puis un élève a pété, et la classe a explosé de rire. J'ai perdu.", en: 'I screamed so loud the windows shook. Total silence for four seconds. Then a kid farted, and the class exploded with laughter. I lost.' }, fx: { stress: 10, happy: -6 } },
          { w: 1, text: { fr: "J'ai hurlé. Un parent l'a vu sur TikTok le soir même. Convocation par l'inspection pour « violence vocale ».", en: "I screamed. A parent saw it on TikTok that same evening. Summoned by the school board for 'vocal violence'." }, fx: { perf: -8, stress: 10 } },
        ],
      },
      { label: { fr: 'Mettre un film', en: 'Put on a movie' }, text: { fr: "J'ai lancé un documentaire sur les dinosaures et me suis caché{|e} derrière le bureau avec mon thermos de « café ». C'était du rosé. Personne ne doit savoir.", en: "I put on a dinosaur documentary and hid behind my desk with my thermos of 'coffee'. It was rosé. Nobody can ever know." }, fx: { happy: 6, stress: -6, karma: -3, addiction: ['alcohol', 5] } },
      {
        label: { fr: 'Méthode militaire', en: 'Military discipline' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: "Discipline de caserne : rangs, appel, sifflet. Les gamins m'adorent et m'appellent « mon général ». Un parent a porté plainte, deux ont demandé des cours particuliers.", en: "Boot-camp discipline: lines, roll call, whistle. The kids love me and call me 'General'. One parent complained, two asked for private lessons." }, fx: { perf: 8, discipline: 3 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai sorti le sifflet. Ils me l'ont volé. Puis mes clés. Puis ma voiture, je crois. Je n'ai pas encore osé vérifier.", en: "I pulled out the whistle. They stole it. Then my keys. Then my car, I think. I haven't dared to check." }, fx: { happy: -8, stress: 8 } },
        ],
      },
    ],
  },
  {
    id: 'wk_edu_parents',
    icon: '👪',
    cat: 'work',
    rating: 0,
    scene: { place: 'school', mood: 'neutral', prop: 'desk' },
    when: { age: [21, 75], job: 'teacher' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["Réunion parents-profs. La mère de Timéo est persuadée que son fils est « haut potentiel ». Timéo mange ses crayons et appelle le tableau « maman ».", "Réunion parents-profs. Un père conteste le 4/20 de sa fille avec un rapport d'avocat de 12 pages, reliure spirale."],
      en: ["Parent-teacher night. Timmy's mom is convinced her son is 'gifted'. Timmy eats his crayons and calls the whiteboard 'mommy'.", "Parent-teacher night. A father is contesting his daughter's F with a 12-page legal brief, spiral-bound."],
    },
    choices: [
      {
        label: { fr: 'Dire la vérité', en: 'Tell the truth' },
        out: [
          { w: 1, text: { fr: "J'ai expliqué avec tact que leur enfant était un enfant normal. La mère a hurlé, le père a filmé, et le rectorat m'a écrit le lendemain.", en: 'I tactfully explained their child is a normal child. The mother screamed, the father filmed, and the district emailed me the next day.' }, fx: { perf: -5, stress: 6, karma: 3 } },
          { w: 1, text: { fr: "J'ai dit la vérité. Contre toute attente, ils m'ont remercié{|e} et apporté des chocolats. Je les ai mangés en me méfiant.", en: 'I told the truth. Against all odds, they thanked me and brought chocolates. I ate them suspiciously.' }, fx: { happy: 6, perf: 3 } },
        ],
      },
      { label: { fr: 'Flatter les parents', en: 'Flatter the parents' }, text: { fr: "J'ai déclaré leur enfant « génie incompris ». Ils m'ont offert une boîte de chocolats. Leur génie a mangé le ruban.", en: "I declared their child a 'misunderstood genius'. They gave me a box of chocolates. Their genius ate the ribbon." }, fx: { happy: 4, karma: -2 } },
      { label: { fr: 'Simuler une maladie', en: 'Fake being sick' }, text: { fr: "J'ai simulé une quinte de toux théâtrale et je suis rentré{|e}. La réunion a eu lieu sans moi. Ils ont voté pour m'apporter de la soupe.", en: 'I faked a theatrical coughing fit and went home. The meeting happened without me. They voted to bring me soup.' }, fx: { happy: 3, perf: -3 } },
    ],
  },

  // ───────────────────────────── art & media ─────────────────────────────
  {
    id: 'wk_art_redcarpet',
    icon: '🎞️',
    cat: 'work',
    rating: 1,
    scene: { place: 'studio', mood: 'proud', prop: 'red_carpet', fx: 'confetti' },
    when: { age: [18, 80], job: 'actor' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["Tapis rouge pour l'avant-première d'un film où tu joues « Passant n°4 ». 200 photographes. Ta tenue de créateur ne tient qu'avec du scotch double face.", "Festival de cinéma : tu montes les marches devant les caméras du monde entier. Ta tenue, prêtée par un grand couturier, coûte plus cher que ton appart et tient grâce à trois bouts de scotch."],
      en: ["Red carpet for the premiere of a film where you play 'Passerby #4'. 200 photographers. Your designer outfit is held together with double-sided tape.", "Film festival: you walk the red steps in front of the world's cameras. Your outfit, on loan from a fashion house, costs more than your apartment and is held up by three bits of tape."],
    },
    choices: [
      {
        label: { fr: 'Prendre la pose', en: 'Strike a pose' },
        out: [
          { w: 1, text: { fr: "Le scotch a lâché au 47e flash. Ma tenue est tombée en direct. Je suis l'image la plus partagée du festival, et pas pour mon jeu.", en: 'The tape gave out at the 47th flash. My outfit dropped live. I am the most shared image of the festival, and not for my acting.' }, fx: { fame: 8, followers: 20000, happy: -4, looks: 2 }, mood: 'shock' },
          { w: 2, text: { fr: "Pose iconique : une main sur la hanche, l'autre sur l'épaule d'une star qui n'avait aucune idée de qui j'étais. Photo de l'année.", en: "Iconic pose: one hand on my hip, the other on the shoulder of a star who had no idea who I was. Photo of the year." }, fx: { fame: 6, followers: 8000, happy: 8 }, mood: 'proud' },
        ],
      },
      {
        label: { fr: 'Trébucher exprès', en: 'Trip on purpose' },
        out: [
          { w: 1, text: { fr: "Chute calculée dans les marches. Buzz mondial. Un réalisateur m'a proposé un rôle de cascad{eur|euse}.", en: 'A calculated fall down the steps. Worldwide buzz. A director offered me a stunt role.' }, fx: { fame: 6, perf: 6, health: -3 } },
          { w: 1, text: { fr: "Ma chute « contrôlée » s'est terminée sur le nez, qui a fait un bruit de biscotte. On voit l'intérieur de ma narine à la une de tous les magazines.", en: "My 'controlled' fall ended on my nose, which made a cracker-crunch sound. The inside of my nostril is on every magazine cover." }, fx: { health: -8, looks: -6, fame: 5 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Parler à la presse', en: 'Talk to the press' }, text: { fr: "J'ai donné dix minutes d'interview sur mon « processus créatif » pour un rôle de quatre secondes. Le journaliste dormait debout. Diffusion : trois secondes.", en: "I gave a ten-minute interview about my 'creative process' for a four-second role. The reporter fell asleep standing. Airtime: three seconds." }, fx: { fame: 1, happy: 2 } },
    ],
  },
  {
    id: 'wk_media_scandal',
    icon: '📰',
    cat: 'work',
    rating: 1,
    vars: { amount: [10000, 60000] },
    scene: { place: 'office', mood: 'shock', prop: 'newspaper' },
    when: { age: [20, 80], job: 'cat:media' },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Une source anonyme t'envoie des photos d'un ministre faisant du jet-ski avec l'argent d'un hôpital. Ton rédac' chef sue à grosses gouttes.", "Tu tiens le scoop de ta vie : le patron le plus admiré du pays s'est fait construire un bunker de luxe avec la caisse de retraite de ses salariés. Il t'appelle personnellement pour « discuter »."],
      en: ['An anonymous source sends you photos of a cabinet minister jet-skiing on a hospital\'s budget. Your editor is sweating buckets.', "You've got the scoop of a lifetime: the country's most admired CEO built a luxury bunker with his employees' pension fund. He calls you personally to 'talk'."],
    },
    choices: [
      {
        label: { fr: 'Publier', en: 'Publish it' },
        out: [
          { w: 2, text: { fr: "J'ai publié. Démission, enquête, perquisition. Je suis invité{|e} sur tous les plateaux. Ma mère a enfin compris mon métier.", en: 'I published. Resignation, investigation, police raid. I am booked on every talk show. My mom finally understands my job.' }, fx: { fame: 10, perf: 12, karma: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai publié. Les photos avaient été truquées par un ado de 14 ans. J'ai fait la une… des autres journaux.", en: 'I published. The photos had been faked by a 14-year-old. I made the front page… of every other paper.' }, fx: { fame: 4, perf: -12, happy: -10 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Accepter le pot-de-vin', en: 'Take the hush money' }, text: { fr: "J'ai accepté {$amount} pour enterrer l'affaire. Je dors mal, mais dans un lit beaucoup plus cher.", en: 'I took {$amount} to bury the story. I sleep badly, but in a much more expensive bed.' }, fx: { money: 'amount', karma: -12 } },
      { label: { fr: 'En faire du putaclic', en: 'Turn it into clickbait' }, text: { fr: "J'ai titré « Vous ne croirez JAMAIS ce que ce puissant fait de votre argent (le n°7 va vous choquer) ». 5 millions de clics. Mon diplôme de journalisme s'est autodétruit.", en: "I headlined it 'You Will NEVER Believe What This Big Shot Does With Your Money (#7 Will Shock You)'. 5 million clicks. My journalism degree self-destructed." }, fx: { perf: 6, karma: -4, fame: 2, happy: 4 } },
    ],
  },
  {
    id: 'wk_art_audition',
    icon: '🎭',
    cat: 'work',
    rating: 2,
    vars: { amount: [2000, 20000] },
    scene: { place: 'studio', mood: 'shock', prop: 'camera' },
    when: { age: [18, 80], job: 'actor' },
    weight: 7,
    cooldown: 5,
    text: {
      fr: ["Ton agent t'a décroché un casting : pub nationale pour une crème contre les hémorroïdes. Le réalisateur veut « plus de vérité dans la douleur ».", "Casting pour une pub de papier toilette. Le réalisateur te demande d'exprimer face caméra « la joie d'une selle réussie ». Il y a 300 candidats, tous très concentrés."],
      en: ["Your agent landed you an audition: a national ad for hemorrhoid cream. The director wants 'more truth in the pain'.", "Audition for a toilet paper commercial. The director asks you to express, straight to camera, 'the joy of a successful bowel movement'. There are 300 candidates, all very focused."],
    },
    choices: [
      {
        label: { fr: 'Vivre le rôle', en: 'Method acting' },
        out: [
          { w: 2, text: { fr: "J'ai poussé si fort pour « la vérité de la scène » que j'ai vraiment fait dans mon froc. Le réalisateur a pleuré. J'ai eu le rôle, et un pantalon neuf.", en: "I pushed so hard for 'the truth of the scene' that I actually crapped my pants. The director wept. I got the part, and new pants." }, fx: { perf: 10, money: 3000, fame: 3, happy: -2, visual: 'poop' } },
          { w: 1, text: { fr: "J'ai joué avec une telle intensité que le réalisateur a appelé une ambulance. On m'a quand même gardé{|e}. Ma grimace est sur tous les abribus du pays.", en: 'I acted with such intensity that the director called an ambulance. They still cast me. My grimace is on every bus shelter in the country.' }, fx: { fame: 6, perf: 6, happy: -4 } },
        ],
      },
      { label: { fr: 'Négocier mon cachet', en: 'Negotiate my fee' }, text: { fr: "J'ai accepté d'être le visage de la marque pour {$amount}. Désormais, dans la rue, des inconnus me crient « Ça va mieux, le derrière ? ».", en: "I agreed to be the face of the brand for {$amount}. Now strangers yell 'How's the butt doing?' at me in the street." }, fx: { money: 'amount', fame: 4, happy: -3 } },
      { label: { fr: 'Refuser par dignité', en: 'Refuse with dignity' }, text: { fr: "J'ai refusé par dignité. Le rôle est allé à mon pire rival, devenu célèbre, qui vient de s'acheter une villa avec une piscine en forme de fesses.", en: 'I refused out of dignity. The part went to my worst rival, who became famous and just bought a villa with a butt-shaped pool.' }, fx: { happy: -6, karma: 2 } },
    ],
  },

  // ───────────────────────────── finance ─────────────────────────────
  {
    id: 'wk_fin_insider',
    icon: '📈',
    cat: 'work',
    rating: 1,
    vars: { amount: [20000, 120000] },
    scene: { place: 'office', mood: 'neutral', prop: 'phone', fx: 'money' },
    when: { age: [22, 75], job: 'cat:finance', noFlag: 'wk_insider' },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Au golf, un PDG éméché te glisse que sa boîte sera rachetée lundi. « Mais je t'ai rien dit, hein. » Il te l'a dit trois fois.", "Un ancien camarade de promo, désormais au conseil d'administration d'un labo pharmaceutique, t'écrit : « Achète. Tout. Avant mardi. Efface ce message. »"],
      en: ["On the golf course, a tipsy CEO whispers that his company is being acquired on Monday. 'But you didn't hear it from me.' He has said it three times.", "An old classmate, now on the board of a pharmaceutical company, texts you: 'Buy. Everything. Before Tuesday. Delete this message.'"],
    },
    choices: [
      {
        label: { fr: 'Acheter massivement', en: 'Buy big' },
        out: [
          { w: 2, text: { fr: "J'ai acheté massivement. Le titre a bondi de 60 %. J'ai gagné {$amount} et un léger tic à l'œil gauche à chaque coup de sonnette.", en: 'I bought big. The stock jumped 60%. I made {$amount} and a slight left-eye twitch every time the doorbell rings.' }, fx: { money: 'amount', karma: -8, flag: 'wk_insider', schedule: { key: 'wk_fin_insider_probe', years: 1 } }, mood: 'party' },
          { w: 1, text: { fr: "J'ai tout misé. Le rachat a été annulé le dimanche soir. J'ai perdu une fortune, et le PDG ne se souvient même pas de m'avoir parlé.", en: "I went all in. The deal fell through on Sunday night. I lost a fortune, and the CEO doesn't even remember talking to me." }, fx: { money: -15000, happy: -12, stress: 10 }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Acheter un tout petit peu', en: 'Buy just a little' }, text: { fr: "J'ai acheté un tout petit peu, « pour voir ». J'ai gagné de quoi payer un bon resto, et je sursaute dès qu'on prononce le mot « régulateur ».", en: "I bought just a little, 'to see'. I made enough for a nice dinner, and I flinch whenever someone says the word 'regulator'." }, fx: { money: 2000, karma: -3, stress: 3 } },
      { label: { fr: 'Ignorer le tuyau', en: 'Ignore the tip' }, text: { fr: "J'ai ignoré le tuyau. Le titre a doublé. Mes collègues ont acheté des voitures. Moi, j'ai une conscience. Elle prend le bus.", en: 'I ignored the tip. The stock doubled. My coworkers bought cars. I have a conscience. It takes the bus.' }, fx: { karma: 6, happy: -3 } },
    ],
  },
  {
    id: 'wk_fin_insider_probe',
    icon: '🕵️',
    cat: 'work',
    rating: 1,
    chainOnly: true,
    vars: { amount: [8000, 40000] },
    scene: { place: 'court', mood: 'shock', prop: 'folder', fx: 'police' },
    when: { flag: 'wk_insider' },
    text: {
      fr: ["Deux enquêteurs du régulateur financier t'attendent devant chez toi. Ils ont un classeur à ton nom et des chaussures très bien cirées. Ils parlent de « transactions remarquablement chanceuses ».", "Le gendarme de la Bourse te convoque. Sur la table : le relevé de tes achats de l'an dernier, surligné au fluo, et une photo de toi au golf."],
      en: ["Two investigators from the financial regulator are waiting outside your home. They have a binder with your name on it and very shiny shoes. They mention 'remarkably lucky trades'.", "The securities regulator summons you. On the table: last year's trading records, highlighted, and a photo of you on the golf course."],
    },
    choices: [
      {
        label: { fr: 'Tout nier', en: 'Deny everything' },
        out: [
          { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai parlé d'« intuition » et de « méthode d'analyse propriétaire » pendant trois heures. Ils sont repartis épuisés. Dossier classé.", en: "I talked about 'intuition' and a 'proprietary analysis method' for three hours. They left exhausted. Case closed." }, fx: { stress: 8, unflag: 'wk_insider' } },
          { w: 1, text: { fr: "J'ai tout nié. Hélas, j'avais tout résumé dans un mail intitulé « délit d'initié lol ». Menottes.", en: "I denied everything. Sadly, I had summarized it all in an email titled 'insider trading lol'. Handcuffs." }, fx: { arrest: 'embezzle', unflag: 'wk_insider', stress: 15 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Balancer le tuyau', en: 'Rat out my source' }, text: { fr: "J'ai tout balancé sur ma source. Elle a pris quatre ans. Moi, une amende salée et une interdiction de golf à vie. Le vrai châtiment.", en: 'I gave up my source. They got four years. I got a hefty fine and a lifetime golf ban. The real punishment.' }, fx: { money: -10000, karma: 2, happy: -4, unflag: 'wk_insider' } },
      { label: { fr: 'Prendre un avocat requin', en: 'Hire a shark lawyer' }, text: { fr: "J'ai engagé l'avocat le plus cher du pays. Il a facturé {$amount} et fait annuler la procédure pour une faute de frappe sur mon nom. Magique.", en: 'I hired the most expensive lawyer in the country. He billed {$amount} and got the case thrown out over a typo in my name. Magic.' }, fx: { money: '-amount', stress: -5, unflag: 'wk_insider' } },
    ],
  },
  {
    id: 'wk_fin_coke',
    icon: '❄️',
    cat: 'work',
    rating: 2,
    scene: { place: 'office', mood: 'party', prop: 'screens', fx: 'money' },
    when: { age: [22, 75], job: 'cat:finance' },
    weight: 7,
    cooldown: 4,
    text: {
      fr: ["Salle des marchés, 23 h. Tes collègues traders ont transformé l'étage en boîte de nuit : champagne, hurlements, et une ligne de poudre sur la photo de famille du directeur.", "Ton desk vient de gagner 40 millions en une nuit. Brad, ton voisin, sort un sachet de « sucre glace colombien » et hurle déjà « ACHÈTE, SALOPE ! » à ses six écrans."],
      en: ["Trading floor, 11 p.m. Your trader colleagues have turned the floor into a nightclub: champagne, screaming, and a line of powder on the director's family photo.", "Your desk just made 40 million in one night. Brad, at the next desk, pulls out a baggie of 'Colombian powdered sugar' and is already screaming 'BUY, BITCH!' at his six monitors."],
    },
    choices: [
      {
        label: { fr: 'Suivre le mouvement', en: 'Join in' },
        out: [
          { w: 2, text: { fr: "J'ai passé la nuit à hurler des ordres au hasard, à danser sur un bureau et à appeler ma grand-mère 40 fois pour lui dire que je l'aimais. J'ai fait gagner 2 millions à la banque. Mon nez saigne encore.", en: 'I spent the night screaming random orders, dancing on a desk and calling my grandma 40 times to tell her I love her. I made the bank 2 million. My nose is still bleeding.' }, fx: { addiction: ['drugs', 15], perf: 10, health: -8, happy: 8, karma: -4 }, mood: 'party' },
          { w: 1, text: { fr: "Mon cœur s'est mis à jouer de la techno. Je me suis réveillé{|e} aux urgences, une infirmière me tenait la main en soupirant « encore un trader ».", en: "My heart started playing techno. I woke up in the ER with a nurse holding my hand, sighing 'another trader'." }, fx: { addiction: ['drugs', 10], health: -15, happy: -6, stress: 6 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Rester clean', en: 'Stay clean' },
        out: [
          { w: 1, text: { fr: "J'étais la seule personne lucide quand Brad a vendu toute la trésorerie pour acheter des actions d'une marque de slips. J'ai annulé l'ordre. Promotion pour avoir sauvé la banque.", en: 'I was the only lucid person when Brad sold the entire treasury to buy shares in an underwear brand. I cancelled the order. Promoted for saving the bank.' }, fx: { promote: true, perf: 10, happy: 6, karma: 4 }, mood: 'proud' },
          { w: 2, text: { fr: "Je suis resté{|e} à l'eau gazeuse. On m'a appelé{|e} « le stagiaire » toute la nuit et on a versé du champagne dans ma sacoche. Bonus annuel : celui des gens chiants.", en: "I stuck to sparkling water. They called me 'the intern' all night and poured champagne into my briefcase. Annual bonus: the boring-person tier." }, fx: { happy: -4, perf: -2 } },
        ],
      },
      { label: { fr: 'Filmer pour faire chanter', en: 'Film it for leverage' }, text: { fr: "J'ai tout filmé en douce. Brad m'a cédé sa Porsche contre la vidéo. Il pleurait en me donnant les clés. Elle sent la poudre et le désespoir.", en: 'I filmed everything on the sly. Brad gave me his Porsche in exchange for the video. He cried handing me the keys. It smells of powder and despair.' }, fx: { asset: 'c_porsche', karma: -10, happy: 10 } },
    ],
  },

  // ───────────────────────────── trades ─────────────────────────────
  {
    id: 'wk_trade_pipe',
    icon: '🪠',
    cat: 'work',
    rating: 2,
    scene: { place: 'apartment', mood: 'shock', prop: 'pipe', fx: 'poop' },
    when: { age: [18, 75], job: 'plumber' },
    weight: 9,
    cooldown: 3,
    text: {
      fr: ["Intervention pour une canalisation bouchée. La cliente jure n'avoir « rien jeté de spécial ». Ta caméra d'inspection filme un truc qui bouge. Avec des dents.", "Les toilettes d'un restaurant de fruits de mer refoulent depuis trois jours. Tu ouvres la canalisation principale. Quelque chose, au fond, te regarde."],
      en: ["Call-out for a blocked pipe. The client swears she 'didn't flush anything special'. Your inspection camera shows something moving. With teeth.", 'The toilets at a seafood restaurant have been backing up for three days. You open the main drain. Something down there is looking at you.'],
    },
    choices: [
      {
        label: { fr: 'Plonger la main', en: 'Reach in by hand' },
        out: [
          { w: 2, text: { fr: "J'ai plongé le bras jusqu'à l'épaule. Butin : un dentier, trois peluches, un téléphone qui sonnait encore et un python très contrarié. Facture salée.", en: 'I went in up to the shoulder. Haul: a set of dentures, three stuffed animals, a phone that was still ringing and a very annoyed python. Hefty bill.' }, fx: { money: 600, happy: 4, health: -4, visual: 'poop' } },
          { w: 1, text: { fr: "J'ai mis la main. Ça m'a mordu{|e}. La créature a gardé le bout de mon index en souvenir. La cliente m'a proposé un pansement à licornes.", en: 'I reached in. It bit me. The creature kept the tip of my index finger as a souvenir. The client offered me a unicorn Band-Aid.' }, fx: { disease: 'missing_finger', health: -10, visual: 'gore' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Haute pression', en: 'High-pressure blast' },
        out: [
          { w: 1, text: { fr: "J'ai envoyé la haute pression. Un grondement, puis toute la tuyauterie de l'immeuble a vomi d'un coup. Trois étages repeints en marron. Les voisins applaudissaient de dégoût.", en: 'I hit it with the high-pressure jet. A rumble, then the entire building\'s plumbing vomited at once. Three floors repainted brown. The neighbors applauded in disgust.' }, fx: { happy: -6, looks: -3, perf: -4, visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: "Haute pression : la chose a été propulsée dans les égouts municipaux avec un cri strident. Problème réglé. Pour la cliente, en tout cas. Pour la ville, on verra.", en: "High pressure: the thing was blasted into the city sewers with a shriek. Problem solved. For the client, anyway. The city's on its own." }, fx: { happy: 6, money: 400, karma: -2 } },
        ],
      },
      { label: { fr: 'Facturer et fuir', en: 'Bill and run' }, text: { fr: "J'ai diagnostiqué un « problème structurel », facturé le déplacement, l'expertise et la « prime de courage », puis je suis parti{|e} en courant. Ça bouge toujours là-dedans.", en: "I diagnosed a 'structural issue', billed the call-out, the inspection and a 'bravery surcharge', then ran. It's still moving in there." }, fx: { money: 350, karma: -5, happy: 3 } },
    ],
  },
  {
    id: 'wk_trade_nailgun',
    icon: '🔨',
    cat: 'work',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'nailgun', fx: 'gore' },
    when: { age: [18, 75], job: 'construction' },
    weight: 9,
    cooldown: 3,
    text: {
      fr: ["Sur le chantier, ton collègue Momo fait le malin avec le pistolet à clous : « Regarde, je vise la mouette ! » La mouette est perchée juste au-dessus de ta tête.", "Pause déj sur le chantier. Momo a récupéré le pistolet à clous pour se venger de la mouette qui lui a volé son sandwich hier. Elle s'est posée sur l'échafaudage, pile au-dessus de toi."],
      en: ["On the site, your coworker Mo is showing off with the nail gun: 'Watch, I'm gonna hit the seagull!' The seagull is perched right above your head.", 'Lunch break on site. Mo grabbed the nail gun to get revenge on the seagull that stole his sandwich yesterday. It just landed on the scaffolding, right above you.'],
    },
    choices: [
      {
        label: { fr: 'Esquiver', en: 'Dodge' },
        out: [
          { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai plongé derrière une bétonnière. Le clou s'est planté dans le sandwich du chef de chantier. Le chef s'est planté dans Momo. Belle journée.", en: "I dove behind a cement mixer. The nail lodged in the foreman's sandwich. The foreman lodged himself in Mo. Lovely day." }, fx: { happy: 6, athletic: 2 } },
          { w: 1, text: { fr: "J'ai esquivé à gauche. Le clou aussi. Il m'a cloué l'oreille à une planche. Je suis resté{|e} coincé{|e} une heure pendant que les collègues faisaient des selfies.", en: 'I dodged left. So did the nail. It nailed my ear to a plank. I was stuck there for an hour while my coworkers took selfies.' }, fx: { health: -8, looks: -3, happy: -6, visual: 'gore' }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Confisquer le pistolet', en: 'Confiscate the gun' },
        out: [
          { w: 1, text: { fr: "En arrachant le pistolet des mains de Momo, le coup est parti. Mon gros orteil est désormais fixé à ma chaussure de sécurité, définitivement. Trois semaines d'arrêt à regarder des documentaires.", en: 'As I yanked the gun from Mo, it went off. My big toe is now permanently fixed to my safety boot. Three weeks of paid leave watching documentaries.' }, fx: { health: -10, happy: 2, stress: -6, visual: 'gore' }, mood: 'shock' },
          { w: 2, text: { fr: "J'ai confisqué le pistolet avec autorité. Le chef m'a nommé{|e} responsable sécurité. Le premier du chantier en quinze ans.", en: "I confiscated the gun with authority. The foreman made me safety officer. The site's first in fifteen years." }, fx: { perf: 8, karma: 3 }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Parier sur la mouette', en: 'Bet on the seagull' }, text: { fr: "J'ai parié 20 balles sur la mouette. Elle a gagné : elle a chié sur Momo et s'est envolée avec son jambon-beurre. Je respecte la mouette.", en: 'I bet 20 bucks on the seagull. It won: it shat on Mo and flew off with his ham sandwich. I respect the seagull.' }, fx: { happy: 8, money: 20 }, mood: 'party' },
    ],
  },
  {
    id: 'wk_trade_client',
    icon: '🧰',
    cat: 'work',
    rating: 0,
    scene: { place: 'home', mood: 'neutral', prop: 'toolbox' },
    when: { age: [18, 75], job: 'cat:trade' },
    weight: 9,
    cooldown: 3,
    text: {
      fr: ["Un client te regarde travailler depuis deux heures, bras croisés, en commentant chaque geste : « Moi, j'aurais fait autrement. » Il est expert-comptable.", "Un client t'explique ton métier en s'appuyant sur une vidéo de trois minutes vue sur internet. Il veut « juste un petit devis, pas cher »."],
      en: ["A client has been watching you work for two hours, arms crossed, commenting on every move: 'I'd have done it differently.' He's an accountant.", "A client explains your own job to you based on a three-minute video he watched online. He wants 'just a quick quote, nothing pricey'."],
    },
    choices: [
      {
        label: { fr: "Lui tendre l'outil", en: 'Hand him the tool' },
        out: [
          { w: 2, text: { fr: "« Allez-y, montrez-moi. » Il a inondé sa cuisine en 40 secondes. J'ai facturé le double, avec le sourire.", en: "'Go ahead, show me.' He flooded his kitchen in 40 seconds. I charged double, with a smile." }, fx: { money: 400, happy: 8 }, mood: 'happy' },
          { w: 1, text: { fr: "Je lui ai tendu l'outil. Il a réussi du premier coup. Je n'ai jamais été aussi humilié{|e}. Il m'a quand même payé{|e}, par pitié.", en: 'I handed him the tool. He nailed it on the first try. I have never been so humiliated. He paid me anyway, out of pity.' }, fx: { happy: -6, money: 100 } },
        ],
      },
      { label: { fr: 'Tarif spectateur', en: 'Charge a spectator fee' }, text: { fr: "J'ai ajouté une ligne « supplément conseils non sollicités » sur la facture. Il a payé sans broncher et demandé un reçu pour sa compta.", en: "I added an 'unsolicited advice surcharge' line to the invoice. He paid without blinking and asked for a receipt for his books." }, fx: { money: 250, happy: 5, karma: -1 } },
      { label: { fr: 'Bosser en silence', en: 'Work in silence' }, text: { fr: "J'ai bossé en silence, avec des écouteurs sans musique. Chantier fini, client ravi, ma patience a pris dix ans.", en: 'I worked in silence, wearing earbuds with no music. Job done, client happy, my patience aged ten years.' }, fx: { perf: 4, stress: 4, money: 150 } },
    ],
  },

  // ───────────────────────────── unemployed ─────────────────────────────
  {
    id: 'wk_job_center',
    icon: '🏢',
    cat: 'work',
    rating: 0,
    scene: { place: 'office', mood: 'sleepy', prop: 'ticket' },
    when: { age: [20, 60], job: false, school: 'none' },
    weight: 9,
    cooldown: 3,
    text: {
      fr: ["Rendez-vous à l'agence pour l'emploi. Ticket n°847. Le panneau affiche le 12. Ta conseillère, Martine, a une plante morte et un fond d'écran de dauphins.", "Ta conseillère emploi, Martine, te propose une formation « Devenir influenceur en milieu rural ». Elle a l'air de croire en toi. C'est presque pire."],
      en: ["Appointment at the job center. Ticket #847. The screen says 12. Your counselor, Martha, has a dead plant and a dolphin wallpaper.", "Your job counselor, Martha, suggests a training course called 'Becoming a Rural Influencer'. She seems to believe in you. That's almost worse."],
    },
    choices: [
      {
        label: { fr: 'Accepter la formation', en: 'Accept the training' },
        out: [
          { w: 2, text: { fr: "J'ai suivi la formation : tableur, lettre de motivation, et belote avec un ancien banquier. Je me sens prêt{|e}.", en: "I did the training: spreadsheets, cover letters, and card games with a former banker. I feel ready." }, fx: { smarts: 4, happy: 3, open: 'jobs' }, mood: 'proud' },
          { w: 1, text: { fr: "Trois semaines de formation sur… l'utilisation du fax. On m'a remis un diplôme sur papier glacé. Je l'ai faxé à ma mère.", en: "Three weeks of training on… using a fax machine. They gave me a glossy diploma. I faxed it to my mom." }, fx: { smarts: 1, happy: -2 } },
        ],
      },
      { label: { fr: 'Embobiner Martine', en: 'Charm my counselor' }, text: { fr: "J'ai complimenté les dauphins de Martine. Elle m'a pris{|e} sous son aile et glissé une offre « pas encore publiée ». On s'envoie des cartes postales.", en: "I complimented Martha's dolphins. She took me under her wing and slipped me an 'unpublished' listing. We send each other postcards now." }, fx: { happy: 5, open: 'jobs' } },
      { label: { fr: 'Retourner me coucher', en: 'Go back to bed' }, text: { fr: "Après quatre heures d'attente, on m'a demandé un formulaire que personne n'a pu me fournir. Je suis rentré{|e} dormir. Meilleur moment de la journée.", en: "After four hours of waiting, they asked for a form nobody could give me. I went home to sleep. Best part of the day." }, fx: { happy: -2, stress: 3 } },
    ],
  },
  {
    id: 'wk_side_hustle',
    icon: '💸',
    cat: 'work',
    rating: 1,
    vars: { amount: [100, 2500] },
    scene: { place: 'apartment', mood: 'neutral', prop: 'boxes' },
    when: { age: [20, 60], job: false, school: 'none' },
    weight: 8,
    cooldown: 4,
    text: {
      fr: ["Le chômage, c'est long. Ton cousin te propose de « rejoindre son réseau » de compléments alimentaires miracles. Il dit « je suis mon propre patron » en vapotant dans sa voiture.", "Pour arrondir les fins de mois, tu cherches une combine. Au menu : vente en réseau, revente de baskets, montage de meubles en kit pour les nuls."],
      en: ["Unemployment drags on. Your cousin invites you to 'join his network' selling miracle supplements. He says 'I'm my own boss' while vaping in his car.", "To make ends meet, you're looking for a hustle. On the menu: multi-level marketing, sneaker flipping, flat-pack furniture assembly for the hopeless."],
    },
    choices: [
      {
        label: { fr: 'Vente pyramidale', en: 'Join the MLM' },
        out: [
          { w: 2, text: { fr: "J'ai vendu trois boîtes de gélules à ma mère. Tout le reste pourrit dans mon garage. J'ai perdu {$amount} et deux amis.", en: "I sold three boxes of pills to my mom. The rest is rotting in my garage. I lost {$amount} and two friends." }, fx: { money: '-amount', happy: -6, karma: -3 } },
          { w: 1, text: { fr: "J'ai recruté 40 personnes en un mois. J'ai gagné {$amount}. Ma conscience est en PLS, mais j'ai un badge « Diamant ».", en: "I recruited 40 people in a month. I made {$amount}. My conscience is curled up in a ball, but I have a 'Diamond' badge." }, fx: { money: 'amount', karma: -8, happy: 6 } },
        ],
      },
      {
        label: { fr: 'Revendre des baskets', en: 'Flip sneakers' },
        out: [
          { w: 2, text: { fr: "J'ai campé 14 heures devant une boutique pour une édition limitée. Revendues trois fois le prix. Le loup de Wall Street, mais en chaussettes.", en: 'I camped out 14 hours for a limited edition. Flipped them for triple. The Wolf of Wall Street, but in socks.' }, fx: { money: 'amount', happy: 6, health: -2 } },
          { w: 1, text: { fr: "Les baskets achetées pour la revente étaient des contrefaçons. Le logo était écrit à l'envers. Je les porte pour faire les courses.", en: 'The sneakers I bought to resell were fakes. The logo was backward. I wear them to go grocery shopping.' }, fx: { money: '-amount', happy: -5 } },
        ],
      },
      { label: { fr: 'Monter des meubles', en: 'Assemble furniture' }, text: { fr: "J'ai monté des armoires en kit chez des inconnus. J'ai une collection de 312 vis en trop et le respect de plusieurs mamies.", en: 'I assembled flat-pack wardrobes for strangers. I now own 312 spare screws and the respect of several grannies.' }, fx: { money: 400, happy: 3, athletic: 2 } },
    ],
  },
  {
    id: 'wk_feet_pics',
    icon: '🦶',
    cat: 'work',
    rating: 2,
    vars: { amount: [500, 6000] },
    scene: { place: 'apartment', mood: 'shock', prop: 'phone', fx: 'money' },
    when: { age: [20, 60], job: false, school: 'none' },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["Un pote t'assure que des gens paient très cher pour des photos de pieds. Tu regardes tes pieds. Ils te regardent. Le loyer est en retard.", "Ton compte est à découvert et un inconnu t'écrit : « 300 balles pour une photo de tes orteils dans du flan ». Ça ne peut pas être si grave."],
      en: ["A buddy swears people pay big money for feet pics. You look at your feet. They look back. Rent is overdue.", "Your account is overdrawn and a stranger messages you: '300 bucks for a pic of your toes in custard'. How bad can it be?"],
    },
    choices: [
      {
        label: { fr: 'Ouvrir la boutique', en: 'Open for business' },
        out: [
          { w: 2, text: { fr: "J'ai lancé mon compte de photos de pieds. En un mois : {$amount}. Mes clients ont des demandes très précises au sujet de la moutarde. Je ne pose pas de questions.", en: "I launched my feet-pic account. One month: {$amount}. My clients have very specific requests involving mustard. I don't ask questions." }, fx: { money: 'amount', happy: 4, karma: -2, followers: 2000 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai posté mes pieds. Un abonné a reconnu le carrelage de ma salle de bain. C'était mon oncle. Le repas de famille a été très silencieux.", en: 'I posted my feet. A subscriber recognized my bathroom tiles. It was my uncle. Family dinner was very quiet.' }, fx: { money: 100, happy: -10, stress: 8 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Orteils dans le flan', en: 'Toes in the custard' }, text: { fr: "J'ai trempé mes orteils dans du flan pour 300 balles. L'acheteur a demandé si je pouvais « remuer un peu ». J'ai remué. Loyer payé. La dignité, c'est surcoté.", en: "I dipped my toes in custard for 300 bucks. The buyer asked if I could 'wiggle a bit'. I wiggled. Rent paid. Dignity is overrated." }, fx: { money: 300, happy: 2, karma: -1 } },
      { label: { fr: 'Garder mes pieds', en: 'Keep my feet private' }, text: { fr: "J'ai refusé. Mes pieds restent à moi. Mon proprio, lui, reste sur mon dos.", en: 'I said no. My feet stay mine. My landlord, meanwhile, stays on my back.' }, fx: { stress: 5, karma: 2 } },
    ],
  },
];
