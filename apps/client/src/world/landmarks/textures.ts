import * as THREE from 'three';
import { clamp01, dataTextureFromRGBA, fbm2, hash2, makeCanvas, mulberry32, normalMapFromHeight, valueNoise2 } from './common';

export interface PBRTextures {
  map: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap?: THREE.Texture;
  metalnessMap?: THREE.Texture;
}

/**
 * Ashlar limestone: tileable, `size` px covering `meters` m (courses ~0.62 m). Returns albedo + normal.
 * Albedo is kept near-white-ish neutral so the material colour/vertex colour carry the hue.
 */
export function limestoneTextures(size: number, meters: number, seed = 7): PBRTextures {
  const rnd = mulberry32(seed);
  const pxPerM = size / meters;
  const courses = Math.max(1, Math.round(meters / 0.62));
  const courseH = size / courses;
  // per-course block boundaries
  const rows: { edges: number[]; tones: number[] }[] = [];
  for (let r = 0; r < courses; r++) {
    const edges: number[] = [];
    let x = rnd() * pxPerM * 1.2;
    const start = x;
    while (x < start + size - pxPerM * 0.8) {
      edges.push(x % size);
      x += pxPerM * (0.9 + rnd() * 1.1);
    }
    const tones = edges.map(() => 0.93 + rnd() * 0.1);
    rows.push({ edges: edges.sort((a, b) => a - b), tones });
  }
  const rgba = new Uint8ClampedArray(size * size * 4);
  const height = new Float32Array(size * size);
  const jointW = Math.max(1.2, pxPerM * 0.012);
  const period = 8;
  for (let y = 0; y < size; y++) {
    const r = Math.min(courses - 1, Math.floor(y / courseH));
    const yy = y - r * courseH;
    const dy = Math.min(yy, courseH - yy);
    const row = rows[r];
    for (let x = 0; x < size; x++) {
      // locate block
      let bi = row.edges.length - 1;
      for (let k = 0; k < row.edges.length; k++) {
        if (row.edges[k] > x) {
          bi = k - 1;
          break;
        }
      }
      if (bi < 0) bi = row.edges.length - 1;
      const e0 = row.edges[bi];
      const e1 = row.edges[(bi + 1) % row.edges.length];
      const d0 = (x - e0 + size) % size;
      const d1 = (e1 - x + size) % size;
      const dx = Math.min(d0, d1);
      const d = Math.min(dx, dy);
      const u = x / size;
      const v = y / size;
      const n1 = fbm2(u * period * 4, v * period * 4, 2, seed, period * 4);
      const n2 = valueNoise2(u * 96, v * 96, seed + 3, 96);
      const grain = hash2(x, y, seed) - 0.5;
      const joint = 1 - clamp01((d - jointW * 0.5) / jointW);
      // edge chipping / softness near joints
      const edgeWear = clamp01(1 - (d - jointW) / (pxPerM * 0.04));
      const h = (1 - joint) * (0.86 + 0.14 * n1) - edgeWear * 0.08 * n2;
      height[y * size + x] = h;
      const tone = row.tones[bi] * (0.94 + 0.1 * n1) + grain * 0.035 + (n2 - 0.5) * 0.04;
      // occasional darker fossil / pores
      const pore = hash2(x >> 1, y >> 1, seed + 9) > 0.992 ? 0.82 : 1;
      let c = tone * pore * (1 - joint * 0.28) * (1 - edgeWear * 0.05);
      c = clamp01(c);
      const k = (y * size + x) * 4;
      rgba[k] = 255 * clamp01(c * 1.0);
      rgba[k + 1] = 255 * clamp01(c * 0.985);
      rgba[k + 2] = 255 * clamp01(c * 0.955);
      rgba[k + 3] = 255;
    }
  }
  const map = dataTextureFromRGBA(rgba, size, size, true);
  map.anisotropy = 8;
  const nmCanvas = normalMapFromHeight(height, size, size, 3.0);
  const nm = flipDataTexture(nmCanvas, size, size);
  nmCanvas.dispose();
  nm.anisotropy = 8;
  return { map, normalMap: nm };
}

