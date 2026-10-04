import * as THREE from 'three';
import { EffectComposer, RenderPass, EffectPass, BloomEffect, Effect, SMAAEffect, SMAAPreset, BlendFunction, KernelSize } from 'postprocessing';
import { N8AOPostPass } from 'n8ao';

export type Quality = 'low' | 'medium' | 'high' | 'ultra';

export interface QualitySettings {
  pixelRatio: number;
  shadows: boolean;
  shadowMap: number;
  msaa: number;
  ao: boolean;
  bloom: boolean;
  viewDistance: number; // tile streaming radius (m)
  treeDetailDistance: number;
}

export const QUALITY: Record<Quality, QualitySettings> = {
  low: { pixelRatio: 0.85, shadows: false, shadowMap: 1024, msaa: 0, ao: false, bloom: true, viewDistance: 450, treeDetailDistance: 60 },
  medium: { pixelRatio: 1, shadows: true, shadowMap: 1024, msaa: 0, ao: false, bloom: true, viewDistance: 600, treeDetailDistance: 100 },
  high: { pixelRatio: 1, shadows: true, shadowMap: 2048, msaa: 4, ao: true, bloom: true, viewDistance: 800, treeDetailDistance: 150 },
  ultra: { pixelRatio: 1.25, shadows: true, shadowMap: 4096, msaa: 4, ao: true, bloom: true, viewDistance: 1000, treeDetailDistance: 220 },
};

/** Film look: exposure, AgX tone mapping, per-city colour grading, vignette, grain, subtle chromatic aberration. */
class FilmEffect extends Effect {
  constructor() {
    super('FilmEffect', /* glsl */ `
      uniform float uExposure; uniform vec3 uLift; uniform vec3 uGamma; uniform vec3 uGain; uniform float uSaturation; uniform float uContrast;
      uniform float uVignette; uniform float uGrain; uniform float uCA; uniform float uTime; uniform vec3 uTint; uniform float uFlash;
      // AgX (Troy Sobotka), as in three.js
      vec3 agxDefaultContrastApprox(vec3 x){ vec3 x2 = x * x; vec3 x4 = x2 * x2;
        return + 15.5 * x4 * x2 - 40.14 * x4 * x + 31.96 * x4 - 6.868 * x2 * x + 0.4298 * x2 + 0.1191 * x - 0.00232; }
      vec3 agx(vec3 color){
        const mat3 AgXInsetMatrix = mat3(vec3(0.856627153315983, 0.137318972929847, 0.11189821299995), vec3(0.0951212405381588, 0.761241990602591, 0.0767994186031903), vec3(0.0482516061458583, 0.101439036467562, 0.811302368396859));
        const mat3 AgXOutsetMatrix = mat3(vec3(1.1271005818144368, -0.1413297634984383, -0.14132976349843826), vec3(-0.11060664309660323, 1.157823702216272, -0.11060664309660294), vec3(-0.016493938717834573, -0.016493938717834257, 1.2519364065950405));
        const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(vec3(1.6605, -0.1246, -0.0182), vec3(-0.5876, 1.1329, -0.1006), vec3(-0.0728, -0.0083, 1.1187));
        const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(vec3(0.6274, 0.0691, 0.0164), vec3(0.3293, 0.9195, 0.0880), vec3(0.0433, 0.0113, 0.8956));
        const float AgxMinEv = -12.47393; const float AgxMaxEv = 4.026069;
        color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
        color = AgXInsetMatrix * color;
        color = max(color, 1e-10);
        color = log2(color);
        color = (color - AgxMinEv) / (AgxMaxEv - AgxMinEv);
        color = clamp(color, 0.0, 1.0);
        color = agxDefaultContrastApprox(color);
        color = AgXOutsetMatrix * color;
        color = pow(max(vec3(0.0), color), vec3(2.2));
        color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
        return clamp(color, 0.0, 1.0);
      }
      float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor){
        vec3 c = inputColor.rgb;
        // (chromatic aberration is applied in the HUD-less photo mode pass; kept as a uniform for API stability)
        c *= 1.0 + uCA * 0.0;
        c *= uExposure * uTint * (1.0 + uFlash);
        c = agx(c);
        // grading in display space
        float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
        c = mix(vec3(l), c, uSaturation);
        c = (c - 0.5) * uContrast + 0.5;
        c = pow(max(c * uGain + uLift * (1.0 - c), 0.0), 1.0 / uGamma);
        float v = smoothstep(0.85, 0.25, length((uv - 0.5) * vec2(1.0, 0.75)));
        c *= mix(1.0, v, uVignette);
        c += (hash(uv * 1000.0 + fract(uTime) * 100.0) - 0.5) * uGrain;
        outputColor = vec4(clamp(c, 0.0, 1.0), inputColor.a);
      }
    `, {
      blendFunction: BlendFunction.SET,
      uniforms: new Map<string, THREE.Uniform>([
        ['uExposure', new THREE.Uniform(1)],
        ['uLift', new THREE.Uniform(new THREE.Vector3(0.0, 0.0, 0.0))],
        ['uGamma', new THREE.Uniform(new THREE.Vector3(1, 1, 1))],
        ['uGain', new THREE.Uniform(new THREE.Vector3(1, 1, 1))],
        ['uSaturation', new THREE.Uniform(1.05)],
        ['uContrast', new THREE.Uniform(1.04)],
        ['uVignette', new THREE.Uniform(0.35)],
        ['uGrain', new THREE.Uniform(0.0)],
        ['uCA', new THREE.Uniform(0.0015)],
        ['uTime', new THREE.Uniform(0)],
        ['uTint', new THREE.Uniform(new THREE.Vector3(1, 1, 1))],
        ['uFlash', new THREE.Uniform(0)],
      ]),
    });
  }
  u(name: string): THREE.Uniform { return this.uniforms.get(name)!; }
}

