/** Growable geometry buffers used by the tile worker (no three.js dependency). */
export class FloatBuf {
  a: Float32Array;
  n = 0;
  constructor(cap = 1024) { this.a = new Float32Array(cap); }
  push1(x: number): void { if (this.n + 1 > this.a.length) this.grow(1); this.a[this.n++] = x; }
  push2(x: number, y: number): void { if (this.n + 2 > this.a.length) this.grow(2); this.a[this.n++] = x; this.a[this.n++] = y; }
  push3(x: number, y: number, z: number): void { if (this.n + 3 > this.a.length) this.grow(3); const a = this.a; a[this.n++] = x; a[this.n++] = y; a[this.n++] = z; }
  push4(x: number, y: number, z: number, w: number): void { if (this.n + 4 > this.a.length) this.grow(4); const a = this.a; a[this.n++] = x; a[this.n++] = y; a[this.n++] = z; a[this.n++] = w; }
  private grow(k: number): void { const b = new Float32Array(Math.max(this.a.length * 2, this.n + k + 16)); b.set(this.a.subarray(0, this.n)); this.a = b; }
  result(): Float32Array { return this.a.slice(0, this.n); }
}
export class IndexBuf {
  a: Uint32Array;
  n = 0;
  constructor(cap = 1024) { this.a = new Uint32Array(cap); }
  push3(a: number, b: number, c: number): void {
    if (this.n + 3 > this.a.length) { const nb = new Uint32Array(this.a.length * 2 + 16); nb.set(this.a.subarray(0, this.n)); this.a = nb; }
    this.a[this.n++] = a; this.a[this.n++] = b; this.a[this.n++] = c;
  }
  result(): Uint32Array { return this.a.slice(0, this.n); }
}

export interface GeoData {
  position: Float32Array;
  normal: Float32Array;
  index: Uint32Array;
  attrs: Record<string, { array: Float32Array; itemSize: number }>;
}

/** Mesh builder with position/normal + any number of custom float attributes. */
export class MeshBuilder {
  pos = new FloatBuf(); nor = new FloatBuf(); idx = new IndexBuf();
  attrs: Record<string, { buf: FloatBuf; size: number }> = {};
  constructor(attrDefs: Record<string, number> = {}) {
    for (const k of Object.keys(attrDefs)) this.attrs[k] = { buf: new FloatBuf(), size: attrDefs[k] };
  }
  get vertexCount(): number { return this.pos.n / 3; }
  /** Add vertex; `a` is a flat list of attribute values in the order of attrDefs. */
  v(x: number, y: number, z: number, nx: number, ny: number, nz: number, ...a: number[]): number {
    const i = this.pos.n / 3;
    this.pos.push3(x, y, z); this.nor.push3(nx, ny, nz);
    let k = 0;
    for (const name in this.attrs) {
      const at = this.attrs[name];
      for (let c = 0; c < at.size; c++) at.buf.push1(a[k++] ?? 0);
    }
    return i;
  }
  tri(a: number, b: number, c: number): void { this.idx.push3(a, b, c); }
  /** Triangle with winding chosen so that its geometric normal agrees with (nx,ny,nz). */
  triFacing(a: number, b: number, c: number, nx: number, ny: number, nz: number): void {
    const p = this.pos.a;
    const ax = p[a * 3], ay = p[a * 3 + 1], az = p[a * 3 + 2];
    const ux = p[b * 3] - ax, uy = p[b * 3 + 1] - ay, uz = p[b * 3 + 2] - az;
    const vx = p[c * 3] - ax, vy = p[c * 3 + 1] - ay, vz = p[c * 3 + 2] - az;
    const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
    if (cx * nx + cy * ny + cz * nz >= 0) this.idx.push3(a, b, c); else this.idx.push3(a, c, b);
  }
  quadFacing(a: number, b: number, c: number, d: number, nx: number, ny: number, nz: number): void {
    // a-b-c-d around the quad
    this.triFacing(a, b, c, nx, ny, nz);
    this.triFacing(a, c, d, nx, ny, nz);
  }
  build(): GeoData | null {
    if (this.idx.n === 0) return null;
    const attrs: GeoData['attrs'] = {};
    for (const k in this.attrs) attrs[k] = { array: this.attrs[k].buf.result(), itemSize: this.attrs[k].size };
    return { position: this.pos.result(), normal: this.nor.result(), index: this.idx.result(), attrs };
  }
}

export function transferablesOf(g: GeoData | null, out: Transferable[]): void {
  if (!g) return;
  out.push(g.position.buffer, g.normal.buffer, g.index.buffer);
  for (const k in g.attrs) out.push(g.attrs[k].array.buffer);
}
