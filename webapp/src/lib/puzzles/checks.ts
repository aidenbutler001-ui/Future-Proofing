import type { Check } from "./types";

export interface CheckOutcome {
  /** null means the check could not run (e.g. a judge check with no live judge). */
  passed: boolean | null;
  feedback: string;
}

export type Judge = (rubric: string, reply: string, userMessage: string) => Promise<{ pass: boolean; reason: string } | null>;

export function countSentences(text: string): number {
  const cleaned = text.replace(/\*+|_+/g, "").trim();
  if (!cleaned) return 0;
  const ends = cleaned.match(/[.!?]+(?=\s|$|["')\]])/g)?.length ?? 0;
  const endsWithTerminator = /[.!?]["')\]]*$/.test(cleaned);
  return Math.max(1, ends + (endsWithTerminator ? 0 : 1));
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

/** Parse a whole reply as JSON. Code fences are NOT stripped: "clean JSON" means exactly JSON. */
export function parseJson(text: string): unknown | undefined {
  try {
    return JSON.parse(text.trim());
  } catch {
    return undefined;
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export async function evaluateCheck(
  check: Check,
  text: string,
  ctx: { userMessage?: string; judge?: Judge } = {},
): Promise<CheckOutcome> {
  const fail = { passed: false, feedback: check.feedback };
  const ok = { passed: true, feedback: "" };
  switch (check.type) {
    case "contains": {
      const hay = check.case_sensitive ? text : text.toLowerCase();
      const needles = check.value.map((v) => (check.case_sensitive ? v : v.toLowerCase()));
      const hit = check.any ? needles.some((n) => hay.includes(n)) : needles.every((n) => hay.includes(n));
      return hit ? ok : fail;
    }
    case "not_contains": {
      const hay = check.case_sensitive ? text : text.toLowerCase();
      const found = check.value.some((v) => hay.includes(check.case_sensitive ? v : v.toLowerCase()));
      return found ? fail : ok;
    }
    case "regex":
      return new RegExp(check.pattern, check.flags).test(text) ? ok : fail;
    case "not_regex":
      return new RegExp(check.pattern, check.flags).test(text) ? fail : ok;
    case "max_sentences":
      return countSentences(text) <= check.value ? ok : fail;
    case "max_words":
      return countWords(text) <= check.value ? ok : fail;
    case "min_words":
      return countWords(text) >= check.value ? ok : fail;
    case "json_valid":
      return parseJson(text) !== undefined ? ok : fail;
    case "json_keys": {
      const parsed = parseJson(text);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fail;
      return check.keys.every((k) => k in (parsed as object)) ? ok : fail;
    }
    case "json_equals": {
      const parsed = parseJson(text);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fail;
      const obj = parsed as Record<string, unknown>;
      return Object.entries(check.expected).every(([k, v]) => deepEqual(obj[k], v)) ? ok : fail;
    }
    case "judge": {
      const verdict = ctx.judge ? await ctx.judge(check.rubric, text, ctx.userMessage ?? "") : null;
      if (!verdict) {
        if (check.fallback_regex) return new RegExp(check.fallback_regex, "i").test(text) ? ok : fail;
        return { passed: null, feedback: check.feedback };
      }
      return verdict.pass ? ok : { passed: false, feedback: `${check.feedback}` };
    }
  }
}
