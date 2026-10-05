import { ROSTER, WEAPONS } from '../data.ts';
import { AgentState, Btn, emptyCmd, type Agent, type InputCmd } from '../types.ts';
import { DEG, Rng, wrapAngle, yawToward, type Vec3 } from '../math.ts';
import type { Simulation } from '../sim.ts';
import type { NavGrid } from '../nav/navgrid.ts';
import { GAME } from '../data.ts';

type Goal = 'roam' | 'hold' | 'search' | 'recharge' | 'retreat';

const PERCEPTION_INTERVAL = 0.1;
const FOV_COS = Math.cos(58 * DEG);
const MEMORY = 4;

/**
 * A bot is a controller that turns perception into InputCmds — it never touches the simulation directly,
 * so it can drive an agent locally or on the server, and it cannot cheat: it only knows what it can see or hear.
 */
export class BotBrain {
  private readonly sim: Simulation;
  private readonly a: Agent;
  private readonly rng: Rng;
  private readonly diff: (typeof ROSTER.difficulties)[keyof typeof ROSTER.difficulties];
  private readonly pers: (typeof ROSTER.personalities)[keyof typeof ROSTER.personalities];
  private readonly nav: NavGrid;
  private readonly cmd: InputCmd = emptyCmd();

  // perception
  private perceiveT = 0;
  private target = -1;
  private targetVisible = false;
  private lastSeen: Vec3 = { x: 0, y: 0, z: 0 };
  private lastSeenTime = -99;
  private reaction = 0;
  private errYaw = 0;
  private errPitch = 0;
  private aimHead = false;

  // aim state (smoothed view)
  private yaw = 0;
  private pitch = 0;
  private yawVel = 0;

  // navigation
  private goal: Goal = 'roam';
  private goalPos: Vec3 = { x: 0, y: 0, z: 0 };
  private path: number[] = [];
  private pathIdx = 0;
  private repathT = 0;
  private holdT = 0;
  private retreatT = 0;
  private stuckT = 0;
  private stuckRef: Vec3 = { x: 0, y: 0, z: 0 };

  // combat movement
  private strafe = 1;
  private strafeT = 0;
  private burstT = 0;
  private pauseT = 0;
  private crouchFire = false;
  private jumpT = 0;

  private eye: Vec3 = { x: 0, y: 0, z: 0 };

  constructor(sim: Simulation, a: Agent, seed: number) {
    this.sim = sim;
    this.a = a;
    this.rng = new Rng(seed);
    this.diff = ROSTER.difficulties[a.difficulty ?? 'pro'];
    this.pers = ROSTER.personalities[a.personality ?? 'aggressive'];
    this.nav = sim.ensureNav();
    this.perceiveT = this.rng.next() * PERCEPTION_INTERVAL;
  }

  onSpawn() {
    this.yaw = this.a.yaw; this.pitch = 0; this.yawVel = 0;
    this.target = -1; this.targetVisible = false; this.lastSeenTime = -99;
    this.path.length = 0; this.goal = 'roam'; this.repathT = 0;
    this.pickRoamGoal();
  }

  onKill(_victim: Agent) {
    if (this.rng.next() < 0.18) this.bark(this.a.streak >= 3 && this.rng.next() < 0.5 ? 'streak' : 'kill');
  }
  onDown(killer: Agent) {
    if (this.rng.next() < 0.12) this.bark('death');
    void killer;
  }
  private bark(kind: keyof typeof ROSTER.barks) {
    this.sim.events.push({ type: 'bark', agent: this.a.id, text: this.rng.pick(ROSTER.barks[kind]) });
  }

