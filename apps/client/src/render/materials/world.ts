import * as THREE from 'three';
import { patchMaterial, LIGHTFIELD_APPLY, WET_REFLECTION } from './common';

/**
 * Procedural building façades. Attributes:
 *  aFac  = (u along wall [m], v height above street [m], wall length [m], cornice height above street [m])
 *  aFac2 = (seed 0..1, building class, wall kind (0 generic, 1 haussmann, 2 tower glass, 3 church, 4 industrial), total height)
 */
export function createFacadeMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, metalness: 0 });
  return patchMaterial(m, {
    name: 'facade',
    vertexHeader: 'attribute vec4 aFac; attribute vec4 aFac2; varying vec4 vFac; varying vec4 vFac2;',
    vertexMain: 'vFac = aFac; vFac2 = aFac2;',
    fragmentHeader: /* glsl */ `
      varying vec4 vFac; varying vec4 vFac2;
      float gWin; float gLit; vec3 gLitCol; float gGlass; float gIron; float lfHeight; float wetSpec;
      vec3 stoneTint(float s){
        // Lutetian limestone, cream to warm grey, some darker (pollution) and some freshly cleaned
        vec3 a = vec3(0.80, 0.735, 0.62), b = vec3(0.72, 0.68, 0.60), c = vec3(0.86, 0.80, 0.68);
        return s < 0.5 ? mix(a, b, s * 2.0) : mix(a, c, (s - 0.5) * 2.0);
      }
      vec3 plasterTint(float s){
        vec3 cols[6] = vec3[6](vec3(0.85,0.82,0.76), vec3(0.78,0.74,0.68), vec3(0.62,0.6,0.58), vec3(0.72,0.55,0.45), vec3(0.88,0.86,0.82), vec3(0.66,0.62,0.52));
        return cols[int(floor(s * 5.999))];
      }
    `,
    afterMap: /* glsl */ `
      {
        float u = vFac.x, v = vFac.y, L = vFac.z, top = vFac.w;
        float seed = vFac2.x; float kind = vFac2.z;
        lfHeight = v;
        gWin = 0.0; gLit = 0.0; gGlass = 0.0; gIron = 0.0; gLitCol = vec3(0.0); wetSpec = 0.0;
        vec3 col;
        float nz = fbm(vec2(u * 0.35, v * 0.35) + seed * 91.0);
        if (kind > 1.5 && kind < 2.5) {
          // glass curtain wall tower
          float bw = 1.5, fh = 3.8;
          float cu = fract(u / bw), cv = fract(v / fh);
          float mull = max(1.0 - aaband(0.04, 0.96, cu), 1.0 - aaband(0.08, 0.92, cv));
          vec2 cell = vec2(floor(u / bw), floor(v / fh));
          float rnd = h21(cell + seed * 37.0);
          gGlass = 1.0 - mull;
          col = mix(vec3(0.20, 0.25, 0.30) * (0.8 + 0.4 * rnd), vec3(0.55, 0.56, 0.58), mull);
          gLit = gGlass * step(rnd, uWindowLit * 0.8) * step(0.5, h21(cell.yx + 3.1));
          gLitCol = mix(vec3(1.0, 0.95, 0.85), vec3(0.85, 0.92, 1.0), h21(cell + 7.0));
        } else if (kind > 0.5 && kind < 1.5) {
          // ---------------- Haussmann
          float gfH = 4.0 + seed * 1.0;              // rez-de-chaussée + entresol
          float fh = 2.85 + fract(seed * 7.31) * 0.45;
          float bayT = 2.75 + fract(seed * 13.7) * 0.7;
          float nb = max(1.0, floor(L / bayT + 0.5));
          float bw = L / nb;
          float bu = u / bw; float bay = floor(bu); float bx = fract(bu);
          float fl = floor((v - gfH) / fh); float fy = fract((v - gfH) / fh);
          vec3 stone = stoneTint(fract(seed * 3.7)) * (0.92 + 0.12 * nz);
          // stone courses (joints) every ~0.52 m, staggered blocks
          float course = v / 0.52;
          float joint = 1.0 - aaband(0.04, 0.96, fract(course));
          float blockU = fract(u / 1.1 + 0.5 * mod(floor(course), 2.0));
          joint = max(joint, (1.0 - aaband(0.015, 0.985, blockU)) * 0.6);
          col = stone * (1.0 - joint * 0.12);
          // dirt streaks below cornices/windows
          col *= 1.0 - 0.10 * smoothstep(0.6, 1.0, fbm(vec2(u * 0.6, v * 0.08) + seed * 11.0)) ;
          bool tooNarrow = L < 2.2;
          if (v < gfH) {
            // ground floor: rusticated stone + shop fronts / porte cochère
            float rust = 1.0 - aaband(0.06, 0.94, fract(v / 0.48));
            col *= 1.0 - rust * 0.22;
            float shopX = aaband(0.08, 0.92, bx);
            float shopY = aaband(0.35, gfH - 0.75, v);
            float isDoor = step(0.82, h21(vec2(bay, seed * 13.0)));
            if (!tooNarrow) {
              float shop = shopX * shopY;
              if (shop > 0.0) {
                float frame = 1.0 - aaband(0.11, 0.89, bx) * aaband(0.45, gfH - 0.85, v);
                vec3 shopFrame = mix(vec3(0.08, 0.10, 0.09), vec3(0.35, 0.08, 0.08), step(0.7, h21(vec2(bay * 0.37, seed))));
                shopFrame = mix(shopFrame, vec3(0.05), step(0.4, h21(vec2(seed, 3.3))));
                vec3 glassC = vec3(0.04, 0.05, 0.06);
                col = mix(col, mix(glassC, shopFrame, frame), shop);
                gGlass = shop * (1.0 - frame);
                // awning / signboard band
                float sign = aaband(gfH - 1.35, gfH - 0.85, v) * shopX;
                col = mix(col, shopFrame * 1.3, sign * 0.9);
                float shopLit = step(0.25, h21(vec2(bay, seed * 5.0))) * uShopLit;
                gLit = max(gLit, gGlass * shopLit * (1.0 - isDoor));
                gLitCol = mix(vec3(1.0, 0.85, 0.62), vec3(1.0, 0.95, 0.9), h21(vec2(bay, 1.0)));
                gWin = gGlass;
              }
            }
          } else if (v < top) {
            // upper floors
            float storeyTop = top - 0.1;
            float ww = clamp(1.25 / bw, 0.25, 0.62);
            float wh = clamp(2.15 / fh, 0.55, 0.8);
            float wx0 = 0.5 - ww * 0.5, wx1 = 0.5 + ww * 0.5;
            float wy0 = 0.08, wy1 = 0.08 + wh;
            float inFloor = step(v, storeyTop - 0.4);
            float win = aaband(wx0, wx1, bx) * aaband(wy0, wy1, fy) * inFloor * (tooNarrow ? 0.0 : 1.0);
            // moulded surround
            float sur = aaband(wx0 - 0.045, wx1 + 0.045, bx) * aaband(wy0 - 0.02, wy1 + 0.035, fy) * inFloor * (tooNarrow ? 0.0 : 1.0);
            col = mix(col, stone * 1.06, (sur - win) * 0.9);
            // pediment over 2nd floor (étage noble)
            if (fl == 1.0) col = mix(col, stone * 0.85, aaband(wx0 - 0.06, wx1 + 0.06, bx) * aaband(wy1 + 0.035, wy1 + 0.07, fy) * 0.8);
            // string course at each floor slab; stronger at 1 and 4 (balcony levels)
            float slab = 1.0 - aaband(0.0, 0.97, fy);
            col *= 1.0 - slab * 0.18;
            if (win > 0.0) {
              // French window: frame, central mullion, transom
              float fx = (bx - wx0) / ww, fyy = (fy - wy0) / wh;
              float frame = 1.0 - aaband(0.06, 0.94, fx) * aaband(0.04, 0.96, fyy);
              frame = max(frame, 1.0 - aaband(0.0, 0.47, fx) - aaband(0.53, 1.0, fx));
              frame = max(frame, aaband(0.72, 0.75, fyy));
              float h = h21(vec2(bay, fl) + seed * 71.0);
              vec3 inside = mix(vec3(0.03, 0.035, 0.04), vec3(0.11, 0.10, 0.09), h * 0.7);
              // curtains
              float curtain = (1.0 - aaband(0.18, 0.82, fx)) * step(0.45, h);
              inside = mix(inside, vec3(0.55, 0.52, 0.47) * (0.6 + 0.4 * h), curtain * 0.5);
              vec3 frameC = vec3(0.86, 0.85, 0.82);
              col = mix(col, mix(inside, frameC, frame), win);
              gGlass = win * (1.0 - frame);
              gWin = win;
              float litChance = uWindowLit * (fl > 4.0 ? 0.85 : 1.0);
              gLit = gGlass * step(h21(vec2(bay, fl) + seed * 13.0), litChance) * (1.0 - curtain * 0.5);
              float warm = h21(vec2(fl, bay) + 5.0);
              gLitCol = warm > 0.15 ? mix(vec3(1.0, 0.72, 0.42), vec3(1.0, 0.88, 0.7), warm) : vec3(0.55, 0.7, 1.0);
              // ceiling lamp hotspot
              gLitCol *= 0.6 + 0.8 * smoothstep(0.0, 0.7, fyy) * (1.0 - abs(fx - 0.5));
            }
            // wrought iron balconies: continuous at floors 1 and 4, individual guards elsewhere
            float balc = (fl == 1.0 || fl == 4.0) ? 1.0 : 0.0;
            float railH = aaband(0.08, 0.36, fy) * inFloor;
            float bars = aaband(0.25, 0.75, fract(u * 9.0));
            float scroll = aaband(0.3, 0.7, fract((u + fy * 1.3) * 3.0)) * aaband(0.14, 0.3, fy);
            float rail = railH * max(max(bars, scroll), aaband(0.32, 0.36, fy) + aaband(0.08, 0.11, fy));
            float railMask = balc > 0.5 ? 1.0 : aaband(wx0 - 0.01, wx1 + 0.01, bx) * (tooNarrow ? 0.0 : 1.0);
            gIron = rail * railMask;
            col = mix(col, vec3(0.025, 0.028, 0.03), gIron);
            // balcony slab shadow line
            if (balc > 0.5) col *= 1.0 - aaband(0.0, 0.07, fy) * 0.45;
          }
        } else {
          // ---------------- generic / modern / church / industrial
          float s = fract(seed * 5.3);
          vec3 base = kind > 2.5 && kind < 3.5 ? vec3(0.72, 0.68, 0.6) : plasterTint(s);
          col = base * (0.9 + 0.15 * nz);
          if (kind > 3.5) {
            col = mix(vec3(0.5, 0.48, 0.45), vec3(0.42, 0.25, 0.2), step(0.6, s)) * (0.85 + 0.2 * nz);
          } else {
            float fh = 3.0, bw = 2.6 + s * 0.8;
            float nb = max(1.0, floor(L / bw + 0.5)); float bwr = L / nb;
            float bx = fract(u / bwr), fy = fract(v / fh);
            float bay = floor(u / bwr), fl = floor(v / fh);
            float isChurch = kind > 2.5 ? 1.0 : 0.0;
            float win = aaband(0.3, 0.7, bx) * aaband(0.3, isChurch > 0.5 ? 0.95 : 0.8, fy) * step(1.0, v) * step(v, top - 0.6) * step(2.0, L);
            if (isChurch > 0.5) win *= step(0.5, fract(fl * 0.5)) ;
            float h = h21(vec2(bay, fl) + seed * 19.0);
            vec3 inside = vec3(0.04, 0.045, 0.05) + h * 0.05;
            col = mix(col, inside, win);
            gGlass = win; gWin = win;
            gLit = win * step(h, uWindowLit * 0.9);
            gLitCol = mix(vec3(1.0, 0.78, 0.5), vec3(0.9, 0.95, 1.0), step(0.7, h21(vec2(fl, bay))));
            if (v < 3.2) gLit = max(gLit, win * uShopLit * step(0.5, h));
          }
        }
        // rain darkening of porous stone
        col *= 1.0 - uWet * 0.25 * (1.0 - gGlass);
        diffuseColor.rgb = col;
      }
    `,
    afterRoughness: 'roughnessFactor = mix(roughnessFactor, 0.06, gGlass); roughnessFactor = mix(roughnessFactor, 0.45, gIron); roughnessFactor *= 1.0 - uWet * 0.3;',
    afterMetalness: 'metalnessFactor = mix(metalnessFactor, 0.4, gIron);',
    afterEmissive: /* glsl */ `
      totalEmissiveRadiance += gLitCol * gLit * 3.2 * smoothstep(0.05, 0.6, uNight);
    `,
    afterLights: LIGHTFIELD_APPLY,
  });
}

