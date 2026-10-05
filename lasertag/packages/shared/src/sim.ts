import type RAPIER from '@dimforge/rapier3d-compat';
import { buildArenaPhysics, initPhysics, QUERY_STATIC, RAPIER as R, type ArenaPhysics } from './physics.ts';
import { createAgentCollider, createKcc, placeCollider, setAgentSolid, stepMovement, STAND_HALF, type MoveContext } from './movement.ts';
import { computePose, createPose, rayVsPose, type RayHit } from './hitbox.ts';
import { GAME, MODES, ROSTER, WEAPONS, type Difficulty, type Personality, type DamageZone } from './data.ts';
import { AgentState, Btn, emptyCmd, type Agent, type InputCmd, type SimEvent } from './types.ts';
import { DEG, Rng, forwardFromAngles, type Vec3 } from './math.ts';
import type { MapDef, MapZone } from './map/types.ts';
import { TdmMode } from './modes/tdm.ts';
import { NavGrid } from './nav/navgrid.ts';
import { BotBrain } from './bots/brain.ts';

export interface AgentSpec {
  name: string;
  team: number;
  isBot: boolean;
  difficulty?: Difficulty;
  personality?: Personality;
}

export interface ShotRecord { shooter: number; team: number; x: number; y: number; z: number; time: number }

export interface SimOptions {
  map: MapDef;
  mode?: string;
  seed?: number;
}

/**
 * The authoritative game simulation. Runs at a fixed tick in the browser (solo) and in Node (server, tools).
 * Agents are driven by InputCmds only; bots produce theirs through BotBrain.
 */
export class Simulation {
  readonly map: MapDef;
  readonly phys: ArenaPhysics;
  readonly world: RAPIER.World;
  readonly kcc: RAPIER.KinematicCharacterController;
  readonly dt = 1 / GAME.tickRate;
  readonly agents: Agent[] = [];
  readonly colliders: RAPIER.Collider[] = [];
  readonly brains = new Map<number, BotBrain>();
  readonly mode: TdmMode;
  readonly rng: Rng;
  readonly events: SimEvent[] = [];
  /** recent shots (bots "hear" them) */
  readonly shotLog: ShotRecord[] = [];
  nav: NavGrid | null = null;
  time = 0;
  tick = 0;
  firstBlood = false;

  private moveCtx: MoveContext;
  private cmds = new Map<number, InputCmd>();
  private ray: RAPIER.Ray;
  private pose = createPose();
  private rayHit: RayHit = { t: 0, zone: 'chest' };
  private usedNames = new Set<string>();

  static async create(opts: SimOptions): Promise<Simulation> {
    await initPhysics();
    return new Simulation(opts);
  }