  think(dt: number): InputCmd {
    const a = this.a, cmd = this.cmd;
    cmd.moveX = 0; cmd.moveY = 0; cmd.buttons = 0;
    if (a.state !== AgentState.Active) { cmd.yaw = this.yaw; cmd.pitch = this.pitch; return cmd; }
    if (this.sim.mode.inputLocked) {
      this.yaw = a.yaw; cmd.yaw = a.yaw; cmd.pitch = 0;
      return cmd;
    }

    this.perceiveT -= dt;
    if (this.perceiveT <= 0) { this.perceiveT += PERCEPTION_INTERVAL; this.perceive(); }

    const tgt = this.target >= 0 ? this.sim.agents[this.target] : null;
    const engaging = !!tgt && this.targetVisible && tgt.state === AgentState.Active;

    // ---- goal selection
    this.chooseGoal(engaging, dt);

    // ---- aim
    let wantYaw = this.yaw, wantPitch = 0;
    if (engaging && tgt) {
      this.reaction -= dt;
      const aimY = tgt.pos.y + (this.aimHead ? (tgt.crouched ? 1.08 : 1.66) : (tgt.crouched ? 0.6 : 1.15));
      this.sim.eyePos(a, this.eye);
      const dx = tgt.pos.x - this.eye.x, dz = tgt.pos.z - this.eye.z, dy = aimY - this.eye.y;
      const trueYaw = yawToward(dx, dz);
      const truePitch = Math.atan2(dy, Math.hypot(dx, dz));
      // error converges ("flick then track"), with persistent human tremor
      const k = Math.exp(-this.diff.trackRate * dt);
      this.errYaw *= k; this.errPitch *= k;
      const tremor = this.diff.aimError * 0.07 * DEG;
      // target strafing adds tracking error proportional to its angular velocity
      const lat = Math.abs(tgt.vel.x * Math.cos(trueYaw) - tgt.vel.z * Math.sin(trueYaw)) / Math.max(4, Math.hypot(dx, dz));
      this.errYaw += (this.rng.gauss() * tremor) + this.rng.gauss() * lat * dt * 0.6;
      wantYaw = trueYaw + this.errYaw;
      wantPitch = truePitch + this.errPitch;
    } else {
      wantPitch = -0.04;
      const look = this.lookTarget();
      if (look) wantYaw = yawToward(look.x - a.pos.x, look.z - a.pos.z);
    }
    this.turnToward(wantYaw, wantPitch, dt, engaging);
    cmd.yaw = this.yaw; cmd.pitch = this.pitch;

    // ---- fire
    if (engaging && tgt) this.combat(tgt, dt);
    else {
      this.crouchFire = false;
      const w = WEAPONS[a.weaponId];
      if (a.heat > w.heatMax * 0.45 && this.rng.next() < dt * 2) cmd.buttons |= Btn.Vent;
    }

    // ---- move
    if (engaging && tgt) this.combatMove(tgt, dt);
    else this.followPath(dt);

    this.checkStuck(dt);
    return cmd;
  }

  // ---------------------------------------------------------------- perception
  private perceive() {
    const a = this.a, sim = this.sim;
    sim.eyePos(a, this.eye);
    const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
    const maxRange = 44 * this.diff.perception;
    let best = -1, bestScore = Infinity;
    for (const b of sim.agents) {
      if (b.team === a.team || b.state !== AgentState.Active) continue;
      const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z;
      const d = Math.hypot(dx, dz);
      if (d > maxRange) continue;
      const inFov = d < 4 || (dx * fx + dz * fz) / (d || 1) > FOV_COS || (b.id === this.target && d < 12);
      if (!inFov) continue;
      const by = b.pos.y + (b.crouched ? 0.75 : 1.2);
      if (!sim.hasLineOfSight(this.eye.x, this.eye.y, this.eye.z, b.pos.x, by, b.pos.z)) continue;
      // prefer current target, close, weak, facing away
      let score = d + (b.vest / 100) * 6 - (b.id === this.target ? 8 : 0);
      if (b.isBot === false) score -= 0.5; // tiny bias so humans get attention, never more
      if (score < bestScore) { bestScore = score; best = b.id; }
    }
    if (best >= 0) {
      const b = sim.agents[best];
      if (best !== this.target || !this.targetVisible) this.acquire(b);
      this.target = best;
      this.targetVisible = true;
      this.lastSeen.x = b.pos.x; this.lastSeen.y = b.pos.y; this.lastSeen.z = b.pos.z;
      this.lastSeenTime = sim.time;
    } else {
      this.targetVisible = false;
      if (sim.time - this.lastSeenTime > MEMORY) this.target = -1;
      // hearing: recent enemy shots nearby
      for (let i = sim.shotLog.length - 1; i >= 0; i--) {
        const s = sim.shotLog[i];
        if (sim.time - s.time > 0.25) break;
        if (s.team === a.team) continue;
        if (Math.hypot(s.x - a.pos.x, s.z - a.pos.z) < 24 * this.diff.perception) {
          if (sim.time - this.lastSeenTime > 1.0) {
            this.lastSeen.x = s.x; this.lastSeen.y = s.y - 1.6; this.lastSeen.z = s.z;
            this.lastSeenTime = sim.time - 1.5; // heard, not seen: weaker memory
          }
          break;
        }
      }
      // being shot: turn toward the attacker
      if (a.lastAttacker >= 0 && sim.time - a.lastHitTime < 0.3) {
        const at = sim.agents[a.lastAttacker];
        this.lastSeen.x = at.pos.x; this.lastSeen.y = at.pos.y; this.lastSeen.z = at.pos.z;
        this.lastSeenTime = Math.max(this.lastSeenTime, sim.time - 1);
      }
    }
  }

