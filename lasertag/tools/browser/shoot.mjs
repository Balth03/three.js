// Automated browser check: loads the game, captures the menu, plays a short match, reports console errors.
//   node tools/browser/shoot.mjs [url] [outDir]
// Uses the pre-installed Chromium (software GL): it checks behaviour and looks, not real frame rates.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const url = process.argv[2] ?? 'http://localhost:5173/';
const out = process.argv[3] ?? 'screenshots';
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM ?? '/opt/pw-browsers/chromium', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !m.text().includes('ERR_CERT') && !m.text().includes('GPU stall')) errors.push(`[${m.type()}] ${m.text().slice(0, 300)}`); });
page.on('pageerror', (e) => errors.push('[pageerror] ' + e.message));
const st = () => page.evaluate(() => window.__game.debugState());
const simTime = () => page.evaluate(() => window.__game.sim.time);
const waitSim = async (secs) => { const t0 = await simTime(); while ((await simTime()) - t0 < secs) await page.waitForTimeout(250); };
const snap = async (name, q = 'high') => {
  await page.evaluate((q) => window.__game.setQuality(q), q);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${out}/${name}.png` });
  await page.evaluate(() => window.__game.setQuality('low'));
};

await page.goto(url);
await page.waitForFunction(() => document.querySelector('.menu.show'), null, { timeout: 120000 });
await page.evaluate(() => window.__game.setQuality('high'));
await page.waitForTimeout(5000);
await page.screenshot({ path: `${out}/01-menu.png` });
console.log('menu', await st());

await page.evaluate(() => { window.__game.setQuality('low'); void window.__game.startMatch(); });
await page.waitForFunction(() => window.__game.debugState().mode === 'match', null, { timeout: 60000 });
await page.evaluate(() => { window.__game.input.locked = true; });
await waitSim(1.5);
await snap('02-briefing');
await page.waitForFunction(() => window.__game.debugState().phase === 'playing', null, { timeout: 120000 });
console.log('playing', await st());
// sprint toward the centre ramp
await page.evaluate(() => { const g = window.__game, p = g.local.pos; g.setView(Math.atan2(-(-14 - p.x), -(0 - p.z)), -0.03); });
await page.keyboard.down('KeyW');
await page.keyboard.down('ShiftLeft');
await waitSim(2.2);
await page.keyboard.up('ShiftLeft');
const pos1 = await page.evaluate(() => ({ ...window.__game.local.pos }));
console.log('after sprint', pos1);
await page.evaluate(() => window.__game.input['press']('Mouse0'));
await waitSim(0.5);
await page.screenshot({ path: `${out}/03-firing.png` });
await waitSim(0.6);
await page.evaluate(() => window.__game.input['release']('Mouse0'));
const me1 = await page.evaluate(() => { const a = window.__game.local; return { shots: a.stats.shots, energy: a.energy, heat: a.heat }; });
console.log('after firing', me1);
// jump + slide
await page.keyboard.press('Space');
await waitSim(0.8);
await page.keyboard.down('ShiftLeft');
await waitSim(0.6);
await page.keyboard.down('ControlLeft');
await waitSim(0.5);
await page.keyboard.up('ControlLeft');
await page.keyboard.up('ShiftLeft');
await page.keyboard.up('KeyW');
await waitSim(6);
await page.evaluate(() => window.__game.setView(Math.PI / 2 + 0.25, 0.02));
await snap('04-ingame');
await page.keyboard.down('Tab');
await waitSim(0.5);
await page.screenshot({ path: `${out}/05-scoreboard.png` });
await page.keyboard.up('Tab');
// let the bots play a while
await waitSim(20);
console.log('later', await st());
await snap('06-ingame-later');
const stats = await page.evaluate(() => window.__game.sim.agents.map((a) => `${a.team} ${a.name} K${a.stats.deactivations} D${a.stats.downs} shots ${a.stats.shots}`));
console.log(stats.join('\n'));
console.log('errors:', errors.length ? errors.slice(0, 20).join('\n') : 'none');
await browser.close();
