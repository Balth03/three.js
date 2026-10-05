// Step 2 dioramas: prison, court, villa, mansion, casino, beach, stadium, studio, castle.
import * as THREE from 'three';
import type { Place } from '@bl/sim';
import { G, M, mesh, blobShadow, textTexture } from './kit.ts';
import { plinth, tree, bush, flowers, fence, lamp, bench, car, windowGrid, path, newD, type Diorama } from './dioramas.ts';

function sign(text: string, w: number, h: number, color = '#ffffff', bg?: string) {
  const tex = textTexture([text], 512, 128, color);
  const g = new THREE.Group();
  if (bg) g.add(mesh(G.box(w + 0.15, h + 0.15, 0.08, 0.04), M(bg), 0, 0, -0.05));
  g.add(new THREE.Mesh(G.plane(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true })));
  return g;
}

function buildPrison(): Diorama {
  const d = newD('prison');
  plinth(d, '#A9B59A', '#8D7B6C', '#B9B3AA');
  const concrete = M('#C9C6C0', { rough: 0.95 });
  // yard ground
  d.root.add(mesh(G.box(10.6, 0.06, 7.2, 0.03), M('#BDB7AD', { rough: 1 }), 0, 0.03, 0.8, false));
  // cell block
  const g = new THREE.Group();
  g.position.set(0, 0, -3.3);
  g.add(mesh(G.box(9, 3.6, 2.6, 0.08), concrete, 0, 1.8, 0));
  const bars = M('#4A4F5A', { metal: 0.6, rough: 0.35 });
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) {
    const x = -3.6 + c * 1.45, y = 1.1 + r * 1.4;
    g.add(mesh(G.box(0.95, 0.85, 0.06, 0.02), M('#2E3138', { rough: 0.8 }), x, y, 1.31));
    for (let k = 0; k < 5; k++) g.add(mesh(G.cyl(0.025, 0.025, 0.85, 6), bars, x - 0.38 + k * 0.19, y, 1.36, false));
  }
  g.add(mesh(G.box(9.2, 0.25, 2.8, 0.06), M('#A8A39A'), 0, 3.7, 0));
  const s = sign('BLOC C', 2.2, 0.55, '#ffffff', '#5B6270');
  s.position.set(0, 3.25, 1.4);
  g.add(s);
  d.root.add(g);
  // watchtower
  const wt = new THREE.Group();
  wt.position.set(4.6, 0, -0.5);
  for (const sx of [-0.5, 0.5]) for (const sz of [-0.5, 0.5]) wt.add(mesh(G.cyl(0.07, 0.07, 3.6, 8), bars, sx, 1.8, sz));
  wt.add(mesh(G.box(1.6, 1.0, 1.6, 0.08), concrete, 0, 4.1, 0));
  wt.add(mesh(G.cone(1.25, 0.8, 4), M('#5B6270'), 0, 5.0, 0).rotateY(Math.PI / 4));
  const spot = mesh(G.sphere(10), M('#FFF6C8', { emissive: '#FFE680', ei: 1.2, unique: true }), -0.6, 4.1, 0.6, false);
  spot.scale.setScalar(0.18);
  d.windows.push(spot.material as THREE.MeshStandardMaterial);
  wt.add(spot);
  d.root.add(wt);
  // fence with barbed wire
  const fm = M('#6B717C', { metal: 0.5, rough: 0.4 });
  for (const [x0, z0, x1, z1] of [[-5.6, 5.4, 5.6, 5.4], [-5.6, -1.6, -5.6, 5.4], [5.6, 1.2, 5.6, 5.4]] as const) {
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.round(len / 1.2);
    for (let i = 0; i <= n; i++) d.root.add(mesh(G.cyl(0.04, 0.04, 1.8, 6), fm, x0 + (x1 - x0) * (i / n), 0.9, z0 + (z1 - z0) * (i / n)));
    const net = mesh(G.box(len, 1.5, 0.02, 0.01), M('#9AA0A8', { opacity: 0.35, transparent: true }), (x0 + x1) / 2, 0.9, (z0 + z1) / 2, false);
    net.rotation.y = -Math.atan2(z1 - z0, x1 - x0);
    d.root.add(net);
    const coil = mesh(G.cyl(0.12, 0.12, len, 8), M('#A9AEB6', { metal: 0.7, rough: 0.3 }), (x0 + x1) / 2, 1.9, (z0 + z1) / 2, false);
    coil.rotation.z = Math.PI / 2;
    coil.rotation.y = -Math.atan2(z1 - z0, x1 - x0);
    d.root.add(coil);
  }
  // yard props: basketball hoop, weights bench
  d.root.add(mesh(G.cyl(0.06, 0.06, 2.6, 8), fm, -4.2, 1.3, 2.2));
  d.root.add(mesh(G.box(1.0, 0.7, 0.05, 0.02), M('#FFFFFF'), -4.2, 2.6, 2.4));
  d.root.add(mesh(G.torus(0.22, 0.025), M('#FF6B35'), -4.2, 2.35, 2.62).rotateX(Math.PI / 2));
  d.root.add(mesh(G.box(1.4, 0.12, 0.4, 0.04), M('#3D4756'), 3.2, 0.5, 3.4));
  const bar = mesh(G.cyl(0.03, 0.03, 1.8, 8), fm, 3.2, 0.9, 3.4); bar.rotation.z = Math.PI / 2; d.root.add(bar);
  for (const sx of [-0.8, 0.8]) { const w = mesh(G.cyl(0.25, 0.25, 0.1, 16), M('#2B2B33'), 3.2 + sx, 0.9, 3.4); w.rotation.z = Math.PI / 2; d.root.add(w); }
  const bball = mesh(G.sphere(12), M('#FF7A3D'), 1.5, 0.15, 4.2); bball.scale.setScalar(0.15); d.root.add(bball);
  d.spots = [new THREE.Vector3(0, 0, 1.4), new THREE.Vector3(-1.6, 0, 1.8), new THREE.Vector3(1.5, 0, 1.9), new THREE.Vector3(-0.8, 0, 3.0), new THREE.Vector3(0.9, 0, 3.0)];
  return d;
}

