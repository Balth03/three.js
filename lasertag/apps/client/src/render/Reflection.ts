import * as THREE from 'three';
import { NU } from './neon.ts';

/**
 * Planar reflection of the arena in the floor (y = 0), rendered at reduced resolution into a
 * mipmapped HDR target; the floor shader picks a mip level per tile for glossy blur.
 */
export class FloorReflection {
  readonly rt: THREE.WebGLRenderTarget;
  readonly cam = new THREE.PerspectiveCamera();
  readonly textureMatrix = new THREE.Matrix4();
  scale: number;
  private readonly normal = new THREE.Vector3(0, 1, 0);
  private readonly camPos = new THREE.Vector3();
  private readonly rot = new THREE.Matrix4();
  private readonly look = new THREE.Vector3();
  private readonly view = new THREE.Vector3();
  private readonly target = new THREE.Vector3();
  private readonly savedCam = new THREE.Vector3();

  constructor(scale = 0.5) {
    this.scale = scale;
    this.rt = new THREE.WebGLRenderTarget(16, 16, {
      type: THREE.HalfFloatType,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
    });
    this.cam.layers.set(0);
  }

  setSize(w: number, h: number) {
    this.rt.setSize(Math.max(16, Math.floor(w * this.scale)), Math.max(16, Math.floor(h * this.scale)));
  }

  render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.camPos.setFromMatrixPosition(camera.matrixWorld);
    if (this.camPos.y <= 0.01) return;
    this.rot.extractRotation(camera.matrixWorld);
    this.view.copy(this.camPos).reflect(this.normal).negate(); // mirror position below the floor
    this.view.y = -this.camPos.y;
    this.view.x = this.camPos.x; this.view.z = this.camPos.z;
    this.look.set(0, 0, -1).applyMatrix4(this.rot).add(this.camPos);
    this.target.copy(this.look);
    this.target.y = -this.target.y;
    this.cam.position.copy(this.view);
    this.cam.up.set(0, 1, 0).applyMatrix4(this.rot).reflect(this.normal);
    this.cam.lookAt(this.target);
    this.cam.near = camera.near;
    this.cam.far = camera.far;
    this.cam.updateMatrixWorld();
    this.cam.projectionMatrix.copy(camera.projectionMatrix);

    this.textureMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    this.textureMatrix.multiply(this.cam.projectionMatrix).multiply(this.cam.matrixWorldInverse);

    this.savedCam.copy(NU.uCamPos.value);
    NU.uCamPos.value.copy(this.cam.position);
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(this.rt);
    renderer.clear();
    renderer.render(scene, this.cam);
    renderer.setRenderTarget(prev);
    NU.uCamPos.value.copy(this.savedCam);
  }

  dispose() { this.rt.dispose(); }
}
