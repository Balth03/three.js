// Procedural toy pets (dog, cat, bird, snake, goat, hamster, dragon…).
import * as THREE from 'three';
import { G, M, mesh, blobShadow } from './kit.ts';

const COLORS: Record<string, string[]> = {
  dog: ['#C68B59', '#3B2F2F', '#F2E6D8', '#8A6A4A'], chien: ['#C68B59', '#3B2F2F', '#F2E6D8'],
  cat: ['#F2A65A', '#4A4A4A', '#EDEDED', '#9C8C7C'], chat: ['#F2A65A', '#4A4A4A', '#EDEDED'],
  goat: ['#F4F1EA', '#8A7A66'], hamster: ['#E8B07A', '#F6E2C8'], rabbit: ['#EDEDED', '#B9A08A'],
  parrot: ['#2EC45A', '#E63946', '#3A86FF'], owl: ['#8A6A4A'], snake: ['#4E9F3D', '#C9A227'], dragon: ['#3FAF6A', '#B5179E'],
  squirrel: ['#C2602E'], snail: ['#C9A27A'], fish: ['#FF8C42'], horse: ['#7A4E2D'], pig: ['#F6B5C3'],
};

export class Pet {
  readonly root = new THREE.Group();
  private body = new THREE.Group();
  private tail?: THREE.Object3D;
  private head = new THREE.Group();
  private phase = Math.random() * 10;
  private hopT = 0;

