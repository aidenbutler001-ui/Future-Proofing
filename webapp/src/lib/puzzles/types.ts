import { z } from "zod";

/**
 * Puzzle spec: one puzzle.yaml per folder in <CONTENT_DIR>/puzzles/.
 * Mirrors the "Puzzle spec" in STRUCTURE.md: goal, hidden tests, grader, feedback, hints.
 */

const text = z.union([z.string(), z.array(z.string())]).transform((v) => (Array.isArray(v) ? v : [v]));

export const checkSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("contains"), value: text, any: z.boolean().default(false), case_sensitive: z.boolean().default(false), feedback: z.string() }),
  z.object({ type: z.literal("not_contains"), value: text, case_sensitive: z.boolean().default(false), feedback: z.string() }),
  z.object({ type: z.literal("regex"), pattern: z.string(), flags: z.string().default("i"), feedback: z.string() }),
  z.object({ type: z.literal("not_regex"), pattern: z.string(), flags: z.string().default("i"), feedback: z.string() }),
  z.object({ type: z.literal("max_sentences"), value: z.number().int().positive(), feedback: z.string() }),
  z.object({ type: z.literal("max_words"), value: z.number().int().positive(), feedback: z.string() }),
  z.object({ type: z.literal("min_words"), value: z.number().int().positive(), feedback: z.string() }),
  z.object({ type: z.literal("json_valid"), feedback: z.string() }),
  z.object({ type: z.literal("json_keys"), keys: z.array(z.string()), feedback: z.string() }),
  /** Every key/value in `expected` must appear (deep-equal) in the parsed reply. */
  z.object({ type: z.literal("json_equals"), expected: z.record(z.string(), z.unknown()), feedback: z.string() }),
  /** Model-judged fuzzy check. Skipped (not failed) when no live judge is available. */
  z.object({
    type: z.literal("judge"),
    rubric: z.string(),
    feedback: z.string(),
    /** Cheap regex used instead when no live judge is available (practice mode). */
    fallback_regex: z.string().optional(),
  }),
]);
export type Check = z.infer<typeof checkSchema>;

export const testSchema = z.object({
  id: z.string(),
  /** Tests that share a group are alternatives; one is drawn per run (rotation). */
  group: z.string().optional(),
  label: z.string(),
  /** The hidden user message sent to the model. */
  user: z.string(),
  checks: z.array(checkSchema).min(1),
});
export type PuzzleTest = z.infer<typeof testSchema>;

export const puzzleSchema = z.object({
  id: z.string(),
  /** Lesson id this puzzle belongs to, e.g. "2.4". */
  lesson: z.string(),
  title: z.string(),
  goal: z.array(z.string()).default([]),
  /** system_prompt: learner text is the system prompt; each test supplies the user message. */
  mode: z.enum(["system_prompt"]).default("system_prompt"),
  field: z.object({
    label: z.string().default("Your answer"),
    placeholder: z.string().default(""),
    starter: z.string().optional(),
    starter_label: z.string().default("Load a weak starting point"),
    max_chars: z.number().int().positive().default(2000),
  }).default({ label: "Your answer", placeholder: "", starter_label: "Load a weak starting point", max_chars: 2000 }),
  /** Checks run on the learner's text before any model call (free, instant). */
  field_checks: z.array(checkSchema).default([]),
  /** Name of a built-in simulator used when no API key is configured. */
  simulator: z.string().optional(),
  max_tokens: z.number().int().positive().default(400),
  /** Fraction of tests that must pass to count the puzzle as solved. */
  passing: z.number().min(0).max(1).default(1),
  /** Run each test this many times (live models vary); a test passes when all runs pass. */
  repeats: z.number().int().min(1).max(5).default(1),
  /** Show the hidden user message next to the reply after a run. */
  reveal_inputs: z.boolean().default(true),
  /** Optional hint ladder; falls back to the lesson's Hints section. */
  hints: z.array(z.string()).optional(),
  tests: z.array(testSchema).min(1),
});
export type PuzzleSpec = z.infer<typeof puzzleSchema>;

/** What the browser may see: no tests, no checks. */
export interface PublicPuzzle {
  id: string;
  lesson: string;
  title: string;
  goal: string[];
  field: PuzzleSpec["field"];
  passing: number;
  testCount: number;
  hints?: string[];
  /** True when a live model is configured; otherwise runs use the simulator. */
  live: boolean;
  hasSimulator: boolean;
}

export interface TestResult {
  id: string;
  label: string;
  passed: boolean;
  user?: string;
  reply: string;
  /** Feedback for each failed check, naming the idea. */
  failures: string[];
  /** Judge checks that could not run. */
  skipped: number;
  /** The model could not answer or be graded for this test (busy, unreachable). Not the learner's fault. */
  error?: boolean;
}

export interface RunResult {
  puzzleId: string;
  /** Learner text failed a field check; no model was called. */
  fieldFailures: string[];
  tests: TestResult[];
  passedCount: number;
  total: number;
  solved: boolean;
  simulated: boolean;
  /** Some tests could not run; the score is not final and the learner should run again. */
  incomplete?: boolean;
}