  private acquire(b: Agent) {
    const d = Math.hypot(b.pos.x - this.a.pos.x, b.pos.z - this.a.pos.z);
    // surprise: targets behind us / far away take longer to react to
    this.reaction = this.diff.reaction * (0.75 + this.rng.next() * 0.6) + (d > 25 ? 0.08 : 0);
    const e = this.diff.aimError * DEG;
    this.errYaw = this.rng.gauss() * e;
    this.errPitch = this.rng.gauss() * e * 0.5;
    this.aimHead = this.rng.next() < this.diff.headChance;
    this.burstT = 0.3 + this.rng.next() * 0.6;
  }

  private turnToward(wantYaw: number, wantPitch: number, dt: number, engaging: boolean) {
    const maxTurn = this.diff.turnSpeed * DEG * (engaging ? 1 : 0.55);
    const dy = wrapAngle(wantYaw - this.yaw);
    // critically damped-ish approach with a speed cap: humans decelerate near the target
    const desiredVel = Math.max(-maxTurn, Math.min(maxTurn, dy * (engaging ? 14 : 6)));
    this.yawVel += (desiredVel - this.yawVel) * Math.min(1, dt * 20);
    this.yaw = wrapAngle(this.yaw + this.yawVel * dt);
    const dp = wantPitch - this.pitch;
    this.pitch += Math.max(-maxTurn * dt, Math.min(maxTurn * dt, dp * Math.min(1, dt * (engaging ? 14 : 5))));
  }

  // ---------------------------------------------------------------- combat
  private combat(tgt: Agent, dt: number) {
    const a = this.a, cmd = this.cmd;
    const w = WEAPONS[a.weaponId];
    if (this.reaction > 0) return;
    this.sim.eyePos(a, this.eye);
    const dx = tgt.pos.x - this.eye.x, dz = tgt.pos.z - this.eye.z;
    const d = Math.hypot(dx, dz);
    const aimYaw = yawToward(dx, dz);
    const off = Math.abs(wrapAngle(aimYaw - this.yaw)) / DEG;
    const threshold = Math.max(this.diff.fireThresholdDeg, Math.atan2(0.32, d) / DEG);
    // overheat management: good bots stop before the lock, recruits spray into it
    const careful = this.diff.trackRate > 4;
    if (this.pauseT > 0) { this.pauseT -= dt; }
    else if (off < threshold && a.overheated <= 0 && a.venting <= 0) {
      if (!careful || a.heat < w.heatMax * 0.86) {
        cmd.buttons |= Btn.Fire;
        this.burstT -= dt;
        if (careful && this.burstT <= 0 && d > 14) { this.pauseT = 0.18 + this.rng.next() * 0.2; this.burstT = 0.5 + this.rng.next() * 0.7; }
      } else if (a.heat >= w.heatMax * 0.86 && this.rng.next() < dt * 3) {
        cmd.buttons |= Btn.Vent;
      }
    }
    // marksmen aim down sights at range
    if (d > 16 && (this.a.personality === 'marksman' || this.a.personality === 'camper')) cmd.buttons |= Btn.Aim;
    if (this.crouchFire) cmd.buttons |= Btn.Crouch;
  }

  private combatMove(tgt: Agent, dt: number) {
    const a = this.a, cmd = this.cmd, p = this.pers;
    const d = Math.hypot(tgt.pos.x - a.pos.x, tgt.pos.z - a.pos.z);
    this.strafeT -= dt;
    if (this.strafeT <= 0) {
      this.strafe = this.rng.next() < 0.5 ? -1 : 1;
      this.strafeT = 0.35 + this.rng.next() * 0.9;
      this.crouchFire = (a.personality === 'camper' || a.personality === 'marksman') && d > 12 && this.rng.next() < 0.5;
    }
    cmd.moveX = this.strafe * Math.min(1, p.strafe);
    if (this.crouchFire) cmd.moveX *= 0.3;
    if (d > p.engageRange + 3 && this.rng.next() < p.pushChance + 0.3) cmd.moveY = 1;
    else if (d < p.engageRange * 0.45) cmd.moveY = -0.8;
    else if (this.goal === 'retreat') cmd.moveY = -1;
    this.jumpT -= dt;
    if (this.jumpT <= 0) {
      this.jumpT = 1;
      if (this.rng.next() < p.jumpChance && a.grounded) cmd.buttons |= Btn.Jump;
    }
    // don't walk off into walls forever: if the strafe direction is blocked, flip it
    const sx = Math.cos(this.yaw) * this.strafe, sz = -Math.sin(this.yaw) * this.strafe;
    this._o.x = a.pos.x; this._o.y = a.pos.y + 0.5; this._o.z = a.pos.z;
    this._d.x = sx; this._d.y = 0; this._d.z = sz;
    if (this.sim.rayDistance(this._o, this._d, 1.2) < 1.0) { this.strafe = -this.strafe; this.strafeT = 0.5; }
  }
  private _o: Vec3 = { x: 0, y: 0, z: 0 };
  private _d: Vec3 = { x: 0, y: 0, z: 0 };

