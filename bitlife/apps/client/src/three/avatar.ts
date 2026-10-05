// Procedural "vinyl toy" character: ages, changes outfit, hair, expression; procedural animation.
import * as THREE from 'three';
import type { Appearance, Gender, Mood } from '@bl/sim';
import { G, M, mesh, blobShadow, emojiTexture } from './kit.ts';

export const SKIN = ['#FFE6D6', '#F8D1B7', '#EDBC98', '#D8A27C', '#BE8461', '#9D6646', '#7B4B31', '#593522'];
export const HAIR = ['#2A1D16', '#4B301F', '#7B4D2B', '#A3562D', '#E9C47C', '#C9592E', '#A7A7AE', '#F3F2EF'];
const EYES = ['#2E2019', '#2F4F7A', '#2F5E3A', '#5A3F26', '#3E4A57'];
const SHIRTS = ['#FF7A7A', '#FFB84D', '#6CCB8E', '#5AA9FF', '#A98BFF', '#FF8FC7', '#3DC5C1', '#FFD95A', '#F2F2F2', '#556070'];
const PANTS = ['#3D4A6B', '#5B6FA8', '#6D5845', '#2E3440', '#8A6FB0', '#4B7D6B'];
const MOUTH = '#5A2A2E';

export interface AvatarSpec {
  gender: Gender;
  age: number;
  app: Appearance;
  outfit?: string;     // work outfit colour
  backpack?: boolean;
  ghost?: boolean;
}

interface Prop { height: number; head: number; legH: number; torsoH: number; torsoW: number; armL: number }
const KEYS: [number, Prop][] = [
  [0, { height: 0.62, head: 0.25, legH: 0.12, torsoH: 0.2, torsoW: 0.2, armL: 0.16 }],
  [3, { height: 0.86, head: 0.27, legH: 0.22, torsoH: 0.26, torsoW: 0.21, armL: 0.22 }],
  [7, { height: 1.05, head: 0.285, legH: 0.32, torsoH: 0.32, torsoW: 0.23, armL: 0.29 }],
  [13, { height: 1.3, head: 0.3, legH: 0.45, torsoH: 0.4, torsoW: 0.26, armL: 0.37 }],
  [18, { height: 1.52, head: 0.31, legH: 0.55, torsoH: 0.47, torsoW: 0.29, armL: 0.43 }],
  [45, { height: 1.53, head: 0.31, legH: 0.55, torsoH: 0.48, torsoW: 0.31, armL: 0.43 }],
  [80, { height: 1.45, head: 0.305, legH: 0.5, torsoH: 0.45, torsoW: 0.3, armL: 0.41 }],
];

function proportions(age: number): Prop {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [a0, p0] = KEYS[i];
    const [a1, p1] = KEYS[i + 1];
    if (age <= a1) {
      const t = Math.max(0, (age - a0) / (a1 - a0));
      const o = {} as Prop;
      for (const k of Object.keys(p0) as (keyof Prop)[]) o[k] = p0[k] + (p1[k] - p0[k]) * t;
      return o;
    }
  }
  return KEYS[KEYS.length - 1][1];
}

/** Hair colour with greying by age. */
export function hairColor(app: Appearance, age: number): THREE.Color {
  const base = new THREE.Color(HAIR[Math.min(app.hair, 5)]);
  if (age > 42) base.lerp(new THREE.Color(HAIR[6]), Math.min(1, (age - 42) / 25));
  if (age > 66) base.lerp(new THREE.Color(HAIR[7]), Math.min(1, (age - 66) / 15));
  return base;
}

type MouthKind = 'smile' | 'grin' | 'frown' | 'o' | 'flat';

