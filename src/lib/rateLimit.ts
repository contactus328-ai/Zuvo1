import LRUCache from "lru-cache";

type Key = string;
const windowMs = 60_000;
const max = 20;

const cache = new LRUCache<Key, { count: number; ts: number }>({
  max: 50_000,
});

export function rateLimit(key: Key, limit = max, windowMillis = windowMs) {
  const now = Date.now();
  const rec = cache.get(key);
  if (!rec || now - rec.ts > windowMillis) {
    cache.set(key, { count: 1, ts: now });
    return { ok: true, remaining: limit - 1 };
  }
  if (rec.count >= limit) return { ok: false, remaining: 0 };
  rec.count++;
  cache.set(key, rec);
  return { ok: true, remaining: limit - rec.count };
}
