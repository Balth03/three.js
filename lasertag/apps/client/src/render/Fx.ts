import * as THREE from 'three';
import { NU } from './neon.ts';

/**
 * Pooled GPU effects. Every effect is a ring buffer of instance attributes animated entirely in the shader
 * from a birth time, so the CPU only writes when something spawns (no per-frame updates, no allocation).
 */

const BEAM_MAX = 96;
const SPARK_MAX = 3072;
const MARK_MAX = 192;

export class Fx {
  readonly group = new THREE.Group();
  private beamGeo: THREE.InstancedBufferGeometry;
  private beamA: THREE.InstancedBufferAttribute;
  private beamB: THREE.InstancedBufferAttribute;
  private beamC: THREE.InstancedBufferAttribute;
  private beamT: THREE.InstancedBufferAttribute;
  private beamNext = 0;

  private sparkGeo: THREE.BufferGeometry;
  private sparkP: THREE.BufferAttribute;
  private sparkV: THREE.BufferAttribute;
  private sparkC: THREE.BufferAttribute;
  private sparkT: THREE.BufferAttribute;
  private sparkNext = 0;
  private sparkDirty = false;

  private markGeo: THREE.InstancedBufferGeometry;
  private markP: THREE.InstancedBufferAttribute;
  private markN: THREE.InstancedBufferAttribute;
  private markC: THREE.InstancedBufferAttribute;
  private markT: THREE.InstancedBufferAttribute;
  private markNext = 0;