/** Roof materials: aRoof = (kind: 0 flat zinc top, 1 mansard slope, 2 cornice stone, 3 chimney, 4 flat modern, seed, u, v) */
export function createRoofMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.2 });
  return patchMaterial(m, {
    name: 'roof',
    vertexHeader: 'attribute vec4 aRoof; varying vec4 vRoof;',
    vertexMain: 'vRoof = aRoof;',
    fragmentHeader: 'varying vec4 vRoof; float rMetal; float rRough; float rLit; vec3 rLitCol; float lfHeight;',
    afterMap: /* glsl */ `
      {
        float kind = vRoof.x, seed = vRoof.y, u = vRoof.z, v = vRoof.w;
        vec3 col; rMetal = 0.0; rRough = 0.7; rLit = 0.0; rLitCol = vec3(1.0, 0.75, 0.45); lfHeight = 20.0;
        float nz = fbm(vWorld.xz * 0.3 + seed * 50.0);
        if (kind < 0.5) {
          // zinc flat top
          col = vec3(0.40, 0.43, 0.46) * (0.85 + 0.25 * nz);
          float seam = 1.0 - aaband(0.03, 0.97, fract(vWorld.x * 2.2));
          col *= 1.0 - seam * 0.15;
          rMetal = 0.55; rRough = 0.42;
        } else if (kind < 1.5) {
          bool slate = fract(seed * 9.7) > 0.72;
          if (slate) {
            float row = fract(v / 0.18);
            float tile = fract(u / 0.3 + 0.5 * mod(floor(v / 0.18), 2.0));
            col = vec3(0.17, 0.18, 0.2) * (0.85 + 0.3 * h21(vec2(floor(u / 0.3), floor(v / 0.18))));
            col *= 1.0 - (1.0 - aaband(0.0, 0.9, row)) * 0.35 - (1.0 - aaband(0.03, 0.97, tile)) * 0.2;
            rRough = 0.5; rMetal = 0.1;
          } else {
            col = vec3(0.43, 0.46, 0.50) * (0.82 + 0.3 * nz);
            float seam = 1.0 - aaband(0.06, 0.94, fract(u / 0.48));
            col = mix(col, col * 1.25, seam);
            rMetal = 0.6; rRough = 0.38;
          }
          // dormer windows (lucarnes)
          float bw = 2.9 + fract(seed * 13.7) * 0.7;
          float bx = fract(u / bw);
          float hasDormer = step(0.18, h21(vec2(floor(u / bw), seed * 7.0)));
          float dw = aaband(0.36, 0.64, bx) * aaband(0.35, 1.75, v) * hasDormer;
          float dframe = dw * (1.0 - aaband(0.39, 0.61, bx) * aaband(0.42, 1.6, v));
          float roofCap = aaband(0.32, 0.68, bx) * aaband(1.75, 2.05, v) * hasDormer;
          vec3 frameC = vec3(0.82, 0.8, 0.76);
          col = mix(col, vec3(0.03, 0.035, 0.045), dw);
          col = mix(col, frameC, dframe);
          col = mix(col, vec3(0.30, 0.32, 0.35), roofCap);
          float h = h21(vec2(floor(u / bw), seed * 3.0));
          rLit = dw * (1.0 - dframe) * step(h, uWindowLit * 0.7);
          rRough = mix(rRough, 0.08, dw * (1.0 - dframe));
          rMetal = mix(rMetal, 0.0, dw);
        } else if (kind < 2.5) {
          col = vec3(0.82, 0.76, 0.64) * (0.9 + 0.15 * nz);
          col *= 0.85 + 0.15 * smoothstep(0.2, 0.9, v);
          rRough = 0.85;
        } else if (kind < 3.5) {
          // chimney stack: plaster with terracotta pots on top
          col = mix(vec3(0.70, 0.62, 0.52), vec3(0.62, 0.32, 0.20), step(0.5, fract(seed * 17.0)));
          col *= 0.8 + 0.3 * nz;
          rRough = 0.9;
        } else {
          col = mix(vec3(0.30, 0.30, 0.30), vec3(0.48, 0.46, 0.43), fract(seed * 3.1)) * (0.8 + 0.35 * nz);
          rRough = 0.85;
        }
        col *= 1.0 - uWet * 0.2;
        diffuseColor.rgb = col;
      }
    `,
    afterRoughness: 'roughnessFactor = rRough * (1.0 - uWet * 0.45);',
    afterMetalness: 'metalnessFactor = rMetal;',
    afterEmissive: 'totalEmissiveRadiance += rLitCol * rLit * 2.5 * smoothstep(0.05, 0.6, uNight);',
  });
}

