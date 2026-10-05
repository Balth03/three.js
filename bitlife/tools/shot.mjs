// Usage: node tools/shot.mjs out.png "<js to run after load>" [width] [height] [frames]
// Opens the dev server with ?shot (paused loop), runs JS, advances frames manually (robust with software GL), screenshots.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [out = 'screenshots/tmp/shot.png', js = '', w = '1440', h = '900', frames = '40', query = ''] = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
page.setDefaultTimeout(300000);
const logs = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning' || /Context/.test(m.text())) logs.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(`http://localhost:${process.env.PORT ?? 5173}/?shot&${query}`);
await page.waitForFunction(() => window.game && window.game.stage, null, { timeout: 120000 });
if (js) { const r = await page.evaluate(js); if (r !== undefined) console.log('js:', JSON.stringify(r)); }
const t0 = Date.now();
await page.evaluate(async (n) => { for (let i = 0; i < n; i++) { window.game.stage.advance(1, 1 / 30); if (i % 5 === 0) await new Promise((r) => setTimeout(r, 0)); } }, +frames);
await page.waitForTimeout(400);
await page.screenshot({ path: out });
const info = await page.evaluate(() => { const s = window.game.stage; const r = s.renderer.info; return { calls: r.render.calls, tris: r.render.triangles, geom: r.memory.geometries, tex: r.memory.textures, cam: s.camera.position.toArray().map((v) => +v.toFixed(2)), groups: s.scene.children.filter((c) => c.type === 'Group').map((c) => c.position.y.toFixed(2)) }; });
console.log(JSON.stringify({ ...info, ms: Date.now() - t0 }));
for (const l of logs.slice(0, 30)) console.log(l);
await browser.close();
