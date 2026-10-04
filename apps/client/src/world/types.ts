/** Raw city data formats produced by tools/osm-import/build_city.py (all integer coordinates in decimetres). */
export interface CityMeta {
  v: number;
  id: string;
  origin: { lon: number; lat: number };
  h0: number;
  tileSize: number;
  groundCells: number;
  bounds: [number, number, number, number];
  waterLevel: number;
  tiles: Array<[number, number, number]>;
  landmarks: Array<{ id: string; model: string; x: number; z: number; y: number; rot: number }>;
  spawn: { x: number; z: number; heading: number };
  projection: { mlon: number; mlat: number };
  attribution: string;
  terrain: { file: string; encoding: string; x0: number; z0: number; step: number; nx: number; nz: number; scale: number };
}
/** [a, b, pts, cls, width_dm, lanesF, lanesB, oneway, speed, nameIdx, flags, surface, trimA_dm, trimB_dm, crossings_m[]] */
export type RawEdge = [number, number, number[], number, number, number, number, number, number, number, number, number, number, number, number[]];
export interface RawRoads { v: number; names: string[]; nodes: number[]; sig: number[]; edges: RawEdge[]; junctions: Record<string, number[]> }
/** building: [ring, h, minh, floors, cls, roof, seed, baseMin, baseMax, holes?, colors?] */
export type RawBuilding = [number[], number, number, number, number, number, number, number, number, number[][]?, ((string | null)[] | 0)?];
export interface RawTile {
  v: number; i: number; j: number;
  b?: RawBuilding[];
  re?: number[];
  rn?: number[];
  p?: Array<[number[], number, number, number]>;
  tr?: number[];
  pp?: Record<string, number[]>;
  w?: Array<[number[], number[][], number]>;
  l?: Array<[number[], number[][], number]>;
  q?: number[][];
  gx?: number[];
  gp?: Array<[number, number[]]>;
}
export const enum RoadClass { Motorway = 0, Trunk, Primary, Secondary, Tertiary, Residential, Unclassified, LivingStreet, Service }
export const enum EdgeFlag { Bridge = 1, Link = 2, NoMotor = 4, Covered = 8, NoTraffic = 16 }