  // ---------------------------------------------------------------- goals
  private chooseGoal(engaging: boolean, dt: number) {
    const a = this.a, sim = this.sim;
    const w = WEAPONS[a.weaponId];
    this.repathT -= dt;
    if (a.vest < this.pers.retreatVest && engaging && this.goal !== 'retreat' && this.rng.next() < dt * 2) {
      this.setGoal('retreat', this.ownBase());
      this.retreatT = 2.5;
    }
    if (this.goal === 'retreat') {
      this.retreatT -= dt;
      if (this.retreatT <= 0 || a.vest > 80) this.goal = 'roam';
      else return;
    }
    if (a.energy < w.energyPerShot * 8 && this.goal !== 'recharge') {
      this.setGoal('recharge', this.nearestRecharge());
      return;
    }
    if (this.goal === 'recharge') {
      if (a.energy >= w.energyMax * 0.9) this.pickRoamGoal();
      return;
    }
    if (!engaging && this.target >= 0 && sim.time - this.lastSeenTime < MEMORY && this.goal !== 'search') {
      this.setGoal('search', this.lastSeen);
      return;
    }
    if (this.goal === 'search' && (sim.time - this.lastSeenTime > MEMORY || this.arrived(1.5))) this.pickRoamGoal();
    if (this.goal === 'roam' && this.arrived(1.5)) {
      this.goal = 'hold';
      const camper = a.personality === 'camper' || a.personality === 'marksman';
      this.holdT = camper ? 5 + this.rng.next() * 7 : 0.5 + this.rng.next() * 2;
    }
    if (this.goal === 'hold') {
      this.holdT -= dt;
      if (this.holdT <= 0) this.pickRoamGoal();
    }
    if (this.repathT <= 0 && this.goal !== 'hold') this.computePath();
  }

  private setGoal(g: Goal, p: Vec3) {
    this.goal = g;
    this.goalPos.x = p.x; this.goalPos.y = p.y; this.goalPos.z = p.z;
    this.computePath();
  }

  private ownBase(): Vec3 {
    const z = this.sim.map.zones.find((z) => z.type === 'base' && z.team === this.a.team)!;
    return { x: z.center[0] + (this.rng.next() - 0.5) * 2, y: 0, z: z.center[2] + (this.rng.next() - 0.5) * 6 };
  }
  private nearestRecharge(): Vec3 {
    let best: Vec3 = this.ownBase(), bd = Math.hypot(best.x - this.a.pos.x, best.z - this.a.pos.z);
    for (const z of this.sim.map.zones) {
      if (z.type !== 'station') continue;
      const d = Math.hypot(z.center[0] - this.a.pos.x, z.center[2] - this.a.pos.z);
      if (d < bd * 0.8) { bd = d; best = { x: z.center[0] + 0.8, y: z.center[1], z: z.center[2] + 0.8 }; }
    }
    return best;
  }

  private pickRoamGoal() {
    const hs = this.sim.map.hotspots;
    const a = this.a;
    // personality-weighted hotspot choice; aggressive bots lean toward the enemy half
    const enemySide = a.team === 0 ? 1 : -1;
    let total = 0;
    const weights = hs.map((h) => {
      let w = h.weight;
      const side = Math.sign(h.pos[0]);
      if (a.personality === 'aggressive' || a.personality === 'trickster') w *= side === enemySide ? 1.6 : 0.8;
      if (a.personality === 'careful' || a.personality === 'camper') w *= side === enemySide ? 0.5 : 1.4;
      if ((a.personality === 'marksman' || a.personality === 'camper') && (h.label.startsWith('ledge') || h.label === 'platform')) w *= 3;
      if (Math.hypot(h.pos[0] - a.pos.x, h.pos[2] - a.pos.z) < 4) w *= 0.1;
      total += w;
      return w;
    });
    let r = this.rng.next() * total;
    let pick = hs[0];
    for (let i = 0; i < hs.length; i++) { r -= weights[i]; if (r <= 0) { pick = hs[i]; break; } }
    this.setGoal('roam', { x: pick.pos[0] + this.rng.gauss() * 1.2, y: pick.pos[1], z: pick.pos[2] + this.rng.gauss() * 1.2 });
  }

