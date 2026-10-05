/**
 * Generates data/maps/maze.json — "The Maze".
 * The west half (cyan base) is authored here; the east half is its mirror across x = 0.
 * Elements that straddle x = 0 are authored once in `center`.
 *
 *   npm run map:build
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { MapBox, MapDef, MapLight, MapRamp, MapSign, MapSpawn, MapZone, MapHotspot, TrimColor, Pattern, SurfaceMat, BoxKind, V3 } from '../../packages/shared/src/map/types.ts';

const H = 2.6; // maze wall height
const T = 0.4; // wall thickness
const COVER = 1.1;
const CEIL = 9;

type BoxOpts = Partial<Pick<MapBox, 'trim' | 'pattern' | 'mat' | 'kind' | 'tint' | 'ghost'>>;

function box(min: V3, max: V3, o: BoxOpts = {}): MapBox {
  return {
    min, max,
    kind: o.kind ?? 'wall',
    mat: o.mat ?? 'wall',
    trim: o.trim ?? 'violet',
    pattern: o.pattern ?? 'grid',
    tint: o.tint ?? 0,
    ...(o.ghost ? { ghost: true } : {}),
  };
}
/** Wall running along x at depth z. */
function wallX(x0: number, x1: number, z: number, o: BoxOpts & { h?: number; y?: number } = {}): MapBox {
  const y = o.y ?? 0;
  return box([x0, y, z - T / 2], [x1, y + (o.h ?? H), z + T / 2], o);
}
/** Wall running along z at abscissa x. */
function wallZ(z0: number, z1: number, x: number, o: BoxOpts & { h?: number; y?: number } = {}): MapBox {
  const y = o.y ?? 0;
  return box([x - T / 2, y, z0], [x + T / 2, y + (o.h ?? H), z1], o);
}
function cover(x0: number, z0: number, x1: number, z1: number, o: BoxOpts & { h?: number } = {}): MapBox {
  return box([x0, 0, z0], [x1, o.h ?? COVER, z1], { kind: 'cover', pattern: 'stripes', trim: 'orange', tint: 2, ...o });
}

// ---------------------------------------------------------------- west half
const half: { boxes: MapBox[]; ramps: MapRamp[]; zones: MapZone[]; spawns: MapSpawn[]; lights: MapLight[]; hotspots: MapHotspot[] } = {
  boxes: [], ramps: [], zones: [], spawns: [], lights: [], hotspots: [],
};
const B = half.boxes;

// Base (cyan): x[-28,-22], z[-8,8]
B.push(wallZ(3, 8.2, -22, { trim: 'team0', pattern: 'chevron', tint: 1 }));
B.push(wallZ(-8.2, -3, -22, { trim: 'team0', pattern: 'chevron', tint: 1 }));
B.push(wallX(-28, -25, 8, { trim: 'team0', pattern: 'chevron', tint: 1 }));
B.push(wallX(-28, -25, -8, { trim: 'team0', pattern: 'chevron', tint: 1 }));
B.push(cover(-24.4, -1.3, -23.6, 1.3, { trim: 'team0', pattern: 'chevron', tint: 1 }));

// North lane (maze) z[8,20]
B.push(wallZ(11, 20, -19.5, { pattern: 'grid', tint: 0 }));
B.push(wallX(-16.5, -10, 12.5, { trim: 'blue', pattern: 'circuit', tint: 1 }));
B.push(wallZ(15.5, 20, -13, { mat: 'mirror', trim: 'white', pattern: 'none' }));
B.push(wallZ(9.2, 14, -6.5, { mat: 'mirror', trim: 'white', pattern: 'none' }));
B.push(wallX(-10, -3.5, 17, { pattern: 'stars', tint: 3 }));
B.push(box([-16.4, 0, 16.1], [-15.6, H, 16.9], { kind: 'pillar', trim: 'orange', pattern: 'stripes', tint: 2 }));
B.push(cover(-24.2, 13.5, -22.6, 15.1, { mat: 'crate', pattern: 'hex', tint: 2, h: 1.2 }));