function buildCourt(): Diorama {
  const d = newD('court');
  plinth(d, '#9CC97E');
  const stone = M('#EFE7D8', { rough: 0.7 });
  const g = new THREE.Group();
  g.position.set(0, 0, -2.6);
  for (let i = 0; i < 3; i++) g.add(mesh(G.box(8.6 - i * 0.4, 0.22, 3.6 - i * 0.3, 0.05), M('#DCD3C2'), 0, 0.11 + i * 0.22, 0.6 - i * 0.15));
  g.add(mesh(G.box(7.6, 3.4, 2.4, 0.1), stone, 0, 2.3, -0.4));
  for (let i = 0; i < 6; i++) g.add(mesh(G.cyl(0.24, 0.27, 3.2, 18), M('#FFFFFF', { rough: 0.55 }), -3.0 + i * 1.2, 2.25, 1.1));
  g.add(mesh(G.box(8.0, 0.4, 0.9, 0.06), stone, 0, 4.0, 1.1));
  const ped = new THREE.Shape([new THREE.Vector2(-4.0, 0), new THREE.Vector2(4.0, 0), new THREE.Vector2(0, 1.4)]);
  g.add(mesh(new THREE.ExtrudeGeometry(ped, { depth: 0.9, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 }), stone, 0, 4.2, 0.65));
  const sg = sign('TRIBUNAL', 2.8, 0.6, '#5B4A3A');
  sg.position.set(0, 4.65, 1.62);
  g.add(sg);
  // scales of justice
  const gold = M('#E8B84A', { metal: 0.8, rough: 0.25 });
  g.add(mesh(G.cyl(0.04, 0.04, 0.8, 8), gold, 0, 5.85, 1.1));
  const beam = mesh(G.cyl(0.03, 0.03, 1.0, 8), gold, 0, 6.2, 1.1); beam.rotation.z = Math.PI / 2; g.add(beam);
  for (const sx of [-0.45, 0.45]) g.add(mesh(G.cap(0.2, Math.PI / 2, Math.PI / 2), gold, sx, 6.0, 1.1));
  d.root.add(g);
  path(d, [[0, 0.8], [0, 1.8], [0, 2.8], [0, 3.8], [0, 4.8]], '#E3D9C7');
  lamp(d, -2.6, 2.4);
  lamp(d, 2.6, 2.4);
  tree(d, -4.6, 0.6, 0.9, 'tall');
  tree(d, 4.6, 0.6, 0.9, 'tall');
  car(d, 3.8, 3.8, '#2B2F3A', -0.2);
  const pc = mesh(G.box(0.25, 0.08, 0.25, 0.02), M('#5AA9FF', { emissive: '#5AA9FF', ei: 1 }), 3.8, 1.25, 3.8, false);
  d.root.add(pc);
  d.spots = [new THREE.Vector3(-0.6, 0, 2.2), new THREE.Vector3(-1.9, 0, 2.4), new THREE.Vector3(0.8, 0, 2.5), new THREE.Vector3(1.9, 0, 3.0)];
  return d;
}

