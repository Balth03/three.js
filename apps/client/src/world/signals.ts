import type { RoadGraph } from './RoadGraph';
import { hash01 } from '@taxi/shared';

/** Deterministic signal timing shared by rendering (worker/shader) and the traffic AI. */
export function signalOffset(node: number): number {
  return Math.floor(hash01(node * 7919 + 13) * 64);
}

/** Primary axis angle of a junction = direction of its most important incident edge. */
export function junctionAxis(g: RoadGraph, node: number): number {
  const d = g.d;
  let best = -1, bestCls = 99;
  for (let k = g.incOffset[node]; k < g.incOffset[node + 1]; k++) {
    const e = g.inc[k] >> 1;
    if (d.cls[e] < bestCls || (d.cls[e] === bestCls && e < best)) { bestCls = d.cls[e]; best = e; }
  }
  if (best < 0) return 0;
  return edgeAngleAtNode(g, best, node);
}

const tmp = { x: 0, z: 0, tx: 0, tz: 0 };
export function edgeAngleAtNode(g: RoadGraph, e: number, node: number): number {
  const d = g.d;
  const atStart = d.edgeA[e] === node;
  g.pointAt(e, atStart ? Math.min(4, d.length[e] / 2) : Math.max(0, d.length[e] - 4), tmp);
  const nx = d.nodeX[node], nz = d.nodeZ[node];
  return Math.atan2(tmp.z - nz, tmp.x - nx);
}

/** Axis (0/1) controlling traffic arriving at `node` along edge `e`. */
export function signalAxis(g: RoadGraph, node: number, e: number): number {
  const a = edgeAngleAtNode(g, e, node);
  const p = junctionAxis(g, node);
  return Math.abs(Math.cos(a - p)) > 0.70710678 ? 0 : 1;
}