// North separator z = 8 (gaps = flank chicanes)
B.push(wallX(-21.8, -15, 8, { pattern: 'grid', tint: 0 }));
B.push(wallX(-11, -6, 8, { trim: 'blue', pattern: 'circuit', tint: 1 }));

// South lane (gallery) z[-20,-8]
B.push(wallX(-21.8, -17, -8, { pattern: 'grid', tint: 0 }));
B.push(wallX(-13, -5.5, -8, { trim: 'blue', pattern: 'stripes', tint: 1 }));
// sniper ledge + ramp + rail
B.push(box([-22, 0, -20], [-18, 1.3, -16.5], { kind: 'platform', trim: 'orange', pattern: 'hex', tint: 2 }));
half.ramps.push({ min: [-21.2, 0, -16.5], max: [-19.2, 1.3, -12.8], rise: 'z-', trim: 'orange' });
B.push(box([-18.3, 1.3, -20], [-18, 2.2, -17.6], { kind: 'cover', trim: 'orange', pattern: 'stripes', tint: 2 }));
B.push(cover(-15, -13.6, -13, -12.8));
B.push(box([-10, 0, -17.2], [-9, H, -16.2], { kind: 'pillar', trim: 'orange', pattern: 'stripes', tint: 2 }));
B.push(cover(-6.2, -16, -5.4, -12.4, { pattern: 'grid', tint: 0, trim: 'violet' }));
B.push(cover(-3.4, -18.4, -2, -17.4, { mat: 'crate', pattern: 'hex', tint: 2, h: 1.2 }));

// Center lane z[-8,8]
B.push(box([-4.6, 0, -3.6], [-4, 2.1, -3], { kind: 'pillar', mat: 'metal', trim: 'none', pattern: 'none' }));
B.push(box([-4.6, 0, 3], [-4, 2.1, 3.6], { kind: 'pillar', mat: 'metal', trim: 'none', pattern: 'none' }));
half.ramps.push({ min: [-11, 0, -1.25], max: [-5, 2.4, 1.25], rise: 'x+', trim: 'orange' });
// platform rails
B.push(box([-5, 2.4, 3.8], [-1.6, 3.3, 4], { kind: 'cover', trim: 'orange', pattern: 'stripes', tint: 2 }));
B.push(box([-5, 2.4, -4], [-1.6, 3.3, -3.8], { kind: 'cover', trim: 'orange', pattern: 'stripes', tint: 2 }));
B.push(box([-5, 2.4, 1.25], [-4.8, 3.3, 3.8], { kind: 'cover', trim: 'orange', pattern: 'stripes', tint: 2 }));
B.push(box([-5, 2.4, -3.8], [-4.8, 3.3, -1.25], { kind: 'cover', trim: 'orange', pattern: 'stripes', tint: 2 }));
// mid covers
B.push(cover(-15.6, -3.3, -14.6, -1.3));
B.push(cover(-15.6, 1.3, -14.6, 3.3));
B.push(cover(-18.6, 4.4, -17.4, 5.6, { mat: 'crate', pattern: 'hex', tint: 2, h: 1.2 }));
B.push(cover(-9.2, -6.3, -8, -5.1, { mat: 'crate', pattern: 'hex', tint: 2, h: 1.2 }));
B.push(wallZ(4.6, 7.6, -9, { mat: 'mirror', trim: 'white', pattern: 'none' }));

// Zones, spawns
half.zones.push({ type: 'base', team: 0, center: [-25, 1.5, 0], size: [3, 3, 8] });
for (const z of [-5, -2.5, 0, 2.5, 5]) half.spawns.push({ team: 0, pos: [-26.6, 0, z], yaw: -Math.PI / 2 });
for (const z of [-5.6, 5.6]) half.spawns.push({ team: 0, pos: [-24, 0, z], yaw: -Math.PI / 2 });

