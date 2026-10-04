# TAXI·MONDE — Design Document

> Working title: **Taxi·Monde** (internal codename `taxi`). A realistic open-world taxi game, in the browser, in real cities.
> This document is the source of truth. It is kept short and precise; decisions are logged at the bottom.

---

## 1. Pitch

You drive a taxi through real cities, reconstructed from open map data. Every street has its real name, every building its real footprint. You pick up passengers with personalities, take them where they are going by the route you choose, earn money and reputation, upgrade your car, and online you meet other drivers in races, rivalries, mutual help and convoys.
The city is alive: traffic, pedestrians, weather, day and night, events.

**One sentence:** *Forza Horizon's driving pleasure, Euro Truck's zen calm, Crazy Taxi's spark, in the real Paris at 2 a.m. in the rain.*

## 2. Pillars

1. **Driving is a pleasure in itself.** A credible raycast-suspension model, feedback you can read (pitch, roll, tyre noise, camera), fine control on keyboard *and* gamepad. If driving with no mission isn't fun, nothing else matters.
2. **The real city, recognisable at a glance.** Real topology and street names, real heights, local architecture, monuments in their real places. You should recognise Paris from a single screenshot, day or night.
3. **A city that breathes.** Traffic that obeys (or doesn't), pedestrians, weather, time of day, events. Rainy nights are the signature moment.
4. **The trade, and "one more fare".** Meter, comfort, tips, rating, route knowledge. A short loop (< 90 s to the first fare) and a long progression.
5. **Together.** Online, other drivers are a source of stories (friendly rivalry, co-op), never of grief.

## 3. Art direction

*Stylised cinematic photorealism.* Never cartoon. A "film" look rather than a "flat simulator" one.

| Topic | Decision |
|---|---|
| Tone mapping | AgX (fallback ACES), exposure tied to sun/moon luminance + eye adaptation smoothed over ~2 s |
| Sky | Physical model (Preetham-style analytic scattering) + stars + moon + procedural cloud layer; the environment map (PMREM) is regenerated when the sun moves noticeably |
| Light | Directional sun/moon with stable cascaded shadows; hemispheric ambient from the sky; AO (N8AO/SSAO in High+) |
| Night | Emissive windows (deterministic per-window hash, lit or not depending on the hour), street lamps = emitters + projected light pools (additive decals) + vertical reflection streaks on wet surfaces, real headlights for the player, bloom |
| Rain | Rain streaks around the camera, wetness that rises gradually (roughness ↓, darkening, procedural puddles), drops/wipers in cockpit view, sound |
| Post | Bloom (mipmap), SMAA, vignette, grain, light chromatic aberration, colour grading per city |
| Grading | Paris = warm golds/cream; NYC = contrasty amber; Tokyo = cyan/magenta; London = humid grey-blue |
| UI | Sober premium glassmorphism, Inter/system font, fluid transitions, diegetic where possible |

**Paris, its signature look:** cream Lutetian limestone façades, zinc-grey mansard roofs, wrought-iron balconies on the 2nd and 5th floors, shops on the ground floor with lit awnings, plane-tree-lined avenues, Wallace fountains, Haussmann lamp posts, dark grey asphalt with white markings, pavé on some squares, the Seine running between stone quays.

## 4. Technical architecture

```
apps/client      Vite + TS strict + Three.js (WebGL2), HTML/CSS UI, Web Audio
apps/server      Node (uWebSockets.js or ws) authoritative 30 Hz — step 5
packages/shared  Types, network protocol, constants, deterministic simulation (economy, fares, routing)
tools/osm-import Overture/OSM → city tile pipeline (Python), terrain fetch
tools/sim        Economy simulation (Node)
data/            cities, cars, missions, economy, config (ALL balancing lives here)
```

### 4.1 Client: systems-based

There is no god-class. A `Game` object holds a list of `System`s (`init`, `fixedUpdate(dt)`, `update(dt)`, `dispose`), and they talk to each other through:
- a typed **event bus** (`events.emit('fare:completed', …)`),
- shared **services** (world, physics, input, audio, time),
- **pooled** entities (traffic, pedestrians) stored in SoA structures for allocation-free update loops.

Main systems: `InputSystem` (abstract actions → keyboard/mouse/gamepad, remappable, future touch support), `PhysicsSystem` (Rapier, fixed step 120 Hz), `VehicleSystem` (custom model), `WorldStreamer` (tiles + workers), `TrafficSystem`, `PedestrianSystem`, `EnvironmentSystem` (time, sky, weather), `RenderPipeline` (renderer + post), `CameraSystem`, `AudioSystem`, `MissionSystem`, `NavigationSystem` (A*, GPS), `HudSystem`, `DebugOverlay` (F3).

### 4.2 Rendering

- **WebGL2 with Three.js `WebGLRenderer`** (decision D3). `three/webgpu` is tempting, but its WebGL2 fallback and TSL post-processing are not yet as stable or as fast as the classic pipeline plus `postprocessing`. The renderer is isolated in `render/` so it can be migrated later.
- Draw-call budget: < 1,000 (High). One merged mesh per tile for buildings (1 draw call for walls + 1 for roofs), instancing for trees/lamps/props/vehicles/pedestrians, materials shared across tiles.
- Building façades are **procedural in the shader**: world-space UVs (u = length along the wall, v = height), floor height, bays, windows, balconies, shop fronts, lit windows at night, per-building variation through a hash. No textures needed, crisp at any distance (analytic anti-aliasing via `fwidth`).
- Quality: Low/Med/High/Ultra + auto-detection (GPU renderer string + measured frame time over the first seconds).

### 4.3 Physics: vehicle model

Rapier (WASM) handles rigid-body collisions (chassis ↔ buildings/props/traffic). **The vehicle itself is custom**:

- **Suspension**: 4 raycasts (one per wheel) against the world (terrain heightfield, bridges, colliders). Spring `k·x` + damper (bump/rebound) + anti-roll bar per axle (force ∝ difference in compression).
- **Tyres**: simplified Pacejka Magic Formula `F = D·sin(C·atan(B·s − E·(B·s − atan(B·s))))` for longitudinal slip (slip ratio) and lateral slip (slip angle), combined through a friction ellipse; `D = μ_surface · Fz` (load-sensitive, so load transfer emerges naturally). Relaxation length for low-speed stability, plus a low-speed "static friction" regime so the car does not creep when stopped.
- **Powertrain**: torque curve by RPM (table in `data/cars`), clutch/torque converter, gearbox (auto with up/down shift logic by load, or manual), open/LSD differential, engine inertia, engine braking, rev limiter.
- **Brakes**: front/rear distribution, ABS (slip-ratio regulation), handbrake on the rear wheels (lock → drift).
- **Aero**: drag `½ρC_xAv²`, downforce `C_z`, rolling resistance.
- **Assists**: TCS, ESC (yaw-rate correction), steering assist (counter-steer + speed-sensitive steering limit), automatic gearbox. *Arcade* mode = a set of parameters (grip ×1.25, yaw assist, quick steering) rather than a separate model.
- **Surfaces**: per-surface μ and roughness (dry/wet asphalt, cobbles, dirt, snow, ice), with wetness from the weather.
- **Mass**: passenger and luggage added at their real positions (CoM shift).
- Fixed step **120 Hz**, deterministic for a given input (useful for replays and network prediction).

### 4.4 Real world: pipeline

**Source**: OpenStreetMap through **Overture Maps** GeoParquet releases (OSM data under ODbL, plus derived datasets). Overture is read with HTTP range requests (only the row groups that cover the city are downloaded). Elevation comes from **AWS Terrain Tiles** (Terrarium; SRTM/EU-DEM/… sources). *Decision D1: the Overpass API is not reachable from the build environment, and Overture provides the same OSM data, cleaned up and with a stable schema. The pipeline also accepts an Overpass/PBF export (on the roadmap).*

```
fetch_overture.py  →  cache/<city>/*.parquet (roads, connectors, buildings, parts, water, land use, land(trees), infrastructure(lamps, signals, crossings…), places)
fetch_terrain.py   →  cache/<city>/terrain.npy (smoothed DEM, 4 m/px)
build_city.py      →  data/cities/<city>/
                        meta.json           (origin, bounds, tile list, POIs, districts)
                        roads.bin           (global graph: nodes, edges, lanes, one-way, limits, names) — routing + traffic
                        terrain.bin         (heights int16 cm, 4 m grid)
                        tiles/<tx>_<tz>.json.gz (256 m: buildings, road/junction geometry, water, parks, trees, lamps, props)
```

- Projection: local equirectangular around the city's `origin` (error < 0.1% over 15 km). Axes: **x = east, z = south, y = up**, 1 unit = 1 m.
- Roads: drivable classes (motorway…living_street, service), width = `width_rules` or `lanes × 3.2 m` with a default per class; one-way roads come from `access_restrictions` (heading); speed limits from `speed_limits` (default 50, 30 on residential streets in Paris); bridges/tunnels from `road_flags`.
- Buildings: footprint + holes, height = `height` › `num_floors × 3.1 + 1.5` › heuristic by class/area/city (Paris: R+5/R+6 ≈ 20 m), `building_part` for complex buildings. Monuments are replaced by parametric models (exclusion list by id/proximity).
- Tiles of **256 m**, loaded within a radius that depends on quality (450–900 m), geometry built in **Web Workers** (transferable buffers), 2 LODs (full / simplified buildings without detail beyond 600 m).
- **ODbL**: "© OpenStreetMap contributors, Overture Maps Foundation" in the HUD (bottom corner) and the credits.

### 4.5 Traffic and pedestrians

- **Lanes** are derived from road edges (left/right offset by `drivingSide`). Vehicles move along `edge+lane+s` (curvilinear abscissa). IDM (Intelligent Driver Model) for car-following, a turn choice at every node, gentler speeds in turns, give-way at entries, traffic lights at the OSM `traffic_signals` nodes (cycles grouped by junction), occupancy reservation inside junctions.
- Vehicles are kinematic (Rapier kinematic bodies) near the player and simulated "on rails" beyond that. Spawn/despawn on a ring around the player, with density by hour and road class.
- Pedestrians walk along the sidewalks (offset curves alongside the roads), cross at the crossings, gather at the POIs; procedural walk animation in the vertex shader (instancing, hundreds of them in 1–2 draw calls).

### 4.6 Missions and economy (step 1 → 3)

The fare loop is a state machine `Idle → Offered → Approaching → Boarding → Riding → Arriving → Paid`. Fare = pick-up charge + rate per km (A/B/C depending on the time of day) + waiting time, with a minimum fare and supplements; in Paris: pick-up €4.40, rate A €1.36/km, waiting time €40/h, minimum fare €8 (fictional but plausible values, in `data/economy/paris.json`). Comfort (0–100) drops with jolts (jerk), excessive lateral g, speeding, collisions and red lights. Tip = f(comfort, time vs estimate, personality). Rating from 1 to 5★.

### 4.7 Network (step 5): summary of the protocol

- **Transport**: WebSocket (binary, `packages/shared/net`), 30 Hz server tick, 60 Hz client input.
- **Client → server**: `Input{seq, tick, throttle, brake, steer, handbrake, gearReq, flags}` (≈12 bytes, quantised).
- **Server → client**: `Snapshot{tick, ackSeq, entities[id, pos(f32×3), rot(quant 16-bit ×3), vel, wheelState, flags]}` with deltas against the last acknowledged snapshot.
- **Player vehicle**: client-side prediction (same deterministic model on both sides) + reconciliation (replaying the inputs after `ackSeq`) + visual error smoothing (decaying offset).
- **Other players**: interpolation buffer at 100 ms + bounded Hermite extrapolation (≤ 250 ms) driven by velocity.
- **Authority**: the server validates speed, position (graph + collisions), money (fares computed server-side), and rejects inconsistent state.
- **Rooms**: per city/instance (32 players max), lobby, friends, invites; Postgres/SQLite persistence. `docker-compose up` starts server + DB + client build.

### 4.8 Audio

Web Audio API, HRTF panning for 3D sources. **The engine is synthesised in an AudioWorklet**: additive firing harmonics (`f = rpm/60 · cylinders/2`), an exhaust resonance whose filter depends on load, combustion noise modulated per cycle, intake/turbo, decel crackles. Tyres = filtered noise driven by slip. Wind ∝ v². Rain (body/glass), city ambience by layer (distant traffic, birds by day, voices). Radio with procedurally generated music stations. Bus mix (master/engine/sfx/ambience/radio/ui) with ducking and a low-pass filter inside the cabin.

### 4.9 Input

Abstract actions (`throttle`, `brake`, `steer`, `handbrake`, `shiftUp`, `shiftDown`, `horn`, `lights`, `indicatorL/R`, `camera`, `reset`, `interact`, `phone`, `map`, `photo`, `pause`, `lookX/Y`) with 0..1 or −1..1 values. Bindings use **physical codes** (`KeyW`, `KeyA`…), so AZERTY works with no special case (`KeyW` = Z on AZERTY). Labels come from the active layout (`navigator.keyboard.getLayoutMap`). Gamepad: analogue triggers, radial dead zones, rumble. Keyboard steering is filtered (speed-dependent rate limit + return to centre) for smooth, precise steering.

## 5. Systems list (target) and status

| System | Step | Status |
|---|---|---|
| OSM → tiles pipeline, terrain | 1 | 🎯 |
| Tile streaming + workers | 1–2 | 🎯 |
| Procedural Haussmann buildings | 1 | 🎯 |
| Monuments (Arc, Eiffel Tower, Obelisk) | 1 | 🎯 |
| Vehicle physics | 1 | 🎯 |
| Day/night, sky, rain | 1 | 🎯 |
| Basic traffic and pedestrians | 1 | 🎯 |
| Mission, GPS, meter, payment | 1 | 🎯 |
| Synthesised audio | 1 | 🎯 |
| Full traffic AI, police | 2–3 | ⏳ |
| Damage, destructible props | 2 | ⏳ |
| Garage/tuning | 4 | ⏳ |
| Online | 5 | ⏳ (protocol specified, server scaffolding) |
| Other cities | 6 | ⏳ (pipeline ready: `data/cities/<id>.json`) |

## 6. Step-by-step plan

1. **Paris vertical slice**: real Paris (data from the whole city, loaded by streaming), taxi with a full physics model, day/night + rain, basic traffic and pedestrians, a complete fare (hail → GPS → meter → payment), HUD, engine sound, cameras.
2. Full streaming and LOD, complete traffic AI, full weather (snow, fog, storm), destructible props, car damage.
3. Varied missions, Paris story, passengers with dialogue, economy, fuel/wear, police.
4. Garage, 8 cars, customisation, dyno, test track.
5. Online server (prediction/reconciliation, instances, friends, chat), interactions, events.
6. New York, Tokyo, London.
7. Meta, photo mode, replays, options/accessibility, i18n.
8. Polish, perf, network QA (100–200 ms, 2% loss), Docker deployment.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Browser perf with a dense city (Paris = 250k buildings) | Tiles + merged meshes + instancing + streaming radius + LOD; shader-procedural façades (no textures) |
| Topologically imperfect OSM data (overlaps, missing junctions) | Use the Overture connectors (explicit topology), junction clean-up, tolerances |
| Floaty / "soap" handling | Pacejka model + relaxation + low-speed regime, unit tests (stopping distance, 0–100 km/h, skidpad), an iterative tuning pass |
| Network jitter with physics vehicles | Deterministic shared simulation, reconciliation + smoothing, interpolation buffer |
| Scope | Playable steps, a vertical slice before breadth |
| Assets/licences | Everything procedural/in code, fictional brands, ODbL attribution |

## 8. Decision log

- **D1** Data source = Overture Maps (OSM/ODbL) through HTTP range requests on the public S3 bucket, because Overpass is blocked in the build environment. Same data, explicit topology (connectors).
- **D2** Real elevation (AWS Terrain Tiles, smoothed with a Gaussian ~25 m) for the gentle relief (Étoile, Chaillot, Montmartre). The Seine is a flat water level with stone quays.
- **D3** WebGL2 (`WebGLRenderer` + `postprocessing`) rather than WebGPU; the renderer is isolated so it can migrate.
- **D4** The whole of Paris is pre-generated as tiles (≈ 2,000 × 256 m). Step 1 already streams the whole city, while the slice (Étoile–Champs-Élysées–Concorde–Trocadéro–Eiffel Tower) is the area that gets the detailed art direction and the missions.
- **D5** Custom vehicle on Rapier: Rapier handles collisions/integration, and our code handles suspension/tyres/powertrain (Rapier's `DynamicRayCastVehicleController` is too limited for a credible Pacejka model).
- **D6** Key bindings by physical code: steering = `KeyA/KeyD` (Q/D on AZERTY), indicators = `KeyQ/KeyE` (A/E on AZERTY), so there is no conflict between ZQSD and Q/E.
- **D7** Arcade/Realistic = parameter sets for the same model, not two models.
- **D8** Fictional car brands: the step 1 taxi is the **Vireo Lumen** (French hybrid sedan, fictional brand "Vireo").
- **D9** Fares: Paris rates are inspired by the regulated rates but simplified and stored in `data/economy/paris.json`.
- **D10** Overture building data that has been cut into small cadastral plots (common in Paris) is a strength: each plot gets its own façade variation (height, stone tint, window rhythm), which reproduces the street-by-street look of Paris.