function pool(d: Diorama, x: number, z: number, w: number, h: number) {
  d.root.add(mesh(G.box(w + 0.5, 0.12, h + 0.5, 0.06), M('#F4F1EA'), x, 0.06, z, false));
  const water = mesh(G.box(w, 0.1, h, 0.04), M('#5FD0F2', { rough: 0.05, metal: 0.1, emissive: '#3FB8E0', ei: 0.12 }), x, 0.1, z, false);
  d.root.add(water);
  d.update = (t) => { water.position.y = 0.1 + Math.sin(t * 2) * 0.005; };
}

function palm(d: Diorama, x: number, z: number, s = 1) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.scale.setScalar(s);
  const trunkM = M('#B8895E', { rough: 0.9 });
  for (let i = 0; i < 6; i++) {
    const seg = mesh(G.cyl(0.12 - i * 0.008, 0.14 - i * 0.008, 0.5, 8), trunkM, Math.sin(i * 0.3) * 0.15 * i * 0.3, 0.25 + i * 0.48, 0);
    seg.rotation.z = -0.06 * i;
    g.add(seg);
  }
  const leaf = M('#3FAF5A', { unique: true, rough: 0.8 });
  d.foliage.push({ m: leaf, base: leaf.color.clone() });
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const l = mesh(G.box(1.4, 0.06, 0.38, 0.03), leaf, Math.cos(a) * 0.6 + 0.4, 2.95, Math.sin(a) * 0.6);
    l.rotation.y = -a;
    l.rotation.z = -0.45;
    g.add(l);
  }
  g.add(blobShadow(0.8, 0.22));
  d.root.add(g);
}

function buildVilla(): Diorama {
  const d = newD('villa');
  plinth(d, '#8FD37A');
  const white = M('#FFFDF7', { rough: 0.6 });
  const g = new THREE.Group();
  g.position.set(-0.4, 0, -2.9);
  g.add(mesh(G.box(6.4, 2.4, 3.0, 0.1), white, 0, 1.2, 0));
  g.add(mesh(G.box(3.6, 2.0, 2.6, 0.1), white, -1.2, 3.4, -0.2));
  g.add(mesh(G.box(6.8, 0.2, 3.4, 0.06), M('#C8B9A6'), 0, 2.45, 0));
  g.add(mesh(G.box(4.0, 0.2, 3.0, 0.06), M('#C8B9A6'), -1.2, 4.45, -0.2));
  windowGrid(d, g, 0.6, 1.25, 1.52, 3, 1, 1.4, 1.7, 1.7, 1, '#2B2F3A', '#FFF0C8');
  windowGrid(d, g, -1.2, 3.4, 1.12, 2, 1, 1.2, 1.2, 1.6, 1, '#2B2F3A', '#FFF0C8');
  // railing
  for (let i = 0; i < 9; i++) g.add(mesh(G.cyl(0.02, 0.02, 0.5, 6), M('#2B2F3A', { metal: 0.6 }), 0.4 + i * 0.3, 2.8, 1.5, false));
  d.root.add(g);
  pool(d, 1.6, 1.2, 3.4, 2.2);
  palm(d, 4.5, -1.5, 1);
  palm(d, -4.6, 1.4, 0.9);
  // sun loungers
  for (const x of [0.4, 2.4]) {
    const l = mesh(G.box(0.6, 0.12, 1.4, 0.05), M('#FFFFFF'), x, 0.35, 3.3);
    l.rotation.x = -0.15;
    d.root.add(l);
  }
  d.root.add(mesh(G.cyl(0.04, 0.04, 2, 6), M('#C9B79C'), 3.6, 1, 3.3));
  d.root.add(mesh(G.cone(1.0, 0.5, 12), M('#FF6B6B'), 3.6, 2.1, 3.3));
  car(d, -3.6, 3.6, '#FFD166', 0.3);
  flowers(d, -2.4, 0.6, 8);
  d.spots = [new THREE.Vector3(-1.0, 0, 2.2), new THREE.Vector3(-2.2, 0, 2.6), new THREE.Vector3(-0.2, 0, 3.4), new THREE.Vector3(-3.0, 0, 1.4), new THREE.Vector3(1.0, 0, 4.4)];
  return d;
}

