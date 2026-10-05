import * as THREE from 'three';

/**
 * "Neon-UV" shading model shared by every lit material: UV hemispheric ambient, a fixed array of point
 * lights (map lights + a pool of dynamic flashes), analytic height fog and analytic in-scattering
 * (the glow halos lights make in the haze). One uniform set, shared by reference across materials.
 */
export const MAX_LIGHTS = 16;

export const NU = {
  uTime: { value: 0 },
  uBeat: { value: 0 },
  uBar: { value: 0 },
  uIntensity: { value: 0 },
  uCamPos: { value: new THREE.Vector3() },
  uLightPos: { value: Array.from({ length: MAX_LIGHTS }, () => new THREE.Vector3()) },
  uLightColor: { value: Array.from({ length: MAX_LIGHTS }, () => new THREE.Vector3()) },
  uLightRange: { value: new Array<number>(MAX_LIGHTS).fill(1) },
  uLightCount: { value: 0 },
  uFogColor: { value: new THREE.Color('#1b0c3d') },
  uFogDensity: { value: 0.03 },
  uFogHeight: { value: 3.5 },
  uScatter: { value: 1.0 },
  uUvAmbient: { value: new THREE.Color('#3a1f8a') },
  uUvGround: { value: new THREE.Color('#0b0620') },
  uEnvMap: { value: null as THREE.CubeTexture | null },
  uTeamColors: { value: [new THREE.Color('#18e7ff'), new THREE.Color('#ff2bd6')] },
};

export const NEON_UNIFORMS_GLSL = /* glsl */ `
uniform float uTime;
uniform float uBeat;
uniform float uBar;
uniform float uIntensity;
uniform vec3 uCamPos;
uniform vec3 uLightPos[${MAX_LIGHTS}];
uniform vec3 uLightColor[${MAX_LIGHTS}];
uniform float uLightRange[${MAX_LIGHTS}];
uniform int uLightCount;
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform float uFogHeight;
uniform float uScatter;
uniform vec3 uUvAmbient;
uniform vec3 uUvGround;
`;

export const NEON_FUNCS_GLSL = /* glsl */ `
float nSat(float x) { return clamp(x, 0.0, 1.0); }

// Lambert + Blinn-Phong from the light array, plus UV hemispheric ambient.
vec3 neonLighting(vec3 P, vec3 N, vec3 V, vec3 albedo, float specAmt, float shininess) {
  vec3 col = albedo * mix(uUvGround, uUvAmbient, N.y * 0.5 + 0.5);
  for (int i = 0; i < ${MAX_LIGHTS}; i++) {
    if (i >= uLightCount) break;
    vec3 Lv = uLightPos[i] - P;
    float d2 = dot(Lv, Lv);
    float d = sqrt(d2);
    vec3 L = Lv / max(d, 1e-4);
    float win = nSat(1.0 - pow(d / uLightRange[i], 4.0));
    float att = win * win / (d2 * 0.12 + 1.0);
    if (att <= 0.0) continue;
    float ndl = max(dot(N, L), 0.0);
    vec3 H = normalize(L + V);
    float sp = pow(max(dot(N, H), 0.0), shininess) * specAmt;
    col += uLightColor[i] * att * (albedo * ndl + sp);
  }
  return col;
}

// Light scattered toward the eye by the haze along the view ray (closed-form integral of 1/(h^2+s^2)).
vec3 neonInscatter(vec3 ro, vec3 rd, float t) {
  vec3 acc = vec3(0.0);
  for (int i = 0; i < ${MAX_LIGHTS}; i++) {
    if (i >= uLightCount) break;
    vec3 q = uLightPos[i] - ro;
    float s0 = dot(q, rd);
    float h2 = max(dot(q, q) - s0 * s0, 0.04);
    float h = sqrt(h2);
    float I = (atan((t - s0) / h) - atan(-s0 / h)) / h;
    float r = uLightRange[i];
    float fall = nSat(1.0 - h / (r * 0.9));
    acc += uLightColor[i] * I * fall * fall;
  }
  return acc;
}

// Height fog: density d0 * exp(-y / H), integrated along the camera ray.
float neonFogAmount(vec3 ro, vec3 P) {
  vec3 rd = P - ro;
  float dist = length(rd);
  float y0 = ro.y, y1 = P.y;
  float H = uFogHeight;
  float dy = y1 - y0;
  float od;
  if (abs(dy) < 1e-3) od = exp(-y0 / H) * dist;
  else od = H * (exp(-y0 / H) - exp(-y1 / H)) / dy * dist;
  od = uFogDensity * (od + dist * 0.35); // a little uniform haze everywhere
  return 1.0 - exp(-od);
}

vec3 neonFog(vec3 col, vec3 P) {
  vec3 ro = uCamPos;
  vec3 rd = P - ro;
  float t = length(rd);
  rd /= max(t, 1e-4);
  float f = neonFogAmount(ro, P);
  vec3 scatter = neonInscatter(ro, rd, t) * uFogDensity * uScatter * 0.9;
  vec3 r = mix(col, uFogColor, f) + scatter;
  // never let a NaN/Inf reach the HDR buffer: bloom would smear it over the whole screen
  return (any(isnan(r)) || any(isinf(r))) ? uFogColor : min(max(r, vec3(0.0)), vec3(64.0));
}

float neonHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
`;

export function neonMaterialBase(): Record<string, THREE.IUniform> {
  return { ...NU } as unknown as Record<string, THREE.IUniform>;
}

/** Apply a map's atmosphere to the shared uniforms. */
export function setAtmosphere(a: { fogColor: string; fogDensity: number; fogHeight: number; uvAmbient: string; uvGround: string }) {
  NU.uFogColor.value.set(a.fogColor);
  NU.uFogDensity.value = a.fogDensity;
  NU.uFogHeight.value = a.fogHeight;
  NU.uUvAmbient.value.set(a.uvAmbient);
  NU.uUvGround.value.set(a.uvGround);
}

export const TEAM_HEX = ['#18e7ff', '#ff2bd6'];
export const TEAM_COLORS = [new THREE.Color(TEAM_HEX[0]), new THREE.Color(TEAM_HEX[1])];
export const TEAM_NAMES = ['CYAN', 'MAGENTA'];
export const TEAM_SHAPES = ['▲', '◆'];
