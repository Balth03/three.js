/*
 * Standalone preview for the procedural Paris landmarks.
 *   http://localhost:5173/dev/landmarks-preview.html?m=eiffelTower&night=1&cam=far|near|street|under|aerial
 * Extra params: t=<hour> (time of day), e=<seconds> (freeze elapsed time), az=<deg> camera azimuth,
 *               q=low|high, hud=0, bloom=0, rot=<deg> landmark rotation.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { createLandmark, countTriangles } from '../src/world/landmarks/index';
import type { LandmarkModelId } from '../src/world/landmarks/index';

declare global {
  interface Window {
    __ready?: boolean;
    __frames?: number;
    __stats?: Record<string, unknown>;
  }
}

const params = new URLSearchParams(location.search);
const modelId = (params.get('m') ?? 'eiffelTower') as LandmarkModelId;
const night = THREE.MathUtils.clamp(parseFloat(params.get('night') ?? '0') || 0, 0, 1);
const camMode = params.get('cam') ?? 'near';
const timeOfDay = parseFloat(params.get('t') ?? (night > 0.5 ? '21.02' : '14'));
const frozenElapsed = params.has('e') ? parseFloat(params.get('e') ?? '0') : null;
const azimuth = THREE.MathUtils.degToRad(parseFloat(params.get('az') ?? '35'));
const quality = params.get('q') === 'low' ? 'low' : 'high';
const useBloom = params.get('bloom') !== '0';
const stillFrames = params.has('still') ? Math.max(1, parseInt(params.get('still') ?? '4', 10) || 4) : 0; // stop rendering after N frames (screenshots)
const hud = document.getElementById('hud') as HTMLDivElement;
if (params.get('hud') === '0') hud.classList.add('hidden');

// ---------------------------------------------------------------- renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.AgXToneMapping;
renderer.toneMappingExposure = night > 0.5 ? 1.15 : 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = envTex;
scene.environmentIntensity = THREE.MathUtils.lerp(0.42, 0.03, night);

// ---------------------------------------------------------------- sky dome (simple analytic gradient)
const dayHorizon = new THREE.Color(0.78, 0.84, 0.92);
const dayZenith = new THREE.Color(0.22, 0.42, 0.78);
const nightHorizon = new THREE.Color(0.055, 0.05, 0.06);
const nightZenith = new THREE.Color(0.004, 0.007, 0.018);
const horizon = dayHorizon.clone().lerp(nightHorizon, night);
const zenith = dayZenith.clone().lerp(nightZenith, night);
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  depthWrite: false,
  uniforms: {
    uH: { value: horizon },
    uZ: { value: zenith },
    uSun: { value: new THREE.Vector3(-0.55, 0.62, 0.55).normalize() },
    uNight: { value: night },
  },
  vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }`,
  fragmentShader: `
    uniform vec3 uH; uniform vec3 uZ; uniform vec3 uSun; uniform float uNight; varying vec3 vDir;
    float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
    void main(){
      float y = max(vDir.y, 0.0);
      vec3 c = mix(uH, uZ, pow(y, 0.55));
      float s = max(dot(normalize(vDir), uSun), 0.0);
      c += vec3(1.0, 0.85, 0.6) * (pow(s, 600.0) * 30.0 + pow(s, 8.0) * 0.25) * (1.0 - uNight);
      // city glow at the horizon at night + stars
      c += vec3(0.09, 0.05, 0.025) * exp(-y * 9.0) * uNight;
      vec3 q = floor(normalize(vDir) * 420.0);
      c += vec3(step(0.9989, h(q))) * 0.35 * uNight * smoothstep(0.1, 0.4, y);
      if (vDir.y < 0.0) c = uH * 0.8;
      gl_FragColor = vec4(c, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
});
const sky = new THREE.Mesh(new THREE.SphereGeometry(30000, 32, 16), skyMat);
sky.frustumCulled = false;
scene.add(sky);
scene.fog = new THREE.FogExp2(horizon.getHex(), night > 0.5 ? 0.00009 : 0.00012);

// ---------------------------------------------------------------- lights
const sunDir = new THREE.Vector3(-0.55, 0.62, 0.55).normalize();
const sun = new THREE.DirectionalLight(night > 0.5 ? 0x8fa6d9 : 0xfff1dc, THREE.MathUtils.lerp(4.2, 0.06, night));
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.05;
scene.add(sun, sun.target);
const hemi = new THREE.HemisphereLight(0xbcd3ff, 0x5d5446, THREE.MathUtils.lerp(0.45, 0.03, night));
scene.add(hemi);

// ---------------------------------------------------------------- ground
const groundMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.24, 0.235, 0.22), roughness: 0.95 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(40000, 40000), groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
const plaza = new THREE.Mesh(new THREE.CircleGeometry(1, 64), new THREE.MeshStandardMaterial({ color: new THREE.Color(0.42, 0.4, 0.37), roughness: 0.9 }));
plaza.rotation.x = -Math.PI / 2;
plaza.position.y = 0.02;
plaza.receiveShadow = true;
scene.add(plaza);

// ---------------------------------------------------------------- landmark
const t0 = performance.now();
const lm = createLandmark(modelId, { quality });
const buildMs = performance.now() - t0;
lm.object.rotation.y = THREE.MathUtils.degToRad(parseFloat(params.get('rot') ?? '0'));
scene.add(lm.object);
const box = new THREE.Box3();
lm.object.updateMatrixWorld(true);
lm.object.traverse((o) => {
  const mesh = o as THREE.Mesh;
  if (!mesh.isMesh || !o.visible || o.name.includes('beacon') || o.name.includes('flame')) return;
  mesh.geometry.computeBoundingBox();
  box.union(mesh.geometry.boundingBox!.clone().applyMatrix4(o.matrixWorld));
});
const size = box.getSize(new THREE.Vector3());
const height = size.y;
const radius = Math.max(size.x, size.z) / 2;
plaza.scale.setScalar(radius * 1.8 + 20);
const stats = countTriangles(lm.object);
window.__stats = { model: modelId, buildMs: Math.round(buildMs), ...stats, height: +height.toFixed(1), sizeX: +size.x.toFixed(1), sizeZ: +size.z.toFixed(1), colliders: lm.colliders.length };
console.log('landmark stats', JSON.stringify(window.__stats));

// shadow frustum fitted to the model
const shadowR = Math.max(radius, height * 0.6) * 1.25;
sun.shadow.camera.left = -shadowR;
sun.shadow.camera.right = shadowR;
sun.shadow.camera.top = shadowR;
sun.shadow.camera.bottom = -shadowR;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = shadowR * 6;
sun.position.copy(sunDir).multiplyScalar(shadowR * 3);
sun.target.position.set(0, height * 0.3, 0);
sun.shadow.camera.updateProjectionMatrix();

// ---------------------------------------------------------------- camera presets
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.5, 40000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
const dirH = new THREE.Vector3(Math.sin(azimuth), 0, Math.cos(azimuth));
let target = new THREE.Vector3(0, height * 0.42, 0);
switch (camMode) {
  case 'far': {
    camera.fov = parseFloat(params.get('fov') ?? '45');
    camera.position.copy(dirH).multiplyScalar(1500).setY(25);
    target = new THREE.Vector3(0, height * 0.45, 0);
    break;
  }
  case 'street': {
    camera.fov = 70;
    const d = radius + 40;
    camera.position.copy(dirH).multiplyScalar(d).setY(1.7);
    target = new THREE.Vector3(0, Math.min(height * 0.5, d * 0.75), 0);
    break;
  }
  case 'under': {
    camera.fov = 80;
    camera.position.set(8, 1.7, 30);
    target = new THREE.Vector3(0, 80, 0);
    break;
  }
  case 'aerial': {
    camera.fov = 45;
    camera.position.copy(dirH).multiplyScalar(Math.max(radius * 3.2, height * 1.4)).setY(height * 0.9);
    break;
  }
  case 'mid': {
    camera.fov = 50;
    camera.position.copy(dirH).multiplyScalar(Math.max(150, height * 1.1)).setY(8);
    target = new THREE.Vector3(0, height * 0.45, 0);
    break;
  }
  default: {
    // near = 300 m
    camera.fov = 50;
    camera.position.copy(dirH).multiplyScalar(300).setY(1.7 + 10);
    target = new THREE.Vector3(0, height * 0.45, 0);
  }
}
if (params.has('cx')) camera.position.set(parseFloat(params.get('cx')!), parseFloat(params.get('cy') ?? '2'), parseFloat(params.get('cz') ?? '0'));
if (params.has('ty')) target.set(parseFloat(params.get('tx') ?? '0'), parseFloat(params.get('ty')!), parseFloat(params.get('tz') ?? '0'));
camera.updateProjectionMatrix();
controls.target.copy(target);
controls.update();

// ---------------------------------------------------------------- post
const rt = new THREE.WebGLRenderTarget(window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio(), { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, rt);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), night > 0.5 ? 0.55 : 0.18, 0.55, night > 0.5 ? 1.0 : 2.5);
if (useBloom) composer.addPass(bloom);
composer.addPass(new OutputPass());

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// ---------------------------------------------------------------- loop
const timer = new THREE.Timer();
let frames = 0;
hud.textContent = `${modelId}  cam=${camMode}  night=${night}  t=${timeOfDay}h\n${stats.triangles} tris, ${stats.drawCalls} draw calls, built in ${Math.round(buildMs)} ms`;
function frame(): void {
  timer.update();
  const elapsed = frozenElapsed ?? timer.getElapsed();
  lm.update(timeOfDay, night, elapsed);
  controls.update();
  composer.render();
  frames++;
  window.__frames = frames;
  if (frames >= 3) window.__ready = true;
  if (stillFrames && frames >= stillFrames) return;
  requestAnimationFrame(frame);
}
frame();
