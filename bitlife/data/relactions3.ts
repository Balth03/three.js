// More interactions (batch 3): wholesome, money, family milestones and some trash.
import type { RelActionDef } from '@bl/sim';
import { npcAge } from '@bl/sim';

const HUMANS = ['mother', 'father', 'sibling', 'grandparent', 'friend', 'bestfriend', 'classmate', 'coworker', 'boss', 'partner', 'fiance', 'spouse', 'child', 'ex', 'enemy'] as const;
const CLOSE = ['mother', 'father', 'sibling', 'grandparent', 'friend', 'bestfriend', 'partner', 'fiance', 'spouse', 'child'] as const;
const attractedTo = (n: { gender: string }, life: { gender: string; orientation: string }) =>
  life.orientation === 'bi' || (life.orientation === 'gay' ? n.gender === life.gender : n.gender !== life.gender);

export const relActions3: RelActionDef[] = [
  {
    id: 'advice', icon: '🦉', label: { fr: 'Demander conseil', en: 'Ask for advice' }, roles: [...CLOSE, 'boss', 'coworker'], notRoles: ['child'], minAge: 6, limit: 1, prisonOk: true,
    out: [
      { w: 3, odds: { smarts: 0.3 }, text: { fr: ["J'ai demandé conseil à {a.first}. {a:Il|Elle} m'a dit « fais ce qui te rend {heureux|heureuse} ». C'est vague, mais ça m'a fait du bien.", "{a.first} m'a donné un conseil plein de bon sens. Je déteste quand {a:il|elle} a raison."], en: ['I asked {a.first} for advice. {a:He|She} said "do what makes you happy". Vague, but it helped.', '{a.first} gave me really sensible advice. I hate it when {a:he|she} is right.'] }, fx: { rel: 6, smarts: 1, stress: -4 } },
      { w: 2, text: { fr: ["Le conseil de {a.first} : « Dans la vie, il faut toujours avoir un sandwich sur soi. » Je ne sais pas quoi en faire, mais je le note.", "{a.first} a répondu à ma question existentielle par une anecdote de vingt minutes sur sa chaudière."], en: ['{a.first}\'s advice: "Always carry a sandwich in life." I don\'t know what to do with that, but I\'m writing it down.', '{a.first} answered my existential question with a twenty-minute story about their boiler.'] }, fx: { rel: 3 } },
      { w: 1, text: { fr: "J'ai suivi le conseil de {a.first} à la lettre. Catastrophe totale. {a:Il|Elle} dit que je l'ai « mal appliqué ».", en: 'I followed {a.first}\'s advice to the letter. Total disaster. {a:He|She} says I "applied it wrong".' }, fx: { rel: -3, happy: -3 } },
    ],
  },
  {
    id: 'movie_with', icon: '🍿', label: { fr: 'Aller au cinéma ensemble', en: 'Go to a movie' }, roles: [...HUMANS], notRoles: ['enemy'], minAge: 6, limit: 1, cost: 15,
    out: [
      { w: 4, text: { fr: ["Ciné avec {a.first}. On a partagé un seau de pop-corn géant et une crise de fou rire pendant la scène triste.", "J'ai vu un film d'horreur avec {a.first}. {a:Il|Elle} a crié plus fort que moi. Je garderai ce secret… ou pas."], en: ['Movies with {a.first}. We shared a giant popcorn bucket and a giggle fit during the sad scene.', 'Watched a horror movie with {a.first}. {a:He|She} screamed louder than me. I\'ll keep that secret… or not.'] }, fx: { rel: 7, happy: 4 }, mood: 'happy' },
      { w: 1, text: { fr: "{a.first} a commenté tout le film à voix haute et deviné la fin au bout de dix minutes. Je l'ai haï{a:|e} un peu.", en: '{a.first} narrated the entire movie out loud and guessed the ending ten minutes in. I hated {a.him} a little.' }, fx: { rel: -2, happy: -1 } },
      { w: 0.6, text: { fr: "On s'est trompés de salle. On a vu un film d'auteur polonais de quatre heures, en noir et blanc, sur un radiateur. {a.first} a adoré. Je m'inquiète.", en: 'Wrong screen. We sat through a four-hour black-and-white Polish art film about a radiator. {a.first} loved it. I\'m worried.' }, fx: { rel: 2, happy: 2 }, mood: 'shock' },
      { w: 0.4, rating: 2, text: { fr: "Le type derrière nous a vomi son nacho-fromage sur la tête de {a.first} pendant une scène d'action. Le son Dolby a couvert le « splotch ». Pas l'odeur.", en: 'The guy behind us puked his cheese nachos onto {a.first}\'s head during an action scene. Dolby covered the "splotch". Not the smell.' }, fx: { rel: 1, happy: -3, visual: 'poop' }, mood: 'sick' },
    ],
  },
  {
    id: 'gaming_with', icon: '🎮', label: { fr: 'Jouer aux jeux vidéo ensemble', en: 'Play video games together' }, roles: ['friend', 'bestfriend', 'sibling', 'child', 'partner', 'fiance', 'spouse', 'classmate', 'coworker', 'mother', 'father'], minAge: 5, limit: 2,
    when: { era: [1985, 3000] }, targetIf: (n, life) => npcAge(n, life.year) >= 5,
    out: [
      { w: 4, text: { fr: ["Soirée Mario Kart avec {a.first}. Carapace bleue au dernier virage. Notre amitié a survécu de justesse.", "J'ai fait une partie en coop avec {a.first}. On a sauvé le monde et commandé trois pizzas."], en: ['Mario Kart night with {a.first}. Blue shell on the last turn. Our friendship barely survived.', 'Played co-op with {a.first}. We saved the world and ordered three pizzas.'] }, fx: { rel: 8, happy: 5 }, mood: 'happy' },
      { w: 1, text: { fr: "{a.first} m'a éclaté{|e} 14 fois de suite et a fait une danse de la victoire à chaque fois. J'ai débranché la console « par accident ».", en: '{a.first} crushed me 14 times in a row with a victory dance each time. I "accidentally" unplugged the console.' }, fx: { rel: -3, happy: -3 }, mood: 'angry' },
      { w: 0.5, rating: 1, text: { fr: "Rage quit : j'ai lancé la manette. Elle a traversé l'écran plat. {a.first} a filmé et posté la vidéo.", en: 'Rage quit: I threw the controller. It went through the flat screen. {a.first} filmed it and posted it.' }, fx: { rel: 2, happy: -4, money: -400, followers: 500 } },
    ],
  },
  {
    id: 'cook_for', icon: '🍲', label: { fr: 'Cuisiner un dîner', en: 'Cook dinner for' }, roles: [...CLOSE, 'ex', 'coworker'], minAge: 12, limit: 1, cost: 25,
    out: [
      { w: 3, text: { fr: ["J'ai cuisiné un bœuf bourguignon pour {a.first}. {a:Il|Elle} a repris trois fois et saucé avec les doigts.", "Dîner maison pour {a.first} : lasagnes, chandelles, et pas un seul détecteur de fumée déclenché. Exploit."], en: ['I made beef bourguignon for {a.first}. {a:He|She} had thirds and mopped the sauce with their fingers.', 'Home dinner for {a.first}: lasagna, candles, and not a single smoke alarm. A feat.'] }, fx: { rel: 10, happy: 4 }, mood: 'love', },
      { w: 2, text: { fr: "{a.first} a mâché mon poulet pendant quatre minutes en souriant héroïquement. Puis {a:il|elle} a « reçu un appel urgent ».", en: '{a.first} chewed my chicken for four minutes, smiling heroically. Then {a:he|she} "got an urgent call".' }, fx: { rel: 2, happy: -2 } },
      { w: 1, text: { fr: "J'ai cramé le dîner. On a fini au McDo. {a.first} a dit que c'était le meilleur dîner de l'année. Je ne sais pas comment le prendre.", en: 'I burned dinner. We ended up at McDonald\'s. {a.first} said it was the best dinner of the year. Not sure how to take that.' }, fx: { rel: 5, visual: 'fire' } },
      { w: 0.5, rating: 2, text: { fr: "Mes fruits de mer « encore bons » ne l'étaient pas. {a.first} a vomi dans l'évier, puis dans la baignoire, puis dans mes chaussons. Il a fallu choisir entre les deux bouts.", en: 'My "still good" seafood was not. {a.first} puked in the sink, then the tub, then my slippers. Had to choose which end to aim.' }, fx: { rel: -8, visual: 'poop', fn: ({ actor }) => { if (actor) actor.health = Math.max(0, actor.health - 8); } }, mood: 'sick' },
    ],
  },
  {
    id: 'trip_with', icon: '✈️', label: { fr: 'Partir en voyage ensemble', en: 'Take on a trip' }, roles: [...CLOSE], minAge: 18, limit: 1, cost: 1500,
    out: [
      { w: 4, text: { fr: ["Une semaine à Lisbonne avec {a.first}. Pastéis de nata, coups de soleil et fous rires dans le tram 28.", "Road trip avec {a.first}. On a chanté faux pendant 2 000 km. Plus forts que jamais."], en: ['A week in Lisbon with {a.first}. Custard tarts, sunburns and giggles on tram 28.', 'Road trip with {a.first}. Sang off-key for 1,200 miles. Closer than ever.'] }, fx: { rel: 15, happy: 10, stress: -8 }, mood: 'happy' },
      { w: 1, text: { fr: "On a découvert en vacances que {a.first} se lève à 6 h pour « optimiser la journée ». Je ne l'ai pas tué{a:|e}. J'en suis {fier|fière}.", en: 'On holiday I discovered {a.first} wakes up at 6am to "optimise the day". I didn\'t kill {a.him}. I\'m proud.' }, fx: { rel: -5, stress: 5 } },
      { w: 1, text: { fr: "La compagnie a perdu nos valises. On a passé la semaine dans les mêmes fringues, achetées à l'aéroport : t-shirts « I ❤ Benidorm ».", en: 'The airline lost our bags. We spent the week in the same airport-bought clothes: "I ❤ Benidorm" t-shirts.' }, fx: { rel: 6, happy: 2 } },
      { w: 0.5, rating: 2, text: { fr: "Turista carabinée pour {a.first} pendant le vol retour. Toilettes occupées. Il y a eu… un incident au rang 23. On a été escortés à la sortie par des agents en combinaison.", en: 'Brutal traveller\'s diarrhea for {a.first} on the flight home. Toilet occupied. There was… an incident in row 23. Agents in hazmat suits escorted us off.' }, fx: { rel: 4, happy: -4, visual: 'poop' }, mood: 'shock' },
    ],
  },
  {
    id: 'borrow', icon: '🤲', label: { fr: 'Emprunter de l\'argent', en: 'Borrow money' }, roles: ['friend', 'bestfriend', 'sibling', 'partner', 'fiance', 'spouse', 'coworker', 'ex'], minAge: 16, limit: 1, prisonOk: true,
    targetIf: (n) => n.rel >= 30,
    out: [
      { w: 3, odds: { happy: 0.3 }, text: { fr: "{a.first} m'a prêté de l'argent en disant « rends-le quand tu peux ». Ça sonne gentil, mais je sens que ça va revenir à chaque dîner.", en: '{a.first} lent me money, saying "pay me back whenever". Sounds nice, but I can tell it\'ll come up at every dinner.' }, fx: { money: 500, rel: -3, actorFlag: 'lent_me' } },
      { w: 2, text: { fr: ["{a.first} a soudainement « oublié son portefeuille ». Chez {a:lui|elle}. Dans sa propre maison.", "{a.first} a refusé et m'a envoyé un lien vers une vidéo sur la gestion budgétaire."], en: ['{a.first} suddenly "forgot their wallet". At home. In their own house.', '{a.first} refused and sent me a link to a budgeting video.'] }, fx: { rel: -5, happy: -3 } },
      { w: 0.6, rating: 1, text: { fr: "{a.first} a accepté avec un taux d'intérêt de 40 % et un contrat signé au feutre sur une serviette. Mafieux, mais efficace.", en: '{a.first} agreed at 40% interest with a contract signed in marker on a napkin. Mafia vibes, but effective.' }, fx: { money: 500, rel: -6, actorFlag: 'lent_me' } },
    ],
  },
  {
    id: 'lend', icon: '💸', label: { fr: 'Prêter de l\'argent', en: 'Lend money' }, roles: [...CLOSE, 'coworker', 'ex'], minAge: 16, limit: 1, cost: 500,
    out: [
      { w: 2, text: { fr: "J'ai prêté de l'argent à {a.first}. {a:Il|Elle} m'a tout rendu, avec une boîte de chocolats en intérêts. Une perle.", en: 'I lent {a.first} money. {a:He|She} paid it all back, plus a box of chocolates as interest. A gem.' }, fx: { money: 550, rel: 10, karma: 3 }, mood: 'happy' },
      { w: 2, text: { fr: ["J'ai prêté de l'argent à {a.first}. Depuis, {a:il|elle} change de trottoir quand {a:il|elle} me voit.", "{a.first} m'a promis de me rembourser « le mois prochain ». Ça fait trois ans de mois prochains."], en: ['I lent {a.first} money. Now {a:he|she} crosses the street when {a:he|she} sees me.', '{a.first} promised to pay me back "next month". It\'s been three years of next months.'] }, fx: { rel: -6, happy: -4, karma: 2 } },
      { w: 1, text: { fr: "{a.first} était si reconnaissant{a:|e} qu'{a:il|elle} a pleuré. J'ai fait une bonne action. Mon banquier, lui, pleure aussi.", en: '{a.first} was so grateful {a:he|she} cried. Good deed done. My banker is crying too.' }, fx: { rel: 15, karma: 5 }, mood: 'love' },
      { w: 0.5, rating: 2, text: { fr: "J'ai appris que {a.first} avait claqué mon prêt dans une poupée gonflable sur mesure et un aquarium à piranhas. J'ai vu les photos. Je ne dormirai plus.", en: 'Turns out {a.first} blew my loan on a custom blow-up doll and a piranha tank. I\'ve seen the photos. I\'ll never sleep again.' }, fx: { rel: -12, happy: -5 }, mood: 'shock' },
    ],
  },
  {
    id: 'gossip', icon: '🤫', label: { fr: 'Commérer', en: 'Gossip' }, roles: ['mother', 'sibling', 'grandparent', 'friend', 'bestfriend', 'classmate', 'coworker', 'partner', 'fiance', 'spouse'], minAge: 8, limit: 1, prisonOk: true,
    out: [
      { w: 4, text: { fr: ["J'ai cancané avec {a.first} sur [[le voisin du dessus|la collègue aux 40 pauses clope|le cousin qui « fait de la crypto »|le prof de sport]]. Délicieux. Toxique. Délicieux.", "{a.first} m'a révélé qui vole les yaourts dans le frigo commun. J'ai dû m'asseoir."], en: ['Gossiped with {a.first} about [[the upstairs neighbour|the coworker who takes 40 smoke breaks|the cousin who "does crypto"|the gym teacher]]. Delicious. Toxic. Delicious.', '{a.first} told me who\'s been stealing yogurts from the shared fridge. I had to sit down.'] }, fx: { rel: 7, happy: 4, karma: -1 }, mood: 'happy' },
      { w: 1, text: { fr: "La personne dont on parlait était juste derrière nous. Depuis le début. Elle a commandé un café et s'est assise à notre table.", en: 'The person we were talking about was right behind us. The whole time. They ordered a coffee and sat down at our table.' }, fx: { rel: 3, happy: -5, karma: -2 }, mood: 'shock' },
      { w: 1, text: { fr: "{a.first} a répété tout ce que j'ai dit, en pire, avec mon nom dessus. J'ai été trahi{|e} par ma propre source.", en: '{a.first} repeated everything I said, worse, with my name on it. Betrayed by my own source.' }, fx: { rel: -8, happy: -4 }, mood: 'angry' },
    ],
  },
  {
    id: 'meet_parents', icon: '👪', label: { fr: 'Présenter à mes parents', en: 'Introduce to your parents' }, roles: ['partner', 'fiance'], minAge: 14, limit: 1,
    when: { has: 'parent' },
    out: [
      { w: 3, odds: { looks: 0.3 }, text: { fr: ["J'ai présenté {a.first} à mes parents. Ma mère l'adore déjà. Plus que moi, ce qui est inquiétant.", "Repas chez mes parents avec {a.first}. Mon père a validé d'un hochement de tête. C'est son plus grand compliment depuis 1994."], en: ['I introduced {a.first} to my parents. Mom already loves {a.him}. More than me, which is worrying.', 'Dinner at my parents\' with {a.first}. Dad approved with a nod. His biggest compliment since 1994.'] }, fx: { rel: 10, happy: 6 }, mood: 'love' },
      { w: 2, text: { fr: "Ma mère a sorti l'album photo. {a.first} a vu ma photo en couche-culotte et ma coupe au bol de 6e. Notre couple ne sera plus jamais le même.", en: 'Mom brought out the photo album. {a.first} saw my diaper photos and my 6th-grade bowl cut. We\'ll never be the same.' }, fx: { rel: 4, happy: -3 } },
      { w: 1, text: { fr: "Mon père a interrogé {a.first} sur ses revenus, ses intentions et son groupe sanguin. Puis il a nettoyé son fusil de chasse à table.", en: 'Dad grilled {a.first} about income, intentions and blood type. Then he cleaned his hunting rifle at the table.' }, fx: { rel: -4, stress: 6 }, mood: 'shock' },
      { w: 0.5, rating: 2, text: { fr: "Papy a lâché un pet monumental au dessert et accusé {a.first}. Toute la famille a fait semblant d'y croire. {a.first} est reparti{a:|e} avec la honte et un tupperware de restes.", en: 'Grandpa let out a monumental fart at dessert and blamed {a.first}. The whole family pretended to believe him. {a.first} left with the shame and a tub of leftovers.' }, fx: { rel: -6, happy: 3, visual: 'poop' } },
    ],
  },
  {
    id: 'surprise_party', icon: '🎉', label: { fr: 'Organiser une fête surprise', en: 'Plan a surprise party' }, roles: [...CLOSE], minAge: 10, limit: 1, cost: 300,
    out: [
      { w: 3, text: { fr: ["SURPRIIISE ! {a.first} a hurlé, ri, puis pleuré. Trente personnes, un gâteau géant et des ballons partout. Mission accomplie.", "Fête surprise réussie pour {a.first}. {a:Il|Elle} a fait semblant d'être surpris{a:|e}. Je fais semblant de le croire."], en: ['SURPRIIISE! {a.first} screamed, laughed, then cried. Thirty people, a giant cake, balloons everywhere. Mission accomplished.', 'Successful surprise party for {a.first}. {a:He|She} pretended to be surprised. I pretend to believe it.'] }, fx: { rel: 15, happy: 6, visual: 'confetti' }, mood: 'party' },
      { w: 1, text: { fr: "{a.first} n'est jamais venu{a:|e}. On a attendu trois heures dans le noir. Les invités ont mangé le gâteau et sont partis.", en: '{a.first} never showed up. We waited three hours in the dark. The guests ate the cake and left.' }, fx: { happy: -6, rel: -2 }, mood: 'sad' },
      { w: 1, text: { fr: "Quelqu'un a vendu la mèche dans le groupe WhatsApp. Le groupe WhatsApp incluait {a.first}.", en: 'Someone spoiled it in the group chat. The group chat included {a.first}.' }, fx: { rel: 6, happy: -2 } },
      { w: 0.4, rating: 2, text: { fr: "« SURPRISE ! » {a.first} a eu une telle frayeur qu'{a:il|elle} a fait dans son pantalon, puis un malaise sur le gâteau. Les bougies ont mis le feu à ses cheveux. Meilleure fête de l'année quand même.", en: '"SURPRISE!" {a.first} got so scared {a:he|she} soiled {a.his} pants, then fainted face-first into the cake. The candles set {a.his} hair on fire. Still the party of the year.' }, fx: { rel: -5, happy: 4, visual: 'fire', fn: ({ actor }) => { if (actor) actor.health = Math.max(0, actor.health - 15); } }, mood: 'shock' },
    ],
  },
  {
    id: 'teach_drive', icon: '🚗', label: { fr: 'Apprendre à conduire', en: 'Teach to drive' }, roles: ['child'], minAge: 30, targetMinAge: 15, limit: 1,
    targetIf: (n, life) => npcAge(n, life.year) >= 14 && npcAge(n, life.year) <= 25 && !n.flags.can_drive,
    out: [
      { w: 3, text: { fr: "J'ai appris à conduire à {a.first}. Je n'ai crié que onze fois. {a:Il|Elle} maîtrise le créneau, moi, les tranquillisants.", en: 'I taught {a.first} to drive. Only yelled eleven times. {a:He|She} has mastered parallel parking, I have mastered sedatives.' }, fx: { rel: 10, stress: 8, actorFlag: 'can_drive' }, mood: 'proud' },
      { w: 2, text: { fr: "{a.first} a confondu frein et accélérateur. On a emporté une boîte aux lettres, un nain de jardin et la dignité du voisin.", en: '{a.first} mixed up brake and gas. We took out a mailbox, a garden gnome and the neighbour\'s dignity.' }, fx: { rel: 3, money: -800, stress: 10 }, mood: 'shock' },
      { w: 1, rating: 1, text: { fr: "{a.first} m'a traité{|e} de « vieux con » au troisième rond-point. Je l'ai fait descendre. Il pleuvait. On ne se parle plus jusqu'à Noël.", en: '{a.first} called me an "old fart" at the third roundabout. I made {a.him} get out. It was raining. We\'re not speaking until Christmas.' }, fx: { rel: -10, happy: -3 }, mood: 'angry' },
      { w: 0.5, rating: 2, text: { fr: "Je suis sorti{|e} guider la marche arrière. {a.first} m'a roulé sur le pied. Mon orteil a éclaté comme un raisin trop mûr. {a:Il|Elle} a eu son permis du premier coup, lui, l'orteil non.", en: 'I got out to guide the reversing. {a.first} ran over my foot. My toe burst like an overripe grape. {a:He|She} passed the test first try. The toe did not.' }, fx: { rel: 2, health: -10, visual: 'gore', actorFlag: 'can_drive' }, mood: 'cry' },
    ],
  },
  {
    id: 'sext', icon: '🍆', rating: 2, label: { fr: 'Envoyer un sexto', en: 'Sext' }, roles: ['partner', 'fiance', 'spouse', 'ex', 'friend', 'bestfriend', 'coworker'], minAge: 18, limit: 1, prisonOk: true,
    when: { age: [18, 120] }, targetIf: (n, life) => life.year - n.birthYear >= 18 && attractedTo(n, life),
    out: [
      { w: 3, odds: { looks: 0.5 }, text: { fr: ["J'ai envoyé à {a.first} une photo « artistique » sous un éclairage flatteur et un angle très étudié. Réponse : trois émojis flamme et un « viens ».", "Échange de textos très torrides avec {a.first}. J'ai dû poser mon téléphone et aller boire un verre d'eau froide."], en: ['I sent {a.first} an "artistic" photo with flattering light and a very calculated angle. Reply: three flame emojis and "come over".', 'Very steamy texts with {a.first}. I had to put the phone down and drink a glass of cold water.'] }, fx: { rel: 10, happy: 6, visual: 'hearts' }, mood: 'love' },
      { w: 1.5, text: { fr: "Je me suis trompé{|e} de conversation. Ma photo dénudée est partie sur le groupe « Famille ❤️ ». Mamie a répondu « 👍 ». Tonton a demandé si j'avais pris du poids.", en: 'Wrong chat. My nude went to the "Family ❤️" group. Grandma replied "👍". Uncle asked if I\'d gained weight.' }, fx: { happy: -12, stress: 12 }, mood: 'shock' },
      { w: 1, text: { fr: "{a.first} m'a répondu « lol » et rien d'autre. Juste « lol ». J'ai jeté mon téléphone dans les toilettes et tiré la chasse sur ma dignité.", en: '{a.first} replied "lol". Just "lol". I threw my phone in the toilet and flushed my dignity.' }, fx: { rel: -6, happy: -8 }, mood: 'cry' },
      { w: 0.5, text: { fr: "Fuite : ma photo circule sur internet. On m'a reconnu{|e} au grain de beauté en forme de Corse. Je suis célèbre pour de mauvaises raisons.", en: 'Leak: my photo is all over the internet. People recognised me by my mole shaped like Florida. Famous for the wrong reasons.' }, fx: { rel: -10, fame: 6, followers: 8000, happy: -10 }, mood: 'shock' },
    ],
  },
  {
    id: 'threaten', icon: '😠', rating: 1, label: { fr: 'Menacer', en: 'Threaten' }, roles: [...HUMANS], minAge: 10, limit: 1, prisonOk: true,
    out: [
      { w: 3, odds: { athletic: 0.5 }, text: { fr: ["J'ai regardé {a.first} droit dans les yeux et murmuré : « Je sais où tu habites. » {a:Il|Elle} m'a rappelé que je l'avais aidé{a:|e} à déménager.", "J'ai menacé {a.first} en faisant craquer mes doigts un par un. {a:Il|Elle} a pâli. Moi, je me suis foulé l'auriculaire."], en: ['I stared {a.first} in the eyes and whispered: "I know where you live." {a:He|She} reminded me I helped {a.him} move.', 'I threatened {a.first}, cracking my knuckles one by one. {a:He|She} went pale. I sprained my pinky.'] }, fx: { rel: -15, karma: -4 }, mood: 'angry' },
      { w: 2, text: { fr: "{a.first} m'a ri au nez. Puis {a:il|elle} a imité ma voix menaçante devant tout le monde. Ça ressemblait à un caniche enrhumé.", en: '{a.first} laughed in my face. Then imitated my threatening voice in front of everyone. It sounded like a poodle with a cold.' }, fx: { rel: -6, happy: -5 }, mood: 'cry' },
      { w: 1, text: { fr: "{a.first} a enregistré mes menaces et porté plainte. Un policier m'a convoqué{|e} pour « une petite discussion ».", en: '{a.first} recorded my threats and filed a complaint. A cop summoned me for "a little chat".' }, fx: { rel: -20, heat: 15, visual: 'police' }, mood: 'shock' },
    ],
  },
  {
    id: 'blackmail', icon: '📸', rating: 2, label: { fr: 'Faire chanter', en: 'Blackmail' }, roles: [...HUMANS], notRoles: ['child'], minAge: 16, limit: 1, prisonOk: true,
    targetIf: (n, life) => npcAge(n, life.year) >= 16,
    out: [
      { w: 3, odds: { smarts: 0.8 }, text: { fr: ["J'ai menacé {a.first} de révéler son historique de navigation. {a:Il|Elle} a payé en liquide, en tremblant. Il y avait des choses avec des pieds.", "J'ai des photos de {a.first} en train de manger le yaourt de tout l'étage. {a:Il|Elle} m'a versé une rente pour mon silence."], en: ['I threatened to leak {a.first}\'s browser history. {a:He|She} paid in cash, trembling. There was stuff involving feet.', 'I have photos of {a.first} eating the whole floor\'s yogurts. {a:He|She} pays me a pension for my silence.'] }, fx: { money: 3000, rel: -30, karma: -10, actorRole: 'enemy', visual: 'money' }, mood: 'proud' },
      { w: 1.5, text: { fr: "{a.first} a contre-attaqué avec MES dossiers. Il avait des captures. Plus nombreuses. Plus sales. On est à égalité, et ça me coûte 2 000 de silence.", en: '{a.first} counter-blackmailed with MY files. Screenshots. More of them. Filthier. We\'re even, and it cost me 2,000 in hush money.' }, fx: { money: -2000, rel: -20, actorRole: 'enemy', stress: 15 }, mood: 'shock' },
      { w: 1, text: { fr: "{a.first} a tout avoué publiquement avant que je ne le fasse. Ensuite, {a:il|elle} m'a dénoncé{|e}. Les flics adorent les maîtres chanteurs ratés.", en: '{a.first} confessed everything publicly before I could. Then turned me in. Cops love failed blackmailers.' }, fx: { rel: -40, actorRole: 'enemy', arrest: 'racket', visual: 'police' }, mood: 'shock' },
    ],
  },
  {
    id: 'spit', icon: '💦', rating: 2, label: { fr: 'Cracher dessus', en: 'Spit on' }, roles: [...HUMANS], minAge: 5, limit: 1,
    out: [
      { w: 3, odds: { athletic: 0.4 }, text: { fr: ["J'ai raclé du fond de la gorge et craché un mollard vert sur {a.first}. En plein dans l'œil. Précision chirurgicale.", "J'ai craché sur les chaussures de {a.first}. Un glaviot de compétition, avec des bulles."], en: ['I hocked one up from deep down and spat a green loogie on {a.first}. Right in the eye. Surgical precision.', 'I spat on {a.first}\'s shoes. A competition-grade gob, with bubbles.'] }, fx: { rel: -25, karma: -5, happy: 3 }, mood: 'angry' },
      { w: 2, text: { fr: "Le vent a tourné. Mon crachat est revenu en boomerang sur mon propre visage. {a.first} a ri jusqu'à s'en étouffer.", en: 'The wind turned. My spit boomeranged back onto my own face. {a.first} laughed until {a:he|she} choked.' }, fx: { rel: -8, happy: -6 }, mood: 'cry' },
      { w: 1.5, text: { fr: "{a.first} m'a recraché dessus. Puis encore. On a fini en duel de glaviots sur le parking, applaudis par des ados.", en: '{a.first} spat back. Then again. We ended up in a loogie duel in the parking lot, cheered on by teenagers.' }, fx: { rel: -15, happy: -3 }, mood: 'angry' },
      { w: 0.6, text: { fr: "{a.first} m'a mis une gifle si puissante que mon crachat est rentré. J'ai encore le goût.", en: '{a.first} slapped me so hard my spit went back in. I can still taste it.' }, fx: { rel: -20, health: -4 }, mood: 'shock' },
    ],
  },
];