export class Avatar {
  readonly root = new THREE.Group();
  private body = new THREE.Group();
  private headPivot = new THREE.Group();
  private head = new THREE.Group();
  private hair = new THREE.Group();
  private face = new THREE.Group();
  private eyes: THREE.Group[] = [];
  private brows: THREE.Mesh[] = [];
  private mouths = new Map<MouthKind, THREE.Object3D>();
  private armL = new THREE.Group();
  private armR = new THREE.Group();
  private legL: THREE.Mesh;
  private legR: THREE.Mesh;
  private shoeL: THREE.Mesh;
  private shoeR: THREE.Mesh;
  private torso: THREE.Mesh;
  private handL: THREE.Mesh;
  private handR: THREE.Mesh;
  private shadow: THREE.Mesh;
  private skinMat: THREE.MeshPhysicalMaterial;
  private shirtMat: THREE.MeshPhysicalMaterial;
  private pantsMat: THREE.MeshStandardMaterial;
  private hairMat: THREE.MeshPhysicalMaterial;
  private cheekMat: THREE.MeshStandardMaterial;
  private eyeMat: THREE.MeshPhysicalMaterial;
  private extras = new THREE.Group();
  private particles: { s: THREE.Sprite; v: THREE.Vector3; life: number; max: number }[] = [];
  private particleRoot = new THREE.Group();
  private p: Prop = proportions(20);
  mood: Mood = 'neutral';
  private moodT = 0;
  private blinkT = 2;
  private emitT = 0;
  private phase = Math.random() * 10;
  private spec!: AvatarSpec;
  /** One-shot animation (hop, spin) */
  private action: { kind: 'hop' | 'spin' | 'celebrate'; t: number } | null = null;
  lookAtTarget: THREE.Vector3 | null = null;

  constructor(spec: AvatarSpec) {
    this.skinMat = new THREE.MeshPhysicalMaterial({ roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.6, sheen: 0.3, sheenColor: new THREE.Color('#ffd0c0') });
    this.shirtMat = new THREE.MeshPhysicalMaterial({ roughness: 0.75, sheen: 0.4, sheenColor: new THREE.Color('#ffffff') });
    this.pantsMat = new THREE.MeshStandardMaterial({ roughness: 0.8 });
    this.hairMat = new THREE.MeshPhysicalMaterial({ roughness: 0.5, clearcoat: 0.5, clearcoatRoughness: 0.4 });
    this.cheekMat = new THREE.MeshStandardMaterial({ color: '#FF8A9A', transparent: true, opacity: 0.45, roughness: 1, depthWrite: false });
    this.eyeMat = new THREE.MeshPhysicalMaterial({ roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 });
    const shoeMat = M('#3a2f3a', { rough: 0.5 });

    this.shadow = blobShadow(0.45, 0.4);
    this.root.add(this.shadow);
    this.root.add(this.body);
    this.root.add(this.particleRoot);

    this.legL = mesh(G.capsule(), this.pantsMat);
    this.legR = mesh(G.capsule(), this.pantsMat);
    this.shoeL = mesh(G.sphere(16), shoeMat);
    this.shoeR = mesh(G.sphere(16), shoeMat);
    this.torso = mesh(G.capsule(), this.shirtMat);
    this.handL = mesh(G.sphere(16), this.skinMat);
    this.handR = mesh(G.sphere(16), this.skinMat);
    const armMeshL = mesh(G.capsule(), this.shirtMat);
    const armMeshR = mesh(G.capsule(), this.shirtMat);
    armMeshL.name = armMeshR.name = 'arm';
    this.armL.add(armMeshL, this.handL);
    this.armR.add(armMeshR, this.handR);
    this.body.add(this.legL, this.legR, this.shoeL, this.shoeR, this.torso, this.armL, this.armR, this.headPivot, this.extras);
    this.headPivot.add(this.head);
    this.buildHead();
    this.head.add(this.hair, this.face);
    this.set(spec);
  }

