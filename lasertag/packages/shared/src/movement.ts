import type RAPIER from '@dimforge/rapier3d-compat';
import { RAPIER as R, AGENT_GROUPS, QUERY_STATIC, groups, GROUP_AGENT, GROUP_STATIC } from './physics.ts';
import { GAME } from './data.ts';
import { Btn, type Agent, type InputCmd, type SimEvent } from './types.ts';
import { DEG } from './math.ts';

const M = GAME.movement;
export const STAND_HALF = M.height / 2 - M.radius;
export const CROUCH_HALF = M.crouchHeight / 2 - M.radius;

export function createKcc(world: RAPIER.World): RAPIER.KinematicCharacterController {
  const kcc = world.createCharacterController(0.02);
  kcc.enableAutostep(M.stepHeight, 0.15, false);
  kcc.setMaxSlopeClimbAngle(M.maxSlopeDeg * DEG);
  kcc.setMinSlopeSlideAngle((M.maxSlopeDeg + 4) * DEG);
  kcc.enableSnapToGround(M.snapDistance);
  kcc.setApplyImpulsesToDynamicBodies(false);
  kcc.setSlideEnabled(true);
  return kcc;
}

export function createAgentCollider(world: RAPIER.World): RAPIER.Collider {
  const desc = R.ColliderDesc.capsule(STAND_HALF, M.radius).setCollisionGroups(AGENT_GROUPS);
  return world.createCollider(desc);
}

/** Make the agent's capsule (in)visible to other agents (down agents are ghosts). */
export function setAgentSolid(c: RAPIER.Collider, solid: boolean) {
  c.setCollisionGroups(solid ? AGENT_GROUPS : groups(0, GROUP_STATIC));
}

export function placeCollider(a: Agent, c: RAPIER.Collider) {
  const half = a.crouched ? CROUCH_HALF : STAND_HALF;
  c.setTranslation({ x: a.pos.x, y: a.pos.y + half + M.radius, z: a.pos.z });
}

const _desired = { x: 0, y: 0, z: 0 };
const _mv = { x: 0, y: 0, z: 0 };
const _standShape = new R.Capsule(STAND_HALF, M.radius - 0.02);
const _rot = { x: 0, y: 0, z: 0, w: 1 };
const _probe = { x: 0, y: 0, z: 0 };

function canStand(world: RAPIER.World, a: Agent, self: RAPIER.Collider): boolean {
  _probe.x = a.pos.x; _probe.y = a.pos.y + STAND_HALF + M.radius + 0.02; _probe.z = a.pos.z;
  const hit = world.intersectionWithShape(_probe, _rot, _standShape, undefined, groups(0xffff, GROUP_STATIC | GROUP_AGENT), self);
  return hit === null;
}

export interface MoveContext {
  world: RAPIER.World;
  kcc: RAPIER.KinematicCharacterController;
  collider: RAPIER.Collider;
  time: number;
  /** false during warmup / when the agent is down */
  allowInput: boolean;
  events: SimEvent[];
}

/**
 * Advance one agent's movement by one fixed tick. Shared verbatim by client prediction and server.
 * Quake-style acceleration/friction, slide, coyote time and jump buffering on top of Rapier's KCC.
 */
