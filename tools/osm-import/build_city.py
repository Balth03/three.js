#!/usr/bin/env python3
"""Build game-ready city data from the Overture (OSM) cache + terrain mosaic.

Usage: python3 build_city.py <city-id>
Input : data/cities/<city>.json, tools/osm-import/cache/<city>/*.parquet, terrain_mosaic.npz
Output: data/cities/<city>/meta.json, roads.json.gz, pois.json.gz, tiles/<i>_<j>.json.gz

Coordinates: local equirectangular metres around config origin. x = east, z = south, y = up.
Integers in output files are decimetres (dm) unless stated (terrain: centimetres).
"""
import sys, os, json, gzip, math, hashlib, time, collections
import numpy as np
import pyarrow.parquet as pq
import shapely
from shapely.geometry import Polygon, MultiPolygon, LineString, Point, box
from shapely.ops import substring
from shapely.strtree import STRtree
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(ROOT, "..", ".."))
TILE = 256.0
TERRAIN_STEP = 8.0  # m, per-tile terrain sampling (33x33)
GROUND_CELLS = 32   # per tile => 8 m cells

DRIVABLE = {"motorway", "trunk", "primary", "secondary", "tertiary", "residential", "unclassified", "living_street", "service"}
CLASS_CODE = {c: i for i, c in enumerate(["motorway", "trunk", "primary", "secondary", "tertiary", "residential", "unclassified", "living_street", "service"])}
PATH_KIND = {"pedestrian": 0, "footway": 1, "path": 2, "cycleway": 3, "steps": 4, "track": 2, "bridleway": 2}
BUILDING_CLASS = {None: 0, "apartments": 1, "residential": 1, "house": 2, "detached": 2, "semidetached_house": 2, "terrace": 2,
                  "office": 3, "commercial": 3, "retail": 4, "hotel": 5, "school": 6, "university": 6, "college": 6, "kindergarten": 6,
                  "church": 7, "cathedral": 7, "chapel": 7, "hospital": 8, "industrial": 9, "warehouse": 9, "service": 9,
                  "shed": 10, "roof": 11, "garage": 10, "garages": 10, "kiosk": 12, "train_station": 13, "transportation": 13,
                  "government": 14, "civic": 14, "public": 14, "museum": 15}
ROOF_CODE = {None: 0, "flat": 1, "gabled": 2, "hipped": 3, "mansard": 4, "dome": 5, "pyramidal": 6, "skillion": 7, "round": 8, "onion": 5, "gambrel": 4}
LANDUSE_KIND = {"grass": 1, "park": 1, "garden": 1, "village_green": 1, "dog_park": 1, "recreation_ground": 1, "meadow": 1, "golf": 1, "green": 1,
                "flowerbed": 2, "pitch": 3, "playground": 4, "pedestrian": 5, "plaza": 5, "cemetery": 6, "track": 7, "construction": 8,
                "allotments": 2, "schoolyard": 5}
PROP_KIND = {"street_lamp": "lamp", "traffic_signals": "signal", "bench": "bench", "bollard": "bollard", "bus_stop": "busstop",
             "waste_basket": "bin", "fountain": "fountain", "drinking_water": "wallace", "post_box": "postbox", "fire_hydrant": "hydrant",
             "bicycle_rental": "bikes", "information": "info", "vending_machine": "kiosk", "recycling": "recycling", "toilets": "toilet",
             "subway_station": "metro", "charging_station": "charger", "artwork": "artwork"}
POI_KEEP = {"hotel": "hotel", "lodging": "hotel", "restaurant": "restaurant", "casual_eatery": "restaurant", "fast_food_restaurant": "restaurant",
            "bar": "bar", "cafe": "cafe", "coffee_shop": "cafe", "museum": "museum", "art_gallery": "gallery", "historic_site": "landmark",
            "monument": "landmark", "train_station": "station", "hospital": "hospital", "theatre_venue": "theatre", "music_venue": "nightlife",
            "movie_theater": "cinema", "embassy": "embassy", "shopping": "shopping", "fashion_and_apparel_store": "shopping",
            "college_university": "university", "library": "library", "park": "park", "public_plaza": "plaza", "government_office": "office",
            "corporate_or_business_office": "office", "christian_place_of_worship": "church", "gas_station": "fuel", "night_club": "nightlife",
            "cultural_center": "culture", "arts_and_entertainment": "culture", "pharmacy_and_drug_store": "pharmacy", "food_and_beverage_store": "shop",
            "bakery": "bakery", "sport_or_fitness_facility": "sport", "stadium": "stadium", "airport": "airport", "public_transit_facility_or_service": "transit"}


def log(*a):
    print(f"[{time.strftime('%H:%M:%S')}]", *a, flush=True)


def stable_hash(s):
    return int(hashlib.md5(s.encode()).hexdigest()[:8], 16)


class Projection:
    def __init__(self, lon0, lat0):
        self.lon0, self.lat0 = lon0, lat0
        p = math.radians(lat0)
        self.mlat = 111132.954 - 559.822 * math.cos(2 * p) + 1.175 * math.cos(4 * p)
        self.mlon = 111412.84 * math.cos(p) - 93.5 * math.cos(3 * p)

    def fwd(self, lon, lat):
        return (np.asarray(lon) - self.lon0) * self.mlon, -(np.asarray(lat) - self.lat0) * self.mlat

    def inv(self, x, z):
        return np.asarray(x) / self.mlon + self.lon0, -np.asarray(z) / self.mlat + self.lat0

    def geom(self, g):
        return shapely.transform(g, lambda c: np.column_stack(self.fwd(c[:, 0], c[:, 1])))


def load(city, name, columns=None):
    p = os.path.join(ROOT, "cache", city, name + ".parquet")
    return pq.read_table(p, columns=columns).to_pylist()


def primary_name(r):
    n = r.get("names")
    return (n or {}).get("primary") if n else None


def dm(v):
    return int(round(v * 10))


