const windows = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000; // 1 minute
const LIMIT = 20;

export function isRateLimited(key: string) {
  const now = Date.now();
  const rec = windows.get(key);
  if (!rec || rec.resetAt < now) {
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count++;
  windows.set(key, rec);
  return rec.count > LIMIT;
}
