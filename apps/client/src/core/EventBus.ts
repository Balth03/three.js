/** Minimal typed-ish event bus used for decoupled communication between systems. */
export type Handler = (payload: Record<string, unknown>) => void;

export class EventBus {
  private handlers = new Map<string, Set<Handler>>();
  on(event: string, h: Handler): () => void {
    let s = this.handlers.get(event);
    if (!s) { s = new Set(); this.handlers.set(event, s); }
    s.add(h);
    return () => s!.delete(h);
  }
  emit(event: string, payload: Record<string, unknown> = {}): void {
    const s = this.handlers.get(event);
    if (s) for (const h of s) h(payload);
  }
}
