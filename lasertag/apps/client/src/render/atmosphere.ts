import * as THREE from 'three';
import type { MapDef } from '@neon/shared';
import { NU, NEON_UNIFORMS_GLSL, MAX_LIGHTS } from './neon.ts';

/**
 * Fake volumetrics: additive light cones under ceiling spots (god rays) and lit dust motes that sparkle
 * when they drift through a beam of light.
 */
export class Atmosphere {
  readonly group = new THREE.Group();
  private dust: THREE.Points | null = null;

  constructor(map: MapDef, dustCount: number) {
    for (const l of map.lights) {
      if (!l.cone) continue;
      const h = l.pos[1];
      const rTop = 0.32, rBot = l.coneRadius ?? 2.5;
      const geo = new THREE.CylinderGeometry(rTop, rBot, h, 40, 8, true);
      geo.translate(0, -h / 2, 0);
      const mat = new THREE.ShaderMaterial({
        uniforms: { uTime: NU.uTime, uBeat: NU.uBeat, uCamPos: NU.uCamPos, uColor: { value: new THREE.Color(l.color).multiplyScalar(l.intensity * 0.09) }, uH: { value: h } },
        vertexShader: /* glsl */ `
          varying vec3 vN; varying vec3 vW; varying float vT;
          uniform float uH;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
            vT = -position.y / uH; // 0 at the lamp, 1 at the floor
            gl_Position = projectionMatrix * viewMatrix * wp;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; uniform float uTime; uniform float uBeat; uniform vec3 uCamPos;
          varying vec3 vN; varying vec3 vW; varying float vT;
          float h1(float x) { return fract(sin(x * 91.3) * 47453.5); }
          void main() {
            vec3 V = normalize(uCamPos - vW);
            float facing = abs(dot(normalize(vN), V));
            float edge = pow(facing, 1.6);
            float along = (1.0 - vT * 0.75) * smoothstep(0.0, 0.08, vT) * (1.0 - smoothstep(0.85, 1.0, vT));
            // slow drifting streaks inside the beam
            float ang = atan(vN.z, vN.x);
            float streak = 0.75 + 0.25 * sin(ang * 7.0 + uTime * 0.7) * sin(ang * 3.0 - uTime * 0.4 + vT * 4.0);
            float near = smoothstep(0.5, 3.0, length(uCamPos - vW));
            vec3 c = uColor * edge * along * streak * near * (0.9 + 0.25 * uBeat);
            gl_FragColor = vec4(c, 1.0);
          }`,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(l.pos[0], l.pos[1], l.pos[2]);
      m.renderOrder = 3;
      this.group.add(m);
    }
    if (dustCount > 0) this.buildDust(map, dustCount);
  }

  private buildDust(map: MapDef, count: number) {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const { min, max } = map.bounds;
    for (let i = 0; i < count; i++) {
      pos[i * 3] = min[0] + Math.random() * (max[0] - min[0]);
      pos[i * 3 + 1] = Math.pow(Math.random(), 1.6) * (map.ceiling - 0.5) + 0.1;
      pos[i * 3 + 2] = min[1] + Math.random() * (max[1] - min[1]);
      seed[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100);
    const mat = new THREE.ShaderMaterial({
      uniforms: { ...NU, uPixel: { value: 1 } } as unknown as Record<string, THREE.IUniform>,
      vertexShader: /* glsl */ `
        ${NEON_UNIFORMS_GLSL}
        uniform float uPixel;
        attribute float aSeed;
        varying vec3 vCol;
        void main() {
          vec3 p = position;
          float t = uTime * (0.05 + aSeed * 0.08);
          p.x += sin(t * 3.0 + aSeed * 50.0) * 0.8;
          p.z += cos(t * 2.3 + aSeed * 31.0) * 0.8;
          p.y += sin(t * 1.7 + aSeed * 13.0) * 0.4;
          vec3 c = uUvAmbient * 0.02;
          for (int i = 0; i < ${MAX_LIGHTS}; i++) {
            if (i >= uLightCount) break;
            vec3 d = uLightPos[i] - p;
            // light cones point down: favour motes below the lamp
            float horiz = length(d.xz);
            float below = d.y > 0.0 ? 1.0 : 0.3;
            float r = uLightRange[i];
            float k = below * max(0.0, 1.0 - horiz / (0.2 + d.y * 0.42)) * max(0.0, 1.0 - length(d) / r);
            c += uLightColor[i] * (k * 0.45 + 0.02 / (1.0 + dot(d, d)));
          }
          vCol = c * (0.6 + 0.8 * fract(aSeed * 7.13));
          vec4 mv = viewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(uPixel * (0.9 + aSeed * 1.6) * 6.0 / -mv.z, 0.0, 6.0);
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vCol;
        void main() {
          vec2 d = gl_PointCoord - 0.5;
          float a = (1.0 - smoothstep(0.0, 0.5, length(d)));
          gl_FragColor = vec4(vCol * a, 1.0);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.dust = new THREE.Points(geo, mat);
    this.dust.frustumCulled = false;
    this.dust.renderOrder = 4;
    this.group.add(this.dust);
  }

  setPixelRatio(pr: number) {
    if (this.dust) (this.dust.material as THREE.ShaderMaterial).uniforms.uPixel.value = pr;
  }
}
