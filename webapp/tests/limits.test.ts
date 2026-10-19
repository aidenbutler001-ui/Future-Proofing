import { beforeEach, describe, expect, it } from "vitest";
import { clientId } from "@/lib/puzzles/client-id";
import { envNumber } from "@/lib/puzzles/env";
import { checkLimits, resetLimits, trackedClients } from "@/lib/puzzles/ratelimit";

const h = (o: Record<string, string>) => ({ get: (k: string) => o[k.toLowerCase()] ?? null });
const HOUR = 3_600_000;

describe("envNumber", () => {
  it("falls back on junk, zero, negatives and empty values", () => {
    for (const v of ["abc", "0", "-5", "", "  ", "NaN", "Infinity", undefined]) expect(envNumber(v, 7)).toBe(7);
    expect(envNumber("12", 7)).toBe(12);
  });
});

describe("clientId", () => {
  it("ignores forwarded-for unless a trusted setup is declared", () => {
    expect(clientId(h({ "x-forwarded-for": "1.1.1.1", "x-real-ip": "2.2.2.2" }), {})).toBe("unknown");
  });
  it("uses only the declared header", () => {
    expect(clientId(h({ "x-real-ip": "2.2.2.2" }), { TRUST_IP_HEADER: "X-Real-IP" })).toBe("2.2.2.2");
  });
  it("reads the Nth entry from the right, so a forged left entry changes nothing", () => {
    const env = { TRUSTED_PROXY_HOPS: "1" };
    expect(clientId(h({ "x-forwarded-for": "6.6.6.6, 9.9.9.9" }), env)).toBe("9.9.9.9");
    expect(clientId(h({ "x-forwarded-for": "7.7.7.7, 9.9.9.9" }), env)).toBe("9.9.9.9");
  });
  it("falls back to one shared bucket when the header is missing", () => {
    expect(clientId(h({}), { TRUSTED_PROXY_HOPS: "1" })).toBe("unknown");
  });
});

describe("checkLimits", () => {
  beforeEach(resetLimits);
  const env = { RATE_LIMIT_PER_HOUR: "2", RATE_LIMIT_CALLS_PER_HOUR: "10", DAILY_RUN_CAP: "100", DAILY_CALL_CAP: "100" };

  it("caps runs per client per hour and frees them after the hour", () => {
    expect(checkLimits("a", 1, 0, env).ok).toBe(true);
    expect(checkLimits("a", 1, 1, env).ok).toBe(true);
    const third = checkLimits("a", 1, 2, env);
    expect(third.ok).toBe(false);
    expect(third.ok === false && third.retryAfterSeconds).toBeGreaterThan(0);
    expect(checkLimits("b", 1, 3, env).ok).toBe(true);
    expect(checkLimits("a", 1, HOUR + 1, env).ok).toBe(true);
  });

  it("counts model calls, not just runs", () => {
    expect(checkLimits("a", 8, 0, env).ok).toBe(true);
    expect(checkLimits("a", 3, 1, env).ok).toBe(false); // 8 + 3 > 10
    expect(checkLimits("a", 2, 2, env).ok).toBe(true);
  });

  it("caps total runs and total calls per day across clients", () => {
    const e = { ...env, RATE_LIMIT_PER_HOUR: "50", RATE_LIMIT_CALLS_PER_HOUR: "500", DAILY_RUN_CAP: "3", DAILY_CALL_CAP: "20" };
    expect(checkLimits("a", 9, 0, e).ok).toBe(true);
    expect(checkLimits("b", 9, 1, e).ok).toBe(true);
    expect(checkLimits("c", 9, 2, e).ok).toBe(false); // 27 calls > 20
    expect(checkLimits("c", 1, 3, e).ok).toBe(true);
    expect(checkLimits("d", 1, 4, e).ok).toBe(false); // 4th run
    const nextDay = 24 * HOUR + 5;
    expect(checkLimits("d", 1, nextDay, e).ok).toBe(true);
  });

  it("a non-numeric limit falls back to the default instead of disabling the limit", () => {
    const bad = { RATE_LIMIT_PER_HOUR: "lots", RATE_LIMIT_CALLS_PER_HOUR: "lots", DAILY_RUN_CAP: "x", DAILY_CALL_CAP: "x" };
    let denied = 0;
    for (let i = 0; i < 40; i++) if (!checkLimits("a", 1, i, bad).ok) denied++;
    expect(denied).toBe(10); // default 30 runs per hour
  });

  it("drops stale clients so the table cannot grow forever", () => {
    for (let i = 0; i < 50; i++) checkLimits(`c${i}`, 1, 0, env);
    expect(trackedClients()).toBe(50);
    checkLimits("late", 1, 2 * HOUR, env);
    expect(trackedClients()).toBe(1);
  });
});