function buildMansion(): Diorama {
  const d = newD('mansion');
  plinth(d, '#8ACB72');
  const brick = M('#E9DCC6', { rough: 0.75 });
  const roof = M('#4E5A6E', { rough: 0.6 });
  const g = new THREE.Group();
  g.position.set(0, 0, -3.0);
  g.add(mesh(G.box(8.8, 3.6, 2.8, 0.1), brick, 0, 1.8, 0));
  g.add(mesh(G.box(2.6, 4.8, 3.2, 0.1), brick, 0, 2.4, 0.2));
  for (const sx of [-1, 1]) {
    const r = mesh(G.box(9.2, 0.25, 1.8, 0.08), roof, 0, 4.1, sx * 0.75);
    r.rotation.x = sx * 0.55;
    g.add(r);
  }
  const tp = new THREE.Shape([new THREE.Vector2(-1.5, 0), new THREE.Vector2(1.5, 0), new THREE.Vector2(0, 1.2)]);
  g.add(mesh(new THREE.ExtrudeGeometry(tp, { depth: 0.4, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04 }), roof, 0, 4.8, 1.4));
  windowGrid(d, g, -2.9, 1.9, 1.42, 2, 2, 0.75, 1.0, 1.15, 1.4, '#FFFFFF', '#FFE6A8');
  windowGrid(d, g, 2.9, 1.9, 1.42, 2, 2, 0.75, 1.0, 1.15, 1.4, '#FFFFFF', '#FFE6A8');
  windowGrid(d, g, 0, 3.4, 1.82, 1, 1, 0.9, 1.0, 1, 1, '#FFFFFF', '#FFE6A8');
  g.add(mesh(G.box(1.2, 2.0, 0.12, 0.06), M('#7A4A2A', { rough: 0.5 }), 0, 1.0, 1.82));
  for (const sx of [-0.9, 0.9]) g.add(mesh(G.cyl(0.13, 0.15, 2.4, 14), M('#FFFFFF'), sx, 1.2, 2.2));
  d.root.add(g);
  // fountain
  const f = new THREE.Group();
  f.position.set(0, 0, 1.8);
  f.add(mesh(G.cyl(1.1, 1.2, 0.4, 28), M('#E0D8CA'), 0, 0.2, 0));
  f.add(mesh(G.cyl(0.95, 0.95, 0.06, 28), M('#6CCFF0', { rough: 0.05, metal: 0.2 }), 0, 0.38, 0, false));
  f.add(mesh(G.cyl(0.12, 0.18, 1.0, 12), M('#E0D8CA'), 0, 0.85, 0));
  f.add(mesh(G.cyl(0.45, 0.3, 0.15, 20), M('#E0D8CA'), 0, 1.4, 0));
  d.root.add(f);
  for (const sx of [-1, 1]) {
    for (let i = 0; i < 4; i++) bush(d, sx * (2.4 + i * 0.05), -0.3 + i * 1.3, 0.5, '#3E8E4E');
    tree(d, sx * 4.7, -1.2, 0.85, 'pine', '#2F7E4E');
  }
  car(d, 3.6, 3.8, '#1D1D24', -0.4);
  d.spots = [new THREE.Vector3(-1.5, 0, 3.4), new THREE.Vector3(-2.7, 0, 3.6), new THREE.Vector3(1.4, 0, 3.4), new THREE.Vector3(-0.4, 0, 4.6), new THREE.Vector3(2.4, 0, 4.4)];
  return d;
}

