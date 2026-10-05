// Shared client/server types: the two-player ("duo") protocol.
export const PROTOCOL_VERSION = 2;

export type DuoMode = 'parallel' | 'shared' | 'versus' | 'coop';

/** Public snapshot of a player's life, broadcast to the partner. */
export interface PeerSummary {
  name: string;
  first: string;
  last: string;
  gender: 'm' | 'f';
  age: number;
  alive: boolean;
  country: string;
  city: string;
  job: string;
  money: string;       // formatted
  worth: number;       // base units, for scoreboards
  score: number;
  happy: number;
  health: number;
  smarts: number;
  looks: number;
  fame: number;
  karma: number;
  kids: number;
  married: boolean;
  inPrison: boolean;
  place: string;
  app: unknown;        // Appearance (for portraits)
  lifeId: string;
  linked?: boolean;    // partner is in my relations
  relRole?: string;    // role of the partner in my life
}

export type ClientMsg =
  | { t: 'hello'; v: number; name: string; code?: string; create?: boolean; mode?: DuoMode }
  | { t: 'summary'; s: PeerSummary }
  | { t: 'chat'; text: string }
  | { t: 'emote'; e: string }
  | { t: 'social'; kind: SocialKind; data?: Record<string, unknown> }
  | { t: 'op'; op: unknown }                       // shared life: operation to broadcast (ordered)
  | { t: 'vote'; key: string; i: number }          // shared life: vote on the current event
  | { t: 'snapshot'; life: unknown; hash: string } // shared life: host state for resync
  | { t: 'start'; opts: Record<string, unknown> }  // versus: same-seed start
  | { t: 'mode'; mode: DuoMode };

export type SocialKind = 'meet' | 'meet_ok' | 'meet_no' | 'date' | 'date_ok' | 'date_no' | 'propose' | 'propose_ok' | 'propose_no' | 'gift' | 'baby' | 'baby_ok' | 'baby_no'
  | 'breakup' | 'duel' | 'duel_ok' | 'duel_no' | 'duel_score' | 'slap' | 'poison' | 'heir';

export type ServerMsg =
  | { t: 'room'; code: string; you: string; mode: DuoMode; host: boolean; players: { id: string; name: string; online: boolean }[] }
  | { t: 'peer'; s: PeerSummary | null; online: boolean }
  | { t: 'chat'; from: string; name: string; text: string; at: number }
  | { t: 'emote'; from: string; e: string }
  | { t: 'social'; from: string; kind: SocialKind; data?: Record<string, unknown> }
  | { t: 'op'; seq: number; from: string; op: unknown }
  | { t: 'vote'; key: string; from: string }
  | { t: 'snapshot'; life: unknown; hash: string }
  | { t: 'start'; opts: Record<string, unknown> }
  | { t: 'error'; message: string };