def flat_dm(coords, ox=0.0, oz=0.0):
    out = []
    for x, z in coords:
        out.append(dm(x - ox)); out.append(dm(z - oz))
    return out


# ---------------------------------------------------------------------------------------------
# Terrain
# ---------------------------------------------------------------------------------------------
class Terrain:
    """Smoothed DEM resampled on a local 4 m grid. Heights relative to h0 (metres)."""

    def __init__(self, city, cfg, proj, river_polys, bounds):
        m = np.load(os.path.join(ROOT, "cache", city, "terrain_mosaic.npz"))
        H, px0, py0, z = m["h"], int(m["px0"]), int(m["py0"]), int(m["z"])
        tc = cfg.get("terrain", {})
        self.step = 4.0
        x0, z0, x1, z1 = bounds
        self.x0, self.z0 = math.floor(x0 / TILE) * TILE - TILE, math.floor(z0 / TILE) * TILE - TILE
        nx = int(math.ceil((x1 + TILE - self.x0) / self.step)) + 1
        nz = int(math.ceil((z1 + TILE - self.z0) / self.step)) + 1
        gx = self.x0 + np.arange(nx) * self.step
        gz = self.z0 + np.arange(nz) * self.step
        X, Z = np.meshgrid(gx, gz)
        lon, lat = proj.inv(X, Z)
        n = 2 ** z
        px = (lon + 180) / 360 * n * 256 - px0
        py = (1 - np.arcsinh(np.tan(np.radians(lat))) / math.pi) / 2 * n * 256 - py0
        raw = ndimage.map_coordinates(H, [py, px], order=1, mode="nearest")
        # Remove building "bumps" (DSM-like DEM): low percentile filter, then gaussian smoothing.
        win = int(tc.get("percentileWindow", 15))
        raw = ndimage.percentile_filter(raw, tc.get("percentile", 25), size=win)
        # River mask (rasterised), inpaint land surface over the river (for bridges/quays continuity).
        mask = Image.new("L", (nx, nz), 0)
        d = ImageDraw.Draw(mask)
        for poly in river_polys:
            for p in (poly.geoms if isinstance(poly, MultiPolygon) else [poly]):
                ext = [((x - self.x0) / self.step, (zz - self.z0) / self.step) for x, zz in p.exterior.coords]
                if len(ext) >= 3: d.polygon(ext, fill=255)
                for h in p.interiors:
                    hole = [((x - self.x0) / self.step, (zz - self.z0) / self.step) for x, zz in h.coords]
                    if len(hole) >= 3: d.polygon(hole, fill=0)
        river = np.asarray(mask) > 127
        # Ring of land around the river: used to define the water level.
        ring = ndimage.binary_dilation(river, iterations=6) & ~ndimage.binary_dilation(river, iterations=2)
        land = (~ndimage.binary_dilation(river, iterations=2)).astype(np.float32)
        sigma = tc.get("smoothSigma", 28) / self.step
        num = ndimage.gaussian_filter(raw * land, sigma * 2.5)
        den = ndimage.gaussian_filter(land, sigma * 2.5)
        filled = np.where(land > 0, raw, num / np.maximum(den, 1e-4))
        smooth = ndimage.gaussian_filter(filled, sigma)
        self.river = river
        ring_h = smooth[ring]
        cx, cz = proj.fwd(cfg["origin"]["lon"], cfg["origin"]["lat"])
        self.grid = smooth
        self.h0 = float(self.sample_abs(cx, cz))
        if ring_h.size:
            self.water_level = float(np.percentile(ring_h, 8) - tc.get("quayDrop", 6.5)) - self.h0
        else:
            self.water_level = -6.0
        # Guarantee quays stand above water: clamp land near river to >= water + quayDrop*0.7
        # The valley floor along the river is flat in reality (quays ~ water + quayDrop). DSM artefacts (trees, buildings)
        # make it bumpy, so clamp the terrain near the river into a band, opening up progressively with distance.
        quay = self.water_level + self.h0 + tc.get("quayDrop", 6.5)
        dist = ndimage.distance_transform_edt(~river) * self.step
        lo = quay - 0.5 - np.maximum(0, dist - 120) * 0.05
        hi = quay + 0.8 + np.maximum(0, dist - 60) * tc.get("bankSlope", 0.12)
        self.grid = np.where(river, quay, np.clip(self.grid, lo, hi))
        self.grid = ndimage.gaussian_filter(self.grid, 1.5)
        self.grid -= self.h0
        log(f"terrain grid {nx}x{nz}, h0={self.h0:.1f} m, water level {self.water_level:.2f} m (rel), range {self.grid.min():.1f}..{self.grid.max():.1f}")

    def sample_abs(self, x, z):
        return ndimage.map_coordinates(self.grid, [[(z - self.z0) / self.step], [(x - self.x0) / self.step]], order=1, mode="nearest")[0]

    def sample(self, xs, zs):
        xs = np.asarray(xs, dtype=np.float64); zs = np.asarray(zs, dtype=np.float64)
        return ndimage.map_coordinates(self.grid, [(zs - self.z0) / self.step, (xs - self.x0) / self.step], order=1, mode="nearest")


# ---------------------------------------------------------------------------------------------
# Roads
# ---------------------------------------------------------------------------------------------
def road_props(r, cfg):
    """Return dict of per-segment properties, or None if not drivable."""
    cls = r["class"]
    flags = set()
    for f in r.get("road_flags") or []:
        between = f.get("between")
        cover = 1.0 if not between else (between[1] - between[0])
        for v in f["values"]:
            if cover > 0.5: flags.add(v)
    return flags


def segment_flags_at(r, t):
    flags = set()
    for f in r.get("road_flags") or []:
        b = f.get("between")
        if not b or b[0] <= t <= b[1]:
            flags.update(f["values"])
    return flags


