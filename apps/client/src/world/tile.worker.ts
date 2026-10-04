/// <reference lib="webworker" />
import { fetchJson } from '../core/fetchData';
import { RoadGraph, type RoadGraphData } from './RoadGraph';
import { Terrain } from './Terrain';
import { TileBuilder, type TileStyle } from './tileBuilder';
import { transferablesOf } from './geoBuilder';
import type { RawTile } from './types';

let builder: TileBuilder | null = null;
let baseUrl = '';

export type TileWorkerMsg =
  | { type: 'init'; graph: RoadGraphData; terrain: { heights: Float32Array; x0: number; z0: number; step: number; nx: number; nz: number }; style: TileStyle; baseUrl: string }
  | { type: 'build'; i: number; j: number; id: number };

self.onmessage = async (ev: MessageEvent<TileWorkerMsg>) => {
  const m = ev.data;
  if (m.type === 'init') {
    builder = new TileBuilder(new RoadGraph(m.graph), new Terrain(m.terrain.heights, m.terrain), m.style);
    baseUrl = m.baseUrl;
    (self as unknown as Worker).postMessage({ type: 'ready' });
    return;
  }
  if (m.type === 'build') {
    if (!builder) return;
    try {
      const raw = await fetchJson<RawTile>(`${baseUrl}/tiles/${m.i}_${m.j}.json.gz`);
      const t0 = performance.now();
      const res = builder.build(raw);
      const ms = performance.now() - t0;
      const tr: Transferable[] = [];
      for (const k in res.meshes) transferablesOf(res.meshes[k], tr);
      for (const k in res.instances) tr.push(res.instances[k].buffer);
      tr.push(res.lights.buffer, res.roadMask.buffer, res.physics.heights.buffer, res.physics.wallPos.buffer, res.physics.wallIdx.buffer, res.physics.boxes.buffer, res.physics.cylinders.buffer);
      if (res.groundMask) tr.push(res.groundMask);
      (self as unknown as Worker).postMessage({ type: 'built', id: m.id, result: res, ms }, tr);
    } catch (err) {
      (self as unknown as Worker).postMessage({ type: 'error', id: m.id, i: m.i, j: m.j, error: String(err) });
    }
  }
};
