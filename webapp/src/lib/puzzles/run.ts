import { evaluateCheck } from "./checks";
import type { ModelClient } from "./model";
import type { PuzzleSpec, PuzzleTest, RunResult, TestResult } from "./types";

/** One test per group (random), plus every ungrouped test, keeping spec order. */
export function selectTests(spec: PuzzleSpec, rand: () => number = Math.random): PuzzleTest[] {
  const chosen = new Map<string, PuzzleTest>();
  for (const t of spec.tests) {
    if (!t.group) continue;
    const pool = spec.tests.filter((x) => x.group === t.group);
    if (!chosen.has(t.group)) chosen.set(t.group, pool[Math.floor(rand() * pool.length)]);
  }
  const picked = new Set(chosen.values());
  return spec.tests.filter((t) => !t.group || picked.has(t));
}

export async function runPuzzle(
  spec: PuzzleSpec,
  input: string,
  model: ModelClient,
  rand: () => number = Math.random,
): Promise<RunResult> {
  const fieldFailures: string[] = [];
  for (const check of spec.field_checks) {
    const outcome = await evaluateCheck(check, input);
    if (outcome.passed === false) fieldFailures.push(outcome.feedback);
  }
  const base = { puzzleId: spec.id, simulated: model.simulated };
  if (fieldFailures.length) {
    return { ...base, fieldFailures, tests: [], passedCount: 0, total: 0, solved: false };
  }

  const tests = selectTests(spec, rand);
  const results: TestResult[] = await Promise.all(
    tests.map(async (test): Promise<TestResult> => {
      const failures = new Set<string>();
      let skipped = 0;
      let lastReply = "";
      for (let i = 0; i < spec.repeats; i++) {
        const reply = await model.complete({
          system: input,
          user: test.user,
          maxTokens: spec.max_tokens,
          simulator: spec.simulator,
        });
        lastReply = reply;
        for (const check of test.checks) {
          const outcome = await evaluateCheck(check, reply, { userMessage: test.user, judge: model.judge });
          if (outcome.passed === false) failures.add(outcome.feedback);
          if (outcome.passed === null) skipped++;
        }
      }
      return {
        id: test.id,
        label: test.label,
        passed: failures.size === 0,
        user: spec.reveal_inputs ? test.user : undefined,
        reply: lastReply,
        failures: [...failures],
        skipped,
      };
    }),
  );

  const passedCount = results.filter((r) => r.passed).length;
  const total = results.length;
  return { ...base, fieldFailures, tests: results, passedCount, total, solved: total > 0 && passedCount / total >= spec.passing };
}