def oneway_of(r, t):
    ow = 0
    no_motor = False
    for a in r.get("access_restrictions") or []:
        b = a.get("between")
        if b and not (b[0] <= t <= b[1]):
            continue
        w = a.get("when") or {}
        modes = w.get("mode")
        applies_motor = (not modes) or any(m in ("motor_vehicle", "car", "vehicle") for m in modes)
        if not applies_motor or w.get("using") or w.get("during") or w.get("vehicle"):
            continue
        if a["access_type"] == "denied":
            if w.get("heading") == "backward": ow = 1
            elif w.get("heading") == "forward": ow = -1
            elif not w.get("heading"): no_motor = True
    return ow, no_motor


def speed_of(r, t, cls, cfg):
    for s in r.get("speed_limits") or []:
        b = s.get("between")
        if b and not (b[0] <= t <= b[1]): continue
        w = s.get("when") or {}
        if w.get("during") or w.get("vehicle") or w.get("using"): continue
        ms = s.get("max_speed")
        if ms and ms.get("value"):
            v = ms["value"]
            return int(round(v * 1.609)) if ms.get("unit") == "mph" else int(v)
    return cfg["defaults"]["speedLimit"].get(cls, 30)


def width_of(r, t):
    for w in r.get("width_rules") or []:
        b = w.get("between")
        if not b or b[0] <= t <= b[1]:
            return w["value"]
    return None


DEFAULT_LANES = {  # (two-way lanes per direction, one-way lanes, lane width)
    "motorway": (3, 3, 3.5), "trunk": (2, 3, 3.5), "primary": (2, 3, 3.3), "secondary": (1, 2, 3.4), "tertiary": (1, 2, 3.4),
    "residential": (1, 1, 3.4), "unclassified": (1, 1, 3.2), "living_street": (1, 1, 3.0), "service": (1, 1, 3.0)}
PARKING_EXTRA = {"primary": 2.0, "secondary": 4.0, "tertiary": 4.0, "residential": 4.0, "unclassified": 2.0}


