// Core types of the BitLife Online simulation. Everything here is plain data (JSON-serialisable),
// except the optional `fn` / `test` escape hatches in content definitions (which never end up in a save).

export type Lang = 'fr' | 'en';
export interface Loc<T = string> { fr: T; en: T }
/** Localised text, each language may hold several variants (one is picked at random). */
export type LocText = Loc<string | string[]>;

export type Gender = 'm' | 'f';
export type Orientation = 'straight' | 'gay' | 'bi';
export type StatKey = 'happy' | 'health' | 'smarts' | 'looks';
export type AttrKey = 'karma' | 'fame' | 'athletic' | 'discipline' | 'stress' | 'fertility';
export type AnyStat = StatKey | AttrKey;
export type Tone = 'good' | 'bad' | 'neutral';
export type GameMode = 'classic' | 'zen' | 'hardcore' | 'chaos' | 'god';
/** Content rating: 0 = family friendly, 1 = adult, 2 = trash (crude humour, cartoon gore). */
export type Rating = 0 | 1 | 2;

export type EduStage = 'none' | 'preschool' | 'primary' | 'middle' | 'high' | 'uni' | 'grad';
export type Role =
  | 'mother' | 'father' | 'sibling' | 'grandparent'
  | 'friend' | 'bestfriend' | 'classmate' | 'coworker' | 'boss' | 'enemy'
  | 'partner' | 'fiance' | 'spouse' | 'ex' | 'child' | 'pet' | 'acquaintance';
/** Role selectors used by content: a concrete role or a group. */
export type RoleSel = Role | 'parent' | 'family' | 'lover' | 'anyFriend' | 'anyone';

export type Place = 'home' | 'school' | 'office' | 'hospital' | 'park' | 'cemetery' | 'uni' | 'party' | 'apartment'
  | 'prison' | 'court' | 'villa' | 'mansion' | 'casino' | 'beach' | 'stadium' | 'studio' | 'castle';
export type Mood = 'happy' | 'sad' | 'shock' | 'angry' | 'love' | 'sleepy' | 'proud' | 'sick' | 'neutral' | 'party' | 'cry';
export type Tab = 'career' | 'assets' | 'relations' | 'activities' | 'school' | 'crime' | 'prison';

export interface SceneHint { place?: Place; mood?: Mood; prop?: string; fx?: VisualFx }
export type VisualFx = 'gore' | 'money' | 'police' | 'fire' | 'confetti' | 'hearts' | 'poop' | 'explosion' | 'ghost';

// ───────────────────────────── appearance / people ─────────────────────────────

export interface Appearance {
  skin: number;       // index in skin palette (0..7)
  hair: number;       // hair colour index (0..7)
  hairStyle: number;  // style index (0..9)
  eyes: number;       // eye colour index (0..4)
  height: number;     // 0..1 genetic height
  weight: number;     // 0..1 body mass (mutable)
  freckles: boolean;
  glasses: boolean;
  beard: number;      // 0 = none (men only, adult)
  outfit: number;     // clothing colour seed
}

export interface Npc {
  id: number;
  first: string;
  last: string;
  gender: Gender;
  birthYear: number;
  alive: boolean;
  deathYear?: number;
  role: Role;
  rel: number;          // relationship gauge 0..100
  looks: number;
  smarts: number;
  health: number;
  money: number;        // local currency
  traits: string[];
  job?: string;         // career id
  species?: string;     // pets
  app: Appearance;
  met: number;          // year met
  flags: Record<string, number | string | boolean>;
  temp?: boolean;       // created by an event, dropped unless kept
  /** Two-player mode: this NPC is the other player's character. */
  playerId?: string;
  interacted?: Record<string, number>; // rel action id -> times this year
}

// ───────────────────────────── life state ─────────────────────────────

export interface Edu {
  stage: EduStage;          // current stage when enrolled, else last stage reached
  enrolled: boolean;
  yearInStage: number;
  grade: number;            // 0..100
  school: string;
  major?: string;
  gradProgram?: string;
  degrees: string[];        // 'high', 'uni:<major>', 'grad:<program>'
  dropout: boolean;
  loan: number;             // local currency
  effort: number;           // 0..100, raised by studying
}

export interface Job {
  careerId: string;
  level: number;
  salary: number;           // local currency per year (gross)
  perf: number;             // 0..100
  years: number;
  yearsAtLevel: number;
  employer: string;
  partTime: boolean;
}

export interface JobRecord { careerId: string; level: number; years: number; employer: string; end: 'quit' | 'fired' | 'retired' | 'graduated' }