// Lights
half.lights.push({ pos: [-25, 6.5, 0], color: '#18e7ff', intensity: 3.2, range: 15, cone: true, coneRadius: 3.2 });
half.lights.push({ pos: [-13, 7.5, 14.5], color: '#ff8a1f', intensity: 2.4, range: 13, cone: true, coneRadius: 2.4 });
half.lights.push({ pos: [-11, 7.5, -14], color: '#4d6bff', intensity: 2.8, range: 14, cone: true, coneRadius: 2.8 });

// Bot hotspots
half.hotspots.push({ pos: [-12, 0, 14.5], weight: 1.2, label: 'north' });
half.hotspots.push({ pos: [-8, 0, -14], weight: 1.2, label: 'gallery' });
half.hotspots.push({ pos: [-20, 1.3, -18.3], weight: 0.6, label: 'ledge' });
half.hotspots.push({ pos: [-13, 0, 0], weight: 1.0, label: 'mid' });

// ---------------------------------------------------------------- centre (authored once)
const center = {
  boxes: [
    box([-5, 2.1, -4], [5, 2.4, 4], { kind: 'platform', trim: 'orange', pattern: 'hex', tint: 2 }),
    box([-0.45, 0, -0.45], [0.45, 2.1, 0.45], { kind: 'pillar', mat: 'metal', trim: 'orange', pattern: 'circuit', tint: 2 }),
    wallX(-2.5, 2.5, 13, { trim: 'orange', pattern: 'hex', tint: 2 }),
    wallX(-2, 2, 8, { pattern: 'grid', tint: 0 }),
    cover(-1, -12.6, 1, -11.6),
  ] as MapBox[],
  zones: [{ type: 'station', team: -1, center: [0, 0, 0], size: [1.8, 2.1, 1.8] }] as MapZone[],
  lights: [
    { pos: [0, 8.6, 0], color: '#b388ff', intensity: 3.0, range: 16, cone: true, coneRadius: 4.5 },
    { pos: [0, 1.4, 0], color: '#ff8a1f', intensity: 1.6, range: 5.5 },
  ] as MapLight[],
  hotspots: [
    { pos: [0, 2.4, 0], weight: 2.2, label: 'platform' },
    { pos: [0, 0, 0], weight: 1.0, label: 'station' },
    { pos: [0, 0, 15], weight: 1.0, label: 'north-mid' },
    { pos: [0, 0, -15], weight: 1.0, label: 'gallery-mid' },
  ] as MapHotspot[],
};

// ---------------------------------------------------------------- perimeter + ceiling
const X = 28, Z = 20;
const perimeter: MapBox[] = [
  box([-X - 0.6, 0, Z], [X + 0.6, CEIL, Z + 0.6], { kind: 'perimeter', trim: 'violet', pattern: 'stars', tint: 0 }),
  box([-X - 0.6, 0, -Z - 0.6], [X + 0.6, CEIL, -Z], { kind: 'perimeter', trim: 'violet', pattern: 'stars', tint: 0 }),
  box([-X - 0.6, 0, -Z], [-X, CEIL, Z], { kind: 'perimeter', trim: 'team0', pattern: 'chevron', tint: 1 }),
  box([X, 0, -Z], [X + 0.6, CEIL, Z], { kind: 'perimeter', trim: 'team1', pattern: 'chevron', tint: 1 }),
];

// ---------------------------------------------------------------- mirroring
const swapTeam = (t: number) => (t === 0 ? 1 : t === 1 ? 0 : t);
const swapTrim = (t: TrimColor): TrimColor => (t === 'team0' ? 'team1' : t === 'team1' ? 'team0' : t);
const mirrorBox = (b: MapBox): MapBox => ({ ...b, min: [-b.max[0], b.min[1], b.min[2]], max: [-b.min[0], b.max[1], b.max[2]], trim: swapTrim(b.trim) });
const mirrorRamp = (r: MapRamp): MapRamp => ({
  ...r, min: [-r.max[0], r.min[1], r.min[2]], max: [-r.min[0], r.max[1], r.max[2]],
  rise: r.rise === 'x+' ? 'x-' : r.rise === 'x-' ? 'x+' : r.rise, trim: swapTrim(r.trim),
});
const mx = (p: V3): V3 => [-p[0], p[1], p[2]];
const swapColor = (c: string) => (c === '#18e7ff' ? '#ff2bd6' : c);