function buildCastle(): Diorama {
  const d = newD('castle');
  plinth(d, '#86C46E', '#9C7A5C', '#C2B6A4');
  const stone = M('#CFC6B6', { rough: 0.9 });
  const roof = M('#3F5FA8', { rough: 0.55 });
  const g = new THREE.Group();
  g.position.set(0, 0, -2.4);
  g.add(mesh(G.box(6.4, 3.2, 3.0, 0.08), stone, 0, 1.6, 0));
  for (let i = 0; i < 9; i++) g.add(mesh(G.box(0.45, 0.45, 0.45, 0.05), stone, -3.0 + i * 0.75, 3.4, 1.3));
  for (const [x, z, h] of [[-3.4, 1.3, 4.6], [3.4, 1.3, 4.6], [-3.4, -1.3, 5.2], [3.4, -1.3, 5.2], [0, -0.6, 6.4]] as const) {
    g.add(mesh(G.cyl(0.85, 0.95, h, 20), stone, x, h / 2, z));
    g.add(mesh(G.cone(1.15, 1.8, 20), roof, x, h + 0.9, z));
    g.add(mesh(G.cyl(0.015, 0.015, 0.8, 4), M('#555'), x, h + 2.1, z, false));
    g.add(mesh(G.box(0.4, 0.25, 0.02, 0.01), M('#FF4D6D'), x + 0.2, h + 2.35, z, false));
  }
  const gate = new THREE.Shape();
  gate.moveTo(-0.7, 0); gate.lineTo(0.7, 0); gate.lineTo(0.7, 1.3); gate.absarc(0, 1.3, 0.7, 0, Math.PI, false); gate.lineTo(-0.7, 0);
  g.add(mesh(new THREE.ExtrudeGeometry(gate, { depth: 0.1, bevelEnabled: false }), M('#5A3A22'), 0, 0, 1.52));
  windowGrid(d, g, 0, 2.4, 1.52, 4, 1, 0.4, 0.7, 1.3, 1, '#7A6A55', '#FFE6A8');
  d.root.add(g);
  // moat
  const moat = mesh(G.box(9.6, 0.05, 0.9, 0.03), M('#6CB8E0', { rough: 0.05, metal: 0.2 }), 0, 0.04, 0.4, false);
  d.root.add(moat);
  d.root.add(mesh(G.box(1.5, 0.12, 1.3, 0.03), M('#8A5A32'), 0, 0.12, 0.4));
  tree(d, -4.8, 3.4, 0.9, 'pine', '#2F7E4E');
  tree(d, 4.8, 3.0, 1.0, 'round');
  flowers(d, -2.6, 3.6, 8);
  flowers(d, 2.4, 3.8, 8);
  d.spots = [new THREE.Vector3(0, 0, 2.0), new THREE.Vector3(-1.4, 0, 2.3), new THREE.Vector3(1.4, 0, 2.3), new THREE.Vector3(-0.7, 0, 3.4), new THREE.Vector3(0.8, 0, 3.4)];
  return d;
}

