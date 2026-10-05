/** Data format of an arena (data/maps/*.json). Units: metres, y up. */

export type V3 = [number, number, number];
export type V2 = [number, number];

export type BoxKind = 'perimeter' | 'wall' | 'cover' | 'platform' | 'pillar' | 'deco';
export type SurfaceMat = 'wall' | 'mirror' | 'crate' | 'metal' | 'glass';
export type TrimColor = 'violet' | 'blue' | 'orange' | 'white' | 'team0' | 'team1' | 'none';
export type Pattern = 'none' | 'grid' | 'chevron' | 'stars' | 'hex' | 'stripes' | 'circuit';

export interface MapBox {
  min: V3;
  max: V3;
  kind: BoxKind;
  mat: SurfaceMat;
  trim: TrimColor;
  pattern: Pattern;
  /** Pattern tint index into the arena palette (0..3). */
  tint?: number;
  /** Not collidable (pure decoration). */
  ghost?: boolean;
}

/** Wedge ramp rising along +x or -x (axis) or +z/-z. `min`/`max` bound the ramp; it rises from `low` side to `high` side. */
export interface MapRamp {
  min: V3;
  max: V3;
  rise: 'x+' | 'x-' | 'z+' | 'z-';
  trim: TrimColor;
}

export type ZoneType = 'base' | 'station';
export interface MapZone {
  type: ZoneType;
  team: number; // -1 = neutral
  center: V3;
  /** half extents for bases, radius in [0] for stations */
  size: V3;
}

export interface MapSpawn {
  team: number;
  pos: V3;
  yaw: number;
}

export interface MapLight {
  pos: V3;
  color: string;
  intensity: number;
  range: number;
  /** Draw a visible cone (god ray) from this light down to the floor. */
  cone?: boolean;
  coneRadius?: number;
}

export interface MapSign {
  text: string;
  pos: V3;
  /** facing direction (yaw in radians, 0 = +z) */
  yaw: number;
  size: number;
  color: string;
}

export interface MapHotspot {
  pos: V3;
  weight: number;
  label: string;
}

export interface MapDef {
  id: string;
  name: string;
  subtitle: string;
  bounds: { min: V2; max: V2 };
  ceiling: number;
  /** Arena grading: fog colour, density, UV ambient */
  atmosphere: {
    fogColor: string;
    fogDensity: number;
    fogHeight: number;
    uvAmbient: string;
    uvGround: string;
    patternTints: string[];
    exposure: number;
  };
  boxes: MapBox[];
  ramps: MapRamp[];
  zones: MapZone[];
  spawns: MapSpawn[];
  lights: MapLight[];
  signs: MapSign[];
  hotspots: MapHotspot[];
}
