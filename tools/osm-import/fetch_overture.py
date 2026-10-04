#!/usr/bin/env python3
"""Fetch an area from the Overture Maps GeoParquet release (OSM-derived, ODbL) using HTTP range requests.

Usage: python3 fetch_overture.py <city-id>   (reads data/cities/<city>.json for bbox)
Writes tools/osm-import/cache/<city>/<theme>_<type>.parquet
Only row groups whose bbox statistics intersect the area are downloaded.
"""
import sys, re, json, os, concurrent.futures as cf
import requests, pyarrow as pa, pyarrow.parquet as pq, pyarrow.compute as pc
from httpfile import HttpFile

BASE = "https://overturemaps-us-west-2.s3.us-west-2.amazonaws.com/"
RELEASE = os.environ.get("OVERTURE_RELEASE", "release/2026-09-23.1")
LAYERS = {
    ("transportation", "segment"): ["id", "names", "class", "subclass", "subtype", "connectors", "road_surface", "road_flags", "width_rules", "level_rules", "access_restrictions", "speed_limits", "geometry", "bbox"],
    ("transportation", "connector"): ["id", "geometry", "bbox"],
    ("buildings", "building"): ["id", "names", "height", "num_floors", "min_height", "roof_shape", "roof_height", "class", "subtype", "facade_color", "roof_color", "facade_material", "roof_material", "is_underground", "geometry", "bbox"],
    ("buildings", "building_part"): ["id", "building_id", "height", "num_floors", "min_height", "min_floor", "roof_shape", "roof_height", "geometry", "bbox"],
    ("base", "water"): ["id", "names", "class", "subtype", "is_salt", "is_intermittent", "geometry", "bbox"],
    ("base", "land_use"): ["id", "names", "class", "subtype", "geometry", "bbox"],
    ("base", "land"): ["id", "class", "subtype", "geometry", "bbox"],
    ("base", "infrastructure"): ["id", "names", "class", "subtype", "geometry", "bbox"],
    ("places", "place"): ["id", "names", "basic_category", "taxonomy", "addresses", "confidence", "operating_status", "geometry", "bbox"],
}

def list_keys(prefix):
    keys, token = [], None
    while True:
        u = BASE + "?list-type=2&prefix=" + prefix + (f"&continuation-token={requests.utils.quote(token)}" if token else "")
        x = requests.get(u, timeout=60).text
        keys += [k for k in re.findall(r"<Key>([^<]*)</Key>", x) if k.endswith(".parquet") or "part-" in k]
        m = re.search(r"<NextContinuationToken>([^<]*)</NextContinuationToken>", x)
        if not m: return keys
        token = m.group(1)

def stat_range(rg, name):
    for i in range(rg.num_columns):
        c = rg.column(i)
        if c.path_in_schema == name and c.statistics is not None and c.statistics.has_min_max:
            return c.statistics.min, c.statistics.max
    return None

def process_file(key, bb, cols):
    f = HttpFile(BASE + key, block=512 * 1024)
    p = pq.ParquetFile(f)
    md = p.metadata
    hits = []
    for i in range(md.num_row_groups):
        rg = md.row_group(i)
        xmin, xmax = stat_range(rg, "bbox.xmin"), stat_range(rg, "bbox.xmax")
        ymin, ymax = stat_range(rg, "bbox.ymin"), stat_range(rg, "bbox.ymax")
        if None in (xmin, xmax, ymin, ymax): hits.append(i); continue
        # row group contains features with xmin in [xmin.min,xmin.max] etc.
        if xmin[0] > bb[2] or xmax[1] < bb[0] or ymin[0] > bb[3] or ymax[1] < bb[1]: continue
        hits.append(i)
    if not hits: return None, f.bytes_fetched
    names = set(p.schema_arrow.names)
    use = [c for c in cols if c in names]
    f.block = 4 << 20
    t = p.read_row_groups(hits, columns=use)
    b = t.column("bbox")
    m = pc.and_(pc.and_(pc.less_equal(pc.struct_field(b, "xmin"), bb[2]), pc.greater_equal(pc.struct_field(b, "xmax"), bb[0])),
                pc.and_(pc.less_equal(pc.struct_field(b, "ymin"), bb[3]), pc.greater_equal(pc.struct_field(b, "ymax"), bb[1])))
    t = t.filter(m)
    return (t if t.num_rows else None), f.bytes_fetched

def main():
    city = sys.argv[1]
    root = os.path.dirname(os.path.abspath(__file__))
    cfg = json.load(open(os.path.join(root, "..", "..", "data", "cities", city + ".json")))
    bb = cfg["import"]["bbox"]  # [west, south, east, north]
    only = sys.argv[2:] or None
    out = os.path.join(root, "cache", city); os.makedirs(out, exist_ok=True)
    for (theme, typ), cols in LAYERS.items():
        if only and typ not in only: continue
        dst = os.path.join(out, f"{theme}_{typ}.parquet")
        if os.path.exists(dst): print("skip", dst); continue
        keys = list_keys(f"{RELEASE}/theme={theme}/type={typ}/")
        tables, total = [], 0
        with cf.ThreadPoolExecutor(8) as ex:
            for t, nb in ex.map(lambda k: process_file(k, bb, cols), keys):
                total += nb
                if t is not None: tables.append(t)
        if tables:
            t = pa.concat_tables(tables, promote_options="permissive")
            pq.write_table(t, dst)
            print(f"{theme}/{typ}: {t.num_rows} features, {total/1e6:.1f} MB fetched")
        else:
            print(f"{theme}/{typ}: nothing")

if __name__ == "__main__":
    main()