  private constructor(opts: SimOptions) {
    this.map = opts.map;
    this.rng = new Rng(opts.seed ?? 1234);
    this.phys = buildArenaPhysics(opts.map);
    this.world = this.phys.world;
    this.kcc = createKcc(this.world);
    this.mode = new TdmMode(MODES[opts.mode ?? 'tdm']);
    this.ray = new R.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 });
    this.moveCtx = { world: this.world, kcc: this.kcc, collider: null as unknown as RAPIER.Collider, time: 0, allowInput: true, events: this.events };
  }

  /** Build the bot navigation grid (lazily; tools and server may not need it). */
  ensureNav(): NavGrid {
    if (!this.nav) {
      const s = this.map.spawns[0].pos;
      this.nav = NavGrid.build(this.world, this.map, { x: s[0], y: s[1], z: s[2] });
    }
    return this.nav;
  }

  botName(): string {
    const free = ROSTER.names.filter((n) => !this.usedNames.has(n));
    const name = free.length ? this.rng.pick(free) : `Bot-${this.agents.length}`;
    this.usedNames.add(name);
    return name;
  }

  addAgent(spec: AgentSpec): Agent {
    const id = this.agents.length;
    const a: Agent = {
      id, name: spec.name, team: spec.team, isBot: spec.isBot, difficulty: spec.difficulty, personality: spec.personality,
      pos: { x: 0, y: 0, z: 0 }, prevPos: { x: 0, y: 0, z: 0 }, vel: { x: 0, y: 0, z: 0 },
      yaw: 0, pitch: 0, grounded: false, crouch: 0, crouched: false, sprinting: false, sliding: 0, slideCooldown: 0,
      coyote: 0, jumpBuffer: 0, airTime: 0, landImpact: 0, aiming: false,
      state: AgentState.Active, vest: GAME.vest.maxCharge, lastHitTime: -99, downTimer: 0, invuln: 0, fireLock: 0, jammed: 0,
      weaponId: 'photon7', energy: WEAPONS.photon7.energyMax, heat: 0, overheated: 0, venting: 0, fireCooldown: 0, bloom: 0,
      lastShotTime: -99, shotSeq: 0,
      streak: 0, lastAttacker: -1, lastDownBy: -1, multi: 0, lastKillTime: -99,
      stats: { deactivations: 0, downs: 0, shots: 0, hits: 0, headshots: 0, backshots: 0, bestStreak: 0, score: 0 },
      prevButtons: 0,
    };
    this.usedNames.add(spec.name);
    this.agents.push(a);
    this.colliders.push(createAgentCollider(this.world));
    this.cmds.set(id, emptyCmd());
    if (spec.isBot) {
      this.ensureNav();
      this.brains.set(id, new BotBrain(this, a, this.rng.int(1 << 30)));
    }
    this.spawn(a, true);
    return a;
  }

  /** Set the command an externally-driven agent (local player / network) will use next tick. */
  setInput(id: number, cmd: InputCmd) {
    const c = this.cmds.get(id)!;
    c.moveX = cmd.moveX; c.moveY = cmd.moveY; c.yaw = cmd.yaw; c.pitch = cmd.pitch; c.buttons = cmd.buttons;
  }

  /** Clears and returns the events produced since the last call (consumer owns the array contents). */
  drainEvents(out: SimEvent[]): SimEvent[] {
    for (const e of this.events) out.push(e);
    this.events.length = 0;
    return out;
  }

  step() {
    const dt = this.dt;
    this.time += dt;
    this.tick++;
    this.moveCtx.time = this.time;
    const locked = this.mode.inputLocked;

    for (const [id, brain] of this.brains) {
      const cmd = brain.think(dt);
      this.setInput(id, cmd);
    }

    for (const a of this.agents) {
      const cmd = this.cmds.get(a.id)!;
      const col = this.colliders[a.id];
      if (a.state === AgentState.Active) {
        a.yaw = cmd.yaw;
        a.pitch = Math.max(-1.45, Math.min(1.45, cmd.pitch));
      }
      this.moveCtx.collider = col;
      this.moveCtx.allowInput = !locked && a.state === AgentState.Active;
      stepMovement(a, cmd, dt, this.moveCtx);
      if (a.state === AgentState.Active) this.stepWeapon(a, locked ? 0 : cmd.buttons, dt);
      else this.stepDown(a, dt);
      this.stepZones(a, dt);
      a.prevButtons = locked ? 0 : cmd.buttons;
    }
    this.world.step();

    // forget old shots
    while (this.shotLog.length && this.time - this.shotLog[0].time > 1.0) this.shotLog.shift();

    this.mode.update(this, dt);
  }

  // ------------------------------------------------------------------ weapon
  private stepWeapon(a: Agent, buttons: number, dt: number) {
    const w = WEAPONS[a.weaponId];
    const pressed = buttons & ~a.prevButtons;
    a.fireCooldown -= dt;
    a.invuln = Math.max(0, a.invuln - dt);
    a.fireLock = Math.max(0, a.fireLock - dt);
    a.jammed = Math.max(0, a.jammed - dt);
    a.bloom = Math.max(0, a.bloom - w.spread.bloomRecovery * dt);

    if (a.overheated > 0) {
      a.overheated -= dt;
      a.heat = Math.max(0, a.heat - (w.heatMax / w.overheatLock) * dt);
      if (a.overheated <= 0) { a.overheated = 0; a.heat = 0; }
    } else if (a.venting > 0) {
      a.venting -= dt;
      a.heat = Math.max(0, a.heat - (w.heatMax / w.ventTime) * 1.2 * dt);
      if (a.venting <= 0) { a.venting = 0; a.heat = 0; }
    } else if (this.time - a.lastShotTime > w.coolDelay) {
      a.heat = Math.max(0, a.heat - w.coolRate * dt);
    }

    if ((pressed & Btn.Vent) && a.heat > 8 && a.overheated <= 0 && a.venting <= 0) {
      a.venting = w.ventTime;
      this.events.push({ type: 'vent', agent: a.id });
    }

    if (a.fireCooldown < 0) a.fireCooldown = 0;
    if (!(buttons & Btn.Fire)) return;
    if (a.fireCooldown > 0 || a.overheated > 0 || a.venting > 0 || a.jammed > 0 || a.fireLock > 0) return;
    if (a.energy < w.energyPerShot) {
      if (pressed & Btn.Fire) this.events.push({ type: 'empty', agent: a.id });
      a.fireCooldown = 0.3;
      return;
    }
    this.fire(a);
  }

  private _dir: Vec3 = { x: 0, y: 0, z: 0 };
  private _origin: Vec3 = { x: 0, y: 0, z: 0 };

  /** Current total spread cone (degrees) for an agent, as used by the next shot. */
  spreadDeg(a: Agent): number {
    const s = WEAPONS[a.weaponId].spread;
    const speed = Math.min(1, Math.hypot(a.vel.x, a.vel.z) / GAME.movement.runSpeed);
    let deg = s.baseDeg + s.moveDeg * speed * speed + (a.grounded ? 0 : s.airDeg);
    if (a.crouched && a.sliding <= 0) deg *= s.crouchMul;
    if (a.aiming) deg *= s.adsMul;
    return deg + a.bloom * (a.aiming ? 0.6 : 1);
  }

  eyePos(a: Agent, out: Vec3): Vec3 {
    out.x = a.pos.x;
    out.y = a.pos.y + (a.crouched ? GAME.movement.crouchEyeHeight : GAME.movement.eyeHeight);
    out.z = a.pos.z;
    return out;
  }

  private fire(a: Agent) {
    const w = WEAPONS[a.weaponId];
    a.energy -= w.energyPerShot;
    a.heat += w.heatPerShot;
    a.fireCooldown += w.fireInterval;
    a.lastShotTime = this.time;
    a.sprinting = false;
    a.shotSeq++;
    a.stats.shots++;

    // spread: uniform in a cone
    const spread = this.spreadDeg(a) * DEG;
    a.bloom = Math.min(w.spread.maxBloomDeg, a.bloom + w.spread.perShotDeg);
    const d = forwardFromAngles(a.yaw, a.pitch, this._dir);
    const r = spread * Math.sqrt(this.rng.next()), th = this.rng.next() * Math.PI * 2;
    const ox = Math.cos(th) * r, oy = Math.sin(th) * r;
    // right = (cos yaw, 0, -sin yaw); up = right x forward
    const rx = Math.cos(a.yaw), rz = -Math.sin(a.yaw);
    const ux = -rz * d.y, uy = rz * d.x - rx * d.z, uz = rx * d.y;
    d.x += rx * ox + ux * oy; d.y += uy * oy; d.z += rz * ox + uz * oy;
    const dl = Math.hypot(d.x, d.y, d.z); d.x /= dl; d.y /= dl; d.z /= dl;

    const o = this.eyePos(a, this._origin);
    this.ray.origin = o;
    this.ray.dir = d;
    const hit = this.world.castRayAndGetNormal(this.ray, w.range, true, undefined, QUERY_STATIC);
    let t = hit ? hit.timeOfImpact : w.range;
    let normal: Vec3 = hit ? { x: hit.normal.x, y: hit.normal.y, z: hit.normal.z } : { x: -d.x, y: -d.y, z: -d.z };
    let surface: 'wall' | 'mirror' | 'agent' | 'none' = hit ? (this.phys.surfaces.get(hit.collider.handle) ?? 'wall') : 'none';

    let target: Agent | null = null;
    let zone: DamageZone | null = null;
    for (const b of this.agents) {
      if (b === a || b.state !== AgentState.Active || b.team === a.team) continue;
      const h = rayVsPose(o, d, computePose(b, this.pose), t, this.rayHit);
      if (h) { t = h.t; target = b; zone = h.zone; }
    }
    const to = { x: o.x + d.x * t, y: o.y + d.y * t, z: o.z + d.z * t };
    if (target) { surface = 'agent'; normal = { x: -d.x, y: -d.y, z: -d.z }; }
    this.shotLog.push({ shooter: a.id, team: a.team, x: o.x, y: o.y, z: o.z, time: this.time });
    this.events.push({ type: 'shot', shooter: a.id, from: { x: o.x, y: o.y, z: o.z }, to, normal, hitAgent: target ? target.id : -1, zone, surface });

    if (a.heat >= w.heatMax) {
      a.heat = w.heatMax;
      a.overheated = w.overheatLock;
      this.events.push({ type: 'overheat', agent: a.id });
    }
    if (target && zone) this.applyHit(a, target, zone, d);
  }

  applyHit(shooter: Agent, target: Agent, zone: DamageZone, dir: Vec3) {
    const w = WEAPONS[shooter.weaponId];
    if (target.invuln > 0) {
      this.events.push({ type: 'hit', shooter: shooter.id, target: target.id, zone, damage: 0, vest: target.vest, dir: { x: dir.x, y: dir.y, z: dir.z } });
      return;
    }
    const dmg = w.damage[zone];
    target.vest = Math.max(0, target.vest - dmg);
    target.lastHitTime = this.time;
    target.lastAttacker = shooter.id;
    shooter.stats.hits++;
    shooter.stats.score += dmg;
    if (zone === 'head') shooter.stats.headshots++;
    if (zone === 'back') shooter.stats.backshots++;
    if (zone === 'blaster') {
      target.jammed = w.jamTime;
      this.events.push({ type: 'jammed', agent: target.id });
    }
    this.events.push({ type: 'hit', shooter: shooter.id, target: target.id, zone, damage: dmg, vest: target.vest, dir: { x: dir.x, y: dir.y, z: dir.z } });
    if (target.vest <= 0) this.deactivate(target, shooter, zone);
  }

  private deactivate(v: Agent, k: Agent, zone: DamageZone) {
    v.state = AgentState.Down;
    v.downTimer = GAME.vest.shutdownTime;
    v.streak = 0;
    v.stats.downs++;
    v.sprinting = false; v.aiming = false;
    setAgentSolid(this.colliders[v.id], false);
    const revenge = k.lastDownBy === v.id;
    v.lastDownBy = k.id;
    k.streak++;
    k.stats.deactivations++;
    k.stats.bestStreak = Math.max(k.stats.bestStreak, k.streak);
    k.multi = this.time - k.lastKillTime < 4 ? k.multi + 1 : 1;
    k.lastKillTime = this.time;
    if (revenge) k.lastDownBy = -1;
    const firstBlood = !this.firstBlood && this.mode.canScore;
    if (firstBlood) this.firstBlood = true;
    this.events.push({ type: 'down', target: v.id, by: k.id, zone, streak: k.streak, firstBlood, revenge });
    this.mode.onDeactivation(this, k, v);
    if (firstBlood) this.events.push({ type: 'announce', key: 'firstBlood', agent: k.id });
    else if (k.multi === 2) this.events.push({ type: 'announce', key: 'double', agent: k.id });
    else if (k.multi === 3) this.events.push({ type: 'announce', key: 'triple', agent: k.id });
    else if (k.multi >= 4) this.events.push({ type: 'announce', key: 'rampage', agent: k.id });
    else if (k.streak === 5 || k.streak === 10) this.events.push({ type: 'announce', key: 'unstoppable', agent: k.id });
    else if (revenge) this.events.push({ type: 'announce', key: 'revenge', agent: k.id });
    this.brains.get(k.id)?.onKill(v);
    this.brains.get(v.id)?.onDown(k);
  }

  private stepDown(a: Agent, dt: number) {
    a.downTimer -= dt;
    if (a.downTimer <= 0 && this.mode.phase !== 'ended') this.spawn(a, false);
  }

  /** Pick a spawn of the team that is far from visible enemies, with some randomness. */
  spawn(a: Agent, initial: boolean) {
    const spawns = this.map.spawns.filter((s) => s.team === a.team);
    let best = spawns[0], bestScore = -Infinity;
    for (const s of spawns) {
      let minD = 99;
      for (const b of this.agents) {
        if (b === a || b.state !== AgentState.Active) continue;
        const d = Math.hypot(b.pos.x - s.pos[0], b.pos.z - s.pos[2]);
        if (b.team !== a.team) minD = Math.min(minD, d);
        else if (d < 1.0) minD = Math.min(minD, d * 2); // avoid stacking on allies
      }
      const score = minD + this.rng.next() * 4;
      if (score > bestScore) { bestScore = score; best = s; }
    }
    a.pos.x = best.pos[0]; a.pos.y = best.pos[1] + 0.02; a.pos.z = best.pos[2];
    a.prevPos.x = a.pos.x; a.prevPos.y = a.pos.y; a.prevPos.z = a.pos.z;
    a.vel.x = a.vel.y = a.vel.z = 0;
    a.yaw = best.yaw; a.pitch = 0;
    a.state = AgentState.Active;
    a.vest = GAME.vest.maxCharge;
    a.energy = WEAPONS[a.weaponId].energyMax;
    a.heat = 0; a.overheated = 0; a.venting = 0; a.jammed = 0; a.bloom = 0;
    a.crouched = false; a.crouch = 0; a.sliding = 0;
    a.invuln = initial ? 0 : GAME.vest.respawnInvuln;
    a.fireLock = initial ? 0 : GAME.vest.respawnFireLock;
    const col = this.colliders[a.id];
    col.setHalfHeight(STAND_HALF);
    placeCollider(a, col);
    setAgentSolid(col, true);
    const cmd = this.cmds.get(a.id)!;
    cmd.yaw = a.yaw; cmd.pitch = 0;
    if (!initial) this.events.push({ type: 'respawn', agent: a.id });
    this.brains.get(a.id)?.onSpawn();
  }

  // ------------------------------------------------------------------ zones
  zoneContains(z: MapZone, p: Vec3): boolean {
    if (z.type === 'station') return Math.hypot(p.x - z.center[0], p.z - z.center[2]) < GAME.energy.stationRadius && Math.abs(p.y - z.center[1]) < 2;
    return Math.abs(p.x - z.center[0]) <= z.size[0] && Math.abs(p.z - z.center[2]) <= z.size[2] && Math.abs(p.y - z.center[1]) <= z.size[1];
  }

  /** 'base' | 'station' | null — where the agent currently recharges. */
  rechargeZone(a: Agent): 'base' | 'station' | null {
    for (const z of this.map.zones) {
      if (z.type === 'base' && z.team !== a.team) continue;
      if (this.zoneContains(z, a.pos)) return z.type;
    }
    return null;
  }

  private stepZones(a: Agent, dt: number) {
    if (a.state !== AgentState.Active) return;
    const w = WEAPONS[a.weaponId];
    const E = GAME.energy, V = GAME.vest;
    const zone = this.rechargeZone(a);
    if (zone === 'base') {
      a.energy = Math.min(w.energyMax, a.energy + E.baseRechargeRate * dt);
      if (this.time - a.lastHitTime > 1) a.vest = Math.min(V.maxCharge, a.vest + V.regenRate * 2 * dt);
    } else if (zone === 'station') {
      a.energy = Math.min(w.energyMax, a.energy + E.stationRechargeRate * dt);
    } else if (this.time - a.lastShotTime > E.passiveRegenDelay && a.energy < E.passiveRegenCap) {
      a.energy = Math.min(E.passiveRegenCap, a.energy + E.passiveRegenRate * dt);
    }
    if (this.time - a.lastHitTime > V.regenDelay) a.vest = Math.min(V.maxCharge, a.vest + V.regenRate * dt);
  }

  /** Line of sight between two points against the static arena. */
  private losRay = new R.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 });
  private losO = { x: 0, y: 0, z: 0 };
  private losD = { x: 0, y: 0, z: 0 };
  hasLineOfSight(ax: number, ay: number, az: number, bx: number, by: number, bz: number): boolean {
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const l = Math.hypot(dx, dy, dz);
    if (l < 1e-4) return true;
    this.losO.x = ax; this.losO.y = ay; this.losO.z = az;
    this.losD.x = dx / l; this.losD.y = dy / l; this.losD.z = dz / l;
    this.losRay.origin = this.losO; this.losRay.dir = this.losD;
    return this.world.castRay(this.losRay, l, true, undefined, QUERY_STATIC) === null;
  }

  /** Distance to the first static obstacle along a ray (or maxDist). */
  rayDistance(o: Vec3, d: Vec3, maxDist: number): number {
    this.losRay.origin = o; this.losRay.dir = d;
    const h = this.world.castRay(this.losRay, maxDist, true, undefined, QUERY_STATIC);
    return h ? h.timeOfImpact : maxDist;
  }
}
