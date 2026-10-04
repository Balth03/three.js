// Usage: node tools/dev/shot.mjs "<query>" out.png [frames] [width] [height] [jsBeforeShot]
// Uses ?shot (paused loop) and advances frames manually: robust with software GL.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [query = '', out = 'screenshots/tmp/shot.png', frames = '3', w = '960', h = '540', js = ''] = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
page.setDefaultTimeout(600000);
const logs = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning' || m.text().startsWith('[test]')) logs.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
const port = process.env.PORT ?? 5175;
await page.goto(`http://localhost:${port}/?shot&${query}`);
const t0 = Date.now();
await page.waitForFunction(() => window.game && window.game.paused !== undefined && document.querySelector('.loading') === null, null, { timeout: 400000 }).catch(() => logs.push('timeout waiting for game'));
const tl = ((Date.now() - t0) / 1000).toFixed(1);
if (js) await page.evaluate(js);
const info = await page.evaluate(async (n) => {
  const g = window.game; if (!g) return null;
  const t = performance.now();
  for (let i = 0; i < n; i++) { g.advance(1, 1 / 30); await new Promise((r) => setTimeout(r, 0)); }
  const ms = (performance.now() - t) / n;
  const r = g.d.renderer.renderer.info;
  return { frameMs: ms.toFixed(0), calls: r.render.calls, tris: r.render.triangles, tiles: g.d.world.loadedCount, pending: g.d.world.pendingCount, geom: r.memory.geometries, tex: r.memory.textures, time: g.d.env.clock() };
}, +frames);
await page.screenshot({ path: out });
console.log(JSON.stringify({ load: tl, ...info }));
for (const l of logs.slice(0, 40)) console.log(l);
await browser.close();