export interface LogLine { t: Loc<string>; icon?: string; tone?: Tone }
export interface YearLog { age: number; year: number; lines: LogLine[] }

export interface PendingChoice { label: Loc<string>; idx: number; risky: boolean; preview: Partial<Record<AnyStat | 'money' | 'rel', number>> }

export interface Pending {
  key: string;              // event id
  actorId?: number;
  vars: Record<string, number | string>;
  text: Loc<string>;
  icon: string;
  scene?: SceneHint;
  choices: PendingChoice[]; // empty => informational card (OK)
}

export interface Condition { id: string; since: number; severity: number }

export interface PrisonState { years: number; served: number; crime: string; respect: number; gang?: string; escapes: number; facility: string }
export interface CrimeRecord { crime: string; year: number; years: number }
export interface Asset { uid: number; def: string; name: string; value: number; loan: number; bought: number; condition: number; rented: boolean }
export interface Loan { amount: number; rate: number; years: number; kind: 'personal' | 'mortgage' | 'student' }
export interface Business { name: string; sector: string; value: number; revenue: number; employees: number; years: number; reputation: number }
export interface AncestorRecord { first: string; last: string; gender: Gender; born: number; died: number; cause: Loc<string>; netWorth: number; job?: string; app: Appearance; generation: number }

export interface StatPoint { age: number; happy: number; health: number; smarts: number; looks: number; money: number }

export interface Life {
  v: number;
  id: string;
  seed: number;
  rng: [number, number, number, number];
  mode: GameMode;
  family: boolean;          // "Tout public" content filter
  first: string;
  last: string;
  gender: Gender;
  orientation: Orientation;
  country: string;
  city: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  age: number;
  year: number;
  stats: Record<StatKey, number>;
  attrs: Record<AttrKey, number>;
  traits: string[];
  talent: string;
  talentKnown: boolean;
  app: Appearance;
  money: number;            // local currency
  edu: Edu;
  job: Job | null;
  jobHistory: JobRecord[];
  npcs: Npc[];
  nextId: number;
  flags: Record<string, number | string | boolean>;
  seen: Record<string, number>;
  /** How many times each event fired in this life (variety: repeated events get rarer). */
  seenCount?: Record<string, number>;
  /** Event counts carried over from previous lives (cross-life variety). */
  fatigue?: Record<string, number>;
  /** Last text variant used per text key (variants rotate instead of repeating). */
  textMemo?: Record<string, number>;
  queue: Pending[];
  scheduled: { key: string; age: number; actorId?: number }[];
  log: YearLog[];
  used: Record<string, number>;
  conditions: Condition[];
  movedOut: boolean;
  wealth: 'poor' | 'middle' | 'rich';
  history: StatPoint[];
  alive: boolean;
  death?: { age: number; year: number; cause: Loc<string> };
  /** Scene the 3D stage should show by default. */
  place: Place;
  rating: Rating;
  prison?: PrisonState;
  record: CrimeRecord[];
  heat: number;             // police attention 0..100
  assets: Asset[];
  portfolio: Record<string, number>;   // stock id -> shares
  market: Record<string, number>;      // stock id -> price (base units)
  loans: Loan[];
  business?: Business;
  followers: number;
  addictions: Record<string, number>;  // id -> level 0..100
  counters: Record<string, number>;    // achievement/challenge counters
  achievements: string[];
  generation: number;
  ancestors: AncestorRecord[];
  scenario?: string;
  challenge?: string;
  /** Visual cues for the client for the last resolution (not gameplay). */
  lastFx?: VisualFx[];
}

// ───────────────────────────── content definitions ─────────────────────────────

export interface Cond {
  age?: [number, number];
  gender?: Gender;
  stat?: Partial<Record<AnyStat, [number, number]>>;
  flag?: string | string[];
  noFlag?: string | string[];
  /** Currently enrolled in one of these stages ('any' = any school, 'none' = not enrolled). */
  school?: EduStage | EduStage[] | 'any' | 'none';
  degree?: string;          // 'high' | 'uni' | 'uni:<major>' | 'grad' | 'grad:<program>'
  noDegree?: string;
  /** true = has a job, false = jobless, string(s) = career id or 'cat:<category>'. */
  job?: boolean | string | string[];
  has?: RoleSel | RoleSel[];
  noHas?: RoleSel | RoleSel[];
  trait?: string | string[];
  noTrait?: string | string[];
  money?: [number, number]; // base units
  country?: string[];
  movedOut?: boolean;
  wealth?: Life['wealth'][];
  orientation?: Orientation[];
  mode?: GameMode[];
  chance?: number;          // extra random gate 0..1
  prison?: boolean;
  /** Minimum content rating required. */
  rating?: Rating;
  era?: [number, number];   // calendar years
  asset?: string;           // owns an asset of this kind (or def id)
  noAsset?: string;
  followers?: [number, number];
  addiction?: string;
  business?: boolean;
  record?: boolean;
  counter?: Record<string, [number, number]>;
  test?: (life: Life) => boolean;
}