/**
 * Roads. aRoad = (lateral offset [m] or 1000 for junctions, distance along [m], width, packed(lanesF + 8 lanesB + 64 oneway + 128 surface))
 *        aRoad2 = (edge length, trimA, trimB, flags)
 */
export function createRoadMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0 });
  m.polygonOffset = true; m.polygonOffsetFactor = -2; m.polygonOffsetUnits = -2;
  return patchMaterial(m, {
    name: 'road',
    vertexHeader: 'attribute vec4 aRoad; attribute vec4 aRoad2; varying vec4 vRoad; varying vec4 vRoad2;',
    vertexMain: 'vRoad = aRoad; vRoad2 = aRoad2;',
    fragmentHeader: /* glsl */ `
      varying vec4 vRoad; varying vec4 vRoad2;
      float rPaint; float rPuddle; float wetSpec; float lfHeight; float rCobble;
      float dashLine(float lat, float center, float halfW, float along, float dash, float gap, float solid){
        float l = aaband(center - halfW, center + halfW, lat);
        float d = solid > 0.5 ? 1.0 : aastep(fract(along / (dash + gap)), dash / (dash + gap));
        return l * d;
      }
    `,
    afterMap: /* glsl */ `
      {
        lfHeight = 0.0;
        float lat = vRoad.x, along = vRoad.y, w = vRoad.z, packed = vRoad.w;
        float surface = floor(packed / 128.0);
        float rem = packed - surface * 128.0;
        float oneway = floor(rem / 64.0); rem -= oneway * 64.0;
        float lanesB = floor(rem / 8.0); float lanesF = rem - lanesB * 8.0;
        vec2 p = vWorld.xz;
        rCobble = step(0.5, surface);
        vec3 col;
        float n1 = fbm(p * 0.9), n2 = vnoise(p * 7.0), n3 = fbm(p * 0.07 + 3.0);
        if (rCobble > 0.5) {
          // granite setts (pavé) in rows
          vec2 q = p * vec2(1.0 / 0.11, 1.0 / 0.11);
          float row = floor(q.y);
          q.x = q.x * 0.6 + h11(row) * 3.0;
          vec2 cell = floor(q); vec2 f = fract(q);
          float stoneR = h21(cell);
          float joint = 1.0 - aaband(0.08, 0.92, f.x) * aaband(0.1, 0.9, f.y);
          col = mix(vec3(0.20, 0.19, 0.185), vec3(0.32, 0.31, 0.30), stoneR) * (0.8 + 0.3 * n2);
          col = mix(col, vec3(0.06, 0.06, 0.055), joint * 0.85);
          rPuddle = joint;
        } else {
          col = vec3(0.085, 0.087, 0.09) * (0.78 + 0.35 * n1 + 0.12 * n2);
          // patch repairs and lane wear
          col = mix(col, col * 0.7, smoothstep(0.62, 0.66, n3) * 0.6);
          col = mix(col, col * 1.25, smoothstep(0.55, 0.85, fbm(p * 0.2 + 9.0)) * 0.4);
          rPuddle = 0.0;
        }
        // lane markings
        rPaint = 0.0;
        if (lat < 999.0) {
          float hw = w * 0.5;
          float len = vRoad2.x, ta = vRoad2.y, tb = vRoad2.z;
          float nearEnd = step(along, ta + 14.0) + step(len - tb - 14.0, along);
          float wear = 0.75 + 0.25 * vnoise(p * 3.0);
          if (oneway < 0.5 && lanesB > 0.0) {
            // two-way: centre line (dashed, solid near junction approaches)
            rPaint += dashLine(lat, 0.0, 0.07, along, 3.0, 3.5, nearEnd);
            float lw = min(3.3, hw / max(1.0, lanesF));
            for (int i = 1; i < 4; i++) {
              if (float(i) < lanesF) rPaint += dashLine(lat, lw * float(i), 0.06, along, 3.0, 5.0, 0.0);
              if (float(i) < lanesB) rPaint += dashLine(lat, -lw * float(i), 0.06, along, 3.0, 5.0, 0.0);
            }
          } else {
            float n = max(1.0, lanesF);
            float lw = min(3.4, w / n);
            float start = -lw * n * 0.5;
            for (int i = 1; i < 6; i++) if (float(i) < n) rPaint += dashLine(lat, start + lw * float(i), 0.06, along, 3.0, 5.0, 0.0);
          }
          rPaint = clamp(rPaint, 0.0, 1.0) * wear * (1.0 - rCobble * 0.4);
        }
        col = mix(col, vec3(0.78, 0.78, 0.74), rPaint);
        // wetness: darkening, puddles in low spots (noise), joints
        float pud = smoothstep(0.58 - uPuddles * 0.22, 0.66 - uPuddles * 0.22, fbm(p * 0.18 + 4.7)) * uPuddles;
        rPuddle = max(rPuddle * uWet, pud);
        col *= 1.0 - uWet * 0.42;
        col = mix(col, col * 0.55, rPuddle);
        wetSpec = clamp(uWet * 0.6 + rPuddle, 0.0, 1.0) * (1.0 - rPaint * 0.5);
        diffuseColor.rgb = col;
      }
    `,
    afterRoughness: 'roughnessFactor = mix(rCobble > 0.5 ? 0.75 : 0.92, 0.55, rPaint); roughnessFactor = mix(roughnessFactor, roughnessFactor * 0.45, uWet); roughnessFactor = mix(roughnessFactor, 0.03, rPuddle);',
    afterNormal: /* glsl */ `
      #ifndef FLAT_SHADED
      {
        // micro-relief (asphalt grain, cobbles), flattened by water in puddles
        vec2 e = vec2(0.03, 0.0);
        float hC = vnoise(vWorld.xz * 9.0);
        float hX = vnoise((vWorld.xz + e.xy) * 9.0), hZ = vnoise((vWorld.xz + e.yx) * 9.0);
        vec3 bump = vec3(hC - hX, 0.0, hC - hZ) * (0.9 + rCobble * 1.4) * (1.0 - rPuddle);
        vec3 nW = normalize(vec3(0.0, 1.0, 0.0) + bump);
        // ripples from rain drops in puddles
        if (rPuddle > 0.01 && uWet > 0.2) {
          vec2 cellp = floor(vWorld.xz * 2.0); vec2 fr = fract(vWorld.xz * 2.0) - 0.5;
          float tt = fract(uTime * 1.3 + h21(cellp) * 7.0);
          float rr = length(fr - (h22(cellp) - 0.5) * 0.6);
          float ring = sin((rr - tt * 0.5) * 60.0) * exp(-rr * 9.0) * (1.0 - tt);
          nW = normalize(nW + vec3(fr.x, 0.0, fr.y) * ring * 0.6 * rPuddle * uWet);
        }
        normal = normalize((viewMatrix * vec4(nW, 0.0)).xyz);
      }
      #endif
    `,
    afterLights: LIGHTFIELD_APPLY + WET_REFLECTION,
  });
}

