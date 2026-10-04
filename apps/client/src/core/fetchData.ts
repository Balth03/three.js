/** Fetch a (possibly gzip-compressed) data file. Works whether or not the server sets Content-Encoding. */
export async function fetchBytes(url: string): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  if (buf.length > 2 && buf[0] === 0x1f && buf[1] === 0x8b) {
    const ds = new DecompressionStream('gzip');
    const stream = new Blob([buf]).stream().pipeThrough(ds);
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  return buf;
}
export async function fetchJson<T>(url: string): Promise<T> {
  const bytes = await fetchBytes(url);
  return JSON.parse(new TextDecoder().decode(bytes)) as T;
}
