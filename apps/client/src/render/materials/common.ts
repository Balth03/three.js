import * as THREE from 'three';

/** Uniforms shared by every world material (updated once per frame by the Environment / LightField systems). */
export const G = {
  uTime: { value: 0 },
  uWet: { value: 0 }, // 0..1 surface wetness
  uPuddles: { value: 0 }, // 0..1 puddle coverage (grows slowly with rain duration)
  uNight: { value: 0 }, // 0 day .. 1 full night
  uWindowLit: { value: 0 }, // fraction of windows lit
  uShopLit: { value: 0 }, // ground-floor shops lit
  uLightTex: { value: null as THREE.Texture | null },
  uLightOrigin: { value: new THREE.Vector2(0, 0) }, // world x/z of the light field texture corner
  uLightSize: { value: 640 }, // metres covered by the light field
  uLightGain: { value: 0 }, // global multiplier (0 by day)
  uCameraPos: { value: new THREE.Vector3() },
  uSnow: { value: 0 },
};

/** GLSL: hashes, value noise, fbm. */
export const NOISE_GLSL = /* glsl */ `
float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 h22(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1,0)), u.x), mix(h21(i + vec2(0,1)), h21(i + vec2(1,1)), u.x), u.y); }
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++){ s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
float aastep(float threshold, float value){ float w = max(fwidth(value), 1e-4) * 0.7; return smoothstep(threshold - w, threshold + w, value); }
/** 1 inside [a,b] with antialiased edges */
float aaband(float a, float b, float v){ return aastep(a, v) * (1.0 - aastep(b, v)); }
`;

/** GLSL: light field sampling (street lamps / headlights irradiance + lamp heads for wet reflections). */
export const LIGHTFIELD_GLSL = /* glsl */ `
uniform sampler2D uLightTex;
uniform vec2 uLightOrigin;
uniform float uLightSize;
uniform float uLightGain;
vec4 sampleLightField(vec2 xz){
  vec2 uv = (xz - uLightOrigin) / uLightSize;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec4(0.0);
  vec2 edge = smoothstep(vec2(0.0), vec2(0.06), uv) * smoothstep(vec2(0.0), vec2(0.06), 1.0 - uv);
  return texture2D(uLightTex, uv) * edge.x * edge.y * uLightGain;
}
`;

export const COMMON_UNIFORM_DECL = /* glsl */ `
uniform float uTime; uniform float uWet; uniform float uPuddles; uniform float uNight; uniform float uWindowLit; uniform float uShopLit; uniform vec3 uCameraPos; uniform float uSnow;
`;

export interface PatchSpec {
  name: string;
  uniforms?: Record<string, { value: unknown }>;
  vertexHeader?: string;
  vertexMain?: string; // appended after <worldpos_vertex> (has 'transformed', worldPosition may not exist -> we compute vWorld)
  fragmentHeader?: string;
  afterMap?: string; // after <map_fragment>: modify diffuseColor
  afterRoughness?: string; // after <roughnessmap_fragment>
  afterMetalness?: string;
  afterNormal?: string; // after <normal_fragment_maps>
  afterEmissive?: string; // after <emissivemap_fragment>: modify totalEmissiveRadiance
  afterLights?: string; // after <lights_fragment_end>: modify reflectedLight
  defines?: Record<string, string | number>;
}

/** Patch a MeshStandard/Physical material with procedural shading code. Adds vWorld (world position) varying. */
export function patchMaterial<T extends THREE.MeshStandardMaterial>(mat: T, p: PatchSpec): T {
  mat.defines = { ...(mat.defines ?? {}), ...(p.defines ?? {}) };
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, G, p.uniforms ?? {});
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vWorld;\nvarying vec3 vWNormal;\n${COMMON_UNIFORM_DECL}\n${p.vertexHeader ?? ''}`)
      .replace(
        '#include <worldpos_vertex>',
        `#include <worldpos_vertex>
        {
          vec4 wp = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
            wp = instanceMatrix * wp;
          #endif
          wp = modelMatrix * wp;
          vWorld = wp.xyz;
          vec3 wn = objectNormal;
          #ifdef USE_INSTANCING
            wn = mat3(instanceMatrix) * wn;
          #endif
          vWNormal = normalize(mat3(modelMatrix) * wn);
        }
        ${p.vertexMain ?? ''}`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vWorld;\nvarying vec3 vWNormal;\n${COMMON_UNIFORM_DECL}\n${NOISE_GLSL}\n${LIGHTFIELD_GLSL}\n${p.fragmentHeader ?? ''}`)
      .replace('#include <map_fragment>', `#include <map_fragment>\n${p.afterMap ?? ''}`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>\n${p.afterRoughness ?? ''}`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>\n${p.afterMetalness ?? ''}`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>\n${p.afterNormal ?? ''}`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n${p.afterEmissive ?? ''}`)
      .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>\n${p.afterLights ?? ''}`);
  };
  mat.customProgramCacheKey = () => p.name;
  return mat;
}

/**
 * Standard "street light" contribution: adds light-field irradiance to diffuse, with a height falloff.
 * Requires: float lfHeight (height above street), vec3 diffuse colour in material.diffuseColor.
 */
export const LIGHTFIELD_APPLY = /* glsl */ `
{
  vec4 lf = sampleLightField(vWorld.xz);
  float hf = exp(-max(0.0, lfHeight - 1.5) * 0.16) * (0.35 + 0.65 * clamp(vWNormal.y * 0.5 + 0.6, 0.0, 1.0));
  reflectedLight.directDiffuse += lf.rgb * hf * BRDF_Lambert(material.diffuseColor);
}
`;

/** Wet-surface specular reflection of lamp heads, sampled from the light field along the mirrored view ray. */
export const WET_REFLECTION = /* glsl */ `
{
  vec3 V = normalize(vWorld - uCameraPos);
  vec3 Rr = reflect(V, vec3(0.0, 1.0, 0.0));
  if (Rr.y > 0.02) {
    float hLamp = 6.5;
    vec2 hitXZ = vWorld.xz + Rr.xz * (hLamp / Rr.y);
    vec4 lf2 = sampleLightField(hitXZ);
    float streak = lf2.a * wetSpec;
    reflectedLight.directSpecular += vec3(1.0, 0.82, 0.6) * streak * 0.9;
    // car lights low reflection
    vec2 hitLow = vWorld.xz + Rr.xz * (0.75 / Rr.y);
    reflectedLight.directSpecular += sampleLightField(hitLow).rgb * wetSpec * 0.25;
  }
}
`;