/** Ground: sidewalks (asphalt), with a per-tile mask texture for grass (R), stone paving (G), gravel (B), flowers/pitch (A). */
export function createGroundMaterial(mask: THREE.Texture | null, tileOrigin: THREE.Vector2, tileSize: number): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, metalness: 0 });
  m.polygonOffset = true; m.polygonOffsetFactor = 1; m.polygonOffsetUnits = 1;
  return patchMaterial(m, {
    name: 'ground',
    uniforms: { uMask: { value: mask }, uTileOrigin: { value: tileOrigin }, uTileSize: { value: tileSize }, uHasMask: { value: mask ? 1 : 0 } },
    fragmentHeader: 'uniform sampler2D uMask; uniform vec2 uTileOrigin; uniform float uTileSize; uniform float uHasMask; float gRough; float gGrass; float wetSpec; float lfHeight;',
    afterMap: /* glsl */ `
      {
        lfHeight = 0.0;
        vec2 p = vWorld.xz;
        vec4 mk = uHasMask > 0.5 ? texture2D(uMask, (p - uTileOrigin) / uTileSize) : vec4(0.0);
        float n = fbm(p * 0.6), n2 = vnoise(p * 6.0);
        // threshold mask edges with noise for natural borders
        float edgeN = (fbm(p * 1.7) - 0.5) * 0.35;
        float grass = smoothstep(0.35, 0.65, mk.r + edgeN);
        float pave = smoothstep(0.35, 0.65, mk.g + edgeN * 0.5);
        float gravel = smoothstep(0.35, 0.65, mk.b + edgeN);
        // sidewalk asphalt (Paris: fine grey asphalt) with slab borders near buildings
        vec3 side = vec3(0.21, 0.205, 0.2) * (0.85 + 0.2 * n + 0.08 * n2);
        side = mix(side, side * 0.82, smoothstep(0.6, 0.7, fbm(p * 0.25 + 2.0)) * 0.5);
        vec3 grassC = mix(vec3(0.10, 0.17, 0.05), vec3(0.17, 0.21, 0.07), fbm(p * 0.35 + 5.0)) * (0.8 + 0.4 * n2);
        vec2 sl = fract(p * vec2(1.0 / 0.6, 1.0 / 0.4) + vec2(0.5 * mod(floor(p.y / 0.4), 2.0), 0.0));
        float slabJ = 1.0 - aaband(0.03, 0.97, sl.x) * aaband(0.04, 0.96, sl.y);
        vec3 paveC = vec3(0.52, 0.50, 0.46) * (0.85 + 0.2 * h21(floor(p * vec2(1.0 / 0.6, 1.0 / 0.4)))) * (1.0 - slabJ * 0.3);
        vec3 gravelC = vec3(0.58, 0.52, 0.42) * (0.8 + 0.25 * n2 + 0.1 * n);
        vec3 col = side;
        col = mix(col, gravelC, gravel);
        col = mix(col, paveC, pave);
        col = mix(col, grassC, grass);
        float flowers = smoothstep(0.6, 0.9, mk.a) * grass;
        if (flowers > 0.0) {
          float f = step(0.8, vnoise(p * 9.0));
          vec3 fc = mix(vec3(0.8, 0.15, 0.2), vec3(0.9, 0.8, 0.25), h21(floor(p * 9.0)));
          col = mix(col, mix(vec3(0.12, 0.08, 0.05), fc, f), flowers * 0.8);
        }
        gGrass = grass;
        float wetMask = 1.0 - grass * 0.6;
        col *= 1.0 - uWet * 0.38 * wetMask;
        gRough = mix(0.88, 0.96, grass);
        gRough = mix(gRough, gRough * 0.5, uWet * wetMask);
        wetSpec = uWet * 0.5 * wetMask;
        // snow
        col = mix(col, vec3(0.9, 0.92, 0.95), uSnow * smoothstep(0.3, 0.7, n + uSnow * 0.5));
        diffuseColor.rgb = col;
      }
    `,
    afterRoughness: 'roughnessFactor = gRough;',
    afterLights: LIGHTFIELD_APPLY + WET_REFLECTION,
  });
}

