import type { RelActionDef } from '@bl/sim';
import { addLine, L, npcAge } from '@bl/sim';

const HUMANS = ['mother', 'father', 'sibling', 'grandparent', 'friend', 'bestfriend', 'classmate', 'coworker', 'boss', 'partner', 'fiance', 'spouse', 'child', 'ex', 'enemy'] as const;

export const relActions: RelActionDef[] = [
  {
    id: 'time', icon: '🤝', label: { fr: 'Passer du temps', en: 'Spend time' }, roles: [...HUMANS], notRoles: ['enemy', 'boss'], limit: 2,
    out: [
      { w: 5, text: { fr: ['J\'ai passé l\'après-midi avec {a.first}. On a beaucoup ri.', 'J\'ai fait une balade avec {a.first}. On a refait le monde.', 'J\'ai regardé un film avec {a.first}. {a:Il|Elle} a parlé pendant tout le film.'], en: ['I spent the afternoon with {a.first}. We laughed a lot.', 'I went for a walk with {a.first}. We fixed the world.', 'I watched a movie with {a.first}. {a:He|She} talked through the whole thing.'] }, fx: { rel: 9, happy: 3 } },
      { w: 1, text: { fr: 'J\'ai passé du temps avec {a.first}, mais on s\'est disputés pour une broutille.', en: 'I spent time with {a.first}, but we argued over nothing.' }, fx: { rel: -4, happy: -2 } },
    ],
  },
  {
    id: 'talk', icon: '💬', label: { fr: 'Discuter', en: 'Have a conversation' }, roles: [...HUMANS], limit: 2,
    out: [
      { w: 4, text: { fr: ['J\'ai discuté avec {a.first} de [[la météo|ses vacances|la vie|ses plantes vertes]]. Passionnant.', 'Longue conversation avec {a.first}. J\'ai appris des choses sur {a.him}.'], en: ['I chatted with {a.first} about [[the weather|their holidays|life|their houseplants]]. Riveting.', 'Long conversation with {a.first}. I learned things about {a.him}.'] }, fx: { rel: 5 } },
      { w: 1, text: { fr: 'Conversation gênante avec {a.first}. Un long silence. Puis un autre.', en: 'Awkward conversation with {a.first}. A long silence. Then another one.' }, fx: { rel: -2 } },
    ],
  },
  {
    id: 'compliment', icon: '🌟', label: { fr: 'Faire un compliment', en: 'Compliment' }, roles: [...HUMANS], notRoles: ['enemy'], limit: 1,
    out: [
      { w: 4, text: { fr: ['J\'ai dit à {a.first} que {a:il|elle} avait un style fou. {a:Il|Elle} a rougi.', 'J\'ai complimenté {a.first} sur son rire. Sincèrement.'], en: ['I told {a.first} they had amazing style. {a:He|She} blushed.', 'I complimented {a.first} on their laugh. Sincerely.'] }, fx: { rel: 7, karma: 1 } },
      { w: 1, text: { fr: '{a.first} a cru que je me moquais d\'{a:lui|elle}.', en: '{a.first} thought I was mocking {a.him}.' }, fx: { rel: -3 } },
    ],
  },
  {
    id: 'hug', icon: '🫂', label: { fr: 'Faire un câlin', en: 'Hug' }, roles: ['mother', 'father', 'sibling', 'grandparent', 'bestfriend', 'partner', 'fiance', 'spouse', 'child'], limit: 1,
    out: [{ text: { fr: ['J\'ai fait un gros câlin à {a.first}.', 'Câlin surprise pour {a.first} ! {a:Il|Elle} a fait semblant de râler.'], en: ['I gave {a.first} a big hug.', 'Surprise hug for {a.first}! {a:He|She} pretended to complain.'] }, fx: { rel: 6, happy: 3 }, mood: 'love' }],
  },
  {
    id: 'gift', icon: '🎁', label: { fr: 'Offrir un cadeau', en: 'Give a gift' }, roles: [...HUMANS], notRoles: ['enemy'], minAge: 6, limit: 1, cost: 40,
    out: [
      { w: 4, text: { fr: ['J\'ai offert [[des chocolats|un livre|une plante|un mug « meilleur·e du monde »]] à {a.first}. Succès total.'], en: ['I gave {a.first} [[chocolates|a book|a plant|a "world\'s best" mug]]. Total success.'] }, fx: { rel: 12, karma: 1 } },
      { w: 1, text: { fr: 'J\'ai offert un pull à {a.first}. {a:Il|Elle} a souri poliment. Je ne le reverrai jamais.', en: 'I gave {a.first} a sweater. {a:He|She} smiled politely. I\'ll never see it again.' }, fx: { rel: 3 } },
    ],
  },
  {
    id: 'askmoney', icon: '💶', label: { fr: 'Demander de l\'argent', en: 'Ask for money' }, roles: ['mother', 'father', 'grandparent'], minAge: 5, limit: 1,
    out: [{
      text: { fr: 'J\'ai demandé un peu d\'argent à {a.first}.', en: 'I asked {a.first} for some money.' },
      fx: {
        fn: ({ life, actor, rand, content }) => {
          if (!actor) return;
          const c = content.countries.find((x) => x.id === life.country)!;
          const p = actor.rel / 130 + (actor.money > 0 ? 0.2 : -0.3);
          if (rand() < p && actor.money > 0) {
            const base = life.age < 13 ? 5 + rand() * 25 : life.age < 18 ? 20 + rand() * 80 : 100 + rand() * Math.min(3000, actor.money / (c.price * c.currency.rate) * 0.05);
            const amt = Math.round(base * c.price * c.currency.rate);
            life.money += amt;
            actor.money -= amt;
            actor.rel = Math.max(0, actor.rel - 2);
            const f = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: c.currency.code, maximumFractionDigits: 0 }).format(amt);
            const e = new Intl.NumberFormat('en-US', { style: 'currency', currency: c.currency.code, maximumFractionDigits: 0 }).format(amt);
            addLine(life, { fr: `${actor.first} m'a donné ${f}.`, en: `${actor.first} gave me ${e}.` }, '💶', 'good');
          } else {
            actor.rel = Math.max(0, actor.rel - 4);
            addLine(life, { fr: `${actor.first} a refusé : « L'argent ne pousse pas sur les arbres ! »`, en: `${actor.first} refused: "Money doesn't grow on trees!"` }, '🙅', 'bad');
          }
        },
      },
    }],
  },
  {
    id: 'befriend', icon: '🙋', label: { fr: 'Devenir amis', en: 'Befriend' }, roles: ['classmate', 'coworker'], limit: 1,
    out: [
      { w: 3, odds: { looks: 0.5, happy: 0.5 }, text: { fr: '{a.first} et moi sommes devenus amis !', en: '{a.first} and I became friends!' }, fx: { actorRole: 'friend', rel: 15, happy: 4 }, mood: 'happy' },
      { w: 2, text: { fr: '{a.first} m\'a regardé{|e} bizarrement et est parti{a:|e}.', en: '{a.first} gave me a weird look and walked off.' }, fx: { rel: -5, happy: -3 } },
    ],
  },
  {
    id: 'bff', icon: '💛', label: { fr: 'Proposer d\'être meilleurs amis', en: 'Ask to be best friends' }, roles: ['friend'], limit: 1, targetIf: (n) => n.rel >= 70,
    out: [
      { w: 3, text: { fr: '{a.first} a dit oui ! Meilleurs amis pour la vie (ou jusqu\'à la prochaine dispute).', en: '{a.first} said yes! Best friends for life (or until the next fight).' }, fx: { actorRole: 'bestfriend', rel: 10, happy: 6 }, mood: 'love' },
      { w: 1, text: { fr: '{a.first} trouve qu\'on « n\'en est pas encore là ». Aïe.', en: '{a.first} said we\'re "not there yet". Ouch.' }, fx: { rel: -3, happy: -3 } },
    ],
  },
  {
    id: 'flirt', icon: '😏', label: { fr: 'Draguer', en: 'Flirt' }, roles: ['classmate', 'coworker', 'friend', 'bestfriend', 'ex'], minAge: 13, limit: 1,
    targetIf: (n, life) => (life.orientation === 'bi' || (life.orientation === 'gay' ? n.gender === life.gender : n.gender !== life.gender)) && Math.abs(npcAge(n, life.year) - life.age) <= (life.age < 18 ? 2 : 12) && (npcAge(n, life.year) >= 18) === (life.age >= 18),
    out: [
      { w: 2, odds: { looks: 1 }, text: { fr: '{a.first} m\'a rendu mon sourire… On sort ensemble !', en: '{a.first} smiled back… We\'re dating now!' }, fx: { actorRole: 'partner', rel: 15, happy: 10 }, mood: 'love' },
      { w: 2, text: { fr: '{a.first} m\'a gentiment fait comprendre que ce n\'était pas réciproque.', en: '{a.first} kindly let me know it wasn\'t mutual.' }, fx: { rel: -6, happy: -5 }, mood: 'sad' },
    ],
  },
  {
    id: 'date', icon: '🍝', label: { fr: 'Rendez-vous romantique', en: 'Romantic date' }, roles: ['partner', 'fiance', 'spouse'], limit: 2, cost: 50,
    out: [
      { w: 4, text: { fr: ['Dîner aux chandelles avec {a.first}. On a partagé un spaghetti façon Belle et le Clochard.', 'Pique-nique au coucher du soleil avec {a.first}. Romantique, malgré les fourmis.'], en: ['Candlelit dinner with {a.first}. We shared a spaghetti, Lady and the Tramp style.', 'Sunset picnic with {a.first}. Romantic, despite the ants.'] }, fx: { rel: 12, happy: 6 }, mood: 'love' },
      { w: 1, text: { fr: 'Rendez-vous raté : le restaurant avait perdu notre réservation et {a.first} a boudé.', en: 'Failed date: the restaurant lost our booking and {a.first} sulked.' }, fx: { rel: -4, happy: -3 } },
    ],
  },
  {
    id: 'propose', icon: '💍', label: { fr: 'Demander en mariage', en: 'Propose' }, roles: ['partner'], minAge: 18, limit: 1, cost: 1500, targetIf: (n, life) => npcAge(n, life.year) >= 18,
    out: [
      { w: 3, odds: { looks: 0.3 }, text: { fr: 'J\'ai posé un genou à terre. {a.first} a dit OUI ! 💍', en: 'I got down on one knee. {a.first} said YES! 💍' }, fx: { actorRole: 'fiance', rel: 15, happy: 15 }, mood: 'love' },
      { w: 1, text: { fr: '{a.first} a dit non. Devant tout le restaurant. Le serveur m\'a offert un dessert par pitié.', en: '{a.first} said no. In front of the whole restaurant. The waiter gave me a pity dessert.' }, fx: { rel: -15, happy: -15 }, mood: 'cry' },
    ],
  },
  {
    id: 'marry', icon: '💒', label: { fr: 'Organiser le mariage', en: 'Plan the wedding' }, roles: ['fiance'], limit: 1, cost: 8000,
    out: [
      { w: 4, text: { fr: 'J\'ai épousé {a.first} ! Une cérémonie magnifique, l\'oncle Gérard a fini sur la table. 💒', en: 'I married {a.first}! A beautiful ceremony, Uncle Gerald ended up dancing on a table. 💒' }, fx: { actorRole: 'spouse', rel: 15, happy: 18, counter: 'marriages', fn: ({ life, actor }) => { if (actor) actor.last = actor.last; life.movedOut = true; } }, mood: 'love' },
      { w: 1, text: { fr: 'Mariage célébré avec {a.first}… sous une pluie torrentielle. Mais on s\'est dit oui ! 💒', en: 'Married {a.first}… in a torrential downpour. But we said yes! 💒' }, fx: { actorRole: 'spouse', rel: 12, happy: 12, counter: 'marriages', fn: ({ life }) => { life.movedOut = true; } }, mood: 'love' },
    ],
  },
  {
    id: 'baby', icon: '👶', label: { fr: 'Essayer d\'avoir un bébé', en: 'Try for a baby' }, roles: ['partner', 'fiance', 'spouse'], minAge: 18, limit: 1,
    when: { noFlag: 'pregnant', age: [18, 50] },
    out: [
      { w: 2, odds: { fertility: 1 }, text: { fr: 'Grande nouvelle : un bébé est en route ! 🍼', en: 'Big news: a baby is on the way! 🍼' }, fx: { happy: 10, rel: 8, fn: ({ life, actor }) => { life.flags.pregnant = life.age; if (actor) life.flags.babyWith = actor.id; } }, mood: 'love' },
      { w: 2, text: { fr: 'Pas de bébé cette année. On réessaiera.', en: 'No baby this year. We\'ll try again.' }, fx: { rel: 3 } },
    ],
  },
  {
    id: 'argue', icon: '😤', label: { fr: 'Se disputer', en: 'Argue' }, roles: [...HUMANS], limit: 1,
    out: [
      { w: 2, text: { fr: 'J\'ai eu une dispute épique avec {a.first} au sujet de [[l\'ananas sur la pizza|la vaisselle|politique|qui a commencé]].', en: 'I had an epic argument with {a.first} about [[pineapple on pizza|the dishes|politics|who started it]].' }, fx: { rel: -10, happy: -2 }, mood: 'angry' },
      { w: 1, text: { fr: 'Dispute avec {a.first}… et j\'ai gagné ! Je me sens étrangement vide.', en: 'Argued with {a.first}… and I won! I feel strangely empty.' }, fx: { rel: -6, happy: 1 }, mood: 'angry' },
    ],
  },
  {
    id: 'insult', icon: '🤬', label: { fr: 'Insulter', en: 'Insult' }, roles: [...HUMANS], limit: 1,
    out: [{ text: { fr: ['J\'ai traité {a.first} de [[patate moisie|cornichon|tête de veau|sac à puces]].', 'J\'ai dit à {a.first} que son haleine sentait le fromage.'], en: ['I called {a.first} a [[moldy potato|pickle|walnut brain|flea bag]].', 'I told {a.first} their breath smelled like cheese.'] }, fx: { rel: -15, karma: -3 }, mood: 'angry' }],
  },
  {
    id: 'prank', icon: '🃏', label: { fr: 'Faire une blague', en: 'Prank' }, roles: ['sibling', 'friend', 'bestfriend', 'classmate', 'coworker'], minAge: 5, limit: 1,
    out: [
      { w: 2, text: { fr: 'J\'ai mis du sel dans le café de {a.first}. Génie absolu.', en: 'I put salt in {a.first}\'s coffee. Absolute genius.' }, fx: { happy: 4, rel: -3 } },
      { w: 2, text: { fr: 'J\'ai caché un coussin péteur sous {a.first}. Même {a.he} a ri.', en: 'I hid a whoopee cushion under {a.first}. Even {a.he} laughed.' }, fx: { happy: 4, rel: 4 } },
      { w: 1, text: { fr: 'Ma blague à {a.first} a mal tourné. Il y a eu des larmes. Les miennes.', en: 'My prank on {a.first} went wrong. There were tears. Mine.' }, fx: { happy: -3, rel: -8 } },
    ],
  },
  {
    id: 'suckup', icon: '☕', label: { fr: 'Lécher les bottes', en: 'Suck up' }, roles: ['boss'], limit: 1,
    out: [
      { w: 2, text: { fr: 'J\'ai apporté un café à {a.first} et ri à toutes ses blagues.', en: 'I brought {a.first} coffee and laughed at all their jokes.' }, fx: { rel: 8, perf: 5 } },
      { w: 1, text: { fr: '{a.first} a vu clair dans mon jeu. Malaise.', en: '{a.first} saw right through me. Awkward.' }, fx: { rel: -4 } },
    ],
  },
  {
    id: 'play', icon: '🧸', label: { fr: 'Jouer ensemble', en: 'Play together' }, roles: ['child', 'pet', 'sibling'], limit: 2,
    out: [{ text: { fr: ['J\'ai joué avec {a.first}. On a construit une cabane en coussins.', 'Partie de cache-cache endiablée avec {a.first}.'], en: ['I played with {a.first}. We built a pillow fort.', 'An intense game of hide-and-seek with {a.first}.'] }, fx: { rel: 10, happy: 5 }, mood: 'happy' }],
  },
  {
    id: 'walkpet', icon: '🦮', label: { fr: 'Promener', en: 'Walk' }, roles: ['pet'], limit: 1, targetIf: (n) => n.species === 'dog',
    out: [{ text: { fr: 'J\'ai promené {a.first}. {a:Il|Elle} a reniflé chaque lampadaire de la ville.', en: 'I walked {a.first}. They sniffed every lamppost in town.' }, fx: { rel: 8, health: 2, happy: 3 } }],
  },
  {
    id: 'breakup', icon: '💔', label: { fr: 'Rompre', en: 'Break up' }, roles: ['partner', 'fiance'], limit: 1,
    out: [{ text: { fr: 'J\'ai rompu avec {a.first}. {a:Il|Elle} a gardé la plante. Et le chat.', en: 'I broke up with {a.first}. {a:He|She} kept the plant. And the cat.' }, fx: { actorRole: 'ex', rel: -30, happy: -6 }, mood: 'sad' }],
  },
  {
    id: 'divorce', icon: '📜', label: { fr: 'Divorcer', en: 'Divorce' }, roles: ['spouse'], limit: 1,
    out: [{ text: { fr: 'J\'ai divorcé de {a.first}. Les avocats, eux, sont ravis.', en: 'I divorced {a.first}. The lawyers are thrilled.' }, fx: { actorRole: 'ex', rel: -35, happy: -10, moneyPct: -0.4 }, mood: 'sad' }],
  },
  {
    id: 'reconcile', icon: '🕊️', label: { fr: 'Se réconcilier', en: 'Make peace' }, roles: ['enemy', 'ex'], limit: 1,
    out: [
      { w: 1, text: { fr: 'J\'ai tendu la main à {a.first}. On a enterré la hache de guerre.', en: 'I reached out to {a.first}. We buried the hatchet.' }, fx: { rel: 20, karma: 3, fn: ({ actor }) => { if (actor && actor.role === 'enemy') actor.role = 'friend'; } } },
      { w: 1, text: { fr: '{a.first} m\'a claqué la porte au nez.', en: '{a.first} slammed the door in my face.' }, fx: { rel: -5 } },
    ],
  },
];

void L;