function flipDataTexture(t: THREE.DataTexture, w: number, h: number): THREE.DataTexture {
  const src = t.image.data as Uint8Array;
  const out = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) out.set(src.subarray((h - 1 - y) * w * 4, (h - y) * w * 4), y * w * 4);
  const nt = new THREE.DataTexture(out, w, h, THREE.RGBAFormat);
  nt.wrapS = nt.wrapT = THREE.RepeatWrapping;
  nt.magFilter = THREE.LinearFilter;
  nt.minFilter = THREE.LinearMipmapLinearFilter;
  nt.generateMipmaps = true;
  nt.needsUpdate = true;
  return nt;
}

/**
 * Builds albedo + normal DataTextures from a height function evaluated in canvas-space (x right, y down).
 * colorFn returns linear-ish 0..1 grey/rgb for albedo.
 */
export function texturesFromFields(w: number, h: number, heightFn: (x: number, y: number) => number, colorFn: (x: number, y: number, hgt: number) => [number, number, number], normalStrength: number, wrap = true): PBRTextures {
  const height = new Float32Array(w * h);
  const rgba = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const hv = heightFn(x, y);
      height[y * w + x] = hv;
      const [r, g, b] = colorFn(x, y, hv);
      const k = (y * w + x) * 4;
      rgba[k] = 255 * clamp01(r);
      rgba[k + 1] = 255 * clamp01(g);
      rgba[k + 2] = 255 * clamp01(b);
      rgba[k + 3] = 255;
    }
  }
  const map = dataTextureFromRGBA(rgba, w, h, true);
  // normal map in canvas orientation then flipped to texture orientation
  const nmCanvas = normalMapFromHeight(height, w, h, normalStrength, wrap);
  const nm = flipDataTexture(nmCanvas, w, h);
  nmCanvas.dispose();
  map.anisotropy = 8;
  nm.anisotropy = 8;
  return { map, normalMap: nm };
}

/** One coffer cell (square) with stepped frames and a central rosette. Tile it over vault surfaces. */
export function cofferTextures(size: number, seed = 11): PBRTextures {
  const heightFn = (x: number, y: number): number => {
    const u = x / size - 0.5;
    const v = y / size - 0.5;
    const d = Math.max(Math.abs(u), Math.abs(v)); // 0 centre .. 0.5 edge
    let hgt: number;
    if (d > 0.44) hgt = 1.0; // rib
    else if (d > 0.4) hgt = 0.82 - (0.44 - d) * 1.5; // first step (ovolo)
    else if (d > 0.37) hgt = 0.66;
    else if (d > 0.33) hgt = 0.52 - (0.37 - d) * 2.0; // second step
    else hgt = 0.3;
    // bead moulding on the first step
    if (d > 0.405 && d < 0.425) hgt += 0.05 * Math.cos(((Math.abs(u) > Math.abs(v) ? v : u) * size) / 3.2);
    // rosette
    const r = Math.hypot(u, v);
    const a = Math.atan2(v, u);
    if (r < 0.2) {
      const petals = 0.5 + 0.5 * Math.cos(a * 12);
      const prof = Math.cos((r / 0.2) * Math.PI * 0.5);
      let ro = 0.3 + 0.45 * prof * (0.55 + 0.45 * petals);
      if (r < 0.06) ro = 0.3 + 0.6 * Math.cos((r / 0.06) * Math.PI * 0.5) + 0.12;
      else if (r < 0.1) ro += 0.08 * (0.5 + 0.5 * Math.cos(a * 8));
      hgt = Math.max(hgt, ro);
    }
    hgt += (fbm2(x / 24, y / 24, 2, seed, size / 24) - 0.5) * 0.04;
    return hgt;
  };
  const colorFn = (x: number, y: number, hgt: number): [number, number, number] => {
    const n = fbm2(x / 40, y / 40, 3, seed + 1, size / 40);
    const ao = 0.6 + 0.4 * clamp01((hgt - 0.25) / 0.75);
    const c = (0.88 + 0.1 * n) * ao;
    return [c, c * 0.985, c * 0.955];
  };
  return texturesFromFields(size, size, heightFn, colorFn, 6);
}

