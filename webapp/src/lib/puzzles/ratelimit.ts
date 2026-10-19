/**
 * In-memory abuse limits for the free tier: runs per client per hour, and a global daily cap.
 * Single-process only. A multi-instance deployment should move this to a shared store (Redis etc.).
 */
const HOUR = 60 * 60 * 1000;
const hits = new Map<string, number[]>();
let day = { key: "", count: 0 };

export function checkLimits(
  clientId: string,
  now = Date.now(),
  env = process.env,
): { ok: true } | { ok: false; reason: string; retryAfterSeconds: number } {
  const perHour = Number(env.RATE_LIMIT_PER_HOUR ?? 30);
  const dailyCap = Number(env.DAILY_RUN_CAP ?? 2000);

  const dayKey = new Date(now).toISOString().slice(0, 10);
  if (day.key !== dayKey) day = { key: dayKey, count: 0 };
  if (day.count >= dailyCap) {
    return { ok: false, reason: "The free puzzle runner has reached its daily limit. Please come back tomorrow.", retryAfterSeconds: 3600 };
  }

  const recent = (hits.get(clientId) ?? []).filter((t) => now - t < HOUR);
  if (recent.length >= perHour) {
    return { ok: false, reason: "You have used all your puzzle runs for this hour. Take a break and try again soon.", retryAfterSeconds: Math.ceil((HOUR - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  hits.set(clientId, recent);
  day.count++;
  return { ok: true };
}

export function resetLimits() {
  hits.clear();
  day = { key: "", count: 0 };
}
