// Step 5 actions: school life (kids → uni) and prison life extras.
import type { ActionDef, Effect, EffectCtx, Loc } from '@bl/sim';
import { clamp, living, release, renderString, L } from '@bl/sim';

/** Prison respect ±n, optionally followed by another effect function. */
const resp = (n: number, more?: (ctx: EffectCtx) => void | Loc<string>): Effect => ({
  fn: (ctx: EffectCtx) => {
    const p = ctx.life.prison;
    if (p) p.respect = clamp(p.respect + n);
    return more?.(ctx);
  },
});

/** Shorten the current sentence by n years (never below next year). */
const cut = (n: number) => ({ life }: EffectCtx) => {
  const p = life.prison;
  if (p) p.years = Math.min(p.years, Math.max(p.served + 1, p.years - n));
};

/** Relationship boost for the spouse(s), since actions have no actor. */
const spouseRel = (n: number): Effect => ({ fn: ({ life }: EffectCtx) => { for (const s of living(life, 'spouse')) s.rel = clamp(s.rel + n); } });

/** Spoon tunnel: progress is kept in a counter, the 3rd+ year may break through. */
const tunnel: Effect = {
  counter: 'pr_spoon',
  fn: ({ life, content, rand }: EffectCtx) => {
    const n = (life.counters.pr_tunnel = (life.counters.pr_tunnel ?? 0) + 1);
    if (n >= 3 && rand() < 0.45 + 0.15 * (n - 3)) {
      life.counters.pr_tunnel = 0;
      life.counters.escapes = (life.counters.escapes ?? 0) + 1;
      release(life, content, 'escape');
      return L("Et un matin, ma cuillère a percé la terre du potager du directeur. J'ai filé entre les courgettes, en pyjama orange.", "And one morning my spoon broke through into the warden's vegetable patch. I fled between the zucchini in my orange pyjamas.");
    }
    return L(`Le tunnel fait maintenant ${n * 4} mètres. J'ai mal au poignet et de la terre dans des endroits insoupçonnés.`, `The tunnel is now ${n * 13} feet long. My wrist hurts and there's dirt in places I didn't know I had.`);
  },
};
const tunnelReset = ({ life }: EffectCtx) => { life.counters.pr_tunnel = 0; };

/** Text picked by the player's taste (TA's gender), rendered for {|e} agreements. */
const taste = (m: [string, string], f: [string, string], fx: Effect = {}): Effect => ({
  ...fx,
  fn: ({ life, content, rand }: EffectCtx) => {
    const g = life.orientation === 'bi' ? (rand() < 0.5 ? 'm' : 'f') : life.orientation === 'gay' ? life.gender : life.gender === 'm' ? 'f' : 'm';
    const [fr, en] = g === 'm' ? m : f;
    return { fr: renderString(fr, { life, content }, 'fr'), en: renderString(en, { life, content }, 'en') };
  },
});
const none = { fr: '', en: '' };

const kids = ['primary', 'middle', 'high'] as const;