export function stepMovement(a: Agent, cmd: InputCmd, dt: number, ctx: MoveContext) {
  const { world, kcc, collider } = ctx;
  const btn = ctx.allowInput ? cmd.buttons : 0;
  const pressed = btn & ~a.prevButtons;
  let mx = ctx.allowInput ? cmd.moveX : 0, my = ctx.allowInput ? cmd.moveY : 0;
  const ml = Math.hypot(mx, my);
  if (ml > 1) { mx /= ml; my /= ml; }

  a.prevPos.x = a.pos.x; a.prevPos.y = a.pos.y; a.prevPos.z = a.pos.z;
  a.aiming = (btn & Btn.Aim) !== 0;

  // ---- timers
  a.coyote = a.grounded ? M.coyoteTime : Math.max(0, a.coyote - dt);
  a.jumpBuffer = pressed & Btn.Jump ? M.jumpBuffer : Math.max(0, a.jumpBuffer - dt);
  a.slideCooldown = Math.max(0, a.slideCooldown - dt);

  const hSpeed = Math.hypot(a.vel.x, a.vel.z);
  const wantCrouch = (btn & Btn.Crouch) !== 0;

  // ---- slide start: crouch while sprinting fast on the ground
  if ((pressed & Btn.Crouch) && a.grounded && hSpeed >= M.slideMinSpeed && a.slideCooldown <= 0) {
    a.sliding = M.slideDuration;
    a.slideCooldown = M.slideDuration + M.slideCooldown;
    const boost = Math.min(M.slideMaxSpeed, hSpeed + M.slideBoost) / hSpeed;
    a.vel.x *= boost; a.vel.z *= boost;
    ctx.events.push({ type: 'slide', agent: a.id });
  }
  if (a.sliding > 0) {
    a.sliding -= dt;
    if (!wantCrouch || hSpeed < M.crouchSpeed) a.sliding = 0;
  }

  // ---- crouch state with headroom check
  const targetCrouch = wantCrouch || a.sliding > 0;
  if (targetCrouch !== a.crouched) {
    if (targetCrouch) {
      a.crouched = true;
      collider.setHalfHeight(CROUCH_HALF);
    } else if (canStand(world, a, collider)) {
      a.crouched = false;
      collider.setHalfHeight(STAND_HALF);
    }
    placeCollider(a, collider);
  }

  // ---- sprint: forward only, not while crouched/aiming/firing
  const firingRecently = ctx.time - a.lastShotTime < 0.3;
  a.sprinting = (btn & Btn.Sprint) !== 0 && my > 0.3 && !a.crouched && !a.aiming && !firingRecently;

  let maxSpeed = a.crouched ? M.crouchSpeed : a.sprinting ? M.sprintSpeed : M.runSpeed;
  if (a.aiming) maxSpeed *= M.adsSpeedMul;

  // wish direction in world space
  const sy = Math.sin(a.yaw), cy = Math.cos(a.yaw);
  // forward = (-sin, -cos), right = (cos, -sin)
  let wx = cy * mx - sy * my;
  let wz = -sy * mx - cy * my;
  const wl = Math.hypot(wx, wz);
  if (wl > 1e-6) { wx /= wl; wz /= wl; }
  const wishSpeed = maxSpeed * Math.min(1, wl);

  // ---- friction
  if (a.grounded) {
    const speed = Math.hypot(a.vel.x, a.vel.z);
    if (speed > 1e-4) {
      const fr = a.sliding > 0 ? M.slideFriction : M.friction;
      const drop = Math.max(speed, M.stopSpeed) * fr * dt;
      const ns = Math.max(0, speed - drop) / speed;
      a.vel.x *= ns; a.vel.z *= ns;
    }
  }

  // ---- acceleration (slides only steer a little)
  if (wishSpeed > 0) {
    const accel = a.grounded ? (a.sliding > 0 ? M.airAccel * 0.5 : M.groundAccel) : M.airAccel;
    const cur = a.vel.x * wx + a.vel.z * wz;
    const add = wishSpeed - cur;
    if (add > 0) {
      const as = Math.min(accel * dt * wishSpeed, add);
      a.vel.x += wx * as; a.vel.z += wz * as;
    }
  }

  // ---- gravity & jump
  a.vel.y -= M.gravity * dt;
  if (a.grounded && a.vel.y < -1) a.vel.y = -1;
  if (a.jumpBuffer > 0 && a.coyote > 0) {
    if (!a.crouched || canStand(world, a, collider)) {
      if (a.crouched) { a.crouched = false; collider.setHalfHeight(STAND_HALF); placeCollider(a, collider); }
      a.vel.y = M.jumpVelocity;
      a.jumpBuffer = 0; a.coyote = 0; a.grounded = false; a.sliding = 0;
      ctx.events.push({ type: 'jump', agent: a.id });
    }
  }

  // ---- collide & slide
  _desired.x = a.vel.x * dt; _desired.y = a.vel.y * dt; _desired.z = a.vel.z * dt;
  kcc.computeColliderMovement(collider, _desired, undefined, AGENT_GROUPS);
  const mv = kcc.computedMovement(_mv);
  const wasGrounded = a.grounded;
  a.grounded = kcc.computedGrounded();
  a.pos.x += mv.x; a.pos.y += mv.y; a.pos.z += mv.z;
  placeCollider(a, collider);

  // velocity correction from collisions
  if (_desired.y > 0 && mv.y < _desired.y * 0.5) a.vel.y = 0; // ceiling
  const dl = Math.hypot(_desired.x, _desired.z), ml2 = Math.hypot(mv.x, mv.z);
  if (dl > 1e-5 && ml2 < dl - 1e-4) {
    a.vel.x = mv.x / dt; a.vel.z = mv.z / dt;
  }
  if (a.grounded) {
    if (!wasGrounded && a.airTime > 0.12) {
      a.landImpact = -a.vel.y;
      ctx.events.push({ type: 'land', agent: a.id, speed: -a.vel.y });
    }
    if (a.vel.y < 0) a.vel.y = -1;
    a.airTime = 0;
  } else {
    a.airTime += dt;
  }
  // safety net: never fall out of the arena
  if (a.pos.y < -5) { a.pos.y = 0.5; a.vel.y = 0; placeCollider(a, collider); }

  a.crouch += ((a.crouched ? 1 : 0) - a.crouch) * Math.min(1, dt * 14);
}

export { QUERY_STATIC };
