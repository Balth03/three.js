/**
 * Validates every map in data/maps: bounds, spawn clearance, reachability of spawns, zones and hotspots
 * on the generated nav grid, and mirror symmetry for two-team maps.
 *   npm run map:validate
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildArenaPhysics, initPhysics, NavGrid, RAPIER, QUERY_STATIC, type MapDef } from '../../packages/shared/src/index.ts';

const dir = fileURLToPath(new URL('../../data/maps/', import.meta.url));
await initPhysics();
let failed = 0;
for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const map = JSON.parse(readFileSync(dir + f, 'utf8')) as MapDef;
  const problems: string[] = [];
  const { world } = buildArenaPhysics(map);
  const { min, max } = map.bounds;
  const inside = (p: number[]) => p[0] > min[0] && p[0] < max[0] && p[2] > min[1] && p[2] < max[1];

  // spawns must be inside and free
  const shape = new RAPIER.Capsule(0.55, 0.36);
  for (const s of map.spawns) {
    if (!inside(s.pos)) problems.push(`spawn out of bounds ${s.pos}`);
    if (world.intersectionWithShape({ x: s.pos[0], y: s.pos[1] + 1.0, z: s.pos[2] }, { x: 0, y: 0, z: 0, w: 1 }, shape, undefined, QUERY_STATIC)) problems.push(`spawn blocked ${s.pos}`);
  }
  for (const t of [0, 1]) if (map.spawns.filter((s) => s.team === t).length < 4) problems.push(`team ${t} has fewer than 4 spawns`);
  if (map.lights.length > 10) problems.push(`${map.lights.length} lights (max 10 static, the rest of the 16 are dynamic)`);

  // reachability
  const s0 = map.spawns[0].pos;
  const nav = NavGrid.build(world, map, { x: s0[0], y: s0[1], z: s0[2] });
  const path: number[] = [];
  const start = nav.nearest(s0[0], s0[1], s0[2]);
  const targets: [string, number[]][] = [
    ...map.spawns.map((s, i) => [`spawn#${i}`, s.pos] as [string, number[]]),
    ...map.zones.map((z) => [`zone ${z.type}/${z.team}`, z.type === 'station' ? [z.center[0] + 1.2, z.center[1], z.center[2]] : [z.center[0], 0, z.center[2]]] as [string, number[]]),
    ...map.hotspots.map((h) => [`hotspot ${h.label}`, h.pos] as [string, number[]]),
  ];
  for (const [label, p] of targets) {
    const n = nav.nearest(p[0], p[1], p[2]);
    if (n < 0 || Math.hypot(nav.x(n) - p[0], nav.z(n) - p[2]) > 1.5) { problems.push(`${label} not on the nav grid`); continue; }
    if (!nav.findPath(start, n, path) || !nav.findPath(n, start, path)) problems.push(`${label} unreachable (both ways)`);
  }

  // mirror symmetry (x -> -x) of collidable boxes
  const key = (b: { min: number[]; max: number[] }) => [b.min[0], b.min[1], b.min[2], b.max[0], b.max[1], b.max[2]].map((v) => v.toFixed(2)).join(',');
  const keys = new Set(map.boxes.map(key));
  for (const b of map.boxes) {
    const m = { min: [-b.max[0], b.min[1], b.min[2]], max: [-b.min[0], b.max[1], b.max[2]] };
    if (!keys.has(key(m))) problems.push(`asymmetric box ${key(b)}`);
  }

  console.log(`${f}: ${map.boxes.length} boxes, ${nav.count} nav nodes — ${problems.length ? 'FAIL' : 'OK'}`);
  for (const p of problems) console.log('   - ' + p);
  if (problems.length) failed++;
}
process.exit(failed ? 1 : 0);