export interface CityGrade { lift: [number, number, number]; gamma: [number, number, number]; gain: [number, number, number]; saturation: number; contrast: number }
export const GRADES: Record<string, CityGrade> = {
  // Paris: warm golds, creamy highlights, slightly lifted teal shadows
  paris: { lift: [0.012, 0.014, 0.022], gamma: [1.0, 0.99, 0.97], gain: [1.04, 1.0, 0.93], saturation: 1.06, contrast: 1.05 },
  newyork: { lift: [0.01, 0.01, 0.01], gamma: [1, 0.98, 0.95], gain: [1.06, 1.0, 0.9], saturation: 1.0, contrast: 1.12 },
  tokyo: { lift: [0.02, 0.0, 0.03], gamma: [0.98, 1, 1.02], gain: [0.98, 1.0, 1.06], saturation: 1.12, contrast: 1.06 },
  london: { lift: [0.015, 0.02, 0.03], gamma: [1, 1, 1.02], gain: [0.96, 0.99, 1.03], saturation: 0.9, contrast: 1.02 },
};

export class Renderer {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  composer!: EffectComposer;
  private film = new FilmEffect();
  private bloom!: BloomEffect;
  private ao: N8AOPostPass | null = null;
  quality: QualitySettings;
  qualityName: Quality;

  constructor(readonly canvas: HTMLCanvasElement, quality: Quality) {
    this.qualityName = quality;
    this.quality = QUALITY[quality];
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false, depth: true, logarithmicDepthBuffer: false });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.shadowMap.enabled = this.quality.shadows;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.info.autoReset = false;
    this.camera = new THREE.PerspectiveCamera(62, 1, 0.1, 6000);
    this.buildComposer();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private buildComposer(): void {
    const q = this.quality;
    this.composer?.dispose();
    this.composer = new EffectComposer(this.renderer, { frameBufferType: THREE.HalfFloatType, multisampling: q.msaa });
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    if (q.ao) {
      this.ao = new N8AOPostPass(this.scene, this.camera, 1, 1);
      this.ao.configuration.aoRadius = 2.5;
      this.ao.configuration.distanceFalloff = 1.0;
      this.ao.configuration.intensity = 2.2;
      this.ao.configuration.halfRes = true;
      this.ao.configuration.depthAwareUpsampling = true;
      this.ao.configuration.gammaCorrection = false;
      // transparent glass (car windows) must not enter the AO depth pass: avoids NaN white-outs with MSAA
      (this.ao as unknown as { autoDetectTransparency: boolean }).autoDetectTransparency = false;
      (this.ao.configuration as unknown as { transparencyAware: boolean }).transparencyAware = false;
      this.composer.addPass(this.ao);
    }
    this.bloom = new BloomEffect({ mipmapBlur: true, luminanceThreshold: 1.1, luminanceSmoothing: 0.3, intensity: 0.9, radius: 0.72, kernelSize: KernelSize.MEDIUM });
    const effects: Effect[] = [];
    if (q.bloom) effects.push(this.bloom);
    effects.push(this.film);
    this.composer.addPass(new EffectPass(this.camera, ...effects));
    // SMAA on every quality level, in its own pass after tone mapping (on top of MSAA it cleans up
    // shading/specular edges and alpha-tested foliage that MSAA cannot see)
    this.composer.addPass(new EffectPass(this.camera, new SMAAEffect({ preset: SMAAPreset.ULTRA })));
  }

  setQuality(name: Quality): void {
    this.qualityName = name;
    this.quality = QUALITY[name];
    this.renderer.shadowMap.enabled = this.quality.shadows;
    this.buildComposer();
    this.resize();
  }

  setGrade(city: string): void {
    const g = GRADES[city] ?? GRADES.paris;
    (this.film.u('uLift').value as THREE.Vector3).set(...g.lift);
    (this.film.u('uGamma').value as THREE.Vector3).set(...g.gamma);
    (this.film.u('uGain').value as THREE.Vector3).set(...g.gain);
    this.film.u('uSaturation').value = g.saturation;
    this.film.u('uContrast').value = g.contrast;
  }

  setFilm(p: { exposure?: number; vignette?: number; grain?: number; ca?: number; flash?: number }): void {
    if (p.exposure !== undefined) this.film.u('uExposure').value = p.exposure;
    if (p.vignette !== undefined) this.film.u('uVignette').value = p.vignette;
    if (p.grain !== undefined) this.film.u('uGrain').value = p.grain;
    if (p.ca !== undefined) this.film.u('uCA').value = p.ca;
    if (p.flash !== undefined) this.film.u('uFlash').value = p.flash;
  }

  resize(): void {
    const w = window.innerWidth, h = window.innerHeight;
    const pr = Math.min(window.devicePixelRatio, 2) * this.quality.pixelRatio;
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  render(dt: number): void {
    this.renderer.info.reset();
    this.film.u('uTime').value += dt;
    this.composer.render(dt);
  }
}
