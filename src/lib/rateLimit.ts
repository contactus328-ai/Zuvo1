/**
 * Dev-safe in-memory token bucket. For production, replace with Vercel KV/Redis.
 */
type Key = string;
const BUCKET = new Map<Key, { tokens: number; resetAt: number }>();
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const hit = BUCKET.get(key);
  if (!hit || now > hit.resetAt) {
    BUCKET.set(key, { tokens: max - 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, resetIn: windowMs };
  }
  if (hit.tokens <= 0) {
    return { ok: false, remaining: 0, resetIn: Math.max(0, hit.resetAt - now) };
  }
  hit.tokens -= 1;
  return { ok: true, remaining: hit.tokens, resetIn: Math.max(0, hit.resetAt - now) };
}
