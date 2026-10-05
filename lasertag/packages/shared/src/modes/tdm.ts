import type { ModeDef } from '../data.ts';
import type { Agent, MatchPhase, SimEvent } from '../types.ts';

export interface ModeHost {
  events: SimEvent[];
  agents: Agent[];
}

/** Team Deathmatch: 1 point per deactivation, time or score limit, short sudden death. */
export class TdmMode {
  readonly def: ModeDef;
  phase: MatchPhase = 'warmup';
  timeLeft: number;
  scores = [0, 0];
  winner = -1; // -1 = none yet / draw when ended
  elapsed = 0;
  private leader = -1;
  private announced = new Set<string>();
  /** time series of the score difference (for the end-of-match graph), sampled every 5 s */
  timeline: { t: number; s0: number; s1: number }[] = [];
  private sampleT = 0;

  constructor(def: ModeDef) {
    this.def = def;
    this.timeLeft = def.warmup;
  }

  get inputLocked() { return this.phase === 'warmup' || this.phase === 'ended'; }
  get canScore() { return this.phase === 'playing' || this.phase === 'overtime'; }

  update(host: ModeHost, dt: number) {
    if (this.phase === 'ended') return;
    this.timeLeft -= dt;
    if (this.phase !== 'warmup') {
      this.elapsed += dt;
      this.sampleT += dt;
      if (this.sampleT >= 5) { this.sampleT = 0; this.timeline.push({ t: this.elapsed, s0: this.scores[0], s1: this.scores[1] }); }
    }
    if (this.phase === 'warmup') {
      if (this.timeLeft <= 0) {
        this.setPhase(host, 'playing', this.def.timeLimit);
        host.events.push({ type: 'announce', key: 'go' });
        this.timeline.push({ t: 0, s0: 0, s1: 0 });
      }
      return;
    }
    if (this.phase === 'playing') {
      this.timeCallouts(host);
      if (this.timeLeft <= 0) {
        if (this.scores[0] === this.scores[1]) {
          this.setPhase(host, 'overtime', this.def.overtimeLimit);
          host.events.push({ type: 'announce', key: 'overtime' });
        } else this.end(host);
      }
      return;
    }
    if (this.phase === 'overtime' && this.timeLeft <= 0) this.end(host);
  }

  private timeCallouts(host: ModeHost) {
    const marks: [number, 'oneMinute' | 'thirtySeconds' | 'tenSeconds'][] = [[60, 'oneMinute'], [30, 'thirtySeconds'], [10, 'tenSeconds']];
    for (const [t, key] of marks) {
      if (this.timeLeft <= t && this.def.timeLimit > t + 5 && !this.announced.has(key)) {
        this.announced.add(key);
        host.events.push({ type: 'announce', key });
      }
    }
  }

  onDeactivation(host: ModeHost, killer: Agent, victim: Agent) {
    if (!this.canScore || killer.team === victim.team) return;
    this.scores[killer.team] += this.def.pointsPerDeactivation;
    killer.stats.score += 100;
    host.events.push({ type: 'score', team: killer.team, scores: this.scores.slice() });
    const lead = this.scores[0] > this.scores[1] ? 0 : this.scores[1] > this.scores[0] ? 1 : -1;
    if (lead !== this.leader && lead >= 0) host.events.push({ type: 'announce', key: 'leadTaken', team: lead });
    this.leader = lead;
    if (this.phase === 'overtime' || this.scores[killer.team] >= this.def.scoreLimit) this.end(host);
  }

  private setPhase(host: ModeHost, phase: MatchPhase, time: number) {
    this.phase = phase;
    this.timeLeft = time;
    host.events.push({ type: 'phase', phase, timeLeft: time });
  }

  private end(host: ModeHost) {
    this.winner = this.scores[0] > this.scores[1] ? 0 : this.scores[1] > this.scores[0] ? 1 : -1;
    this.timeline.push({ t: this.elapsed, s0: this.scores[0], s1: this.scores[1] });
    this.setPhase(host, 'ended', 0);
  }
}
