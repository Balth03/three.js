// Word pools for `{w:pool}` tokens. Each entry is a complete [fr, en] phrase, ready to drop into a sentence.
// CONVENTIONS (strict — writers rely on them):
//  - Nouns carry their own article: FR « un grille-pain rouillé » / EN "a rusty toaster" (never prepend un/le/a/the yourself).
//  - Locative pools carry their preposition: at_place « au supermarché » / "at the supermarket"; to_place « à Ikea » / "to Ikea".
//  - Activity-like pools: FR infinitive / EN gerund (« faire du yoga sous la pluie » / "doing yoga in the rain").
//  - Clause pools: excuse « parce que… » / "because…", conspiracy « que… » / "that…".
//  - bodypart: FR with definite article « le coude » / EN bare noun "elbow" (used as « je me suis cassé {w:bodypart} » / "I broke my {w:bodypart}").
//  - No braces/brackets inside entries. Rating: pools are mostly safe; `swear` and `gross` are for rating ≥ 1 content only.
import { wordsA } from './a.ts';
import { wordsB } from './b.ts';

export const POOLS = [
  'object', 'food', 'drink', 'animal', 'vehicle', 'at_place', 'to_place', 'far_place', 'celeb', 'brand', 'app', 'song', 'show', 'movie', 'band',
  'insult', 'exclaim', 'excuse', 'time', 'weather', 'smell', 'sound', 'activity', 'hobby', 'gift', 'bodypart', 'weird_job', 'conspiracy',
  'superpower', 'disaster', 'crime_small', 'nickname', 'compliment', 'threat', 'gross', 'swear',
] as const;
export type Pool = (typeof POOLS)[number];

function merge(...parts: Partial<Record<Pool, [string, string][]>>[]): Record<string, [string, string][]> {
  const out: Record<string, [string, string][]> = {};
  for (const p of parts) for (const k in p) out[k] = [...(out[k] ?? []), ...(p[k as Pool] ?? [])];
  return out;
}