export function createCurbMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75, metalness: 0 });
  return patchMaterial(m, {
    name: 'curb',
    vertexHeader: 'attribute vec2 aCurb; varying vec2 vCurb;',
    vertexMain: 'vCurb = aCurb;',
    fragmentHeader: 'varying vec2 vCurb; float lfHeight; float wetSpec;',
    afterMap: /* glsl */ `
      lfHeight = 0.0;
      {
        float ramp = step(1.5, vCurb.y);
        vec3 granite = vec3(0.46, 0.45, 0.43) * (0.85 + 0.25 * vnoise(vWorld.xz * 14.0));
        float joint = 1.0 - aaband(0.01, 0.99, fract(vCurb.x / 1.0));
        granite *= 1.0 - joint * 0.4;
        vec3 side = vec3(0.21, 0.205, 0.2) * (0.85 + 0.2 * fbm(vWorld.xz * 0.6));
        vec3 col = mix(granite, side, ramp);
        col *= 1.0 - uWet * 0.35;
        diffuseColor.rgb = col;
        wetSpec = uWet * 0.4;
      }
    `,
    afterRoughness: 'roughnessFactor *= 1.0 - uWet * 0.5;',
    afterLights: LIGHTFIELD_APPLY,
  });
}

export function createStoneMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, metalness: 0 });
  return patchMaterial(m, {
    name: 'stone',
    vertexHeader: 'attribute vec2 aStone; varying vec2 vStone;',
    vertexMain: 'vStone = aStone;',
    fragmentHeader: 'varying vec2 vStone; float lfHeight;',
    afterMap: /* glsl */ `
      lfHeight = max(0.0, vStone.y);
      {
        vec2 q = vec2(vStone.x / 1.2, vStone.y / 0.55);
        q.x += 0.5 * mod(floor(q.y), 2.0);
        float j = 1.0 - aaband(0.02, 0.98, fract(q.x)) * aaband(0.04, 0.96, fract(q.y));
        vec3 c = vec3(0.70, 0.64, 0.54) * (0.82 + 0.22 * h21(floor(q)) + 0.1 * fbm(vWorld.xz * 0.5 + vWorld.y));
        // algae / water stains near the waterline
        float wl = smoothstep(2.5, 0.0, vStone.y);
        c = mix(c, vec3(0.25, 0.27, 0.2), wl * 0.6);
        c *= 1.0 - j * 0.25;
        c *= 1.0 - uWet * 0.3;
        diffuseColor.rgb = c;
      }
    `,
    afterLights: LIGHTFIELD_APPLY,
  });
}