function buildCasino(): Diorama {
  const d = newD('casino');
  plinth(d, '#2E2540', '#4A3B5C', '#6B5A80');
  d.root.add(mesh(G.box(11, 0.06, 11, 0.03), M('#7A1F3D', { rough: 0.9 }), 0, 0.03, 0, false));
  const g = new THREE.Group();
  g.position.set(0, 0, -3.4);
  g.add(mesh(G.box(9, 4.2, 2.4, 0.1), M('#1F1A2E', { rough: 0.4 }), 0, 2.1, 0));
  const neon = M('#FF4FB8', { emissive: '#FF4FB8', ei: 2.2, unique: true });
  d.windows.push(neon);
  const sg = sign('CASINO', 4.2, 1.0, '#FFE066');
  sg.position.set(0, 3.2, 1.25);
  g.add(sg);
  for (let i = 0; i < 18; i++) { const b = mesh(G.sphere(8), i % 2 ? neon : M('#FFE066', { emissive: '#FFE066', ei: 2 }), -4.2 + i * 0.5, 4.0, 1.25, false); b.scale.setScalar(0.09); g.add(b); }
  d.root.add(g);
  // tables
  const felt = M('#1E7A4A', { rough: 0.9 });
  for (const [x, z] of [[-2.6, 0.6], [2.6, 0.6]] as const) {
    d.root.add(mesh(G.cyl(1.1, 1.1, 0.12, 28), felt, x, 0.85, z));
    d.root.add(mesh(G.torus(1.1, 0.08), M('#5A3A22', { rough: 0.5 }), x, 0.88, z).rotateX(Math.PI / 2));
    d.root.add(mesh(G.cyl(0.25, 0.4, 0.8, 12), M('#2B2033'), x, 0.4, z));
    for (let i = 0; i < 5; i++) d.root.add(mesh(G.cyl(0.08, 0.08, 0.06 + i * 0.02, 12), M(['#FF4D6D', '#4DA3FF', '#FFE066', '#FFFFFF', '#1D1D24'][i]), x - 0.4 + i * 0.2, 0.95, z + 0.3));
  }
  // slot machines
  for (let i = 0; i < 4; i++) {
    const sm = new THREE.Group();
    sm.position.set(-4.6, 0, -1.2 + i * 1.3);
    sm.rotation.y = Math.PI / 2;
    sm.add(mesh(G.box(0.8, 1.7, 0.6, 0.08), M(['#E63946', '#4361EE', '#F4A261', '#9B5DE5'][i]), 0, 0.85, 0));
    const scr = mesh(G.box(0.6, 0.4, 0.05, 0.02), M('#FFFBE0', { emissive: '#FFE680', ei: 0.9, unique: true }), 0, 1.15, 0.31, false);
    d.windows.push(scr.material as THREE.MeshStandardMaterial);
    sm.add(scr);
    d.root.add(sm);
  }
  d.spots = [new THREE.Vector3(0, 0, 1.6), new THREE.Vector3(-1.4, 0, 2.2), new THREE.Vector3(1.4, 0, 2.2), new THREE.Vector3(-0.5, 0, 3.2), new THREE.Vector3(0.7, 0, 3.4)];
  return d;
}

function buildBeach(): Diorama {
  const d = newD('beach');
  plinth(d, '#F2DDA4', '#D8B88A', '#C9B9A2');
  // sea
  const sea = mesh(G.box(11.6, 0.3, 4.6, 0.1), M('#4FC3E8', { rough: 0.08, metal: 0.15, emissive: '#2FA6D0', ei: 0.1 }), 0, 0.02, -3.6, false);
  d.root.add(sea);
  const foam = mesh(G.box(11.4, 0.05, 0.3, 0.02), M('#FFFFFF', { opacity: 0.8, transparent: true }), 0, 0.18, -1.3, false);
  d.root.add(foam);
  d.update = (t) => { foam.position.z = -1.3 + Math.sin(t * 1.2) * 0.15; sea.position.y = 0.02 + Math.sin(t) * 0.02; };
  // beach house
  const h = new THREE.Group();
  h.position.set(3.6, 0, 1.0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) h.add(mesh(G.cyl(0.08, 0.08, 0.8, 8), M('#B8895E'), sx * 1.1, 0.4, sz * 0.9));
  h.add(mesh(G.box(2.6, 1.8, 2.2, 0.08), M('#7FD1E8', { rough: 0.7 }), 0, 1.7, 0));
  h.add(mesh(G.cone(2.1, 1.0, 4), M('#FFFFFF'), 0, 3.1, 0).rotateY(Math.PI / 4));
  windowGrid(d, h, 0, 1.8, 1.12, 2, 1, 0.6, 0.6, 1.0, 1, '#FFFFFF', '#FFF0C8');
  d.root.add(h);
  palm(d, -4.4, 1.0, 1.05);
  palm(d, -3.2, 3.6, 0.8);
  // parasol & towel & sandcastle
  d.root.add(mesh(G.cyl(0.04, 0.04, 2, 6), M('#FFFFFF'), -1.4, 1, 1.6));
  d.root.add(mesh(G.cone(1.1, 0.5, 14), M('#FF6B6B'), -1.4, 2.1, 1.6));
  d.root.add(mesh(G.box(0.9, 0.02, 1.8, 0.01), M('#FFD166'), -0.6, 0.02, 2.4, false));
  d.root.add(mesh(G.cyl(0.4, 0.5, 0.4, 10), M('#E9C98E'), 1.2, 0.2, 3.6));
  d.root.add(mesh(G.cyl(0.2, 0.3, 0.35, 10), M('#E9C98E'), 1.2, 0.55, 3.6));
  d.root.add(mesh(G.cone(0.22, 0.3, 10), M('#E9C98E'), 1.2, 0.85, 3.6));
  d.spots = [new THREE.Vector3(0, 0, 1.2), new THREE.Vector3(-1.4, 0, 0.6), new THREE.Vector3(1.2, 0, 1.6), new THREE.Vector3(-0.6, 0, 2.6), new THREE.Vector3(0.6, 0, 2.7)];
  return d;
}

