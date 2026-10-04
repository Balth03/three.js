/**
 * Car model test bed.  cd apps/client && npx vite  →  http://localhost:5173/dev/car-preview.html
 * URL params:
 *   car=hero|lineup|compact|sedan|wagon|suv|van|bus|taxi   (default hero)
 *   view=front34|side|rear|front|top|chase|cockpit|wheel|lineup   camera preset
 *   night=1        night lighting, headlights + taxi sign on, real SpotLights on the headlight anchors
 *   brake=1 reverse=1 ind=L|R high=1 taxi=free|busy|off
 *   env=studio     use the procedural sky/strip-light environment instead of RoomEnvironment
 *   shot=1         hide HUD/UI and stop the render loop after a few frames (screenshots)
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { createCarModel, createTrafficCarAssets, VIREO_LUMEN_SPEC, type CarModel } from '../src/vehicles/carModel';

const params = new URLSearchParams(location.search);
const carParam = params.get('car') ?? 'hero';
const night = params.get('night') === '1';
const view = params.get('view') ?? (carParam === 'lineup' ? 'lineup' : 'front34');
if (params.get('shot') === '1') document.body.classList.add('shot');

// ------------------------------------------------------------------------------------------- renderer / scene
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.AgXToneMapping;
renderer.toneMappingExposure = night ? 1.1 : 1.0;
renderer.shadowMap.enabled = params.get('shadows') !== '0';
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(night ? '#070a12' : '#b9c4cf');
const pmrem = new THREE.PMREMGenerator(renderer);
function studioEnv(): THREE.Scene {
  // soft outdoor/studio environment: bright sky dome, grey horizon band, dark ground, three overhead strip lights
  const s = new THREE.Scene();
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `varying vec3 vP; void main(){
      float y = vP.y;
      vec3 sky = mix(vec3(0.55, 0.6, 0.68), vec3(1.05, 1.1, 1.18), smoothstep(0.0, 0.55, y));
      vec3 gnd = mix(vec3(0.07, 0.07, 0.068), vec3(0.2, 0.2, 0.19), smoothstep(-0.25, 0.0, y));
      vec3 c = y > 0.0 ? sky : gnd;
      c = mix(c, vec3(0.32, 0.33, 0.34), exp(-abs(y) * 40.0) * 0.7);
      gl_FragColor = vec4(c, 1.0);
    }`,
  });
  s.add(new THREE.Mesh(new THREE.SphereGeometry(50, 64, 32), mat));
  const lm = new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 5, 5), side: THREE.DoubleSide });
  for (const k of [-1, 0, 1]) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(4, 40), lm);
    p.position.set(k * 10, 22, 0);
    p.rotation.x = Math.PI / 2;
    s.add(p);
  }
  return s;
}
scene.environment = pmrem.fromScene(params.get('env') === 'studio' ? studioEnv() : new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = night ? 0.05 : 0.9;

const sun = new THREE.DirectionalLight(night ? 0x8aa0ff : 0xfff1e0, night ? 0.25 : 2.6);
sun.position.set(-6, 10, -4);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -9; sun.shadow.camera.right = 9; sun.shadow.camera.top = 9; sun.shadow.camera.bottom = -9;
sun.shadow.camera.near = 1; sun.shadow.camera.far = 40;
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.02;
scene.add(sun);
scene.add(new THREE.HemisphereLight(night ? 0x1a2238 : 0xdfe8f2, night ? 0x050505 : 0x5a554e, night ? 0.15 : 0.5));

const ground = new THREE.Mesh(new THREE.CircleGeometry(80, 64), new THREE.MeshStandardMaterial({ color: night ? 0x2a2a2c : 0x77787a, roughness: 0.92 }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.05, 400);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), night ? 0.7 : 0.15, 0.35, night ? 1.0 : 1.6);
if (params.get('bloom') !== '0') composer.addPass(bloom);
composer.addPass(new OutputPass());

// ------------------------------------------------------------------------------------------- content
const hud = document.getElementById('hud')!;
let hero: CarModel | null = null;
const info: string[] = [];

function lightState(): Parameters<CarModel['setLights']>[0] {
  return {
    headlights: night || params.get('lights') === '1',
    highBeam: params.get('high') === '1',
    brake: params.get('brake') === '1' ? 1 : 0,
    reverse: params.get('reverse') === '1',
    indicatorLeft: params.get('ind') === 'L',
    indicatorRight: params.get('ind') === 'R',
    taxi: (params.get('taxi') as 'free' | 'busy' | 'off' | null) ?? 'free',
  };
}

if (carParam === 'hero') {
  const t0 = performance.now();
  const hs = params.get('style');
  const alt: Record<string, Partial<typeof VIREO_LUMEN_SPEC>> = {
    suv: { style: 'suv', length: 4.62, width: 1.88, height: 1.68, wheelbase: 2.74, wheelRadius: 0.36, paint: 0x6e1e22, taxiSign: false },
    hatch: { style: 'hatch', length: 4.25, width: 1.8, height: 1.46, wheelbase: 2.62, wheelRadius: 0.31, paint: 0x2f6fb0, taxiSign: false },
    wagon: { style: 'wagon', length: 4.85, width: 1.85, height: 1.5, wheelbase: 2.86, paint: 0x8a8f96, taxiSign: false },
    van: { style: 'van', length: 4.4, width: 1.86, height: 1.82, wheelbase: 2.75, wheelRadius: 0.32, paint: 0xf4f4f2, taxiSign: false },
    truck: { style: 'truck', length: 6.8, width: 2.2, height: 2.9, wheelbase: 3.9, track: 1.8, wheelRadius: 0.42, wheelWidth: 0.26, paint: 0xd8d8d4, taxiSign: false },
    bus: { style: 'bus', length: 12, width: 2.55, height: 3.05, wheelbase: 5.9, track: 2.1, wheelRadius: 0.5, wheelWidth: 0.3, paint: 0x1f8a68, taxiSign: false },
  };
  hero = createCarModel(hs && alt[hs] ? { ...VIREO_LUMEN_SPEC, ...alt[hs], seed: 3 } : VIREO_LUMEN_SPEC);
  info.push(`hero build ${(performance.now() - t0).toFixed(0)} ms`);
  const st = hero.root.userData.stats as { triangles: number; bodyTriangles: number; wheelTriangles: number; steeringTriangles: number };
  info.push(`tris total ${st.triangles}  body ${st.bodyTriangles}  wheel ${st.wheelTriangles}x4  steering ${st.steeringTriangles}`);
  scene.add(hero.root);
  if (params.get('nobody') === '1') hero.body.visible = false;
  const hide = (params.get('hide') ?? '').split(',').filter(Boolean);
  hero.body.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    if (hide.includes(m.name)) m.visible = false;
    if (Array.isArray(m.material)) m.material.forEach((mm, i) => { if (hide.includes(String(i))) mm.visible = false; });
  });
  hero.setLights(lightState());
  hero.setDashboard?.({ speedKmh: 47, rpm: 2300, gear: 'D', fare: '14,60 €', clock: '21:47' });
  hero.wheels[0].rotation.y = params.get('steer') ? parseFloat(params.get('steer')!) : 0;
  hero.wheels[1].rotation.y = hero.wheels[0].rotation.y;
  if (hero.steeringWheel) hero.steeringWheel.rotation.z = -hero.wheels[0].rotation.y * 4;
  if (night) {
    for (const a of hero.headlightAnchors) {
      const s = new THREE.SpotLight(0xfff2e0, 60, 45, 0.42, 0.5, 1.6);
      s.position.set(0, 0, 0);
      s.target.position.set(0, -0.6, -10);
      a.add(s, s.target);
    }
  }
} else {
  const assets = createTrafficCarAssets();
  const list = carParam === 'lineup' ? assets : assets.filter((a) => a.name === carParam);
  let x = 0;
  const tmp = new THREE.Object3D();
  for (const a of list) {
    const im = new THREE.InstancedMesh(a.geometry, a.material, 1);
    const isBus = a.name === 'bus';
    if (carParam === 'lineup') {
      if (isBus) { tmp.position.set(6, 0, 9.5); tmp.rotation.y = Math.PI / 2; }
      else { tmp.position.set(x + a.width / 2, 0, 0); x += a.width + 0.9; }
    } else tmp.position.set(0, 0, 0);
    if (!(carParam === 'lineup' && isBus)) tmp.rotation.y = 0;
    tmp.updateMatrix();
    im.setMatrixAt(0, tmp.matrix);
    im.setColorAt(0, new THREE.Color(a.palette[a.name === 'compact' ? 0 : a.name === 'sedan' ? 4 : a.name === 'wagon' ? 2 : a.name === 'suv' ? 1 : 0]));
    im.castShadow = true;
    im.receiveShadow = true;
    scene.add(im);
    const tris = (a.geometry.index ? a.geometry.index.count : a.geometry.getAttribute('position').count) / 3;
    info.push(`${a.name.padEnd(8)} ${tris} tris  ${a.length.toFixed(2)} x ${a.width.toFixed(2)} x ${a.height.toFixed(2)}`);
    const mat = a.material as THREE.MeshStandardMaterial;
    (mat.userData.uniforms as { uNight: { value: number } }).uNight.value = night ? 1 : 0;
  }
  if (carParam === 'lineup') {
    const h = createCarModel({ ...VIREO_LUMEN_SPEC, interior: false });
    h.root.position.set(x + 0.95, 0, 0);
    h.setLights(lightState());
    scene.add(h.root);
  }
}

// ------------------------------------------------------------------------------------------- camera presets
function setView(v: string): void {
  camera.fov = 38;
  controls.target.set(0, 0.65, 0);
  switch (v) {
    case 'side': camera.position.set(8.5, 1.0, 0); controls.target.set(0, 0.68, 0); camera.fov = 34; break;
    case 'rear': camera.position.set(3.9, 1.8, 6.0); break;
    case 'front': camera.position.set(0, 1.0, -8); camera.fov = 30; break;
    case 'busfront': camera.position.set(-5, 2.6, -15); controls.target.set(0, 1.6, -5); camera.fov = 40; break;
    case 'cabin': camera.position.set(-2.6, 2.6, 1.6); controls.target.set(0, 0.7, 0.2); camera.fov = 45; break;
    case 'rearseat': {
      if (hero) { camera.position.set(0.35, 1.12, 1.35); controls.target.set(-0.2, 0.85, -1); camera.fov = 75; }
      break;
    }
    case 'grille': camera.position.set(-0.5, 0.75, -4.0); controls.target.set(0, 0.5, -2.4); camera.fov = 30; break;
    case 'nose': camera.position.set(-1.6, 1.0, -4.6); controls.target.set(0, 0.55, -2.3); camera.fov = 35; break;
    case 'tail': camera.position.set(1.4, 1.1, 4.8); controls.target.set(0, 0.7, 2.4); camera.fov = 35; break;
    case 'top': camera.position.set(0.01, 11, 0); camera.fov = 32; break;
    case 'chase': camera.position.set(0, 2.1, 6.5); controls.target.set(0, 0.9, -2); camera.fov = 60; break;
    case 'wheelR': camera.position.set(1.9, 0.55, -2.0); controls.target.set(0.8, 0.34, -1.47); camera.fov = 40; break;
    case 'wheel': camera.position.set(-1.9, 0.55, -2.0); controls.target.set(-0.8, 0.34, -1.47); camera.fov = 40; break;
    case 'lineup': camera.position.set(9.6, 4.6, -14.0); controls.target.set(10.4, 0.9, 2.6); camera.fov = 50; break;
    case 'cockpit': {
      if (hero) {
        hero.root.updateMatrixWorld(true);
        const p = hero.cameraAnchors.cockpit.getWorldPosition(new THREE.Vector3());
        camera.position.copy(p);
        controls.target.copy(p).add(new THREE.Vector3(0.0, -0.22, -1));
        camera.fov = 72;
      }
      break;
    }
    default: camera.position.set(-4.6, 1.7, -5.4); break;
  }
  if (carParam !== 'hero' && carParam !== 'lineup' && v !== 'lineup' && v !== 'busfront') {
    const s = carParam === 'bus' ? 2.4 : 1;
    camera.position.multiplyScalar(s);
    controls.target.y *= s;
  }
  camera.updateProjectionMatrix();
  controls.update();
}
setView(view);

const ui = document.getElementById('ui')!;
const link = (label: string, q: Record<string, string>): void => {
  const b = document.createElement('button');
  b.textContent = label;
  b.onclick = () => {
    const p = new URLSearchParams(location.search);
    for (const [k, v] of Object.entries(q)) { if (v === '') p.delete(k); else p.set(k, v); }
    location.search = p.toString();
  };
  ui.appendChild(b);
};
for (const c of ['hero', 'lineup', 'compact', 'sedan', 'wagon', 'suv', 'van', 'bus', 'taxi']) link(c, { car: c, view: '' });
link(night ? 'day' : 'night', { night: night ? '' : '1' });
for (const v of ['front34', 'side', 'rear', 'front', 'top', 'chase', 'cockpit', 'wheel']) {
  const b = document.createElement('button');
  b.textContent = v;
  b.onclick = () => setView(v);
  ui.appendChild(b);
}
link('brake', { brake: params.get('brake') === '1' ? '' : '1' });
link('busy', { taxi: params.get('taxi') === 'busy' ? '' : 'busy' });

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
});

let frames = 0;
let blink = 0;
const shotMode = params.get('shot') === '1';
function loop(): void {
  if (!shotMode || frames < 4) requestAnimationFrame(loop);
  controls.update();
  if (hero && params.get('anim') === '1') {
    blink += 1 / 60;
    hero.setLights({ ...lightState(), indicatorLeft: Math.floor(blink * 2) % 2 === 0 });
    for (const w of hero.wheels) (w.getObjectByName('spin') as THREE.Object3D).rotation.x -= 0.1;
  }
  renderer.info.autoReset = false;
  renderer.info.reset();
  renderer.render(scene, camera); // count draw calls of the plain scene pass
  const calls = renderer.info.render.calls, tris = renderer.info.render.triangles;
  composer.render();
  frames++;
  if (frames === 3) (window as unknown as { __ready: boolean }).__ready = true;
  hud.textContent = `${info.join('\n')}\nscene pass: ${calls} draw calls (incl. ground), ${tris} tris`;
}
loop();