  private buildHead() {
    const h = this.head;
    const skull = mesh(G.sphere(32), this.skinMat);
    skull.scale.set(1.04, 0.97, 0.98);
    h.add(skull);
    // ears
    for (const s of [-1, 1]) {
      const ear = mesh(G.sphere(16), this.skinMat, s * 0.98, -0.05, -0.02);
      ear.scale.set(0.16, 0.22, 0.14);
      h.add(ear);
    }
    const f = this.face;
    // eyes
    for (const s of [-1, 1]) {
      const eg = new THREE.Group();
      const ex = s * 0.36, ey = 0.02;
      eg.position.set(ex, ey, Math.sqrt(1 - ex * ex - ey * ey) * 0.98);
      eg.lookAt(new THREE.Vector3(ex * 3, ey * 3, 3));
      const ball = mesh(G.sphere(20), this.eyeMat, 0, 0, 0, false);
      ball.scale.set(0.15, 0.19, 0.08);
      const hl = mesh(G.sphere(10), M('#ffffff', { rough: 0.2, emissive: '#ffffff', ei: 0.6 }), 0.05, 0.07, 0.07, false);
      hl.scale.setScalar(0.045);
      const hl2 = mesh(G.sphere(8), M('#ffffff', { rough: 0.2, emissive: '#ffffff', ei: 0.6 }), -0.04, -0.06, 0.07, false);
      hl2.scale.setScalar(0.022);
      eg.add(ball, hl, hl2);
      f.add(eg);
      this.eyes.push(eg);
      const brow = mesh(G.capsule(), this.hairMat, ex * 1.02, 0.3, 0, false);
      brow.position.z = Math.sqrt(1 - brow.position.x ** 2 - 0.09) * 1.0;
      brow.scale.set(0.055, 0.2, 0.05);
      brow.rotation.z = Math.PI / 2;
      f.add(brow);
      this.brows.push(brow);
      const cheek = mesh(G.sphere(16), this.cheekMat, s * 0.56, -0.24, 0.76, false);
      cheek.scale.set(0.15, 0.09, 0.06);
      cheek.lookAt(new THREE.Vector3(s * 1.7, -0.6, 2.3));
      f.add(cheek);
    }
    const nose = mesh(G.sphere(12), this.skinMat, 0, -0.1, 0.99, false);
    nose.scale.set(0.085, 0.07, 0.07);
    f.add(nose);
    // mouths
    const mouthMat = M(MOUTH, { rough: 0.6 });
    const place = (o: THREE.Object3D, y: number) => {
      o.position.set(0, y, Math.sqrt(1 - y * y) * 0.985);
      o.rotation.x = -Math.asin(y) * 0.9;
      f.add(o);
    };
    const smile = mesh(G.torus(0.14, 0.032, Math.PI), mouthMat, 0, 0, 0, false);
    smile.rotation.z = Math.PI;
    const sg = new THREE.Group(); sg.add(smile); place(sg, -0.33);
    const grin = new THREE.Group();
    const gm = mesh(G.circle(0.17, Math.PI, Math.PI), mouthMat, 0, 0.02, 0, false);
    const tongue = mesh(G.circle(0.08, Math.PI, Math.PI), M('#FF7F8A'), 0, -0.06, 0.005, false);
    grin.add(gm, tongue); place(grin, -0.33);
    const frown = mesh(G.torus(0.12, 0.03, Math.PI), mouthMat, 0, -0.06, 0, false);
    const fg = new THREE.Group(); fg.add(frown); place(fg, -0.36);
    const o = mesh(G.sphere(16), mouthMat, 0, 0, 0, false);
    o.scale.set(0.08, 0.1, 0.04);
    const og = new THREE.Group(); og.add(o); place(og, -0.38);
    const flat = mesh(G.capsule(), mouthMat, 0, 0, 0, false);
    flat.scale.set(0.035, 0.18, 0.03); flat.rotation.z = Math.PI / 2;
    const flg = new THREE.Group(); flg.add(flat); place(flg, -0.36);
    this.mouths.set('smile', sg).set('grin', grin).set('frown', fg).set('o', og).set('flat', flg);
  }