function buildStadium(): Diorama {
  const d = newD('stadium');
  plinth(d, '#5DB85A', '#8A7A66', '#BDB3A6');
  // pitch lines
  const white = M('#FFFFFF');
  d.root.add(mesh(G.box(9.8, 0.02, 0.07, 0.01), white, 0, 0.02, -2.6, false));
  d.root.add(mesh(G.box(9.8, 0.02, 0.07, 0.01), white, 0, 0.02, 4.6, false));
  d.root.add(mesh(G.box(0.07, 0.02, 7.2, 0.01), white, 0, 0.02, 1.0, false));
  d.root.add(mesh(G.torus(1.0, 0.035), white, 0, 0.02, 1.0).rotateX(Math.PI / 2));
  for (let i = 0; i < 5; i++) d.root.add(mesh(G.box(10, 0.01, 0.8, 0.01), M(i % 2 ? '#56AE53' : '#62BF5F'), 0, 0.012, -2.2 + i * 1.45, false));
  // stands
  const seatCols = ['#E63946', '#FFFFFF', '#4361EE'];
  for (let r = 0; r < 4; r++) {
    const st = mesh(G.box(11, 0.5, 0.7, 0.05), M('#9AA3AE'), 0, 0.3 + r * 0.5, -3.3 - r * 0.6);
    d.root.add(st);
    for (let i = 0; i < 22; i++) {
      const fan = mesh(G.sphere(8), M(seatCols[(i + r) % 3]), -5.2 + i * 0.5, 0.75 + r * 0.5, -3.3 - r * 0.6, false);
      fan.scale.setScalar(0.16);
      d.root.add(fan);
    }
  }
  // goals
  for (const sx of [-1, 1]) {
    const g = new THREE.Group();
    g.position.set(sx * 4.9, 0, 1.0);
    for (const sz of [-0.9, 0.9]) g.add(mesh(G.cyl(0.04, 0.04, 1.1, 8), white, 0, 0.55, sz));
    const top = mesh(G.cyl(0.04, 0.04, 1.8, 8), white, 0, 1.1, 0); top.rotation.x = Math.PI / 2; g.add(top);
    g.add(mesh(G.box(0.6, 1.1, 1.8, 0.02), M('#FFFFFF', { opacity: 0.25, transparent: true }), -sx * 0.3, 0.55, 0, false));
    d.root.add(g);
  }
  // floodlights
  for (const sx of [-5.3, 5.3]) {
    d.root.add(mesh(G.cyl(0.08, 0.1, 5, 8), M('#5B6270', { metal: 0.5 }), sx, 2.5, -4.6));
    const lm = M('#FFFCE8', { emissive: '#FFF6C8', ei: 1.5, unique: true });
    d.windows.push(lm);
    d.root.add(mesh(G.box(1.0, 0.6, 0.2, 0.05), lm, sx, 5.1, -4.5));
  }
  const ball = mesh(G.sphere(14), M('#FFFFFF', { rough: 0.4 }), 0.8, 0.14, 1.6);
  ball.scale.setScalar(0.14);
  d.root.add(ball);
  d.spots = [new THREE.Vector3(0, 0, 1.4), new THREE.Vector3(-1.6, 0, 1.8), new THREE.Vector3(1.6, 0, 2.0), new THREE.Vector3(-0.6, 0, 3.0), new THREE.Vector3(0.9, 0, 3.0)];
  return d;
}

