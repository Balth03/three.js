// WebSocket transport for the two-player mode. Pure plumbing: message handling lives in duo.ts.
import { PROTOCOL_VERSION, type ClientMsg, type ServerMsg, type DuoMode, type PeerSummary, type SocialKind } from '@bl/shared';

let ws: WebSocket | null = null;
let handler: (m: ServerMsg) => void = () => {};
let closeHandler: () => void = () => {};
let last: { name: string; code?: string; create?: boolean; mode?: DuoMode } | null = null;
let retry = 0;
let wanted = false;

export function onServer(h: (m: ServerMsg) => void, onClose: () => void) { handler = h; closeHandler = onClose; }

function url() {
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  // In dev (vite on 5173) the relay runs separately on 8787.
  const host = location.port === '5173' ? `${location.hostname}:8787` : location.host;
  const q = new URLSearchParams(location.search).get('server');
  return q ? `${q.replace(/^http/, 'ws')}/duo` : `${proto}://${host}/duo`;
}

export function connect(opts: { name: string; code?: string; create?: boolean; mode?: DuoMode }) {
  last = opts;
  wanted = true;
  open();
}

function open() {
  if (!last) return;
  try { ws?.close(); } catch { /* ignore */ }
  const sock = new WebSocket(url());
  ws = sock;
  sock.onopen = () => { retry = 0; raw({ t: 'hello', v: PROTOCOL_VERSION, ...last! }); };
  sock.onmessage = (e) => { try { handler(JSON.parse(String(e.data)) as ServerMsg); } catch (err) { console.error(err); } };
  sock.onclose = () => {
    if (ws !== sock) return;
    ws = null;
    closeHandler();
    if (wanted && retry < 8) setTimeout(open, Math.min(8000, 500 * 2 ** retry++));
  };
}

/** After the first successful join, reconnections rejoin the same room instead of creating a new one. */
export function rememberRoom(code: string) { if (last) last = { name: last.name, code, create: false }; }

export function disconnect() { wanted = false; last = null; try { ws?.close(); } catch { /* ignore */ } ws = null; }
export function isOpen() { return !!ws && ws.readyState === WebSocket.OPEN; }

function raw(m: ClientMsg) { if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(m)); }

export const sendOp = (op: unknown) => raw({ t: 'op', op });
export const sendVote = (key: string, i: number) => raw({ t: 'vote', key, i });
export const sendSummary = (s: PeerSummary) => raw({ t: 'summary', s });
export const sendChat = (text: string) => raw({ t: 'chat', text });
export const sendEmote = (e: string) => raw({ t: 'emote', e });
export const sendSocial = (kind: SocialKind, data?: Record<string, unknown>) => raw({ t: 'social', kind, data });
export const sendSnapshot = (life: unknown, hash: string) => raw({ t: 'snapshot', life, hash });
export const sendStart = (opts: Record<string, unknown>) => raw({ t: 'start', opts });
export const sendMode = (mode: DuoMode) => raw({ t: 'mode', mode });