export interface NewNpcSpec {
  role: Role;
  /** Age relative to the player ([min, max] offset) or absolute ([min, max] with abs=true). */
  age?: [number, number];
  abs?: boolean;
  gender?: 'same' | 'opposite' | 'any' | 'attracted' | Gender;
  species?: string;
}

export type ActorSpec = RoleSel | { role?: RoleSel; create?: NewNpcSpec; minRel?: number; maxRel?: number; living?: boolean };

export type UiTarget = 'parole' | 'appeal' | 'bank' | 'jobs' | 'university' | 'grad' | 'dating' | 'relations' | 'activities' | 'shop' | 'realestate' | 'cars' | 'stocks' | 'business' | 'crime' | 'minigame:surgery' | 'minigame:trial' | 'minigame:heist' | 'minigame:escape' | 'minigame:cooking' | 'minigame:blackjack' | 'minigame:date' | 'minigame:match' | 'minigame:interrogation' | 'minigame:case'
  | 'minigame:karaoke' | 'minigame:concert' | 'minigame:dj' | 'minigame:hack' | 'minigame:lockpick' | 'minigame:fight' | 'minigame:beerpong' | 'minigame:trading' | 'minigame:slots' | 'minigame:penalty' | 'minigame:getaway';

export interface Effect {
  happy?: number; health?: number; smarts?: number; looks?: number;
  karma?: number; fame?: number; athletic?: number; discipline?: number; stress?: number; fertility?: number;
  /** Base units (≈ USD), or a variable name (optionally prefixed with '-'). */
  money?: number | string;
  /** Multiply current money by (1 + pct). */
  moneyPct?: number;
  rel?: number;
  weight?: number;
  grade?: number;
  perf?: number;
  flag?: string | string[];
  unflag?: string | string[];
  trait?: string;
  removeTrait?: string;
  revealTalent?: boolean;
  disease?: string;
  cure?: string | true;
  actorRole?: Role;
  actorGone?: boolean;
  actorDie?: boolean;
  actorFlag?: string;
  keep?: boolean;
  newNpc?: NewNpcSpec;
  fired?: boolean;
  promote?: boolean;
  quitJob?: boolean;
  retire?: boolean;
  expel?: boolean;
  dropout?: boolean;
  moveOut?: boolean;
  die?: LocText;
  chain?: string;
  schedule?: { key: string; years: number };
  open?: UiTarget;
  log?: LocText;
  /** Arrest for a crime (queues the trial). */
  arrest?: string;
  /** Direct jail time in years (no trial). */
  jail?: number;
  release?: boolean;
  heat?: number;
  followers?: number;
  addiction?: [string, number];
  counter?: string | string[];
  asset?: string;           // gain an asset (def id)
  loseAsset?: string | true; // lose an asset of this kind (or any)
  achievement?: string;
  visual?: VisualFx;
  /** Escape hatch; may return a text that replaces the outcome text. */
  fn?: (ctx: EffectCtx) => void | Loc<string>;
}

export interface EffectCtx {
  life: Life;
  content: Content;
  actor?: Npc;
  vars: Record<string, number | string>;
  rand: () => number;
}

export interface Outcome {
  w?: number;
  /** Only possible at this content rating or above. */
  rating?: Rating;
  odds?: Partial<Record<AnyStat, number>>;
  text: LocText;
  fx?: Effect;
  icon?: string;
  tone?: Tone;
  mood?: Mood;
}

export interface Choice {
  label: LocText;
  rating?: Rating;
  if?: Cond;
  out?: Outcome[];
  text?: LocText;
  fx?: Effect;
  mood?: Mood;
}