/** Pink Aswan granite with three columns of incised hieroglyphs (one obelisk face). */
export function hieroglyphTextures(w: number, h: number, seed = 31): PBRTextures {
  const { ctx } = makeCanvas(w, h);
  // height canvas: white = surface, dark = incised
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);
  const rnd = mulberry32(seed);
  const cols = [0.2, 0.5, 0.8];
  const colW = w * 0.2;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#000';
  const top = h * 0.012;
  const bottom = h * 0.985;
  // column frame lines
  ctx.lineWidth = Math.max(1, w * 0.006);
  for (const cx of cols) {
    const x0 = cx * w - colW / 2;
    ctx.strokeRect(x0, top, colW, bottom - top);
  }
  const glyph = (cx: number, cy: number, s: number, kind: number): void => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.lineWidth = Math.max(1, s * 0.09);
    ctx.lineCap = 'round';
    ctx.beginPath();
    switch (kind) {
      case 0: // bird (falcon/owl)
        ctx.ellipse(0, s * 0.05, s * 0.22, s * 0.3, 0.3, 0, Math.PI * 2);
        ctx.moveTo(s * 0.12, -s * 0.22);
        ctx.arc(s * 0.12, -s * 0.28, s * 0.1, 0, Math.PI * 2);
        ctx.moveTo(-s * 0.1, s * 0.35);
        ctx.lineTo(-s * 0.15, s * 0.45);
        ctx.moveTo(s * 0.05, s * 0.35);
        ctx.lineTo(s * 0.05, s * 0.45);
        ctx.stroke();
        break;
      case 1: // water zig-zag
        ctx.moveTo(-s * 0.4, 0);
        for (let i = 0; i < 6; i++) ctx.lineTo(-s * 0.4 + (i + 0.5) * s * 0.14, i % 2 ? -s * 0.08 : s * 0.08);
        ctx.stroke();
        break;
      case 2: // seated figure
        ctx.arc(0, -s * 0.3, s * 0.1, 0, Math.PI * 2);
        ctx.moveTo(0, -s * 0.2);
        ctx.lineTo(0, s * 0.1);
        ctx.lineTo(s * 0.25, s * 0.12);
        ctx.lineTo(s * 0.25, s * 0.4);
        ctx.moveTo(0, -s * 0.1);
        ctx.lineTo(s * 0.2, -s * 0.15);
        ctx.stroke();
        break;
      case 3: // ankh
        ctx.ellipse(0, -s * 0.25, s * 0.1, s * 0.14, 0, 0, Math.PI * 2);
        ctx.moveTo(0, -s * 0.11);
        ctx.lineTo(0, s * 0.4);
        ctx.moveTo(-s * 0.2, -s * 0.05);
        ctx.lineTo(s * 0.2, -s * 0.05);
        ctx.stroke();
        break;
      case 4: // cartouche with small signs
        ctx.stroke();
        ctx.lineWidth = Math.max(1, s * 0.07);
        ctx.beginPath();
        ctx.roundRect(-s * 0.32, -s * 0.9, s * 0.64, s * 1.8, s * 0.3);
        ctx.moveTo(-s * 0.36, s * 0.92);
        ctx.lineTo(s * 0.36, s * 0.92);
        ctx.stroke();
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(0, -s * 0.6 + i * s * 0.4, s * 0.09, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 5: // reed / feather
        ctx.moveTo(0, s * 0.4);
        ctx.quadraticCurveTo(s * 0.15, 0, 0, -s * 0.4);
        ctx.quadraticCurveTo(-s * 0.1, 0, 0, s * 0.4);
        ctx.stroke();
        break;
      case 6: // eye
        ctx.ellipse(0, 0, s * 0.3, s * 0.12, 0, 0, Math.PI * 2);
        ctx.moveTo(s * 0.06, 0);
        ctx.arc(0, 0, s * 0.06, 0, Math.PI * 2);
        ctx.moveTo(-s * 0.05, s * 0.12);
        ctx.lineTo(-s * 0.1, s * 0.3);
        ctx.stroke();
        break;
      case 7: // loaf / half disc
        ctx.arc(0, s * 0.1, s * 0.25, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        break;
      case 8: // snake
        ctx.moveTo(-s * 0.35, s * 0.1);
        ctx.bezierCurveTo(-s * 0.15, -s * 0.2, s * 0.05, s * 0.3, s * 0.3, -s * 0.05);
        ctx.lineTo(s * 0.35, -s * 0.2);
        ctx.stroke();
        break;
      default: // standing figure
        ctx.arc(0, -s * 0.35, s * 0.09, 0, Math.PI * 2);
        ctx.moveTo(0, -s * 0.26);
        ctx.lineTo(0, s * 0.15);
        ctx.lineTo(-s * 0.1, s * 0.42);
        ctx.moveTo(0, s * 0.15);
        ctx.lineTo(s * 0.1, s * 0.42);
        ctx.moveTo(-s * 0.18, -s * 0.1);
        ctx.lineTo(s * 0.18, -s * 0.2);
        ctx.stroke();
    }
    ctx.restore();
  };
  for (let c = 0; c < cols.length; c++) {
    const cx = cols[c] * w;
    const s = colW * (c === 1 ? 0.8 : 0.72);
    let y = top + s * 0.7;
    // top scene panel (pharaoh offering) suggested by a framed block
    ctx.lineWidth = Math.max(1, w * 0.004);
    ctx.strokeRect(cx - colW * 0.42, y - s * 0.55, colW * 0.84, s * 1.6);
    glyph(cx - s * 0.2, y + s * 0.2, s * 0.9, 2);
    glyph(cx + s * 0.22, y + s * 0.2, s * 0.9, 9);
    y += s * 1.8;
    while (y < bottom - s * 0.6) {
      const kind = Math.floor(rnd() * 10);
      if (kind === 4 && y < bottom - s * 2.2) {
        glyph(cx, y + s * 0.6, s, 4);
        y += s * 2.1;
        continue;
      }
      if (rnd() < 0.35) {
        // two small glyphs side by side
        glyph(cx - s * 0.22, y, s * 0.55, Math.floor(rnd() * 10) % 4 === 0 ? 7 : Math.floor(rnd() * 9));
        glyph(cx + s * 0.22, y, s * 0.55, Math.floor(rnd() * 9));
        y += s * 0.72;
      } else {
        glyph(cx, y, s * 0.85, kind === 4 ? 1 : kind);
        y += s * 0.95;
      }
    }
  }
  const hImg = ctx.getImageData(0, 0, w, h).data;
  const heightFn = (x: number, y: number): number => {
    const v = hImg[(y * w + x) * 4] / 255;
    return v * 0.9 + 0.1 * valueNoise2(x / 6, y / 6, seed);
  };
  const colorFn = (x: number, y: number, hgt: number): [number, number, number] => {
    // Aswan granite: pink feldspar base with dark biotite and grey quartz specks
    const s = hash2(x, y, seed + 5);
    const big = valueNoise2(x / 3, y / 3, seed + 6);
    const patch = valueNoise2(x / 60, y / 60, seed + 7);
    let r = 0.74 + 0.08 * patch;
    let g = 0.6 + 0.06 * patch;
    let b = 0.55 + 0.05 * patch;
    if (big > 0.72) {
      r *= 0.55;
      g *= 0.58;
      b *= 0.62;
    } else if (big < 0.22) {
      r = r * 0.8 + 0.12;
      g = g * 0.8 + 0.14;
      b = b * 0.8 + 0.15;
    }
    const sp = (s - 0.5) * 0.12;
    const incised = hgt < 0.55 ? 0.52 : 1;
    // weathering: lighter streaks downwards
    const streak = 0.94 + 0.08 * valueNoise2(x / 8, y / 160, seed + 8);
    return [(r + sp) * incised * streak, (g + sp) * incised * streak, (b + sp) * incised * streak];
  };
  return texturesFromFields(w, h, heightFn, colorFn, 3.5, false);
}