const seed: Partial<Record<Pool, [string, string][]>> = {
  object: [['un grille-pain rouillé', 'a rusty toaster'], ['une chaussette orpheline', 'an orphaned sock'], ['un nain de jardin hanté', 'a haunted garden gnome'], ['une lampe à lave', 'a lava lamp'], ['un fer à repasser', 'a clothes iron'], ['une perceuse sans fil', 'a cordless drill'], ['un tabouret bancal', 'a wobbly stool'], ['un parapluie retourné', 'an inside-out umbrella']],
  food: [['une raclette industrielle', 'an industrial-size raclette'], ['un kebab sauce samouraï', 'a kebab drowning in hot sauce'], ['une quiche suspecte', 'a suspicious quiche'], ['un cassoulet en boîte', 'a can of cassoulet'], ['une pizza à l\'ananas', 'a pineapple pizza'], ['un croissant écrasé', 'a squashed croissant'], ['une fondue au fromage', 'a cheese fondue'], ['un tacos trois viandes', 'a triple-meat taco']],
  drink: [['un mojito tiède', 'a lukewarm mojito'], ['une bière sans bulles', 'a flat beer'], ['un café filtre de 2019', 'a filter coffee from 2019'], ['un smoothie au chou kale', 'a kale smoothie'], ['un pastis bien tassé', 'a strong pastis'], ['une limonade maison', 'a homemade lemonade'], ['un energy drink', 'an energy drink'], ['un thé froid éventé', 'a stale iced tea']],
  animal: [['un pigeon unijambiste', 'a one-legged pigeon'], ['un chihuahua enragé', 'a rabid chihuahua'], ['une mouette kleptomane', 'a kleptomaniac seagull'], ['un raton laveur', 'a raccoon'], ['une chèvre naine', 'a pygmy goat'], ['un hamster obèse', 'an obese hamster'], ['un sanglier perdu', 'a lost wild boar'], ['un chat qui juge', 'a judgmental cat']],
  vehicle: [['une trottinette électrique volée', 'a stolen e-scooter'], ['une Clio de 1998', 'a 1998 hatchback'], ['un tracteur', 'a tractor'], ['un camping-car', 'an RV'], ['un pédalo', 'a pedal boat'], ['un bus de nuit', 'a night bus'], ['une voiture sans permis', 'a microcar'], ['un vélo sans freins', 'a bike with no brakes']],
  at_place: [['au supermarché', 'at the supermarket'], ['à la piscine municipale', 'at the public pool'], ['chez le dentiste', 'at the dentist'], ['à la boulangerie', 'at the bakery'], ['au camping', 'at the campsite'], ['à la mairie', 'at the town hall'], ['dans un Ikea', 'in an Ikea'], ['à la laverie', 'at the laundromat']],
  to_place: [['à Ikea', 'to Ikea'], ['au cinéma', 'to the movies'], ['à la plage', 'to the beach'], ['chez mamie', 'to grandma\'s'], ['au bowling', 'to the bowling alley'], ['à la fête foraine', 'to the fair'], ['au karaoké', 'to karaoke'], ['à la déchetterie', 'to the dump']],
  far_place: [['à Tombouctou', 'in Timbuktu'], ['en Laponie', 'in Lapland'], ['à Las Vegas', 'in Las Vegas'], ['au fin fond du Larzac', 'in the middle of nowhere'], ['sur une plateforme pétrolière', 'on an oil rig'], ['à Ibiza', 'in Ibiza'], ['au Groenland', 'in Greenland'], ['en Patagonie', 'in Patagonia']],
  insult: [['espèce de moule à gaufres', 'you absolute waffle iron'], ['tête de cake', 'fruitcake face'], ['sac à vomi', 'barf bag'], ['gros naze', 'total loser'], ['face de flan', 'pudding face'], ['crétin des Alpes', 'mountain moron'], ['endive humaine', 'human endive'], ['cornichon', 'pickle brain']],
  exclaim: [['Sapristi !', 'Holy guacamole!'], ['Nom d\'un pétard !', 'Great balls of fire!'], ['Purée !', 'Dang it!'], ['Oh la vache !', 'Holy cow!'], ['Saperlipopette !', 'Jeepers!'], ['Mince alors !', 'Well, shoot!'], ['Ah bah bravo !', 'Well done, genius!'], ['Nom de Zeus !', 'Great Scott!']],
  excuse: [['parce que Mercure était rétrograde', 'because Mercury was in retrograde'], ['parce que mon chat me l\'a demandé', 'because my cat told me to'], ['parce que c\'était soldé', 'because it was on sale'], ['parce que j\'avais faim', 'because I was hungry'], ['parce que TikTok l\'a dit', 'because TikTok said so'], ['parce que la vie est courte', 'because life is short'], ['parce que j\'étais bourré', 'because I was drunk'], ['par principe', 'on principle']],
  time: [['un mardi à 3 h du matin', 'on a Tuesday at 3 a.m.'], ['pendant un enterrement', 'during a funeral'], ['le soir du réveillon', 'on New Year\'s Eve'], ['en pleine réunion', 'in the middle of a meeting'], ['un dimanche pluvieux', 'on a rainy Sunday'], ['à la pause déj', 'on my lunch break'], ['pendant la messe', 'during mass'], ['au milieu de la nuit', 'in the middle of the night']],
  weather: [['sous une pluie de grêlons', 'in a hailstorm'], ['par 42 °C à l\'ombre', 'in 108°F heat'], ['dans un brouillard à couper au couteau', 'in pea-soup fog'], ['sous la neige', 'in the snow'], ['en pleine tempête', 'in the middle of a storm'], ['sous un soleil de plomb', 'under a scorching sun'], ['par un vent à décorner les bœufs', 'in a gale'], ['sous une averse', 'in a downpour']],
  smell: [['une odeur de fromage mouillé', 'a smell of wet cheese'], ['une odeur de chien mouillé', 'a wet-dog smell'], ['une odeur d\'œuf pourri', 'a rotten-egg smell'], ['une odeur de frites', 'a smell of fries'], ['une odeur de pieds', 'a feet smell'], ['une odeur de javel', 'a bleach smell'], ['une odeur de brûlé', 'a burning smell'], ['une odeur de lessive', 'a laundry smell']],
  sound: [['un bruit de canard qu\'on écrase', 'a sound like a duck being stepped on'], ['un pet monumental', 'a monumental fart'], ['un cri de mouette', 'a seagull scream'], ['une alarme de voiture', 'a car alarm'], ['un rot sonore', 'a loud burp'], ['un craquement sinistre', 'an ominous crack'], ['un violon désaccordé', 'an out-of-tune violin'], ['un hurlement de loup', 'a wolf howl']],
  activity: [['faire du yoga sous la pluie', 'doing yoga in the rain'], ['compter les pigeons', 'counting pigeons'], ['regarder des tutos de crochet', 'watching crochet tutorials'], ['me disputer avec un bot', 'arguing with a bot'], ['trier mes chaussettes', 'sorting my socks'], ['apprendre le klingon', 'learning Klingon'], ['manger des chips au lit', 'eating chips in bed'], ['faire des pompes', 'doing push-ups']],
  hobby: [['la taxidermie', 'taxidermy'], ['le macramé', 'macramé'], ['la pêche à la mouche', 'fly fishing'], ['le karaoké', 'karaoke'], ['la poterie', 'pottery'], ['les échecs', 'chess'], ['le jardinage', 'gardening'], ['la magie', 'magic tricks']],
  gift: [['un pull tricoté en poils de chat', 'a sweater knitted from cat hair'], ['une carte cadeau de 5 €', 'a $5 gift card'], ['un mug « meilleur papa »', 'a "best dad" mug'], ['une bougie parfumée au bacon', 'a bacon-scented candle'], ['un abonnement à la salle', 'a gym membership'], ['un ticket à gratter perdant', 'a losing scratch card'], ['des chaussettes', 'socks'], ['un poisson rouge', 'a goldfish']],
  bodypart: [['le coude', 'elbow'], ['le petit orteil', 'pinky toe'], ['le nez', 'nose'], ['la cheville', 'ankle'], ['le poignet', 'wrist'], ['le coccyx', 'tailbone'], ['l\'épaule', 'shoulder'], ['le genou', 'knee']],
};

export const words = merge(seed, wordsA, wordsB);
