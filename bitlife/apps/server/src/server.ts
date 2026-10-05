// BitLife Online — tiny private server for two players.
// Serves the built client (apps/client/dist) and a WebSocket relay with 4-letter room codes.
// Usage: npm run duo   (from bitlife/)  → open the printed URL on both computers.
import http from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, resolve, dirname } from 'node:path';
import { networkInterfaces } from 'node:os';
import { fileURLToPath } from 'node:url';
import { WebSocketServer, WebSocket } from 'ws';
import { PROTOCOL_VERSION, type ClientMsg, type ServerMsg, type DuoMode, type PeerSummary } from '../../../packages/shared/src/index.ts';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(here, '../../client/dist');
const DATA = resolve(here, '../data');
const PORT = Number(process.env.PORT ?? 8787);

interface Player { id: string; name: string; ws: WebSocket | null; summary: PeerSummary | null }
interface Room { code: string; mode: DuoMode; players: Player[]; seq: number; votes: Map<string, Map<string, number>>; chat: { from: string; name: string; text: string; at: number }[]; snapshot?: { life: unknown; hash: string }; lastOps: { seq: number; from: string; op: unknown }[] }

const rooms = new Map<string, Room>();

function code4() {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let c = '';
  do { c = Array.from({ length: 4 }, () => A[Math.floor(Math.random() * A.length)]).join(''); } while (rooms.has(c));
  return c;
}

function send(ws: WebSocket | null, m: ServerMsg) { if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(m)); }
function other(room: Room, p: Player) { return room.players.find((x) => x !== p); }
function roomInfo(room: Room, p: Player): ServerMsg {
  return { t: 'room', code: room.code, you: p.id, mode: room.mode, host: room.players[0] === p, players: room.players.map((x) => ({ id: x.id, name: x.name, online: !!x.ws })) };
}
function broadcastRoom(room: Room) { for (const p of room.players) send(p.ws, roomInfo(room, p)); }

// ── Persistence (rooms survive a server restart; JSON file, no native deps)
async function save() {
  try {
    await mkdir(DATA, { recursive: true });
    const out = [...rooms.values()].map((r) => ({ code: r.code, mode: r.mode, seq: r.seq, chat: r.chat.slice(-100), snapshot: r.snapshot, players: r.players.map((p) => ({ id: p.id, name: p.name, summary: p.summary })) }));
    await writeFile(join(DATA, 'rooms.json'), JSON.stringify(out));
  } catch (e) { console.warn('save failed', e); }
}
async function load() {
  try {
    const raw = JSON.parse(await readFile(join(DATA, 'rooms.json'), 'utf8')) as { code: string; mode: DuoMode; seq: number; chat: Room['chat']; snapshot?: Room['snapshot']; players: { id: string; name: string; summary: PeerSummary | null }[] }[];
    for (const r of raw) rooms.set(r.code, { ...r, votes: new Map(), lastOps: [], players: r.players.map((p) => ({ ...p, ws: null })) });
    console.log(`Restored ${rooms.size} room(s).`);
  } catch { /* first run */ }
}
let saveTimer: NodeJS.Timeout | null = null;
function saveSoon() { if (saveTimer) return; saveTimer = setTimeout(() => { saveTimer = null; void save(); }, 2000); }

// ── HTTP static server
const MIME: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon' };
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  if (url.pathname === '/health') { res.end('ok'); return; }
  let p = join(DIST, decodeURIComponent(url.pathname));
  if (!p.startsWith(DIST)) { res.writeHead(403).end(); return; }
  try { if ((await stat(p)).isDirectory()) p = join(p, 'index.html'); } catch { p = join(DIST, 'index.html'); }
  try {
    const data = await readFile(p);
    res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404).end(existsSync(DIST) ? 'Not found' : 'Client not built: run `npm run build` first (or use `npm run duo`).');
  }
});