/** Grey granite (pedestal), tileable. */
export function greyGraniteTextures(size: number, seed = 41): PBRTextures {
  const heightFn = (x: number, y: number): number => 0.5 + 0.5 * (hash2(x, y, seed) - 0.5) * 0.3 + 0.1 * valueNoise2(x / 4, y / 4, seed, size / 4);
  const colorFn = (x: number, y: number): [number, number, number] => {
    const s = hash2(x, y, seed + 1);
    const big = valueNoise2(x / 2.5, y / 2.5, seed + 2, size / 2.5);
    const patch = fbm2(x / 50, y / 50, 3, seed + 3, size / 50);
    let c = 0.56 + 0.08 * patch + (s - 0.5) * 0.1;
    if (big > 0.75) c *= 0.45;
    else if (big < 0.2) c = c * 0.7 + 0.28;
    return [c * 0.98, c, c * 1.03];
  };
  return texturesFromFields(size, size, heightFn, colorFn, 1.5);
}

/**
 * Pedestal die atlas (2:1): left half = gilded line diagram of the machinery used to raise the obelisk,
 * right half = engraved inscription. Grey granite with gold (metalness map) lines.
 */
export function pedestalDieTextures(size: number, seed = 51): PBRTextures {
  const W = size * 2;
  const { ctx } = makeCanvas(W, size);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, size);
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  const s = size;
  const rnd = mulberry32(seed);
  for (let half = 0; half < 2; half++) {
    ctx.save();
    ctx.translate(half * s, 0);
    ctx.lineWidth = Math.max(1.5, s * 0.008);
    ctx.strokeRect(s * 0.07, s * 0.07, s * 0.86, s * 0.86);
    ctx.lineWidth = Math.max(1, s * 0.004);
    ctx.strokeRect(s * 0.095, s * 0.095, s * 0.81, s * 0.81);
    if (half === 0) {
      ctx.lineWidth = Math.max(1.5, s * 0.006);
      // inclined obelisk being raised
      ctx.save();
      ctx.translate(s * 0.42, s * 0.74);
      ctx.rotate(-0.62);
      ctx.strokeRect(-s * 0.035, -s * 0.42, s * 0.07, s * 0.42);
      ctx.beginPath();
      ctx.moveTo(-s * 0.035, -s * 0.42);
      ctx.lineTo(0, -s * 0.47);
      ctx.lineTo(s * 0.035, -s * 0.42);
      ctx.stroke();
      ctx.restore();
      // ground, ramp, pedestal
      ctx.beginPath();
      ctx.moveTo(s * 0.12, s * 0.82);
      ctx.lineTo(s * 0.88, s * 0.82);
      ctx.moveTo(s * 0.12, s * 0.82);
      ctx.lineTo(s * 0.38, s * 0.74);
      ctx.stroke();
      ctx.strokeRect(s * 0.36, s * 0.72, s * 0.12, s * 0.1);
      // shear legs / scaffold
      for (let i = 0; i < 5; i++) {
        const x = s * (0.56 + i * 0.065);
        ctx.beginPath();
        ctx.moveTo(x, s * 0.82);
        ctx.lineTo(x - s * 0.025, s * 0.24);
        ctx.stroke();
      }
      for (let i = 0; i < 7; i++) {
        const y = s * (0.27 + i * 0.08);
        ctx.beginPath();
        ctx.moveTo(s * 0.53, y);
        ctx.lineTo(s * 0.83, y);
        ctx.stroke();
      }
      ctx.lineWidth = Math.max(1, s * 0.003);
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.moveTo(s * (0.55 + rnd() * 0.25), s * 0.25);
        ctx.lineTo(s * (0.25 + rnd() * 0.15), s * (0.36 + rnd() * 0.2));
        ctx.stroke();
      }
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(s * (0.16 + i * 0.08), s * 0.88, s * 0.022, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.lineWidth = Math.max(1, s * 0.004);
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(s * 0.22, s * (0.13 + i * 0.03));
        ctx.lineTo(s * 0.78, s * (0.13 + i * 0.03));
        ctx.stroke();
      }
    } else {
      ctx.lineWidth = Math.max(1, s * 0.007);
      for (let i = 0; i < 10; i++) {
        const y = s * (0.26 + i * 0.05);
        const hw = s * (0.32 - (i % 3) * 0.04);
        ctx.setLineDash([s * 0.018, s * 0.007]);
        ctx.beginPath();
        ctx.moveTo(s * 0.5 - hw, y);
        ctx.lineTo(s * 0.5 + hw, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    ctx.restore();
  }
  const mask = ctx.getImageData(0, 0, W, size).data;
  const m = (x: number, y: number): number => mask[(Math.min(size - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))) * 4] / 255;
  const heightFn = (x: number, y: number): number => 0.8 - 0.4 * m(x, y) + 0.05 * (hash2(x, y, seed) - 0.5);
  const colorFn = (x: number, y: number): [number, number, number] => {
    const g = m(x, y);
    const sp = hash2(x, y, seed + 1);
    const big = valueNoise2(x / 2.5, y / 2.5, seed + 2);
    let c = 0.5 + 0.06 * fbm2(x / 50, y / 50, 3, seed + 3) + (sp - 0.5) * 0.1;
    if (big > 0.75) c *= 0.45;
    else if (big < 0.2) c = c * 0.7 + 0.26;
    return [c * (1 - g) + 1.0 * g, c * (1 - g) + 0.77 * g, c * 1.03 * (1 - g) + 0.34 * g];
  };
  const pbr = texturesFromFields(W, size, heightFn, colorFn, 2.0, false);
  const rm = new Uint8Array(W * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < W; x++) {
      const g = m(x, y);
      const k = ((size - 1 - y) * W + x) * 4;
      rm[k] = 255;
      rm[k + 1] = 255 * (0.6 * (1 - g) + 0.26 * g);
      rm[k + 2] = 255 * g;
      rm[k + 3] = 255;
    }
  }
  const rmTex = new THREE.DataTexture(rm, W, size, THREE.RGBAFormat);
  rmTex.wrapS = rmTex.wrapT = THREE.ClampToEdgeWrapping;
  rmTex.minFilter = THREE.LinearMipmapLinearFilter;
  rmTex.magFilter = THREE.LinearFilter;
  rmTex.generateMipmaps = true;
  rmTex.needsUpdate = true;
  pbr.roughnessMap = rmTex;
  pbr.metalnessMap = rmTex;
  return pbr;
}

/** Joint-free carved limestone (for sculpture): fine chisel noise + pores, tileable. */
export function carvedStoneTextures(size: number, seed = 13): PBRTextures {
  const per = 8;
  const heightFn = (x: number, y: number): number => {
    const u = x / size;
    const v = y / size;
    const n = fbm2(u * per * 2, v * per * 2, 4, seed, per * 2);
    const chisel = valueNoise2(u * 64 + n * 3, v * 64, seed + 1, 64);
    const pore = hash2(x, y, seed + 2) > 0.985 ? -0.25 : 0;
    return 0.5 + 0.3 * n + 0.15 * chisel + pore;
  };
  const colorFn = (x: number, y: number, hgt: number): [number, number, number] => {
    const u = x / size;
    const v = y / size;
    const n = fbm2(u * per, v * per, 3, seed + 3, per);
    const c = clamp01(0.9 + 0.1 * n + (hgt - 0.5) * 0.12 + (hash2(x, y, seed + 4) - 0.5) * 0.03);
    return [c, c * 0.985, c * 0.955];
  };
  return texturesFromFields(size, size, heightFn, colorFn, 2.5);
}