  private computePath() {
    const a = this.a, nav = this.nav;
    this.repathT = 1.2 + this.rng.next() * 0.6;
    const s = nav.nearest(a.pos.x, a.pos.y, a.pos.z);
    const t = nav.nearest(this.goalPos.x, this.goalPos.y, this.goalPos.z);
    if (!nav.findPath(s, t, this.path)) this.path.length = 0;
    this.pathIdx = Math.min(1, this.path.length - 1);
  }

  private arrived(r: number) {
    return Math.hypot(this.goalPos.x - this.a.pos.x, this.goalPos.z - this.a.pos.z) < r && Math.abs(this.goalPos.y - this.a.pos.y) < 1.2;
  }

  private lookTarget(): Vec3 | null {
    const a = this.a, sim = this.sim;
    if (sim.time - this.lastSeenTime < MEMORY) return this.lastSeen;
    if (this.goal === 'hold') {
      // watch toward the enemy base while holding
      const z = sim.map.zones.find((z) => z.type === 'base' && z.team !== a.team)!;
      return { x: z.center[0], y: 0, z: z.center[2] + Math.sin(sim.time * 0.4 + a.id) * 10 };
    }
    return this.waypoint();
  }

  private waypoint(): Vec3 | null {
    const nav = this.nav, a = this.a;
    if (!this.path.length || this.pathIdx >= this.path.length) return null;
    // advance along the path once close to the current node
    while (this.pathIdx < this.path.length - 1) {
      const n = this.path[this.pathIdx];
      if (Math.hypot(nav.x(n) - a.pos.x, nav.z(n) - a.pos.z) < 0.7) this.pathIdx++;
      else break;
    }
    // look ahead: skip to the furthest node (≤ 8 ahead) reachable in a straight line on the same level
    let best = this.pathIdx;
    for (let k = this.pathIdx + 1; k < Math.min(this.path.length, this.pathIdx + 8); k++) {
      const n = this.path[k];
      if (Math.abs(nav.y(n) - a.pos.y) > 0.3) break;
      if (!this.sim.hasLineOfSight(a.pos.x, a.pos.y + 0.45, a.pos.z, nav.x(n), nav.y(n) + 0.45, nav.z(n))) break;
      best = k;
    }
    const n = this.path[best];
    this._wp.x = nav.x(n); this._wp.y = nav.y(n); this._wp.z = nav.z(n);
    return this._wp;
  }
  private _wp: Vec3 = { x: 0, y: 0, z: 0 };

  private followPath(_dt: number) {
    const a = this.a, cmd = this.cmd;
    if (this.goal === 'hold') return;
    const wp = this.waypoint();
    if (!wp) return;
    const dx = wp.x - a.pos.x, dz = wp.z - a.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.05) return;
    // world direction → local axes relative to our yaw
    const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
    const rx = Math.cos(this.yaw), rz = -Math.sin(this.yaw);
    const wx = dx / d, wz = dz / d;
    cmd.moveY = wx * fx + wz * fz;
    cmd.moveX = wx * rx + wz * rz;
    const remaining = this.path.length - this.pathIdx;
    if (cmd.moveY > 0.8 && remaining > 10 && this.goal !== 'search') cmd.buttons |= Btn.Sprint;
  }

  private checkStuck(dt: number) {
    const a = this.a;
    const moving = Math.abs(this.cmd.moveX) + Math.abs(this.cmd.moveY) > 0.3;
    this.stuckT += dt;
    if (this.stuckT > 1.4) {
      const moved = Math.hypot(a.pos.x - this.stuckRef.x, a.pos.z - this.stuckRef.z);
      if (moving && moved < 0.6) {
        this.cmd.buttons |= Btn.Jump;
        if (this.goal !== 'retreat') this.pickRoamGoal();
      }
      this.stuckT = 0;
      this.stuckRef.x = a.pos.x; this.stuckRef.z = a.pos.z;
    }
  }
}

export const BOT_SPEED_HINT = GAME.movement.runSpeed;