// ── WebSocket relay
const wss = new WebSocketServer({ server, path: '/duo' });
wss.on('connection', (ws) => {
  let room: Room | null = null;
  let me: Player | null = null;
  ws.on('message', (buf) => {
    let m: ClientMsg;
    try { m = JSON.parse(String(buf)); } catch { return; }
    if (m.t === 'hello') {
      if (m.v !== PROTOCOL_VERSION) { send(ws, { t: 'error', message: 'version' }); return; }
      if (m.create) {
        room = { code: code4(), mode: m.mode ?? 'parallel', players: [], seq: 0, votes: new Map(), chat: [], lastOps: [] };
        rooms.set(room.code, room);
      } else {
        room = rooms.get((m.code ?? '').toUpperCase()) ?? null;
        if (!room) { send(ws, { t: 'error', message: 'room_not_found' }); return; }
      }
      // Rejoin by name, else take a free seat (max 2)
      me = room.players.find((p) => p.name === m.name) ?? null;
      if (!me) {
        if (room.players.length >= 2) { send(ws, { t: 'error', message: 'room_full' }); return; }
        me = { id: Math.random().toString(36).slice(2, 8), name: m.name.slice(0, 24) || 'Joueur', ws, summary: null };
        room.players.push(me);
      }
      me.ws = ws;
      broadcastRoom(room);
      const o = other(room, me);
      send(ws, { t: 'peer', s: o?.summary ?? null, online: !!o?.ws });
      if (o) send(o.ws, { t: 'peer', s: me.summary, online: true });
      for (const c of room.chat.slice(-30)) send(ws, { t: 'chat', ...c });
      if (room.mode === 'shared' && room.snapshot && room.players[0] !== me) send(ws, { t: 'snapshot', ...room.snapshot });
      saveSoon();
      return;
    }
    if (!room || !me) return;
    const o = other(room, me);
    switch (m.t) {
      case 'summary': me.summary = m.s; send(o?.ws ?? null, { t: 'peer', s: m.s, online: true }); saveSoon(); break;
      case 'chat': { const c = { from: me.id, name: me.name, text: m.text.slice(0, 500), at: Date.now() }; room.chat.push(c); for (const p of room.players) send(p.ws, { t: 'chat', ...c }); saveSoon(); break; }
      case 'emote': for (const p of room.players) send(p.ws, { t: 'emote', from: me.id, e: m.e.slice(0, 8) }); break;
      case 'social': send(o?.ws ?? null, { t: 'social', from: me.id, kind: m.kind, data: m.data }); break;
      case 'mode': room.mode = m.mode; broadcastRoom(room); saveSoon(); break;
      case 'start': for (const p of room.players) send(p.ws, { t: 'start', opts: m.opts }); break;
      case 'op': {
        // Ordered broadcast: both clients apply the same operations in the same order.
        const msg = { t: 'op' as const, seq: ++room.seq, from: me.id, op: m.op };
        room.lastOps.push(msg); if (room.lastOps.length > 50) room.lastOps.shift();
        for (const p of room.players) send(p.ws, msg);
        break;
      }
      case 'vote': {
        let v = room.votes.get(m.key);
        if (!v) { v = new Map(); room.votes.set(m.key, v); }
        v.set(me.id, m.i);
        send(o?.ws ?? null, { t: 'vote', key: m.key, from: me.id });
        const online = room.players.filter((p) => p.ws).length;
        if (v.size >= Math.max(1, online)) {
          const picks = [...v.values()];
          const disagree = picks.some((x) => x !== picks[0]);
          const i = disagree ? picks[Math.floor(Math.random() * picks.length)] : picks[0];
          room.votes.delete(m.key);
          const msg = { t: 'op' as const, seq: ++room.seq, from: 'room', op: { k: 'choose', i, disagree, sig: m.key } };
          for (const p of room.players) send(p.ws, msg);
        }
        break;
      }
      case 'snapshot': room.snapshot = { life: m.life, hash: m.hash }; if (room.players[0] === me) send(o?.ws ?? null, { t: 'snapshot', life: m.life, hash: m.hash }); saveSoon(); break;
    }
  });
  ws.on('close', () => {
    if (!room || !me) return;
    me.ws = null;
    broadcastRoom(room);
    const o = other(room, me);
    send(o?.ws ?? null, { t: 'peer', s: me.summary, online: false });
  });
});

function lanAddresses() {
  const out: string[] = [];
  for (const list of Object.values(networkInterfaces())) for (const n of list ?? []) if (n.family === 'IPv4' && !n.internal) out.push(n.address);
  return out;
}

await load();
server.listen(PORT, () => {
  console.log('\n🧬 BitLife Online — serveur à deux prêt !\n');
  console.log(`   Sur cet ordinateur : http://localhost:${PORT}`);
  for (const a of lanAddresses()) console.log(`   Sur le réseau local : http://${a}:${PORT}`);
  console.log('\n   Ouvrez cette adresse sur les deux ordinateurs, puis « Jouer à deux ».\n');
  if (!existsSync(DIST)) console.log('   ⚠️  Client non construit : lancez `npm run build` (ou `npm run duo`).\n');
});
