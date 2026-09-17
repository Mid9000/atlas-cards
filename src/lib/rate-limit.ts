const hits = new Map<string, { count: number; expires: number }>();
/** In-memory guard for a single serverless instance; use Redis/KV before multi-region scale. */
export function allow(key: string, limit: number, windowMs: number) { const now = Date.now(); const current = hits.get(key); if (!current || current.expires < now) { hits.set(key, { count: 1, expires: now + windowMs }); return true; } if (current.count >= limit) return false; current.count += 1; return true; }