function buildStudio(): Diorama {
  const d = newD('studio');
  plinth(d, '#3A3550', '#4E4866', '#6A6284');
  d.root.add(mesh(G.box(11, 0.06, 11, 0.03), M('#2A2638', { rough: 0.6 }), 0, 0.03, 0, false));
  // stage & backdrop
  d.root.add(mesh(G.box(8, 0.4, 3.6, 0.08), M('#1F1B2B'), 0, 0.2, -2.6));
  const back = mesh(G.box(8.4, 4.4, 0.2, 0.06), M('#7F5AF0', { emissive: '#7F5AF0', ei: 0.25, unique: true }), 0, 2.6, -4.4);
  d.windows.push(back.material as THREE.MeshStandardMaterial);
  d.root.add(back);
  const sg = sign('ON AIR', 2.4, 0.6, '#FFFFFF', '#E63946');
  sg.position.set(0, 4.2, -4.25);
  d.root.add(sg);
  // spotlights
  for (const [x, c] of [[-3.6, '#FF4FB8'], [0, '#FFE066'], [3.6, '#4DD8FF']] as const) {
    d.root.add(mesh(G.cyl(0.05, 0.05, 4.6, 6), M('#2B2B33'), x, 2.3, 3.6));
    const head = mesh(G.cyl(0.25, 0.35, 0.5, 14), M('#2B2B33'), x, 4.6, 3.4);
    head.rotation.x = 1.1;
    d.root.add(head);
    const lm = M(c, { emissive: c, ei: 2, unique: true });
    d.windows.push(lm);
    const lens = mesh(G.circle(0.24), lm, x, 4.45, 3.15, false);
    lens.rotation.x = -0.5;
    d.root.add(lens);
  }
  // camera on tripod
  const cam = new THREE.Group();
  cam.position.set(2.6, 0, 3.0);
  for (let i = 0; i < 3; i++) { const lg = mesh(G.cyl(0.03, 0.03, 1.4, 6), M('#2B2B33'), Math.cos(i * 2.1) * 0.25, 0.65, Math.sin(i * 2.1) * 0.25); lg.rotation.set(Math.sin(i * 2.1) * 0.3, 0, -Math.cos(i * 2.1) * 0.3); cam.add(lg); }
  cam.add(mesh(G.box(0.7, 0.45, 0.4, 0.06), M('#1D1D24'), 0, 1.45, 0));
  const lensC = mesh(G.cyl(0.14, 0.14, 0.35, 14), M('#2B2B33', { metal: 0.5 }), 0, 1.45, -0.35); lensC.rotation.x = Math.PI / 2; cam.add(lensC);
  cam.rotation.y = 0.6;
  d.root.add(cam);
  // microphone
  d.root.add(mesh(G.cyl(0.03, 0.03, 1.5, 6), M('#C0C4CC', { metal: 0.7 }), -0.8, 1.15, -1.6));
  const mic = mesh(G.sphere(10), M('#2B2B33', { metal: 0.4 }), -0.8, 1.95, -1.6); mic.scale.setScalar(0.12); d.root.add(mic);
  d.spots = [new THREE.Vector3(0, 0.4, -2.0), new THREE.Vector3(-1.6, 0, 1.2), new THREE.Vector3(1.0, 0, 1.4), new THREE.Vector3(-0.4, 0, 2.4)];
  return d;
}

export const EXTRA_BUILDERS: Partial<Record<Place, () => Diorama>> = {
  prison: buildPrison, court: buildCourt, villa: buildVilla, mansion: buildMansion, castle: buildCastle,
  casino: buildCasino, party: buildCasino, beach: buildBeach, stadium: buildStadium, studio: buildStudio,
};

void fence; void bench;
