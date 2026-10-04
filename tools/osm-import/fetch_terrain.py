#!/usr/bin/env python3
"""Download AWS Terrain Tiles (Terrarium encoding) covering a city's import bbox and store a mosaic.
Usage: python3 fetch_terrain.py <city-id> [zoom=15]
Output: cache/<city>/terrain_mosaic.npz  (heights float32 in metres + mercator pixel origin + zoom)
Attribution: terrain data from Mapzen/AWS Terrain Tiles (SRTM, EU-DEM, ... see https://github.com/tilezen/joerd/blob/master/docs/attribution.md)
"""
import sys, os, io, json, math, concurrent.futures as cf
import numpy as np, requests
from PIL import Image

URL = "https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png"

def lonlat_to_tile(lon, lat, z):
    n = 2 ** z
    x = (lon + 180) / 360 * n
    y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return x, y

def fetch(z, x, y):
    for a in range(5):
        try:
            r = requests.get(URL.format(z=z, x=x, y=y), timeout=60); r.raise_for_status()
            a = np.asarray(Image.open(io.BytesIO(r.content)).convert("RGB")).astype(np.float32)
            return a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
        except Exception:
            if a == 4: raise

def main():
    city = sys.argv[1]; z = int(sys.argv[2]) if len(sys.argv) > 2 else 15
    root = os.path.dirname(os.path.abspath(__file__))
    cfg = json.load(open(os.path.join(root, "..", "..", "data", "cities", city + ".json")))
    w, s, e, n = cfg["import"]["bbox"]
    x0, y0 = lonlat_to_tile(w, n, z); x1, y1 = lonlat_to_tile(e, s, z)
    tx0, ty0, tx1, ty1 = int(x0), int(y0), int(x1), int(y1)
    W, H = (tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256
    mosaic = np.zeros((H, W), np.float32)
    jobs = [(tx, ty) for tx in range(tx0, tx1 + 1) for ty in range(ty0, ty1 + 1)]
    with cf.ThreadPoolExecutor(12) as ex:
        for (tx, ty), h in zip(jobs, ex.map(lambda j: fetch(z, *j), jobs)):
            mosaic[(ty - ty0) * 256:(ty - ty0 + 1) * 256, (tx - tx0) * 256:(tx - tx0 + 1) * 256] = h
    out = os.path.join(root, "cache", city); os.makedirs(out, exist_ok=True)
    np.savez_compressed(os.path.join(out, "terrain_mosaic.npz"), h=mosaic, px0=tx0 * 256, py0=ty0 * 256, z=z)
    print(f"terrain {len(jobs)} tiles, {W}x{H}px, {mosaic.min():.1f}..{mosaic.max():.1f} m")

if __name__ == "__main__":
    main()
