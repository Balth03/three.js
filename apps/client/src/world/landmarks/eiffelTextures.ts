import * as THREE from 'three';
import { coveragePreservingMips, hash2, makeCanvas } from './common';

/*
 * Lattice atlas for the Eiffel Tower (alpha-tested). Layout (canvas rows from the top / texture v from bottom):
 *   LEG     : v 0.5    .. 1.0    square X-braced cell made of lattice girders (+ secondary diamond)
 *   GALLERY : v 0.375  .. 0.5    1st floor arcade gallery (4 arcades per tile)
 *   ARCH    : v 0.25   .. 0.375  decorative base-arch band (Warren web + rings)
 *   RAIL    : v 0.1875 .. 0.25   railing (balusters)
 *   TRUSS   : v 0      .. 0.1875 floor belt truss girders
 */
export const LATTICE_BANDS = {
  LEG: [0.5, 1.0],
  GALLERY: [0.375, 0.5],
  ARCH: [0.25, 0.375],
  RAIL: [0.1875, 0.25],
  TRUSS: [0.0, 0.1875],
} as const;

export type LatticeBand = keyof typeof LATTICE_BANDS;

type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

function line(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, w: number): void {
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

/** A lattice girder (two flanges + zig-zag web) drawn between two points. */
function latticeGirder(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, width: number, flange: number, web: number, pitch: number): void {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const L = Math.hypot(dx, dy);
  const ux = dx / L;
  const uy = dy / L;
  const nx = -uy;
  const ny = ux;
  const off = width / 2 - flange / 2;
  line(ctx, x0 + nx * off, y0 + ny * off, x1 + nx * off, y1 + ny * off, flange);
  line(ctx, x0 - nx * off, y0 - ny * off, x1 - nx * off, y1 - ny * off, flange);
  // web: zig-zag
  const n = Math.max(2, Math.round(L / (pitch / 2)));
  ctx.lineWidth = web;
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * L;
    const s = i % 2 === 0 ? off : -off;
    const px = x0 + ux * t + nx * s;
    const py = y0 + uy * t + ny * s;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  // second web for a double lattice (St-Andrew crossing)
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * L;
    const s = i % 2 === 0 ? -off : off;
    const px = x0 + ux * t + nx * s;
    const py = y0 + uy * t + ny * s;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

export interface LatticeAtlas {
  texture: THREE.DataTexture;
  /** v range (with inset) for a band. */
  band(b: LatticeBand): [number, number];
}

export function createLatticeAtlas(S: number): LatticeAtlas {
  const W = S;
  const H = S * 2;
  const { ctx } = makeCanvas(W, H);
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  ctx.lineCap = 'square';
  ctx.lineJoin = 'miter';
  const k = S / 1024;

  // ---------------- LEG cell (rows 0..S)
  {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, S, S);
    ctx.clip();
    // frame (horizontal struts are lattice girders too)
    latticeGirder(ctx, -S * 0.1, S * 0.035, S * 1.1, S * 0.035, 72 * k, 15 * k, 7 * k, 60 * k);
    latticeGirder(ctx, -S * 0.1, S * 0.965, S * 1.1, S * 0.965, 72 * k, 15 * k, 7 * k, 60 * k);
    latticeGirder(ctx, -S * 0.1, S * 0.5, S * 1.1, S * 0.5, 40 * k, 9 * k, 5 * k, 40 * k);
    ctx.fillRect(0, 0, 24 * k, S);
    ctx.fillRect(S - 24 * k, 0, 24 * k, S);
    // secondary diamond
    const m = S / 2;
    latticeGirder(ctx, m, 0, S, m, 58 * k, 11 * k, 5 * k, 44 * k);
    latticeGirder(ctx, S, m, m, S, 58 * k, 11 * k, 5 * k, 44 * k);
    latticeGirder(ctx, m, S, 0, m, 58 * k, 11 * k, 5 * k, 44 * k);
    latticeGirder(ctx, 0, m, m, 0, 58 * k, 11 * k, 5 * k, 44 * k);
    // main X
    latticeGirder(ctx, 0, 0, S, S, 104 * k, 19 * k, 8 * k, 70 * k);
    latticeGirder(ctx, S, 0, 0, S, 104 * k, 19 * k, 8 * k, 70 * k);
    // centre gusset
    ctx.beginPath();
    ctx.arc(m, m, 40 * k, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ---------------- GALLERY (rows S .. S*1.25)
  {
    const y0 = S;
    const hb = S / 4;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y0, W, hb);
    ctx.clip();
    ctx.fillRect(0, y0, W, hb * 0.09); // cornice bar
    ctx.fillRect(0, y0 + hb * 0.9, W, hb * 0.1); // floor bar
    const n = 8;
    const aw = W / n;
    for (let i = 0; i < n; i++) {
      const x = i * aw;
      // columns
      ctx.fillRect(x - 5 * k, y0 + hb * 0.09, 10 * k, hb * 0.82);
      // arch
      ctx.lineWidth = 9 * k;
      ctx.beginPath();
      ctx.arc(x + aw / 2, y0 + hb * 0.45, aw / 2 - 6 * k, Math.PI, 0);
      ctx.stroke();
      // spandrel ornament: rings
      ctx.lineWidth = 4 * k;
      ctx.beginPath();
      ctx.arc(x, y0 + hb * 0.2, hb * 0.07, 0, Math.PI * 2);
      ctx.stroke();
      // balustrade
      for (let b = 0; b < 8; b++) {
        const bx = x + (b + 0.5) * (aw / 8);
        ctx.fillRect(bx - 2 * k, y0 + hb * 0.68, 4 * k, hb * 0.22);
      }
    }
    ctx.fillRect(0, y0 + hb * 0.66, W, hb * 0.04); // hand rail
    ctx.fillRect(0, y0 + hb * 0.16, W, hb * 0.025);
    ctx.restore();
  }

  // ---------------- ARCH band (rows 1.25S .. 1.5S)
  {
    const y0 = S * 1.25;
    const hb = S / 4;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y0, W, hb);
    ctx.clip();
    ctx.fillRect(0, y0, W, hb * 0.13);
    ctx.fillRect(0, y0 + hb * 0.87, W, hb * 0.13);
    const n = 8;
    const p = W / n;
    for (let i = 0; i <= n; i++) {
      const x = i * p;
      line(ctx, x, y0 + hb * 0.13, x + p / 2, y0 + hb * 0.87, 12 * k);
      line(ctx, x + p / 2, y0 + hb * 0.87, x + p, y0 + hb * 0.13, 12 * k);
      ctx.lineWidth = 6 * k;
      ctx.beginPath();
      ctx.arc(x + p / 2, y0 + hb * 0.34, hb * 0.14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y0 + hb * 0.66, hb * 0.14, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ---------------- RAIL (rows 1.5S .. 1.625S)
  {
    const y0 = S * 1.5;
    const hb = S / 8;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y0, W, hb);
    ctx.clip();
    ctx.fillRect(0, y0, W, hb * 0.16);
    ctx.fillRect(0, y0 + hb * 0.84, W, hb * 0.16);
    ctx.fillRect(0, y0 + hb * 0.48, W, hb * 0.07);
    const n = 48;
    for (let i = 0; i < n; i++) ctx.fillRect((i * W) / n - 2.5 * k, y0, 5 * k, hb);
    for (let i = 0; i < 12; i++) {
      const x = (i * W) / 12;
      line(ctx, x, y0 + hb * 0.16, x + W / 12, y0 + hb * 0.84, 4 * k);
      line(ctx, x + W / 12, y0 + hb * 0.16, x, y0 + hb * 0.84, 4 * k);
    }
    ctx.restore();
  }

  // ---------------- TRUSS (rows 1.625S .. 2S)
  {
    const y0 = S * 1.625;
    const hb = S * 0.375;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y0, W, hb);
    ctx.clip();
    ctx.fillRect(0, y0, W, hb * 0.12);
    ctx.fillRect(0, y0 + hb * 0.88, W, hb * 0.12);
    const n = 6;
    const p = W / n;
    for (let i = 0; i <= n; i++) {
      const x = i * p;
      ctx.fillRect(x - 11 * k, y0, 22 * k, hb);
      latticeGirder(ctx, x, y0 + hb * 0.12, x + p, y0 + hb * 0.88, 36 * k, 9 * k, 4 * k, 36 * k);
      latticeGirder(ctx, x + p, y0 + hb * 0.12, x, y0 + hb * 0.88, 36 * k, 9 * k, 4 * k, 36 * k);
    }
    ctx.restore();
  }

  // ---------------- to RGBA (flip to texture orientation), shade bars slightly
  const img = ctx.getImageData(0, 0, W, H).data;
  const data = new Uint8Array(W * H * 4);
  for (let y = 0; y < H; y++) {
    const sy = H - 1 - y;
    for (let x = 0; x < W; x++) {
      const si = (sy * W + x) * 4;
      const di = (y * W + x) * 4;
      const a = img[si + 3];
      const n = 0.86 + 0.14 * hash2(x >> 2, sy >> 2, 3);
      const c = Math.round(235 * n);
      data[di] = c;
      data[di + 1] = c;
      data[di + 2] = c;
      data[di + 3] = a;
    }
  }
  const bands = [0, 0.1875, 0.25, 0.375, 0.5, 1];
  const texture = coveragePreservingMips(data, W, H, 0.5, 1.1, bands);
  const inset = 1.5 / H;
  return {
    texture,
    band(b: LatticeBand): [number, number] {
      const r = LATTICE_BANDS[b];
      return [r[0] + inset, r[1] - inset];
    },
  };
}

/**
 * Opaque "riveted lattice girder" albedo used on the solid iron members: u in [0,0.75] holds a Warren lattice
 * pattern (dark recesses), u in [0.8,1] is plain plate (used by non-beam parts).
 */
export function createGirderTexture(w: number, h: number): THREE.DataTexture {
  const data = new Uint8Array(w * h * 4);
  const latW = Math.floor(w * 0.75);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let c = 1.0;
      if (x < latW) {
        const u = x / latW;
        const v = (y / h) * 4; // 4 bays per tile
        const fv = v - Math.floor(v);
        const edge = u < 0.16 || u > 0.84;
        const d1 = Math.abs(fv - u * 0.5);
        const d2 = Math.abs(fv - (1 - u) * 0.5 - 0.5);
        const d3 = Math.abs(fv - 0.5 - u * 0.5);
        const d4 = Math.abs(fv - (1 - u) * 0.5);
        const web = Math.min(d1, d2, d3, d4) < 0.045;
        const bar = fv < 0.04;
        c = edge || web || bar ? 1.0 : 0.38;
        if (edge && (y % 6 === 0) && (u < 0.06 || u > 0.94)) c = 0.8; // rivet lines
      }
      const n = 0.92 + 0.08 * hash2(x, y, 9);
      const k = (y * w + x) * 4;
      data[k] = data[k + 1] = data[k + 2] = Math.round(255 * c * n);
      data[k + 3] = 255;
    }
  }
  const t = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.ClampToEdgeWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}
