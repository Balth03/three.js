import type { ActionDef, Effect } from '@bl/sim';
import { addLine, cure, L } from '@bl/sim';

const doctorFx: Effect = {
  fn: ({ life, content, rand }) => {
    if (!life.conditions.length) {
      const e = life.gender === 'f' ? 'e' : '';
      const OK: [string, string][] = [[`Le médecin m'a trouvé${e} en pleine forme et m'a donné une sucette.`, 'The doctor said I was perfectly healthy and gave me a lollipop.'], ['Bilan : rien. Le médecin a soupiré, déçu de ne rien trouver à facturer.', 'Check-up: nothing. The doctor sighed, disappointed there was nothing to bill.'], [`« Vous êtes en meilleure santé que moi », m'a dit le médecin en toussant.`, '"You\'re healthier than me," said the doctor, coughing.'], [`Tout est normal. Le médecin m'a quand même prescrit « du repos et moins d'écrans ».`, 'All normal. The doctor still prescribed "rest and less screen time".'], [`Prise de sang parfaite. Je suis reparti${e} fier${e === 'e' ? 'e' : ''} comme un paon.`, 'Perfect blood test. I left proud as a peacock.']];
      const [ofr, oen] = OK[Math.floor(rand() * OK.length)];
      addLine(life, L(ofr, oen), '🩺', 'good');
      return;
    }
    for (const c of life.conditions.slice()) {
      const d = content.diseases.find((x) => x.id === c.id);
      if (d && rand() < d.curable) cure(life, content, c.id);
      else if (d) addLine(life, { fr: `Le traitement n'a rien donné (${d.name.fr.toLowerCase()}). Le médecin a haussé les épaules et encaissé le chèque.`, en: `The treatment for ${d.name.en.toLowerCase()} didn't work.` }, '💊', 'bad');
    }
    life.stats.health = Math.min(100, life.stats.health + 4);
  },
};

