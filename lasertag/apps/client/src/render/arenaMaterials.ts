import * as THREE from 'three';
import { NU, NEON_UNIFORMS_GLSL, NEON_FUNCS_GLSL } from './neon.ts';

/** Material ids packed in the aMat attribute. */
export const MAT = { wall: 0, mirror: 1, crate: 2, metal: 3, glass: 4, perimeter: 5, ceiling: 6, ramp: 7, fixture: 8 } as const;
export const PATTERN = { none: 0, grid: 1, chevron: 2, stars: 3, hex: 4, stripes: 5, circuit: 6 } as const;

const PATTERN_GLSL = /* glsl */ `
float gridLine(vec2 uv, float cell, float w) {
  vec2 g = abs(fract(uv / cell - 0.5) - 0.5) * cell;
  vec2 fw = max(fwidth(uv) * 1.2, vec2(1e-4));
  vec2 l = 1.0 - smoothstep(vec2(w) - fw, vec2(w) + fw, g);
  return max(l.x, l.y);
}
float band(float x, float a, float b) {
  float fw = max(fwidth(x) * 1.2, 1e-4);
  return smoothstep(a - fw, a + fw, x) - smoothstep(b - fw, b + fw, x);
}
float hexDist(vec2 p) {
  p = abs(p);
  return max(dot(p, normalize(vec2(1.0, 1.7320508))), p.x);
}
float hexLines(vec2 uv, float s) {
  vec2 r = vec2(1.0, 1.7320508) * s;
  vec2 h = r * 0.5;
  vec2 a = mod(uv, r) - h;
  vec2 b = mod(uv - h, r) - h;
  vec2 g = dot(a, a) < dot(b, b) ? a : b;
  float d = 0.5 * s - hexDist(g);
  float fw = max(fwidth(d) * 1.5, 1e-4);
  return 1.0 - smoothstep(0.012 * s * 10.0 - fw, 0.012 * s * 10.0 + fw, d);
}
float stars(vec2 uv, float t) {
  vec2 c = floor(uv * 1.6);
  vec2 f = fract(uv * 1.6);
  float acc = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j));
    float h = neonHash(c + o);
    vec2 p = o + vec2(neonHash(c + o + 7.1), neonHash(c + o + 3.7)) * 0.8 + 0.1;
    float d = length(f - p);
    float s = 0.018 + 0.03 * h * h;
    float tw = 0.6 + 0.4 * sin(t * (1.0 + h * 3.0) + h * 40.0);
    acc += (1.0 - smoothstep(s * 0.2, s, d)) * tw * step(0.35, h);
    acc += 0.08 * (1.0 - smoothstep(0.0, s * 6.0, d)) * step(0.35, h);
  }
  return acc;
}
float circuit(vec2 uv) {
  vec2 c = floor(uv * 2.0);
  vec2 f = fract(uv * 2.0);
  float h = neonHash(c);
  float l = 0.0;
  float w = 0.035;
  if (h < 0.35) l = band(f.y, 0.5 - w, 0.5 + w);
  else if (h < 0.7) l = band(f.x, 0.5 - w, 0.5 + w);
  else if (h < 0.85) l = max(band(f.x, 0.5 - w, 0.5 + w) * step(0.5, f.y), band(f.y, 0.5 - w, 0.5 + w) * step(f.x, 0.5));
  float node = (1.0 - smoothstep(0.07, 0.11, length(f - 0.5))) * step(0.85, h);
  return max(l, node);
}
float patternValue(float id, vec2 uv, float t) {
  if (id < 0.5) return 0.0;
  if (id < 1.5) return gridLine(uv, 0.5, 0.012);
  if (id < 2.5) {
    float c = fract(uv.y * 1.7 + abs(fract(uv.x * 0.85) - 0.5) * 1.3);
    return band(c, 0.0, 0.16) * 0.9;
  }
  if (id < 3.5) return stars(uv, t);
  if (id < 4.5) return hexLines(uv, 0.32);
  if (id < 5.5) {
    float s = fract((uv.x + uv.y) * 1.4);
    return band(s, 0.0, 0.5) * 0.45;
  }
  return circuit(uv);
}
`;

const ARENA_VERT = /* glsl */ `
attribute vec3 aBoxMin;
attribute vec3 aBoxMax;
attribute vec3 aAlbedo;
attribute vec3 aTrim;
attribute vec3 aTint;
attribute float aPattern;
attribute float aMat;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec3 vBoxMin;
varying vec3 vBoxMax;
varying vec3 vAlbedo;
varying vec3 vTrim;
varying vec3 vTint;
varying float vPattern;
varying float vMat;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vBoxMin = aBoxMin; vBoxMax = aBoxMax;
  vAlbedo = aAlbedo; vTrim = aTrim; vTint = aTint; vPattern = aPattern; vMat = aMat;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const ARENA_FRAG = /* glsl */ `