export interface EventDef {
  id: string;
  icon: string;
  cat: string;
  scene?: SceneHint;
  when?: Cond;
  weight?: number;
  once?: boolean;
  cooldown?: number;
  /** Milestone: fires whenever eligible, on top of the random picks. */
  priority?: boolean;
  /** Feed line only (no card). */
  auto?: boolean;
  chainOnly?: boolean;
  /** @deprecated use rating: 1 */
  mature?: boolean;
  rating?: Rating;
  actor?: ActorSpec;
  vars?: Record<string, [number, number]>;
  text: LocText;
  choices?: Choice[];
  fx?: Effect;
}

export interface CountryDef {
  id: string;
  name: Loc;
  /** "en France" / "in France" */
  inName: Loc;
  flag: string;
  locale: string;
  /** Weights over the 8 skin tones for randomly generated people. */
  skin: number[];
  currency: { code: string; sym: string; rate: number; after?: boolean };
  price: number;            // price level relative to the base (US = 1)
  wage: number;             // wage level relative to the base
  tax: [number, number][];  // progressive brackets [threshold base units, marginal rate]
  lifeExp: number;
  cities: string[];
  schools: Record<'preschool' | 'primary' | 'middle' | 'high' | 'uni', Loc>;
  schoolNames: string[];    // name parts used to build school names
  /** Formats per stage, `{name}` = one of schoolNames. */
  schoolFmt: Record<'preschool' | 'primary' | 'middle' | 'high', string>;
  /** Hospital name format, `{city}` placeholder. */
  hospital: string;
  uniNames: string[];
  companies: string[];
  drinkAge: number;
  uniCost: number;          // base units per year (tuition)
}

export interface NamePool { m: string[]; f: string[]; last: string[] }

export interface CareerDef {
  id: string;
  cat: string;
  icon: string;
  /** Level titles; each may use {m|f} for gendered forms. */
  titles: Loc<string[]>;
  minAge: number;
  partTime?: boolean;
  req?: { edu?: 'high' | 'uni' | 'grad'; majors?: string[]; program?: string; smarts?: number; looks?: number; athletic?: number };
  salary: [number, number]; // base units per year, entry → top level
  place: Place;
  outfit: string;           // css colour of the work outfit
  rating?: Rating;
  /** Special careers are not on the job board (reached via events/actions). */
  special?: boolean;
}

export interface MajorDef { id: string; name: Loc; years: number; smarts: number; icon: string }
export interface GradProgramDef { id: string; name: Loc; years: number; majors?: string[]; smarts: number; icon: string; cost: number }

export interface TraitDef { id: string; icon: string; name: Loc; desc: Loc; opposite?: string; drift?: Partial<Record<AnyStat, number>> }
export interface TalentDef { id: string; icon: string; name: Loc }
export interface DiseaseDef { id: string; icon: string; name: Loc; health: number; happy: number; chronic?: boolean; deadly?: number; minAge?: number; maxAge?: number; contagious?: boolean; curable: number }

export interface ActionDef {
  id: string;
  rating?: Rating;
  tab: Tab;
  group: string;
  icon: string;
  label: LocText;
  desc?: LocText;
  when?: Cond;
  limit?: number;           // per year
  cost?: number;            // base units
  out?: Outcome[];
  event?: string;           // show this event as a card
  open?: UiTarget;
  scene?: SceneHint;
  /** Where the action is available: free (default), prison, or anywhere. */
  where?: 'free' | 'prison' | 'any';
}

export interface RelActionDef {
  id: string;
  rating?: Rating;
  icon: string;
  label: LocText;
  roles?: RoleSel[];
  notRoles?: RoleSel[];
  minAge?: number;          // player's age
  targetMinAge?: number;
  when?: Cond;
  targetIf?: (npc: Npc, life: Life) => boolean;
  limit?: number;           // per npc per year
  cost?: number;
  out: Outcome[];
  scene?: SceneHint;
  /** Usable from prison (phone / visiting room). */
  prisonOk?: boolean;
}

export interface Balance {
  mortality: { a: number; b: number; healthK: number; childFloor: number };
  livingCost: number;       // base units per year when moved out
  livingCostHome: number;   // contribution while living with parents (adult)
  minorEvents: number[];    // probabilities of 0,1,2,3 random events (ages 3-12)
  adultEvents: number[];    // probabilities of 0,1,2,3 random events (13+)
  promoteChance: number;
  fireChance: number;
  raisePerYear: number;
  retireAge: number;
  pension: number;          // fraction of last salary
}

