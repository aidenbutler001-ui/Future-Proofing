import { envNumber } from "./env";

/**
 * In-memory abuse limits for the free tier. Every run fans out into several paid model calls
 * (tests x repeats, plus judge calls), so limits count model calls as well as runs:
 *   per client, per hour:  RATE_LIMIT_PER_HOUR runs and RATE_LIMIT_CALLS_PER_HOUR model calls
 *   all clients, per day:  DAILY_RUN_CAP runs and DAILY_CALL_CAP model calls
 * Single-process only. A multi-instance deployment should move this to a shared store (Redis etc.).
 */
const HOUR = 60 * 60 * 1000;
const MAX_CLIENTS = 10_000;

interface Hit {
  at: number;
  calls: number;
}
const hits = new Map<string, Hit[]>();
let day = { key: "", runs: 0, calls: 0 };
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < 60_000 && hits.size <= MAX_CLIENTS) return;
  lastSweep = now;
  for (const [id, list] of hits) {
    const fresh = list.filter((h) => now - h.at < HOUR);
    if (fresh.length) hits.set(id, fresh);
    else hits.delete(id);
  }
  // Still too many distinct clients (e.g. forged identities): drop the oldest rather than grow without bound.
  while (hits.size > MAX_CLIENTS) hits.delete(hits.keys().next().value as string);
}

export type LimitResult = { ok: true } | { ok: false; reason: string; retryAfterSeconds: number };

/** `calls` is the most model calls this run can make. */
export function checkLimits(
  clientId: string,
  calls = 1,
  now = Date.now(),
  env: Record<string, string | undefined> = process.env,
): LimitResult {
  const runsPerHour = envNumber(env.RATE_LIMIT_PER_HOUR, 30);
  const callsPerHour = envNumber(env.RATE_LIMIT_CALLS_PER_HOUR, 150);
  const dailyRuns = envNumber(env.DAILY_RUN_CAP, 2000);
  const dailyCalls = envNumber(env.DAILY_CALL_CAP, 10_000);

  sweep(now);
  const dayKey = new Date(now).toISOString().slice(0, 10);
  if (day.key !== dayKey) day = { key: dayKey, runs: 0, calls: 0 };
  if (day.runs + 1 > dailyRuns || day.calls + calls > dailyCalls) {
    return { ok: false, reason: "The free puzzle runner has reached its daily limit. Please come back tomorrow.", retryAfterSeconds: 3600 };
  }

  const recent = (hits.get(clientId) ?? []).filter((h) => now - h.at < HOUR);
  const usedCalls = recent.reduce((n, h) => n + h.calls, 0);
  if (recent.length + 1 > runsPerHour || usedCalls + calls > callsPerHour) {
    const retry = recent.length ? Math.ceil((HOUR - (now - recent[0].at)) / 1000) : 3600;
    return { ok: false, reason: "You have used all your puzzle runs for this hour. Take a break and try again soon.", retryAfterSeconds: Math.max(retry, 1) };
  }
  recent.push({ at: now, calls });
  hits.set(clientId, recent);
  day.runs++;
  day.calls += calls;
  return { ok: true };
}

export function resetLimits() {
  hits.clear();
  day = { key: "", runs: 0, calls: 0 };
  lastSweep = 0;
}

export function trackedClients() {
  return hits.size;
}
