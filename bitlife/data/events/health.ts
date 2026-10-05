// Health events: doctors & hospitals, injuries, bodies falling apart, mental health, vices, near-death and absurd deaths.
import type { EventDef } from '@bl/sim';

export const healthEvents: EventDef[] = [
  // ───────────────────────────── doctors & hospital ─────────────────────────────
  {
    id: 'he_weird_doctor',
    icon: '🩺',
    cat: 'health',
    rating: 0,
    scene: { place: 'hospital', mood: 'shock', prop: 'stethoscope' },
    when: { age: [12, 90] },
    weight: 8,
    cooldown: 6,
    text: {
      fr: ["Ton nouveau médecin t'ausculte avec un stéthoscope… branché sur son téléphone. « Hmm. Vous êtes Balance ascendant Rhume. »", "Le docteur Mabille te reçoit en chaussons, renifle ta gorge et déclare que tu as « une aura de sinusite »."],
      en: ["Your new doctor listens to your chest with a stethoscope… plugged into his phone. 'Hmm. You're a Libra, rising Head Cold.'", "Dr. Mabille sees you in his slippers, sniffs your throat and announces you have 'a sinusitis aura'."],
    },
    choices: [
      {
        label: { fr: "Suivre l'ordonnance", en: 'Follow his orders' },
        out: [
          { w: 3, text: { fr: "Il m'a prescrit trois cristaux et une infusion d'ortie. Bizarrement, je me sens mieux. L'effet placebo, c'est quand même de la médecine.", en: "He prescribed three crystals and nettle tea. Weirdly, I feel better. The placebo effect still counts as medicine." }, fx: { health: 3, happy: 4 } },
          { w: 1, text: { fr: "J'ai suivi son traitement aux pépins de pamplemousse. J'ai récolté une grippe carabinée et une peau orange fluo.", en: "I followed his grapefruit-seed treatment. I got a nasty flu and neon-orange skin." }, fx: { disease: 'flu', health: -5, looks: -2 }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Deuxième avis', en: 'Get a second opinion' }, text: { fr: "Le deuxième médecin a lu l'ordonnance du premier, a soupiré très longtemps, puis m'a prescrit un vrai antibiotique.", en: "The second doctor read the first one's prescription, sighed for a very long time, then gave me an actual antibiotic." }, fx: { money: -50, health: 5 } },
      { label: { fr: "Fuir en chaussettes", en: 'Flee in my socks' }, text: { fr: "Je suis parti{|e} pendant qu'il cherchait son pendule. J'ai guéri tout{|e} seul{|e}, par pur orgueil.", en: "I left while he was looking for his pendulum. I healed on my own, out of pure spite." }, fx: { health: 2, happy: 2 } },
    ],
  },
  {
    id: 'he_surgery_knee',
    icon: '🦵',
    cat: 'health',
    rating: 2,
    scene: { place: 'hospital', mood: 'shock', prop: 'scalpel' },
    when: { age: [20, 85] },
    weight: 6,
    once: true,
    text: {
      fr: ["On doit t'opérer du genou gauche. Le chirurgien, qui sent vaguement le rosé, vient de dessiner une grosse croix au feutre sur ton genou droit.", "Veille d'opération du ménisque. L'interne te demande « c'est bien celle-là, la jambe en bois ? » en tapotant la mauvaise."],
      en: ["You're having surgery on your left knee. The surgeon, who smells faintly of rosé, just drew a big X in marker on your right knee.", "The night before your meniscus surgery. The intern asks 'this is the wooden leg, right?' while tapping the wrong one."],
    },
    choices: [
      { label: { fr: "Signaler l'erreur", en: 'Point out the mistake' }, text: { fr: "J'ai corrigé le chirurgien avec tact. Il a barré la croix, en a dessiné une sur le bon genou et a ajouté un smiley. Opération réussie.", en: "I tactfully corrected the surgeon. He crossed out the X, drew one on the right knee and added a smiley. Surgery went great." }, fx: { health: 8, happy: 4 } },
      {
        label: { fr: 'Faire confiance', en: 'Trust the professional' },
        out: [
          { w: 3, text: { fr: "Il a ouvert le mauvais genou, a dit « oups » assez fort pour que je l'entende sous anesthésie, puis a recousu au fil de pêche. Ça a giclé jusqu'au plafond : l'infirmière a dû repeindre. Il a quand même fait l'autre « par politesse ».", en: "He opened the wrong knee, said 'oops' loud enough for me to hear under anesthesia, then stitched it with fishing line. It sprayed all the way to the ceiling: the nurse had to repaint. He did the other one too, 'to be polite'." }, fx: { health: -14, happy: -8, flag: 'he_wrong_leg', schedule: { key: 'he_wrong_leg_lawsuit', years: 1 }, visual: 'gore' }, mood: 'shock' },
          { w: 2, text: { fr: "Contre toute attente, il a opéré la bonne jambe. Il en était le premier surpris. Il a pris une photo.", en: "Against all odds, he operated on the right leg. He was the most surprised of all. He took a photo." }, fx: { health: 6, happy: 3 } },
          { w: 1, text: { fr: "L'anesthésiste a dosé « à l'œil ». Il avait un œil de verre.", en: "The anesthesiologist eyeballed the dose. He had a glass eye." }, fx: { die: { fr: "sur le billard, pendant qu'on m'opérait du mauvais genou", en: 'on the operating table while they worked on the wrong knee' }, visual: 'gore' } },
        ],
      },
      { label: { fr: 'Fuir en blouse', en: 'Run off in my gown' }, text: { fr: "Je me suis enfui{|e} en blouse d'hôpital, les fesses à l'air, sur un genou et demi. Le gauche me fait toujours mal, mais j'ai gardé ma dignité. Enfin, la moitié.", en: "I escaped in a hospital gown, butt out, on one and a half knees. The left one still hurts, but I kept my dignity. Well, half of it." }, fx: { health: -3, happy: 3, stress: -2 } },
    ],
  },
  {
    id: 'he_wrong_leg_lawsuit',
    icon: '⚖️',
    cat: 'health',
    rating: 1,
    chainOnly: true,
    vars: { amount: [5000, 60000] },
    scene: { place: 'court', mood: 'proud', prop: 'briefcase' },
    when: { flag: 'he_wrong_leg' },
    text: {
      fr: ["Un avocat spécialisé en « boulettes médicales » t'appelle : il a vu ta démarche de flamant rose bourré et il sent l'argent à plein nez.", "Ton genou opéré par erreur cicatrise mal. Une avocate te tend sa carte : « Les hôpitaux détestent les procès. Moi, j'adore. »"],
      en: ["A lawyer who specializes in 'medical oopsies' calls you: he saw your drunk-flamingo walk and he smells money.", "Your wrongly-operated knee is healing badly. A lawyer hands you her card: 'Hospitals hate lawsuits. I love them.'"],
    },
    choices: [
      {
        label: { fr: "Attaquer l'hôpital", en: 'Sue the hospital' },
        out: [
          { w: 3, odds: { smarts: 1 }, text: { fr: "Le juge a regardé mes deux cicatrices, puis la photo du chirurgien en train de trinquer au vestiaire. J'ai touché {$amount}.", en: "The judge looked at my two scars, then at the photo of the surgeon toasting in the locker room. I got {$amount}." }, fx: { money: 'amount', happy: 10, unflag: 'he_wrong_leg' }, mood: 'proud' },
          { w: 1, text: { fr: "L'hôpital a produit une décharge signée de ma main. En fait, un dessin de licorne fait sous morphine. J'ai perdu, et payé l'avocat.", en: "The hospital produced a waiver with my signature. Actually a unicorn I drew on morphine. I lost, and paid the lawyer." }, fx: { money: -3000, happy: -8, unflag: 'he_wrong_leg' } },
        ],
      },
      { label: { fr: 'Accepter un arrangement', en: 'Take the settlement' }, text: { fr: "L'hôpital m'a offert un chèque, un an de parking gratuit et des excuses écrites en Comic Sans. J'ai pris.", en: "The hospital offered me a check, a year of free parking and an apology written in Comic Sans. I took it." }, fx: { money: 4000, happy: 4, unflag: 'he_wrong_leg' } },
      { label: { fr: 'Pardonner', en: 'Forgive and forget' }, text: { fr: "J'ai pardonné. Le chirurgien m'a envoyé une carte : « Merci de ne pas m'avoir cassé les jambes. » Il fait des jeux de mots, en plus.", en: "I forgave him. The surgeon sent me a card: 'Thanks for not kneecapping me.' He does puns, too." }, fx: { karma: 8, happy: 2, unflag: 'he_wrong_leg' } },
    ],
  },
  {
    id: 'he_hypochondria',
    icon: '🤒',
    cat: 'health',
    rating: 0,
    scene: { place: 'home', mood: 'shock', prop: 'laptop' },
    when: { age: [16, 90] },
    weight: 8,
    cooldown: 6,
    text: {
      fr: ["Tu as une petite toux. Après 40 minutes sur Doctissimo, tu as la peste, deux cancers rares et une maladie qui ne touche que les chèvres de Mongolie.", "Un bouton sur ton bras. Internet est formel : il te reste six semaines. Sept si tu arrêtes le gluten."],
      en: ["You have a tiny cough. After 40 minutes on WebMD, you have the plague, two rare cancers and a disease that only affects Mongolian goats.", "A spot on your arm. The internet is clear: you have six weeks left. Seven if you cut gluten."],
    },
    choices: [
      {
        label: { fr: 'Aller chez le médecin', en: 'See a doctor' },
        out: [
          { w: 3, text: { fr: "Le médecin m'a examiné{|e} sous toutes les coutures et m'a dit « vous n'avez rien ». Je l'ai trouvé très suspect.", en: "The doctor examined every inch of me and said 'you're fine'. I found him very suspicious." }, fx: { money: -30, stress: -5, flag: 'he_hypochondriac' } },
          { w: 1, text: { fr: "Le médecin a trouvé un vrai truc, rien à voir avec mes recherches : de l'hypertension. Internet avait tort, mais j'avais raison d'avoir peur.", en: "The doctor found something real, nothing to do with my research: high blood pressure. The internet was wrong, but I was right to panic." }, fx: { disease: 'hypertension', stress: 3 } },
        ],
      },
      { label: { fr: 'Continuer à googler', en: 'Keep googling' }, text: { fr: "À 3 h du matin, j'avais rédigé mon testament et légué mon aspirateur robot à ma voisine. C'était un rhume.", en: "By 3 a.m. I had written my will and left my robot vacuum to my neighbor. It was a cold." }, fx: { stress: 10, happy: -4, flag: 'he_hypochondriac' }, mood: 'shock' },
      { label: { fr: "Fermer l'ordi", en: 'Close the laptop' }, text: { fr: "J'ai fermé l'ordinateur, bu une tisane, et la toux est partie toute seule. Les deux cancers rares aussi.", en: "I closed the laptop, drank some herbal tea, and the cough went away on its own. So did the two rare cancers." }, fx: { stress: -6, happy: 3 } },
    ],
  },
  {
    id: 'he_er_waiting',
    icon: '🚑',
    cat: 'health',
    rating: 2,
    scene: { place: 'hospital', mood: 'shock', prop: 'chairs' },
    when: { age: [14, 90] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Urgences, 23 h. Tu as une entorse. Devant toi : un type avec un couteau à huîtres planté dans le crâne, qui joue tranquillement à Candy Crush.", "Salle d'attente des urgences. Six heures déjà. Ton voisin tient son propre doigt dans un sachet de petits pois surgelés et te demande l'heure."],
      en: ["ER, 11 p.m. You have a sprained ankle. Ahead of you: a guy with an oyster knife stuck in his skull, calmly playing Candy Crush.", "ER waiting room. Six hours in. The man next to you is holding his own finger in a bag of frozen peas and asks you for the time."],
    },
    choices: [
      {
        label: { fr: 'Attendre sagement', en: 'Wait patiently' },
        out: [
          { w: 2, text: { fr: "J'ai attendu neuf heures. Le type au couteau est passé avant moi, puis repassé, avec le couteau planté dans l'autre sens. Mon entorse a guéri dans la salle d'attente.", en: "I waited nine hours. The knife guy went in before me, then came back with the knife in the other way. My sprain healed in the waiting room." }, fx: { health: 2, happy: -6, stress: 6 } },
          { w: 1, text: { fr: "En neuf heures d'attente, le gamin d'à côté m'a toussé dessus comme un arroseur automatique. Je suis venu{|e} pour une cheville, je repars avec la grippe.", en: "In nine hours of waiting, the kid next to me coughed on me like a lawn sprinkler. Came in for an ankle, left with the flu." }, fx: { disease: 'flu', health: -4 }, mood: 'sick' },
        ],
      },
      {
        label: { fr: 'Simuler un infarctus', en: 'Fake a heart attack' },
        out: [
          { w: 2, text: { fr: "J'ai simulé un infarctus avec beaucoup de talent. On m'a fait passer devant tout le monde. L'électrocardiogramme a révélé que j'étais surtout un sale menteur.", en: "I faked a heart attack with real talent. They rushed me past everyone. The ECG revealed I was mostly a dirty liar." }, fx: { health: 3, karma: -6, happy: 3 } },
          { w: 1, text: { fr: "J'ai simulé un infarctus. Ils m'ont défibrillé{|e} pour de vrai. J'ai senti mes plombages fondre, mes poils griller, et j'ai fait pipi dans ma blouse. La prochaine fois, j'attends.", en: "I faked a heart attack. They defibrillated me for real. I felt my fillings melt, my body hair sizzle, and I peed in my gown. Next time, I wait." }, fx: { health: -8, happy: -6, karma: -3 }, mood: 'shock' },
        ],
      },
      { label: { fr: 'Aider le voisin', en: 'Help the knife guy' }, text: { fr: "J'ai voulu retirer le couteau du crâne de mon voisin. Ça a giclé comme une bouteille de ketchup trop secouée, sur trois rangées de chaises. Les infirmières m'ont hurlé dessus. Lui m'a dit merci.", en: "I tried to pull the knife out of my neighbor's skull. It sprayed like an over-shaken ketchup bottle across three rows of chairs. The nurses screamed at me. He said thanks." }, fx: { karma: 3, happy: -3, stress: 5, visual: 'gore' }, mood: 'shock' },
    ],
  },
  {
    id: 'he_checkup',
    icon: '🧤',
    cat: 'health',
    rating: 0,
    scene: { place: 'hospital', mood: 'neutral', prop: 'clipboard' },
    when: { age: [30, 90] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Bilan de santé annuel. Ton médecin enfile un gant en latex avec un claquement qui te glace le sang.", "Prise de sang, tension, balance. Ton médecin lit tes résultats en faisant « hmm » sur un ton qui ne te plaît pas du tout."],
      en: ["Annual checkup. Your doctor snaps on a latex glove with a sound that chills your blood.", "Blood test, blood pressure, scale. Your doctor reads your results going 'hmm' in a tone you don't like at all."],
    },
    choices: [
      {
        label: { fr: 'Tout faire sérieusement', en: 'Do the full checkup' },
        out: [
          { w: 3, odds: { health: 1 }, text: { fr: "Tout est parfait. Le médecin m'a félicité{|e} comme un chien qui rapporte la balle. J'ai remué la queue intérieurement.", en: "Everything's perfect. The doctor praised me like a dog that fetched the ball. I wagged my tail on the inside." }, fx: { health: 4, happy: 4, stress: -3 } },
          { w: 2, text: { fr: "Cholestérol, tension, triglycérides : mes chiffres ressemblent à mon code PIN. On m'a mis{|e} sous traitement.", en: "Cholesterol, blood pressure, triglycerides: my numbers look like my PIN code. I've been put on meds." }, fx: { disease: 'hypertension', stress: 4 } },
          { w: 1, text: { fr: "On m'a dépisté un diabète. Adieu, pain au chocolat de 10 h. On se reverra au paradis.", en: "They caught diabetes. Farewell, 10 a.m. croissant. We'll meet again in heaven." }, fx: { disease: 'diabetes', happy: -6 }, mood: 'sad' },
        ],
      },
      { label: { fr: 'Refuser le gant', en: 'Refuse the glove' }, text: { fr: "J'ai serré les dents et le reste. Le médecin a soupiré : « Ce sera pour l'an prochain, alors. » L'an prochain, je change de médecin.", en: "I clenched my teeth and everything else. The doctor sighed: 'Next year, then.' Next year, I'm changing doctors." }, fx: { happy: 2, health: -2 } },
      { label: { fr: 'Mentir au questionnaire', en: 'Lie on the form' }, text: { fr: "Alcool ? « Jamais. » Sport ? « Tous les jours. » Le médecin a regardé mon ventre, puis ma fiche, puis encore mon ventre.", en: "Alcohol? 'Never.' Exercise? 'Daily.' The doctor looked at my belly, then the form, then my belly again." }, fx: { karma: -2, happy: 1 } },
    ],
  },

  // ───────────────────────────── injuries ─────────────────────────────
  {
    id: 'he_fireworks',
    icon: '🎆',
    cat: 'accident',
    rating: 2,
    scene: { place: 'park', mood: 'party', prop: 'fireworks' },
    when: { age: [16, 80] },
    weight: 5,
    cooldown: 5,
    text: {
      fr: ["Soir de 14 Juillet. Ton beau-frère a ramené de Belgique une fusée « classée arme de guerre ». Il te tend le briquet avec un clin d'œil.", "Réveillon. Quelqu'un a commandé des mortiers d'artifice sur un site sans nom. L'étiquette dit juste « LOL », avec une tête de mort."],
      en: ["Fourth of July. Your brother-in-law drove back from out of state with a rocket 'classified as military-grade'. He hands you the lighter with a wink.", "New Year's Eve. Someone ordered firework mortars from a nameless website. The label just says 'LOL', with a skull."],
    },
    choices: [
      {
        label: { fr: 'Allumer à la main', en: 'Light it in my hand' },
        out: [
          { w: 3, text: { fr: "La fusée est partie dans la mauvaise direction : celle de mon index. Il a décollé le premier, en tournoyant, et il a atterri dans le saladier de chips. Ma tante a failli le manger.", en: "The rocket went the wrong way: toward my index finger. The finger took off first, spinning, and landed in the chip bowl. My aunt almost ate it." }, fx: { disease: 'missing_finger', health: -12, visual: 'gore' }, mood: 'shock' },
          { w: 2, text: { fr: "Ça m'a pété dans la main. Plus de sourcils, plus un poil sur les bras, et une odeur de cochon grillé qui me suit partout.", en: "It went off in my hand. No eyebrows, not a single arm hair left, and a roast-pig smell that follows me everywhere." }, fx: { disease: 'burns', health: -10, looks: -5, visual: 'explosion' } },
          { w: 2, text: { fr: "J'ai tenu la fusée comme un dieu grec. Elle est partie droit vers les étoiles. Tout le monde a applaudi. Je me suis senti{|e} invincible, ce qui est le début de tous les problèmes.", en: "I held the rocket like a Greek god. It shot straight for the stars. Everyone cheered. I felt invincible, which is how all problems start." }, fx: { happy: 8 }, mood: 'party' },
          { w: 1, text: { fr: "La fusée a fait demi-tour, m'a rattrapé{|e} et a terminé son vol à l'intérieur de moi. Le bouquet final était très réussi. Très rouge.", en: "The rocket made a U-turn, caught up with me and finished its flight inside me. The grand finale was gorgeous. Very red." }, fx: { die: { fr: "en bouquet final, éparpillé{|e} façon confettis au-dessus du barbecue", en: 'as the grand finale, scattered like confetti over the barbecue' }, visual: 'explosion' } },
        ],
      },
      { label: { fr: 'Regarder de loin', en: 'Watch from far away' }, text: { fr: "Je suis resté{|e} à cinquante mètres. Mon beau-frère, lui, se fait désormais appeler « Neuf Doigts ». Il en est très fier.", en: "I stayed fifty yards back. My brother-in-law now goes by 'Nine Fingers'. He's very proud of it." }, fx: { happy: 5 } },
      { label: { fr: 'Appeler les pompiers', en: 'Call the firefighters' }, text: { fr: "J'ai appelé les pompiers « au cas où ». Ils ont confisqué la fusée et l'ont tirée eux-mêmes. Meilleure fête de ma vie.", en: "I called the fire department 'just in case'. They confiscated the rocket and set it off themselves. Best party of my life." }, fx: { happy: 6, karma: 2 } },
    ],
  },
  {
    id: 'he_bbq_fire',
    icon: '🔥',
    cat: 'accident',
    rating: 2,
    scene: { place: 'home', mood: 'shock', prop: 'barbecue' },
    when: { age: [18, 85] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: ["Le barbecue refuse de démarrer. Les invités ont faim. Dans le garage, un bidon d'essence te regarde avec insistance.", "Ton barbecue fume mais ne chauffe pas. Ton voisin Gérard te glisse : « Un petit coup d'alcool à brûler, ça part tout seul. »"],
      en: ["The barbecue won't light. The guests are starving. In the garage, a gas can is staring at you.", "Your grill smokes but won't heat up. Your neighbor Gerald whispers: 'Splash of lighter fluid and off she goes.'"],
    },
    choices: [
      {
        label: { fr: "Arroser d'essence", en: 'Douse it with gas' },
        out: [
          { w: 3, text: { fr: "Il y a eu un « VOUF » très satisfaisant. Mes sourcils sont partis en fumée, ma frange aussi, et la peau de ma main pend en lambeaux comme du gruyère fondu. Les saucisses, elles, sont restées crues.", en: "There was a very satisfying 'WHOOMPH'. My eyebrows went up in smoke, my bangs too, and the skin on my hand is hanging off like melted cheese. The sausages stayed raw." }, fx: { disease: 'burns', health: -12, looks: -6, visual: 'fire' }, mood: 'shock' },
          { w: 2, text: { fr: "Une boule de feu a illuminé le quartier. Le barbecue a décollé, franchi la haie et atterri chez Gérard. On a mangé des pizzas surgelées.", en: "A fireball lit up the neighborhood. The grill took off, cleared the hedge and landed at Gerald's. We ate frozen pizza." }, fx: { money: -300, happy: -4, visual: 'explosion' } },
          { w: 1, text: { fr: "Ça a marché du premier coup. Je n'en tire aucune leçon et je recommencerai l'année prochaine.", en: "Worked first try. I learned nothing and I'll do it again next year." }, fx: { happy: 6 } },
        ],
      },
      { label: { fr: 'Patienter', en: 'Be patient' }, text: { fr: "J'ai soufflé sur les braises pendant 45 minutes. Les invités ont mangé à 23 h, je n'avais plus de poumons, mais j'avais encore mes sourcils.", en: "I blew on the coals for 45 minutes. Guests ate at 11 p.m., I had no lungs left, but I still had my eyebrows." }, fx: { happy: 3, health: -2 } },
      { label: { fr: 'Commander des sushis', en: 'Order sushi' }, text: { fr: "J'ai commandé des sushis et annoncé un « barbecue japonais froid ». Personne n'a osé me contredire.", en: "I ordered sushi and announced a 'cold Japanese barbecue'. Nobody dared contradict me." }, fx: { money: -120, happy: 4 } },
    ],
  },
  {
    id: 'he_scooter',
    icon: '🛴',
    cat: 'accident',
    rating: 0,
    scene: { place: 'park', mood: 'happy', prop: 'scooter' },
    when: { age: [14, 70] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Tu loues une trottinette électrique. Elle roule à 25 km/h, freine à 3 km/h et a déjà le guidon tordu.", "Un pote te prête sa trottinette électrique « débridée ». Il ne sait pas trop ce que ça veut dire, mais il le dit fièrement."],
      en: ["You rent an electric scooter. It goes 15 mph, brakes at 2 mph and the handlebar is already bent.", "A buddy lends you his 'unlocked' electric scooter. He isn't sure what that means, but he says it proudly."],
    },
    choices: [
      { label: { fr: 'Mettre un casque', en: 'Wear a helmet' }, text: { fr: "J'avais l'air d'un champignon ridicule. Je me suis vautré{|e} dans un massif de géraniums, mais mon crâne n'a rien senti. Les géraniums, si.", en: "I looked like a ridiculous mushroom. I crashed into a flowerbed, but my skull felt nothing. The geraniums did." }, fx: { happy: 2, health: -1 } },
      {
        label: { fr: 'Pleine balle, sans casque', en: 'Full speed, no helmet' },
        out: [
          { w: 2, text: { fr: "J'ai rencontré un poteau. Depuis, je vois des petites étoiles et j'appelle mon chat « Maman ». Commotion cérébrale.", en: "I met a pole. Since then I see little stars and I call my cat 'Mom'. Concussion." }, fx: { disease: 'concussion', health: -10, smarts: -3 }, mood: 'shock' },
          { w: 2, text: { fr: "J'ai traversé la ville comme le vent. J'étais libre. J'avais quatre moucherons dans les dents.", en: "I crossed town like the wind. I was free. I had four gnats in my teeth." }, fx: { happy: 7 } },
          { w: 1, text: { fr: "Un trottoir m'a éjecté{|e} dans un vol plané digne des JO. Bras cassé, mais la réception était magnifique.", en: "A curb launched me into an Olympic-grade flight. Broken arm, but the landing was gorgeous." }, fx: { disease: 'broken_arm', health: -8 } },
        ],
      },
      { label: { fr: 'Marcher', en: 'Just walk' }, text: { fr: "J'ai marché. C'était plus lent, mais j'ai trouvé une pièce par terre. La marche, ça paie.", en: "I walked. Slower, but I found a coin on the ground. Walking pays." }, fx: { money: 2, happy: 2, health: 1 } },
    ],
  },
  {
    id: 'he_gas_sushi',
    icon: '🍣',
    cat: 'health',
    rating: 2,
    scene: { place: 'apartment', mood: 'sick', prop: 'toilet', fx: 'poop' },
    when: { age: [18, 85] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Il est 2 h, tu as faim, et la station-service vend des sushis. La date de péremption a été grattée au cutter.", "Un kebab ouvert en 1994 et jamais nettoyé depuis te fait de l'œil. La broche tourne toute seule, même pendant les coupures de courant."],
      en: ["It's 2 a.m., you're starving, and the gas station sells sushi. The expiry date has been scraped off with a box cutter.", "A kebab shop that opened in 1994 and hasn't been cleaned since is winking at you. The spit keeps turning even during power cuts."],
    },
    choices: [
      {
        label: { fr: 'Manger avec confiance', en: 'Eat with confidence' },
        out: [
          { w: 3, text: { fr: "Six heures plus tard, j'ai découvert que mon corps pouvait expulser des choses par les deux bouts en même temps, à haute pression. La salle de bain a été déclarée zone sinistrée.", en: "Six hours later, I discovered my body can expel things from both ends at once, at high pressure. The bathroom has been declared a disaster zone." }, fx: { disease: 'food_poisoning', health: -10, visual: 'poop' }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai vomi si fort que j'ai revu des repas de 2017. Un bout de carotte est resté collé au plafond. Il y est encore. Je l'ai appelé Gérard.", en: "I puked so hard I saw meals from 2017. A piece of carrot got stuck to the ceiling. It's still there. I named it Gary." }, fx: { disease: 'food_poisoning', health: -8, visual: 'gore' }, mood: 'sick' },
          { w: 2, text: { fr: "Rien. Pas une crampe. Mon estomac est une centrale nucléaire. Je me sens immortel{|le}.", en: "Nothing. Not one cramp. My stomach is a nuclear reactor. I feel immortal." }, fx: { happy: 5, health: -1 } },
        ],
      },
      { label: { fr: 'Juste le riz', en: 'Just eat the rice' }, text: { fr: "Par prudence, je n'ai mangé que le riz. Le riz était la partie empoisonnée. J'ai passé la nuit assis{|e} sur les toilettes avec une bassine sur les genoux.", en: "To be safe, I only ate the rice. The rice was the poisoned part. I spent the night on the toilet with a bucket on my lap." }, fx: { disease: 'food_poisoning', health: -6, visual: 'poop' }, mood: 'sick' },
      { label: { fr: 'Jeter et dormir', en: 'Bin it and sleep' }, text: { fr: "J'ai jeté le sushi. Le chat du voisin l'a récupéré dans la poubelle. Je n'ai jamais revu le chat.", en: "I threw the sushi out. The neighbor's cat fished it out of the trash. I never saw the cat again." }, fx: { happy: 1, karma: -1 } },
    ],
  },
  {
    id: 'he_hemorrhoids',
    icon: '🍑',
    cat: 'health',
    rating: 2,
    scene: { place: 'hospital', mood: 'sick', prop: 'cushion' },
    when: { age: [25, 90] },
    weight: 6,
    cooldown: 8,
    text: {
      fr: ["Depuis une semaine, t'asseoir est devenu un sport extrême. Tu as l'impression d'avoir une grappe de raisin là où le soleil ne brille jamais.", "Ça gratte, ça brûle, ça pulse. Ton derrière a son propre battement de cœur. Tu as tapé « fesses qui battent » en navigation privée."],
      en: ["For a week now, sitting down has become an extreme sport. It feels like a bunch of grapes moved in where the sun don't shine.", "It itches, it burns, it throbs. Your butt has its own heartbeat. You googled 'butt heartbeat' in incognito mode."],
    },
    choices: [
      { label: { fr: 'Voir un proctologue', en: 'See a proctologist' }, text: { fr: "Le proctologue a regardé, sifflé d'admiration, puis appelé un collègue « pour voir un truc ». Ils ont pris des photos pour un congrès. J'ai eu une pommade et une honte éternelle.", en: "The proctologist looked, whistled in admiration, then called a colleague over 'to see something'. They took photos for a conference. I got an ointment and eternal shame." }, fx: { money: -80, health: 4, happy: -3 } },
      {
        label: { fr: 'Pommade de mamie', en: "Grandma's ointment" },
        out: [
          { w: 2, text: { fr: "Recette de mamie : camphre, piment et prière. Ça a brûlé comme si je m'étais assis{|e} sur le barbecue. Rien n'a changé, sauf ma foi en Dieu.", en: "Grandma's recipe: camphor, chili and prayer. It burned like I'd sat on the grill. Nothing changed except my faith in God." }, fx: { disease: 'hemorrhoids', happy: -4 } },
          { w: 1, text: { fr: "La recette de mamie a marché. Je ne veux pas savoir ce qu'il y avait dedans. Ça sentait le jambon.", en: "Grandma's recipe worked. I don't want to know what was in it. It smelled like ham." }, fx: { health: 3, happy: 2 } },
        ],
      },
      { label: { fr: 'Coussin bouée', en: 'Buy a donut cushion' }, text: { fr: "J'ai acheté un coussin bouée et je l'emporte partout, même au restaurant. Les serveurs ne posent plus de questions.", en: "I bought a donut cushion and I take it everywhere, even to restaurants. The waiters no longer ask." }, fx: { disease: 'hemorrhoids', money: -25, happy: -2 } },
    ],
  },
  {
    id: 'he_gout',
    icon: '🦶',
    cat: 'health',
    rating: 2,
    scene: { place: 'hospital', mood: 'sick', prop: 'foot' },
    when: { age: [40, 90] },
    weight: 6,
    cooldown: 8,
    text: {
      fr: ["Tu t'es réveillé{|e} avec le gros orteil gonflé comme une aubergine et violet comme un évêque. Le simple contact du drap te fait hurler.", "Après trois repas de fête enchaînés (foie gras, gibier, magnum de rouge), ton gros orteil a doublé de volume. Il pulse. Il te juge."],
      en: ["You woke up with your big toe swollen like an eggplant and purple as a bishop. The touch of a bedsheet makes you scream.", "After three back-to-back feasts (foie gras, venison, a magnum of red), your big toe has doubled in size. It throbs. It judges you."],
    },
    choices: [
      { label: { fr: 'Voir le médecin', en: 'See the doctor' }, text: { fr: "« C'est la goutte, la maladie des rois. » J'ai demandé si j'avais droit aux autres avantages des rois. Non. Juste au régime sans charcuterie.", en: "'It's gout, the disease of kings.' I asked if I got the other perks of kings. No. Just the no-cold-cuts diet." }, fx: { disease: 'gout', happy: -5 } },
      { label: { fr: "Percer l'orteil", en: 'Pop the toe myself' }, text: { fr: "J'ai percé mon orteil avec une aiguille à tricoter désinfectée au pastis. Ça a giclé jaune, puis rouge, puis j'ai vu ma vie défiler. Le médecin a parlé de « pire idée de l'année ».", en: "I lanced my toe with a knitting needle sterilized in pastis. It squirted yellow, then red, then my life flashed before my eyes. The doctor called it 'the worst idea of the year'." }, fx: { disease: 'gout', health: -10, visual: 'gore' }, mood: 'shock' },
      { label: { fr: 'Noyer ça dans le vin', en: 'Drown it in wine' }, text: { fr: "J'ai soigné la goutte par le vin rouge. L'orteil a pris la taille d'un pamplemousse. J'ai dû découper une pantoufle.", en: "I treated the gout with red wine. The toe grew to the size of a grapefruit. I had to cut open a slipper." }, fx: { disease: 'gout', health: -6, addiction: ['alcohol', 10] } },
    ],
  },

  // ───────────────────────────── body, diet, gym ─────────────────────────────
  {
    id: 'he_diet',
    icon: '⚖️',
    cat: 'body',
    rating: 0,
    scene: { place: 'home', mood: 'sad', prop: 'scale' },
    when: { age: [16, 85] },
    weight: 9,
    cooldown: 4,
    text: {
      fr: ["Ta balance affiche un chiffre puis, après réflexion, affiche « ERR ». Même elle n'y croit pas.", "Ton jean préféré a rendu l'âme en plein ascenseur, bouton du milieu en premier, dans un bruit de coup de fusil.", "Ton médecin te tend une brochure « Bouger plus, manger mieux », avec {w:celeb} en jogging sur la couverture. Il a entouré « manger mieux » trois fois.", "En te penchant pour ramasser {w:object}, tu entends ton pantalon craquer [[à l'arrière|sur toute la longueur|avec de l'écho]]. Il est peut-être temps d'agir.", "Tu as mangé {w:food} au petit-déjeuner, {w:food} à midi, et tu hésites pour le dîner. Ta balance t'a laissé un message vocal. Elle pleure."],
      en: ["Your scale shows a number, then, after some thought, shows 'ERR'. Even it can't believe it.", "Your favorite jeans gave up mid-elevator, middle button first, with the sound of a gunshot.", "Your doctor hands you a 'Move More, Eat Better' brochure with {w:celeb} in sweatpants on the cover. He circled 'eat better' three times.", "Bending down to pick up {w:object}, you hear your pants rip [[at the back|all the way down|with an echo]]. Maybe it's time to act.", "You had {w:food} for breakfast, {w:food} for lunch, and you're torn about dinner. Your scale left you a voicemail. It's crying."],
    },
    choices: [
      {
        label: { fr: 'Régime strict', en: 'Strict diet' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: ["Trois mois de brocolis vapeur. J'ai perdu huit kilos et toute joie de vivre. Mais quel fessier.", "Régime militaire, zéro écart. Moins six kilos. J'ai fêté ça en regardant {w:food} à travers une vitrine. Juste regarder."], en: ["Three months of steamed broccoli. I lost eighteen pounds and all joy in life. But what a butt.", "Military diet, zero cheating. Thirteen pounds down. I celebrated by staring at {w:food} through a shop window. Just staring."] }, fx: { weight: -0.06, looks: 5, health: 4, happy: -3 } },
          { w: 1, text: { fr: ["J'ai tenu jusqu'au jeudi, 16 h 12. Puis j'ai mangé un poulet rôti entier, debout devant le frigo. Avec les mains.", "J'ai craqué au troisième jour devant {w:food}, à 2 h du matin, à la lumière du frigo. Personne n'a rien vu. Sauf le chat."], en: ["I lasted until Thursday, 4:12 p.m. Then I ate a whole rotisserie chicken standing at the fridge. With my hands.", "I cracked on day three in front of {w:food}, at 2 a.m., by the light of the fridge. Nobody saw. Except the cat."] }, fx: { weight: 0.02, happy: 2 } },
        ],
      },
      { label: { fr: 'Cure de jus détox', en: 'Juice cleanse' }, text: { fr: ["Cinq jours de jus de céleri. J'ai perdu deux kilos, principalement aux toilettes, et j'ai commencé à entendre les couleurs.", "La cure détox m'a rendu{|e} si irritable que j'ai engueulé {w:object}. J'ai perdu un kilo et deux amis."], en: ["Five days of celery juice. I lost four pounds, mostly in the bathroom, and started hearing colors.", "The juice cleanse made me so cranky I yelled at {w:object}. I lost two pounds and two friends."] }, fx: { weight: -0.02, health: -2, happy: -4 } },
      {
        label: { fr: 'Manger mes émotions', en: 'Eat my feelings' },
        out: [
          { w: 2, text: { fr: ["J'ai consolé mon jean avec un tiramisu familial. Puis un deuxième, pour qu'il ne se sente pas seul. Le médecin a prononcé le mot « obésité » très, très doucement.", "J'ai noyé mes émotions dans {w:food}, puis dans {w:food}, puis dans le frigo entier. Le médecin a prononcé le mot « obésité » en évitant mon regard."], en: ["I consoled my jeans with a family-size tiramisu. Then a second, so the first wouldn't feel lonely. The doctor said the word 'obesity' very, very gently.", "I drowned my feelings in {w:food}, then {w:food}, then the entire fridge. The doctor said the word 'obesity' without meeting my eyes."] }, fx: { disease: 'obesity', weight: 0.06, health: -5 } },
          { w: 1, text: { fr: ["J'ai décidé que mon corps était parfait. J'ai acheté un nouveau jean, une taille au-dessus, et je l'adore.", "J'ai jeté la balance par la fenêtre. Elle a atterri sur {w:vehicle}. J'ai décidé d'aimer mon corps et de nier toute implication."], en: ["I decided my body is perfect. I bought new jeans, one size up, and I love them.", "I threw the scale out the window. It landed on {w:vehicle}. I decided to love my body and deny any involvement."] }, fx: { weight: 0.02, happy: 6, stress: -3 } },
        ],
      },
    ],
  },
  {
    id: 'he_gym_bro',
    icon: '💪',
    cat: 'body',
    rating: 1,
    scene: { place: 'stadium', mood: 'proud', prop: 'dumbbell' },
    when: { age: [16, 60] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["À la salle, un certain Kévin, 120 kilos de muscle et de gel coiffant, t'appelle « bro » et propose de te « construire ». Il boit sa protéine dans un shaker en forme de biceps.", "Un gym bro torse nu t'interpelle : « Frérot, t'as zappé le leg day toute ta vie, ça se voit d'ici. » Il te tend une poudre rose « goût licorne »."],
      en: ["At the gym, a guy named Kyle, 260 pounds of muscle and hair gel, calls you 'bro' and offers to 'build you'. He drinks his protein from a bicep-shaped shaker.", "A shirtless gym bro stops you: 'Bro, you've skipped leg day your whole life, I can tell from here.' He hands you a pink powder, 'unicorn flavor'."],
    },
    choices: [
      {
        label: { fr: 'Suivre son programme', en: 'Follow his program' },
        out: [
          { w: 3, odds: { athletic: 1 }, text: { fr: "Six mois de Kévin. J'ai pris des épaules, perdu des neurones et appris à dire « gainz » sans ironie.", en: "Six months of Kyle. I gained shoulders, lost brain cells and learned to say 'gainz' without irony." }, fx: { athletic: 10, looks: 6, smarts: -2 }, mood: 'proud' },
          { w: 1, text: { fr: "Kévin m'a fait soulever trop lourd, trop tôt. Mon dos a fait un bruit de paquet de chips. Lumbago.", en: "Kyle had me lift too heavy, too soon. My back made a bag-of-chips sound. Lumbago." }, fx: { disease: 'back_pain', health: -6 } },
        ],
      },
      {
        label: { fr: 'Goûter ses « vitamines »', en: "Try his 'vitamins'" },
        out: [
          { w: 1, text: { fr: "Ses « vitamines » venaient d'un vétérinaire bulgare. J'ai pris dix kilos de muscle, de l'acné plein le dos et un caractère de pitbull. J'ai engueulé une plante.", en: "His 'vitamins' came from a Bulgarian vet. I put on twenty pounds of muscle, back acne and a pit bull temper. I yelled at a houseplant." }, fx: { athletic: 12, looks: -4, disease: 'acne', stress: 8, karma: -2 } },
          { w: 1, text: { fr: "Les « vitamines » m'ont donné des sueurs froides et un cœur qui bat en morse. Le cardiologue n'a pas ri.", en: "The 'vitamins' gave me cold sweats and a heart beating in Morse code. The cardiologist did not laugh." }, fx: { disease: 'hypertension', health: -8 }, mood: 'sick' },
        ],
      },
      { label: { fr: "Résilier l'abonnement", en: 'Cancel my membership' }, text: { fr: "J'ai fui la salle et résilié l'abonnement. Il a fallu une lettre recommandée, deux appels et un sacrifice rituel. Libre.", en: "I fled the gym and canceled my membership. It took a certified letter, two calls and a ritual sacrifice. Free at last." }, fx: { money: -50, happy: 3, athletic: -2 } },
    ],
  },
  {
    id: 'he_squat',
    icon: '🏋️',
    cat: 'body',
    rating: 2,
    scene: { place: 'stadium', mood: 'proud', prop: 'barbell' },
    when: { age: [16, 70] },
    weight: 5,
    cooldown: 6,
    text: {
      fr: ["Toute la salle te regarde : tu tentes ton record au squat. 140 kilos. Ton short est en lycra très fin et tu as mangé un chili hier soir.", "Tu charges la barre au-delà du raisonnable pour impressionner la jolie personne du rameur. Ton cerveau dit non. Ton ego dit « LÉGENDAIRE »."],
      en: ["The whole gym is watching: you're going for your squat record. 310 pounds. Your shorts are very thin lycra and you had chili last night.", "You load the bar way past reasonable to impress the cute person on the rowing machine. Your brain says no. Your ego says 'LEGENDARY'."],
    },
    choices: [
      {
        label: { fr: 'Envoyer la sauce', en: 'Send it' },
        out: [
          { w: 3, text: { fr: "Je suis descendu{|e}. Je suis remonté{|e}. Le chili, lui, a choisi la sortie de secours, à travers le lycra, sous les yeux de tout le monde. Il y a une trace sur le banc. Il y aura toujours une trace sur le banc.", en: "I went down. I came back up. The chili took the emergency exit, straight through the lycra, in front of everyone. There's a stain on the bench. There will always be a stain on the bench." }, fx: { happy: -10, fame: 2, visual: 'poop' }, mood: 'shock' },
          { w: 2, odds: { athletic: 1 }, text: { fr: "Record battu ! La salle a explosé. Quelqu'un a filmé : je suis devenu{|e} « La Bête » sur l'Instagram de la salle.", en: "Record smashed! The gym erupted. Someone filmed it: I'm now 'The Beast' on the gym's Instagram." }, fx: { athletic: 6, happy: 10, fame: 2, followers: 300 }, mood: 'proud' },
          { w: 2, text: { fr: "Mes genoux ont fait « crac » en stéréo. Je suis resté{|e} coincé{|e} sous la barre comme un cafard retourné, à pleurer doucement, jusqu'à ce que Kévin vienne me délivrer.", en: "My knees went 'crack' in stereo. I stayed pinned under the bar like a flipped cockroach, weeping softly, until Kyle came to rescue me." }, fx: { disease: 'sprain', health: -8, happy: -6 } },
          { w: 1, text: { fr: "La barre m'a plié{|e} en deux comme un transat. Il y a eu un bruit de chips géante, puis plus rien.", en: "The bar folded me in half like a deck chair. There was a giant-potato-chip crunch, then nothing." }, fx: { die: { fr: "plié{|e} en deux sous une barre de 140 kilos, devant tout le monde et en lycra", en: 'folded in half under a 310-pound barbell, in front of everyone, in lycra' }, visual: 'gore' } },
        ],
      },
      { label: { fr: 'Retirer des disques', en: 'Take some plates off' }, text: { fr: "J'ai retiré deux disques en douce. J'ai fait mes dix répétitions ; la personne du rameur est partie entre-temps. Au moins, j'ai encore mes genoux.", en: "I quietly took two plates off. Did my ten reps; the rowing-machine person left in the meantime. At least I still have knees." }, fx: { athletic: 3 } },
      { label: { fr: "Faire semblant de s'étirer", en: 'Pretend to stretch' }, text: { fr: "J'ai passé 40 minutes à m'étirer en fixant la barre d'un air pensif. Personne n'a été dupe, mais j'avais l'air très souple.", en: "I spent 40 minutes stretching while staring thoughtfully at the bar. Nobody bought it, but I looked very flexible." }, fx: { happy: 1 } },
    ],
  },

  // ───────────────────────────── plastic surgery ─────────────────────────────
  {
    id: 'he_cheap_surgery',
    icon: '💉',
    cat: 'body',
    rating: 1,
    vars: { amount: [800, 2000] },
    scene: { place: 'hospital', mood: 'shock', prop: 'flyer' },
    when: { age: [20, 70] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["Un flyer dans ta boîte aux lettres : « Dr Lifting. Rhinoplastie, liposuccion, nouvelle tête. Tout à {$amount}. Paiement en liquide, pas de questions, pas de diplôme. »", "Une clinique « Esthétique & Kebab » vient d'ouvrir en bas de chez toi. Promo de lancement : un nouveau nez pour {$amount}, frites offertes."],
      en: ["A flyer in your mailbox: 'Dr. Facelift. Nose jobs, lipo, whole new face. All for {$amount}. Cash only, no questions, no diploma.'", "A 'Cosmetic Surgery & Kebab' clinic just opened downstairs. Launch promo: a new nose for {$amount}, free fries."],
    },
    choices: [
      {
        label: { fr: 'Un nouveau nez', en: 'Get a new nose' },
        out: [
          { w: 2, text: { fr: "Contre toute attente, mon nouveau nez est magnifique. Un peu de travers, mais magnifique. J'ai un profil de statue grecque. Une statue grecque un peu bourrée.", en: "Against all odds, my new nose is gorgeous. Slightly crooked, but gorgeous. I have the profile of a Greek statue. A slightly drunk Greek statue." }, fx: { money: '-amount', looks: 12, happy: 8, flag: 'he_cheap_surgery', schedule: { key: 'he_surgery_aftermath', years: 2 } }, mood: 'proud' },
          { w: 2, text: { fr: "Le chirurgien a éternué pendant l'opération. Mon nez pointe désormais vers la gauche, comme s'il cherchait la sortie.", en: "The surgeon sneezed mid-operation. My nose now points left, like it's looking for the exit." }, fx: { money: '-amount', looks: -10, happy: -8, flag: 'he_cheap_surgery', schedule: { key: 'he_surgery_aftermath', years: 2 } }, mood: 'shock' },
        ],
      },
      {
        label: { fr: 'Une liposuccion', en: 'Lipo' },
        out: [
          { w: 2, text: { fr: "Ils ont aspiré quatre litres de graisse avec un aspirateur de voiture. Le tuyau s'est inversé une seconde. J'ai perdu du ventre et gagné des fesses.", en: "They sucked out a gallon of fat with a car vacuum. The hose reversed for a second. I lost belly and gained butt." }, fx: { money: '-amount', weight: -0.05, looks: 5, happy: 2 } },
          { w: 1, text: { fr: "La lipo a marché, mais ils ont oublié une compresse à l'intérieur. Je fais « couic » quand je m'assois.", en: "The lipo worked, but they left a sponge inside. I squeak when I sit down." }, fx: { money: '-amount', weight: -0.04, health: -6 } },
        ],
      },
      { label: { fr: 'Jeter le flyer', en: 'Bin the flyer' }, text: { fr: "J'ai jeté le flyer. Une semaine plus tard, la police a fermé la clinique. On a retrouvé des nez dans le congélateur à kebab.", en: "I threw the flyer away. A week later the police shut the clinic down. They found noses in the kebab freezer." }, fx: { karma: 2, happy: 2 } },
    ],
  },
  {
    id: 'he_surgery_aftermath',
    icon: '👃',
    cat: 'body',
    rating: 2,
    chainOnly: true,
    scene: { place: 'hospital', mood: 'shock', prop: 'mirror' },
    when: { flag: 'he_cheap_surgery' },
    text: {
      fr: ["Deux ans après ton passage chez Dr Lifting, en plein dîner, tu sens quelque chose glisser sur ton visage. Ce n'est pas une larme.", "Ton visage signé Dr Lifting commence à fondre légèrement au soleil, comme une bougie d'anniversaire."],
      en: ["Two years after your visit to Dr. Facelift, mid-dinner, you feel something sliding down your face. It isn't a tear.", "Your Dr. Facelift face has started melting slightly in the sun, like a birthday candle."],
    },
    choices: [
      { label: { fr: 'Foncer aux urgences', en: 'Rush to the ER' }, text: { fr: "Mon cartilage pendouillait au-dessus de ma soupe comme un steak haché. L'interne l'a recollé à la Super Glue et au scotch de déménagement. Il tient. Il siffle quand je respire, mais il tient.", en: "My cartilage was dangling over my soup like ground beef. The intern glued it back with Super Glue and packing tape. It holds. It whistles when I breathe, but it holds." }, fx: { looks: -6, health: -4, happy: -5, unflag: 'he_cheap_surgery', visual: 'gore' } },
      {
        label: { fr: 'Retrouver Dr Lifting', en: 'Track down Dr. Facelift' },
        out: [
          { w: 1, text: { fr: "J'ai retrouvé Dr Lifting : il fait des kebabs à plein temps, maintenant. Il m'a remboursé en sandwichs. Trois cents sandwichs.", en: "I found Dr. Facelift: he does kebabs full-time now. He refunded me in sandwiches. Three hundred sandwiches." }, fx: { happy: 4, weight: 0.03, unflag: 'he_cheap_surgery' } },
          { w: 1, text: { fr: "Dr Lifting a fui au Paraguay avec la caisse et, apparemment, plusieurs nez de clients. Toujours aucune nouvelle. Ni de ma narine gauche.", en: "Dr. Facelift fled to Paraguay with the cash and, apparently, several patients' noses. Still no news. Or of my left nostril." }, fx: { looks: -8, happy: -6, unflag: 'he_cheap_surgery' } },
        ],
      },
      { label: { fr: 'Assumer le look', en: 'Own the look' }, text: { fr: "Mon visage a glissé de deux centimètres pendant que je mangeais. Du sang a coulé dans mes lasagnes. J'ai fini mes lasagnes. Les enfants du quartier m'appellent « le Fantôme de l'Opéra ».", en: "My face slid down an inch while I was eating. Blood dripped into my lasagna. I finished my lasagna. The neighborhood kids call me 'the Phantom of the Opera'." }, fx: { looks: -12, happy: 2, unflag: 'he_cheap_surgery', visual: 'gore' } },
    ],
  },

  // ───────────────────────────── aging ─────────────────────────────
  {
    id: 'he_bald',
    icon: '👨‍🦲',
    cat: 'body',
    rating: 0,
    scene: { place: 'home', mood: 'sad', prop: 'mirror' },
    when: { age: [25, 60], gender: 'm' },
    weight: 7,
    once: true,
    text: {
      fr: ["Ta brosse ramasse plus de cheveux que ta tête n'en garde. Vu d'en haut, ton crâne ressemble à un œuf dans un nid.", "Ton coiffeur te propose une coupe « dégradé naturel ». Il veut dire que la nature s'en charge pour toi."],
      en: ["Your brush holds more hair than your head does. From above, your scalp looks like an egg in a nest.", "Your barber suggests a 'natural fade'. He means nature is handling it for you."],
    },
    choices: [
      {
        label: { fr: 'Greffe en Turquie', en: 'Transplant in Turkey' },
        out: [
          { w: 2, text: { fr: "Trois jours à Istanbul, 4 000 greffons, un crâne rouge comme une pizza pendant un mois. Aujourd'hui, j'ai la coupe d'un footballeur.", en: "Three days in Istanbul, 4,000 grafts, a scalp red as a pizza for a month. Today I have a soccer player's hair." }, fx: { money: -2500, looks: 10, happy: 6 }, mood: 'proud' },
          { w: 1, text: { fr: "La greffe a pris… par plaques. J'ai la tête d'un terrain de golf mal entretenu.", en: "The transplant took… in patches. My head looks like a badly kept golf course." }, fx: { money: -2500, looks: -4, happy: -4 } },
        ],
      },
      { label: { fr: 'Tout raser', en: 'Shave it all off' }, text: { fr: "J'ai tout rasé. Je ressemble à un méchant de James Bond, ou à un genou très sûr de lui. J'adore.", en: "I shaved it all. I look like a Bond villain, or a very confident knee. I love it." }, fx: { looks: 4, happy: 6 } },
      { label: { fr: 'La mèche rabattue', en: 'The comb-over' }, text: { fr: "J'ai opté pour la mèche rabattue. Au premier coup de vent, elle s'est soulevée comme un couvercle de poubelle. J'ai fait comme si de rien n'était.", en: "I went with the comb-over. First gust of wind, it flipped up like a trash can lid. I acted like nothing happened." }, fx: { looks: -4, happy: -2 } },
      { label: { fr: 'Lotion miracle', en: 'Miracle lotion' }, text: { fr: "J'ai acheté une lotion « repousse garantie » à 80 balles. Il m'a poussé des poils. Sur le front et dans les oreilles.", en: "I bought an 80-buck 'guaranteed regrowth' lotion. Hair did grow. On my forehead and in my ears." }, fx: { money: -80, looks: -3 } },
    ],
  },
  {
    id: 'he_wrinkles',
    icon: '🪞',
    cat: 'body',
    rating: 0,
    scene: { place: 'home', mood: 'sad', prop: 'mirror' },
    when: { age: [38, 70] },
    weight: 7,
    once: true,
    text: {
      fr: ["Ce matin, le miroir t'a montré une ride. Puis une copine à elle. Puis toute leur famille, venue passer les vacances sur ton front.", "Une ado t'a appelé{|e} « {monsieur|madame} » avec beaucoup de respect. Le genre de respect qu'on a pour les monuments historiques."],
      en: ["This morning the mirror showed you a wrinkle. Then one of its friends. Then their whole family, vacationing on your forehead.", "A teenager called you '{sir|ma'am}' with great respect. The kind of respect you show a historical monument."],
    },
    choices: [
      { label: { fr: 'Crème hors de prix', en: 'Ridiculously pricey cream' }, text: { fr: "J'ai acheté une crème à la bave d'escargot et à l'or 24 carats. Mes rides sont toujours là, mais elles brillent.", en: "I bought a snail-slime and 24-karat-gold cream. My wrinkles are still there, but now they sparkle." }, fx: { money: -150, looks: 2, happy: 2 } },
      { label: { fr: 'Assumer', en: 'Embrace it' }, text: { fr: "J'ai décidé que mes rides étaient des « traces de rire ». J'ai dû beaucoup rire. Surtout du front.", en: "I decided my wrinkles are 'laugh lines'. I must have laughed a lot. Mostly with my forehead." }, fx: { happy: 5, stress: -3 } },
      {
        label: { fr: 'Botox', en: 'Botox' },
        out: [
          { w: 2, text: { fr: "Botox. Je n'ai plus aucune ride, ni aucune expression. Quand je suis {furieux|furieuse}, j'ai l'air de lire un menu.", en: "Botox. I have zero wrinkles and zero expressions. When I'm furious, I look like I'm reading a menu." }, fx: { money: -400, looks: 6, happy: 2 } },
          { w: 1, text: { fr: "Le Botox a figé mon sourcil gauche en position « surprise ». Depuis, j'ai l'air étonné{|e} par tout. Même par la météo.", en: "The Botox froze my left eyebrow in 'surprised' mode. Now I look amazed by everything. Even the weather." }, fx: { money: -400, looks: -3 } },
        ],
      },
    ],
  },
  {
    id: 'he_midlife_hormones',
    icon: '🌡️',
    cat: 'body',
    rating: 1,
    scene: { place: 'home', mood: 'angry', prop: 'fan' },
    when: { age: [45, 60] },
    weight: 7,
    once: true,
    text: {
      fr: ["{Andropause : en trois semaines, tu as acheté une moto, un blouson en cuir et des baskets fluo. Tu t'es aussi mis au padel. Ton entourage s'inquiète.|Ménopause : bouffées de chaleur à toute heure. Tu as ouvert les fenêtres en plein janvier et tes invités dînent maintenant en doudoune.}", "{Ton médecin parle d'« andropause ». Tu as pleuré devant une pub pour des yaourts et tu envisages sérieusement une boucle d'oreille.|Ton médecin parle de « ménopause ». Tu viens de transpirer à travers un manteau à l'arrêt de bus, par moins deux degrés.}"],
      en: ["{Manopause: in three weeks you bought a motorcycle, a leather jacket and neon sneakers. You also took up padel. Your loved ones are worried.|Menopause: hot flashes around the clock. You opened every window in January and your dinner guests now eat in parkas.}", "{Your doctor says 'andropause'. You cried at a yogurt commercial and you're seriously considering an earring.|Your doctor says 'menopause'. You just sweated through a winter coat at the bus stop, at 28 degrees Fahrenheit.}"],
    },
    choices: [
      { label: { fr: 'Traitement hormonal', en: 'Hormone treatment' }, text: { fr: "{Patchs de testostérone : j'ai retrouvé de l'énergie, des poils sur le dos et une envie irrépressible de fendre du bois.|Traitement hormonal : les bouffées se sont calmées. J'ai rangé l'éventail et mes invités ont enfin pu retirer leurs gants.}", en: "{Testosterone patches: I got my energy back, hair on my back and an overwhelming urge to chop wood.|Hormone therapy: the flashes calmed down. I put the fan away and my guests could finally take off their gloves.}" }, fx: { money: -100, health: 4, happy: 5 } },
      { label: { fr: 'Assumer la crise', en: 'Embrace the chaos' }, text: { fr: "{J'ai acheté la moto. Je suis tombé en sortant du garage, à 2 km/h. Mais j'avais un blouson magnifique.|J'ai assumé. Quand j'ai trop chaud, je mets la tête dans le bac à surgelés du supermarché. Les vendeurs ont arrêté de me demander de sortir.}", en: "{I bought the motorcycle. I fell over pulling out of the garage, at 1 mph. But the jacket looked amazing.|I owned it. When I overheat, I stick my head in the supermarket freezer. The staff stopped asking me to leave.}" }, fx: { happy: 4, health: -2, stress: -3 } },
      { label: { fr: 'En rire', en: 'Laugh about it' }, text: { fr: "J'ai organisé une soirée « crise de la cinquantaine » avec karaoké et gâteau en forme de bouillotte. Ma famille a trouvé ça plus inquiétant que tout le reste.", en: "I threw a 'midlife crisis' party with karaoke and a hot-water-bottle cake. My family found that more worrying than everything else." }, fx: { happy: 6, stress: -5 } },
    ],
  },
  {
    id: 'he_colonoscopy',
    icon: '🧻',
    cat: 'health',
    rating: 2,
    scene: { place: 'hospital', mood: 'sick', prop: 'toilet', fx: 'poop' },
    when: { age: [50, 85] },
    weight: 6,
    once: true,
    text: {
      fr: ["Cinquante ans passés : ton médecin te prescrit une coloscopie. La veille, il faut boire quatre litres d'une potion qui « nettoie tout ». Tout.", "Coloscopie de dépistage. Le kit de préparation contient un litre de laxatif, un pyjama et une brochure intitulée « Restez près des toilettes »."],
      en: ["Past fifty: your doctor orders a colonoscopy. The night before, you drink a gallon of a potion that 'cleans everything out'. Everything.", "Screening colonoscopy. The prep kit contains a quart of laxative, pajamas and a brochure titled 'Stay Near The Toilet'."],
    },
    choices: [
      {
        label: { fr: 'Faire la prépa', en: 'Do the prep' },
        out: [
          { w: 3, text: { fr: "La potion a agi comme un Kärcher interne. J'ai passé la nuit sur le trône à expulser mon passé, mes regrets et un Lego avalé en 1983. Le lendemain : tuyauterie impeccable, résultats parfaits.", en: "The potion worked like an internal pressure washer. I spent the night on the throne expelling my past, my regrets and a Lego I swallowed in 1983. Next day: spotless plumbing, perfect results." }, fx: { health: 6, happy: -3, visual: 'poop' } },
          { w: 1, text: { fr: "On m'a retiré un polype pendant que je dormais. Le médecin m'a dit que j'avais bien fait de venir. J'ai appelé mes potes pour leur dire de faire pareil, entre deux passages aux toilettes.", en: "They removed a polyp while I slept. The doctor said I did well to come. I called my friends to tell them to do the same, between two trips to the toilet." }, fx: { health: 10, happy: 2, visual: 'poop' }, mood: 'proud' },
        ],
      },
      { label: { fr: 'Boire la potion en avance', en: 'Drink it early' }, text: { fr: "J'ai bu la potion en pensant avoir le temps de passer à l'anniversaire de ma belle-sœur. Je n'avais pas le temps. Son tapis persan non plus.", en: "I drank the potion thinking I had time to stop by my sister-in-law's birthday. I did not have time. Neither did her Persian rug." }, fx: { happy: -10, fame: 1, visual: 'poop' }, mood: 'shock' },
      { label: { fr: 'Négocier une prise de sang', en: 'Beg for a blood test' }, text: { fr: "J'ai supplié qu'on fasse « juste une prise de sang ». Le gastro-entérologue a ri si fort que son stagiaire a dû lui taper dans le dos.", en: "I begged for 'just a blood test'. The gastroenterologist laughed so hard his intern had to pat him on the back." }, fx: { happy: -2, health: -2 } },
    ],
  },
  {
    id: 'he_hip',
    icon: '🦯',
    cat: 'health',
    rating: 0,
    scene: { place: 'hospital', mood: 'sad', prop: 'walker' },
    when: { age: [72, 110] },
    weight: 7,
    cooldown: 6,
    text: {
      fr: ["Tu as glissé sur un tapis de bain que tu possèdes depuis 1971. Ta hanche a fait un bruit de biscotte.", "On t'avait offert un bracelet d'alerte « en cas de chute ». Tu viens de tomber dans le jardin. Le bracelet est sur la table de nuit."],
      en: ["You slipped on a bath mat you've owned since 1971. Your hip made a cracker sound.", "Someone gave you a 'fall alert' bracelet. You just fell in the garden. The bracelet is on the nightstand."],
    },
    choices: [
      { label: { fr: 'Prothèse de hanche', en: 'Hip replacement' }, text: { fr: "On m'a posé une hanche en titane. Je sonne aux portiques d'aéroport et je me sens un peu cyborg.", en: "They gave me a titanium hip. I set off airport detectors and feel a bit like a cyborg." }, fx: { money: -500, health: 5, happy: 3 } },
      { label: { fr: 'Déambulateur tuning', en: 'Pimp my walker' }, text: { fr: "J'ai pris un déambulateur et je l'ai décoré de flammes, d'un klaxon et de balles de tennis fluo. Je suis la terreur de la résidence.", en: "I got a walker and kitted it out with flames, a horn and neon tennis balls. I'm the terror of the retirement home." }, fx: { happy: 6, health: -2 } },
      {
        label: { fr: "Refuser toute aide", en: 'Refuse all help' },
        out: [
          { w: 1, text: { fr: "J'ai rampé jusqu'au téléphone. Ça m'a pris deux heures. J'ai appelé mon médecin pour lui dire que tout allait très bien.", en: "I crawled to the phone. It took two hours. I called my doctor to tell him everything was just fine." }, fx: { health: -8, happy: -3 } },
          { w: 1, odds: { health: 1 }, text: { fr: "Je me suis relevé{|e} tout{|e} seul{|e}, en jurant dans trois langues. Ma hanche tient. Mon orgueil aussi.", en: "I got up on my own, swearing in three languages. My hip holds. So does my pride." }, fx: { health: -3, happy: 4 } },
        ],
      },
    ],
  },

  // ───────────────────────────── mental health ─────────────────────────────
  {
    id: 'he_therapy',
    icon: '🛋️',
    cat: 'mind',
    rating: 0,
    scene: { place: 'office', mood: 'neutral', prop: 'couch' },
    when: { age: [16, 90] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["Ça ne va pas fort ces temps-ci. Un ami te file le numéro de sa psy : « Elle est super, son chien assiste aux séances. »", "Ta première séance chez le psy. Il y a un divan, une boîte de mouchoirs pleine et un monsieur qui dit « hmm » pour 90 € de l'heure."],
      en: ["Things haven't been great lately. A friend gives you his therapist's number: 'She's great, her dog sits in on sessions.'", "Your first therapy session. There's a couch, a full box of tissues and a man who says 'hmm' for 120 bucks an hour."],
    },
    choices: [
      {
        label: { fr: 'Tout déballer', en: 'Open up' },
        out: [
          { w: 3, text: { fr: "J'ai parlé de ma mère, de mon enfance, de cette fois en CE2 où j'ai fait pipi à la piscine. J'ai pleuré, le chien aussi. Pour la première fois depuis longtemps, je respire.", en: "I talked about my mother, my childhood, that time in third grade I peed in the pool. I cried, so did the dog. For the first time in ages, I can breathe." }, fx: { money: -300, stress: -12, happy: 8 }, mood: 'cry' },
          { w: 1, text: { fr: "J'ai tout déballé. Le psy s'est endormi au milieu de mon traumatisme. Il a ronflé. J'ai quand même payé, par politesse.", en: "I poured my heart out. The therapist fell asleep in the middle of my trauma. He snored. I paid anyway, to be polite." }, fx: { money: -90, happy: -3 } },
        ],
      },
      { label: { fr: 'Parler de la météo', en: 'Talk about the weather' }, text: { fr: "J'ai parlé de la météo pendant 50 minutes. Le psy a noté « évitement massif » et m'a redonné rendez-vous la semaine prochaine. Il a raison, le salaud.", en: "I talked about the weather for 50 minutes. The therapist wrote 'massive avoidance' and booked me for next week. He's right, the bastard." }, fx: { money: -90, stress: -2 } },
      { label: { fr: 'Me débrouiller seul', en: 'Handle it myself' }, text: { fr: "J'ai décidé de m'en sortir seul{|e}, avec des podcasts et un carnet de gratitude. Ce matin, le carnet dit : « Merci pour rien. »", en: "I decided to handle it alone, with podcasts and a gratitude journal. This morning, the journal says: 'Thanks for nothing.'" }, fx: { happy: -2, stress: 3 } },
    ],
  },
  {
    id: 'he_panic_attack',
    icon: '😰',
    cat: 'mind',
    rating: 1,
    scene: { place: 'party', mood: 'shock', prop: 'guacamole' },
    when: { age: [16, 80] },
    weight: 7,
    cooldown: 6,
    text: {
      fr: ["En pleine soirée, ton cœur se met à cogner comme un voisin bourré à 3 h du matin. Tes mains tremblent, l'air ne rentre plus. Tu es persuadé{|e} de mourir là, à côté du guacamole.", "Sans prévenir, tout devient trop : le bruit, les gens, la lumière. Ta poitrine se serre et ton cerveau hurle « ALERTE » alors qu'il ne se passe absolument rien."],
      en: ["Mid-party, your heart starts pounding like a drunk neighbor at 3 a.m. Your hands shake, air won't go in. You're sure you're going to die right here, next to the guacamole.", "Out of nowhere, everything is too much: the noise, the people, the lights. Your chest tightens and your brain screams 'ALERT' while absolutely nothing is happening."],
    },
    choices: [
      { label: { fr: 'Sortir respirer', en: 'Step out and breathe' }, text: { fr: "Je suis sorti{|e}, j'ai compté mes respirations et nommé cinq choses autour de moi : une poubelle, un chat, une poubelle, une autre poubelle, la lune. C'est passé.", en: "I stepped out, counted my breaths and named five things around me: a trash can, a cat, a trash can, another trash can, the moon. It passed." }, fx: { stress: -6, happy: 2 } },
      { label: { fr: 'Appeler un ami', en: 'Call a friend' }, text: { fr: "J'ai appelé un vieil ami. Il ne m'a pas demandé pourquoi : il m'a raconté son week-end raté au camping jusqu'à ce que mon cœur se calme. Il y a des gens en or.", en: "I called an old friend. He didn't ask why: he just told me about his disastrous camping weekend until my heart slowed down. Some people are pure gold." }, fx: { stress: -10, happy: 6 }, mood: 'love' },
      { label: { fr: 'Voir un médecin', en: 'See a doctor' }, text: { fr: "Le médecin a parlé de trouble anxieux. Bizarrement, mettre un nom dessus m'a soulagé{|e}. J'ai un suivi, des exercices, et un peu moins honte.", en: "The doctor said anxiety disorder. Weirdly, putting a name on it was a relief. I've got follow-ups, exercises, and a little less shame." }, fx: { disease: 'anxiety', stress: -4, happy: 2 } },
      { label: { fr: 'Noyer ça dans la vodka', en: 'Drown it in vodka' }, text: { fr: "Trois verres cul sec pour faire taire la panique. Elle s'est tue. Puis elle est revenue le lendemain, avec la gueule de bois en renfort.", en: "Three shots to shut the panic up. It went quiet. Then it came back the next morning with a hangover for backup." }, fx: { addiction: ['alcohol', 10], stress: 5, health: -3 } },
    ],
  },
  {
    id: 'he_depression',
    icon: '🌧️',
    cat: 'mind',
    rating: 1,
    scene: { place: 'home', mood: 'sad', prop: 'couch' },
    when: { age: [18, 85], stat: { happy: [0, 45] } },
    weight: 6,
    cooldown: 8,
    text: {
      fr: ["Depuis des semaines, tout est gris. Ton canapé a pris la forme exacte de ton corps et ta vaisselle sale a développé sa propre civilisation.", "Tu dors 14 heures, tu te réveilles épuisé{|e}, et répondre à un SMS te semble aussi dur qu'un marathon. Tes plantes sont mortes par solidarité."],
      en: ["For weeks, everything's been grey. Your couch has taken the exact shape of your body and your dirty dishes have founded their own civilization.", "You sleep 14 hours, wake up exhausted, and answering a text feels like running a marathon. Your plants died out of solidarity."],
    },
    choices: [
      { label: { fr: 'Voir un médecin', en: 'See a doctor' }, text: { fr: "J'ai traîné ma carcasse chez le médecin. Il m'a écouté{|e} pour de vrai, a parlé de traitement et de thérapie. C'est long, mais la grisaille commence à avoir des trous.", en: "I dragged myself to the doctor. He actually listened, talked about treatment and therapy. It's slow, but the grey is starting to get holes in it." }, fx: { cure: 'depression', money: -60, happy: 8, stress: -8 } },
      { label: { fr: 'Adopter un chien', en: 'Adopt a dog' }, text: { fr: "J'ai adopté un vieux chien qui sent le paillasson mouillé. Il me force à sortir deux fois par jour et il me regarde comme si j'étais quelqu'un de bien. Ça aide.", en: "I adopted an old dog who smells like a wet doormat. He makes me go out twice a day and looks at me like I'm a good person. It helps." }, fx: { newNpc: { role: 'pet', species: 'dog' }, happy: 10, stress: -5 }, mood: 'love' },
      { label: { fr: 'Rester sous la couette', en: 'Stay under the covers' }, text: { fr: "Je suis resté{|e} sous la couette. Les semaines sont devenues des mois. Un jour, il faudra que j'en parle à quelqu'un.", en: "I stayed under the covers. Weeks turned into months. Someday I'll have to talk to someone." }, fx: { disease: 'depression', happy: -8, health: -4 }, mood: 'cry' },
    ],
  },

  // ───────────────────────────── alcohol ─────────────────────────────
  {
    id: 'he_bar_night',
    icon: '🍻',
    cat: 'vice',
    rating: 1,
    scene: { place: 'party', mood: 'party', prop: 'beer' },
    when: { age: [18, 80] },
    weight: 9,
    cooldown: 3,
    text: {
      fr: ["Tes potes t'embarquent pour « un verre ». Tout le monde sait ce que veut dire « un verre ». Même le barman a soupiré.", "Soirée au bar. Le patron annonce une happy hour illimitée « jusqu'à ce que quelqu'un pleure ». Il est 19 h."],
      en: ["Your friends drag you out for 'one drink'. Everyone knows what 'one drink' means. Even the bartender sighed.", "Night at the bar. The owner announces unlimited happy hour 'until somebody cries'. It's 7 p.m."],
    },
    choices: [
      {
        label: { fr: 'Encore une tournée', en: 'One more round' },
        out: [
          { w: 3, text: { fr: "Huit tournées. J'ai déclaré ma flamme à un portemanteau et chanté du Céline Dion à un videur. Le lendemain, ma tête avait la taille d'une pastèque.", en: "Eight rounds. I declared my love to a coat rack and sang Celine Dion to a bouncer. Next morning, my head was the size of a watermelon." }, fx: { addiction: ['alcohol', 15], happy: 6, health: -4 }, mood: 'party' },
          { w: 1, text: { fr: "J'ai été raisonnable : quatre tournées et un taxi. Je suis fier{|e} de moi, dans une certaine mesure.", en: "I was reasonable: four rounds and a cab. I'm proud of myself, to a degree." }, fx: { addiction: ['alcohol', 5], happy: 5 } },
        ],
      },
      {
        label: { fr: 'Concours de shots', en: 'Shot contest' },
        out: [
          { w: 1, text: { fr: "Concours de shots contre un rugbyman géorgien. Au quatorzième, il y a eu un trou noir.", en: "Shot contest against a Georgian rugby player. Around the fourteenth, everything went black." }, fx: { addiction: ['alcohol', 20], chain: 'he_blackout' } },
          { w: 1, text: { fr: "J'ai battu un rugbyman au concours de shots. Il m'a porté{|e} en triomphe, puis m'a vomi dessus. Une forme de respect.", en: "I beat a rugby player at shots. He carried me in triumph, then puked on me. A form of respect." }, fx: { addiction: ['alcohol', 15], happy: 6, health: -6, fame: 1 } },
        ],
      },
      { label: { fr: "Rester à l'eau", en: 'Stick to water' }, text: { fr: "Eau gazeuse toute la soirée. J'ai été promu{|e} chauffeur, psychologue et teneur de cheveux officiel au-dessus des toilettes. Un saint.", en: "Sparkling water all night. I was promoted to designated driver, therapist and official hair-holder over the toilet. A saint." }, fx: { karma: 5, happy: 2 } },
    ],
  },
  {
    id: 'he_blackout',
    icon: '🥴',
    cat: 'vice',
    rating: 2,
    chainOnly: true,
    scene: { place: 'home', mood: 'shock', prop: 'bathtub' },
    text: {
      fr: ["Tu te réveilles. Il fait jour. Tu es dans une baignoire qui n'est pas la tienne, il y a du vomi dans ta chaussure et un tatouage tout frais te démange l'épaule.", "Réveil sur un rond-point, en sous-vêtements, une tête de sanglier empaillée dans les bras. Ton téléphone affiche 47 appels manqués et ta bouche a un goût de moquette."],
      en: ["You wake up. It's daylight. You're in a bathtub that isn't yours, there's vomit in your shoe and a fresh tattoo itching on your shoulder.", "You wake up on a roundabout in your underwear, hugging a stuffed boar's head. Your phone shows 47 missed calls and your mouth tastes like carpet."],
    },
    choices: [
      {
        label: { fr: 'Reconstituer la soirée', en: 'Piece the night together' },
        out: [
          { w: 2, text: { fr: "Grâce aux stories des autres, j'ai reconstitué la nuit : danse sur le capot d'une voiture de police, vomi dans un chapeau melon, câlin en pleurs à une borne de recharge. Le tatouage dit « MAMAN » avec deux fautes.", en: "Thanks to other people's stories, I pieced the night together: dancing on a police car hood, puking into a bowler hat, sobbing hug with a charging station. The tattoo says 'MOMM' with a typo." }, fx: { happy: -6, looks: -2, fame: 3, heat: 5 }, mood: 'shock' },
          { w: 1, text: { fr: "La vidéo de ma nuit a fait deux millions de vues. On y voit mon pantalon en feu et moi qui hurle « JE SUIS LE PHÉNIX ». Mon patron l'a vue. Ma mère aussi.", en: "The video of my night got two million views. It shows my pants on fire and me screaming 'I AM THE PHOENIX'. My boss saw it. So did my mom." }, fx: { fame: 6, followers: 20000, happy: -4, perf: -10 } },
        ],
      },
      { label: { fr: "Plus jamais d'alcool", en: 'Never drinking again' }, text: { fr: "J'ai juré de ne plus jamais boire. Je l'ai juré sur la tête du sanglier. Ça a tenu jusqu'à samedi.", en: "I swore never to drink again. I swore it on the boar's head. It lasted until Saturday." }, fx: { addiction: ['alcohol', -5], happy: -2, discipline: 2 } },
      { label: { fr: 'Soigner le mal par le mal', en: 'Hair of the dog' }, text: { fr: "Une bière pour soigner la gueule de bois. Puis une autre pour soigner la première. Il est 11 h et je suis de nouveau un phénix.", en: "One beer to cure the hangover. Then another to cure the first. It's 11 a.m. and I'm a phoenix again." }, fx: { addiction: ['alcohol', 15], health: -6, happy: 2 } },
    ],
  },
  {
    id: 'he_aa_meeting',
    icon: '☕',
    cat: 'vice',
    rating: 1,
    scene: { place: 'office', mood: 'sad', prop: 'chairs' },
    when: { age: [18, 90], addiction: 'alcohol' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["Sous-sol d'une salle paroissiale. Café tiède, chaises en plastique, une dizaine d'inconnus en cercle. « Bonjour, je m'appelle… »", "Ton premier groupe de parole des Alcooliques Anonymes. Il y a des biscuits secs, un néon qui clignote et un vieux motard qui pleure doucement."],
      en: ["A church basement. Lukewarm coffee, plastic chairs, a dozen strangers in a circle. 'Hi, my name is…'", "Your first Alcoholics Anonymous meeting. There are stale cookies, a flickering neon light and an old biker quietly crying."],
    },
    choices: [
      { label: { fr: 'Prendre la parole', en: 'Speak up' }, text: { fr: "« Bonjour, je m'appelle {first}, et je suis alcoolique. » Ma voix a tremblé. Douze inconnus ont répondu « Bonjour {first} » comme si on m'attendait. J'ai pleuré dans mon gobelet de café.", en: "'Hi, my name is {first}, and I'm an alcoholic.' My voice shook. Twelve strangers said 'Hi {first}' like they'd been waiting for me. I cried into my coffee cup." }, fx: { addiction: ['alcohol', -20], happy: 6, stress: -6 }, mood: 'cry' },
      { label: { fr: 'Juste écouter', en: 'Just listen' }, text: { fr: "J'ai écouté. Le vieux motard a raconté qu'il avait bu le liquide de refroidissement de sa Harley. Je me suis senti{|e} moins seul{|e}. Et un peu mieux placé{|e}.", en: "I listened. The old biker told us he once drank his Harley's coolant. I felt less alone. And a bit better about myself." }, fx: { addiction: ['alcohol', -10], happy: 2 } },
      { label: { fr: "Filer au bar d'en face", en: 'Sneak to the bar across the street' }, text: { fr: "Je suis parti{|e} à la pause biscuits pour aller au bar d'en face. Le barman m'a lancé « Déjà fini ? ». Il voit ça tous les mardis.", en: "I slipped out at cookie break to the bar across the street. The bartender said 'Done already?'. He sees it every Tuesday." }, fx: { addiction: ['alcohol', 10], happy: -4, karma: -2 } },
    ],
  },
  {
    id: 'he_intervention',
    icon: '🫂',
    cat: 'vice',
    rating: 1,
    actor: 'family',
    scene: { place: 'home', mood: 'cry', prop: 'letter' },
    when: { age: [20, 85], addiction: 'alcohol' },
    weight: 7,
    cooldown: 4,
    text: {
      fr: ["Tu rentres chez toi et tout le monde est là, assis en rond dans ton salon, {a.rel} en tête avec une lettre à la main. Ce n'est pas une fête surprise. C'est une intervention.", "{a.first} a imprimé un PowerPoint intitulé « Toi et le rosé : il est temps d'en parler ». Il y a des graphiques. Et des larmes."],
      en: ["You come home and everyone's there, sitting in a circle in your living room, {a.rel} up front holding a letter. It's not a surprise party. It's an intervention.", "{a.first} printed a PowerPoint titled 'You and Rosé: It's Time We Talked'. There are charts. And tears."],
    },
    choices: [
      { label: { fr: 'Accepter la cure', en: 'Go to rehab' }, text: { fr: "Six semaines de cure, zéro alcool, même pas dans le bain de bouche. J'ai transpiré, tremblé, pleuré, et je suis ressorti{|e} les yeux clairs. À la sortie, {a.my} m'attendait.", en: "Six weeks of rehab, zero alcohol, not even in the mouthwash. I sweated, shook, cried, and came out clear-eyed. At the exit, {a.my} was waiting for me." }, fx: { addiction: ['alcohol', -45], money: -3000, health: 8, happy: 4, rel: 15, flag: 'he_rehab', schedule: { key: 'he_relapse', years: 2 } }, mood: 'cry' },
      { label: { fr: 'Promettre de ralentir', en: 'Promise to cut back' }, text: { fr: "J'ai promis de ralentir. J'ai remplacé le vin par la bière, « parce que c'est moins fort ». Personne n'a été convaincu. Moi non plus.", en: "I promised to cut back. I swapped wine for beer, 'because it's weaker'. Nobody was convinced. Neither was I." }, fx: { addiction: ['alcohol', -5], rel: -5 } },
      { label: { fr: 'Les foutre dehors', en: 'Kick them all out' }, text: { fr: "J'ai foutu tout le monde dehors en hurlant que je n'avais « aucun problème », une bouteille à la main. Dans l'escalier, {a.my} pleurait. J'ai bu pour oublier.", en: "I threw everyone out, screaming that I had 'no problem', bottle in hand. On the stairs, {a.my} was crying. I drank to forget." }, fx: { addiction: ['alcohol', 10], rel: -20, happy: -8 }, mood: 'angry' },
    ],
  },
  {
    id: 'he_relapse',
    icon: '🥂',
    cat: 'vice',
    rating: 1,
    chainOnly: true,
    scene: { place: 'party', mood: 'neutral', prop: 'champagne' },
    when: { flag: 'he_rehab' },
    text: {
      fr: ["Mariage d'un cousin. Deux ans sans une goutte. Un serveur passe avec un plateau de coupes de champagne qui brillent comme des diamants.", "Deux ans que tu es sobre. Ce soir, quelqu'un t'offre un whisky de 25 ans d'âge « pour fêter ça ». L'odeur te chatouille les souvenirs."],
      en: ["A cousin's wedding. Two years without a drop. A waiter walks by with a tray of champagne flutes sparkling like diamonds.", "Two years sober. Tonight someone offers you a 25-year-old whisky 'to celebrate'. The smell tickles old memories."],
    },
    choices: [
      { label: { fr: 'Refuser poliment', en: 'Politely decline' }, text: { fr: "J'ai pris un jus de pomme et dansé comme un{|e} dingue toute la nuit. Le lendemain, j'étais la seule personne à se souvenir de la soirée. J'ai les photos, et ma fierté.", en: "I took an apple juice and danced like a maniac all night. Next day, I was the only one who remembered the party. I have the photos, and my pride." }, fx: { happy: 8, discipline: 5, karma: 3, unflag: 'he_rehab' }, mood: 'proud' },
      {
        label: { fr: 'Juste une coupe', en: 'Just one glass' },
        out: [
          { w: 2, text: { fr: "« Juste une coupe. » Puis la bouteille. Puis le bar. Puis un trou noir sous la table des desserts. Retour à la case départ.", en: "'Just one glass.' Then the bottle. Then the bar. Then a blackout under the dessert table. Back to square one." }, fx: { addiction: ['alcohol', 30], happy: -8, unflag: 'he_rehab' }, mood: 'cry' },
          { w: 1, text: { fr: "J'ai bu une coupe, et je me suis arrêté{|e} là. Je n'avais pas besoin de la deuxième. Cette fois-ci, en tout cas.", en: "I had one glass and stopped there. I didn't need a second. This time, anyway." }, fx: { addiction: ['alcohol', 10], unflag: 'he_rehab' } },
        ],
      },
      { label: { fr: 'Appeler mon parrain', en: 'Call my sponsor' }, text: { fr: "J'ai appelé mon parrain des AA depuis les toilettes. Il m'a parlé vingt minutes de sa collection de timbres. L'envie est passée. D'ennui.", en: "I called my AA sponsor from the restroom. He talked about his stamp collection for twenty minutes. The craving passed. Of boredom." }, fx: { addiction: ['alcohol', -5], happy: 4, unflag: 'he_rehab' } },
    ],
  },
  {
    id: 'he_liver',
    icon: '🫀',
    cat: 'vice',
    rating: 2,
    scene: { place: 'hospital', mood: 'sick', prop: 'xray' },
    when: { age: [35, 90], addiction: 'alcohol' },
    weight: 6,
    once: true,
    text: {
      fr: ["Ta peau a viré au jaune Simpson. Ton médecin regarde l'échographie et murmure : « Votre foie ressemble à du foie gras. Du foie gras oublié au soleil. »", "Douleur sous les côtes. Le scanner montre un foie gonflé comme un ballon de baudruche, couvert de cicatrices. Le radiologue a fait un signe de croix."],
      en: ["Your skin has turned Simpsons yellow. Your doctor looks at the ultrasound and whispers: 'Your liver looks like foie gras. Foie gras left out in the sun.'", "Pain under your ribs. The scan shows a liver swollen like a party balloon, covered in scars. The radiologist crossed himself."],
    },
    choices: [
      { label: { fr: 'Arrêter net', en: 'Quit cold turkey' }, text: { fr: "J'ai tout arrêté net. Trois jours de tremblements, de sueurs et de cauchemars peuplés d'araignées en smoking. Mon foie m'a envoyé une carte de remerciement.", en: "I quit cold turkey. Three days of shakes, sweats and nightmares full of spiders in tuxedos. My liver sent me a thank-you card." }, fx: { disease: 'liver_disease', addiction: ['alcohol', -35], health: 4, happy: -4 } },
      { label: { fr: 'Demander une greffe', en: 'Ask for a transplant' }, text: { fr: "On m'a mis{|e} sur liste d'attente. Le chirurgien a précisé : « Si vous rebuvez, on vous le reprend. À la petite cuillère. »", en: "They put me on the waiting list. The surgeon added: 'If you drink again, we take it back. With a teaspoon.'" }, fx: { disease: 'liver_disease', addiction: ['alcohol', -20], stress: 6 } },
      {
        label: { fr: 'Trinquer à mon foie', en: 'Toast to my liver' },
        out: [
          { w: 3, text: { fr: "J'ai trinqué à la santé de mon foie. Il n'a pas répondu. Il s'est mis en grève.", en: "I raised a glass to my liver's health. It didn't answer. It went on strike." }, fx: { disease: 'liver_disease', addiction: ['alcohol', 10], health: -10 }, mood: 'sick' },
          { w: 1, text: { fr: "J'ai fêté le diagnostic au pastis, en pleine partie de pétanque. Au troisième verre, il y a eu un « ploc » sous mes côtes, et une flaque verte a envahi le terrain.", en: "I celebrated the diagnosis with pastis in the middle of a bocce game. Third glass, there was a 'plop' under my ribs, and a green puddle flooded the court." }, fx: { die: { fr: "le foie éclaté comme une piñata pleine de bile, en pleine partie de pétanque", en: 'when my liver burst like a bile-filled piñata in the middle of a bocce game' }, visual: 'gore' } },
        ],
      },
    ],
  },

  // ───────────────────────────── tobacco ─────────────────────────────
  {
    id: 'he_cigarette',
    icon: '🚬',
    cat: 'vice',
    rating: 1,
    scene: { place: 'party', mood: 'neutral', prop: 'cigarette' },
    when: { age: [18, 70] },
    weight: 8,
    cooldown: 5,
    text: {
      fr: ["En soirée, sur le balcon, une fille au rire de mouette te tend une cigarette : « Allez, une seule, c'est pour l'ambiance. »", "Tous les gens intéressants de la soirée sont dehors, à fumer près des poubelles. Le cercle des gens cool sent le cendrier."],
      en: ["At a party, on the balcony, a girl with a seagull laugh holds out a cigarette: 'Come on, just one, for the vibe.'", "All the interesting people at the party are outside smoking by the trash cans. The cool kids' circle smells like an ashtray."],
    },
    choices: [
      {
        label: { fr: 'En prendre une', en: 'Take one' },
        out: [
          { w: 2, text: { fr: "J'ai toussé comme un vieux tracteur, les larmes aux yeux. Puis j'en ai repris une. Puis un paquet. Félicitations : je me suis acheté une addiction à 12 € le paquet.", en: "I coughed like an old tractor, eyes watering. Then I had another. Then a pack. Congratulations: I bought myself a twelve-dollar-a-pack addiction." }, fx: { addiction: ['tobacco', 25], health: -3, happy: 2 } },
          { w: 1, text: { fr: "J'ai fumé ma première clope et j'ai vomi par-dessus le balcon, sur le chat du voisin. Je ne fumerai plus jamais. Le chat non plus.", en: "I smoked my first cigarette and puked over the balcony onto the neighbor's cat. I'll never smoke again. Neither will the cat." }, fx: { health: -2, happy: -3 } },
        ],
      },
      { label: { fr: 'Refuser', en: 'Say no' }, text: { fr: "J'ai dit non merci et je suis resté{|e} à l'intérieur, avec les pas cool, autour du houmous. On s'est super bien marrés.", en: "I said no thanks and stayed inside with the uncool people around the hummus. We had a blast." }, fx: { happy: 3, health: 1 } },
      { label: { fr: 'Plutôt la vapoteuse', en: 'Vape instead' }, text: { fr: "J'ai tiré sur la vapoteuse « barbe à papa licorne » d'un inconnu. J'ai craché un nuage de trois mètres et perdu toute crédibilité d'adulte.", en: "I hit a stranger's 'unicorn cotton candy' vape. I blew a ten-foot cloud and lost all adult credibility." }, fx: { addiction: ['tobacco', 10], looks: -2, happy: 2 } },
    ],
  },
  {
    id: 'he_quit_smoking',
    icon: '🩹',
    cat: 'vice',
    rating: 0,
    scene: { place: 'home', mood: 'angry', prop: 'patch' },
    when: { age: [18, 90], addiction: 'tobacco' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["Ton paquet affiche maintenant une photo de poumon tellement moche que tu le ranges à l'envers. Il est peut-être temps d'arrêter.", "Tu as monté deux étages et tu as dû t'asseoir sur le palier pour reprendre ton souffle. Ta voisine de 82 ans t'a doublé{|e} en te demandant si ça allait."],
      en: ["Your pack now has a lung photo so ugly you keep it face down. Maybe it's time to quit.", "You climbed two flights of stairs and had to sit on the landing to catch your breath. Your 82-year-old neighbor passed you and asked if you were okay."],
    },
    choices: [
      {
        label: { fr: 'Patchs et chewing-gums', en: 'Patches and gum' },
        out: [
          { w: 2, odds: { discipline: 1 }, text: { fr: "Patchs, chewing-gums et trois mois de mauvaise humeur. J'ai arrêté ! Je sens à nouveau les odeurs. Y compris celle du métro. Pas sûr{|e} que ce soit un cadeau.", en: "Patches, gum and three months of bad moods. I quit! I can smell things again. Including the subway. Not sure that's a gift." }, fx: { addiction: ['tobacco', -40], health: 6, happy: 4 }, mood: 'proud' },
          { w: 1, text: { fr: "J'ai collé trois patchs en même temps « pour aller plus vite ». J'ai fait des rêves si intenses que j'ai épousé un dauphin.", en: "I stuck on three patches at once 'to speed things up'. I had dreams so intense I married a dolphin." }, fx: { addiction: ['tobacco', -15], happy: 2 } },
        ],
      },
      {
        label: { fr: "Arrêter d'un coup", en: 'Cold turkey' },
        out: [
          { w: 1, odds: { discipline: 1 }, text: { fr: "J'ai tout arrêté d'un coup. Deux semaines de bête sauvage : j'ai grogné sur un bébé. Mais j'ai tenu.", en: "I quit cold turkey. Two weeks as a wild animal: I growled at a baby. But I held on." }, fx: { addiction: ['tobacco', -50], health: 6, stress: 6 }, mood: 'proud' },
          { w: 2, text: { fr: "J'ai tenu quatre jours. Le cinquième, j'ai fumé trois cigarettes en même temps sur un parking, en pleurant.", en: "I lasted four days. On the fifth, I smoked three cigarettes at once in a parking lot, crying." }, fx: { addiction: ['tobacco', 5], happy: -4 } },
        ],
      },
      { label: { fr: 'Passer à la vape', en: 'Switch to vaping' }, text: { fr: "Je suis passé{|e} à la vapoteuse goût mangue. Je fume autant, mais je sens le fruit tropical.", en: "I switched to a mango vape. I smoke just as much, but now I smell like a tropical fruit." }, fx: { addiction: ['tobacco', -10], happy: 2 } },
    ],
  },
  {
    id: 'he_smoker_cough',
    icon: '🫁',
    cat: 'vice',
    rating: 2,
    scene: { place: 'hospital', mood: 'sick', prop: 'xray' },
    when: { age: [40, 95], addiction: 'tobacco' },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["Ta toux du matin dure maintenant 25 minutes. Aujourd'hui, tu as craché un truc noir et vivant qui a rampé vers le siphon.", "Tu tousses si fort que tu as fait sauter un bouton de chemise, qui a éborgné un pigeon. Ton médecin veut une radio des poumons."],
      en: ["Your morning cough now lasts 25 minutes. Today you hacked up something black and alive that crawled toward the drain.", "You cough so hard you popped a shirt button, which blinded a pigeon in one eye. Your doctor wants a lung X-ray."],
    },
    choices: [
      {
        label: { fr: 'Faire la radio', en: 'Get the X-ray' },
        out: [
          { w: 3, text: { fr: "Sur la radio, mes poumons ressemblent à deux vieilles éponges de friteuse. Le pneumologue m'a donné un ultimatum et une brochure avec des photos à vomir.", en: "On the X-ray, my lungs look like two old deep-fryer sponges. The pulmonologist gave me an ultimatum and a brochure with puke-worthy photos." }, fx: { health: -4, stress: 6, addiction: ['tobacco', -10] } },
          { w: 1, text: { fr: "Le pneumologue a pointé une tache sur la radio et n'a fait aucune blague. C'est là que j'ai eu peur. Cancer du poumon.", en: "The pulmonologist pointed at a spot on the X-ray and made no jokes. That's when I got scared. Lung cancer." }, fx: { disease: 'lung_cancer', happy: -15, stress: 12 }, mood: 'cry' },
        ],
      },
      {
        label: { fr: 'Une clope pour calmer ça', en: 'Smoke to calm it down' },
        out: [
          { w: 3, text: { fr: "J'ai allumé une clope pour calmer ma toux. J'ai toussé un morceau de poumon dans le cendrier. Je l'ai regardé. Il m'a regardé{|e}.", en: "I lit a cigarette to calm my cough. I coughed a chunk of lung into the ashtray. I looked at it. It looked back." }, fx: { disease: 'pneumonia', health: -8, visual: 'gore' }, mood: 'shock' },
          { w: 1, text: { fr: "La quinte a été si violente que je me suis fêlé une côte. Je l'ai entendue faire « clac », comme un œuf Kinder qu'on ouvre.", en: "The coughing fit was so violent I cracked a rib. I heard it go 'snap', like opening a Kinder egg." }, fx: { health: -10 } },
        ],
      },
      { label: { fr: 'Ignorer', en: 'Ignore it' }, text: { fr: "J'ai mis la toux sur le compte « du pollen ». En décembre.", en: "I blamed the cough on 'pollen'. In December." }, fx: { health: -5, addiction: ['tobacco', 5] } },
    ],
  },

  // ───────────────────────────── drugs ─────────────────────────────
  {
    id: 'he_dealer',
    icon: '💊',
    cat: 'vice',
    rating: 1,
    scene: { place: 'party', mood: 'party', prop: 'bag' },
    when: { age: [18, 70] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: ["Un type qui se fait appeler « Jean-Mi Pharmacie » t'aborde en soirée. Il a une sacoche en bandoulière et un catalogue plastifié avec des avis cinq étoiles.", "Ton pote te présente son dealer. Il a un terminal de carte bancaire, un programme de fidélité et un vrai sens du service client."],
      en: ["A guy who calls himself 'Pharmacy Jimmy' approaches you at a party. He has a fanny pack and a laminated catalog with five-star reviews.", "Your buddy introduces you to his dealer. He has a card reader, a loyalty program and a real sense of customer service."],
    },
    choices: [
      {
        label: { fr: 'Goûter un truc', en: 'Try something' },
        out: [
          { w: 2, text: { fr: "J'ai pris « le menu découverte ». J'ai dansé six heures d'affilée, déclaré mon amour à un extincteur et grincé des dents jusqu'au mardi.", en: "I went for 'the discovery menu'. I danced six hours straight, declared my love to a fire extinguisher and ground my teeth until Tuesday." }, fx: { addiction: ['drugs', 25], happy: 8, health: -6, flag: 'he_dealer_number' }, mood: 'party' },
          { w: 1, text: { fr: "Le truc était coupé avec de la lessive. J'ai passé la nuit à transpirer en sentant la fraîcheur des Alpes.", en: "The stuff was cut with laundry detergent. I spent the night sweating and smelling of Alpine freshness." }, fx: { addiction: ['drugs', 10], health: -8, flag: 'he_dealer_number' }, mood: 'sick' },
        ],
      },
      { label: { fr: 'Prendre son numéro', en: 'Take his number' }, text: { fr: "J'ai pris son numéro « pour un ami ». L'ami, c'est moi. Le contact est enregistré sous « Plombier ».", en: "I took his number 'for a friend'. The friend is me. The contact is saved as 'Plumber'." }, fx: { flag: 'he_dealer_number', karma: -2 } },
      {
        label: { fr: 'Refuser', en: 'Say no' },
        out: [
          { w: 2, text: { fr: "J'ai refusé. Jean-Mi a respecté mon choix et m'a laissé sa carte de visite. Avec un code promo.", en: "I said no. Jimmy respected my choice and left me his business card. With a promo code." }, fx: { karma: 2, happy: 1 } },
          { w: 1, text: { fr: "J'ai refusé. Dix minutes plus tard, les flics ont débarqué et embarqué Jean-Mi, sa sacoche et son catalogue plastifié. J'ai bien fait.", en: "I said no. Ten minutes later the cops burst in and hauled off Jimmy, his fanny pack and his laminated catalog. Good call." }, fx: { karma: 3, happy: 4, visual: 'police' } },
        ],
      },
    ],
  },
  {
    id: 'he_bad_trip',
    icon: '🍄',
    cat: 'vice',
    rating: 2,
    scene: { place: 'park', mood: 'shock', prop: 'mushroom' },
    when: { age: [18, 60] },
    weight: 6,
    cooldown: 6,
    text: {
      fr: ["Festival de musique. On te tend un petit bonbon « champignon des bois, 100 % bio ». Une heure plus tard, ton pote a une tête de lama et le ciel goutte comme une glace qui fond.", "Tu as goûté le space cake de quelqu'un. Erreur : c'était le space cake de toute la soirée, concentré. Tes mains sont devenues des pinces de homard, et l'une d'elles te parle."],
      en: ["Music festival. Someone hands you a little candy, 'wild mushroom, 100% organic'. An hour later your buddy has a llama head and the sky is dripping like melting ice cream.", "You tried someone's space cake. Mistake: it was the whole party's space cake, concentrated. Your hands turned into lobster claws, and one of them is talking to you."],
    },
    choices: [
      { label: { fr: 'Aller à la tente médicale', en: 'Go to the medical tent' }, text: { fr: "Les secouristes ont l'habitude. On m'a donné de l'eau, une couverture de survie et une bénévole qui m'a tenu la main pendant que je lui expliquais que j'étais un jambon-beurre. Elle a dit « d'accord ». Merci, Sandrine.", en: "The medics have seen it all. They gave me water, a space blanket and a volunteer who held my hand while I explained I was a ham sandwich. She said 'okay'. Thank you, Sandra." }, fx: { health: -3, happy: 2 } },
      {
        label: { fr: 'Encaisser le trip', en: 'Ride it out' },
        out: [
          { w: 2, text: { fr: "J'ai vu mon visage fondre dans un miroir et couler dans le lavabo. J'ai essayé de le récupérer avec une paille. Huit heures d'horreur pure. Plus jamais de miroirs.", en: "I watched my face melt in a mirror and drip into the sink. I tried to suck it back up with a straw. Eight hours of pure horror. No more mirrors, ever." }, fx: { happy: -10, stress: 10 }, mood: 'shock' },
          { w: 1, text: { fr: "J'ai provoqué en duel un cygne que j'avais traité de « vendu ». Le cygne a gagné, aux points et aux plumes. Sept points de suture sur le front, et du sang plein ma banane.", en: "I challenged a swan I'd called a 'sellout' to a duel. The swan won, on points and feathers. Seven stitches on my forehead and blood all over my fanny pack." }, fx: { health: -10, visual: 'gore' } },
          { w: 1, text: { fr: "J'ai compris l'univers entier, la nature du temps et le sens de la vie. Je n'ai rien noté. C'est perdu à jamais.", en: "I understood the entire universe, the nature of time and the meaning of life. I wrote nothing down. It's lost forever." }, fx: { smarts: 2, happy: 6 } },
        ],
      },
      { label: { fr: 'Appeler Jean-Mi', en: 'Call Pharmacy Jimmy' }, if: { flag: 'he_dealer_number' }, text: { fr: "J'ai appelé Jean-Mi à l'aide. Il m'a vendu un autre truc « pour redescendre ». Je suis monté{|e} encore plus haut. J'ai vu Dieu. Il portait une sacoche.", en: "I called Jimmy for help. He sold me something else 'to come down'. I went even higher. I saw God. He had a fanny pack." }, fx: { addiction: ['drugs', 15], health: -6, happy: 3 } },
    ],
  },
  {
    id: 'he_overdose',
    icon: '⚡',
    cat: 'vice',
    rating: 2,
    scene: { place: 'hospital', mood: 'shock', prop: 'defibrillator' },
    when: { age: [18, 70], addiction: 'drugs' },
    weight: 6,
    cooldown: 5,
    text: {
      fr: ["Tu ouvres les yeux sous un néon. Une infirmière tient encore les palettes du défibrillateur. Ta poitrine brûle et ta bouche a un goût de charbon. « On a bien cru vous perdre. »", "Ton cœur s'est mis à battre en techno, à 200 BPM, puis il s'est arrêté net. Tu te réveilles aux urgences, couvert{|e} d'électrodes."],
      en: ["You open your eyes under a neon light. A nurse is still holding the defibrillator paddles. Your chest burns and your mouth tastes like charcoal. 'We thought we'd lost you.'", "Your heart started beating like a techno track, 200 BPM, then stopped dead. You wake up in the ER, covered in electrodes."],
    },
    choices: [
      { label: { fr: 'Entrer en désintox', en: 'Check into rehab' }, text: { fr: "Je suis entré{|e} en désintox. Les trois premières semaines, j'ai vomi tout ce que j'avais mangé depuis le collège. Puis, petit à petit, la lumière est revenue. Une vraie lumière, pas celle d'un néon.", en: "I checked into rehab. The first three weeks, I threw up everything I'd eaten since middle school. Then, little by little, the light came back. Real light, not a neon tube." }, fx: { addiction: ['drugs', -50], money: -2500, health: 10, happy: 6 }, mood: 'cry' },
      {
        label: { fr: "Jurer d'arrêter", en: 'Swear to quit' },
        out: [
          { w: 1, text: { fr: "J'ai juré d'arrêter. J'ai effacé le numéro de Jean-Mi et, pour être sûr{|e}, j'ai jeté mon téléphone dans le fleuve.", en: "I swore to quit. I deleted Jimmy's number and, to be sure, threw my phone in the river." }, fx: { addiction: ['drugs', -25], happy: 2, unflag: 'he_dealer_number' } },
          { w: 1, text: { fr: "J'ai juré d'arrêter. J'ai tenu trois semaines. Puis Jean-Mi m'a envoyé une promo d'anniversaire.", en: "I swore to quit. I lasted three weeks. Then Jimmy sent me a birthday promo." }, fx: { addiction: ['drugs', -5] } },
        ],
      },
      {
        label: { fr: 'Repartir en soirée', en: 'Go right back out' },
        out: [
          { w: 3, text: { fr: "Je suis sorti{|e} de l'hôpital en arrachant ma perfusion. Le sang a giclé sur le distributeur de gel hydroalcoolique. Le soir même, j'étais en boîte.", en: "I left the hospital ripping out my IV. Blood sprayed all over the hand sanitizer dispenser. That same night, I was at the club." }, fx: { addiction: ['drugs', 15], health: -12, visual: 'gore' } },
          { w: 1, text: { fr: "J'ai voulu fêter ma survie. Mon cœur, lui, n'avait plus envie de faire la fête.", en: "I wanted to celebrate surviving. My heart was no longer in the party mood." }, fx: { die: { fr: "d'une overdose dans les toilettes d'une boîte de nuit, deux semaines après avoir été réanimé{|e}", en: 'of an overdose in a nightclub bathroom, two weeks after being resuscitated' } } },
        ],
      },
    ],
  },

  // ───────────────────────────── gambling ─────────────────────────────
  {
    id: 'he_online_casino',
    icon: '🎰',
    cat: 'vice',
    rating: 1,
    scene: { place: 'casino', mood: 'shock', prop: 'phone' },
    when: { age: [18, 90] },
    weight: 7,
    cooldown: 4,
    text: {
      fr: ["3 h du matin. Une appli de casino t'offre « 100 € de bonus de bienvenue ». Des pièces dorées tombent sur l'écran avec un bruit de jackpot. Ton pouce est déjà dessus.", "Ton beau-frère jure qu'il a « une méthode infaillible » au poker en ligne. Il vit dans sa voiture."],
      en: ["3 a.m. A casino app offers you a '$100 welcome bonus'. Gold coins rain down the screen with a jackpot sound. Your thumb is already on it.", "Your brother-in-law swears he has 'a foolproof system' for online poker. He lives in his car."],
    },
    choices: [
      {
        label: { fr: 'Miser un peu', en: 'Bet a little' },
        out: [
          { w: 2, text: { fr: "J'ai misé 20 balles. J'en ai gagné 300. Mon cerveau a fait un bruit de machine à sous et a décidé que c'était mon nouveau métier.", en: "I bet 20 bucks. I won 300. My brain made a slot-machine noise and decided this is my new career." }, fx: { money: 300, addiction: ['gambling', 20], happy: 6 } },
          { w: 2, text: { fr: "J'ai misé 20, puis 50, puis 200 « pour me refaire ». À 6 h, j'avais perdu 800 balles et mis mon vélo en vente pour continuer.", en: "I bet 20, then 50, then 200 'to win it back'. By 6 a.m. I'd lost 800 bucks and listed my bike for sale to keep going." }, fx: { money: -800, addiction: ['gambling', 20], happy: -8 } },
        ],
      },
      {
        label: { fr: 'Tapis sur le rouge', en: 'All-in on red' },
        out: [
          { w: 1, text: { fr: "Tout sur le rouge. Rouge ! J'ai hurlé si fort que les voisins ont appelé la police.", en: "Everything on red. Red! I screamed so loud the neighbors called the cops." }, fx: { money: 2000, addiction: ['gambling', 25], happy: 12, visual: 'money' }, mood: 'party' },
          { w: 2, text: { fr: "Tout sur le rouge. Noir. J'ai fixé le plafond jusqu'à l'aube.", en: "Everything on red. Black. I stared at the ceiling until dawn." }, fx: { money: -2000, addiction: ['gambling', 25], happy: -15, stress: 10 }, mood: 'cry' },
        ],
      },
      { label: { fr: "Désinstaller l'appli", en: 'Delete the app' }, text: { fr: "J'ai désinstallé l'appli. Elle m'envoie encore des mails : « Tu nous manques. » Mon ex ne m'a jamais écrit ça.", en: "I deleted the app. It still emails me: 'We miss you.' My ex never wrote me that." }, fx: { happy: 2, discipline: 3 } },
    ],
  },

  // ───────────────────────────── near death ─────────────────────────────
  {
    id: 'he_nde',
    icon: '👼',
    cat: 'health',
    rating: 1,
    scene: { place: 'hospital', mood: 'shock', prop: 'light', fx: 'ghost' },
    when: { age: [20, 100] },
    weight: 3,
    once: true,
    text: {
      fr: ["Opération qui tourne mal. Tu flottes au plafond du bloc, au-dessus de ton propre corps. Au bout d'un tunnel lumineux, ta défunte grand-mère te fait signe, en bigoudis.", "Ton cœur s'arrête deux minutes. Tu vois une lumière blanche, un tunnel, puis un guichet avec un ticket : « Numéro 4 853. Veuillez patienter. »"],
      en: ["Surgery goes wrong. You float at the ceiling of the operating room, above your own body. At the end of a glowing tunnel, your late grandmother waves at you, in hair curlers.", "Your heart stops for two minutes. You see a white light, a tunnel, then a counter with a ticket: 'Number 4,853. Please wait.'"],
    },
    choices: [
      {
        label: { fr: 'Aller vers la lumière', en: 'Walk toward the light' },
        out: [
          { w: 3, text: { fr: "J'ai marché vers la lumière. C'était la lampe du chirurgien. Il m'a ramené{|e} à coups de défibrillateur en hurlant « PAS AUJOURD'HUI ! », comme dans une série.", en: "I walked toward the light. It was the surgeon's lamp. He brought me back with the defibrillator, yelling 'NOT TODAY!', like on TV." }, fx: { health: -5, happy: 8, karma: 3, visual: 'ghost' } },
          { w: 1, text: { fr: "Mamie m'a barré la route : « Pas encore. Et en plus, t'as pas fini ton assiette. » Elle m'a renvoyé{|e} d'une claque. Je me suis réveillé{|e} avec la joue rouge et une envie de vivre immense.", en: "Grandma blocked my way: 'Not yet. And you didn't finish your plate.' She sent me back with a slap. I woke up with a red cheek and a huge will to live." }, fx: { happy: 12, stress: -10, visual: 'ghost' }, mood: 'cry' },
        ],
      },
      { label: { fr: 'Négocier avec la Mort', en: 'Bargain with Death' }, text: { fr: "J'ai négocié avec la Mort. Elle accepte de me laisser repartir contre mes codes Netflix. Marché conclu. Je me suis réveillé{|e} en sueur, plus vivant{|e} que jamais.", en: "I bargained with Death. She agreed to let me go in exchange for my Netflix password. Deal. I woke up drenched in sweat, more alive than ever." }, fx: { happy: 8, karma: 2 } },
      { label: { fr: 'Faire demi-tour', en: 'Turn back' }, text: { fr: "J'ai fait demi-tour. Il me reste des gens à aimer, des choses à dire, et une vaisselle à faire. Surtout la vaisselle.", en: "I turned back. I still have people to love, things to say and dishes to do. Mostly the dishes." }, fx: { happy: 10, stress: -8, health: 3 }, mood: 'love' },
    ],
  },

  // ───────────────────────────── absurd deaths (risky) ─────────────────────────────
  {
    id: 'he_gender_reveal',
    icon: '🎈',
    cat: 'accident',
    rating: 2,
    scene: { place: 'park', mood: 'party', prop: 'balloon' },
    when: { age: [20, 70] },
    weight: 4,
    cooldown: 10,
    text: {
      fr: ["Gender reveal chez ton cousin Dylan. Il a remplacé le ballon à confettis par « un petit truc de chantier, juste pour la couleur ». Il y a un détonateur et un fil rose.", "Ton pote veut faire la gender reveal « la plus folle d'Instagram » : une citrouille, un baril, de la fumée bleue ou rose. Il te propose de filmer au premier rang."],
      en: ["Gender reveal at your cousin Dylan's. He swapped the confetti balloon for 'a little construction-site thingy, just for the color'. There's a detonator and a pink wire.", "Your buddy wants to throw 'the craziest gender reveal on Instagram': a pumpkin, a barrel, blue or pink smoke. He wants you to film from the front row."],
    },
    choices: [
      {
        label: { fr: 'Filmer au premier rang', en: 'Film from the front row' },
        out: [
          { w: 3, text: { fr: "BOUM. Fumée rose : c'est une fille ! J'ai perdu un tympan et la moitié de mes cheveux, mais je suis {tonton|tata}.", en: "BOOM. Pink smoke: it's a girl! I lost an eardrum and half my hair, but I'm an {uncle|aunt}." }, fx: { health: -8, looks: -4, happy: 3, visual: 'explosion' }, mood: 'shock' },
          { w: 2, text: { fr: "L'explosion a été captée par les sismographes. Fumée bleue. Le barbecue a atterri chez les voisins avec Dylan accroché dessus. J'ai la vidéo en 4K.", en: "The blast registered on seismographs. Blue smoke. The grill landed in the neighbors' yard with Dylan clinging to it. I have it in 4K." }, fx: { health: -3, followers: 5000, fame: 3, visual: 'explosion' } },
          { w: 1, text: { fr: "Le compte à rebours. Le bouton. Puis plus rien, à part un joli nuage bleu avec des petits bouts de moi dedans.", en: "The countdown. The button. Then nothing but a lovely blue cloud with little bits of me in it." }, fx: { die: { fr: "pulvérisé{|e} à une gender reveal : c'était un garçon, et c'était partout", en: "obliterated at a gender reveal party: it was a boy, and it was everywhere" }, visual: 'explosion' } },
        ],
      },
      { label: { fr: 'Rester très loin', en: 'Stay very far back' }, text: { fr: "Je suis resté{|e} à 200 mètres, derrière un chêne. L'explosion a soufflé les vitres du quartier et la perruque de mamie. C'est un garçon. Dylan a perdu ses sourcils, et la garde de son chien.", en: "I stayed 200 yards back, behind an oak. The blast blew out the neighborhood's windows and Grandma's wig. It's a boy. Dylan lost his eyebrows, and custody of his dog." }, fx: { happy: 5 } },
      { label: { fr: 'Proposer un gâteau', en: 'Suggest a cake instead' }, text: { fr: "J'ai proposé un gâteau rose ou bleu à l'intérieur. Dylan m'a traité{|e} de « boomer ». Le gâteau, lui, n'a blessé personne.", en: "I suggested a cake that's pink or blue inside. Dylan called me a 'boomer'. The cake hurt nobody." }, fx: { karma: 3, happy: 2 } },
    ],
  },
  {
    id: 'he_hippo',
    icon: '🦛',
    cat: 'accident',
    rating: 2,
    scene: { place: 'beach', mood: 'happy', prop: 'kayak' },
    when: { age: [18, 80] },
    weight: 4,
    cooldown: 10,
    text: {
      fr: ["Safari en vacances. Ton guide t'avertit : « Surtout, n'approchez jamais un hippopotame. C'est l'animal le plus dangereux d'ici. » Un hippopotame sort justement de l'eau, l'air tout mignon.", "Balade en kayak pendant tes vacances. Un énorme hippopotame bâille devant toi. On dirait un gros doudou gris. Ta main est déjà sur ton téléphone pour le selfie."],
      en: ["Safari vacation. Your guide warns you: 'Whatever you do, never approach a hippo. It's the deadliest animal around.' A hippo emerges from the water right then, looking adorable.", "Kayaking on vacation. A huge hippo yawns in front of you. It looks like a big grey teddy bear. Your hand is already reaching for your phone for a selfie."],
    },
    choices: [
      {
        label: { fr: "Selfie avec l'hippo", en: 'Selfie with the hippo' },
        out: [
          { w: 2, text: { fr: "Selfie réussi. Puis l'hippo a ouvert la gueule et j'ai vu le fond de son âme. J'ai couru plus vite que jamais. J'ai perdu une tong, et le contrôle de ma vessie.", en: "Selfie nailed. Then the hippo opened its mouth and I saw the bottom of its soul. I ran faster than ever. I lost a flip-flop, and control of my bladder." }, fx: { happy: 4, followers: 2000, fame: 2 }, mood: 'shock' },
          { w: 2, text: { fr: "L'hippo a croqué mon kayak en deux comme un biscuit. J'ai nagé jusqu'à la rive en hurlant, une jambe en sang, l'autre en panique.", en: "The hippo bit my kayak in half like a cookie. I swam to shore screaming, one leg bleeding, the other panicking." }, fx: { health: -12, visual: 'gore' }, mood: 'shock' },
          { w: 1, text: { fr: "L'hippopotame m'a gobé{|e} comme un Tic Tac, a mâché deux fois d'un air pensif, puis a recraché la moitié.", en: "The hippo gulped me down like a Tic Tac, chewed twice thoughtfully, then spat out half." }, fx: { die: { fr: "à moitié dévoré{|e} par un hippopotame pendant un selfie (la photo est floue)", en: 'half-eaten by a hippo during a selfie (the photo is blurry)' }, visual: 'gore' } },
        ],
      },
      { label: { fr: 'Ramer très vite', en: 'Paddle like hell' }, text: { fr: "J'ai ramé comme un moteur hors-bord. L'hippo m'a regardé{|e} partir avec un mépris immense. Je suis vivant{|e}. C'est l'essentiel.", en: "I paddled like an outboard motor. The hippo watched me go with immense contempt. I'm alive. That's what matters." }, fx: { happy: 3, athletic: 2 } },
      { label: { fr: 'Lancer mon sandwich', en: 'Throw my sandwich' }, text: { fr: "J'ai lancé mon sandwich. L'hippopotame l'a ignoré. Un crocodile, lui, l'a beaucoup apprécié. Je ne savais pas qu'il y avait un crocodile.", en: "I threw my sandwich. The hippo ignored it. A crocodile, however, loved it. I didn't know there was a crocodile." }, fx: { stress: 6, happy: 1 } },
    ],
  },
  {
    id: 'he_funeral_grape',
    icon: '🍇',
    cat: 'accident',
    rating: 2,
    scene: { place: 'cemetery', mood: 'sad', prop: 'buffet' },
    when: { age: [16, 95] },
    weight: 4,
    cooldown: 10,
    text: {
      fr: ["Enterrement d'un vieil oncle. Au buffet, entre deux condoléances, ton cousin te défie de rattraper avec la bouche des grains de raisin lancés depuis l'autre bout de la salle.", "Pot après les obsèques de tonton Gilbert. L'ambiance est lourde. Il y a une grappe de raisin et un cousin qui s'ennuie à mourir."],
      en: ["An old uncle's funeral. At the buffet, between condolences, your cousin dares you to catch grapes in your mouth, thrown from across the room.", "Reception after Uncle Gilbert's funeral. The mood is heavy. There's a bunch of grapes and a cousin who's bored to death."],
    },
    choices: [
      {
        label: { fr: 'Relever le défi', en: 'Accept the dare' },
        out: [
          { w: 3, text: { fr: "J'en ai attrapé onze d'affilée. La salle a applaudi, la veuve aussi. Tonton Gilbert aurait adoré. Peut-être.", en: "I caught eleven in a row. The room applauded, the widow too. Uncle Gilbert would have loved it. Maybe." }, fx: { happy: 8, fame: 1 }, mood: 'proud' },
          { w: 2, text: { fr: "Un grain m'est rentré dans le nez. J'ai éternué de la purée de raisin sur le cercueil. Le curé a fait semblant de ne rien voir.", en: "A grape went up my nose. I sneezed grape purée all over the coffin. The priest pretended not to see." }, fx: { happy: -4, karma: -2 } },
          { w: 1, text: { fr: "Le quatrième grain est parti tout droit dans la trachée. J'ai viré au violet, assorti au raisin, et je me suis effondré{|e} dans le cake salé.", en: "The fourth grape went straight down my windpipe. I turned purple, matching the grape, and collapsed face-first into the quiche." }, fx: { die: { fr: "étouffé{|e} par un grain de raisin à un enterrement, ce qui a fait gagner un déplacement à tout le monde", en: 'choking on a grape at a funeral, which saved everyone a second trip' }, visual: 'ghost' } },
        ],
      },
      { label: { fr: 'Manger dignement', en: 'Eat with dignity' }, text: { fr: "J'ai mangé mes raisins un par un, avec gravité, et réconforté la veuve. Sur un coup de tête, elle m'a offert la cravate de Gilbert.", en: "I ate my grapes one by one, gravely, and comforted the widow. On a whim, she gave me Gilbert's tie." }, fx: { karma: 4, happy: 2 } },
      { label: { fr: 'Dénoncer le cousin', en: 'Snitch on the cousin' }, text: { fr: "J'ai dénoncé mon cousin à sa mère. Elle lui a collé une claque devant le cercueil. Le seul moment de joie de la journée.", en: "I snitched on my cousin to his mother. She slapped him right in front of the coffin. The only joyful moment of the day." }, fx: { happy: 5, karma: -1 } },
    ],
  },
  {
    id: 'he_vending',
    icon: '🥫',
    cat: 'accident',
    rating: 2,
    scene: { place: 'office', mood: 'angry', prop: 'vending' },
    when: { age: [14, 85] },
    weight: 5,
    cooldown: 8,
    text: {
      fr: ["Le distributeur a avalé ta pièce et ton paquet de chips est resté accroché à la spirale, suspendu au-dessus du vide. Il te nargue.", "La machine à snacks vient de manger ton dernier billet. Ton Twix pendouille, à un millimètre de la liberté."],
      en: ["The vending machine ate your coin and your bag of chips is stuck on the coil, dangling over the void. It's taunting you.", "The snack machine just ate your last bill. Your Twix is dangling, one millimeter from freedom."],
    },
    choices: [
      {
        label: { fr: 'Secouer la machine', en: 'Shake the machine' },
        out: [
          { w: 3, text: { fr: "J'ai secoué comme un forcené. Les chips sont tombées, plus trois Twix en bonus. Je suis un dieu.", en: "I shook it like a maniac. The chips dropped, plus three bonus Twix. I am a god." }, fx: { happy: 6 }, mood: 'proud' },
          { w: 2, text: { fr: "La machine a basculé et m'a coincé la jambe. Les pompiers m'ont désincarcéré{|e} au pied de biche. J'ai gardé les chips.", en: "The machine tipped and pinned my leg. Firefighters pried me out with a crowbar. I kept the chips." }, fx: { disease: 'sprain', health: -10 }, mood: 'shock' },
          { w: 1, text: { fr: "La machine a basculé sur moi avec un bruit de frigo qui dévale un escalier. On m'a retrouvé{|e} plat{|e} comme une crêpe, un Twix à la main.", en: "The machine toppled onto me with the sound of a fridge falling down a staircase. They found me flat as a pancake, Twix in hand." }, fx: { die: { fr: "aplati{|e} sous un distributeur pour un paquet de chips à 1,20 €", en: 'flattened under a vending machine over a $1.50 bag of chips' }, visual: 'gore' } },
        ],
      },
      { label: { fr: 'Un grand coup de pied', en: 'Kick it hard' }, text: { fr: "J'ai mis un grand coup de pied dans la machine. Les chips n'ont pas bougé. Mon gros orteil, si : il a pris une direction nouvelle.", en: "I kicked the machine hard. The chips didn't budge. My big toe did: it now points somewhere new." }, fx: { disease: 'sprain', health: -4, happy: -4 } },
      { label: { fr: 'Laisser tomber', en: 'Walk away' }, text: { fr: "Je suis parti{|e}. Cinq minutes plus tard, un collègue a fait tomber mes chips d'une pichenette sur la vitre. Il les a mangées devant moi.", en: "I walked away. Five minutes later, a coworker knocked my chips loose with a flick on the glass. He ate them in front of me." }, fx: { happy: -3 } },
    ],
  },
  {
    id: 'he_bath_toaster',
    icon: '🍞',
    cat: 'accident',
    rating: 2,
    scene: { place: 'home', mood: 'sleepy', prop: 'bathtub' },
    when: { age: [18, 90] },
    weight: 3,
    cooldown: 10,
    text: {
      fr: ["Bain moussant, bougies, playlist zen. Tout est parfait, sauf que tu as une envie énorme de tartines grillées et la flemme absolue de sortir de l'eau.", "Tu te prélasses dans ton bain quand une idée de génie te traverse : et si tu installais le grille-pain sur le rebord ? Une rallonge suffirait."],
      en: ["Bubble bath, candles, chill playlist. Everything's perfect, except you're craving toast and you absolutely can't be bothered to get out.", "You're lounging in the tub when a stroke of genius hits: what if you put the toaster on the edge of the tub? An extension cord would do it."],
    },
    choices: [
      {
        label: { fr: 'Grille-pain sur la baignoire', en: 'Toaster on the tub' },
        out: [
          { w: 2, text: { fr: "Le grille-pain est tombé dans l'eau. Le disjoncteur a sauté juste avant moi. Mes cheveux sont restés dressés trois jours et j'ai une tartine cramée collée au front.", en: "The toaster fell in the water. The breaker tripped just before I did. My hair stood on end for three days and there's a charred slice of toast stuck to my forehead." }, fx: { disease: 'burns', health: -6, looks: -3, happy: -5, visual: 'fire' }, mood: 'shock' },
          { w: 2, text: { fr: "J'ai mangé des tartines dans mon bain. C'était sublime. Je n'ai rien appris de cette expérience.", en: "I ate toast in the bath. It was sublime. I learned nothing from this experience." }, fx: { happy: 8 }, mood: 'happy' },
          { w: 1, text: { fr: "J'ai posé le grille-pain sur le rebord, branché la rallonge et je me suis retourné{|e} pour attraper la confiture. Le chat a sauté sur le rebord.", en: "I set the toaster on the edge, plugged in the extension cord and turned around to grab the jam. The cat jumped onto the edge." }, fx: { die: { fr: "électrocuté{|e} dans mon bain par un grille-pain, poussé par mon propre chat", en: 'electrocuted in my bath by a toaster my own cat pushed in' }, visual: 'explosion' } },
        ],
      },
      { label: { fr: 'Sortir faire les tartines', en: 'Get out and make toast' }, text: { fr: "Je suis sorti{|e} de l'eau et j'ai traversé l'appart tout{|e} nu{|e}, dégoulinant{|e}, devant la fenêtre. La voisine d'en face a applaudi.", en: "I got out and crossed the apartment stark naked and dripping, right past the window. The neighbor across the street applauded." }, fx: { happy: 3 } },
      { label: { fr: 'Commander en livraison', en: 'Order delivery' }, text: { fr: "J'ai commandé des tartines grillées en livraison. Le livreur les a montées jusqu'à la salle de bain. On n'en reparlera jamais.", en: "I ordered toast for delivery. The courier brought it all the way to the bathroom. We will never speak of this." }, fx: { money: -15, happy: 4 } },
    ],
  },

  // ───────────────────────────── feed-only (auto) ─────────────────────────────
  {
    id: 'he_auto_hypo',
    icon: '🌡️',
    cat: 'health',
    rating: 0,
    auto: true,
    scene: { place: 'home', mood: 'shock', prop: 'thermometer' },
    when: { age: [16, 95], flag: 'he_hypochondriac' },
    weight: 8,
    cooldown: 3,
    text: {
      fr: ["J'étais persuadé{|e} d'avoir la lèpre. C'était du fromage râpé collé sur mon bras.", "Cette année, j'ai cru faire une crise cardiaque, un AVC et une maladie tropicale inconnue. C'était des gaz, à chaque fois."],
      en: ["I was convinced I had leprosy. It was grated cheese stuck to my arm.", "This year I thought I had a heart attack, a stroke and an unknown tropical disease. It was gas, every single time."],
    },
    fx: { stress: 4, happy: -1 },
  },
  {
    id: 'he_auto_hangover',
    icon: '🤕',
    cat: 'vice',
    rating: 1,
    auto: true,
    scene: { place: 'home', mood: 'sick', prop: 'toilet' },
    when: { age: [18, 90], addiction: 'alcohol' },
    weight: 8,
    cooldown: 2,
    text: {
      fr: ["Gueule de bois du dimanche : j'ai juré à la cuvette des toilettes que je ne recommencerais plus. On se voit toutes les semaines, la cuvette et moi.", "Je me suis réveillé{|e} avec une haleine capable de décaper un bateau et un mal de crâne en Dolby Surround."],
      en: ["Sunday hangover: I swore to the toilet bowl I'd never do it again. The toilet and I see each other every week.", "I woke up with breath that could strip paint off a boat and a headache in Dolby Surround."],
    },
    fx: { health: -3, happy: -2 },
  },
  {
    id: 'he_auto_toenail',
    icon: '🦶',
    cat: 'health',
    rating: 2,
    auto: true,
    scene: { place: 'home', mood: 'shock', prop: 'sock' },
    when: { age: [25, 95] },
    weight: 5,
    cooldown: 8,
    text: {
      fr: ["Mon ongle de pied s'est détaché tout seul dans ma chaussette. Je l'ai retrouvé le soir, comme une chips jaune. Je l'ai gardé. Je ne sais pas pourquoi.", "J'ai percé un bouton dans mon dos devant le miroir. Le jet a touché le miroir. Le miroir ne s'en est jamais remis."],
      en: ["My toenail came off on its own inside my sock. I found it that evening, like a yellow potato chip. I kept it. I don't know why.", "I popped a zit on my back in front of the mirror. The jet hit the mirror. The mirror never recovered."],
    },
    fx: { happy: -2, visual: 'gore' },
  },
  {
    id: 'he_auto_back',
    icon: '🧦',
    cat: 'health',
    rating: 0,
    auto: true,
    scene: { place: 'home', mood: 'sad', prop: 'sock' },
    when: { age: [35, 100] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: ["Je me suis bloqué le dos en ramassant une chaussette. Une chaussette. Même pas sale.", "J'ai éternué trop fort et je me suis froissé un muscle du cou. Je regarde vers la gauche depuis trois semaines.", "Je me suis tordu {w:bodypart} en essayant de {w:activity}. Le médecin a soupiré : « À votre âge… » Dans ma tête, j'ai toujours 22 ans.", "Je me suis levé{|e} du canapé et mon dos a fait {w:sound}. Toute la famille s'est retournée. Le chat a quitté la pièce.", "J'ai acheté une ceinture lombaire [[chauffante|connectée|vue à la télé]] {w:at_place}. Je la porte même pour dormir. Je ressemble à un catcheur à la retraite."],
      en: ["I threw out my back picking up a sock. A sock. Not even a dirty one.", "I sneezed too hard and pulled a neck muscle. I've been looking to the left for three weeks.", "I twisted my {w:bodypart} while {w:activity}. The doctor sighed: 'At your age…' In my head, I'm still 22.", "I got up from the couch and my back made {w:sound}. The whole family turned around. The cat left the room.", "I bought a [[heated|smart|as-seen-on-TV]] back brace {w:at_place}. I even sleep in it. I look like a retired wrestler."],
    },
    fx: { health: -3, happy: -2 },
  },
  {
    id: 'he_auto_fart',
    icon: '💨',
    cat: 'health',
    rating: 2,
    auto: true,
    scene: { place: 'party', mood: 'shock', prop: 'chair' },
    when: { age: [14, 95] },
    weight: 5,
    cooldown: 8,
    text: {
      fr: ["J'ai tenté un pet discret au cinéma. Ce n'était pas un pet. J'ai regardé la fin du film sans bouger, en apnée.", "Au restaurant, j'ai tenté de lâcher une caisse silencieuse. Elle était silencieuse. Elle n'était pas sèche."],
      en: ["I tried a discreet fart at the movies. It was not a fart. I watched the rest of the film without moving, holding my breath.", "At a restaurant, I tried to let out a silent one. It was silent. It was not dry."],
    },
    fx: { happy: -4, visual: 'poop' },
  },
  {
    id: 'he_auto_gym',
    icon: '🏃',
    cat: 'body',
    rating: 0,
    auto: true,
    scene: { place: 'stadium', mood: 'sad', prop: 'card' },
    when: { age: [18, 80] },
    weight: 7,
    cooldown: 5,
    text: {
      fr: ["J'ai payé un abonnement à la salle toute l'année. J'y suis allé{|e} une fois, pour demander où étaient les toilettes.", "J'ai pris l'abonnement premium de la salle « pour me motiver ». Ma seule séance de l'année m'a coûté environ 360 balles.", "Je me suis inscrit{|e} à la salle en janvier. En février, j'ai découvert que je préférais {w:activity}. En mars, la salle m'envoyait des cartes « prompt rétablissement ».", "Le coach de la salle m'a demandé mon modèle. J'ai répondu « {w:celeb} ». Il a regardé mon ventre et proposé de viser [[2040|une autre vie|quelque chose de plus réaliste]].", "Ma seule séance de sport de l'année : courir après {w:vehicle} [[sous la pluie|en tongs|avec un sac de courses]]. Raté. Courbatures jusqu'en août."],
      en: ["I paid for a gym membership all year. I went once, to ask where the restroom was.", "I got the premium gym plan 'for motivation'. My one workout of the year cost me about 360 bucks.", "I signed up for the gym in January. By February, I'd discovered I preferred {w:activity}. By March, the gym was sending me get-well cards.", "The gym coach asked who my role model was. I said '{w:celeb}'. He looked at my belly and suggested aiming for [[2040|a next life|something more realistic]].", "My only workout of the year: chasing {w:vehicle} [[in the rain|in flip-flops|with a bag of groceries]]. Missed it. Sore until August."],
    },
    fx: { money: -360, happy: -1 },
  },
];