  constructor(readonly species: string, seed: number) {
    const pal = COLORS[species] ?? COLORS.dog;
    const col = pal[seed % pal.length];
    const fur = new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.7, sheen: 0.6, sheenColor: new THREE.Color('#ffffff') });
    const dark = M('#2B2228', { rough: 0.3 });
    const eye = (x: number, y: number, z: number, s = 0.05) => { const e = mesh(G.sphere(10), dark, x, y, z, false); e.scale.setScalar(s); return e; };
    this.root.add(blobShadow(0.35, 0.3));
    this.root.add(this.body);
    if (species === 'snake') {
      for (let i = 0; i < 7; i++) {
        const seg = mesh(G.sphere(12), fur, Math.sin(i * 0.9) * 0.18, 0.08, -i * 0.13);
        seg.scale.set(0.1, 0.08, 0.12);
        this.body.add(seg);
      }
      this.head.position.set(0, 0.1, 0.12);
      const h = mesh(G.sphere(14), fur, 0, 0, 0); h.scale.set(0.12, 0.08, 0.14); this.head.add(h);
      this.head.add(eye(0.06, 0.05, 0.06, 0.025), eye(-0.06, 0.05, 0.06, 0.025));
      this.body.add(this.head);
      return;
    }
    if (species === 'parrot' || species === 'owl') {
      const b = mesh(G.sphere(16), fur, 0, 0.32, 0); b.scale.set(0.16, 0.22, 0.16); this.body.add(b);
      this.head.position.set(0, 0.56, 0.02);
      const h = mesh(G.sphere(14), fur, 0, 0, 0); h.scale.setScalar(0.13); this.head.add(h);
      this.head.add(eye(0.06, 0.03, 0.1, species === 'owl' ? 0.045 : 0.025), eye(-0.06, 0.03, 0.1, species === 'owl' ? 0.045 : 0.025));
      const beak = mesh(G.cone(0.04, 0.09, 8), M('#FFB703'), 0, -0.02, 0.14); beak.rotation.x = Math.PI / 2; this.head.add(beak);
      for (const s of [-1, 1]) { const w = mesh(G.sphere(12), fur, s * 0.15, 0.32, -0.02); w.scale.set(0.05, 0.16, 0.11); this.body.add(w); }
      this.body.add(this.head);
      for (const s of [-1, 1]) this.body.add(mesh(G.cyl(0.012, 0.012, 0.12, 4), M('#FFB703'), s * 0.05, 0.08, 0));
      return;
    }
    const small = species === 'hamster' || species === 'squirrel' || species === 'snail' || species === 'fish';
    const big = species === 'goat' || species === 'horse' || species === 'dragon' || species === 'pig';
    const s = small ? 0.55 : big ? 1.25 : 1;
    this.body.scale.setScalar(s);
    const torso = mesh(G.capsule(), fur, 0, 0.32, 0);
    torso.scale.set(0.3, 0.32, 0.3);
    torso.rotation.x = Math.PI / 2;
    this.body.add(torso);
    for (const [x, z] of [[-0.1, 0.14], [0.1, 0.14], [-0.1, -0.14], [0.1, -0.14]]) { const leg = mesh(G.capsule(), fur, x, 0.12, z); leg.scale.set(0.07, 0.16, 0.07); this.body.add(leg); }
    this.head.position.set(0, 0.48, 0.26);
    const h = mesh(G.sphere(16), fur, 0, 0, 0);
    h.scale.set(0.18, 0.16, 0.17);
    this.head.add(h);
    this.head.add(eye(0.07, 0.03, 0.14), eye(-0.07, 0.03, 0.14));
    const nose = mesh(G.sphere(8), dark, 0, -0.03, 0.17, false); nose.scale.setScalar(0.03); this.head.add(nose);
    if (species === 'cat' || species === 'chat' || species === 'squirrel') {
      for (const sx of [-1, 1]) { const e = mesh(G.cone(0.06, 0.12, 8), fur, sx * 0.09, 0.14, 0); e.rotation.z = -sx * 0.25; this.head.add(e); }
    } else if (species === 'rabbit') {
      for (const sx of [-1, 1]) { const e = mesh(G.capsule(), fur, sx * 0.05, 0.2, -0.02); e.scale.set(0.05, 0.2, 0.04); this.head.add(e); }
    } else if (species === 'goat' || species === 'dragon') {
      for (const sx of [-1, 1]) { const e = mesh(G.cone(0.03, 0.16, 8), M(species === 'dragon' ? '#FFD166' : '#D9CBB5'), sx * 0.07, 0.15, -0.02); e.rotation.x = -0.4; this.head.add(e); }
      if (species === 'dragon') for (const sx of [-1, 1]) { const w = mesh(G.box(0.4, 0.02, 0.22, 0.01), M('#B5179E', { opacity: 0.85, transparent: true }), sx * 0.25, 0.48, -0.05); w.rotation.z = sx * 0.5; this.body.add(w); }
    } else {
      for (const sx of [-1, 1]) { const e = mesh(G.sphere(10), fur, sx * 0.14, 0.02, -0.02); e.scale.set(0.05, 0.11, 0.07); e.rotation.z = sx * 0.2; this.head.add(e); }
    }
    this.body.add(this.head);
    const tail = mesh(G.capsule(), fur, 0, 0.42, -0.3);
    tail.scale.set(0.05, species === 'cat' || species === 'chat' ? 0.3 : 0.18, 0.05);
    tail.rotation.x = -0.8;
    this.tail = tail;
    this.body.add(tail);
  }

  hop() { this.hopT = 0.5; }

  update(dt: number, t: number) {
    const tt = t + this.phase;
    if (this.tail) this.tail.rotation.z = Math.sin(tt * 8) * 0.5;
    this.head.rotation.y = Math.sin(tt * 0.7) * 0.4;
    this.head.rotation.x = Math.sin(tt * 1.1) * 0.08;
    let y = Math.abs(Math.sin(tt * 1.6)) * 0.015;
    if (this.hopT > 0) { this.hopT -= dt; y += Math.sin((1 - this.hopT / 0.5) * Math.PI) * 0.25; }
    this.body.position.y = y;
    this.root.rotation.y = Math.sin(tt * 0.25) * 0.6;
  }

  dispose() { this.root.removeFromParent(); }
}
