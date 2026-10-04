import * as THREE from 'three';
import { createLandmark, type Landmark, type LandmarkModelId } from './landmarks/index';
import type { City } from './World';
import { GROUP, groups, yawQuat, type Physics } from '../physics/Physics';
import type { Environment } from '../render/Environment';

/** Places the parametric monuments at their real coordinates, with physics colliders and night lighting. */
export class Landmarks {
  readonly group = new THREE.Group();
  private items: Array<{ id: string; lm: Landmark; x: number; z: number; body: ReturnType<Physics['world']['createRigidBody']> | null; loaded: boolean }> = [];
  private elapsed = 0;

  constructor(private city: City, private physics: Physics, quality: 'low' | 'high') {
    for (const m of city.meta.landmarks) {
      let lm: Landmark;
      try { lm = createLandmark(m.model as LandmarkModelId, { quality }); } catch (e) { console.warn('landmark', m.id, e); continue; }
      // sit on the lowest terrain point of the footprint, buried slightly
      const box = new THREE.Box3().setFromObject(lm.object);
      let ymin = Infinity;
      const r = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) / 2;
      for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; ymin = Math.min(ymin, city.terrain.height(m.x + Math.cos(a) * r * 0.8, m.z + Math.sin(a) * r * 0.8)); }
      ymin = Math.min(ymin, city.terrain.height(m.x, m.z));
      lm.object.position.set(m.x, ymin - 0.05, m.z);
      lm.object.rotation.y = (-m.rot * Math.PI) / 180;
      lm.object.traverse((o) => { const mesh = o as THREE.Mesh; if (mesh.isMesh) { mesh.castShadow = true; mesh.receiveShadow = true; if ((mesh.material as THREE.Material).transparent) mesh.userData.cannotReceiveAO = true; } });
      this.group.add(lm.object);
      this.items.push({ id: m.id, lm, x: m.x, z: m.z, body: null, loaded: false });
    }
  }

  /** Create colliders when the player approaches (cheap: only a handful of boxes). */
  update(dt: number, env: Environment, focus: THREE.Vector3): void {
    this.elapsed += dt;
    for (const it of this.items) {
      it.lm.update(env.time, env.night, this.elapsed);
      const near = Math.hypot(focus.x - it.x, focus.z - it.z) < 600;
      if (near && !it.body) {
        const R = this.physics.R;
        const o = it.lm.object;
        const body = this.physics.world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(o.position.x, o.position.y, o.position.z).setRotation(yawQuat(o.rotation.y)));
        for (const c of it.lm.colliders) {
          this.physics.world.createCollider(R.ColliderDesc.cuboid(...c.halfExtents).setTranslation(...c.center).setRotation(yawQuat(c.rotationY)).setFriction(0.3)
            .setCollisionGroups(groups(GROUP.STATIC, GROUP.PLAYER | GROUP.TRAFFIC | GROUP.PROP)), body);
        }
        it.body = body;
      } else if (!near && it.body) {
        this.physics.world.removeRigidBody(it.body);
        it.body = null;
      }
    }
  }

  nearest(x: number, z: number): { id: string; dist: number } | null {
    let best: { id: string; dist: number } | null = null;
    for (const it of this.items) { const d = Math.hypot(x - it.x, z - it.z); if (!best || d < best.dist) best = { id: it.id, dist: d }; }
    return best;
  }
}
