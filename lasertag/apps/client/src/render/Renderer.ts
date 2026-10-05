import * as THREE from 'three';
import {
  BlendFunction, BloomEffect, ChromaticAberrationEffect, EffectComposer, EffectPass, NoiseEffect,
  RenderPass, SMAAEffect, SMAAPreset, ToneMappingEffect, ToneMappingMode, VignetteEffect,
} from 'postprocessing';
import { FloorReflection } from './Reflection.ts';
import { NU } from './neon.ts';

export type Quality = 'low' | 'medium' | 'high' | 'ultra';
export interface QualityPreset { pixelRatio: number; reflection: number; dust: number; smaa: boolean; bloomLevels: number; scatter: number }
export const QUALITY: Record<Quality, QualityPreset> = {
  low: { pixelRatio: 0.75, reflection: 0, dust: 350, smaa: false, bloomLevels: 5, scatter: 0.8 },
  medium: { pixelRatio: 1, reflection: 0, dust: 900, smaa: true, bloomLevels: 6, scatter: 1 },
  high: { pixelRatio: 1.25, reflection: 0.5, dust: 1600, smaa: true, bloomLevels: 7, scatter: 1 },
  ultra: { pixelRatio: 2, reflection: 0.75, dust: 2600, smaa: true, bloomLevels: 8, scatter: 1 },
};

/** WebGL2 renderer + HDR post chain + floor reflection, with quality presets. */
export class RenderPipeline {
  readonly renderer: THREE.WebGLRenderer;
  readonly composer: EffectComposer;
  quality: Quality = 'high';
  preset: QualityPreset = QUALITY.high;
  reflection: FloorReflection | null = null;
  aberration = 0;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private floorMat: THREE.ShaderMaterial | null = null;
  private renderPass: RenderPass;
  private vmPass: RenderPass;
  private bloom: BloomEffect;
  private ca: ChromaticAberrationEffect;
  private vignette: VignetteEffect;
  private noise: NoiseEffect;
  private tone: ToneMappingEffect;
  private smaaPass: EffectPass | null = null;
  private mainPass: EffectPass;
  private caPass: EffectPass;
  private width = 1;
  private height = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false, depth: true });
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x07040f, 1);
    this.renderer.info.autoReset = false;
    this.composer = new EffectComposer(this.renderer, { frameBufferType: THREE.HalfFloatType, multisampling: 0 });
    const dummyScene = new THREE.Scene(), dummyCam = new THREE.PerspectiveCamera();
    this.renderPass = new RenderPass(dummyScene, dummyCam);
    this.vmPass = new RenderPass(dummyScene, dummyCam);
    this.vmPass.clearPass.enabled = true;
    this.vmPass.clearPass.color = false;
    this.vmPass.clearPass.depth = true;
    this.vmPass.ignoreBackground = true;

    this.bloom = new BloomEffect({ mipmapBlur: true, intensity: 1.35, luminanceThreshold: 0.72, luminanceSmoothing: 0.35, radius: 0.78, levels: 7 });
    this.tone = new ToneMappingEffect({ mode: ToneMappingMode.AGX });
    this.vignette = new VignetteEffect({ offset: 0.28, darkness: 0.62 });
    this.noise = new NoiseEffect({ blendFunction: BlendFunction.OVERLAY, premultiply: false });
    this.noise.blendMode.opacity.value = 0.07;
    this.ca = new ChromaticAberrationEffect({ offset: new THREE.Vector2(0, 0), radialModulation: true, modulationOffset: 0.15 });
    this.mainPass = new EffectPass(dummyCam, this.bloom, this.tone, this.vignette, this.noise);
    this.caPass = new EffectPass(dummyCam, this.ca);
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.vmPass);
    // CA runs before the main pass so the last pass (main or SMAA) always renders to screen
    this.composer.addPass(this.caPass);
    this.composer.addPass(this.mainPass);
  }

  setScene(scene: THREE.Scene, camera: THREE.PerspectiveCamera, vmScene: THREE.Scene | null, vmCamera: THREE.Camera | null, floorMat: THREE.ShaderMaterial | null) {
    this.scene = scene;
    this.camera = camera;
    this.floorMat = floorMat;
    this.renderPass.mainScene = scene;
    this.renderPass.mainCamera = camera;
    this.vmPass.enabled = !!vmScene;
    if (vmScene && vmCamera) { this.vmPass.mainScene = vmScene; this.vmPass.mainCamera = vmCamera; }
    this.mainPass.mainCamera = camera;
    this.caPass.mainCamera = camera;
    if (this.smaaPass) this.smaaPass.mainCamera = camera;
    camera.layers.enable(1);
  }

  setQuality(q: Quality) {
    this.quality = q;
    this.preset = QUALITY[q];
    const p = this.preset;
    if (p.reflection > 0) {
      if (!this.reflection) this.reflection = new FloorReflection(p.reflection);
      this.reflection.scale = p.reflection;
    } else if (this.reflection) {
      this.reflection.dispose();
      this.reflection = null;
    }
    if (p.smaa && !this.smaaPass) {
      this.smaaPass = new EffectPass(this.camera ?? new THREE.PerspectiveCamera(), new SMAAEffect({ preset: SMAAPreset.HIGH }));
      this.composer.addPass(this.smaaPass);
    } else if (!p.smaa && this.smaaPass) {
      this.composer.removePass(this.smaaPass);
      this.smaaPass.dispose();
      this.smaaPass = null;
    }
    NU.uScatter.value = p.scatter;
    this.resize(this.width, this.height);
  }

  resize(w: number, h: number) {
    this.width = w; this.height = h;
    const pr = Math.min(window.devicePixelRatio || 1, this.preset.pixelRatio);
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h, false);
    if (this.reflection) this.reflection.setSize(w * pr, h * pr);
    if (this.camera) { this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); }
  }

  get pixelRatio() { return this.renderer.getPixelRatio(); }

  /** Capture a static cube map of the arena (mirrors, sheen). */
  captureEnv(scene: THREE.Scene, at: THREE.Vector3, size = 256): THREE.CubeTexture {
    const rt = new THREE.WebGLCubeRenderTarget(size, { type: THREE.HalfFloatType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
    const cc = new THREE.CubeCamera(0.1, 120, rt);
    cc.layers.enableAll();
    cc.position.copy(at);
    const saved = NU.uCamPos.value.clone();
    NU.uCamPos.value.copy(at);
    cc.update(this.renderer, scene);
    NU.uCamPos.value.copy(saved);
    return rt.texture;
  }

  render(dt: number) {
    if (!this.scene || !this.camera) return;
    this.renderer.info.reset();
    this.aberration = Math.max(0, this.aberration - dt * 3.5);
    const ca = this.aberration * 0.006;
    this.ca.offset.set(ca, ca * 0.6);
    this.caPass.enabled = this.aberration > 0.01;
    NU.uCamPos.value.copy(this.camera.position);
    if (this.reflection && this.floorMat) {
      this.floorMat.visible = false;
      this.reflection.render(this.renderer, this.scene, this.camera);
      this.floorMat.visible = true;
      const u = this.floorMat.uniforms;
      u.uRefl.value = this.reflection.rt.texture;
      u.uReflOn.value = 1;
      (u.uReflMatrix.value as THREE.Matrix4).copy(this.reflection.textureMatrix);
    } else if (this.floorMat) {
      this.floorMat.uniforms.uReflOn.value = 0;
    }
    this.composer.render(dt);
  }
}