  constructor() {
    // ---------------------------------------------------------------- beams
    const quad = new THREE.InstancedBufferGeometry();
    quad.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, -1, 0, 1, -1, 0, 1, 1, 0, 0, 1, 0]), 3));
    quad.setIndex([0, 1, 2, 0, 2, 3]);
    this.beamA = new THREE.InstancedBufferAttribute(new Float32Array(BEAM_MAX * 3), 3);
    this.beamB = new THREE.InstancedBufferAttribute(new Float32Array(BEAM_MAX * 3), 3);
    this.beamC = new THREE.InstancedBufferAttribute(new Float32Array(BEAM_MAX * 3), 3);
    this.beamT = new THREE.InstancedBufferAttribute(new Float32Array(BEAM_MAX * 2).fill(-100), 2); // birth, width
    for (const a of [this.beamA, this.beamB, this.beamC, this.beamT]) a.setUsage(THREE.DynamicDrawUsage);
    quad.setAttribute('aA', this.beamA);
    quad.setAttribute('aB', this.beamB);
    quad.setAttribute('aC', this.beamC);
    quad.setAttribute('aT', this.beamT);
    quad.instanceCount = BEAM_MAX;
    this.beamGeo = quad;
    const beamMat = new THREE.ShaderMaterial({
      uniforms: { uTime: NU.uTime, uCamPos: NU.uCamPos, uFogDensity: NU.uFogDensity },
      vertexShader: /* glsl */ `
        attribute vec3 aA; attribute vec3 aB; attribute vec3 aC; attribute vec2 aT;
        uniform float uTime; uniform vec3 uCamPos;
        varying vec2 vUv; varying vec3 vCol; varying float vAge; varying float vLen; varying float vW;
        void main() {
          float age = uTime - aT.x;
          vAge = age;
          vec3 dir = aB - aA;
          float len = length(dir);
          vLen = len;
          dir /= max(len, 1e-4);
          vec3 p = mix(aA, aB, position.x);
          vec3 toCam = normalize(uCamPos - p);
          vec3 side = normalize(cross(dir, toCam));
          // fresh beams are fat with light, then thin out as they fade
          float w = aT.y * (1.0 + 1.6 * exp(-age * 30.0)) * (1.0 + age * 0.6);
          vW = w;
          p += side * position.y * w;
          vUv = vec2(position.x * len, position.y);
          vCol = aC;
          if (age < 0.0 || age > 1.6) p = vec3(0.0, -999.0, 0.0);
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime; uniform float uFogDensity;
        varying vec2 vUv; varying vec3 vCol; varying float vAge; varying float vLen; varying float vW;
        void main() {
          float y = abs(vUv.y);
          float core = exp(-y * y * 140.0);
          float halo = exp(-y * y * 9.0);
          float haze = exp(-y * 2.5) * 0.35;
          float flash = exp(-vAge * 22.0);
          float trail = exp(-vAge * 3.2);
          // shimmer travelling down the residual trail
          float shimmer = 0.75 + 0.25 * sin(vUv.x * 9.0 - uTime * 50.0);
          // a bright pulse races from the muzzle to the target in the first frames
          float head = exp(-pow((vUv.x - vAge * 600.0), 2.0) * 0.02) * step(vAge, 0.15);
          float fadeEnds = smoothstep(0.0, 0.25, vUv.x) * smoothstep(0.0, 0.1, vLen - vUv.x);
          vec3 white = vec3(1.0, 0.97, 0.95);
          vec3 c = white * core * (flash * 9.0 + trail * 0.5)
                 + vCol * halo * (flash * 3.2 + trail * 0.9 * shimmer)
                 + vCol * haze * (flash * 1.4 + trail * 0.3) * (0.4 + uFogDensity * 18.0)
                 + vCol * head * 3.0 * halo;
          gl_FragColor = vec4(c * fadeEnds, 1.0);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const beams = new THREE.Mesh(quad, beamMat);
    beams.frustumCulled = false;
    beams.renderOrder = 5;
    this.group.add(beams);

    // ---------------------------------------------------------------- sparks
    this.sparkGeo = new THREE.BufferGeometry();
    this.sparkP = new THREE.BufferAttribute(new Float32Array(SPARK_MAX * 3), 3);
    this.sparkV = new THREE.BufferAttribute(new Float32Array(SPARK_MAX * 3), 3);
    this.sparkC = new THREE.BufferAttribute(new Float32Array(SPARK_MAX * 3), 3);
    this.sparkT = new THREE.BufferAttribute(new Float32Array(SPARK_MAX * 2).fill(-100), 2); // birth, life
    for (const a of [this.sparkP, this.sparkV, this.sparkC, this.sparkT]) a.setUsage(THREE.DynamicDrawUsage);
    this.sparkGeo.setAttribute('position', this.sparkP);
    this.sparkGeo.setAttribute('aV', this.sparkV);
    this.sparkGeo.setAttribute('aC', this.sparkC);
    this.sparkGeo.setAttribute('aT', this.sparkT);
    this.sparkGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1000);
    const sparkMat = new THREE.ShaderMaterial({
      uniforms: { uTime: NU.uTime, uPixel: { value: 1 } },
      vertexShader: /* glsl */ `
        attribute vec3 aV; attribute vec3 aC; attribute vec2 aT;
        uniform float uTime; uniform float uPixel;
        varying vec3 vCol; varying float vK;
        void main() {
          float age = uTime - aT.x;
          float k = clamp(age / aT.y, 0.0, 1.0);
          vec3 p = position + aV * age + vec3(0.0, -7.0, 0.0) * age * age * 0.5;
          vK = k;
          vCol = aC;
          vec4 mv = viewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          float alive = step(0.0, age) * step(age, aT.y);
          gl_PointSize = alive * uPixel * clamp(28.0 / -mv.z, 1.5, 14.0) * (1.0 - k * 0.7);
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vCol; varying float vK;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = (1.0 - smoothstep(0.0, 0.5, d));
          vec3 c = mix(vec3(1.0) * 6.0, vCol * 3.0, smoothstep(0.0, 0.35, vK)) * (1.0 - vK);
          gl_FragColor = vec4(c * a, 1.0);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sparks = new THREE.Points(this.sparkGeo, sparkMat);
    sparks.frustumCulled = false;
    sparks.renderOrder = 6;
    this.group.add(sparks);

    // ---------------------------------------------------------------- impact marks (ring + glowing decal)
    const mq = new THREE.InstancedBufferGeometry();
    mq.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]), 3));
    mq.setIndex([0, 1, 2, 0, 2, 3]);
    this.markP = new THREE.InstancedBufferAttribute(new Float32Array(MARK_MAX * 3), 3);
    this.markN = new THREE.InstancedBufferAttribute(new Float32Array(MARK_MAX * 3), 3);
    this.markC = new THREE.InstancedBufferAttribute(new Float32Array(MARK_MAX * 3), 3);
    this.markT = new THREE.InstancedBufferAttribute(new Float32Array(MARK_MAX * 2).fill(-100), 2); // birth, size
    for (const a of [this.markP, this.markN, this.markC, this.markT]) a.setUsage(THREE.DynamicDrawUsage);
    mq.setAttribute('aP', this.markP);
    mq.setAttribute('aN', this.markN);
    mq.setAttribute('aC', this.markC);
    mq.setAttribute('aT', this.markT);
    mq.instanceCount = MARK_MAX;
    this.markGeo = mq;
    const markMat = new THREE.ShaderMaterial({
      uniforms: { uTime: NU.uTime },
      vertexShader: /* glsl */ `
        attribute vec3 aP; attribute vec3 aN; attribute vec3 aC; attribute vec2 aT;
        uniform float uTime;
        varying vec2 vUv; varying vec3 vCol; varying float vAge;
        void main() {
          float age = uTime - aT.x;
          vAge = age;
          vec3 n = normalize(aN);
          vec3 t = normalize(abs(n.y) < 0.9 ? cross(n, vec3(0.0, 1.0, 0.0)) : cross(n, vec3(1.0, 0.0, 0.0)));
          vec3 b = cross(n, t);
          float s = aT.y * 0.75;
          vec3 p = aP + n * 0.012 + (t * position.x + b * position.y) * s;
          vUv = position.xy;
          vCol = aC;
          if (age < 0.0 || age > 6.0) p = vec3(0.0, -999.0, 0.0);
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        varying vec2 vUv; varying vec3 vCol; varying float vAge;
        void main() {
          float r = length(vUv);
          // expanding shock ring
          float rr = 0.15 + vAge * 4.0;
          float ring = exp(-pow((r - rr) * 14.0, 2.0)) * exp(-vAge * 9.0) * 2.5;
          // fluorescent burn that fades slowly
          float spot = exp(-r * r * 30.0) * (exp(-vAge * 0.8) * 1.4 + exp(-vAge * 12.0) * 6.0);
          float flick = 0.85 + 0.15 * sin(vAge * 40.0);
          vec3 c = vCol * (ring + spot * flick) + vec3(1.0) * exp(-r * r * 90.0) * exp(-vAge * 10.0) * 4.0;
          gl_FragColor = vec4(c * (1.0 - smoothstep(0.7, 1.0, r)), 1.0);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    const marks = new THREE.Mesh(mq, markMat);
    marks.frustumCulled = false;
    marks.renderOrder = 4;
    this.group.add(marks);
  }

  beam(ax: number, ay: number, az: number, bx: number, by: number, bz: number, color: THREE.Color, width = 0.11) {
    const i = this.beamNext;
    this.beamNext = (i + 1) % BEAM_MAX;
    this.beamA.setXYZ(i, ax, ay, az);
    this.beamB.setXYZ(i, bx, by, bz);
    this.beamC.setXYZ(i, color.r, color.g, color.b);
    this.beamT.setXY(i, NU.uTime.value, width);
    for (const a of [this.beamA, this.beamB, this.beamC, this.beamT]) { a.addUpdateRange(i * a.itemSize, a.itemSize); a.needsUpdate = true; }
  }

  sparks(x: number, y: number, z: number, nx: number, ny: number, nz: number, color: THREE.Color, count: number, speed = 4.5) {
    const t = NU.uTime.value;
    for (let k = 0; k < count; k++) {
      const i = this.sparkNext;
      this.sparkNext = (i + 1) % SPARK_MAX;
      // random direction in the hemisphere around the normal
      let dx = Math.random() * 2 - 1, dy = Math.random() * 2 - 1, dz = Math.random() * 2 - 1;
      const dot = dx * nx + dy * ny + dz * nz;
      if (dot < 0) { dx -= 2 * dot * nx; dy -= 2 * dot * ny; dz -= 2 * dot * nz; }
      const s = speed * (0.35 + Math.random() * 0.9);
      const l = Math.hypot(dx, dy, dz) || 1;
      this.sparkP.setXYZ(i, x, y, z);
      this.sparkV.setXYZ(i, (dx / l + nx * 0.6) * s, (dy / l + ny * 0.6) * s + 1.2, (dz / l + nz * 0.6) * s);
      this.sparkC.setXYZ(i, color.r, color.g, color.b);
      this.sparkT.setXY(i, t, 0.25 + Math.random() * 0.45);
    }
    this.sparkDirty = true;
  }

  mark(x: number, y: number, z: number, nx: number, ny: number, nz: number, color: THREE.Color, size = 0.35) {
    const i = this.markNext;
    this.markNext = (i + 1) % MARK_MAX;
    this.markP.setXYZ(i, x, y, z);
    this.markN.setXYZ(i, nx, ny, nz);
    this.markC.setXYZ(i, color.r, color.g, color.b);
    this.markT.setXY(i, NU.uTime.value, size);
    for (const a of [this.markP, this.markN, this.markC, this.markT]) { a.addUpdateRange(i * a.itemSize, a.itemSize); a.needsUpdate = true; }
  }

  /** Call once per frame before rendering. */
  flush() {
    if (this.sparkDirty) {
      for (const a of [this.sparkP, this.sparkV, this.sparkC, this.sparkT]) { a.clearUpdateRanges(); a.needsUpdate = true; }
      this.sparkDirty = false;
    }
  }

  setPixelRatio(pr: number) {
    ((this.group.children[1] as THREE.Points).material as THREE.ShaderMaterial).uniforms.uPixel.value = pr;
  }
}
