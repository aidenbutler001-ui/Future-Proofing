import { describe, expect, it } from "vitest";
import { ModelUnavailableError, type ModelClient } from "@/lib/puzzles/model";
import { maxCalls, runPuzzle } from "@/lib/puzzles/run";
import { puzzleSchema } from "@/lib/puzzles/types";

const spec = puzzleSchema.parse({
  id: "p",
  lesson: "9.9",
  title: "t",
  repeats: 2,
  tests: [
    { id: "a", label: "a", user: "a", checks: [{ type: "contains", value: "ok", feedback: "f" }] },
    { id: "b", group: "g", label: "b", user: "b", checks: [{ type: "judge", rubric: "r", feedback: "f" }] },
    { id: "c", group: "g", label: "c", user: "c", checks: [{ type: "contains", value: "ok", feedback: "f" }] },
  ],
});

function live(complete: ModelClient["complete"], judge?: ModelClient["judge"]): ModelClient {
  return { simulated: false, complete, judge };
}

describe("maxCalls", () => {
  it("bounds calls by tests x repeats plus judge calls, taking the costliest pick per group", () => {
    // test a: 1 call x 2 repeats = 2; group g: judge test = (1 + 1) x 2 = 4
    expect(maxCalls(spec)).toBe(6);
  });
});

describe("runPuzzle with a flaky model", () => {
  it("keeps finished tests when one call is busy, and marks the run incomplete", async () => {
    const model = live(async ({ user }) => {
      if (user === "a") throw new ModelUnavailableError("busy");
      return "ok";
    });
    const res = await runPuzzle(spec, "prompt", model, () => 0.99); // picks test c from group g
    expect(res.incomplete).toBe(true);
    expect(res.solved).toBe(false);
    expect(res.tests.find((t) => t.id === "a")?.error).toBe(true);
    expect(res.tests.find((t) => t.id === "c")?.passed).toBe(true);
  });

  it("throws when nothing could run", async () => {
    const model = live(async () => {
      throw new ModelUnavailableError("busy");
    });
    await expect(runPuzzle(spec, "prompt", model)).rejects.toBeInstanceOf(ModelUnavailableError);
  });

  it("does not turn an ungraded judge check into a pass on a live model", async () => {
    const model = live(async () => "ok", async () => null);
    const res = await runPuzzle(spec, "prompt", model, () => 0); // picks judge test b
    expect(res.tests.find((t) => t.id === "b")?.error).toBe(true);
    expect(res.solved).toBe(false);
  });

  it("propagates non-availability errors", async () => {
    const model = live(async () => {
      throw new Error("bug");
    });
    await expect(runPuzzle(spec, "prompt", model)).rejects.toThrow("bug");
  });
});
