// Screenshot a minigame from the standalone harness (needs `npm run dev` / vite on PORT, default 5173).
// Usage: node tools/gameshot.mjs <Game> <out.png> [waitMs=2500] [variant] [keys e.g. "ArrowLeft:400,Space:200"]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [game = 'CarChase', out = 'screenshots/tmp/game.png', wait = '2500', variant = '', keys = ''] = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 760 } });
const logs = [];
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') logs.push(`[console] ${m.text()}`); });
await page.goto(`http://localhost:${process.env.PORT ?? 5173}/games.html?g=${game}${variant ? `&v=${variant}` : ''}`);
await page.waitForSelector('.arena', { timeout: 60000 });
await page.screenshot({ path: out.replace('.png', '-intro.png') });
await page.keyboard.press('Space');
await page.waitForTimeout(2300); // countdown
for (const k of keys.split(',').filter(Boolean)) { const [code, ms] = k.split(':'); await page.keyboard.down(code); await page.waitForTimeout(+ms || 150); await page.keyboard.up(code); }
await page.waitForTimeout(+wait);
await page.screenshot({ path: out });
console.log(logs.length ? logs.join('\n') : 'no errors');
await browser.close();
