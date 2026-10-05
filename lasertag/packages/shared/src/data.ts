import game from '../../../data/game.json';
import photon7 from '../../../data/weapons/photon7.json';
import tdm from '../../../data/modes/tdm.json';
import roster from '../../../data/bots/roster.json';
import maze from '../../../data/maps/maze.json';
import type { MapDef } from './map/types.ts';

export type GameConfig = typeof game;
export type WeaponDef = typeof photon7;
export type ModeDef = typeof tdm;
export type Roster = typeof roster;
export type Personality = keyof typeof roster.personalities;
export type Difficulty = keyof typeof roster.difficulties;
export type DamageZone = keyof WeaponDef['damage'];

export const GAME: GameConfig = game;
export const WEAPONS: Record<string, WeaponDef> = { photon7 };
export const MODES: Record<string, ModeDef> = { tdm };
export const ROSTER: Roster = roster;
export const MAPS: Record<string, MapDef> = { maze: maze as unknown as MapDef };