  set(spec: AvatarSpec) {
    const prev = this.spec;
    this.spec = spec;
    const { app, age, gender } = spec;
    this.skinMat.color.set(SKIN[app.skin] ?? SKIN[2]);
    this.eyeMat.color.set(EYES[app.eyes] ?? EYES[0]);
    this.hairMat.color.copy(hairColor(app, age));
    const kid = age < 13;
    const shirt = spec.outfit ?? (age < 3 ? ['#FFD1E8', '#CDEBFF', '#FFF1B8', '#D7F5D0'][app.outfit % 4] : SHIRTS[app.outfit % SHIRTS.length]);
    this.shirtMat.color.set(shirt);
    this.pantsMat.color.set(age < 3 ? shirt : age > 65 ? '#6b6158' : PANTS[(app.outfit >> 3) % PANTS.length]);
    if (spec.ghost) {
      for (const m of [this.skinMat, this.shirtMat, this.pantsMat, this.hairMat]) { m.color.set('#ffffff'); m.transparent = true; m.opacity = 0.75; }
    }
    // Proportions
    const p = proportions(age);
    const hs = age >= 13 ? 0.93 + app.height * 0.14 : 1;
    const gw = gender === 'm' && age >= 13 ? 1.06 : 0.97;
    const wt = 0.82 + app.weight * 0.55;
    p.legH *= hs; p.torsoH *= hs; p.armL *= hs;
    p.torsoW *= gw * wt;
    this.p = p;
    const legR = Math.max(0.05, p.torsoW * 0.36);
    for (const [leg, shoe, s] of [[this.legL, this.shoeL, -1], [this.legR, this.shoeR, 1]] as const) {
      leg.scale.set(legR * 2, Math.max(0.02, p.legH - legR * 2), legR * 2);
      leg.position.set(s * p.torsoW * 0.45, p.legH / 2 + 0.04, 0);
      shoe.scale.set(legR * 1.15, legR * 0.75, legR * 1.6);
      shoe.position.set(s * p.torsoW * 0.45, legR * 0.6, legR * 0.35);
    }
    const tw = p.torsoW * 2;
    this.torso.scale.set(tw, Math.max(0.05, p.torsoH - tw * 0.5), tw * (0.75 + app.weight * 0.2));
    this.torso.position.set(0, p.legH + p.torsoH / 2, 0);
    const armR = Math.max(0.035, p.torsoW * 0.24);
    for (const [arm, hand, s] of [[this.armL, this.handL, -1], [this.armR, this.handR, 1]] as const) {
      arm.position.set(s * (p.torsoW + armR * 0.6), p.legH + p.torsoH - armR * 1.2, 0);
      const am = arm.getObjectByName('arm') as THREE.Mesh;
      am.scale.set(armR * 2, Math.max(0.02, p.armL - armR * 2), armR * 2);
      am.position.set(0, -p.armL / 2 + armR, 0);
      hand.scale.setScalar(armR * 1.25);
      hand.position.set(0, -p.armL + armR * 0.5, 0);
    }
    this.headPivot.position.set(0, p.legH + p.torsoH + p.head * 0.82, 0);
    this.head.scale.setScalar(p.head);
    this.shadow.scale.setScalar(Math.max(0.5, p.torsoW * 4.2));
    // Hair & extras rebuild only when needed
    const key = (s: AvatarSpec | undefined) => s && `${s.app.hairStyle}|${s.app.beard}|${s.app.glasses}|${Math.floor(s.age)}|${s.gender}|${s.backpack}`;
    if (key(prev) !== key(spec)) {
      this.buildHair(spec);
      this.buildExtras(spec);
    }
    // Face maturity: babies have huge eyes & round cheeks, adults smaller eyes and a longer face
    const mature = Math.max(0, Math.min(1, (age - 4) / 16));
    const eyeS = 1.12 - mature * 0.3;
    for (const e of this.eyes) e.userData.base = eyeS;
    this.head.children[0].scale.set(1.04 - mature * 0.04, 0.97 + mature * 0.08, 0.98);
    this.face.position.y = -mature * 0.04;
    const senior = age > 65;
    this.body.rotation.x = senior ? 0.06 : 0;
    this.cheekMat.opacity = kid ? 0.55 : 0.28;
  }