${NEON_UNIFORMS_GLSL}
uniform samplerCube uEnvMap;
uniform float uHasEnv;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec3 vBoxMin;
varying vec3 vBoxMax;
varying vec3 vAlbedo;
varying vec3 vTrim;
varying vec3 vTint;
varying float vPattern;
varying float vMat;
${NEON_FUNCS_GLSL}
${PATTERN_GLSL}

float lineGlow(float d, float core) {
  float fw = max(fwidth(d) * 1.2, 1e-4);
  return (1.0 - smoothstep(core - fw, core + fw, d)) + exp(-d * 14.0) * 0.28;
}

void main() {
  vec3 P = vWorld;
  vec3 N = normalize(vNormal);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(uCamPos - P);
  vec3 an = abs(N);
  vec2 uv = an.x > 0.5 ? P.zy : (an.y > 0.5 ? P.xz : P.xy);

  vec3 dmin = P - vBoxMin;
  vec3 dmax = vBoxMax - P;
  vec3 ed = min(dmin, dmax);
  float edgeDist = 1e3;
  if (an.x < 0.5) edgeDist = min(edgeDist, ed.x);
  if (an.y < 0.5) edgeDist = min(edgeDist, ed.y);
  if (an.z < 0.5) edgeDist = min(edgeDist, ed.z);

  float beatGlow = 0.82 + 0.38 * uBeat;
  vec3 albedo = vAlbedo;
  float spec = 0.25, shin = 24.0;
  vec3 emit = vec3(0.0);
  float mat = vMat;

  // fluorescent pattern (glows under UV)
  float pat = patternValue(vPattern, uv, uTime);
  emit += vTint * pat * 0.3 * beatGlow;

  // soft contact darkening near the floor
  float ao = mix(0.45, 1.0, smoothstep(0.0, 0.9, P.y));

  // neon trim along the top edges
  if (dot(vTrim, vTrim) > 0.0) {
    float topD = an.y < 0.5 ? dmax.y : min(ed.x, ed.z);
    if (N.y < -0.5) topD = 1e3;
    if (mat > 4.5 && mat < 5.5) {
      // perimeter: neon bands at hip height and at the top of the maze walls
      topD = min(abs(P.y - 0.18), abs(P.y - 2.95));
      if (an.y > 0.5) topD = 1e3;
    }
    emit += vTrim * lineGlow(topD, 0.035) * beatGlow;
  }
  // faint edge lines on every block for readability of shapes
  emit += vTint * lineGlow(edgeDist, 0.012) * 0.22;

  if (mat > 0.5 && mat < 1.5) {
    // mirror: crisp reflection of the arena + slight violet tint
    vec3 R = reflect(-V, N);
    vec3 env = uHasEnv > 0.5 ? textureCube(uEnvMap, R).rgb : uFogColor * 2.0;
    float fres = 0.55 + 0.45 * pow(1.0 - max(dot(N, V), 0.0), 3.0);
    vec3 col = env * fres * vec3(0.85, 0.9, 1.05);
    // scanline shimmer so mirrors read as surfaces
    col += vec3(0.25, 0.3, 0.6) * 0.06 * (0.5 + 0.5 * sin(P.y * 60.0 + uTime * 2.0));
    col += emit;
    col = neonFog(col, P);
    gl_FragColor = vec4(col, 1.0);
    return;
  }
  if (mat > 1.5 && mat < 2.5) { // crate
    spec = 0.4; shin = 40.0;
    float panel = gridLine(uv - 0.05, 0.6, 0.014);
    albedo *= 1.0 - panel * 0.5;
  } else if (mat > 2.5 && mat < 3.5) { // metal
    spec = 0.9; shin = 60.0;
    albedo *= 0.8 + 0.2 * gridLine(uv, 0.25, 0.01);
  } else if (mat > 5.5 && mat < 6.5) { // ceiling
    spec = 0.05;
    float truss = gridLine(uv, 3.0, 0.08);
    albedo = mix(albedo, vec3(0.06, 0.05, 0.1), truss);
    ao = 1.0;
  } else if (mat > 7.5) { // light fixture
    gl_FragColor = vec4(vTrim * 1.8 * beatGlow + vAlbedo, 1.0);
    return;
  }

  vec3 col = neonLighting(P, N, V, albedo * ao, spec, shin);
  // environment sheen
  if (uHasEnv > 0.5) {
    vec3 R = reflect(-V, N);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 4.0);
    col += textureCube(uEnvMap, R).rgb * (0.03 + fres * 0.25) * spec;
  }
  col += emit;
  col = neonFog(col, P);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function createArenaMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    name: 'ArenaSurface',
    uniforms: { ...NU, uHasEnv: { value: 0 } } as unknown as Record<string, THREE.IUniform>,
    vertexShader: ARENA_VERT,
    fragmentShader: ARENA_FRAG,
  });
}