def build_roads(city, cfg, proj, terrain_fn=None):
    rows = load(city, "transportation_segment")
    excl = tuple(cfg.get("excludeRoadNamePrefixes", []))
    overrides = {o["name"]: o for o in cfg.get("roadOverrides", [])}
    names, name_idx = [], {}

    def nidx(n):
        if n is None: return -1
        if n not in name_idx:
            name_idx[n] = len(names); names.append(n)
        return name_idx[n]

    node_of = {}
    nodes = []          # [x, z]
    node_acc = []       # accumulators for averaging
    edges = []
    paths = []          # non drivable rendered paths: (coords, width, kind, surface)
    for r in rows:
        if r["subtype"] != "road":
            continue
        cls = r["class"]
        nm = primary_name(r)
        g = proj.geom(shapely.from_wkb(r["geometry"]))
        if g.geom_type != "LineString" or g.length < 0.5:
            continue
        segflags = road_props(r, cfg)
        if segflags & {"is_tunnel", "is_indoor", "is_under_construction", "is_abandoned"}:
            continue
        surf = 0
        for s in r.get("road_surface") or []:
            if s["value"] in ("paving_stones", "sett", "cobblestone", "unhewn_cobblestone"): surf = 1
            elif s["value"] in ("gravel", "fine_gravel", "compacted", "dirt", "ground", "unpaved"): surf = 2
        if cls not in DRIVABLE or (cls == "service" and r.get("subclass") in ("driveway", "parking_aisle", "drive_through")) \
                or (nm and nm.startswith(excl)):
            if cls in PATH_KIND and r.get("subclass") not in ("sidewalk", "crosswalk", "cycle_crossing") and not (segflags & {"is_bridge"}):
                w = width_of(r, 0.5) or {"pedestrian": 6.0, "footway": 2.5, "path": 2.5, "cycleway": 2.0, "steps": 3.0, "track": 3.0, "bridleway": 3.0}[cls]
                paths.append((list(g.coords), w, PATH_KIND[cls], surf))
            continue
        conns = sorted(r.get("connectors") or [], key=lambda c: c["at"])
        if len(conns) < 2:
            continue
        L = g.length
        for c0, c1 in zip(conns[:-1], conns[1:]):
            a, b = c0["at"], c1["at"]
            if b - a <= 1e-9:
                continue
            sub = substring(g, a * L, b * L)
            if sub.geom_type != "LineString" or sub.length < 0.3:
                continue
            tm = (a + b) / 2
            flags = segment_flags_at(r, tm)
            ow, no_motor = oneway_of(r, tm)
            coords = list(sub.coords)
            ia, ib = c0["connector_id"], c1["connector_id"]
            if ow == -1:
                coords.reverse(); ia, ib = ib, ia; ow = 1
            ids = []
            for cid, pt in ((ia, coords[0]), (ib, coords[-1])):
                if cid not in node_of:
                    node_of[cid] = len(nodes); nodes.append(list(pt)); node_acc.append(1)
                ids.append(node_of[cid])
            if ids[0] == ids[1] and sub.length < 5:
                continue
            ov = overrides.get(nm)
            two, one, lw = DEFAULT_LANES[cls]
            w = width_of(r, tm)
            if ov:
                if ow:
                    lf, lb = ov.get("lanes", ov.get("lanesPerDirection", one)), 0
                else:
                    lpd = ov.get("lanesPerDirection", max(1, ov.get("lanes", 2 * two) // 2))
                    lf, lb = lpd, lpd
                width = ov.get("width") or (lf + lb) * lw
                if ow and "lanesPerDirection" in ov and "width" in ov:
                    width = ov["width"] / 2 + 1.0
            else:
                if w and w >= 2.5:
                    width = w
                    tot = max(1, int(round(w / 3.3)))
                    if ow: lf, lb = tot, 0
                    else: lf = lb = max(1, tot // 2)
                else:
                    if ow: lf, lb = one, 0
                    else: lf = lb = two
                    width = (lf + lb) * lw + (PARKING_EXTRA.get(cls, 0) * (0.5 if ow else 1.0))
            fl = 0
            if "is_bridge" in flags: fl |= 1
            if "is_link" in flags or r.get("subclass") == "link": fl |= 2
            if no_motor: fl |= 4
            if "is_covered" in flags: fl |= 8
            if cls == "service" or no_motor: fl |= 16  # traffic AI avoids
            edges.append({"a": ids[0], "b": ids[1], "pts": coords, "cls": CLASS_CODE[cls], "w": round(width, 1),
                          "lf": int(lf), "lb": int(lb), "ow": ow, "spd": speed_of(r, tm, cls, cfg), "name": nidx(nm),
                          "fl": fl, "surf": surf})
    log(f"roads: {len(edges)} drivable edges, {len(nodes)} nodes, {len(paths)} paths")

    # Keep the largest weakly connected component
    parent = list(range(len(nodes)))

    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]; i = parent[i]
        return i
    for e in edges:
        ra, rb = find(e["a"]), find(e["b"])
        if ra != rb: parent[ra] = rb
    comp = collections.Counter(find(e["a"]) for e in edges)
    main = comp.most_common(1)[0][0]
    edges = [e for e in edges if find(e["a"]) == main]
    used = sorted({e["a"] for e in edges} | {e["b"] for e in edges})
    remap = {o: i for i, o in enumerate(used)}
    nodes = [nodes[o] for o in used]
    for e in edges:
        e["a"], e["b"] = remap[e["a"]], remap[e["b"]]
        e["pts"][0] = tuple(nodes[e["a"]]); e["pts"][-1] = tuple(nodes[e["b"]])
    log(f"roads: main component {len(edges)} edges, {len(nodes)} nodes")
    return nodes, edges, names, paths


def polyline_point_at(pts, dist):
    """Point & unit tangent at a distance along a polyline (from its first point)."""
    acc = 0.0
    for i in range(len(pts) - 1):
        x0, z0 = pts[i]; x1, z1 = pts[i + 1]
        L = math.hypot(x1 - x0, z1 - z0)
        if L < 1e-9: continue
        if acc + L >= dist or i == len(pts) - 2:
            t = min(1.0, max(0.0, (dist - acc) / L))
            return (x0 + (x1 - x0) * t, z0 + (z1 - z0) * t), ((x1 - x0) / L, (z1 - z0) / L)
        acc += L
    x0, z0 = pts[0]
    return (x0, z0), (1.0, 0.0)


def polyline_length(pts):
    return sum(math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) for i in range(len(pts) - 1))


def build_junctions(nodes, edges):
    inc = collections.defaultdict(list)  # node -> [(edge index, end 0/1)]
    for i, e in enumerate(edges):
        e["len"] = polyline_length(e["pts"])
        e["trim"] = [0.0, 0.0]
        inc[e["a"]].append((i, 0)); inc[e["b"]].append((i, 1))
    junctions = {}
    for n, lst in inc.items():
        if len(lst) < 2:
            continue
        items = []
        for ei, end in lst:
            e = edges[ei]
            pts = e["pts"] if end == 0 else e["pts"][::-1]
            # direction at node, using a point a few metres along
            p, _ = polyline_point_at(pts, min(4.0, e["len"] * 0.5))
            dx, dz = p[0] - nodes[n][0], p[1] - nodes[n][1]
            L = math.hypot(dx, dz) or 1.0
            items.append({"ei": ei, "end": end, "d": (dx / L, dz / L), "hw": e["w"] / 2, "pts": pts, "ang": math.atan2(dz, dx)})
        items.sort(key=lambda it: it["ang"])
        k = len(items)
        if k == 2:
            a, b = items
            cosang = a["d"][0] * b["d"][0] + a["d"][1] * b["d"][1]
            theta = math.acos(max(-1, min(1, cosang)))
            if theta > math.radians(155) and abs(a["hw"] - b["hw"]) < 1.0:
                continue  # smooth continuation, no junction polygon
        for idx, it in enumerate(items):
            t = 0.0
            for nb in (items[(idx - 1) % k], items[(idx + 1) % k]):
                if nb is it: continue
                cosang = it["d"][0] * nb["d"][0] + it["d"][1] * nb["d"][1]
                theta = math.acos(max(-1, min(1, cosang)))
                if theta > math.radians(160):
                    f = max(it["hw"], nb["hw"]) * 0.15
                else:
                    f = (nb["hw"] + it["hw"] * math.cos(theta)) / max(math.sin(theta), 0.2)
                t = max(t, f)
            t = min(max(t, 0.0) + (1.0 if k >= 3 else 0.3), 32.0)
            it["t"] = t
        for it in items:
            e = edges[it["ei"]]
            it["t"] = min(it["t"], e["len"] * 0.45)
            e["trim"][it["end"]] = it["t"]
        # polygon
        poly = []
        corners = []
        for it in items:
            p, tg = polyline_point_at(it["pts"], it["t"])
            nx, nz = -tg[1], tg[0]  # left normal in x/z with z south... (x,z)->(-z,x) rotates +90deg
            hw = it["hw"]
            right = (p[0] - nx * hw, p[1] - nz * hw)
            left = (p[0] + nx * hw, p[1] + nz * hw)
            corners.append((right, left, tg))
        # angular order is by atan2(z,x) increasing; ensure the corner ordering is consistent (right then left in that sweep)
        for idx in range(k):
            r_, l_, tg = corners[idx]
            # make sure 'r_' comes first in angular sweep around node
            cx, cz = nodes[n]
            ar = math.atan2(r_[1] - cz, r_[0] - cx); al = math.atan2(l_[1] - cz, l_[0] - cx)
            diff = (al - ar + math.pi) % (2 * math.pi) - math.pi
            if diff < 0: r_, l_ = l_, r_
            corners[idx] = (r_, l_, tg)
        for idx in range(k):
            r_, l_, tg = corners[idx]
            poly.append((r_[0], r_[1], 0))   # mouth segment r->l is not a curb
            poly.append((l_[0], l_[1], 1))   # segment from l to next r is curb
            nr, nl, ntg = corners[(idx + 1) % k]
            # fillet: intersect the line through l_ along tg with the line through nr along ntg
            X = line_intersection(l_, tg, nr, ntg)
            if X is not None:
                cx, cz = nodes[n]
                dl = math.hypot(X[0] - l_[0], X[1] - l_[1]); dn = math.hypot(X[0] - nr[0], X[1] - nr[1])
                gap = math.hypot(nr[0] - l_[0], nr[1] - l_[1])
                # only if the control point is reasonable (not far away) and lies "behind" toward the node
                if dl < 3 * gap + 2 and dn < 3 * gap + 2:
                    for s in (0.2, 0.4, 0.6, 0.8):
                        bx = (1 - s) ** 2 * l_[0] + 2 * (1 - s) * s * X[0] + s * s * nr[0]
                        bz = (1 - s) ** 2 * l_[1] + 2 * (1 - s) * s * X[1] + s * s * nr[1]
                        poly.append((bx, bz, 1))
        junctions[n] = poly
    log(f"junctions: {len(junctions)}")
    return junctions


def line_intersection(p, d, q, e):
    den = d[0] * e[1] - d[1] * e[0]
    if abs(den) < 1e-6: return None
    t = ((q[0] - p[0]) * e[1] - (q[1] - p[1]) * e[0]) / den
    return (p[0] + d[0] * t, p[1] + d[1] * t)


def write_terrain(terrain, out_dir):
    """Global terrain grid at TERRAIN_STEP (8 m), int16 centimetres relative to h0, row-major (z rows, x columns)."""
    k = int(round(TERRAIN_STEP / terrain.step))
    g = terrain.grid[::k, ::k]
    arr = np.clip(np.round(g * 100), -32768, 32767).astype(np.int32)
    delta = np.diff(arr, axis=1, prepend=0).astype("<i2")  # row-wise delta encoding (compresses ~4x better)
    with open(os.path.join(out_dir, "terrain.bin.gz"), "wb") as f:
        f.write(gzip.compress(delta.tobytes(), 9))
    return {"file": "terrain.bin.gz", "encoding": "int16-cm-rowdelta", "x0": terrain.x0, "z0": terrain.z0, "step": TERRAIN_STEP, "nx": int(arr.shape[1]), "nz": int(arr.shape[0]), "scale": 0.01}


# ---------------------------------------------------------------------------------------------
def main():
    city = sys.argv[1]
    cfg = json.load(open(os.path.join(REPO, "data", "cities", city + ".json")))
    proj = Projection(cfg["origin"]["lon"], cfg["origin"]["lat"])
    out_dir = os.path.join(REPO, "data", "cities", city)
    os.makedirs(os.path.join(out_dir, "tiles"), exist_ok=True)
    W, S, E, N = cfg["import"]["bbox"]
    bx0, bz1 = proj.fwd(W, S); bx1, bz0 = proj.fwd(E, N)
    bounds = (float(bx0), float(bz0), float(bx1), float(bz1))
    area_box = box(*bounds)
    log("bounds (m)", [round(b) for b in bounds])

    # ---- water
    water_rows = load(city, "base_water")
    rivers, basins = [], []
    for r in water_rows:
        g = proj.geom(shapely.from_wkb(r["geometry"]))
        if g.geom_type not in ("Polygon", "MultiPolygon") or g.area < 2: continue
        g = g.buffer(0)
        if r["subtype"] == "river" or r["class"] == "river":
            rivers.append(g)
        elif r["subtype"] in ("human_made", "pond", "lake", "reservoir", "water", "canal"):
            basins.append(g)
    river_union = shapely.union_all(rivers) if rivers else Polygon()
    basin_union = shapely.union_all(basins).difference(river_union) if basins else Polygon()
    log(f"water: river area {river_union.area/1e6:.2f} km2, basins {len(basins)}")

    terrain = Terrain(city, cfg, proj, [river_union], bounds)
    terrain_meta = write_terrain(terrain, out_dir)
    if "--terrain-only" in sys.argv:
        mp = os.path.join(out_dir, "meta.json")
        meta = json.load(open(mp)); meta["terrain"] = terrain_meta; meta["waterLevel"] = round(terrain.water_level, 2); meta["h0"] = round(terrain.h0, 2)
        json.dump(meta, open(mp, "w"), separators=(",", ":")); log("terrain only: done"); return

    # ---- roads
    nodes, edges, names, paths = build_roads(city, cfg, proj)
    junctions = build_junctions(nodes, edges)
    edge_lines = [LineString(e["pts"]) for e in edges]
    edge_tree = STRtree(edge_lines)

    # ---- infrastructure points
    infra = load(city, "base_infrastructure", ["class", "subtype", "geometry", "names"])
    props = collections.defaultdict(list)
    crossings, signals = [], []
    for r in infra:
        c = r["class"]
        if c not in PROP_KIND and c != "crossing": continue
        g = shapely.from_wkb(r["geometry"])
        if g.geom_type != "Point": continue
        x, z = proj.fwd(g.x, g.y)
        x, z = float(x), float(z)
        if c == "crossing": crossings.append((x, z)); continue
        if c == "traffic_signals": signals.append((x, z))
        props[PROP_KIND[c]].append((x, z))
    log("props:", {k: len(v) for k, v in props.items()}, "crossings", len(crossings))

    # crossings -> nearest edge s position
    for e in edges: e["cross"] = []
    if crossings:
        pts = shapely.points(np.array(crossings))
        idx = edge_tree.query_nearest(pts, max_distance=3.0, return_distance=False, all_matches=False)
        for pi, ei in zip(idx[0], idx[1]):
            s = edge_lines[ei].project(pts[pi])
            e = edges[ei]
            if e["trim"][0] - 1 < s < e["len"] - e["trim"][1] + 1:
                e["cross"].append(round(float(s), 1))
    # signals -> nodes
    node_sig = np.zeros(len(nodes), np.uint8)
    deg = collections.Counter([e["a"] for e in edges] + [e["b"] for e in edges])
    if signals:
        npts = np.array(nodes)
        ntree = STRtree(shapely.points(npts))
        for (x, z) in signals:
            near = ntree.query(Point(x, z).buffer(28.0))
            best, bd = None, 1e9
            for ni in near:
                if deg[ni] < 3: continue
                d = math.hypot(npts[ni][0] - x, npts[ni][1] - z)
                if d < bd: best, bd = ni, d
            if best is not None: node_sig[best] = 1
    log("signalised junctions:", int(node_sig.sum()))

    # road ribbon polygons (for culling trees/lamps that fall on carriageways)
    ribbons = [ln.buffer(e["w"] / 2 - 0.6, cap_style="flat") for ln, e in zip(edge_lines, edges) if e["w"] > 2]
    ribbon_tree = STRtree(ribbons)

    def on_road(pts_xy):
        if not pts_xy: return np.zeros(0, bool)
        P = shapely.points(np.array(pts_xy))
        hit = ribbon_tree.query(P, predicate="intersects")
        res = np.zeros(len(pts_xy), bool); res[hit[0]] = True
        return res

    # ---- trees
    land = load(city, "base_land", ["class", "subtype", "geometry"])
    trees = []
    for r in land:
        if r["subtype"] != "tree": continue
        g = proj.geom(shapely.from_wkb(r["geometry"]))
        if g.geom_type == "Point": trees.append((g.x, g.y))
        elif g.geom_type == "LineString":
            L = g.length
            for s in np.arange(4.0, L, 8.5): p = g.interpolate(s); trees.append((p.x, p.y))
    keep = ~on_road(trees)
    trees = [t for t, k in zip(trees, keep) if k]
    for k in ("lamp", "bench", "bollard", "bin", "hydrant", "postbox", "bikes", "wallace", "kiosk", "info"):
        if props.get(k):
            kk = ~on_road(props[k]); props[k] = [p for p, q in zip(props[k], kk) if q]
    log("trees:", len(trees))

    # ---- land use
    lu_rows = load(city, "base_land_use", ["class", "subtype", "geometry"])
    landuse = []
    for r in lu_rows:
        kind = LANDUSE_KIND.get(r["class"]) or LANDUSE_KIND.get(r["subtype"])
        if not kind: continue
        g = proj.geom(shapely.from_wkb(r["geometry"]))
        if g.geom_type not in ("Polygon", "MultiPolygon"): continue
        landuse.append((g.buffer(0), kind))

    # ---- buildings
    excl_names, excl_zones, landmark_out = set(), [], []
    for lm in cfg.get("landmarks", []):
        x, z = proj.fwd(lm["lon"], lm["lat"])
        excl_zones.append((float(x), float(z), lm.get("exclude", {}).get("radius", 10)))
        for nm in lm.get("exclude", {}).get("names", []): excl_names.add(nm)
    b_rows = load(city, "buildings_building", ["id", "names", "height", "num_floors", "min_height", "roof_shape", "class", "facade_color", "roof_color", "is_underground", "geometry"])
    parts = load(city, "buildings_building_part", ["id", "building_id", "height", "num_floors", "min_height", "roof_shape", "geometry"])
    with_parts = collections.defaultdict(list)
    for p in parts: with_parts[p["building_id"]].append(p)
    dflt = cfg["defaults"]
    buildings = []
    lm_footprints = collections.defaultdict(list)

    def add_building(g, r, height, floors, minh, cls, roof, colors):
        seed = stable_hash(r["id"]) & 0xFFFFFF
        polys = g.geoms if isinstance(g, MultiPolygon) else [g]
        for p in polys:
            p = p.simplify(0.25, preserve_topology=True)
            if p.is_empty or p.area < 4 or p.geom_type != "Polygon": continue
            p = shapely.geometry.polygon.orient(p, 1.0)
            buildings.append({"poly": p, "h": height, "mh": minh, "f": floors, "c": cls, "r": roof, "s": seed, "col": colors})

    for r in b_rows:
        if r.get("is_underground"): continue
        g = proj.geom(shapely.from_wkb(r["geometry"]))
        if g.geom_type not in ("Polygon", "MultiPolygon"): continue
        if not g.is_valid: g = g.buffer(0)
        c = g.centroid
        nm = primary_name(r) or ""
        excluded = nm in excl_names
        for (lx, lz, rad) in excl_zones:
            if math.hypot(c.x - lx, c.y - lz) < rad: excluded = True
        if excluded:
            lm_footprints[nm or "_"].append(g)
            continue
        cls = BUILDING_CLASS.get(r.get("class"), 0)
        area = g.area
        seed = stable_hash(r["id"])
        if r["id"] in with_parts:
            for p in with_parts[r["id"]]:
                pg = proj.geom(shapely.from_wkb(p["geometry"]))
                if pg.geom_type not in ("Polygon", "MultiPolygon"): continue
                if not pg.is_valid: pg = pg.buffer(0)
                h = p.get("height") or ((p.get("num_floors") or 0) * dflt["floorHeight"] + 1.5 if p.get("num_floors") else None) or r.get("height") or 18.0
                add_building(pg, p, float(h), int(p.get("num_floors") or 0), float(p.get("min_height") or 0), cls, ROOF_CODE.get(p.get("roof_shape"), 0), None)
            continue
        h = r.get("height")
        fl = r.get("num_floors")
        if not h:
            if fl: h = dflt["groundFloorHeight"] + (fl - 1) * dflt["floorHeight"] + (3.5 if fl >= 4 else 1.0)
            elif cls in (10, 11, 12) or area < 25: h = 3.5 + (seed % 100) / 100 * 2
            elif cls == 2: h = 7 + (seed % 100) / 100 * 4
            elif cls == 7: h = 22
            else:
                lo, hi = dflt["buildingHeight"]
                h = lo + (hi - lo) * ((seed % 1000) / 1000) ** 0.8
                if area < 80: h *= 0.75
        if not fl: fl = max(1, int((h - 1.5) / dflt["floorHeight"]))
        colors = [r.get("facade_color"), r.get("roof_color")] if (r.get("facade_color") or r.get("roof_color")) else None
        add_building(g, r, float(h), int(fl), float(r.get("min_height") or 0), cls, ROOF_CODE.get(r.get("roof_shape"), 0), colors)
    log("buildings:", len(buildings))

    # ---- landmarks placement
    for lm in cfg.get("landmarks", []):
        x, z = proj.fwd(lm["lon"], lm["lat"])
        x, z = float(x), float(z)
        rot = lm.get("rotation", 0.0)
        if lm.get("rotationFrom") == "footprint":
            fps = []
            for nm in lm.get("exclude", {}).get("names", []): fps += lm_footprints.get(nm, [])
            if fps:
                u = shapely.union_all(fps)
                mrr = u.minimum_rotated_rectangle
                cc = list(mrr.exterior.coords)
                # longest side angle
                best = max(range(4), key=lambda i: math.hypot(cc[i + 1][0] - cc[i][0], cc[i + 1][1] - cc[i][1]))
                rot = math.degrees(math.atan2(cc[best + 1][1] - cc[best][1], cc[best + 1][0] - cc[best][0]))
                cen = u.centroid
                if math.hypot(cen.x - x, cen.y - z) < 30: x, z = cen.x, cen.y
        landmark_out.append({"id": lm["id"], "model": lm["model"], "x": round(x, 2), "z": round(z, 2), "y": round(float(terrain.sample([x], [z])[0]), 2), "rot": round(rot, 2)})
    log("landmarks:", landmark_out)

    # ---- POIs
    pl = load(city, "places_place", ["id", "names", "basic_category", "confidence", "operating_status", "addresses", "geometry"])
    pois = []
    for r in pl:
        cat = POI_KEEP.get(r.get("basic_category"))
        if not cat or (r.get("confidence") or 0) < 0.72 or r.get("operating_status") in ("permanently_closed", "temporarily_closed"): continue
        nm = primary_name(r)
        if not nm: continue
        g = shapely.from_wkb(r["geometry"])
        x, z = proj.fwd(g.x, g.y)
        if not (bounds[0] <= x <= bounds[2] and bounds[1] <= z <= bounds[3]): continue
        addr = ""
        if r.get("addresses"): addr = (r["addresses"][0] or {}).get("freeform") or ""
        pois.append([nm, cat, dm(float(x)), dm(float(z)), addr])
    log("pois:", len(pois))

    # ---- tiles
    def tkey(x, z): return (int(math.floor(x / TILE)), int(math.floor(z / TILE)))
    tiles = collections.defaultdict(lambda: collections.defaultdict(list))
    for b in buildings:
        c = b["poly"].representative_point()
        tiles[tkey(c.x, c.y)]["b"].append(b)
    for i, e in enumerate(edges):
        p, _ = polyline_point_at(e["pts"], e["len"] / 2)
        tiles[tkey(*p)]["re"].append(i)
    for n in junctions:
        tiles[tkey(*nodes[n])]["rn"].append(n)
    for (coords, w, kind, surf) in paths:
        ln = LineString(coords)
        p = ln.interpolate(0.5, normalized=True)
        tiles[tkey(p.x, p.y)]["p"].append((coords, w, kind, surf))
    for t in trees: tiles[tkey(*t)]["tr"].append(t)
    for k, lst in props.items():
        for p in lst: tiles[tkey(*p)]["pp_" + k].append(p)
    # polygons clipped per tile
    tile_keys = set(tiles.keys())
    x0t, z0t = int(math.floor(bounds[0] / TILE)), int(math.floor(bounds[1] / TILE))
    x1t, z1t = int(math.floor(bounds[2] / TILE)), int(math.floor(bounds[3] / TILE))
    for i in range(x0t, x1t + 1):
        for j in range(z0t, z1t + 1):
            tile_keys.add((i, j))

    def clip_into(geoms_kinds, key):
        if not geoms_kinds: return
        gs = [g for g, _ in geoms_kinds]
        tree = STRtree(gs)
        for (i, j) in tile_keys:
            tb = box(i * TILE, j * TILE, (i + 1) * TILE, (j + 1) * TILE)
            for gi in tree.query(tb):
                g = gs[gi]
                inter = g.intersection(tb)
                if inter.is_empty: continue
                for p in (inter.geoms if hasattr(inter, "geoms") else [inter]):
                    if p.geom_type == "Polygon" and p.area > 1.0:
                        tiles[(i, j)][key].append((p, geoms_kinds[gi][1]))

    clip_into([(g, 0) for g in (river_union.geoms if hasattr(river_union, "geoms") else [river_union]) if not g.is_empty], "w")
    clip_into([(g, 1) for g in (basin_union.geoms if hasattr(basin_union, "geoms") else [basin_union]) if not g.is_empty], "w")
    clip_into(landuse, "l")
    # river quay walls: river boundary lines (assigned by midpoint)
    water_all = river_union
    if not water_all.is_empty:
        bnd = water_all.boundary
        for ln in (bnd.geoms if hasattr(bnd, "geoms") else [bnd]):
            cs = list(ln.coords)
            for k in range(0, len(cs) - 1, 1):
                a, b = cs[k], cs[k + 1]
                mx, mz = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
                tiles[tkey(mx, mz)]["q"].append((a, b))

    log("writing", len(tile_keys), "tiles")
    tile_index = []
    total_bytes = 0
    for (i, j) in sorted(tile_keys):
        T = tiles.get((i, j), {})
        ox, oz = i * TILE, j * TILE
        # terrain 33x33
        gx = ox + np.arange(33) * TERRAIN_STEP; gz = oz + np.arange(33) * TERRAIN_STEP
        X, Z = np.meshgrid(gx, gz)
        th = terrain.sample(X.ravel(), Z.ravel())
        out = {"v": 1, "i": i, "j": j}
        bl = []
        for b in T.get("b", []):
            p = b["poly"]
            ext = list(p.exterior.coords)[:-1]
            holes = [flat_dm(list(h.coords)[:-1], ox, oz) for h in p.interiors if Polygon(h).area > 4]
            xs = [c[0] for c in ext]; zs = [c[1] for c in ext]
            base = terrain.sample(xs, zs)
            rec = [flat_dm(ext, ox, oz), dm(b["h"]), dm(b["mh"]), b["f"], b["c"], b["r"], b["s"], dm(float(base.min())), dm(float(base.max()))]
            if holes or b["col"]:
                rec.append(holes); rec.append(b["col"] or 0)
            bl.append(rec)
        if bl: out["b"] = bl
        if T.get("re"): out["re"] = sorted(T["re"])
        if T.get("rn"): out["rn"] = sorted(T["rn"])
        if T.get("p"):
            out["p"] = [[flat_dm(c, ox, oz), dm(w), k, s] for (c, w, k, s) in T["p"]]
        if T.get("tr"):
            out["tr"] = flat_dm(T["tr"], ox, oz)
        pp = {}
        for k, v in T.items():
            if k.startswith("pp_"): pp[k[3:]] = flat_dm(v, ox, oz)
        if pp: out["pp"] = pp
        if T.get("w"):
            out["w"] = [[flat_dm(list(p.exterior.coords)[:-1], ox, oz), [flat_dm(list(h.coords)[:-1], ox, oz) for h in p.interiors], k] for p, k in T["w"]]
        if T.get("l"):
            out["l"] = [[flat_dm(list(p.simplify(0.3).exterior.coords)[:-1], ox, oz), [flat_dm(list(h.coords)[:-1], ox, oz) for h in p.simplify(0.3).interiors], k] for p, k in T["l"] if p.simplify(0.3).geom_type == "Polygon"]
        if T.get("q"):
            out["q"] = [flat_dm([a, b], ox, oz) for a, b in T["q"]]
        # ground cells: cut by water polygons
        if T.get("w"):
            wu = shapely.union_all([p for p, _ in T["w"]])
            full, partial = [], []
            cs = TILE / GROUND_CELLS
            for cj in range(GROUND_CELLS):
                for ci in range(GROUND_CELLS):
                    cb = box(ox + ci * cs, oz + cj * cs, ox + (ci + 1) * cs, oz + (cj + 1) * cs)
                    if not wu.intersects(cb): continue
                    landp = cb.difference(wu)
                    if landp.area < 0.05: full.append(cj * GROUND_CELLS + ci); continue
                    if landp.area > cs * cs - 0.05: continue
                    tris = shapely.constrained_delaunay_triangles(landp)
                    flat = []
                    for tri in tris.geoms:
                        cc = list(tri.exterior.coords)[:3]
                        flat += flat_dm(cc, ox, oz)
                    partial.append([cj * GROUND_CELLS + ci, flat])
            if full: out["gx"] = full
            if partial: out["gp"] = partial
        has = any(k in out for k in ("b", "re", "rn", "p", "tr", "w", "l", "pp"))
        if not has: continue
        data = json.dumps(out, separators=(",", ":")).encode()
        gz = gzip.compress(data, 9)
        total_bytes += len(gz)
        with open(os.path.join(out_dir, "tiles", f"{i}_{j}.json.gz"), "wb") as f: f.write(gz)
        tile_index.append([i, j, len(gz)])
    log(f"tiles written: {len(tile_index)}, {total_bytes/1e6:.1f} MB")

    # ---- roads.json.gz
    roads = {
        "v": 1,
        "names": names,
        "nodes": [v for n in nodes for v in (dm(n[0]), dm(n[1]))],
        "sig": [int(i) for i in np.nonzero(node_sig)[0]],
        "edges": [[e["a"], e["b"], flat_dm(e["pts"]), e["cls"], dm(e["w"]), e["lf"], e["lb"], e["ow"], e["spd"], e["name"], e["fl"], e["surf"],
                   dm(e["trim"][0]), dm(e["trim"][1]), e.get("cross", [])] for e in edges],
        "junctions": {str(n): [v for (x, z, c) in poly for v in (dm(x), dm(z), c)] for n, poly in junctions.items()},
    }
    with open(os.path.join(out_dir, "roads.json.gz"), "wb") as f:
        f.write(gzip.compress(json.dumps(roads, separators=(",", ":")).encode(), 9))
    with open(os.path.join(out_dir, "pois.json.gz"), "wb") as f:
        f.write(gzip.compress(json.dumps({"v": 1, "pois": pois}, separators=(",", ":"), ensure_ascii=False).encode(), 9))
    sx, sz = proj.fwd(cfg["spawn"]["lon"], cfg["spawn"]["lat"])
    meta = {
        "v": 1, "id": city, "origin": cfg["origin"], "h0": round(terrain.h0, 2), "tileSize": TILE, "terrainStep": TERRAIN_STEP,
        "groundCells": GROUND_CELLS, "bounds": [round(b, 1) for b in bounds], "waterLevel": round(terrain.water_level, 2),
        "tiles": tile_index, "landmarks": landmark_out, "terrain": terrain_meta,
        "spawn": {"x": round(float(sx), 2), "z": round(float(sz), 2), "heading": cfg["spawn"]["heading"]},
        "projection": {"mlon": proj.mlon, "mlat": proj.mlat},
        "attribution": "© OpenStreetMap contributors (ODbL) · Overture Maps Foundation · Terrain: Mapzen/AWS Terrain Tiles",
        "generated": time.strftime("%Y-%m-%d"),
    }
    with open(os.path.join(out_dir, "meta.json"), "w") as f:
        json.dump(meta, f, separators=(",", ":"))
    log("done.", os.path.getsize(os.path.join(out_dir, "roads.json.gz")) / 1e6, "MB roads")


if __name__ == "__main__":
    main()