  private buildHair(spec: AvatarSpec) {
    this.hair.clear();
    const m = this.hairMat;
    const { app, age, gender } = spec;
    const add = (g: THREE.BufferGeometry, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0) => {
      const o = mesh(g, m, x, y, z);
      o.scale.set(sx, sy, sz);
      o.rotation.set(rx, ry, rz);
      this.hair.add(o);
      return o;
    };
    if (age < 2) {
      add(G.sphere(12), 0, 1.0, 0.15, 0.12, 0.22, 0.12, 0.4, 0, 0);
      add(G.sphere(12), 0.06, 1.12, 0.22, 0.08, 0.12, 0.08, 0.9, 0, -0.4);
      return;
    }
    let style = app.hairStyle;
    const balding = gender === 'm' && age > 58 && (style === 0 || style === 3 || style === 8) && app.outfit % 3 === 0;
    if (balding) {
      add(G.cap(1.06, Math.PI * 0.22, Math.PI * 0.42), 0, 0, -0.05, 1, 1, 1, -0.35);
      return;
    }
    const cap = (theta = Math.PI * 0.52, r = 1.08) => add(G.cap(r, theta), 0, 0.02, -0.04, 1, 1, 1, -0.38);
    switch (style) {
      case 0: cap(); add(G.sphere(16), 0, 0.72, 0.55, 0.75, 0.22, 0.4, 0.4); break; // short crop + fringe
      case 1: cap(Math.PI * 0.48); for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2; add(G.cone(0.22, 0.5, 8), Math.cos(a) * 0.45, 0.95, Math.sin(a) * 0.45 - 0.05, 1, 1, 1, Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6); } add(G.cone(0.25, 0.6, 8), 0, 1.1, 0); break;
      case 2: cap(Math.PI * 0.58, 1.1); add(G.sphere(16), 0, 0.6, 0.62, 0.95, 0.32, 0.45, 0.3); break; // bowl
      case 3: cap(); add(G.sphere(16), 0.32, 0.82, 0.48, 0.75, 0.26, 0.5, 0.5, 0.3, -0.3); break; // side part
      case 4: cap(Math.PI * 0.56, 1.1); add(G.box(1.95, 1.7, 0.55, 0.25), 0, -0.55, -0.55); add(G.sphere(16), 0, 0.66, 0.6, 0.9, 0.28, 0.42, 0.35); break; // long
      case 5: cap(Math.PI * 0.55); add(G.sphere(16), 0, 0.25, -1.05, 0.32, 0.32, 0.32); add(G.capsule(), 0, -0.35, -1.12, 0.38, 0.9, 0.38, 0.15); add(G.sphere(16), 0, 0.66, 0.6, 0.85, 0.25, 0.4, 0.35); break; // ponytail
      case 6: cap(Math.PI * 0.55); add(G.sphere(16), 0, 1.08, -0.25, 0.42, 0.38, 0.42); add(G.sphere(16), 0, 0.66, 0.6, 0.85, 0.25, 0.4, 0.35); break; // bun
      case 7: { // curly / afro
        add(G.sphere(20), 0, 0.3, -0.1, 1.28, 1.15, 1.22);
        for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; add(G.sphere(12), Math.cos(a) * 1.1, 0.55 + Math.sin(i * 1.7) * 0.15, Math.sin(a) * 1.05 - 0.12, 0.4, 0.4, 0.4); }
        break;
      }
      case 8: add(G.cap(1.03, Math.PI * 0.5), 0, 0.02, -0.03, 1, 1, 1, -0.35); break; // buzz
      case 9: cap(Math.PI * 0.56, 1.1); for (const s of [-1, 1]) add(G.box(0.4, 1.1, 1.1, 0.18), s * 0.96, -0.3, -0.12); add(G.sphere(16), 0, 0.66, 0.6, 0.9, 0.28, 0.42, 0.35); break; // bob
      default: cap();
    }
    // the face region must stay visible: hair children are behind/above it by construction
    void style;
  }

  private buildExtras(spec: AvatarSpec) {
    this.extras.clear();
    for (const c of [...this.head.children]) if (c.name === 'acc') this.head.remove(c);
    const { app, age, gender } = spec;
    if (gender === 'm' && age >= 18 && app.beard) {
      const bm = this.hairMat;
      if (app.beard === 1) {
        const st = mesh(G.cap(1.015, Math.PI * 0.35, Math.PI * 0.55), M('#3a2a20', { opacity: 0.25, transparent: true, rough: 1 }), 0, 0, 0, false);
        st.rotation.x = 0.35; st.name = 'acc';
        this.head.add(st);
      } else if (app.beard === 2) {
        const b = mesh(G.cap(1.05, Math.PI * 0.38, Math.PI * 0.55), bm, 0, 0, 0.02);
        b.rotation.x = 0.4; b.name = 'acc';
        const chin = mesh(G.sphere(16), bm, 0, -0.78, 0.55); chin.scale.set(0.45, 0.3, 0.3); chin.name = 'acc';
        this.head.add(b, chin);
      } else {
        const mu = mesh(G.capsule(), bm, 0, -0.2, 0.97); mu.scale.set(0.08, 0.32, 0.07); mu.rotation.z = Math.PI / 2; mu.name = 'acc';
        this.head.add(mu);
      }
    }
    if (app.glasses || age > 68) {
      const g = new THREE.Group(); g.name = 'acc';
      const fm = M('#2b2b33', { rough: 0.3, metal: 0.4 });
      for (const s of [-1, 1]) {
        const r = mesh(G.torus(0.21, 0.03), fm, s * 0.36, 0.02, 1.0, false);
        g.add(r);
      }
      const br = mesh(G.capsule(), fm, 0, 0.06, 1.02, false); br.scale.set(0.03, 0.22, 0.03); br.rotation.z = Math.PI / 2;
      g.add(br);
      this.head.add(g);
    }
    if (spec.backpack && age >= 4 && age < 25) {
      const p = this.p;
      const bp = mesh(G.box(p.torsoW * 1.6, p.torsoH * 0.8, p.torsoW * 0.8, 0.06), M(['#FF6B6B', '#4D96FF', '#6BCB77', '#FFD93D'][app.outfit % 4]), 0, p.legH + p.torsoH * 0.55, -p.torsoW * 0.95);
      this.extras.add(bp);
    }
    if (age > 74) {
      const p = this.p;
      const cane = mesh(G.cyl(0.018, 0.018, p.legH + p.torsoH * 0.6, 8), M('#7a4f2a', { rough: 0.5 }), p.torsoW + 0.18, (p.legH + p.torsoH * 0.6) / 2, 0.12);
      this.extras.add(cane);
    }
  }

  setMood(m: Mood) {
    if (m === this.mood) return;
    this.mood = m;
    this.moodT = 0;
    this.emitT = 0;
  }

  play(kind: 'hop' | 'spin' | 'celebrate') { this.action = { kind, t: 0 }; }

  private mouthFor(m: Mood): MouthKind {
    switch (m) {
      case 'happy': case 'party': case 'proud': return 'grin';
      case 'love': return 'smile';
      case 'sad': case 'cry': case 'sick': return 'frown';
      case 'shock': return 'o';
      case 'angry': return 'frown';
      case 'sleepy': return 'flat';
      default: return 'smile';
    }
  }

  private emit(emoji: string, count = 1, spread = 0.3, up = 0.6) {
    for (let i = 0; i < count; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: emojiTexture(emoji), transparent: true, depthWrite: false }));
      const top = this.p.legH + this.p.torsoH + this.p.head * 1.8;
      s.position.set((Math.random() - 0.5) * spread, top, (Math.random() - 0.5) * spread * 0.5 + 0.1);
      s.scale.setScalar(0.22);
      this.particleRoot.add(s);
      this.particles.push({ s, v: new THREE.Vector3((Math.random() - 0.5) * 0.3, up * (0.7 + Math.random() * 0.6), 0), life: 0, max: 1.6 });
    }
  }

  update(dt: number, t: number) {
    const tt = t + this.phase;
    this.moodT += dt;
    const m = this.mood;
    // Breathing & idle
    const breath = Math.sin(tt * 2.2) * 0.012;
    this.torso.scale.y *= 1; // scale set in set(); apply breath on body
    this.body.scale.set(1 - breath * 0.5, 1 + breath, 1 - breath * 0.5);
    this.headPivot.rotation.z = Math.sin(tt * 0.9) * 0.05;
    this.headPivot.rotation.x = Math.sin(tt * 0.7) * 0.03;
    this.headPivot.rotation.y = 0;
    // Arms default
    let armA = 0.12 + Math.sin(tt * 1.3) * 0.03;
    let armZ = 0;
    let bodyY = 0;
    let bodyRotY = 0;
    let shake = 0;
    switch (m) {
      case 'happy': bodyY = Math.max(0, Math.sin(tt * 7)) * 0.06; armA = 0.4 + Math.sin(tt * 7) * 0.2; break;
      case 'party': bodyY = Math.abs(Math.sin(tt * 6)) * 0.08; armA = 2.6 + Math.sin(tt * 6) * 0.35; bodyRotY = Math.sin(tt * 3) * 0.4; break;
      case 'proud': armA = 0.7; armZ = 1; this.headPivot.rotation.x = -0.12; break;
      case 'love': bodyRotY = Math.sin(tt * 2) * 0.15; armA = 0.25; break;
      case 'sad': case 'cry': this.headPivot.rotation.x = 0.22; armA = 0.05; break;
      case 'shock': armA = 1.9 + Math.sin(tt * 20) * 0.05; bodyY = this.moodT < 0.3 ? Math.sin(this.moodT / 0.3 * Math.PI) * 0.15 : 0; break;
      case 'angry': shake = Math.sin(tt * 40) * 0.015; armA = 0.5; armZ = 0.6; break;
      case 'sleepy': this.headPivot.rotation.z = 0.25 + Math.sin(tt * 0.8) * 0.06; this.headPivot.rotation.x = 0.15; break;
      case 'sick': this.headPivot.rotation.z = Math.sin(tt * 1.2) * 0.12; break;
    }
    // Look at a target (camera) with the head
    if (this.lookAtTarget && m !== 'sad' && m !== 'sleepy') {
      const wp = this.root.getWorldPosition(_v);
      const dx = this.lookAtTarget.x - wp.x, dz = this.lookAtTarget.z - wp.z;
      const yaw = Math.atan2(dx, dz) - this.root.rotation.y;
      this.headPivot.rotation.y = Math.max(-0.6, Math.min(0.6, Math.atan2(Math.sin(yaw), Math.cos(yaw)))) * 0.7;
    }
    // One-shot actions
    if (this.action) {
      const a = this.action;
      a.t += dt;
      if (a.kind === 'hop') { bodyY += Math.sin(Math.min(1, a.t / 0.45) * Math.PI) * 0.35; if (a.t > 0.45) this.action = null; }
      else if (a.kind === 'spin') { bodyRotY += Math.min(1, a.t / 0.8) * Math.PI * 2; bodyY += Math.sin(Math.min(1, a.t / 0.8) * Math.PI) * 0.25; if (a.t > 0.8) this.action = null; }
      else if (a.kind === 'celebrate') { bodyY += Math.abs(Math.sin(a.t * 9)) * 0.2; armA = 2.7; if (a.t > 1.4) this.action = null; }
    }
    this.armL.rotation.z = -armA * (armZ ? 0.5 : 1);
    this.armR.rotation.z = armA * (armZ ? 0.5 : 1);
    this.armL.rotation.x = armZ ? -0.6 : 0;
    this.armR.rotation.x = armZ ? -0.6 : 0;
    this.body.position.set(shake, bodyY, 0);
    this.body.rotation.y = bodyRotY;
    this.shadow.material instanceof THREE.MeshBasicMaterial && (this.shadow.material.opacity = 0.4 - bodyY * 0.6);
    // Face
    const mk = this.mouthFor(m);
    for (const [k, o] of this.mouths) o.visible = k === mk;
    this.blinkT -= dt;
    let eyeY = m === 'sleepy' ? 0.25 : m === 'shock' ? 1.25 : m === 'happy' || m === 'party' ? 0.85 : 1;
    if (this.blinkT < 0) { eyeY = 0.1; if (this.blinkT < -0.12) this.blinkT = 2 + Math.random() * 3; }
    for (const e of this.eyes) { const b = (e.userData.base as number) ?? 1; e.scale.set(b * (m === 'shock' ? 1.15 : 1), b * eyeY, b); }
    const browTilt = m === 'angry' ? 0.45 : m === 'sad' || m === 'cry' ? -0.4 : m === 'shock' ? 0 : 0.05;
    const browY = m === 'shock' ? 0.4 : m === 'angry' ? 0.27 : 0.32;
    this.brows.forEach((b, i) => { const s = i === 0 ? -1 : 1; b.rotation.z = Math.PI / 2 + s * browTilt; b.position.y = browY; });
    // Particles
    this.emitT -= dt;
    if (this.emitT <= 0) {
      const map: Partial<Record<Mood, [string, number]>> = { love: ['❤️', 0.5], cry: ['💧', 0.25], sad: ['💧', 0.9], sleepy: ['💤', 1.2], angry: ['💢', 0.7], party: ['🎉', 0.45], proud: ['✨', 0.6], sick: ['🤢', 2.5], happy: ['✨', 1.4] };
      const e = map[m];
      if (e) { this.emit(e[0], 1, m === 'cry' || m === 'sad' ? 0.25 : 0.5, m === 'cry' || m === 'sad' ? -0.4 : 0.6); this.emitT = e[1]; }
      else this.emitT = 1;
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      p.s.position.addScaledVector(p.v, dt);
      const k = p.life / p.max;
      (p.s.material as THREE.SpriteMaterial).opacity = k < 0.2 ? k * 5 : 1 - (k - 0.2) / 0.8;
      p.s.scale.setScalar(0.18 + k * 0.1);
      if (p.life > p.max) {
        this.particleRoot.remove(p.s);
        (p.s.material as THREE.SpriteMaterial).dispose();
        this.particles.splice(i, 1);
      }
    }
  }

  get height() { return this.p.legH + this.p.torsoH + this.p.head * 1.8; }

  dispose() {
    for (const m of [this.skinMat, this.shirtMat, this.pantsMat, this.hairMat, this.cheekMat, this.eyeMat]) m.dispose();
    for (const p of this.particles) (p.s.material as THREE.SpriteMaterial).dispose();
    this.root.removeFromParent();
  }
}

const _v = new THREE.Vector3();