export const actions5: ActionDef[] = [
  // ───────────────────────────── School · rating 0
  { id: 'sc_copy_hw', tab: 'school', group: 'school', icon: '📝', label: { fr: 'Copier les devoirs', en: 'Copy homework' }, desc: { fr: 'Gain de temps, risque de honte', en: 'Saves time, risks shame' }, when: { school: ['primary', 'middle'] }, limit: 2, scene: { place: 'school' },
    out: [
      { w: 3, text: { fr: "J'ai recopié les devoirs de Kevin pendant la récré. Même ses fautes d'orthographe. Surtout ses fautes.", en: "I copied Kevin's homework at recess. Even his spelling mistakes. Especially his spelling mistakes." }, fx: { grade: 3, discipline: -1 } },
      { w: 2, text: { fr: "J'ai copié sur le premier de la classe. Il s'était trompé d'exercice. On a eu zéro tous les deux, en équipe.", en: "I copied the top student. He'd done the wrong exercise. We both got a zero, as a team." }, fx: { grade: -3, happy: -2 } },
      { w: 1, text: { fr: "Démasqué{|e} : le prof a reconnu l'écriture de ma mère. Ma mère aussi, d'ailleurs. Soirée tendue.", en: "Busted: the teacher recognised my mom's handwriting. So did my mom. Tense evening." }, fx: { grade: -4, happy: -4, discipline: 1 }, mood: 'sad' },
    ] },
  { id: 'sc_cheat', tab: 'school', group: 'school', icon: '🕵️', label: { fr: "Tricher à l'examen", en: 'Cheat on an exam' }, desc: { fr: 'Les malins s\'en sortent', en: 'Smart cheaters get away with it' }, when: { school: ['middle', 'high', 'uni'] }, limit: 1, scene: { place: 'school', mood: 'shock' },
    out: [
      { w: 2, odds: { smarts: 0.6 }, text: { fr: "J'ai écrit toutes les formules à l'intérieur de l'étiquette de ma bouteille d'eau. 18/20. Le génie, c'est aussi de la logistique.", en: 'I wrote every formula inside the label of my water bottle. A+. Genius is mostly logistics.' }, fx: { grade: 8, karma: -3 }, mood: 'proud' },
      { w: 1, text: { fr: "Mon antisèche était sur ma cuisse. J'ai transpiré. J'ai rendu une copie blanche et une cuisse couverte de théorèmes délavés.", en: 'My cheat sheet was on my thigh. I sweated. I handed in a blank paper and a thigh covered in smudged theorems.' }, fx: { grade: -3, happy: -2 } },
      { w: 1, text: { fr: "Le surveillant m'a regardé{|e} fixer ma manche pendant 40 minutes. Zéro, convocation, et mes parents parlent d'internat militaire.", en: 'The proctor watched me stare at my sleeve for 40 minutes. Zero, a meeting, and my parents are googling military school.' }, fx: { grade: -10, happy: -6, discipline: -3 }, mood: 'sad' },
      { w: 0.15, text: { fr: "Récidive de triche : conseil de discipline. Je suis viré{|e}. Mon antisèche, elle, est exposée au CDI comme une œuvre d'art.", en: 'Repeat cheating: disciplinary board. I got expelled. My cheat sheet is now framed in the library like a museum piece.' }, fx: { expel: true, happy: -8 }, mood: 'cry' },
    ] },
  { id: 'sc_drama', tab: 'school', group: 'school', icon: '🎭', label: { fr: 'Club théâtre', en: 'Drama club' }, desc: { fr: 'Gloire sur les planches', en: 'Glory on stage' }, when: { school: ['middle', 'high', 'uni'] }, limit: 1, scene: { place: 'school', mood: 'proud' },
    out: [
      { w: 3, odds: { looks: 0.4 }, text: { fr: "J'ai décroché le rôle principal du « Malade imaginaire ». Standing ovation de ma grand-mère, seule debout dans la salle.", en: 'I landed the lead in the school play. Standing ovation from my grandma, the only one standing.' }, fx: { happy: 6, fame: 2, looks: 1, counter: 'sc_stage' }, mood: 'proud' },
      { w: 2, text: { fr: "J'ai joué l'arbre n°3. J'ai été un arbre magnifique, habité, bouleversant. Personne n'a applaudi l'arbre.", en: 'I played Tree #3. I was a magnificent, haunted, devastating tree. Nobody clapped for the tree.' }, fx: { happy: 2 } },
      { w: 1, text: { fr: "J'ai oublié mon texte et improvisé dix minutes de monologue sur les coquillettes. La prof de théâtre pleure. De joie, j'espère.", en: 'I forgot my lines and improvised a ten-minute monologue about macaroni. The drama teacher is crying. Happy tears, I hope.' }, fx: { happy: -2, smarts: 1 } },
    ] },
  { id: 'sc_team', tab: 'school', group: 'school', icon: '⚽', label: { fr: 'Équipe de sport', en: 'Sports team' }, desc: { fr: 'Forme et popularité', en: 'Fitness and popularity' }, when: { school: ['middle', 'high', 'uni'] }, limit: 1, scene: { place: 'stadium', mood: 'happy' },
    out: [
      { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai marqué le but de la victoire et on m'a porté{|e} en triomphe. Puis on m'a fait tomber. Mais en triomphe.", en: 'I scored the winning goal and they carried me in triumph. Then they dropped me. But in triumph.' }, fx: { athletic: 5, happy: 6, fame: 2, counter: 'sc_wins' }, mood: 'proud' },
      { w: 2, text: { fr: "J'ai passé la saison sur le banc. J'ai le meilleur bronzage de l'équipe et un fessier en béton.", en: 'I spent the whole season on the bench. Best tan on the team, and buns of steel.' }, fx: { athletic: 1, happy: -2 } },
      { w: 1, text: { fr: "J'ai marqué contre mon camp. Deux fois. Le coach m'appelle « l'agent double ».", en: 'I scored on my own goal. Twice. The coach calls me "the double agent".' }, fx: { athletic: 2, happy: -6 }, mood: 'sad' },
      { w: 0.5, text: { fr: "Je me suis cassé le bras en célébrant un but. Le but a été refusé. Le bras, lui, est bien cassé.", en: 'I broke my arm celebrating a goal. The goal was disallowed. The arm, however, is very much broken.' }, fx: { disease: 'broken_arm', happy: -4 }, mood: 'cry' },
    ] },
  { id: 'sc_chess', tab: 'school', group: 'school', icon: '♟️', label: { fr: "Club d'échecs", en: 'Chess club' }, desc: { fr: 'Intelligence', en: 'Smarts' }, when: { school: [...kids] }, limit: 1, scene: { place: 'school', mood: 'neutral' },
    out: [
      { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai battu le président du club en 12 coups. Il a renversé le plateau et il est parti en pleurant. Échec et mat, Jean-Eudes.", en: 'I beat the club president in 12 moves. He flipped the board and left in tears. Checkmate, Kevin.' }, fx: { smarts: 4, happy: 4 }, mood: 'proud' },
      { w: 2, text: { fr: "J'ai perdu contre un gamin de huit ans qui mangeait un yaourt en même temps. Sans regarder le plateau.", en: 'I lost to an eight-year-old who was eating a yogurt at the same time. Without looking at the board.' }, fx: { smarts: 2, happy: -3 } },
      { w: 1, text: { fr: "J'ai inventé une ouverture : « le cavalier kamikaze ». Interdit{|e} à vie de la ligue régionale. Je suis une légende interdite.", en: 'I invented an opening: "the kamikaze knight". Banned for life from the regional league. A forbidden legend.' }, fx: { smarts: 1, happy: 2, fame: 1 } },
    ] },
  { id: 'sc_band', tab: 'school', group: 'school', icon: '🎺', label: { fr: "Fanfare de l'école", en: 'School band' }, desc: { fr: 'Musique et bruit', en: 'Music, mostly noise' }, when: { school: ['middle', 'high'] }, limit: 1, scene: { place: 'school', mood: 'happy' },
    out: [
      { w: 2, text: { fr: "J'ai joué du trombone au défilé. J'ai assommé un joueur de tambour au premier virage, mais en rythme.", en: 'I played trombone in the parade. Knocked out a drummer on the first turn, but on the beat.' }, fx: { happy: 4, smarts: 1 } },
      { w: 2, odds: { smarts: 0.3 }, text: { fr: "Solo de flûte à bec au concert de fin d'année. Tous les chiens du quartier ont répondu en chœur.", en: 'Recorder solo at the end-of-year concert. Every dog in the neighbourhood howled back in harmony.' }, fx: { happy: 2, fame: 1 } },
      { w: 1, text: { fr: "On m'a mis{|e} au triangle. Une seule note par morceau. Je l'ai ratée. À chaque fois.", en: 'They put me on triangle. One note per song. I missed it. Every single time.' }, fx: { happy: -3 }, mood: 'sad' },
    ] },
  { id: 'sc_president', tab: 'school', group: 'school', icon: '🗳️', label: { fr: 'Élection des délégués', en: 'Run for class president' }, desc: { fr: 'Popularité requise', en: 'Popularity required' }, when: { school: ['middle', 'high'] }, limit: 1, scene: { place: 'school', mood: 'proud' },
    out: [
      { w: 2, odds: { looks: 0.5 }, text: { fr: "J'ai promis des frites tous les jours et la fin des contrôles surprise. Élu{|e} à 94 %. Je n'ai tenu aucune promesse. Je suis prêt{|e} pour la politique.", en: 'I promised fries every day and no more pop quizzes. Elected with 94%. Kept zero promises. I am ready for politics.' }, fx: { fame: 4, happy: 6, flag: 'sc_president' }, mood: 'proud' },
      { w: 2, text: { fr: "J'ai perdu contre un élève qui distribuait des Kinder. On ne lutte pas contre le lobby du Kinder.", en: 'I lost to a kid handing out candy bars. You cannot fight the candy lobby.' }, fx: { happy: -4 } },
      { w: 1, text: { fr: "Pendant mon discours, j'ai déclenché l'alarme incendie « pour l'effet dramatique ». Disqualifié{|e} et évacué{|e}.", en: 'During my speech I pulled the fire alarm "for dramatic effect". Disqualified and evacuated.' }, fx: { happy: -3, discipline: -2 } },
      { w: 0.4, text: { fr: "Une seule voix : la mienne. Même mon meilleur ami a voté contre moi. Il dit que c'était « stratégique ».", en: 'One vote: mine. Even my best friend voted against me. He says it was "strategic".' }, fx: { happy: -8 }, mood: 'cry' },
    ] },
  { id: 'sc_tutor', tab: 'school', group: 'school', icon: '🧑‍🏫', label: { fr: 'Donner des cours particuliers', en: 'Tutor kids for cash' }, desc: { fr: "Un peu d'argent de poche", en: 'Pocket money' }, when: { school: ['high', 'uni'], age: [14, 99], stat: { smarts: [50, 100] } }, limit: 2, scene: { place: 'home', mood: 'neutral' },
    out: [
      { w: 3, odds: { smarts: 0.5 }, text: { fr: "J'ai donné des cours de maths à un gamin du quartier. Il a eu 12. Ses parents m'ont payé{|e} et m'ont forcé{|e} à finir le gratin.", en: 'I tutored a neighbourhood kid in maths. He got a C+. His parents paid me and made me finish the casserole.' }, fx: { money: 300, smarts: 1, karma: 2 } },
      { w: 1, text: { fr: "Mon élève a eu 3 au contrôle. Sa mère a exigé un remboursement et une lettre d'excuses manuscrite.", en: 'My student got 3/20 on the test. His mother demanded a refund and a handwritten apology.' }, fx: { money: 50, happy: -3 } },
      { w: 1, text: { fr: "J'ai passé toutes les séances à jouer à Mario Kart avec mon élève. Il progresse énormément. En Mario Kart.", en: 'I spent every session playing Mario Kart with my student. He has improved enormously. At Mario Kart.' }, fx: { money: 150, happy: 3 } },
    ] },
  { id: 'sc_allnighter', tab: 'school', group: 'school', icon: '🌙', label: { fr: 'Nuit blanche de révisions', en: 'Pull an all-nighter' }, desc: { fr: 'Notes contre santé', en: 'Grades vs health' }, when: { school: ['high', 'uni'] }, limit: 1, scene: { place: 'home', mood: 'sleepy' },
    out: [
      { w: 2, odds: { discipline: 0.6 }, text: { fr: "Nuit blanche au café et aux biscuits secs. J'ai tout retenu. Mon cerveau a la texture d'un pain de mie.", en: 'All-nighter on coffee and stale cookies. I memorised everything. My brain has the texture of sliced bread.' }, fx: { grade: 8, smarts: 2, health: -3, stress: 5 } },
      { w: 2, text: { fr: "Je me suis endormi{|e} à 3 h sur mon cahier. Réveil avec la photosynthèse imprimée à l'envers sur la joue.", en: 'I fell asleep at 3am on my notebook. Woke up with photosynthesis printed backwards on my cheek.' }, fx: { grade: 2, looks: -1 } },
      { w: 1, text: { fr: "Six cafés, deux canettes énergisantes. Le matin de l'examen, je voyais les sons. J'ai rendu un poème sur les pigeons.", en: 'Six coffees, two energy drinks. On exam morning I could see sounds. I handed in a poem about pigeons.' }, fx: { grade: -4, health: -5, stress: 8 }, mood: 'sick' },
    ] },
  { id: 'sc_field_trip', tab: 'school', group: 'school', icon: '🚌', label: { fr: 'Sortie scolaire', en: 'School trip' }, desc: { fr: "Une journée hors de l'école", en: 'A day out of class' }, when: { school: ['primary', 'middle'] }, limit: 1, scene: { place: 'park', mood: 'happy' },
    out: [
      { w: 2, text: { fr: "Sortie au musée des sciences. J'ai appuyé sur le bouton « Ne pas appuyer ». Il ne s'est rien passé. Profondément déçu{|e}.", en: 'Trip to the science museum. I pressed the "Do not press" button. Nothing happened. Deeply disappointed.' }, fx: { happy: 4, smarts: 2 } },
      { w: 2, text: { fr: "Sortie à la ferme. Une chèvre a mangé ma fiche d'activité et la moitié de mon sandwich. On est meilleurs amis maintenant.", en: 'Farm trip. A goat ate my worksheet and half my sandwich. We are best friends now.' }, fx: { happy: 5 } },
      { w: 1, text: { fr: "On m'a oublié{|e} sur une aire d'autoroute. Je suis rentré{|e} avec une famille belge adorable qui m'a appris la belote.", en: 'They forgot me at a highway rest stop. I got home with a lovely Belgian family who taught me card games.' }, fx: { happy: -2, smarts: 1 }, mood: 'shock' },
    ] },

  // ───────────────────────────── School · rating 1
  { id: 'sc_yard_brawl', tab: 'school', group: 'school', icon: '👊', rating: 1, label: { fr: 'Bagarre dans la cour', en: 'Schoolyard fight' }, desc: { fr: 'Gloire ou dents en moins', en: 'Glory or fewer teeth' }, when: { school: [...kids] }, limit: 1, scene: { place: 'school', mood: 'angry' },
    out: [
      { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai défié le plus grand de la cour. Une mandale, il est tombé dans le bac à sable. Je suis une légende jusqu'à la récré de 15 h.", en: 'I challenged the biggest kid in the yard. One slap and he fell in the sandbox. I am a legend until afternoon recess.' }, fx: { happy: 5, athletic: 2, karma: -2 }, mood: 'proud' },
      { w: 2, text: { fr: "Je me suis fait ratatiner devant tout le monde. Pantalon déchiré, dent qui se balade, dignité introuvable.", en: 'I got flattened in front of everyone. Ripped pants, a wobbly tooth, dignity missing.' }, fx: { health: -6, happy: -6, looks: -1 }, mood: 'cry' },
      { w: 1, text: { fr: "Bagarre interrompue par la CPE. Trois jours d'exclusion et une lettre recommandée à mes parents. Ils l'ont encadrée, mais pas pour de bonnes raisons.", en: 'Fight broken up by the vice principal. Three-day suspension and a registered letter home. My parents framed it, and not proudly.' }, fx: { grade: -4, discipline: -3, happy: -3 } },
    ] },
  { id: 'sc_bully_bully', tab: 'school', group: 'school', icon: '😈', rating: 1, label: { fr: 'Harceler le harceleur', en: 'Bully the bully' }, desc: { fr: 'Justice de récré', en: 'Playground justice' }, when: { school: [...kids] }, limit: 1, scene: { place: 'school', mood: 'angry' },
    out: [
      { w: 2, odds: { smarts: 0.5 }, text: { fr: "J'ai mis du poil à gratter dans le short de sport du caïd de la classe. Il s'est gratté tout le cours de gym comme un macaque. Justice.", en: "I put itching powder in the class bully's gym shorts. He scratched like a monkey through the whole PE class. Justice." }, fx: { karma: 3, happy: 6 }, mood: 'proud' },
      { w: 1, text: { fr: "J'ai traité le caïd de « gros naze » sur un post-it. Il sait lire, finalement. J'ai fini dans une poubelle, plié{|e} en deux.", en: 'I called the bully a "giant loser" on a sticky note. Turns out he can read. I ended up folded in a trash can.' }, fx: { health: -4, happy: -5 }, mood: 'sad' },
      { w: 1, text: { fr: "J'ai renversé la situation : maintenant c'est moi le caïd. Je me dégoûte un peu. Mais j'ai son goûter.", en: "I flipped the script: now I'm the bully. I disgust myself a little. But I have his snacks." }, fx: { karma: -4, happy: 3 } },
    ] },
  { id: 'sc_prank_head', tab: 'school', group: 'school', icon: '🤡', rating: 1, label: { fr: 'Piéger le proviseur', en: 'Prank the principal' }, desc: { fr: 'Gloire éternelle ou exclusion', en: 'Eternal glory or suspension' }, when: { school: ['middle', 'high'] }, limit: 1, scene: { place: 'school', mood: 'party' },
    out: [
      { w: 2, odds: { smarts: 0.6 }, text: { fr: "J'ai rempli le bureau du proviseur de 3 000 gobelets d'eau. Il a mis la matinée à les vider en jurant. Je suis une icône.", en: "I filled the principal's office with 3,000 cups of water. He spent all morning emptying them, swearing. I'm an icon." }, fx: { happy: 7, fame: 3, karma: -2 }, mood: 'party' },
      { w: 1, text: { fr: "Coussin péteur sur le fauteuil du proviseur, juste avant le conseil d'administration. Personne n'a ri, sauf moi. Bordel, grosse erreur.", en: "Whoopee cushion on the principal's chair right before the board meeting. Nobody laughed but me. Big freaking mistake." }, fx: { grade: -3, discipline: -2 } },
      { w: 1, text: { fr: "J'ai hissé sa trottinette sur le toit du préau. Retrouvé{|e} grâce aux caméras en dix minutes. Exclusion temporaire.", en: 'I hoisted his scooter onto the roof. The cameras found me in ten minutes. Suspended.' }, fx: { grade: -6, happy: -5 }, mood: 'sad' },
      { w: 0.2, text: { fr: "J'ai peint « PROVISEUR = CHAUVE » sur sa voiture. Il a porté plainte. Je découvre le commissariat à {age} ans.", en: 'I painted "PRINCIPAL = BALDY" on his car. He pressed charges. Meeting the police at {age}.' }, fx: { arrest: 'vandal', heat: 10, visual: 'police' }, mood: 'shock' },
    ] },
  { id: 'sc_cafeteria_war', tab: 'school', group: 'school', icon: '🍝', rating: 1, label: { fr: 'Bataille de bouffe', en: 'Start a food fight' }, desc: { fr: 'La cantine en guerre', en: 'Cafeteria warfare' }, when: { school: [...kids] }, limit: 1, scene: { place: 'school', mood: 'party' },
    out: [
      { w: 2, text: { fr: "J'ai lancé la première purée. Trois minutes plus tard, toute la cantine était en guerre. Il y a encore de la bolo au plafond.", en: 'I threw the first scoop of mash. Three minutes later the whole cafeteria was at war. There is still bolognese on the ceiling.' }, fx: { happy: 7, discipline: -2, visual: 'confetti' }, mood: 'party' },
      { w: 1, odds: { athletic: 0.5 }, text: { fr: "J'ai esquivé tous les projectiles comme dans Matrix. Puis un yaourt à la fraise m'a pris{|e} en pleine tronche.", en: 'I dodged every projectile like in The Matrix. Then a strawberry yogurt hit me square in the face.' }, fx: { happy: 3, looks: -1 } },
      { w: 1, text: { fr: "La dame de la cantine m'a désigné{|e} coupable. Plonge pendant un mois. Je connais désormais le vrai visage du hachis Parmentier.", en: "The lunch lady named me as the culprit. Dish duty for a month. I've seen the true face of shepherd's pie." }, fx: { happy: -5, discipline: 2 }, mood: 'sad' },
    ] },
  { id: 'sc_gym_smoke', tab: 'school', group: 'school', icon: '🚬', rating: 1, label: { fr: 'Fumer derrière le gymnase', en: 'Smoke behind the gym' }, desc: { fr: "Avoir l'air cool", en: 'Look cool' }, when: { school: 'high', age: [14, 25] }, limit: 1, scene: { place: 'school', mood: 'neutral' },
    out: [
      { w: 2, text: { fr: "Ma première clope derrière le gymnase. J'ai toussé comme un vieux diesel, mais j'avais l'air trop cool. Je crois.", en: 'First cigarette behind the gym. I coughed like an old diesel truck, but I looked so cool. I think.' }, fx: { happy: 3, health: -2, addiction: ['tobacco', 12] } },
      { w: 1, text: { fr: "Le prof de sport nous a surpris. Il nous a fait courir 40 tours de stade « pour nettoyer les poumons ». J'ai gerbé au douzième.", en: 'The PE teacher caught us. He made us run 40 laps "to clean our lungs". I puked on lap twelve.' }, fx: { athletic: 3, happy: -4, health: -1, addiction: ['tobacco', 5] }, mood: 'sick' },
      { w: 1, text: { fr: "J'ai voulu faire des ronds de fumée. J'ai fait un trou dans mon sweat préféré et cramé un sourcil.", en: 'I tried to blow smoke rings. Burned a hole in my favourite hoodie and singed off an eyebrow.' }, fx: { looks: -3, addiction: ['tobacco', 8], visual: 'fire' }, mood: 'shock' },
    ] },
  { id: 'sc_candy_biz', tab: 'school', group: 'school', icon: '🍬', rating: 1, label: { fr: 'Trafic de bonbons', en: 'Sell contraband candy' }, desc: { fr: 'Le business du casier', en: 'Locker economy' }, when: { school: ['middle', 'high'] }, limit: 1, scene: { place: 'school', mood: 'happy' },
    out: [
      { w: 2, odds: { smarts: 0.5 }, text: { fr: "J'ai monté un trafic de bonbons acidulés et de canettes énergisantes dans mon casier. Marge : 400 %. Je suis le Scarface des Dragibus.", en: "I ran a sour-candy and energy-drink racket out of my locker. 400% margin. I'm the Scarface of gummy bears." }, fx: { money: 120, karma: -1 }, mood: 'proud' },
      { w: 1, text: { fr: "Fouille des casiers : la CPE a saisi tout mon stock. Je l'ai vue bouffer mes Haribo en salle des profs. Corruption.", en: 'Locker search: the vice principal seized my stock. I saw her eating my gummies in the staff room. Corruption.' }, fx: { happy: -6, discipline: -2 }, mood: 'angry' },
      { w: 1, text: { fr: "J'ai mangé tout le stock moi-même. Faillite, carie et un pic de glycémie qui m'a fait voir Dieu.", en: 'I ate the entire stock myself. Bankruptcy, a cavity, and a sugar spike that made me see God.' }, fx: { health: -3, happy: 2, weight: 0.02 }, mood: 'sick' },
    ] },
  { id: 'sc_fake_note', tab: 'school', group: 'school', icon: '🤒', rating: 1, label: { fr: "Faux mot d'excuse", en: 'Fake a sick note' }, desc: { fr: 'Journée pyjama', en: 'Pyjama day' }, when: { school: [...kids] }, limit: 2, scene: { place: 'home', mood: 'happy' },
    out: [
      { w: 2, odds: { smarts: 0.5 }, text: { fr: "J'ai imité la signature de ma mère à la perfection. Journée pyjama, céréales, dessins animés. Le crime parfait.", en: "I forged my mom's signature perfectly. Pyjamas, cereal, cartoons. The perfect crime." }, fx: { happy: 6, grade: -2 }, mood: 'happy' },
      { w: 1, text: { fr: "J'ai écrit « Mon enfan est maladde ». Le prof a souligné les fautes en rouge et appelé chez moi. Putain d'orthographe.", en: 'I wrote "My kidd is sik". The teacher circled the typos in red and called home. Damn spelling.' }, fx: { happy: -5, discipline: -2 }, mood: 'sad' },
      { w: 1, text: { fr: "J'ai inventé une « grippe tropicale ». L'infirmière m'a mis{|e} en quarantaine trois jours avec un masque. Ça a marché, en fait.", en: 'I invented a "tropical flu". The school nurse quarantined me for three days in a mask. It worked, actually.' }, fx: { happy: 3, grade: -3 } },
    ] },
  { id: 'sc_hack_grades', tab: 'school', group: 'school', icon: '💻', rating: 1, label: { fr: 'Pirater les notes', en: 'Hack the grades' }, desc: { fr: 'Intelligence 60+', en: 'Smarts 60+' }, when: { school: ['high', 'uni'], stat: { smarts: [60, 100] } }, limit: 1, scene: { place: 'home', mood: 'neutral' },
    out: [
      { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai deviné le mot de passe du logiciel de notes : « Proviseur123 ». J'ai mis 16 partout. Pas 20 : je suis malin{|e}.", en: 'I guessed the grading software password: "Principal123". Gave myself B+ everywhere. Not A+: I\'m clever.' }, fx: { grade: 20, karma: -4, smarts: 1 }, mood: 'proud' },
      { w: 1, text: { fr: "J'ai remplacé toutes les notes de la classe par 20. Même celles du cancre qui dort au fond. Enquête immédiate.", en: 'I changed the whole class to straight As. Even the kid who sleeps in the back. Instant investigation.' }, fx: { grade: -5, happy: -3, heat: 5 } },
      { w: 0.4, text: { fr: "Le prof d'info m'a tracé{|e} en quatre minutes, en mangeant un sandwich. Exclusion définitive.", en: 'The IT teacher traced me in four minutes while eating a sandwich. Expelled.' }, fx: { expel: true, discipline: -5 }, mood: 'cry' },
      { w: 0.15, text: { fr: "L'établissement a porté plainte pour piratage. Des types en costume ont saisi mon ordi et ma console.", en: 'The school pressed hacking charges. Men in suits seized my laptop and my console.' }, fx: { arrest: 'hack', visual: 'police' }, mood: 'shock' },
    ] },
  { id: 'sc_prom', tab: 'school', group: 'school', icon: '💃', rating: 1, label: { fr: 'Bal de promo', en: 'Prom night' }, desc: { fr: 'La soirée de l\'année', en: 'Night of the year' }, when: { school: 'high', age: [16, 20] }, limit: 1, cost: 80, scene: { place: 'party', mood: 'party' },
    out: [
      { w: 2, odds: { looks: 0.8 }, text: { fr: "On m'a couronné{|e} au bal de promo. La couronne était en carton, mais ma gloire est éternelle.", en: 'I was crowned at prom. The crown was cardboard, but my glory is eternal.' }, fx: { happy: 8, fame: 3, looks: 1, visual: 'confetti' }, mood: 'proud' },
      { w: 2, text: { fr: "Quelqu'un avait corsé le punch. J'ai fait le ver de terre sur la piste pendant vingt minutes. Vidéo virale dans tout le lycée.", en: 'Someone spiked the punch. I did the worm on the dance floor for twenty minutes. Viral across the whole school.' }, fx: { happy: 4, followers: 200, addiction: ['alcohol', 4] }, mood: 'party' },
      { w: 1, text: { fr: "Venu{|e} seul{|e}, j'ai passé la soirée au buffet. 46 mini-quiches. Aucun regret.", en: 'Came alone, spent the night at the buffet. 46 mini quiches. No regrets.' }, fx: { happy: -2, weight: 0.01 } },
      { w: 1, text: { fr: "Ma tenue de location s'est déchirée pendant le slow. Tout le lycée a vu mes sous-vêtements Pokémon.", en: 'My rented outfit ripped during the slow dance. The whole school saw my Pokémon underwear.' }, fx: { happy: -6 }, mood: 'cry' },
    ] },
  { id: 'sc_detention_escape', tab: 'school', group: 'school', icon: '🪟', rating: 1, label: { fr: "S'évader de la colle", en: 'Escape detention' }, desc: { fr: 'La grande évasion', en: 'The great escape' }, when: { school: ['middle', 'high'] }, limit: 1, scene: { place: 'school', mood: 'shock' },
    out: [
      { w: 2, odds: { athletic: 0.5 }, text: { fr: "Je suis sorti{|e} de l'heure de colle par la fenêtre. Le surveillant parle encore à ma chaise.", en: 'I slipped out of detention through the window. The supervisor is still talking to my chair.' }, fx: { happy: 6, discipline: -2 }, mood: 'proud' },
      { w: 1, text: { fr: "Coincé{|e} dans la fenêtre, à moitié dehors, les fesses côté salle. Les pompiers sont venus. Photo dans le journal local.", en: 'Stuck in the window, half outside, butt facing the classroom. The fire brigade came. Photo in the local paper.' }, fx: { happy: -4, fame: 2 }, mood: 'shock' },
      { w: 1, text: { fr: "Évasion réussie, mais j'ai oublié mon sac avec mon nom brodé dessus par mamie. Double colle. Le samedi.", en: 'Clean escape, but I left my bag with my name embroidered on it by grandma. Double detention. On Saturday.' }, fx: { happy: -5, grade: -2 }, mood: 'sad' },
    ] },
  { id: 'sc_plagiarism', tab: 'school', group: 'school', icon: '📋', rating: 1, label: { fr: 'Plagier un devoir', en: 'Plagiarise an essay' }, desc: { fr: 'Copier-coller, prier', en: 'Copy, paste, pray' }, when: { school: ['high', 'uni'] }, limit: 1, scene: { place: 'school', mood: 'neutral' },
    out: [
      { w: 2, text: { fr: "J'ai copié un article d'encyclopédie en changeant un mot sur trois avec un dico des synonymes. « Le nouveau-né Napoléon fut proclamé patron. » 13/20.", en: 'I copied an encyclopedia article, swapping every third word with a thesaurus. "Newborn Napoleon was proclaimed boss." B-.' }, fx: { grade: 4, karma: -2 } },
      { w: 1, text: { fr: "J'ai rendu un exposé pompé sur internet. Le prof en était l'auteur. Il a juste écrit en rouge : « Tu te fous de ma gueule ? »", en: 'I handed in an essay lifted off the internet. The teacher wrote it. He just wrote in red: "Are you f***ing kidding me?"' }, fx: { grade: -10, happy: -6 }, mood: 'shock' },
      { w: 1, text: { fr: "J'avais oublié d'effacer « Bien sûr ! Voici une dissertation de trois pages : » en haut de la copie. Zéro pointé, humiliation publique.", en: 'I forgot to delete "Sure! Here is a three-page essay:" at the top. Big fat zero, public humiliation.' }, fx: { grade: -8, happy: -4 }, mood: 'sad' },
    ] },

  // ───────────────────────────── School · rating 2 (uni, 18+)
  { id: 'sc_frat', tab: 'school', group: 'school', icon: '🍻', rating: 2, label: { fr: 'Soirée de fraternité', en: 'Frat party' }, desc: { fr: 'Bière, honte, légende', en: 'Beer, shame, legend' }, when: { school: 'uni', age: [18, 99] }, limit: 2, scene: { place: 'party', mood: 'party' },
    out: [
      { w: 3, text: { fr: "Poirier sur un fût de bière pendant 47 secondes : record de la fac. Ensuite j'ai gerbé dans le piano à queue du président de la fraternité. Il dit que ça sonne mieux.", en: "Keg stand for 47 seconds: campus record. Then I puked into the frat president's grand piano. He says it sounds better now." }, fx: { happy: 8, health: -4, addiction: ['alcohol', 10], visual: 'poop' }, mood: 'party' },
      { w: 2, text: { fr: "Réveil dans une baignoire remplie de chips, « LOSER » écrit au marqueur indélébile sur le front et un sourcil en moins. Bonne soirée, apparemment.", en: 'Woke up in a bathtub full of chips, "LOSER" in permanent marker on my forehead and one eyebrow missing. Great party, apparently.' }, fx: { looks: -4, happy: -3, addiction: ['alcohol', 6] }, mood: 'sleepy' },
      { w: 1, text: { fr: "J'ai sauté du toit dans la piscine comme dans les films. Elle était gonflable. Et vide. Mon bras s'est plié dans un sens inédit, l'os a dit bonjour à tout le monde. Le DJ a continué.", en: 'I jumped off the roof into the pool like in the movies. It was inflatable. And empty. My arm bent in a brand-new direction, bone waving hi to everyone. The DJ kept going.' }, fx: { health: -15, disease: 'broken_arm', visual: 'gore' }, mood: 'cry' },
      { w: 0.08, text: none, fx: { die: { fr: "étouffé{|e} dans un entonnoir à bière, sous les applaudissements d'une fraternité entière", en: 'choking on a beer bong while an entire frat house cheered' } } },
    ] },
  { id: 'sc_streak', tab: 'school', group: 'school', icon: '🍑', rating: 2, label: { fr: 'Streaker à la remise des diplômes', en: 'Streak at graduation' }, desc: { fr: 'Gloire à poil', en: 'Naked glory' }, when: { school: 'uni', age: [18, 99] }, limit: 1, scene: { place: 'uni', mood: 'party' },
    out: [
      { w: 2, odds: { athletic: 0.6 }, text: { fr: "J'ai traversé la cérémonie à poil, avec juste une toque sur la tête et les bijoux de famille au vent. Le doyen a lâché son micro. 40 000 vues avant midi.", en: "I streaked across the ceremony wearing nothing but a mortarboard, everything flapping in the breeze. The dean dropped his mic. 40,000 views by noon." }, fx: { fame: 8, followers: 3000, happy: 8, karma: -2 }, mood: 'party' },
      { w: 1, text: { fr: "J'ai glissé sur l'estrade et je me suis étalé{|e}, cul nu, sur les genoux du recteur. Il s'en souviendra. Moi aussi, chaque nuit.", en: "I slipped on the stage and landed bare-assed in the chancellor's lap. He'll never forget it. Neither will I, every night." }, fx: { happy: -6, fame: 5, health: -3 }, mood: 'shock' },
      { w: 1, text: { fr: "La sécurité m'a plaqué{|e} au sol devant toutes les familles. Mamie a pris des photos. Ma mère a fait semblant de ne pas me connaître.", en: "Security tackled me in front of every family there. Grandma took pictures. Mom pretended not to know me." }, fx: { heat: 15, happy: -4, fame: 4, visual: 'police' }, mood: 'sad' },
      { w: 0.4, text: { fr: "La fac a annulé mon inscription « pour atteinte à la pudeur et aux rétines ». Diplôme ? Quel diplôme ?", en: 'The university cancelled my enrolment "for indecency and retinal damage". Degree? What degree?' }, fx: { expel: true, fame: 3 }, mood: 'shock' },
    ] },
  { id: 'sc_ta', tab: 'school', group: 'school', icon: '🍎', rating: 2, label: { fr: 'Coucher pour une bonne note', en: 'Sleep with the TA' }, desc: { fr: 'Méthode de révision alternative', en: 'Alternative study method' }, when: { school: 'uni', age: [18, 99] }, limit: 1, scene: { place: 'uni', mood: 'love' },
    out: [
      { w: 2, odds: { looks: 1 }, text: none, fx: taste(
        ["J'ai passé la nuit avec mon chargé de TD. Le lendemain : 19/20 et un petit cœur dans la marge. Le cœur a été plus dur à expliquer à mes potes.", 'I spent the night with my TA. Next day: A+ and a little heart in the margin. The heart was harder to explain to my friends.'],
        ["J'ai passé la nuit avec ma chargée de TD. Le lendemain : 19/20 et un petit cœur dans la marge. Le cœur a été plus dur à expliquer à mes potes.", 'I spent the night with my TA. Next day: A+ and a little heart in the margin. The heart was harder to explain to my friends.'],
        { grade: 12, happy: 5, karma: -3, visual: 'hearts' }), mood: 'love' },
      { w: 1, text: none, fx: taste(
        ["Mon chargé de TD et moi, on s'est fait surprendre dans le local photocopieuse. On s'était assis sur la machine : 40 exemplaires de mes fesses dans tout le département. Conseil de discipline.", 'My TA and I got caught in the copy room. We were sitting on the machine: 40 copies of my butt all over the department. Disciplinary board.'],
        ["Ma chargée de TD et moi, on s'est fait surprendre dans le local photocopieuse. On s'était assis{|es} sur la machine : 40 exemplaires de mes fesses dans tout le département. Conseil de discipline.", 'My TA and I got caught in the copy room. We were sitting on the machine: 40 copies of my butt all over the department. Disciplinary board.'],
        { grade: -6, happy: -6, fame: 2 }), mood: 'shock' },
      { w: 1, text: none, fx: taste(
        ["Nuit torride avec mon chargé de TD. Ma note : 8/20. « Je sépare le privé du professionnel », m'a-t-il dit en remettant ses chaussettes.", 'Steamy night with my TA. My grade: D. "I keep work and pleasure separate," he said, putting his socks back on.'],
        ["Nuit torride avec ma chargée de TD. Ma note : 8/20. « Je sépare le privé du professionnel », m'a-t-elle dit en remettant ses chaussettes.", 'Steamy night with my TA. My grade: D. "I keep work and pleasure separate," she said, putting her socks back on.'],
        { grade: -2, happy: 2 }) },
      { w: 0.4, text: none, fx: taste(
        ["Deux semaines après ma nuit avec mon chargé de TD : ça brûle quand je fais pipi. Le cours de bio sur les IST est soudain très concret.", 'Two weeks after my night with the TA: it burns when I pee. The biology lecture on STDs suddenly feels very hands-on.'],
        ["Deux semaines après ma nuit avec ma chargée de TD : ça brûle quand je fais pipi. Le cours de bio sur les IST est soudain très concret.", 'Two weeks after my night with the TA: it burns when I pee. The biology lecture on STDs suddenly feels very hands-on.'],
        { disease: 'std', happy: -5 }), mood: 'sick' },
    ] },
  { id: 'sc_spring_break', tab: 'school', group: 'school', icon: '🏖️', rating: 2, label: { fr: 'Spring break', en: 'Spring break' }, desc: { fr: 'Tequila, soleil, regrets', en: 'Tequila, sun, regrets' }, when: { school: 'uni', age: [18, 99] }, limit: 1, cost: 600, scene: { place: 'beach', mood: 'party' },
    out: [
      { w: 3, text: { fr: "Spring break à Cancún : 14 tequilas, un tatouage de dauphin sur la fesse et un mariage symbolique avec un inconnu nommé Brad. J'ai annulé le mariage. Pas le dauphin.", en: 'Spring break in Cancún: 14 tequila shots, a dolphin tattoo on my butt and a beach wedding to a stranger named Brad. Annulled the wedding. Kept the dolphin.' }, fx: { happy: 10, health: -5, looks: -1, addiction: ['alcohol', 10] }, mood: 'party' },
      { w: 1, text: { fr: "Je me suis endormi{|e} neuf heures au soleil. Rouge homard avec la forme exacte de mon maillot. Je pèle comme un oignon qui a des choses à se reprocher.", en: 'Passed out in the sun for nine hours. Lobster red with a perfect swimsuit outline. Peeling like an onion with regrets.' }, fx: { disease: 'sunburn', happy: -4, looks: -2 }, mood: 'sick' },
      { w: 1, text: { fr: "Souvenir de vacances qui gratte : le médecin a prononcé le mot « chlamydia » avec beaucoup trop d'assurance.", en: 'A souvenir that itches: the doctor said "chlamydia" with way too much confidence.' }, fx: { disease: 'std', happy: -6 }, mood: 'sick' },
      { w: 0.6, text: { fr: "Concours de vomi depuis le balcon de l'hôtel. J'ai gagné, portée record sur un parasol. Expulsé{|e} de l'hôtel, de l'île et du programme de fidélité de la compagnie aérienne.", en: "Hotel balcony puking contest. I won, record distance onto a beach umbrella. Banned from the hotel, the island and the airline's loyalty programme." }, fx: { happy: 3, health: -4, visual: 'poop' }, mood: 'party' },
    ] },
  { id: 'sc_cadaver', tab: 'school', group: 'school', icon: '💀', rating: 2, label: { fr: "Blague au labo d'anatomie", en: 'Prank with a cadaver' }, desc: { fr: 'Humour de carabin', en: 'Med-school humour' }, when: { school: 'uni', age: [18, 99] }, limit: 1, scene: { place: 'hospital', mood: 'shock', fx: 'gore' },
    out: [
      { w: 2, text: { fr: "J'ai fait faire « coucou » à la main d'un cadavre pendant le TP. Une étudiante s'est évanouie tête la première dans le seau à organes. Fou rire général, sauf chez le seau.", en: 'I made a cadaver wave hello during lab. A classmate fainted face-first into the organ bucket. Everyone lost it, except the bucket.' }, fx: { happy: 6, karma: -4, visual: 'gore' }, mood: 'party' },
      { w: 1, text: { fr: "J'ai caché un orteil de macchabée dans les lasagnes du prof. Il l'a trouvé à la troisième bouchée. Moi, j'ai trouvé la porte. Viré{|e}.", en: "I hid a corpse toe in the professor's lasagna. He found it on the third bite. I found the exit. Expelled." }, fx: { expel: true, karma: -6, visual: 'gore' }, mood: 'shock' },
      { w: 1, text: { fr: "J'ai voulu soulever le cadavre pour un selfie. Le bras m'est resté dans la main. J'ai hurlé, le bras n'a rien dit. Six mois de cauchemars.", en: "I tried to lift the cadaver for a selfie. The arm came off in my hand. I screamed; the arm said nothing. Six months of nightmares." }, fx: { happy: -6, stress: 10, visual: 'gore' }, mood: 'cry' },
      { w: 0.6, text: { fr: "Seul{|e} au labo à minuit, j'ai juré que le cadavre m'avait fait un clin d'œil. J'ai couru jusqu'à chez moi. En blouse. Avec un scalpel.", en: 'Alone in the lab at midnight, I swear the cadaver winked at me. I ran all the way home. In a lab coat. Holding a scalpel.' }, fx: { stress: 8, athletic: 2, visual: 'ghost' }, mood: 'shock' },
    ] },
  { id: 'sc_hazing', tab: 'school', group: 'school', icon: '🪣', rating: 2, label: { fr: 'Survivre au bizutage', en: 'Survive hazing' }, desc: { fr: "L'intégration, version dégueu", en: 'Initiation, gross edition' }, when: { school: 'uni', age: [18, 99] }, limit: 1, scene: { place: 'party', mood: 'sick' },
    out: [
      { w: 2, odds: { health: 0.5 }, text: { fr: "J'ai bu cul sec un mélange de bière, de sauce piquante et de « jus de poubelle ». Accepté{|e} chez les Gamma Kappa Bêta. J'ai perdu le goût pendant trois semaines.", en: 'I chugged a mix of beer, hot sauce and "dumpster juice". Accepted into Gamma Kappa Beta. Lost my sense of taste for three weeks.' }, fx: { happy: 6, health: -5, fame: 1 }, mood: 'proud' },
      { w: 1, text: { fr: "On m'a fait ramper dans la boue en slip en chantant l'hymne de la fac. J'ai attrapé une crève monumentale et un amour inexplicable pour mes bourreaux.", en: 'They made me crawl through mud in my underwear singing the school anthem. Caught a monster flu and an inexplicable love for my tormentors.' }, fx: { disease: 'flu', happy: -2 }, mood: 'sick' },
      { w: 1, text: { fr: "J'ai refusé de manger le poisson cru caché dans une chaussette. On m'a scotché{|e} à poil à un lampadaire au milieu du campus. J'y ai rencontré le jardinier. Il a été très poli.", en: 'I refused to eat the raw fish hidden in a sock. They duct-taped me naked to a lamppost in the middle of campus. Met the groundskeeper. Very polite man.' }, fx: { happy: -8, looks: -1 }, mood: 'cry' },
      { w: 0.3, text: { fr: "J'ai dénoncé le bizutage au doyen. La confrérie a été dissoute et ma voiture remplie de crevettes pourries. En plein mois d'août.", en: 'I reported the hazing to the dean. The frat was shut down and my car was stuffed with rotten shrimp. In August.' }, fx: { karma: 6, happy: -3, visual: 'poop' } },
    ] },
  { id: 'sc_lab_rat', tab: 'school', group: 'school', icon: '🧪', rating: 2, label: { fr: 'Cobaye pour un essai clinique', en: 'Paid clinical trial' }, desc: { fr: "De l'argent facile ?", en: 'Easy money?' }, when: { school: 'uni', age: [18, 99] }, limit: 1, scene: { place: 'hospital', mood: 'neutral' },
    out: [
      { w: 3, text: { fr: "J'ai testé un médicament contre la calvitie pour 800 balles. Mes cheveux vont très bien. J'ai juste des poils sur les paumes maintenant.", en: 'I tested a baldness drug for 800 bucks. My hair is fine. I just have hairy palms now.' }, fx: { money: 800, looks: -2 } },
      { w: 2, text: { fr: "Essai d'un somnifère : j'ai dormi trois jours d'affilée. Ils m'ont payé{|e} et m'ont dit que j'avais parlé de ma mère tout du long.", en: 'Sleeping pill trial: I slept three days straight. They paid me and said I talked about my mother the whole time.' }, fx: { money: 600, smarts: -1 }, mood: 'sleepy' },
      { w: 1, text: { fr: "Effets secondaires : une oreille gonflée comme un ballon de baudruche et une diarrhée « historique » selon l'infirmier, qui a dû changer de blouse deux fois. Ils ont doublé le chèque pour que je me taise.", en: 'Side effects: one ear swelled up like a balloon and diarrhoea the nurse called "historic" after changing scrubs twice. They doubled the cheque to keep me quiet.' }, fx: { money: 1600, health: -12, visual: 'poop' }, mood: 'sick' },
      { w: 0.06, text: none, fx: { die: { fr: "pendant un essai clinique, avec une oreille de la taille d'une pastèque", en: 'during a clinical trial, with one ear the size of a watermelon' } } },
    ] },

  // ───────────────────────────── Prison · rating 0
  { id: 'pr_choir', tab: 'prison', group: 'prison', where: 'prison', icon: '🎶', label: { fr: 'Chorale de la chapelle', en: 'Chapel choir' }, desc: { fr: 'Bonheur et karma', en: 'Happiness and karma' }, when: { prison: true }, limit: 1, scene: { place: 'prison', mood: 'happy' },
    out: [
      { w: 2, text: { fr: "J'ai rejoint la chorale. Un braqueur de 130 kilos chante le contre-ut à côté de moi et pleure à chaque Ave Maria. On est une famille.", en: "I joined the choir. A 280-pound bank robber hits the high notes next to me and cries at every Ave Maria. We're a family." }, fx: { happy: 6, karma: 3, counter: 'prisonGood', ...resp(2) }, mood: 'happy' },
      { w: 1, text: { fr: "J'ai chanté tellement faux à la messe de Noël que même le tueur du premier rang s'est retourné, choqué.", en: 'I sang so off-key at Christmas mass that even the murderer in the front row turned around, appalled.' }, fx: { happy: -2, ...resp(-3) }, mood: 'shock' },
      { w: 1, text: { fr: "La chorale a donné un concert pour le directeur. Ému, il a réduit ma peine… de deux jours. C'est déjà ça.", en: 'The choir gave a concert for the warden. Moved, he cut my sentence… by two days. It\'s something.' }, fx: { happy: 4, karma: 2, counter: 'prisonGood' } },
    ] },
  { id: 'pr_cat', tab: 'prison', group: 'prison', where: 'prison', icon: '🐈', label: { fr: 'Adopter le chat de la prison', en: 'Adopt the prison cat' }, desc: { fr: 'Un ami à moustaches', en: 'A whiskered friend' }, when: { prison: true, noFlag: 'pr_cat' }, limit: 1, scene: { place: 'prison', mood: 'love' },
    out: [
      { w: 2, text: { fr: "J'ai apprivoisé le chat roux de la cour avec des bouts de mon steak. Il s'appelle Bandit. Il a plus de respect que moi ici.", en: "I tamed the ginger yard cat with bits of my steak. His name is Bandit. He gets more respect around here than I do." }, fx: { happy: 8, karma: 2, flag: 'pr_cat', newNpc: { role: 'pet', species: 'cat' } }, mood: 'love' },
      { w: 1, text: { fr: "Le chat m'a griffé le visage et a pissé sur mon matelas. C'est le chat du chef du bloc C. Je dors par terre et je dis merci.", en: "The cat clawed my face and peed on my mattress. It's the Block C boss's cat. I sleep on the floor and say thank you." }, fx: { happy: -4, looks: -1 }, mood: 'sad' },
      { w: 1, text: { fr: "Le chat me rapporte une souris morte dans ma cellule chaque matin. C'est de l'amour, je crois. Mon codétenu n'est pas d'accord.", en: 'The cat brings a dead mouse to my cell every morning. I think it\'s love. My cellmate disagrees.' }, fx: { happy: 3 } },
    ] },
  { id: 'pr_penpal', tab: 'prison', group: 'prison', where: 'prison', icon: '💌', label: { fr: 'Écrire à des correspondants', en: 'Write to pen pals' }, desc: { fr: "L'amour par La Poste", en: 'Love by mail' }, when: { prison: true }, limit: 2, scene: { place: 'prison', mood: 'love' },
    out: [
      { w: 2, text: { fr: "J'ai envoyé des lettres d'amour enflammées à six correspondants différents. Ils m'envoient tous des timbres et des chaussettes. Je suis riche en chaussettes.", en: "I sent passionate love letters to six different pen pals. They all send me stamps and socks. I'm rich in socks." }, fx: { happy: 6 }, mood: 'love' },
      { w: 1, text: { fr: "Une correspondante m'a envoyé un mandat de 200 balles « pour cantiner ». Je l'aime. Je ne connais pas son nom de famille.", en: "A pen pal mailed me 200 bucks for the commissary. I love her. I don't know her last name." }, fx: { money: 200, happy: 4 } },
      { w: 1, text: { fr: "J'ai envoyé la même lettre à tout le monde, prénom compris. « Ma chère Martine », à un routier nommé Gérard. Il a répondu quand même.", en: 'I sent the same letter to everyone, name included. "My dearest Martha", to a trucker called Gerald. He wrote back anyway.' }, fx: { happy: 2 } },
    ] },
  { id: 'pr_law', tab: 'prison', group: 'prison', where: 'prison', icon: '⚖️', label: { fr: 'Étudier le droit en cellule', en: 'Study law in my cell' }, desc: { fr: 'Peut réduire la peine', en: 'May shorten the sentence' }, when: { prison: true }, limit: 1, scene: { place: 'prison', mood: 'neutral' },
    out: [
      { w: 2, odds: { smarts: 1 }, text: { fr: "J'ai potassé le code de procédure pénale pendant des mois et trouvé un vice de forme dans mon dossier. Le juge a soupiré très fort. Un an de moins.", en: 'I studied criminal procedure for months and found a technicality in my file. The judge sighed very loudly. One year off.' }, fx: { smarts: 5, flag: 'pr_jailhouse_lawyer', fn: cut(1) }, mood: 'proud' },
      { w: 2, text: { fr: "J'ai lu 600 pages de jurisprudence. J'ai compris le mot « attendu ». C'est un début.", en: 'I read 600 pages of case law. I understood the word "whereas". It\'s a start.' }, fx: { smarts: 3 } },
      { w: 1, text: { fr: "J'ai rédigé des recours pour tout le bloc contre des paquets de clopes. Je suis l'avocat{|e} le moins cher du pays.", en: "I wrote appeals for the whole block in exchange for cigarettes. I'm the cheapest lawyer in the country." }, fx: { smarts: 2, money: 100, ...resp(6) } },
    ] },

  // ───────────────────────────── Prison · rating 1
  { id: 'pr_barber', tab: 'prison', group: 'prison', where: 'prison', icon: '💈', rating: 1, label: { fr: 'Barbier de la cour', en: 'Yard barber' }, desc: { fr: 'Coupes contre nouilles', en: 'Haircuts for ramen' }, when: { prison: true }, limit: 1, scene: { place: 'prison', mood: 'neutral' },
    out: [
      { w: 2, odds: { discipline: 0.4 }, text: { fr: "J'ai ouvert un salon clandestin avec une tondeuse à piles. Dégradé impeccable, paiement en paquets de nouilles. Les affaires roulent.", en: 'I opened an underground salon with a battery clipper. Flawless fades, payment in ramen packs. Business is booming.' }, fx: { money: 150, ...resp(6) }, mood: 'proud' },
      { w: 1, text: { fr: "J'ai foiré le dégradé du chef de gang. Il ressemble à un poussin mouillé. Je dors avec un œil ouvert et la tondeuse sous l'oreiller.", en: 'I botched the gang leader\'s fade. He looks like a wet baby chick. I sleep with one eye open and the clipper under my pillow.' }, fx: { stress: 10, ...resp(-10) }, mood: 'shock' },
      { w: 1, text: { fr: "Un client voulait « la coupe d'un footballeur ». Il ressemble à un champ de blé après la grêle. Il adore. Putain, il adore.", en: 'A client wanted "a footballer\'s haircut". He looks like a wheat field after a hailstorm. He loves it. Holy crap, he loves it.' }, fx: { happy: 2, ...resp(2) } },
    ] },
  { id: 'pr_armwrestle', tab: 'prison', group: 'prison', where: 'prison', icon: '💪', rating: 1, label: { fr: 'Tournoi de bras de fer', en: 'Arm-wrestling tournament' }, desc: { fr: 'Force = respect', en: 'Strength = respect' }, when: { prison: true }, limit: 1, scene: { place: 'prison', mood: 'angry' },
    out: [
      { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai remporté le tournoi de bras de fer du bloc. Mon trophée : une boîte de thon et le respect éternel. Surtout le thon.", en: 'I won the block arm-wrestling tournament. My trophy: a can of tuna and eternal respect. Mostly the tuna.' }, fx: { athletic: 3, happy: 5, ...resp(12) }, mood: 'proud' },
      { w: 1, text: { fr: "J'ai affronté « Le Frigo ». Il porte bien son nom. Mon poignet a fait un bruit de biscotte.", en: 'I faced "The Fridge". He earned that name. My wrist made a sound like a cracker.' }, fx: { health: -8, disease: 'sprain', ...resp(-4) }, mood: 'cry' },
      { w: 1, text: { fr: "J'ai triché avec de l'huile de sardine sur la main. Disqualifié{|e}, et je pue le poisson depuis une semaine.", en: 'I cheated with sardine oil on my hand. Disqualified, and I\'ve stunk of fish for a week.' }, fx: { happy: -2, ...resp(-3) } },
    ] },
  { id: 'pr_talent', tab: 'prison', group: 'prison', where: 'prison', icon: '🎤', rating: 1, label: { fr: 'Spectacle de talents', en: 'Prison talent show' }, desc: { fr: 'Briller derrière les barreaux', en: 'Shine behind bars' }, when: { prison: true }, limit: 1, scene: { place: 'prison', mood: 'party' },
    out: [
      { w: 2, odds: { looks: 0.4 }, text: { fr: "J'ai fait un stand-up sur la bouffe de la cantine. Même les matons ont ri. Le cuistot, non : il crache dans mon assiette depuis un mois.", en: "I did stand-up about the cafeteria food. Even the guards laughed. The cook didn't: he's been spitting in my plate for a month." }, fx: { happy: 6, fame: 1, ...resp(8) }, mood: 'proud' },
      { w: 1, text: { fr: "J'ai jonglé avec trois oranges, puis avec une quatrième piquée au premier rang. Baston générale, ovation debout.", en: 'I juggled three oranges, then a fourth one I snatched from the front row. Full-on brawl, standing ovation.' }, fx: { health: -3, happy: 3, ...resp(5) }, mood: 'party' },
      { w: 1, text: { fr: "J'ai chanté une ballade sur mon ex. Silence total. Un détenu a dit « putain, c'est trop triste » et s'est mis à chialer. Gros malaise.", en: 'I sang a ballad about my ex. Dead silence. One inmate said "damn, that\'s so sad" and started bawling. Massive cringe.' }, fx: { happy: -4 }, mood: 'sad' },
    ] },

  // ───────────────────────────── Prison · rating 2
  { id: 'pr_bribe', tab: 'prison', group: 'prison', where: 'prison', icon: '💵', rating: 2, label: { fr: 'Soudoyer un gardien', en: 'Bribe a guard' }, desc: { fr: 'Le confort a un prix', en: 'Comfort has a price' }, when: { prison: true }, limit: 1, cost: 500, scene: { place: 'prison', mood: 'neutral', fx: 'money' },
    out: [
      { w: 2, text: { fr: "J'ai glissé une enveloppe au gardien Morel. En échange : une télé, une couette et de vrais oreillers. Je vis comme un pacha de cellule.", en: 'I slipped an envelope to Officer Morel. In return: a TV, a duvet and real pillows. I live like a cell sultan.' }, fx: { happy: 10, ...resp(4) }, mood: 'happy' },
      { w: 1, text: { fr: "Le gardien a pris l'enveloppe, compté les billets, puis m'a collé au mitard pour « tentative de corruption ». Il a gardé l'argent.", en: 'The guard took the envelope, counted the cash, then threw me in solitary for "attempted bribery". He kept the money.' }, fx: { happy: -8, jail: 1 }, mood: 'angry' },
      { w: 1, odds: { smarts: 0.5 }, text: { fr: "Le gardien a fermé les yeux toute une nuit. J'ai organisé un poker clandestin et raflé 2 000 balles. Le casino du bloc D est ouvert.", en: 'The guard looked the other way all night. I ran an underground poker game and raked in 2,000. The Block D casino is open.' }, fx: { money: 2000, ...resp(8) }, mood: 'party' },
      { w: 1, text: { fr: "J'avais planqué les billets dans mon fondement pour passer la fouille. Le gardien a refusé l'argent « en l'état ». Je l'ai rincé dans les chiottes de la cellule. Il l'a pris, avec des gants de vaisselle jusqu'aux coudes.", en: 'I smuggled the cash up my backside to get through the search. The guard refused the money "as is". I rinsed it in the cell toilet. He took it wearing dish gloves up to his elbows.' }, fx: { happy: -3, ...resp(-2), visual: 'poop' }, mood: 'sick' },
    ] },
  { id: 'pr_pruno', tab: 'prison', group: 'prison', where: 'prison', icon: '🍷', rating: 2, label: { fr: 'Fabriquer du pruno', en: 'Brew pruno' }, desc: { fr: 'Le vin de chiottes', en: 'Toilet wine' }, when: { prison: true }, limit: 1, scene: { place: 'prison', mood: 'party' },
    out: [
      { w: 2, text: { fr: "Deux semaines de fermentation secrète d'oranges pourries, de ketchup, d'une chaussette et d'une prière. Goût : pied de randonneur. Effet : je parle aux murs. Ils répondent.", en: 'Two weeks of secretly fermenting rotten oranges, ketchup, a sock and a prayer. Taste: hiker\'s foot. Effect: I talk to the walls. They answer.' }, fx: { happy: 7, health: -4, addiction: ['alcohol', 8], ...resp(5) }, mood: 'party' },
      { w: 2, text: { fr: "Soirée vin de chiottes dans la cellule 14 : huit détenus, un sac poubelle, zéro dignité. Le Gros Momo a dansé la macarena en pleurant. Meilleure soirée de ma vie.", en: 'Toilet-wine party in cell 14: eight inmates, one garbage bag, zero dignity. Big Mo did the Macarena while sobbing. Best night of my life.' }, fx: { happy: 10, health: -6, addiction: ['alcohol', 10], ...resp(8), visual: 'confetti' }, mood: 'party' },
      { w: 1, text: { fr: "Le sac a explosé pendant la fermentation. Ma cellule est repeinte en vomi de fruit et les matons ont nettoyé à la lance à incendie. Avec moi dedans.", en: 'The bag exploded mid-fermentation. My cell got repainted in fruity puke and the guards hosed it down. With me still inside.' }, fx: { happy: -6, ...resp(-2), visual: 'explosion' }, mood: 'shock' },
      { w: 1, text: { fr: "J'ai bu la cuvée « spéciale » du bloc C. J'ai gerbé en jet pendant quatre heures avec la puissance d'un Kärcher. L'infirmier a pris des photos pour un congrès.", en: 'I drank Block C\'s "special reserve". Projectile-vomited for four hours with pressure-washer force. The nurse took photos for a medical conference.' }, fx: { health: -12, disease: 'food_poisoning', visual: 'poop' }, mood: 'sick' },
      { w: 0.08, text: none, fx: { die: { fr: 'intoxiqué{|e} au pruno maison, le sac poubelle encore à la main', en: 'poisoned by homemade pruno, garbage bag still in hand' } } },
    ] },
  { id: 'pr_tunnel', tab: 'prison', group: 'prison', where: 'prison', icon: '🥄', rating: 2, label: { fr: 'Creuser un tunnel à la cuillère', en: 'Dig a tunnel with a spoon' }, desc: { fr: 'Patience : plusieurs années', en: 'Takes years of patience' }, when: { prison: true }, limit: 1, scene: { place: 'prison', mood: 'neutral' },
    out: [
      { w: 3, text: { fr: "J'ai creusé toute l'année avec une cuillère à soupe, derrière un poster, en planquant la terre dans mes chaussettes.", en: 'I dug all year with a soup spoon behind a poster, smuggling the dirt out in my socks.' }, fx: tunnel },
      { w: 1, text: { fr: "Les matons ont trouvé mon tunnel derrière le poster. Trois ans de plus et ma cuillère confisquée. Je pleure ma cuillère.", en: 'The guards found my tunnel behind the poster. Three more years and my spoon confiscated. I mourn my spoon.' }, fx: { jail: 3, ...resp(5, tunnelReset) }, mood: 'cry' },
      { w: 0.3, text: { fr: "Le tunnel s'est effondré sur moi. Six heures la tête dans la terre et le cul dans ma cellule. Mon codétenu a fait payer les visites.", en: 'The tunnel caved in on me. Six hours with my head in the dirt and my butt in the cell. My cellmate charged admission.' }, fx: { health: -15, happy: -6, counter: 'pr_spoon' }, mood: 'shock' },
      { w: 0.05, text: none, fx: { die: { fr: 'enseveli{|e} dans mon propre tunnel, une cuillère à soupe à la main', en: 'buried alive in my own tunnel, soup spoon in hand' } } },
    ] },
  { id: 'pr_cig_biz', tab: 'prison', group: 'prison', where: 'prison', icon: '🚬', rating: 2, label: { fr: 'Business de cigarettes', en: 'Cigarette empire' }, desc: { fr: 'La monnaie de la taule', en: 'Prison currency' }, when: { prison: true }, limit: 1, scene: { place: 'prison', mood: 'proud', fx: 'money' },
    out: [
      { w: 2, odds: { smarts: 0.6 }, text: { fr: "J'ai monté le plus gros empire de clopes du bloc. Taux de change : 3 cigarettes = un massage de pieds, 20 = une rangée de dents. Je suis la Banque centrale.", en: "I built the biggest cigarette empire on the block. Exchange rate: 3 smokes = a foot rub, 20 = a row of teeth. I am the Federal Reserve." }, fx: { money: 900, karma: -2, ...resp(10) }, mood: 'proud' },
      { w: 1, text: { fr: "Un concurrent m'a planté une brosse à dents taillée en pointe dans le flanc. Ça pisse le sang comme un tuyau d'arrosage, mais le business continue.", en: 'A competitor stuck a sharpened toothbrush in my side. I\'m spurting like a garden hose, but business goes on.' }, fx: { health: -15, visual: 'gore', ...resp(6) }, mood: 'angry' },
      { w: 1, text: { fr: "Le gardien-chef a saisi 400 paquets dans mon matelas et les a fumés devant moi, un par un, en me soufflant des ronds au visage. Un an de plus.", en: 'The head guard seized 400 packs from my mattress and smoked them in front of me, one by one, blowing rings in my face. One more year.' }, fx: { happy: -6, jail: 1 }, mood: 'sad' },
      { w: 1, text: { fr: "J'ai fumé tout mon stock en une nuit de stress. Mes poumons ressemblent à un barbecue de fin de soirée. J'ai la voix d'un vieux pirate.", en: 'I smoked my entire stock in one stressful night. My lungs look like a barbecue at 3am. I have the voice of an old pirate.' }, fx: { health: -5, addiction: ['tobacco', 15] }, mood: 'sick' },
    ] },
  { id: 'pr_fake_sick', tab: 'prison', group: 'prison', where: 'prison', icon: '🤢', rating: 2, label: { fr: 'Simuler une maladie', en: 'Fake an illness' }, desc: { fr: "Vacances à l'infirmerie", en: 'Infirmary vacation' }, when: { prison: true }, limit: 1, scene: { place: 'hospital', mood: 'sick' },
    out: [
      { w: 2, odds: { smarts: 0.6 }, text: { fr: "J'ai simulé une crise d'appendicite digne d'un César. Trois jours à l'infirmerie, draps propres et gelée verte. Le paradis tremblote.", en: 'I faked an appendicitis worthy of an Oscar. Three days in the infirmary with clean sheets and green jelly. Paradise jiggles.' }, fx: { happy: 7, health: 3 }, mood: 'happy' },
      { w: 1, text: { fr: "J'ai avalé du savon pour avoir l'air malade. J'ai fait des bulles par les deux bouts pendant 48 heures.", en: 'I ate soap to look sick. Blew bubbles out of both ends for 48 hours.' }, fx: { health: -8, happy: -3, visual: 'poop' }, mood: 'sick' },
      { w: 1, text: { fr: "L'infirmier ne m'a pas cru{|e} et m'a fait un lavement « préventif ». Plus jamais. PLUS. JAMAIS.", en: 'The nurse didn\'t buy it and gave me a "preventive" enema. Never again. NEVER. AGAIN.' }, fx: { happy: -8, ...resp(-3) }, mood: 'cry' },
      { w: 0.5, text: { fr: "J'ai si bien simulé qu'ils m'ont vraiment ouvert. Ils m'ont retiré un rein « par erreur ». Le directeur dit qu'il se balade dans l'aile B.", en: 'I faked it so well they actually cut me open. Removed a kidney "by mistake". The warden says it\'s somewhere in Wing B.' }, fx: { health: -20, visual: 'gore' }, mood: 'shock' },
    ] },
  { id: 'pr_romance', tab: 'prison', group: 'prison', where: 'prison', icon: '💘', rating: 2, label: { fr: 'Draguer au parloir', en: 'Visiting-room romance' }, desc: { fr: "L'amour à travers la vitre", en: 'Love through the glass' }, when: { prison: true, age: [18, 120], noHas: 'lover' }, limit: 1, scene: { place: 'prison', mood: 'love' },
    out: [
      { w: 2, odds: { looks: 0.8 }, text: { fr: "J'ai fait les yeux doux à quelqu'un venu voir son cousin au parloir. Trois visites plus tard, on se roulait des pelles à travers la vitre. Les matons ont dû essuyer la bave.", en: 'I made eyes at someone visiting their cousin. Three visits later we were making out through the glass. The guards had to squeegee the drool.' }, fx: { happy: 10, visual: 'hearts', newNpc: { role: 'partner', gender: 'attracted', age: [-8, 8] } }, mood: 'love' },
      { w: 1, text: { fr: "Ma conquête du parloir m'a envoyé des photos très, très osées. Le service courrier les a affichées en salle de pause. Je suis la star des gardiens.", en: 'My visiting-room crush mailed me some very, very spicy photos. The mail room pinned them up in the break room. The guards\' favourite pin-up is me now.' }, fx: { happy: -3, fame: 1, ...resp(3) }, mood: 'shock' },
      { w: 1, text: { fr: "J'ai dragué la mauvaise personne : la femme du chef de gang, en visite. On m'a cassé trois doigts aux douches, un par syllabe de « dé-so-lé ».", en: 'I hit on the wrong person: the gang leader\'s wife, visiting. They broke three of my fingers in the showers, one per syllable of "so-so-rry".' }, fx: { health: -14, visual: 'gore', ...resp(-8) }, mood: 'cry' },
    ] },
  { id: 'pr_messhall', tab: 'prison', group: 'prison', where: 'prison', icon: '🍲', rating: 2, label: { fr: 'Baston au réfectoire', en: 'Mess hall brawl' }, desc: { fr: 'Pour un flan', en: 'Over a pudding' }, when: { prison: true }, limit: 1, scene: { place: 'prison', mood: 'angry', fx: 'gore' },
    out: [
      { w: 2, odds: { athletic: 1 }, text: { fr: "J'ai fracassé un plateau sur le crâne d'un mec qui m'avait piqué mon flan. Sang, purée et flan partout. Le flan est à nouveau à moi.", en: 'I smashed a tray over the head of a guy who stole my pudding. Blood, mash and pudding everywhere. The pudding is mine again.' }, fx: { health: -5, karma: -3, visual: 'gore', ...resp(14) }, mood: 'proud' },
      { w: 1, text: { fr: "On m'a enfoncé la tête dans la marmite de soupe aux pois. J'ai encore des pois dans les sinus. Je les entends rouler la nuit.", en: 'They shoved my head into the pea soup pot. I still have peas in my sinuses. I hear them rolling at night.' }, fx: { health: -12, ...resp(-6) }, mood: 'cry' },
      { w: 1, text: { fr: "J'ai planté une fourchette dans la main d'un caïd. Il l'a retirée, l'a léchée et a fini son repas avec. Je n'ai plus jamais eu faim.", en: 'I stabbed a fork into a kingpin\'s hand. He pulled it out, licked it, and finished his meal with it. I have never been hungry since.' }, fx: { stress: 12, visual: 'gore', ...resp(4) }, mood: 'shock' },
      { w: 0.3, text: { fr: "Les gardiens ont gazé tout le réfectoire. Deux ans de plus pour avoir « initié les hostilités avec un yaourt ».", en: 'The guards tear-gassed the whole mess hall. Two more years for "initiating hostilities with a yogurt".' }, fx: { health: -5, jail: 2, visual: 'police' }, mood: 'sad' },
      { w: 0.06, text: none, fx: { die: { fr: "noyé{|e} dans une marmite de soupe aux pois pendant une baston de cantine", en: 'drowned in a pot of pea soup during a cafeteria brawl' } } },
    ] },
  { id: 'pr_rap', tab: 'prison', group: 'prison', where: 'prison', icon: '🎙️', rating: 2, label: { fr: 'Album de rap en taule', en: 'Prison rap album' }, desc: { fr: 'Gloire depuis la cellule', en: 'Fame from the cell' }, when: { prison: true }, limit: 1, scene: { place: 'prison', mood: 'proud' },
    out: [
      { w: 2, odds: { smarts: 0.4 }, text: { fr: "J'ai enregistré « Barreaux & Bisous » sur un dictaphone, avec un beat fait en tapant sur les chiottes. Le titre « Ta mère au parloir » cartonne sur internet.", en: 'I recorded "Bars & Kisses" on a voice recorder, with a beat made by banging on the toilet. The single "Yo Mama on Visiting Day" is blowing up online.' }, fx: { fame: 8, followers: 15000, happy: 8, ...resp(5) }, mood: 'proud' },
      { w: 1, text: { fr: "Mes lyrics étaient si nuls que mon codétenu a demandé un transfert. « Je suis en taule, c'est pas drôle, j'mange du chou-fleur avec Raoul. » Je suis incompris{|e}.", en: 'My lyrics were so bad my cellmate requested a transfer. "I\'m in the slammer, it\'s a bummer, eating cauliflower with my homie Hammer." Misunderstood genius.' }, fx: { happy: -4, ...resp(-4) }, mood: 'sad' },
      { w: 1, text: { fr: "J'ai clashé un gang rival dans un morceau. Ils m'ont répondu en me rasant les sourcils et en me faisant bouffer mon dictaphone. Piles comprises.", en: 'I dissed a rival gang on a track. They replied by shaving my eyebrows and making me eat my voice recorder. Batteries included.' }, fx: { health: -8, looks: -4, ...resp(5) }, mood: 'cry' },
    ] },
  { id: 'pr_tattoo_gun', tab: 'prison', group: 'prison', where: 'prison', icon: '📼', rating: 2, label: { fr: 'Devenir tatoueur de cellule', en: 'Become the cell tattoo artist' }, desc: { fr: 'Bricolage et encre', en: 'DIY and ink' }, when: { prison: true, age: [18, 120] }, limit: 1, scene: { place: 'prison', mood: 'neutral' },
    out: [
      { w: 2, odds: { smarts: 0.5 }, text: { fr: "J'ai bricolé une machine à tatouer avec un vieux baladeur et beaucoup d'optimisme. Tatoueur officiel du bloc. Spécialité : têtes de mort qui louchent.", en: "I rigged a tattoo machine out of an old walkman and a lot of optimism. Official block tattoo artist. Speciality: cross-eyed skulls." }, fx: { money: 400, ...resp(10) }, mood: 'proud' },
      { w: 1, text: { fr: "J'ai tatoué « MAMAN » sur le torse d'un caïd. J'ai écrit « MAMAM ». Il me cherche. Je change de cellule toutes les nuits.", en: 'I tattooed "MOTHER" on a kingpin\'s chest. I wrote "MOTEHR". He\'s looking for me. I change cells every night.' }, fx: { stress: 15, ...resp(-12) }, mood: 'shock' },
      { w: 1, text: { fr: "Mon client a chopé une infection : son bras est devenu vert, puis violet, puis il a éclaté comme un ballon de pus sur le mur de la cellule. Il me doit encore 20 clopes.", en: 'My client got an infection: his arm went green, then purple, then popped like a pus balloon all over the cell wall. He still owes me 20 smokes.' }, fx: { karma: -3, stress: 5, visual: 'gore', ...resp(-3) }, mood: 'sick' },
      { w: 0.5, text: { fr: "J'ai voulu me tatouer un aigle sur la cuisse. La machine s'est emballée : c'est une bite géante. Tout le bloc l'appelle « l'aigle », par respect.", en: 'I tried to tattoo an eagle on my thigh. The machine went haywire: it\'s a giant dick. The whole block calls it "the eagle", out of respect.' }, fx: { looks: -4, happy: -4, ...resp(2) }, mood: 'shock' },
    ] },
  { id: 'pr_conjugal', tab: 'prison', group: 'prison', where: 'prison', icon: '🛏️', rating: 2, label: { fr: 'Visite conjugale', en: 'Conjugal visit' }, desc: { fr: 'Le bungalow de l\'amour', en: 'The love bungalow' }, when: { prison: true, age: [18, 120], has: 'spouse' }, limit: 1, scene: { place: 'prison', mood: 'love', fx: 'hearts' },
    out: [
      { w: 3, text: { fr: "72 heures de visite conjugale au bungalow de la prison. Le lit grinçait tellement que le mirador a déclenché l'alerte évasion. Notre couple n'a jamais été aussi solide.", en: '72-hour conjugal visit in the prison bungalow. The bed squeaked so hard the watchtower sounded the escape alarm. Our marriage has never been stronger.' }, fx: { happy: 12, stress: -10, visual: 'hearts', ...spouseRel(15) }, mood: 'love' },
      { w: 1, text: { fr: "On a passé la visite à s'engueuler sur ma belle-mère, puis à se réconcilier très bruyamment. Le gardien a frappé : « Encore cinq minutes et j'appelle les renforts. »", en: 'We spent the visit fighting about my mother-in-law, then making up very loudly. The guard banged on the door: "Five more minutes and I\'m calling backup."' }, fx: { happy: 5, ...spouseRel(5) }, mood: 'love' },
      { w: 1, text: { fr: "Le bungalow sentait le vieux camembert et l'eau de Javel. On a joué aux cartes toute la nuit. Ce n'était pas le plan. Et en plus, mon conjoint triche.", en: 'The bungalow smelled of old cheese and bleach. We played cards all night. That was not the plan. And my spouse cheats at cards.' }, fx: { happy: 2, ...spouseRel(3) } },
    ] },
  { id: 'pr_hunger', tab: 'prison', group: 'prison', where: 'prison', icon: '🍽️', rating: 2, label: { fr: 'Grève de la faim', en: 'Hunger strike' }, desc: { fr: 'Pour une cause (le Nutella)', en: 'For a cause (Nutella)' }, when: { prison: true }, limit: 1, scene: { place: 'prison', mood: 'angry' },
    out: [
      { w: 2, odds: { discipline: 1 }, text: { fr: "Grève de la faim pour exiger du Nutella au petit-déj. Au neuvième jour, le directeur a cédé. Les détenus me portent sur leurs épaules. Je pèse 41 kilos.", en: 'Hunger strike demanding Nutella at breakfast. On day nine, the warden caved. The inmates carried me on their shoulders. I weigh 90 pounds.' }, fx: { health: -8, weight: -0.05, fame: 3, ...resp(15) }, mood: 'proud' },
      { w: 1, text: { fr: "J'ai tenu 36 heures. À la 37e, j'ai mangé un savon, un timbre et la moitié de mon matelas. Le matelas avait meilleur goût que la cantine.", en: 'I lasted 36 hours. At hour 37 I ate a bar of soap, a stamp and half my mattress. The mattress tasted better than the cafeteria.' }, fx: { health: -6, ...resp(-10) }, mood: 'sick' },
      { w: 1, text: { fr: "Douze kilos en moins, j'ai commencé à voir mon codétenu sous forme de poulet rôti. Je l'ai léché. Il a demandé un transfert.", en: 'Twenty-five pounds down, I started seeing my cellmate as a roast chicken. I licked him. He requested a transfer.' }, fx: { health: -12, weight: -0.06, visual: 'ghost', ...resp(3) }, mood: 'shock' },
      { w: 0.4, text: { fr: "Les matons m'ont gavé{|e} de force avec un entonnoir. Purée de pois cassés par le nez. Je vois en vert depuis.", en: 'The guards force-fed me with a funnel. Split pea purée up the nose. I see in green now.' }, fx: { health: -10, happy: -10 }, mood: 'cry' },
    ] },
];
