// node tools/dev/eval.mjs "<query>" frames "<js expression returning JSON-able>"
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [query = '', frames = '10', js = '0'] = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 480, height: 270 } });
page.setDefaultTimeout(600000);
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('[err]', m.text()); });
await page.goto(`http://localhost:${process.env.PORT ?? 5190}/?shot&${query}`);
await page.waitForFunction(() => window.game && document.querySelector('.loading') === null, null, { timeout: 400000 });
const out = await page.evaluate(async ([n, js]) => {
  const g = window.game; const res = [];
  for (let i = 0; i < n; i++) { g.advance(1, 1 / 30); if (i % Math.max(1, Math.floor(n / 6)) === 0 || i === n - 1) res.push(eval(js)); await new Promise((r) => setTimeout(r, 0)); }
  return res;
}, [+frames, js]);
for (const o of out) console.log(JSON.stringify(o));
await browser.close();
