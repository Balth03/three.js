/**
 * Pedestrian rendering test bed.  cd apps/client && npx vite  →  http://localhost:5173/dev/peds-preview.html
 * URL params:
 *   view=crowd|lineup|rain|closeup|variety|side   camera preset / scene variant
 *   t=<seconds>      start time (deterministic screenshots)
 *   freeze=1         do not advance time (render the state at t)
 *   far=1            use the far LOD for the crowd
 *   n=<count>        crowd size (default 200)
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PedAnim, PedestrianMesh, PedStyle, createPassengerModel, pedTriangleCount, randomAppearance, type PedAppearance } from '../src/peds/pedMesh';

const params = new URLSearchParams(location.search);
const view = params.get('view') ?? 'crowd';
const t0 = parseFloat(params.get('t') ?? '0');
const freeze = params.get('freeze') === '1';
const useFar = params.get('far') === '1';
const crowdN = parseInt(params.get('n') ?? '200', 10);
const rain = view === 'rain';

function mulberry32(a: number): () => number {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ------------------------------------------------------------------------------------------------ renderer / scene
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.AgXToneMapping;
renderer.toneMappingExposure = rain ? 0.9 : 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const skyCol = rain ? new THREE.Color('#7d838b') : new THREE.Color('#b9c7d6');
scene.background = skyCol;
scene.fog = new THREE.Fog(skyCol, rain ? 25 : 45, rain ? 110 : 160);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = rain ? 0.55 : 0.4;

const hemi = new THREE.HemisphereLight(rain ? 0xa9b0b8 : 0xcfe0f5, rain ? 0x3a3a3a : 0x6b5a48, rain ? 1.1 : 0.9);
scene.add(hemi);
const sun = new THREE.DirectionalLight(rain ? 0xd8dde3 : 0xfff1dc, rain ? 0.9 : 3.0);
sun.position.set(-14, 22, 12);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -30; sun.shadow.camera.right = 30; sun.shadow.camera.top = 30; sun.shadow.camera.bottom = -30;
sun.shadow.camera.near = 1; sun.shadow.camera.far = 80;
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
scene.add(sun);

// ------------------------------------------------------------------------------------------------ ground (sidewalk + curb + road)
function groundTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 1024;
  const g = c.getContext('2d')!;
  const rng = mulberry32(7);
  g.fillStyle = rain ? '#5a5853' : '#8d887f'; g.fillRect(0, 0, 1024, 1024);
  // canvas top = world -z (facade side): sidewalk slabs, then curb, then asphalt (bottom 30% → +z)
  const slab = 64;
  for (let y = 0; y < 696; y += slab) {
    const off = ((y / slab) % 2) * slab * 0.75;
    for (let x = -slab * 1.5; x < 1024 + slab * 1.5; x += slab * 1.5) {
      const v = (rain ? 112 : 168) + rng() * 16;
      g.fillStyle = `rgb(${v},${v - 4},${v - 10})`;
      g.fillRect(x + off + 1, y + 1, slab * 1.5 - 2, slab - 2);
    }
  }
  g.fillStyle = rain ? '#77746e' : '#b4afa4'; g.fillRect(0, 696, 1024, 28);
  g.fillStyle = rain ? '#2c2d2f' : '#4a4b4d'; g.fillRect(0, 724, 1024, 300);
  for (let i = 0; i < 9000; i++) { const v = rng() < 0.5 ? 0 : 255; g.fillStyle = `rgba(${v},${v},${v},${0.04 * rng()})`; g.fillRect(rng() * 1024, 724 + rng() * 300, 2, 2); }
  g.fillStyle = 'rgba(235,235,230,0.85)';
  for (let x = 0; x < 1024; x += 160) g.fillRect(x, 880, 90, 8);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}
const gtex = groundTexture();
gtex.repeat.set(10, 1);
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(160, 16),
  new THREE.MeshStandardMaterial({ map: gtex, roughness: rain ? 0.22 : 0.92, metalness: 0, color: rain ? 0xbbbbbb : 0xffffff }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, 0, 0);
ground.receiveShadow = true;
scene.add(ground);
const farGround = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshStandardMaterial({ color: rain ? 0x3a3b3d : 0x7a776f, roughness: 0.9 }));
farGround.rotation.x = -Math.PI / 2; farGround.position.y = -0.01; farGround.receiveShadow = true;
scene.add(farGround);
// a facade-like backdrop (limestone) to judge silhouettes against
const wall = new THREE.Mesh(new THREE.BoxGeometry(160, 14, 1), new THREE.MeshStandardMaterial({ color: rain ? 0x8f8a80 : 0xd9cdb4, roughness: 0.85 }));
wall.position.set(0, 7, -8.5); wall.receiveShadow = true; wall.castShadow = true;
scene.add(wall);

// ------------------------------------------------------------------------------------------------ crowd
// sidewalk occupies z in [-8, +2.2] (texture: road at +z side). Lanes along X.
const rng = mulberry32(12345);
const crowd = new PedestrianMesh(Math.max(crowdN, 1), { lod: useFar ? 'far' : 'near', castShadow: true });
scene.add(crowd.mesh);
interface Walker { x0: number; z: number; v: number; dir: number; anim: PedAnim; heading: number }
const walkers: Walker[] = [];
const span = 70;
for (let i = 0; i < crowdN; i++) {
  const a = randomAppearance(rng, { rain, tourist: rng() < 0.15 });
  crowd.setAppearance(i, a);
  const lane = Math.floor(rng() * 4);
  const dir = lane % 2 === 0 ? 1 : -1;
  const z = -6.8 + lane * 1.5 + (rng() - 0.5) * 0.6;
  const standing = rng() < 0.12;
  const kid = a.height < 1.45;
  const v = standing ? 0 : (a.age > 0.5 ? 0.95 : kid ? 1.15 : 1.25) + rng() * 0.4;
  let anim = PedAnim.Walk;
  let heading = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
  if (standing) {
    const k = rng();
    anim = rain && (a.style & PedStyle.UMBRELLA) ? PedAnim.Umbrella : k < 0.4 ? PedAnim.Idle : k < 0.7 ? PedAnim.Phone : k < 0.85 ? PedAnim.Photo : PedAnim.Hail;
    heading = rng() * Math.PI * 2;
  } else if (rng() < 0.04) { anim = PedAnim.Run; }
  const speed = anim === PedAnim.Run ? 3 + rng() : v;
  walkers.push({ x0: (rng() - 0.5) * span, z, v: anim === PedAnim.Walk || anim === PedAnim.Run ? speed : 0, dir, anim, heading });
  crowd.setAnim(i, anim, rng(), anim === PedAnim.Walk || anim === PedAnim.Run ? speed : 1);
}
crowd.count = crowdN;

// ------------------------------------------------------------------------------------------------ lineup of every animation
const lineup = new PedestrianMesh(32, { lod: 'near' });
scene.add(lineup.mesh);
const lineRng = mulberry32(99);
const lineupAnims = [PedAnim.Idle, PedAnim.Walk, PedAnim.Run, PedAnim.Hail, PedAnim.Phone, PedAnim.Sit, PedAnim.Umbrella, PedAnim.Flinch, PedAnim.Photo];
const lineupNames = ['Idle', 'Walk', 'Run', 'Hail', 'Phone', 'Sit', 'Umbrella', 'Flinch', 'Photo'];
const lineZ = 0.8;
const presets: Partial<PedAppearance>[] = [
  { height: 1.78, build: 1.0, feminine: 0.05, age: 0.1, style: PedStyle.OUTER_COAT | PedStyle.SCARF | PedStyle.HAIR_SHORT, top: '#2b2c30', coat: '#9b7449', bottom: '#26344c', accent: '#8c1c1c' },
  { height: 1.66, build: 0.92, feminine: 0.95, age: 0.15, style: PedStyle.OUTER_TRENCH | PedStyle.HAIR_LONG | PedStyle.HANDBAG, coat: '#b9a37e', bottom: '#1b1b1f', top: '#e6e3dc' },
  { height: 1.84, build: 0.9, feminine: 0.0, age: 0.05, style: PedStyle.HAIR_SHORT | PedStyle.HAT_CAP, top: '#3d5878', bottom: '#1b1b1f', shoes: '#e8e6e1', accent: '#151517' },
  { height: 1.72, build: 1.05, feminine: 0.0, age: 0.2, style: PedStyle.OUTER_JACKET | PedStyle.SUIT | PedStyle.HAIR_SHORT | PedStyle.BEARD, coat: '#1d2433', bottom: '#1d2433', accent: '#e8ecf2' },
  { height: 1.62, build: 1.0, feminine: 1.0, age: 0.1, style: PedStyle.OUTER_JACKET | PedStyle.HAIR_BUN | PedStyle.SKIRT | PedStyle.SKIRT_SHORT, coat: '#151517', bottom: '#5c2328', top: '#ddd2bd' },
  { height: 1.7, build: 1.25, feminine: 0.1, age: 0.7, style: PedStyle.OUTER_COAT | PedStyle.HAT_FELT | PedStyle.HAIR_BALD, coat: '#2b2d31', bottom: '#46474b', hair: '#aaa59e' },
  { height: 1.68, build: 0.95, feminine: 0.9, age: 0.3, style: PedStyle.OUTER_COAT | PedStyle.HAIR_LONG | PedStyle.UMBRELLA | PedStyle.SCARF, coat: '#1d2433', bottom: '#26344c', accent: '#b88a2a' },
  { height: 1.76, build: 1.12, feminine: 0.0, age: 0.1, style: PedStyle.HAIR_SHORT | PedStyle.BACKPACK | PedStyle.HAT_BEANIE, top: '#6a1f26', bottom: '#3a4d6b', accent: '#7a7d80', shoes: '#d9d6cf' },
  { height: 1.6, build: 1.0, feminine: 0.95, age: 0.05, style: PedStyle.HAIR_LONG | PedStyle.BACKPACK | PedStyle.STRIPES | PedStyle.HAT_CAP, top: '#ece8df', accent: '#1b2340', bottom: '#3a4d6b', shoes: '#e8e6e1' },
];
for (let k = 0; k < lineupAnims.length; k++) {
  const base = randomAppearance(lineRng);
  const a = { ...base, ...presets[k] } as PedAppearance;
  lineup.setAppearance(k, a);
  lineup.setTransform(k, (k - 4) * 1.35, 0, lineZ, params.get('face') === 'side' ? Math.PI / 2 : params.get('face') === 'back' ? 0 : Math.PI);
  lineup.setAnim(k, lineupAnims[k], 0, lineupAnims[k] === PedAnim.Walk ? 1.35 : lineupAnims[k] === PedAnim.Run ? 3.2 : 1);
}
// a bench for the sitter
const bench = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 0.45), new THREE.MeshStandardMaterial({ color: 0x2f4a33, roughness: 0.6 }));
bench.position.set((5 - 4) * 1.35, 0.44, lineZ - 0.12);
bench.castShadow = bench.receiveShadow = true;
scene.add(bench);
// variety grid: 3 rows of standing people (side + front views) for silhouette judgement
const varRng = mulberry32(2024);
let vi = lineupAnims.length;
for (let row = 0; row < 2; row++) {
  for (let col = 0; col < 11; col++) {
    if (vi >= 32) break;
    const a = randomAppearance(varRng, { rain: rain && col % 2 === 0 });
    lineup.setAppearance(vi, a);
    lineup.setTransform(vi, (col - 5) * 1.1, 0, -2.6 - row * 1.6, row === 0 ? Math.PI : Math.PI / 2);
    lineup.setAnim(vi, row === 0 ? PedAnim.Idle : PedAnim.Walk, varRng(), 1.3);
    vi++;
  }
}
lineup.count = vi;

// ------------------------------------------------------------------------------------------------ passenger close-up
let passenger: ReturnType<typeof createPassengerModel> | null = null;
if (view === 'closeup') {
  passenger = createPassengerModel({ ...randomAppearance(mulberry32(5)), height: 1.7, build: 1.0, feminine: 0.9, age: 0.2, style: PedStyle.OUTER_TRENCH | PedStyle.HAIR_LONG | PedStyle.SCARF, coat: '#b9a37e', accent: '#8c1c1c', skin: '#e2b593' });
  passenger.object.position.set(-0.8, 0, 3.2);
  scene.add(passenger.object);
}

// ------------------------------------------------------------------------------------------------ rain streaks
if (rain) {
  const n = 6000;
  const pos = new Float32Array(n * 6);
  const r = mulberry32(3);
  for (let i = 0; i < n; i++) {
    const x = (r() - 0.5) * 40, y = r() * 14, z = (r() - 0.5) * 30;
    pos.set([x, y, z, x + 0.03, y - 0.35, z + 0.01], i * 6);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const streaks = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xc8d0d8, transparent: true, opacity: 0.25 }));
  scene.add(streaks);
}

// ------------------------------------------------------------------------------------------------ camera presets
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 400);
const controls = new OrbitControls(camera, renderer.domElement);
function preset(pos: [number, number, number], target: [number, number, number], fov = 45) {
  camera.position.set(...pos); controls.target.set(...target); camera.fov = fov; camera.updateProjectionMatrix(); controls.update();
}
switch (view) {
  case 'lineup': preset([0, 1.6, 8.2], [0, 0.95, 0], 50); break;
  case 'closeup': preset([0.6, 1.55, 6.2], [-0.4, 1.0, 2.2], 35); break;
  case 'variety': preset([0, 2.2, 5.8], [0, 0.9, -3.0], 55); break;
  case 'side': preset([10, 1.5, 1], [0, 0.95, 0.5], 40); break;
  case 'rain': preset([6, 4.5, 15], [0, 1.0, -2], 45); break;
  case 'top': preset([0, 25, 25], [0, 0, -2], 45); break;
  default: preset([7, 4.2, 9.5], [0, 0.9, -4], 45); break;
  case 'far': preset([14, 9, 26], [0, 1.0, -3], 45); break;
}
{
  const cam = params.get('cam'), tgt = params.get('tgt');
  if (cam && tgt) {
    const c = cam.split(',').map(Number) as [number, number, number];
    const g = tgt.split(',').map(Number) as [number, number, number];
    preset(c, g, parseFloat(params.get('fov') ?? '40'));
  }
}
if (params.get('nocrowd') === '1') crowd.mesh.visible = false;
if (params.get('double') === '1') { (lineup.mesh.material as THREE.Material).side = THREE.DoubleSide; }

// ------------------------------------------------------------------------------------------------ loop
const hud = document.getElementById('hud')!;
let lastNow = performance.now();
let simTime = t0;
function placeCrowd(t: number) {
  for (let i = 0; i < walkers.length; i++) {
    const w = walkers[i];
    let x = w.x0 + w.dir * w.v * t;
    x = ((((x + span / 2) % span) + span) % span) - span / 2;
    crowd.setTransform(i, x, 0, w.z, w.heading);
  }
}
let frames = 0;
function frame() {
  const now = performance.now();
  const dt = Math.min((now - lastNow) / 1000, 0.1);
  lastNow = now;
  if (!freeze) simTime += dt;
  placeCrowd(simTime);
  crowd.update(simTime);
  lineup.update(simTime);
  if (passenger) {
    const ph = (simTime * 0.9) % 1;
    passenger.setAnim(simTime % 8 < 4 ? PedAnim.Walk : PedAnim.Idle, ph);
    passenger.update(simTime);
  }
  controls.update();
  renderer.render(scene, camera);
  frames++;
  if (frames % 10 === 1) {
    hud.textContent = `view=${view}  t=${simTime.toFixed(2)}s  crowd=${crowd.count} (${crowd.lod}, ${pedTriangleCount(crowd.lod)} tris/char mesh)\n` +
      `draw calls=${renderer.info.render.calls}  tris=${renderer.info.render.triangles}\nlineup: ${lineupNames.join(' · ')}`;
  }
  (window as unknown as { __pedsFrames: number }).__pedsFrames = frames;
  // when frozen (screenshots), stop after a few frames so headless capture is not starved by slow software GL
  if (!freeze || frames < 3) requestAnimationFrame(frame);
}
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight);
});
frame();
