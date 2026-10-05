import type { Vec3 } from './math.ts';
import type { DamageZone, Difficulty, Personality } from './data.ts';

/** Bit flags of InputCmd.buttons. */
export const Btn = {
  Fire: 1 << 0,
  Aim: 1 << 1,
  Jump: 1 << 2,
  Crouch: 1 << 3,
  Sprint: 1 << 4,
  Vent: 1 << 5,
  Interact: 1 << 6,
} as const;

/** One tick of intent from a player, a bot or the network. */
export interface InputCmd {
  /** strafe -1..1 (right +) */
  moveX: number;
  /** forward -1..1 (forward +) */
  moveY: number;
  yaw: number;
  pitch: number;
  buttons: number;
}
export const emptyCmd = (): InputCmd => ({ moveX: 0, moveY: 0, yaw: 0, pitch: 0, buttons: 0 });

export const enum AgentState {
  Active = 0,
  Down = 1,
}

export interface AgentStats {
  deactivations: number;
  downs: number;
  shots: number;
  hits: number;
  headshots: number;
  backshots: number;
  bestStreak: number;
  score: number;
}

export interface Agent {
  id: number;
  name: string;
  team: number;
  isBot: boolean;
  difficulty?: Difficulty;
  personality?: Personality;

  // kinematics (feet position)
  pos: Vec3;
  prevPos: Vec3;
  vel: Vec3;
  yaw: number;
  pitch: number;
  grounded: boolean;
  crouch: number; // 0..1 (visual blend, sim uses crouched flag)
  crouched: boolean;
  sprinting: boolean;
  sliding: number; // remaining slide time
  slideCooldown: number;
  coyote: number;
  jumpBuffer: number;
  airTime: number;
  landImpact: number; // last landing speed (for fx)
  aiming: boolean;

  // vest
  state: AgentState;
  vest: number;
  lastHitTime: number;
  downTimer: number;
  invuln: number;
  fireLock: number;
  jammed: number;

  // blaster
  weaponId: string;
  energy: number;
  heat: number;
  overheated: number; // lock timer
  venting: number;
  fireCooldown: number;
  bloom: number; // current extra spread (deg)
  lastShotTime: number;
  shotSeq: number;

  // bookkeeping
  streak: number;
  lastAttacker: number;
  lastDownBy: number;
  multi: number;
  lastKillTime: number;
  stats: AgentStats;
  prevButtons: number;
}

export type SimEvent =
  | { type: 'shot'; shooter: number; from: Vec3; to: Vec3; normal: Vec3; hitAgent: number; zone: DamageZone | null; surface: 'wall' | 'mirror' | 'agent' | 'none' }
  | { type: 'hit'; shooter: number; target: number; zone: DamageZone; damage: number; vest: number; dir: Vec3 }
  | { type: 'down'; target: number; by: number; zone: DamageZone; streak: number; firstBlood: boolean; revenge: boolean }
  | { type: 'respawn'; agent: number }
  | { type: 'jammed'; agent: number }
  | { type: 'overheat'; agent: number }
  | { type: 'vent'; agent: number }
  | { type: 'jump'; agent: number }
  | { type: 'land'; agent: number; speed: number }
  | { type: 'slide'; agent: number }
  | { type: 'empty'; agent: number }
  | { type: 'score'; team: number; scores: number[] }
  | { type: 'phase'; phase: MatchPhase; timeLeft: number }
  | { type: 'bark'; agent: number; text: string }
  | { type: 'announce'; key: AnnounceKey; agent?: number; team?: number };

export type AnnounceKey =
  | 'firstBlood' | 'double' | 'triple' | 'rampage' | 'unstoppable'
  | 'oneMinute' | 'thirtySeconds' | 'tenSeconds' | 'overtime' | 'victory' | 'defeat' | 'draw'
  | 'leadTaken' | 'leadLost' | 'go' | 'headshot' | 'revenge' | 'shutdownStreak';

export type MatchPhase = 'warmup' | 'playing' | 'overtime' | 'ended';

export type { DamageZone, Difficulty, Personality };
