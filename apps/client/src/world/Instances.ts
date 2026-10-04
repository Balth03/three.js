import * as THREE from 'three';
import * as P from './props';

interface KindDef {
  kinds: string[];
  meshes: THREE.InstancedMesh[];
  capacity: number;
  shadow: boolean;
  yOffset?: number;
}

/**
 * Global instanced meshes for trees & street furniture. Tiles contribute arrays [x,y,z,rot,scale,variant] (tile-local),
 * the manager concatenates them into world-space instances when the set of loaded tiles changes (or the focus moves, for tree LOD).
 */
export class Instances {
  readonly group = new THREE.Group();
  private tiles = new Map<string, { ox: number; oz: number; data: Record<string, Float32Array> }>();
  private dirty = true;
  private lastFocus = new THREE.Vector3(1e9, 0, 0);
  private treeNear: THREE.InstancedMesh[];
  private treeFar: THREE.InstancedMesh[];
  private defs: KindDef[] = [];
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private s = new THREE.Vector3();
  private p = new THREE.Vector3();
  private col = new THREE.Color();
  treeDetailDistance = 150;
  readonly lampPositions: number[] = [];

  constructor(private shadows: boolean, msaa = 0) {
    const near = P.treeGeometry('near'), far = P.treeGeometry('far');
    const trunkMat = P.trunkMaterial(), crownMat = P.crownMaterial(msaa > 0);
    const mk = (g: THREE.BufferGeometry, m: THREE.Material, cap: number, shadow: boolean) => {
      const im = new THREE.InstancedMesh(g, m, cap);
      im.count = 0; im.frustumCulled = false; im.castShadow = shadow && this.shadows; im.receiveShadow = true;
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      this.group.add(im);
      return im;
    };
    this.treeNear = [mk(near.trunk, trunkMat, 1500, true), mk(near.crown, crownMat, 1500, true)];
    this.treeFar = [mk(far.trunk, trunkMat, 9000, false), mk(far.crown, crownMat, 9000, true)];
    this.treeNear[1].instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(1500 * 3), 3);
    this.treeFar[1].instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(9000 * 3), 3);
    const propMat = P.propMaterial('street');
    const add = (kinds: string[], geo: THREE.BufferGeometry, cap: number, shadow: boolean, mat: THREE.Material = propMat) => {
      this.defs.push({ kinds, meshes: [mk(geo, mat, cap, shadow)], capacity: cap, shadow });
    };
    add(['lamp'], P.lampGeometry(), 3000, true);
    add(['signal'], P.signalGeometry(), 1500, true, P.signalMaterial());
    add(['bench'], P.benchGeometry(), 2500, false);
    add(['bollard'], P.bollardGeometry(), 1500, false);
    add(['busstop'], P.busStopGeometry(), 500, true);
    add(['wallace', 'fountain'], P.wallaceGeometry(), 300, true);
    add(['bin'], P.binGeometry(), 1500, false);
    add(['postbox'], P.postboxGeometry(), 400, false);
  }

  addTile(key: string, ox: number, oz: number, data: Record<string, Float32Array>): void {
    this.tiles.set(key, { ox, oz, data });
    this.dirty = true;
  }
  removeTile(key: string): void {
    if (this.tiles.delete(key)) this.dirty = true;
  }

  update(focus: THREE.Vector3): void {
    if (!this.dirty && focus.distanceToSquared(this.lastFocus) < 30 * 30) return;
    this.dirty = false;
    this.lastFocus.copy(focus);
    const near2 = this.treeDetailDistance * this.treeDetailDistance;
    let nn = 0, nf = 0;
    const [nT, nC] = this.treeNear, [fT, fC] = this.treeFar;
    for (const t of this.tiles.values()) {
      const tr = t.data.trees;
      if (!tr) continue;
      for (let k = 0; k < tr.length; k += 6) {
        const x = tr[k] + t.ox, y = tr[k + 1], z = tr[k + 2] + t.oz;
        const s = tr[k + 4];
        this.p.set(x, y, z);
        this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, tr[k + 3]);
        this.s.set(s, s * (0.9 + (tr[k + 5] % 2) * 0.2), s);
        this.m.compose(this.p, this.q, this.s);
        const v = tr[k + 5];
        this.col.setRGB(0.85 + v * 0.06, 0.95 + (3 - v) * 0.03, 0.85 + (v % 2) * 0.1);
        const dx = x - focus.x, dz = z - focus.z;
        if (dx * dx + dz * dz < near2 && nn < 1500) {
          nT.setMatrixAt(nn, this.m); nC.setMatrixAt(nn, this.m); nC.setColorAt(nn, this.col); nn++;
        } else if (nf < 9000) {
          fT.setMatrixAt(nf, this.m); fC.setMatrixAt(nf, this.m); fC.setColorAt(nf, this.col); nf++;
        }
      }
    }
    nT.count = nC.count = nn; fT.count = fC.count = nf;
    for (const im of [nT, nC, fT, fC]) { im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; }
    // street furniture
    this.lampPositions.length = 0;
    for (const def of this.defs) {
      let n = 0;
      const im = def.meshes[0];
      for (const t of this.tiles.values()) {
        for (const kind of def.kinds) {
          const arr = t.data[kind];
          if (!arr) continue;
          for (let k = 0; k < arr.length && n < def.capacity; k += 6) {
            this.p.set(arr[k] + t.ox, arr[k + 1], arr[k + 2] + t.oz);
            this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, arr[k + 3]);
            const sc = arr[k + 4];
            // signals pack timing in the scale (see signalMaterial)
            this.s.set(sc, 1, kind === 'signal' ? (arr[k + 5] > 0.5 ? 1.002 : 1) : sc);
            this.m.compose(this.p, this.q, this.s);
            im.setMatrixAt(n++, this.m);
          }
        }
      }
      im.count = n;
      im.instanceMatrix.needsUpdate = true;
    }
  }
}