export function createMarkingMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color: 0xc8c8c0, roughness: 0.6, metalness: 0 });
  m.polygonOffset = true; m.polygonOffsetFactor = -4; m.polygonOffsetUnits = -4;
  return patchMaterial(m, {
    name: 'marks',
    fragmentHeader: 'float lfHeight; float wetSpec;',
    afterMap: 'lfHeight = 0.0; diffuseColor.rgb *= (0.8 + 0.25 * vnoise(vWorld.xz * 4.0)) * (1.0 - uWet * 0.2); wetSpec = uWet * 0.3;',
    afterRoughness: 'roughnessFactor *= 1.0 - uWet * 0.5;',
    afterLights: LIGHTFIELD_APPLY + WET_REFLECTION,
  });
}

export function createWaterMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color: 0x0c1412, roughness: 0.04, metalness: 0.0 });
  return patchMaterial(m, {
    name: 'water',
    fragmentHeader: 'float lfHeight; float wetSpec;',
    afterMap: 'lfHeight = 0.0; wetSpec = 1.0; diffuseColor.rgb = mix(vec3(0.035, 0.05, 0.045), vec3(0.06, 0.08, 0.07), fbm(vWorld.xz * 0.05 + uTime * 0.01));',
    afterNormal: /* glsl */ `
      {
        vec2 p = vWorld.xz;
        float t = uTime;
        vec2 e = vec2(0.15, 0.0);
        float h0 = fbm(p * 0.35 + vec2(t * 0.15, t * 0.05)) + 0.5 * vnoise(p * 1.7 - vec2(t * 0.3, -t * 0.2));
        float hx = fbm((p + e.xy) * 0.35 + vec2(t * 0.15, t * 0.05)) + 0.5 * vnoise((p + e.xy) * 1.7 - vec2(t * 0.3, -t * 0.2));
        float hz = fbm((p + e.yx) * 0.35 + vec2(t * 0.15, t * 0.05)) + 0.5 * vnoise((p + e.yx) * 1.7 - vec2(t * 0.3, -t * 0.2));
        vec3 nW = normalize(vec3((h0 - hx) * 1.6, 1.0, (h0 - hz) * 1.6));
        normal = normalize((viewMatrix * vec4(nW, 0.0)).xyz);
      }
    `,
    afterLights: WET_REFLECTION,
  });
}