// ------------------------------------------------------------------ floor
const FLOOR_VERT = /* glsl */ `
uniform mat4 uReflMatrix;
varying vec3 vWorld;
varying vec4 vReflUv;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  vReflUv = uReflMatrix * wp;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

export const MAX_SPAWN_PADS = 16;

const FLOOR_FRAG = /* glsl */ `
${NEON_UNIFORMS_GLSL}
uniform sampler2D uRefl;
uniform float uReflOn;
uniform samplerCube uEnvMap;
uniform float uHasEnv;
uniform vec3 uTeamCol[2];
uniform vec4 uBase[2];       // xz center, xz half size
uniform vec4 uPads[${MAX_SPAWN_PADS}]; // xz, team, active
uniform vec3 uStation;       // xz + radius
varying vec3 vWorld;
varying vec4 vReflUv;
${NEON_FUNCS_GLSL}
${PATTERN_GLSL}

void main() {
  vec3 P = vWorld;
  vec3 N = vec3(0.0, 1.0, 0.0);
  vec3 V = normalize(uCamPos - P);
  vec2 uv = P.xz;

  // tiles: 1 m, per-tile gloss variation, dark seams
  vec2 tile = floor(uv);
  float th = neonHash(tile);
  float seam = gridLine(uv, 1.0, 0.012);
  float rough = mix(0.25, 0.6, th);
  vec3 albedo = vec3(0.045, 0.04, 0.075) * (0.85 + 0.3 * th);
  albedo *= 1.0 - seam * 0.6;

  float beatGlow = 0.82 + 0.38 * uBeat;
  vec3 emit = vec3(0.0);
  emit += vec3(0.32, 0.18, 0.95) * seam * 0.07;

  // team bases: hatched glowing floor + border line
  for (int b = 0; b < 2; b++) {
    vec2 d = abs(uv - uBase[b].xy) - uBase[b].zw;
    float inside = step(max(d.x, d.y), 0.0);
    float border = max(d.x, d.y);
    vec3 tc = uTeamCol[b];
    float hatch = band(fract((uv.x * (b == 0 ? 1.0 : -1.0) + uv.y) * 0.8), 0.0, 0.12);
    emit += tc * inside * hatch * 0.14 * beatGlow;
    float fw = max(fwidth(border) * 1.5, 1e-4);
    emit += tc * (1.0 - smoothstep(0.05 - fw, 0.05 + fw, abs(border))) * 2.2 * beatGlow;
    emit += tc * exp(-abs(border) * 3.0) * 0.12;
  }
  // spawn pads
  for (int i = 0; i < ${MAX_SPAWN_PADS}; i++) {
    vec4 p = uPads[i];
    if (p.w < 0.5) continue;
    float r = length(uv - p.xy);
    float ring = band(r, 0.48, 0.55);
    emit += uTeamCol[int(p.z)] * ring * 0.9 * beatGlow;
  }
  // energy station: pulsing concentric rings
  {
    float r = length(uv - uStation.xy);
    float rings = band(fract(r * 2.0 - uTime * 0.8), 0.0, 0.1) * (1.0 - smoothstep(uStation.z - 0.4, uStation.z, r));
    float edge = band(r, uStation.z - 0.06, uStation.z);
    emit += vec3(1.0, 0.54, 0.12) * (rings * 0.6 + edge * 2.0) * beatGlow;
  }

  vec3 col = neonLighting(P, N, V, albedo, 1.2, 90.0);

  // reflections: planar (blurred by roughness via mips) or static cube fallback
  float fres = 0.16 + 0.84 * pow(1.0 - max(V.y, 0.0), 5.0);
  vec3 refl;
  if (uReflOn > 0.5) {
    vec2 ruv = vReflUv.xy / vReflUv.w;
    ruv += (vec2(neonHash(tile + 1.3), neonHash(tile + 9.1)) - 0.5) * 0.004;
    float lod = rough * 4.5;
    refl = textureLod(uRefl, ruv, lod).rgb * 0.55;
    refl += textureLod(uRefl, ruv + vec2(0.0, 0.012 * rough), lod + 1.0).rgb * 0.25;
    refl += textureLod(uRefl, ruv - vec2(0.0, 0.02 * rough), lod + 1.5).rgb * 0.2;
  } else if (uHasEnv > 0.5) {
    refl = textureCube(uEnvMap, reflect(-V, N)).rgb * 0.5;
  } else refl = vec3(0.0);
  col += refl * fres * (1.0 - seam * 0.8) * (1.15 - rough);
  col += emit;
  col = neonFog(col, P);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function createFloorMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    name: 'ArenaFloor',
    uniforms: {
      ...NU,
      uRefl: { value: null },
      uReflOn: { value: 0 },
      uReflMatrix: { value: new THREE.Matrix4() },
      uHasEnv: { value: 0 },
      uTeamCol: NU.uTeamColors,
      uBase: { value: [new THREE.Vector4(), new THREE.Vector4()] },
      uPads: { value: Array.from({ length: MAX_SPAWN_PADS }, () => new THREE.Vector4()) },
      uStation: { value: new THREE.Vector3(0, 0, 1.8) },
    } as unknown as Record<string, THREE.IUniform>,
    vertexShader: FLOOR_VERT,
    fragmentShader: FLOOR_FRAG,
  });
}