const signs: MapSign[] = [
  { text: '▲ CYAN', pos: [-27.95, 4.6, 0], yaw: Math.PI / 2, size: 1.7, color: '#18e7ff' },
  { text: '◆ MAGENTA', pos: [27.95, 4.6, 0], yaw: -Math.PI / 2, size: 1.7, color: '#ff2bd6' },
  { text: 'A1', pos: [-19.25, 1.9, 13], yaw: Math.PI / 2, size: 0.8, color: '#fff2e0' },
  { text: 'B1', pos: [19.25, 1.9, 13], yaw: -Math.PI / 2, size: 0.8, color: '#fff2e0' },
  { text: 'A3', pos: [-13, 1.9, -7.75], yaw: 0, size: 0.8, color: '#fff2e0' },
  { text: 'B3', pos: [13, 1.9, -7.75], yaw: 0, size: 0.8, color: '#fff2e0' },
  { text: 'A2', pos: [-15, 1.9, 8.25], yaw: Math.PI, size: 0.8, color: '#fff2e0' },
  { text: 'B2', pos: [15, 1.9, 8.25], yaw: Math.PI, size: 0.8, color: '#fff2e0' },
  { text: 'NOYAU', pos: [0, 1.6, 0.47], yaw: 0, size: 0.32, color: '#ff8a1f' },
  { text: 'THE MAZE', pos: [0, 6.2, 19.95], yaw: Math.PI, size: 2.2, color: '#b388ff' },
  { text: 'THE MAZE', pos: [0, 6.2, -19.95], yaw: 0, size: 2.2, color: '#b388ff' },
];

const map: MapDef = {
  id: 'maze',
  name: 'The Maze',
  subtitle: 'Labyrinthe classique — couloirs, miroirs, plateforme centrale',
  bounds: { min: [-X, -Z], max: [X, Z] },
  ceiling: CEIL,
  atmosphere: {
    fogColor: '#1b0c3d',
    fogDensity: 0.032,
    fogHeight: 3.5,
    uvAmbient: '#3a1f8a',
    uvGround: '#0b0620',
    patternTints: ['#7a4dff', '#2f86ff', '#ff8a1f', '#efe6ff'],
    exposure: 1.0,
  },
  boxes: [...perimeter, ...center.boxes, ...half.boxes, ...half.boxes.map(mirrorBox)],
  ramps: [...half.ramps, ...half.ramps.map(mirrorRamp)],
  zones: [...center.zones, ...half.zones, ...half.zones.map((z) => ({ ...z, team: swapTeam(z.team), center: mx(z.center) }))],
  spawns: [...half.spawns, ...half.spawns.map((s) => ({ team: swapTeam(s.team), pos: mx(s.pos), yaw: -s.yaw }))],
  lights: [...center.lights, ...half.lights, ...half.lights.map((l) => ({ ...l, pos: mx(l.pos), color: swapColor(l.color) }))],
  signs,
  hotspots: [...center.hotspots, ...half.hotspots, ...half.hotspots.map((h) => ({ ...h, pos: mx(h.pos), label: h.label + '-b' }))],
};

// Round to mm to keep the JSON tidy.
const round = (_k: string, v: unknown) => (typeof v === 'number' ? Math.round(v * 1000) / 1000 : v);
const out = fileURLToPath(new URL('../../data/maps/maze.json', import.meta.url));
writeFileSync(out, JSON.stringify(map, round, 1) + '\n');
console.log(`maze.json: ${map.boxes.length} boxes, ${map.ramps.length} ramps, ${map.spawns.length} spawns, ${map.lights.length} lights`);

// Silence unused-type lint for helper types kept for authoring clarity.
export type { Pattern, SurfaceMat, BoxKind };