export const actions: ActionDef[] = [
  // ───────── Mind & body
  {
    id: 'gym', tab: 'activities', group: 'mind', icon: '🏋️', label: { fr: 'Salle de sport', en: 'Gym' }, desc: { fr: 'Santé, apparence, forme', en: 'Health, looks, fitness' }, when: { age: [12, 120] }, limit: 4, cost: 25,
    out: [
      { w: 4, text: {
        fr: ['J\'ai soulevé de la fonte. Je me sens invincible.', 'Séance cardio : j\'ai transpiré des choses que je ne soupçonnais pas.', 'J\'ai fait du vélo d\'appartement en regardant une série. Ça compte.', "J'ai fait des squats face au miroir pendant qu'un type grognait comme {w:animal}. Respect mutuel.", "J'ai couru [[20|35|50]] minutes sur le tapis avec {w:song} dans les oreilles. Mes mollets ont trouvé la foi."],
        en: ['I lifted weights. I feel invincible.', 'Cardio session: I sweated things I didn\'t know I had.', 'I rode the stationary bike while watching a show. It counts.', 'I did squats in the mirror while a guy grunted like {w:animal}. Mutual respect.', 'I ran [[20|35|50]] minutes on the treadmill with {w:song} in my ears. My calves found religion.'],
      }, fx: { health: 3, looks: 2, athletic: 4, happy: 2, weight: -0.02 } },
      { w: 1, text: {
        fr: ['Je me suis froissé un muscle en voulant impressionner quelqu\'un. Personne n\'a regardé.', "J'ai lâché un haltère sur mon pied et poussé {w:sound} devant toute la salle.", "Je me suis coincé {w:bodypart} dans la machine à abdos. Un coach a dû me libérer avec une clé à molette.", "Le tapis de course allait trop vite. J'ai été propulsé{|e} contre le distributeur de [[barres protéinées|boissons|serviettes]]."],
        en: ['I pulled a muscle trying to impress someone. Nobody was watching.', 'I dropped a dumbbell on my foot and let out {w:sound} in front of the whole gym.', 'I got my {w:bodypart} stuck in the ab machine. A trainer had to free me with a wrench.', 'The treadmill was too fast. I got launched into the [[protein bar|drinks|towel]] machine.'],
      }, fx: { health: -3, happy: -2 } },
    ],
  },
  {
    id: 'run', tab: 'activities', group: 'mind', icon: '🏃', label: { fr: 'Aller courir', en: 'Go for a run' }, when: { age: [8, 90] }, limit: 3,
    out: [
      { w: 4, text: {
        fr: ['J\'ai couru cinq kilomètres. Enfin, cinq minutes. Bref, j\'ai couru.', 'Petit footing au parc. Un pigeon m\'a doublé{|e}.', "Footing {w:weather}. J'ai croisé {w:animal} qui courait plus vite que moi, et pieds nus.", "J'ai couru [[3|7|12]] kilomètres avec {w:song} en boucle. Mes jambes ont tenu, mes oreilles moins.", "Mon appli de course m'a félicité{|e} avec un petit trophée virtuel. J'ai failli pleurer."],
        en: ['I ran a few kilometers. Well, minutes. Anyway, I ran.', 'A little jog in the park. A pigeon overtook me.', 'Jog {w:weather}. I passed {w:animal} running faster than me, barefoot.', 'I ran [[3|7|12]] kilometers with {w:song} on loop. My legs survived, my ears less so.', 'My running app congratulated me with a tiny virtual trophy. I nearly cried.'],
      }, fx: { health: 2, athletic: 3, happy: 1, weight: -0.015 } },
      { w: 1, text: {
        fr: ['Je me suis tordu la cheville sur un trottoir sournois.', "Un chien m'a pris{|e} en chasse sur deux kilomètres. Record personnel battu, ligament aussi.", "J'ai voulu sauter un banc {w:weather}. Le banc a gagné, ma cheville a perdu.", "J'ai glissé sur {w:food}, en plein sprint. Cheville en vrac et dignité en miettes."],
        en: ['I twisted my ankle on a sneaky curb.', 'A dog chased me for over a mile. Personal best smashed, ligament too.', 'I tried to hurdle a bench {w:weather}. The bench won, my ankle lost.', 'I slipped on {w:food} mid-sprint. Ankle wrecked, dignity in pieces.'],
      }, fx: { disease: 'sprain', happy: -3 } },
    ],
  },
  {
    id: 'library', tab: 'activities', group: 'mind', icon: '📚', label: { fr: 'Bibliothèque', en: 'Library' }, desc: { fr: 'Intelligence', en: 'Smarts' }, when: { age: [5, 120] }, limit: 4,
    out: [
      { w: 4, text: {
        fr: ['J\'ai lu un livre entier à la bibliothèque. Mon cerveau a gonflé.', 'J\'ai dévoré une encyclopédie. Je sais maintenant tout sur les ornithorynques.', 'J\'ai emprunté trois romans. J\'en lirai peut-être un.', "J'ai lu un livre entier sur {w:hobby}. Je suis désormais expert{|e} autoproclamé{|e}.", "J'ai trouvé un vieux bouquin affirmant {w:conspiracy}. Je l'ai lu [[deux|trois|quatre]] fois, par sécurité."],
        en: ['I read a whole book at the library. My brain grew.', 'I devoured an encyclopedia. I now know everything about platypuses.', 'I borrowed three novels. I might read one.', 'I read an entire book about {w:hobby}. I am now a self-proclaimed expert.', 'I found an old book claiming {w:conspiracy}. Read it [[two|three|four]] times, just in case.'],
      }, fx: { smarts: 3, happy: 1 } },
      { w: 1, text: {
        fr: ['Je me suis endormi{|e} sur un livre de philo. Le bibliothécaire m\'a réveillé{|e} à la fermeture.', "J'ai fait tomber une pile de livres. Ça a fait {w:sound}. Toute la salle m'a fait « chut ».", "J'ai lu la même page [[quatre|onze|vingt]] fois. Record de concentration inversée.", "Un enfant à côté de moi lisait plus vite que moi, à voix haute, en imitant {w:animal}."],
        en: ['I fell asleep on a philosophy book. The librarian woke me at closing time.', 'I knocked over a stack of books. It sounded like {w:sound}. The whole room shushed me.', 'I read the same page [[four|eleven|twenty]] times. Reverse focus record.', 'A kid next to me read faster than me, out loud, doing an impression of {w:animal}.'],
      }, fx: { smarts: 1, happy: 1 } },
    ],
  },
  {
    id: 'meditate', tab: 'activities', group: 'mind', icon: '🧘', label: { fr: 'Méditer', en: 'Meditate' }, desc: { fr: 'Bonheur, stress', en: 'Happiness, stress' }, when: { age: [10, 120] }, limit: 3,
    out: [
      { w: 3, text: {
        fr: ['J\'ai médité vingt minutes. J\'ai atteint la paix intérieure, puis j\'ai pensé à des frites.', 'Méditation réussie : j\'ai inspiré, expiré, et oublié mes soucis.', "Méditation guidée : la voix m'a dit d'imaginer une plage. J'ai imaginé {w:food}.", "Vingt minutes de silence absolu, interrompues une seule fois par {w:sound}. Le reste était parfait.", "J'ai médité en tailleur jusqu'à ne plus sentir mes jambes. C'était ça, l'éveil ? Non, des [[fourmis|crampes|fourmis géantes]]."],
        en: ['I meditated for twenty minutes. Reached inner peace, then thought about fries.', 'Successful meditation: I breathed in, out, and forgot my worries.', 'Guided meditation: the voice told me to picture a beach. I pictured {w:food}.', 'Twenty minutes of total silence, interrupted only once by {w:sound}. The rest was perfect.', 'I meditated cross-legged until I couldn\'t feel my legs. Was that enlightenment? No, [[pins and needles|cramps|giant pins and needles]].'],
      }, fx: { happy: 4, stress: -8, health: 1 } },
      { w: 1, text: {
        fr: ['Impossible de méditer : le voisin perce un mur depuis 9h.', "Pas moyen de méditer : je voulais absolument {w:activity}.", "J'ai fermé les yeux pour méditer et je me suis réveillé{|e} trois heures plus tard avec {w:animal} sur les genoux.", "Mon appli de méditation a planté en plein « respirez profondément ». J'ai arrêté de respirer par solidarité."],
        en: ["Couldn't meditate: the neighbor has been drilling since 9am.", 'No way to meditate: all I wanted was {w:activity}.', 'I closed my eyes to meditate and woke up three hours later with {w:animal} on my lap.', 'My meditation app crashed mid "breathe deeply". I stopped breathing out of solidarity.'],
      }, fx: { happy: -1 } },
    ],
  },
  {
    id: 'doctor', tab: 'activities', group: 'mind', icon: '🩺', label: { fr: 'Consulter un médecin', en: 'See a doctor' }, desc: { fr: 'Soigner ses maladies', en: 'Treat illnesses' }, limit: 2, cost: 60,
    out: [{ text: {
      fr: ['Je suis allé{|e} chez le médecin.', 'Salle d\'attente : 2 h avec {w:object} et un magazine de 2009, puis 4 minutes de consultation.', 'Rendez-vous chez le docteur. Il a dit « hmm » onze fois.', 'Consultation express : le médecin a tapé sur son clavier sans jamais me regarder.', 'Visite médicale {w:time}. Le cabinet dégageait {w:smell}.', 'Chez le médecin, j\'ai dû expliquer mes symptômes devant une salle pleine. Grosse gêne.'],
      en: ['I went to see a doctor.', 'Waiting room: 2 hours with {w:object} and a 2009 magazine, then a 4-minute appointment.', 'Doctor\'s appointment. He said "hmm" eleven times.', 'Express visit: the doctor typed the whole time without looking at me.', 'Doctor\'s visit {w:time}. The office had {w:smell}.', 'At the doctor\'s I had to describe my symptoms in front of a full waiting room. So awkward.'],
    }, fx: doctorFx }], scene: { place: 'hospital' },
  },
  {
    id: 'diet', tab: 'activities', group: 'mind', icon: '🥗', label: { fr: 'Faire un régime', en: 'Go on a diet' }, when: { age: [14, 100] }, limit: 1,
    out: [
      { w: 2, text: {
        fr: ['J\'ai tenu mon régime toute l\'année. J\'ai même goûté du chou kale de mon plein gré.', "Un an de régime : j'ai rayé {w:food} de ma vie. J'en ai fait le deuil comme d'un proche.", "J'ai compté chaque calorie, même celles du dentifrice. Bilan : [[deux|quatre|six]] kilos en moins et une relation toxique avec ma balance.", "La nuit, je rêve qu'on m'offre {w:food}. Le jour, je mange du céleri. Régime tenu."],
        en: ['I stuck to my diet all year. I even ate kale voluntarily.', 'A year of dieting: I gave up {w:food} forever. I mourned it like a relative.', 'I counted every calorie, even the toothpaste. Result: [[two|four|six]] kilos down and a toxic relationship with my scale.', 'At night I dream someone hands me {w:food}. By day I eat celery. Diet kept.'],
      }, fx: { health: 4, looks: 3, weight: -0.06, happy: -1 } },
      { w: 2, text: {
        fr: ['Régime abandonné au bout de trois jours, à cause d\'une raclette.', "Régime abandonné au bout de [[deux|cinq|neuf]] jours : {w:food} m'a fait de l'œil {w:time}.", "J'ai tenu jusqu'à un anniversaire. Trois parts de gâteau plus tard, le régime reposait en paix.", "Mon régime « détox » a duré une matinée. À midi, je dévorais {w:food} en pleurant de joie."],
        en: ['Diet abandoned after three days, because of a cheese platter.', 'Diet abandoned after [[two|five|nine]] days: {w:food} winked at me {w:time}.', 'I made it until a birthday party. Three slices of cake later, the diet was resting in peace.', 'My "detox" lasted one morning. By noon I was devouring {w:food}, weeping with joy.'],
      }, fx: { happy: 2, weight: 0.01 } },
    ],
  },
  {
    id: 'salon', tab: 'activities', group: 'mind', icon: '💇', label: { fr: 'Coiffeur / institut', en: 'Salon & spa' }, desc: { fr: 'Apparence', en: 'Looks' }, when: { age: [12, 120] }, limit: 2, cost: 70,
    out: [
      { w: 4, text: {
        fr: ['Nouvelle coupe ! Je me suis regardé{|e} dans chaque vitrine en rentrant.', 'Un soin du visage et me voilà rayonnant{|e}.', "Nouvelle coupe. Le coiffeur m'a raconté sa passion pour {w:hobby} pendant une heure. Résultat superbe, oreilles épuisées.", "Coupe tendance : dans la rue, quelqu'un m'a pris{|e} pour {w:celeb}.", "Soin [[à l'argile|au caviar|aux algues]] : ma peau est douce comme une joue de bébé. Je n'arrête pas de me toucher le visage."],
        en: ['New haircut! I checked myself out in every shop window on the way home.', 'One facial later, I\'m glowing.', 'New cut. The stylist told me about his passion for {w:hobby} for an hour. Gorgeous result, exhausted ears.', 'Trendy cut: someone on the street mistook me for {w:celeb}.', '[[Clay|Caviar|Seaweed]] facial: my skin is smooth as a baby\'s cheek. I can\'t stop touching my face.'],
      }, fx: { looks: 4, happy: 3 } },
      { w: 1, text: {
        fr: ['Le coiffeur a « tenté un truc ». Je porte un bonnet pour les six prochains mois.', "Coupe ratée. Un enfant m'a montré{|e} du doigt en criant « {w:exclaim} ».", "Coloration ratée : j'ai les cheveux [[orange|vert pomme|violets]] jusqu'à nouvel ordre.", "Le coiffeur regardait {w:show} sur sa tablette en coupant. Ma frange ressemble à un escalier."],
        en: ['The stylist "tried something". I\'m wearing a beanie for the next six months.', 'Botched cut. A kid pointed at me and yelled "{w:exclaim}"', 'Botched dye job: my hair is [[orange|apple green|purple]] until further notice.', 'The stylist was watching {w:show} on a tablet while cutting. My bangs look like a staircase.'],
      }, fx: { looks: -3, happy: -4 } },
    ],
  },
  // ───────── Fun
  {
    id: 'movies', tab: 'activities', group: 'fun', icon: '🍿', label: { fr: 'Aller au cinéma', en: 'Go to the movies' }, when: { age: [5, 120] }, limit: 3, cost: 14,
    out: [
      { w: 3, text: {
        fr: ['J\'ai vu un film d\'action où tout explose. Excellent.', 'J\'ai vu une comédie romantique. J\'ai pleuré, mais c\'était les oignons du pop-corn.', 'J\'ai vu un film d\'auteur de trois heures. Je crois avoir compris la fin.', "J'ai vu {w:movie}. Deux heures d'explosions et une fin ouverte pour le prochain épisode.", "Ciné : {w:movie}, un seau de pop-corn [[géant|familial|indécent]] et un voisin qui mâchait comme {w:animal}."],
        en: ['I saw an action movie where everything explodes. Excellent.', 'I saw a romcom. I cried, but it was the popcorn onions.', 'I saw a three-hour art film. I think I understood the ending.', 'I saw {w:movie}. Two hours of explosions and a cliffhanger for the sequel.', 'Movies: {w:movie}, a [[giant|family-size|obscene]] popcorn bucket and a neighbor chewing like {w:animal}.'],
      }, fx: { happy: 5 } },
      { w: 1, text: {
        fr: ['Quelqu\'un a raconté la fin du film à voix haute. J\'envisage une carrière criminelle.', "Un enfant a tapé dans mon siège pendant tout {w:movie}. J'ai le dos en compote.", "Le film était si nul que j'ai compté les [[spots|fauteuils|sorties de secours]] pendant une heure.", "Le téléphone de quelqu'un a sonné sur {w:song} pendant la scène la plus triste du film."],
        en: ['Someone said the ending out loud. I\'m considering a life of crime.', 'A kid kicked my seat through the whole of {w:movie}. My back is mush.', 'The movie was so bad I counted the [[ceiling lights|seats|emergency exits]] for an hour.', 'Someone\'s phone rang with {w:song} during the saddest scene of the movie.'],
      }, fx: { happy: -2 } },
    ],
  },
  {
    id: 'videogames', tab: 'activities', group: 'fun', icon: '🎮', label: { fr: 'Jouer aux jeux vidéo', en: 'Play video games' }, when: { age: [5, 120] }, limit: 3,
    out: [
      { w: 3, text: {
        fr: ['J\'ai joué à Mario Kart toute la nuit. J\'ai insulté une carapace bleue.', 'J\'ai enfin battu le boss final. Mes pouces sont en deuil.', 'J\'ai construit une cathédrale dans Minecraft.', "J'ai joué [[quatre|sept|douze]] heures d'affilée à un jeu où l'on élève {w:animal}. Il est niveau 99.", "J'ai découvert un jeu où l'on incarne {w:weird_job}. Je suis accro et je ne sais pas pourquoi."],
        en: ['I played Mario Kart all night. I cursed at a blue shell.', 'I finally beat the final boss. My thumbs are in mourning.', 'I built a cathedral in Minecraft.', 'I played [[four|seven|twelve]] hours straight of a game where you raise {w:animal}. It\'s level 99.', 'I discovered a game where you play {w:weird_job}. I\'m hooked and I don\'t know why.'],
      }, fx: { happy: 5, smarts: 1, athletic: -1 } },
      { w: 1, text: {
        fr: ['J\'ai perdu contre un enfant de 9 ans en ligne. Il a été très méchant.', "Ma console a planté juste avant la sauvegarde. Trois heures envolées. J'ai poussé {w:sound}.", "Mon adversaire en ligne s'appelait « {w:nickname} ». Il m'a battu{|e} [[dix|vingt|cinquante]] fois d'affilée.", "J'ai lancé la manette contre le mur. Le mur va bien. La manette, beaucoup moins."],
        en: ['I lost to a 9-year-old online. He was very rude.', 'My console crashed right before saving. Three hours gone. I let out {w:sound}.', 'My online opponent was called "{w:nickname}". He beat me [[ten|twenty|fifty]] times in a row.', 'I threw the controller at the wall. The wall\'s fine. The controller, much less so.'],
      }, fx: { happy: -3 } },
    ],
  },
  {
    id: 'music', tab: 'activities', group: 'fun', icon: '🎸', label: { fr: 'Pratiquer un instrument', en: 'Practice an instrument' }, when: { age: [6, 100] }, limit: 2,
    out: [
      { w: 2, odds: { smarts: 0.5 }, text: {
        fr: ['J\'ai pratiqué la guitare. Les voisins ont applaudi. (Pour que j\'arrête ?)', "J'ai répété {w:song} au [[ukulélé|violon|synthé]] pendant deux heures. Le chien du voisin a hurlé en harmonie.", "Séance de batterie : j'ai produit {w:sound}, mais en rythme.", "J'ai enfin réussi l'accord de fa barré. Doigts en compote, âme en fête.", "J'ai joué de la flûte sur le balcon {w:weather}. Un passant m'a donné une pièce pour que je déménage."],
        en: ['I practiced guitar. The neighbors applauded. (So I\'d stop?)', 'I rehearsed {w:song} on the [[ukulele|violin|synth]] for two hours. The neighbor\'s dog howled in harmony.', 'Drum practice: I produced {w:sound}, but in rhythm.', 'I finally nailed the F barre chord. Fingers mangled, soul dancing.', 'I played the recorder on the balcony {w:weather}. A passerby gave me a coin to move away.'],
      }, fx: { happy: 3, smarts: 1, fn: ({ life }) => { if (life.talent === 'music') life.talentKnown = true; } } },
      { w: 1, text: {
        fr: ['J\'ai joué du piano pendant une heure. Une seule chanson. La même.', "J'ai joué du triangle pendant une heure. J'ai découvert ses limites. Et les miennes.", "J'ai tenté {w:song} au trombone. Les vitres ont tremblé et {w:animal} a quitté le quartier.", "Une heure de gammes. Mon prof a soupiré [[douze|trente|cent]] fois, puis m'a conseillé {w:hobby}."],
        en: ['I played piano for an hour. One song. The same one.', 'I played the triangle for an hour. I discovered its limits. And mine.', 'I attempted {w:song} on the trombone. The windows shook and {w:animal} left the neighborhood.', 'An hour of scales. My teacher sighed [[twelve|thirty|a hundred]] times, then suggested I take up {w:hobby}.'],
      }, fx: { happy: 2 } },
    ],
  },
  {
    id: 'art', tab: 'activities', group: 'fun', icon: '🖌️', label: { fr: 'Dessiner / peindre', en: 'Draw or paint' }, when: { age: [3, 120] }, limit: 2,
    out: [
      { w: 1, text: {
        fr: ['J\'ai peint un coucher de soleil. Ou une omelette. L\'art est subjectif.', 'J\'ai rempli un carnet entier de croquis.', "J'ai peint {w:animal} [[en bleu|à l'aquarelle|avec mes doigts]]. On dirait plutôt {w:food}.", "J'ai dessiné un portrait de mamie. Elle l'a accroché à l'envers et elle l'adore.", "J'ai sculpté {w:vehicle} en pâte à modeler. Presque grandeur nature."],
        en: ['I painted a sunset. Or an omelet. Art is subjective.', 'I filled a whole sketchbook.', 'I painted {w:animal} [[in blue|in watercolor|with my fingers]]. It looks more like {w:food}.', 'I drew a portrait of grandma. She hung it upside down and loves it.', 'I sculpted {w:vehicle} out of modeling clay. Almost life-size.'],
      }, fx: { happy: 4, fn: ({ life }) => { if (life.talent === 'art') life.talentKnown = true; } } },
    ],
  },
  {
    id: 'walk', tab: 'activities', group: 'fun', icon: '🌳', label: { fr: 'Balade au parc', en: 'Walk in the park' }, limit: 3, when: { age: [3, 120] },
    out: [
      { w: 3, text: {
        fr: ['J\'ai fait une balade au parc. J\'ai caressé trois chiens. Journée parfaite.', 'J\'ai nourri les canards. L\'un d\'eux m\'a jugé{|e}.', "Balade au parc {w:weather}. J'ai croisé {w:animal}. On s'est salués poliment.", "J'ai fait le tour du lac [[deux|trois|cinq]] fois. Les canards me reconnaissent maintenant.", "Sur un banc, un papy pratiquait {w:hobby}. Je suis resté{|e} une heure à regarder, fasciné{|e}."],
        en: ['I took a walk in the park. Pet three dogs. Perfect day.', 'I fed the ducks. One of them judged me.', 'Walk in the park {w:weather}. I ran into {w:animal}. We nodded politely.', 'I walked around the lake [[two|three|five]] times. The ducks recognize me now.', 'On a bench, an old man was practicing {w:hobby}. I watched for an hour, spellbound.'],
      }, fx: { happy: 3, health: 1, stress: -4 } },
      { w: 1, text: {
        fr: ['Il s\'est mis à pleuvoir des cordes au milieu de ma balade.', "Un pigeon m'a visé{|e} depuis une branche. Il ne m'a pas raté{|e}.", "J'ai marché dans un truc mou. C'était {w:food}, heureusement. Je crois.", "{w:animal} m'a poursuivi{|e} jusqu'à la sortie du parc. Je n'y remettrai plus les pieds."],
        en: ['It started pouring in the middle of my walk.', 'A pigeon took aim from a branch. It didn\'t miss.', 'I stepped in something squishy. It was {w:food}, luckily. I think.', '{w:animal} chased me all the way out of the park. I\'m never going back.'],
      }, fx: { happy: -1 } },
    ],
  },
  {
    id: 'nightclub', tab: 'activities', group: 'fun', icon: '🪩', label: { fr: 'Sortir en boîte', en: 'Go clubbing' }, when: { age: [18, 70] }, limit: 2, cost: 40,
    out: [
      { w: 3, text: {
        fr: ['J\'ai dansé jusqu\'à 5h. Mes pieds portent plainte.', 'Soirée en boîte : j\'ai fait la chenille avec des inconnus.', "Le DJ a remixé {w:song} pendant [[dix|vingt|quarante]] minutes. J'ai dansé comme si personne ne regardait. Tout le monde regardait.", "Il flottait {w:smell} sur la piste, mais la musique était parfaite. J'ai dansé en apnée.", "J'ai cru voir {w:celeb} au carré VIP. C'était un sosie. On a quand même dansé ensemble."],
        en: ['I danced until 5am. My feet are suing.', 'Night out: I did the conga with strangers.', 'The DJ remixed {w:song} for [[ten|twenty|forty]] minutes. I danced like nobody was watching. Everybody was.', 'There was {w:smell} on the dance floor, but the music was perfect. I danced holding my breath.', 'I thought I saw {w:celeb} in the VIP area. It was a lookalike. We danced together anyway.'],
      }, fx: { happy: 7, health: -1 } },
      { w: 1, text: {
        fr: ['Le videur m\'a refusé l\'entrée à cause de mes chaussures. Humiliation.', "Refoulé{|e} à l'entrée. Le videur m'a surnommé{|e} « {w:nickname} » et m'a montré le trottoir.", "Quarante minutes de queue {w:weather} pour une boîte qui fermait à 2 h. Arrivé{|e} à la porte à [[1 h 58|1 h 59|2 h pile]].", "Je me suis étalé{|e} sur la piste devant toute la boîte. Le DJ a ajouté un bruitage."],
        en: ['The bouncer turned me away because of my shoes. Humiliating.', 'Turned away at the door. The bouncer nicknamed me "{w:nickname}" and pointed at the sidewalk.', 'Forty minutes in line {w:weather} for a club that closed at 2. Reached the door at [[1:58|1:59|2:00 sharp]].', 'I wiped out on the dance floor in front of the whole club. The DJ added a sound effect.'],
      }, fx: { happy: -4 } },
      { w: 1, text: {
        fr: ['J\'ai rencontré quelqu\'un de charmant sur la piste. On a échangé nos numéros !', "Un slow inattendu sur {w:song}. J'ai fini la soirée avec un numéro et un sourire niais.", "Rencontre au vestiaire : on avait des tickets qui se suivaient, [[47 et 48|112 et 113|303 et 304]]. Le destin. Numéros échangés.", "Quelqu'un m'a glissé à l'oreille : « {w:compliment} ». J'ai donné mon numéro sur-le-champ."],
        en: ['I met someone charming on the dance floor. We swapped numbers!', 'An unexpected slow dance to {w:song}. I ended the night with a number and a goofy grin.', 'Met at the coat check: our tickets were [[47 and 48|112 and 113|303 and 304]]. Destiny. Numbers swapped.', 'Someone whispered in my ear: "{w:compliment}". I gave my number on the spot.'],
      }, fx: { happy: 6, newNpc: { role: 'friend', age: [-3, 3], gender: 'attracted' } } },
    ],
  },
  {
    id: 'lottery', tab: 'assets', group: 'money', icon: '🎟️', label: { fr: 'Ticket de loterie', en: 'Lottery ticket' }, when: { age: [18, 120] }, limit: 5, cost: 3,
    out: [
      { w: 2000, text: {
        fr: ['Perdu. Évidemment.', 'Pas un seul bon numéro. Le ticket est parti à la poubelle.', 'Perdu. Mais l\'espace d\'un instant, j\'ai rêvé d\'un yacht.', "Perdu. Avec le gros lot, j'aurais acheté {w:vehicle} et {w:object}. Tant pis.", "Perdu. Je m'imaginais déjà vivre {w:far_place}. Le buraliste m'a regardé{|e} avec [[pitié|tendresse|lassitude]]."],
        en: ['Lost. Obviously.', 'Not one matching number. The ticket went in the bin.', 'Lost. But for a moment, I dreamt of a yacht.', 'Lost. With the jackpot, I\'d have bought {w:vehicle} and {w:object}. Oh well.', 'Lost. I was already picturing life {w:far_place}. The clerk looked at me with [[pity|tenderness|weariness]].'],
      }, fx: { happy: -1 } },
      { w: 150, text: {
        fr: ['J\'ai gagné un petit lot au grattage !', "Petit lot au grattage ! De quoi m'offrir {w:food}. La grande vie.", "Petit gain ! J'ai crié « {w:exclaim} » si fort que le buraliste a sursauté.", "[[Deux|Trois]] symboles identiques : petit gain ! J'ai aussitôt racheté des tickets. Logique."],
        en: ['I won a small prize!', 'Small scratch-card win! Enough for {w:food}. Living large.', 'Small win! I yelled "{w:exclaim}" so loud the clerk jumped.', '[[Two|Three]] matching symbols: small win! I immediately bought more tickets. Logic.'],
      }, fx: { money: 50, happy: 4 } },
      { w: 8, text: {
        fr: ['JACKPOT moyen : j\'ai gagné une jolie somme à la loterie !', "JACKPOT moyen ! J'ai fait une danse de la joie au milieu du tabac en imitant {w:animal}.", "Jolie somme gagnée ! J'ai déjà repéré {w:vehicle}, et trois cousins éloignés m'ont appelé{|e}.", "Gros gain à la loterie ! Le buraliste m'a serré la main [[longtemps|trop longtemps|en pleurant]]."],
        en: ['Mid-size JACKPOT: I won a nice sum in the lottery!', 'Mid-size JACKPOT! I did a happy dance in the middle of the shop doing an impression of {w:animal}.', 'Nice sum won! I\'ve already spotted {w:vehicle}, and three distant cousins called me.', 'Big lottery win! The clerk shook my hand [[for a long time|for way too long|in tears]].'],
      }, fx: { money: 25000, happy: 15, visual: 'money' } },
      { w: 0.3, text: {
        fr: ['🎉 J\'AI GAGNÉ LE GROS LOT. JE SUIS MILLIONNAIRE. 🎉', "🎉 GROS LOT ! J'ai déjà réservé un aller simple : je pars vivre {w:far_place}. 🎉", "🎉 MILLIONNAIRE ! J'ai crié « {w:exclaim} » et je me suis évanoui{|e} au milieu du bureau de tabac. 🎉", "🎉 LE GROS LOT. Ma banquière me tutoie. Ma famille s'est agrandie de [[douze|trente|cinquante]] membres en une nuit. 🎉"],
        en: ['🎉 I WON THE JACKPOT. I\'M A MILLIONAIRE. 🎉', '🎉 JACKPOT! One-way ticket already booked: I\'m going to live {w:far_place}. 🎉', '🎉 MILLIONAIRE! I yelled "{w:exclaim}" and fainted in the middle of the shop. 🎉', '🎉 THE JACKPOT. My banker calls me by my first name. My family grew by [[twelve|thirty|fifty]] members overnight. 🎉'],
      }, fx: { money: 5000000, happy: 40, fame: 10, counter: 'jackpot', visual: 'money' } },
    ],
  },
  {
    id: 'moveout', tab: 'assets', group: 'home', icon: '🏠', label: { fr: 'Quitter le nid familial', en: 'Move out' }, desc: { fr: 'Liberté… et loyer', en: 'Freedom… and rent' }, when: { age: [18, 120], movedOut: false }, limit: 1,
    out: [{ text: {
      fr: ['J\'ai emménagé dans mon propre appartement. Il est minuscule, mais il est à moi (enfin, au propriétaire).', "J'ai emménagé dans un studio de [[9|14|17]] m². La douche est dans la cuisine. Je suis libre.", "Premier appart ! Mes seuls meubles : un matelas et {w:object}.", "J'ai quitté le nid. Le premier soir, j'ai mangé {w:food} debout, sans assiette. Le bonheur absolu."],
      en: ['I moved into my own apartment. It\'s tiny, but it\'s mine (well, the landlord\'s).', 'I moved into a [[100|150|180]] sq ft studio. The shower is in the kitchen. I\'m free.', 'First apartment! My only furniture: a mattress and {w:object}.', 'I left the nest. First night, I ate {w:food} standing up, no plate. Pure bliss.'],
    }, fx: { happy: 8, moveOut: true }, mood: 'proud' }],
  },
  {
    id: 'adopt', tab: 'assets', group: 'home', icon: '🐶', label: { fr: 'Adopter un animal', en: 'Adopt a pet' }, when: { age: [18, 100] }, limit: 1, cost: 150,
    out: [
      { w: 1, text: {
        fr: ['J\'ai adopté un chien au refuge. Il a mangé ma chaussure dans l\'heure. Je l\'aime.', "J'ai adopté un chien au refuge. Il a aboyé sur {w:object} pendant une heure. Je l'aime.", "Nouveau chien ! Je l'ai appelé « {w:nickname} ». Il ne répond qu'au bruit du paquet de croquettes.", "J'ai adopté un vieux chien du refuge. Il dort [[18|20|22]] heures par jour. On a le même rythme."],
        en: ['I adopted a dog from the shelter. It ate my shoe within the hour. I love it.', 'I adopted a shelter dog. It barked at {w:object} for an hour. I love it.', 'New dog! I named him "{w:nickname}". He only answers to the sound of the kibble bag.', 'I adopted an old shelter dog. He sleeps [[18|20|22]] hours a day. We\'re on the same schedule.'],
      }, fx: { happy: 10, newNpc: { role: 'pet', species: 'dog', age: [1, 4], abs: true } } },
      { w: 1, text: {
        fr: ['J\'ai adopté un chat. Ou plutôt, il m\'a adopté{|e}.', "J'ai adopté un chat. Il a passé sa première nuit à fixer {w:object} d'un air menaçant.", "Nouveau chat, baptisé « {w:nickname} ». Il a déjà pris possession de mon oreiller.", "J'ai ramené un chat du refuge. Il m'a ignoré{|e} trois jours, puis m'a offert une souris morte. On est en couple."],
        en: ['I adopted a cat. Or rather, it adopted me.', 'I adopted a cat. It spent its first night glaring menacingly at {w:object}.', 'New cat, named "{w:nickname}". It has already claimed my pillow.', 'I brought a cat home from the shelter. It ignored me for three days, then gave me a dead mouse. We\'re a couple now.'],
      }, fx: { happy: 10, newNpc: { role: 'pet', species: 'cat', age: [1, 4], abs: true } } },
    ],
  },
  // ───────── Love
  { id: 'dating', tab: 'relations', group: 'love', icon: '💘', label: { fr: 'Trouver l\'amour', en: 'Find love' }, when: { age: [14, 100] }, open: 'dating' },
  // ───────── School
  {
    id: 'study', tab: 'school', group: 'school', icon: '📖', label: { fr: 'Étudier plus', en: 'Study harder' }, when: { school: 'any', age: [6, 99] }, limit: 3,
    out: [
      { w: 3, text: {
        fr: ['J\'ai révisé comme jamais. Mes surligneurs sont à sec.', 'J\'ai fait des fiches de révision. Elles sont magnifiques. Je ne les relirai jamais.', "J'ai révisé {w:time}. Mon cerveau a fumé, mais j'ai tout retenu. Presque.", "J'ai enchaîné [[trois|cinq|huit]] exercices de maths. Mon stylo a demandé grâce.", "Pour me motiver, je me suis promis {w:food} après chaque chapitre. J'ai beaucoup révisé. Et beaucoup mangé."],
        en: ['I studied like never before. My highlighters are dry.', 'I made flashcards. They\'re gorgeous. I\'ll never read them.', 'I studied {w:time}. My brain was smoking, but I remembered everything. Almost.', 'I did [[three|five|eight]] math problems in a row. My pen begged for mercy.', 'To motivate myself, I promised myself {w:food} after each chapter. I studied a lot. And ate a lot.'],
      }, fx: { grade: 7, smarts: 2, discipline: 2, fn: ({ life }) => { life.edu.effort = Math.min(100, life.edu.effort + 20); } } },
      { w: 1, text: {
        fr: ['J\'ai ouvert mon livre, puis mon téléphone. Trois heures plus tard…', "Je voulais réviser, mais j'ai fini par {w:activity}. Trois heures plus tard…", "J'ai regardé une vidéo « pour réviser ». Puis une sur {w:animal}. Puis [[douze|quarante|cent]] autres.", "J'ai surligné tout le manuel en fluo. Absolument tout. Ça ne sert plus à rien."],
        en: ['I opened my book, then my phone. Three hours later…', 'I meant to study, but ended up {w:activity}. Three hours later…', 'I watched a video "to study". Then one about {w:animal}. Then [[twelve|forty|a hundred]] more.', 'I highlighted the entire textbook. Literally all of it. Now it\'s useless.'],
      }, fx: { grade: 1 } },
    ],
  },
  {
    id: 'skip', tab: 'school', group: 'school', icon: '🙈', label: { fr: 'Sécher les cours', en: 'Skip class' }, when: { school: ['middle', 'high', 'uni', 'grad'] }, limit: 2,
    out: [
      { w: 3, text: {
        fr: ['J\'ai séché pour aller au parc. Personne n\'a rien remarqué.', "J'ai séché les cours pour {w:activity}. Meilleure décision de l'année.", "J'ai séché le cours de [[maths|chimie|sport]], planqué{|e} derrière le gymnase. Un délicieux frisson d'illégalité.", "J'ai séché pour traîner en ville {w:weather}. J'ai regretté la salle de classe chauffée."],
        en: ['I skipped class to hang out at the park. Nobody noticed.', 'I skipped class and spent the day {w:activity}. Best decision of the year.', 'I skipped [[math|chemistry|PE]], hiding behind the gym. A delicious thrill of lawlessness.', 'I skipped to hang around town {w:weather}. I missed the heated classroom.'],
      }, fx: { happy: 4, grade: -4 } },
      { w: 1, text: {
        fr: ['Pris{|e} en flagrant délit de sèche. Heure de colle et coup de fil aux parents.', "Le CPE m'a trouvé{|e} caché{|e} derrière {w:vehicle} sur le parking. Heure de colle.", "J'ai séché, mais ma mère faisait ses courses juste là. Regard noir, retour en classe, coup de fil au proviseur.", "Mon excuse : « {w:animal} a mangé mon emploi du temps ». Personne n'y a cru. [[Deux|Trois|Quatre]] heures de colle."],
        en: ['Caught skipping. Detention and a call to my parents.', 'The dean found me hiding behind {w:vehicle} in the parking lot. Detention.', 'I skipped, but my mom was shopping right there. Death glare, back to class, call to the principal.', 'My excuse: "{w:animal} ate my timetable." Nobody bought it. [[Two|Three|Four]] hours of detention.'],
      }, fx: { happy: -4, grade: -5, discipline: -2 } },
    ],
  },
  {
    id: 'teacher', tab: 'school', group: 'school', icon: '🍎', label: { fr: 'Fayoter avec le prof', en: 'Suck up to the teacher' }, when: { school: ['primary', 'middle', 'high'] }, limit: 1,
    out: [
      { w: 2, text: {
        fr: ['J\'ai offert une pomme à ma prof. Elle m\'a souri. Mes notes aussi.', "J'ai offert {w:food} à mon prof. Il a souri. Mes notes aussi.", "J'ai ri à toutes les blagues du prof, même celle sur les fractions. +[[2|3|4]] points de sympathie.", "Je me suis proposé{|e} pour effacer le tableau toute l'année. La prof m'appelle « {w:nickname} ». C'est affectueux, je crois."],
        en: ['I gave my teacher an apple. She smiled. So did my grades.', 'I gave my teacher {w:food}. He smiled. So did my grades.', 'I laughed at all the teacher\'s jokes, even the one about fractions. +[[2|3|4]] sympathy points.', 'I volunteered to wipe the board all year. The teacher calls me "{w:nickname}". Affectionately, I think.'],
      }, fx: { grade: 4 } },
      { w: 1, text: {
        fr: ['Toute la classe m\'a vu{|e} fayoter. Ma réputation est en miettes.', "Toute la classe m'a vu{|e} porter le cartable du prof. Mon nouveau surnom : « {w:nickname} ».", "J'ai offert {w:food} au prof devant tout le monde. Les autres m'ont boudé{|e} [[une semaine|un mois|jusqu'aux vacances]].", "J'ai levé la main pour rappeler au prof qu'il avait oublié de donner des devoirs. Je mange seul{|e} à la cantine depuis."],
        en: ['The whole class saw me sucking up. My reputation is in ruins.', 'The whole class saw me carrying the teacher\'s bag. My new nickname: "{w:nickname}".', 'I gave the teacher {w:food} in front of everyone. The others ignored me [[for a week|for a month|until the holidays]].', 'I raised my hand to remind the teacher he forgot to give homework. I\'ve eaten lunch alone ever since.'],
      }, fx: { grade: 2, happy: -3 } },
    ],
  },
  { id: 'uni_apply', tab: 'school', group: 'next', icon: '🎓', label: { fr: 'Postuler à l\'université', en: 'Apply to university' }, when: { degree: 'high', school: 'none', age: [17, 80] }, open: 'university' },
  { id: 'grad_apply', tab: 'school', group: 'next', icon: '🧑‍🎓', label: { fr: 'Études supérieures', en: 'Graduate school' }, when: { degree: 'uni', school: 'none' }, open: 'grad' },
  {
    id: 'dropout', tab: 'school', group: 'next', icon: '🚪', label: { fr: 'Abandonner les études', en: 'Drop out' }, when: { school: ['high', 'uni', 'grad'], age: [16, 99] }, limit: 1,
    out: [{ text: {
      fr: ['J\'ai claqué la porte de l\'école. Mes parents sont en état de choc.', "J'ai quitté l'école. Mon plan de carrière : {w:hobby}. Mes parents ont pleuré.", "J'ai rendu mes manuels et je suis parti{|e} en sifflant {w:song}.", "Abandon officiel. J'ai brûlé mes cours de [[maths|philo|chimie]] dans le jardin. Les voisins ont appelé les pompiers."],
      en: ['I slammed the school door behind me. My parents are in shock.', 'I dropped out. My career plan: {w:hobby}. My parents cried.', 'I handed back my textbooks and walked out whistling {w:song}.', 'Officially dropped out. I burned my [[math|philosophy|chemistry]] notes in the yard. The neighbors called the fire department.'],
    }, fx: { dropout: true, happy: 3 } }],
  },
  // ───────── Career
  { id: 'jobs', tab: 'career', group: 'jobs', icon: '📋', label: { fr: 'Offres d\'emploi', en: 'Job listings' }, when: { age: [14, 100] }, open: 'jobs' },
  {
    id: 'workhard', tab: 'career', group: 'job', icon: '💪', label: { fr: 'Travailler plus dur', en: 'Work harder' }, when: { job: true }, limit: 2,
    out: [
      { w: 4, text: {
        fr: ['J\'ai fait des heures sup. Mon chef a remarqué. Mon dos aussi.', 'J\'ai bouclé un dossier en avance. Le stagiaire me regarde comme un dieu.', "J'ai bossé jusqu'à 22 h chez {employer}. Le vigile pense que j'habite ici.", "Je me suis donné{|e} à fond. Mon chef m'a félicité{|e} {w:time}, devant tout le monde.", "J'ai sauté [[le déjeuner|la pause café|deux repas]] et mangé {w:food} devant mon écran. Productivité maximale."],
        en: ['I put in overtime. My boss noticed. So did my back.', 'I finished a project early. The intern looks at me like a god.', 'I worked until 10pm at {employer}. The security guard thinks I live here.', 'I gave it everything. My boss praised me {w:time}, in front of everyone.', 'I skipped [[lunch|my coffee break|two meals]] and ate {w:food} at my desk. Peak productivity.'],
      }, fx: { perf: 12, stress: 5, happy: -1 } },
      { w: 1, text: {
        fr: ['J\'ai travaillé dur… sur le mauvais dossier.', "J'ai bossé tout le week-end sur un dossier. Le client l'avait annulé vendredi.", "J'ai fait des heures sup {w:time}. Personne ne l'a remarqué, à part {w:animal} sur le rebord de la fenêtre.", "Énorme effort, zéro reconnaissance : mon chef a attribué mon travail au stagiaire, un certain « {w:nickname} »."],
        en: ['I worked hard… on the wrong project.', 'I worked all weekend on a file. The client had cancelled it on Friday.', 'I did overtime {w:time}. Nobody noticed, except {w:animal} on the windowsill.', 'Huge effort, zero credit: my boss gave my work to the intern, some guy called "{w:nickname}".'],
      }, fx: { perf: 2, happy: -3 } },
    ],
  },
  {
    id: 'slack', tab: 'career', group: 'job', icon: '😴', label: { fr: 'Glander au boulot', en: 'Slack off' }, when: { job: true }, limit: 2,
    out: [
      { w: 3, text: {
        fr: ['J\'ai passé la journée à faire semblant de taper un rapport important.', "Au boulot aujourd'hui, j'ai préféré {w:activity}. Personne n'a rien vu.", "[[Trois|Quatre|Six]] pauses café et une sieste aux toilettes. Journée parfaite.", "J'ai regardé {w:show} en entier, saison après saison, en faisant semblant d'être en visio."],
        en: ['I spent the day pretending to type an important report.', 'At work today, I went with {w:activity} instead. Nobody noticed.', '[[Three|Four|Six]] coffee breaks and a nap in the bathroom. Perfect day.', 'I binged {w:show}, season after season, while pretending to be on a video call.'],
      }, fx: { perf: -6, happy: 4, stress: -5 } },
      { w: 1, text: {
        fr: ['Mon patron m\'a surpris{|e} en train de regarder des vidéos de chats.', "Mon patron m'a surpris{|e} devant {w:show}, plein écran, son à fond.", "Endormi{|e} sur mon clavier. Le patron a trouvé [[400|1 200|9 000]] lignes de « jjjjjjjj » dans mon rapport.", "Mon chef m'a vu{|e} {w:activity} pendant la réunion. Il a pris des notes. Sur moi."],
        en: ['My boss caught me watching cat videos.', 'My boss caught me watching {w:show}, full screen, volume up.', 'Fell asleep on my keyboard. My boss found [[400|1,200|9,000]] lines of "jjjjjjjj" in my report.', 'My boss saw me {w:activity} during the meeting. He took notes. On me.'],
      }, fx: { perf: -14, happy: -2 } },
    ],
  },
  {
    id: 'raise', tab: 'career', group: 'job', icon: '💸', label: { fr: 'Demander une augmentation', en: 'Ask for a raise' }, when: { job: true }, limit: 1,
    out: [{
      text: {
        fr: ['J\'ai pris mon courage à deux mains et frappé à la porte du patron.', "J'ai répété mon discours devant le miroir, puis j'ai frappé chez le patron {w:time}.", "Demande d'augmentation : j'ai apporté {w:food} pour amadouer le patron.", "J'ai débarqué chez le patron avec un tableur de [[12|30|47]] onglets prouvant ma valeur."],
        en: ['I gathered my courage and knocked on the boss\'s door.', 'I rehearsed my speech in the mirror, then knocked on the boss\'s door {w:time}.', 'Raise request: I brought {w:food} to soften up the boss.', 'I barged into the boss\'s office with a [[12|30|47]]-tab spreadsheet proving my worth.'],
      },
      fx: {
        fn: ({ life, rand }) => {
          const j = life.job!;
          if (j.perf > 55 && rand() < 0.35 + (j.perf - 55) / 80) {
            j.salary = Math.round(j.salary * (1.05 + rand() * 0.07));
            addLine(life, L('Augmentation accordée ! Je me sens riche (je ne le suis pas).', 'Raise granted! I feel rich (I\'m not).'), '💰', 'good');
            life.stats.happy = Math.min(100, life.stats.happy + 6);
          } else {
            j.perf = Math.max(0, j.perf - 6);
            addLine(life, L('Refusée. Il m\'a parlé du « contexte économique » pendant vingt minutes.', 'Denied. He talked about "the economic climate" for twenty minutes.'), '🙅', 'bad');
            life.stats.happy = Math.max(0, life.stats.happy - 4);
          }
        },
      },
    }],
  },
  {
    id: 'quit', tab: 'career', group: 'job', icon: '🚪', label: { fr: 'Démissionner', en: 'Quit job' }, when: { job: true }, limit: 1,
    out: [{ text: {
      fr: ['J\'ai posé ma démission. Je suis sorti{|e} sous les regards jaloux.', "J'ai démissionné {w:time}. Mon chef n'a même pas levé les yeux.", "J'ai annoncé ma démission en chantant {w:song} dans l'open space.", "J'ai quitté {employer} sans préavis. Mon plan : {w:hobby} à plein temps."],
      en: ['I handed in my notice. I walked out under jealous stares.', 'I quit {w:time}. My boss didn\'t even look up.', 'I announced my resignation by singing {w:song} across the open-plan office.', 'I left {employer} without notice. My plan: full-time {w:hobby}.'],
    }, fx: { quitJob: true, happy: 4 } }],
  },
  {
    id: 'retire', tab: 'career', group: 'job', icon: '🏖️', label: { fr: 'Prendre sa retraite', en: 'Retire' }, when: { job: true, age: [60, 120] }, limit: 1,
    out: [{ text: {
      fr: ['J\'ai pris ma retraite. Mon nouveau métier : arroser les plantes.', "Retraite ! Pot de départ, discours gênant et {w:gift} offert par les collègues.", "J'ai pris ma retraite. Programme : {w:hobby} le matin, sieste l'après-midi.", "Retraité{|e} ! J'ai aussitôt réservé [[un mois|trois mois|un an]] de voyage pour vivre {w:far_place}."],
      en: ['I retired. My new job: watering plants.', 'Retired! Farewell drinks, an awkward speech and {w:gift} from my coworkers.', 'I retired. Schedule: {w:hobby} in the morning, nap in the afternoon.', 'Retired! I immediately booked [[a month|three months|a year]] of travel to live {w:far_place}.'],
    }, fx: { retire: true, happy: 8 } }],
  },
];
