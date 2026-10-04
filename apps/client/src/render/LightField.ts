import * as THREE from 'three';
import { G } from './materials/common';

/**
 * Top-down "light field": street lamps and vehicle lights splatted into an HDR texture around the camera.
 * World shaders sample it to receive cheap local lighting (hundreds of lights for the cost of one texture fetch).
 * RGB = irradiance from light pools, A = lamp-head intensity (used for wet-road reflection streaks).
 */
export class LightField {
  readonly size: number;
  readonly res: number;
  readonly target: THREE.WebGLRenderTarget;
  private scene = new THREE.Scene();
  private cam: THREE.OrthographicCamera;
  private lamps: THREE.InstancedMesh;
  private heads: THREE.InstancedMesh;
  private cones: THREE.InstancedMesh;
  private lampCount = 0;
  private coneCount = 0;
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private v = new THREE.Vector3();
  private s = new THREE.Vector3();
  private origin = new THREE.Vector2(1e9, 1e9);
  private lampsDirty = true;

  constructor(size = 640, res = 1024) {
    this.size = size;
    this.res = res;
    this.target = new THREE.WebGLRenderTarget(res, res, { type: THREE.HalfFloatType, format: THREE.RGBAFormat, depthBuffer: false, generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    this.cam = new THREE.OrthographicCamera(0, size, size, 0, -10, 10);
    this.cam.position.set(0, 0, 0);
    this.cam.up.set(0, 0, -1);
    // camera looks down -Y? we render in an XY plane instead: map world (x,z) -> (x,y) via instance matrices
    const quad = new THREE.PlaneGeometry(1, 1);
    const poolMat = new THREE.ShaderMaterial({
      transparent: true, depthTest: false, depthWrite: false,
      blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor,
      uniforms: { uColor: { value: new THREE.Color(1.0, 0.72, 0.42) }, uI: { value: 5.0 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }',
      fragmentShader: 'varying vec2 vUv; uniform vec3 uColor; uniform float uI; void main(){ float r = length(vUv - 0.5) * 2.0; float f = pow(max(0.0, 1.0 - r), 2.2) + 0.6 * pow(max(0.0, 1.0 - r * 2.5), 2.0); gl_FragColor = vec4(uColor * f * uI, 0.0); }',
    });
    const headMat = new THREE.ShaderMaterial({
      transparent: true, depthTest: false, depthWrite: false,
      blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }',
      fragmentShader: 'varying vec2 vUv; void main(){ float r = length(vUv - 0.5) * 2.0; float f = exp(-r * r * 5.0); gl_FragColor = vec4(0.0, 0.0, 0.0, f * 2.5); }',
    });
    const coneMat = new THREE.ShaderMaterial({
      transparent: true, depthTest: false, depthWrite: false,
      blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor,
      vertexShader: 'varying vec2 vUv; varying vec3 vC; void main(){ vUv = uv; vC = instanceColor; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }',
      // headlight cone: origin at vUv=(0.5,0), spreading towards vUv.y=1
      fragmentShader: 'varying vec2 vUv; varying vec3 vC; void main(){ float y = vUv.y; float x = (vUv.x - 0.5) * 2.0; float w = 0.25 + y * 0.75; float f = smoothstep(1.0, 0.6, abs(x) / w) * (1.0 - y) * smoothstep(0.0, 0.08, y); gl_FragColor = vec4(vC * f, 0.0); }',
    });
    this.lamps = new THREE.InstancedMesh(quad, poolMat, 4000);
    this.heads = new THREE.InstancedMesh(quad, headMat, 4000);
    this.cones = new THREE.InstancedMesh(quad, coneMat, 600);
    this.cones.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(600 * 3), 3);
    for (const im of [this.lamps, this.heads, this.cones]) { im.frustumCulled = false; im.count = 0; this.scene.add(im); }
    this.cam.position.set(0, 0, 5);
    this.cam.up.set(0, 1, 0);
    this.cam.lookAt(0, 0, 0);
    G.uLightTex.value = this.target.texture;
    G.uLightSize.value = size;
  }

  markLampsDirty(): void { this.lampsDirty = true; }

  /** Rebuild lamp instances (call when tiles change or the field recentres). */
  private rebuildLamps(forEach: (cb: (x: number, y: number, z: number, kind: number) => void) => void): void {
    let n = 0;
    const ox = this.origin.x, oz = this.origin.y;
    forEach((x, _y, z) => {
      if (n >= 4000) return;
      const lx = x - ox, lz = z - oz;
      if (lx < -20 || lz < -20 || lx > this.size + 20 || lz > this.size + 20) return;
      // texture v axis: we map world z -> y (flipped later by uv convention: uv = (xz - origin)/size)
      this.m.makeScale(36, 36, 1).setPosition(lx, lz, 0);
      this.lamps.setMatrixAt(n, this.m);
      this.m.makeScale(1.6, 1.6, 1).setPosition(lx, lz, 0);
      this.heads.setMatrixAt(n, this.m);
      n++;
    });
    this.lampCount = n;
    this.lamps.count = this.heads.count = n;
    this.lamps.instanceMatrix.needsUpdate = true;
    this.heads.instanceMatrix.needsUpdate = true;
  }

  /** Vehicle headlight cones: call beginCones(), addCone() per car, then render. */
  beginCones(): void { this.coneCount = 0; }
  addCone(x: number, z: number, dirX: number, dirZ: number, length: number, width: number, r: number, g: number, b: number): void {
    if (this.coneCount >= 600) return;
    const lx = x - this.origin.x, lz = z - this.origin.y;
    if (lx < -40 || lz < -40 || lx > this.size + 40 || lz > this.size + 40) return;
    // quad: local y along direction, x across; origin at bottom centre
    const ang = Math.atan2(dirZ, dirX) - Math.PI / 2;
    this.q.setFromAxisAngle(this.v.set(0, 0, 1), ang);
    this.s.set(width, length, 1);
    const cx = lx + dirX * length * 0.5, cz = lz + dirZ * length * 0.5;
    this.m.compose(this.v.set(cx, cz, 0), this.q, this.s);
    this.cones.setMatrixAt(this.coneCount, this.m);
    this.cones.instanceColor!.setXYZ(this.coneCount, r, g, b);
    this.coneCount++;
  }

  update(renderer: THREE.WebGLRenderer, focus: THREE.Vector3, forEachLamp: (cb: (x: number, y: number, z: number, kind: number) => void) => void, enabled: boolean): void {
    if (!enabled) {
      G.uLightGain.value = 0;
      return;
    }
    const texel = this.size / this.res;
    const ox = Math.round((focus.x - this.size / 2) / texel) * texel;
    const oz = Math.round((focus.z - this.size / 2) / texel) * texel;
    if (Math.abs(ox - this.origin.x) > 40 || Math.abs(oz - this.origin.y) > 40 || this.lampsDirty) {
      this.origin.set(ox, oz);
      this.rebuildLamps(forEachLamp);
      this.lampsDirty = false;
    }
    G.uLightOrigin.value.copy(this.origin);
    this.cones.count = this.coneCount;
    this.cones.instanceMatrix.needsUpdate = true;
    if (this.cones.instanceColor) this.cones.instanceColor.needsUpdate = true;
    this.cam.left = 0; this.cam.right = this.size; this.cam.bottom = 0; this.cam.top = this.size;
    this.cam.updateProjectionMatrix();
    const prev = renderer.getRenderTarget();
    const prevClear = renderer.getClearColor(new THREE.Color());
    const prevAlpha = renderer.getClearAlpha();
    renderer.setRenderTarget(this.target);
    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, false, false);
    renderer.render(this.scene, this.cam);
    renderer.setRenderTarget(prev);
    renderer.setClearColor(prevClear, prevAlpha);
    void this.lampCount;
  }
}
