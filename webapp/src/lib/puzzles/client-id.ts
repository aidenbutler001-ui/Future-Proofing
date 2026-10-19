/**
 * Identify the caller for rate limiting without trusting what the caller can forge.
 *
 * Headers like X-Forwarded-For are client-controlled unless a trusted proxy appends to them, so they are
 * ignored unless the deployment says how many trusted proxies sit in front of the app:
 *   TRUST_IP_HEADER=x-real-ip     use a single header your platform sets and overwrites (e.g. x-real-ip, cf-connecting-ip)
 *   TRUSTED_PROXY_HOPS=1          use the Nth entry from the RIGHT of X-Forwarded-For (the hop your own proxy appended)
 * With neither set, every caller shares one "unknown" bucket: over-strict, but it cannot be bypassed.
 */
export function clientId(headers: Pick<Headers, "get">, env: Record<string, string | undefined> = process.env): string {
  const header = env.TRUST_IP_HEADER?.trim().toLowerCase();
  if (header) {
    const v = headers.get(header)?.trim();
    if (v) return v;
  }
  const hops = Number(env.TRUSTED_PROXY_HOPS);
  if (Number.isInteger(hops) && hops > 0) {
    const parts = (headers.get("x-forwarded-for") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const v = parts[parts.length - hops];
    if (v) return v;
  }
  return "unknown";
}
