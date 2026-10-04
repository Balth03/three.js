# Taxi·Monde

Open-world taxi game in real cities, in the browser (Three.js / WebGL2, Rapier). Step 1: vertical slice of **Paris**.

See [`DESIGN.md`](DESIGN.md) for the design, architecture and roadmap.

## Getting started

Prerequisites: **Node.js ≥ 20** (22 recommended) and a desktop browser with WebGL2 (Chrome, Edge or Firefox), ideally with a dedicated GPU.

```bash
git clone -b claude/taxi-game-webgl-y4ina6 https://github.com/Balth03/three.js taxi-monde
cd taxi-monde
npm install          # if npm complains about peer dependencies: npm install --legacy-peer-deps
npm run dev          # then open http://localhost:5173
```

Paris data (OSM roads, buildings, trees, terrain) is already generated in `data/cities/paris/`: you don't need the Python pipeline to play.

### Useful URL parameters
| Parameter | Effect |
|---|---|
| `?q=low\|medium\|high\|ultra` | graphics quality (default `high`) |
| `?time=21.5` | time of day (hours) |
| `?weather=rain\|storm\|fog\|cloudy\|clear` | weather |

### Controls (keyboard; AZERTY and QWERTY are both handled automatically)
| Action | Key (QWERTY / AZERTY) |
|---|---|
| Accelerate / brake–reverse | W / Z, S, or ↑ ↓ |
| Steer | A / Q, D, or ← → |
| Handbrake | Space |
| Headlights | L |
| Indicators | Q / A and E (X = hazard lights) |
| Camera | C |
| Look behind | B |
| Recover the car | R |
| Speed up time / change weather (debug) | T / Y |

Mouse (drag): orbit around the car or look around in the cockpit. A gamepad is supported (triggers, stick, A = handbrake, RB = camera).

## Repository layout
- `apps/client`: the game (Vite + TypeScript + Three.js)
- `apps/server`: online server (step 5)
- `packages/shared`: shared simulation (vehicle physics, fares)
- `tools/osm-import`: OSM/Overture → city tiles pipeline (Python)
- `data`: cities, cars, economy (all balancing values)

## Tests
```bash
npm test   # vehicle physics (0–100, braking, skidpad, slalom, handbrake, reverse)
```

Map data © OpenStreetMap contributors (ODbL) · Overture Maps Foundation · Terrain: Mapzen/AWS Terrain Tiles.