export interface CrimeDef {
  id: string;
  icon: string;
  label: Loc;
  desc?: Loc;
  minAge: number;
  tier: number;             // 1 petty … 5 legendary
  rating?: Rating;
  violent?: boolean;
  success: number;          // base success chance
  odds?: Partial<Record<AnyStat, number>>;
  loot?: [number, number];  // base units
  karma: number;
  fame?: number;
  heat: number;             // chance of being caught after a success
  caught: number;           // chance of being caught after a failure
  sentence: [number, number];
  minigame?: 'heist' | 'getaway' | 'lockpick' | 'hack' | 'fight';
  text: { ok: LocText; fail: LocText; caught: LocText };
  fx?: Effect;
  needs?: Cond;
}

export interface AssetDef {
  id: string;
  kind: 'house' | 'car' | 'boat' | 'aircraft' | 'luxury';
  icon: string;
  name: Loc;
  price: number;            // base units
  upkeep: number;           // yearly fraction of value
  growth: number;           // yearly value change (fraction, may be negative)
  happy: number;
  looks?: number;
  fame?: number;
  minAge?: number;
  home?: Place;             // diorama when living here
  rating?: Rating;
}

export interface StockDef { id: string; name: string; icon: string; kind: 'stock' | 'crypto'; price: number; vol: number; drift: number }
export interface SectorDef { id: string; icon: string; name: Loc; cost: number; margin: number; risk: number }
export interface AchievementDef { id: string; icon: string; name: Loc; desc: Loc; secret?: boolean; test: (life: Life, when: 'year' | 'death') => boolean }
export interface WorldEventDef { id: string; icon: string; year?: number; range?: [number, number]; chance?: number; countries?: string[]; text: LocText; fx?: Effect; market?: number; cooldown?: number }
export interface ScenarioDef { id: string; icon: string; name: Loc; desc: Loc; opts: NewLifeOptions; setup?: (life: Life, content: Content) => void }
export interface ChallengeDef { id: string; icon: string; name: Loc; desc: Loc; test: (life: Life) => boolean }

export interface Content {
  crimes: CrimeDef[];
  assets: AssetDef[];
  stocks: StockDef[];
  sectors: SectorDef[];
  achievements: AchievementDef[];
  worldEvents: WorldEventDef[];
  scenarios: ScenarioDef[];
  challenges: ChallengeDef[];
  countries: CountryDef[];
  names: Record<string, NamePool>;
  careers: CareerDef[];
  majors: MajorDef[];
  grads: GradProgramDef[];
  traits: TraitDef[];
  talents: TalentDef[];
  diseases: DiseaseDef[];
  events: EventDef[];
  /** Word pools for `{w:pool}` tokens: entries are [fr, en] complete phrases. */
  words?: Record<string, WordEntry[]>;
  /** Procedural daily-life feed lines. */
  anecdotes?: AnecdoteDef[];
  actions: ActionDef[];
  relActions: RelActionDef[];
  balance: Balance;
}

// ───────────────────────────── results ─────────────────────────────

export interface Delta { key: AnyStat | 'money' | 'rel'; value: number; npcId?: number }

export interface Resolution {
  text: Loc<string>;
  icon: string;
  tone: Tone;
  deltas: Delta[];
  mood?: Mood;
  scene?: SceneHint;
  open?: UiTarget;
  died?: boolean;
  actorId?: number;
  visual?: VisualFx[];
}

export interface YearReport {
  age: number;
  year: number;
  lines: LogLine[];
  queued: number;
  died: boolean;
  deltas: Delta[];
  milestones: string[];     // e.g. 'school:primary', 'graduate:high', 'promotion'
}

/** A word-pool entry: [fr, en] or [fr, en, rating] (1 = adult, 2 = trash; never shown to characters under 16/18). */
export type WordEntry = [string, string] | [string, string, 1 | 2];

/** A feed-only daily-life line (first person), rendered with word pools for near-infinite variety. */
export interface AnecdoteDef { id: string; icon: string; tone?: Tone; rating?: Rating; w?: number; when?: Cond; text: LocText }

export interface NewLifeOptions {
  /** Event counts from previous lives, so the same stories don't come back every life. */
  fatigue?: Record<string, number>;
  seed?: number;
  first?: string;
  last?: string;
  gender?: Gender;
  orientation?: Orientation;
  country?: string;
  city?: string;
  birthYear?: number;
  mode?: GameMode;
  family?: boolean;
  rating?: Rating;
  scenario?: string;
  challenge?: string;
  money?: number;           // starting money (base units)
  generation?: number;
  ancestors?: AncestorRecord[];
  inherit?: { money: number; assets: Asset[] };
  wealth?: Life['wealth'];
  app?: Partial<Appearance>;
}
