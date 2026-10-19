import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import YAML from "yaml";
import { puzzleSchema, type PuzzleSpec, type PublicPuzzle } from "./puzzles/types";

/**
 * All course content is read from files at request time, so changing the layout (adding,
 * renaming or reordering lessons and modules) never needs a code change or a rebuild.
 *
 *   <CONTENT_DIR>/lessons/<id>-<slug>.md  one lesson per file; id comes from the file name (2.4-....md)
 *   <CONTENT_DIR>/fundamentals/F<n>-<slug>.md  one unit per file, one lesson per "## F1.1 Title" section
 *   <CONTENT_DIR>/puzzles/<name>/puzzle.yaml runnable puzzles, attached to a lesson by `lesson: "2.4"`
 *   <CONTENT_DIR>/modules.json          optional: { "2": "Prompting", ... } titles and extra modules
 */

export function contentDir(): string {
  return path.resolve(process.env.CONTENT_DIR || path.join(process.cwd(), ".."));
}

export type Track = "core" | "fundamentals";
export type SectionKind = "intro" | "read" | "example" | "opsec" | "puzzle" | "hints" | "reflect" | "other";

export interface Section {
  kind: SectionKind;
  heading: string;
  /** Text after "Puzzle:" in the heading, if any. */
  subtitle?: string;
  html: string;
  /** Numbered or bulleted items, for hints. */
  items?: string[];
}

export interface LessonMeta {
  id: string;
  title: string;
  level: number | null;
  prereqs: string[];
  concept: string;
  module: string;
  track: Track;
  puzzleTitle?: string;
  runnable: boolean;
}

export interface Lesson extends LessonMeta {
  rightNow: string;
  lastReviewed: string;
  owner: string;
  sections: Section[];
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}

export interface Module {
  key: string;
  title: string;
  track: Track;
  lessons: LessonMeta[];
}

const DEFAULT_MODULES: Record<string, string> = {
  S: "Start here: the on-ramp",
  "0": "Safety first",
  "1": "How to think about models",
  "2": "Prompting",
  "3": "Working with context and documents",
  "4": "Tools and agents",
  "5": "Harnesses and systems",
  "6": "Workflows and automation",
  "7": "Judgement and safety",
  "8": "Frontier",
  F1: "Math you need",
  F2: "Computer science for AI",
  F3: "Physics and hardware",
  F4: "Model architecture",
  F5: "How models are trained",
  F6: "Running models (inference)",
};

function readDirSafe(dir: string): string[] {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

function moduleOf(id: string): string {
  if (id.startsWith("F")) return id.split(".")[0];
  return id.split(".")[0];
}

/** Sort key: S first, then numbers; "2.10" sorts after "2.9". */
export function compareIds(a: string, b: string): number {
  const rank = (s: string) => s.split(".").map((p) => (p === "S" ? -1 : /^F?\d+$/.test(p) ? Number(p.replace("F", "")) : 0));
  const ra = rank(a);
  const rb = rank(b);
  for (let i = 0; i < Math.max(ra.length, rb.length); i++) {
    const d = (ra[i] ?? 0) - (rb[i] ?? 0);
    if (d) return d;
  }
  return 0;
}

function loadModuleTitles(): Record<string, string> {
  const file = path.join(contentDir(), "modules.json");
  try {
    return { ...DEFAULT_MODULES, ...JSON.parse(fs.readFileSync(file, "utf8")) };
  } catch {
    return DEFAULT_MODULES;
  }
}

// ---------- parsing ----------

function splitFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: raw };
  let data: Record<string, unknown> = {};
  try {
    data = (YAML.parse(m[1]) as Record<string, unknown>) ?? {};
  } catch {
    // A malformed header should not take the whole course down; the lesson falls back to its file name.
  }
  return { data, body: raw.slice(m[0].length) };
}

function kindOf(heading: string): SectionKind {
  const h = heading.toLowerCase();
  if (h.startsWith("read")) return "read";
  if (h.startsWith("example")) return "example";
  if (h.startsWith("opsec")) return "opsec";
  if (h.startsWith("puzzle")) return "puzzle";
  if (h.startsWith("hint")) return "hints";
  if (h.startsWith("reflect")) return "reflect";
  return "other";
}

function listItems(markdown: string): string[] {
  const items: string[] = [];
  for (const line of markdown.split("\n")) {
    const m = line.match(/^\s*(?:\d+[.)]|[-*])\s+(.*)$/);
    if (m) items.push(m[1].trim());
    else if (items.length && /^\s{2,}\S/.test(line)) items[items.length - 1] += " " + line.trim();
  }
  return items;
}

function renderMd(md: string): string {
  return marked.parse(md, { async: false, gfm: true }) as string;
}

function splitSections(body: string): Section[] {
  const sections: Section[] = [];
  const parts = body.split(/^## +(.+)$/m);
  const intro = parts[0].trim();
  if (intro) sections.push({ kind: "intro", heading: "", html: renderMd(intro) });
  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i].trim();
    let md = (parts[i + 1] ?? "").trim();
    const kind = kindOf(heading);
    // Hidden tests and grader notes are for course authors; learners must not see them.
    if (kind === "puzzle") md = md.split("\n").filter((l) => !/^\s*[-*]\s+(hidden tests?|grader)\b/i.test(l)).join("\n");
    const section: Section = { kind, heading, html: renderMd(md) };
    if (kind === "puzzle") section.subtitle = heading.replace(/^puzzle\s*:?\s*/i, "").trim() || undefined;
    if (kind === "hints") section.items = listItems(md);
    sections.push(section);
  }
  return sections;
}

function str(v: unknown, fallback = ""): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return v == null ? fallback : String(v);
}

interface RawLesson {
  meta: Omit<LessonMeta, "runnable">;
  rightNow: string;
  lastReviewed: string;
  owner: string;
  body: string;
}

function parseLessonFile(file: string): RawLesson | null {
  const base = path.basename(file, ".md");
  const m = base.match(/^([S\d]+\.\d+)(?:-|$)/);
  if (!m) return null; // README.md and other non-lesson files
  const id = m[1];
  const { data, body } = splitFrontmatter(fs.readFileSync(file, "utf8"));
  const puzzleHeading = body.match(/^## +Puzzle\s*:?\s*(.*)$/im);
  return {
    meta: {
      id,
      title: str(data.title, base.replace(/^[^-]*-/, "").replace(/-/g, " ")),
      level: typeof data.level === "number" ? data.level : null,
      prereqs: Array.isArray(data.prereqs) ? data.prereqs.map(String) : [],
      concept: str(data.concept),
      module: moduleOf(id),
      track: "core",
      puzzleTitle: puzzleHeading?.[1]?.trim() || undefined,
    },
    rightNow: str(data.right_now),
    lastReviewed: str(data.last_reviewed),
    owner: str(data.owner),
    body,
  };
}

/** Fundamentals files hold a whole unit: "## F1.1 Title" sections with **Level:** / **Concept:** lines. */
function parseFundamentalsFile(file: string): RawLesson[] {
  const text = fs.readFileSync(file, "utf8");
  const parts = text.split(/^## +(F\d+\.\d+)\s+(.+)$/m);
  const out: RawLesson[] = [];
  for (let i = 1; i < parts.length; i += 3) {
    const id = parts[i];
    const title = parts[i + 1].trim();
    const body = parts[i + 2];
    const level = body.match(/\*\*Level:\*\*\s*(\d)/)?.[1];
    const prereqText = body.match(/\*\*Prerequisites?:\*\*\s*([^\n]*?)(?:\s{2,}|\n|$)/)?.[1] ?? "";
    const prereqs = prereqText.match(/F?\d+\.\d+|S\.\d+/g) ?? [];
    const concept = body.match(/\*\*Concept:\*\*\s*([^\n]+)/)?.[1]?.trim() ?? "";
    const puzzle = body.match(/\*\*Puzzle\.\*\*\s*([^\n]+)/)?.[1]?.trim();
    // The metadata lines are shown as lesson header facts, so drop them from the body.
    const cleaned = body
      .split("\n")
      .filter((l) => !/^\*\*(Level|Concept):\*\*/.test(l))
      .join("\n")
      .replace(/^\s*\*\*Level:\*\*.*$/m, "");
    out.push({
      meta: { id, title, level: level ? Number(level) : null, prereqs, concept, module: moduleOf(id), track: "fundamentals", puzzleTitle: puzzle ? puzzle.split(/[.:]/)[0].slice(0, 60) : undefined },
      rightNow: "",
      lastReviewed: "",
      owner: "",
      body: "## Read\n" + cleaned.replace(/^\*\*Read\.\*\*\s*/m, ""),
    });
  }
  return out;
}

function loadRaw(): RawLesson[] {
  const dir = contentDir();
  const lessons: RawLesson[] = [];
  for (const f of readDirSafe(path.join(dir, "lessons")).filter((f) => f.endsWith(".md"))) {
    const l = parseLessonFile(path.join(dir, "lessons", f));
    if (l) lessons.push(l);
  }
  for (const f of readDirSafe(path.join(dir, "fundamentals")).filter((f) => /^F\d+.*\.md$/.test(f))) {
    lessons.push(...parseFundamentalsFile(path.join(dir, "fundamentals", f)));
  }
  return lessons;
}

// ---------- puzzles ----------

export interface PuzzleLoadError {
  file: string;
  message: string;
}

export function loadPuzzles(): { puzzles: PuzzleSpec[]; errors: PuzzleLoadError[] } {
  const root = path.join(contentDir(), "puzzles");
  const puzzles: PuzzleSpec[] = [];
  const errors: PuzzleLoadError[] = [];
  for (const d of readDirSafe(root)) {
    const file = path.join(root, d, "puzzle.yaml");
    if (!fs.existsSync(file)) continue;
    try {
      puzzles.push(puzzleSchema.parse(YAML.parse(fs.readFileSync(file, "utf8"))));
    } catch (err) {
      errors.push({ file, message: err instanceof Error ? err.message : String(err) });
    }
  }
  return { puzzles, errors };
}

export function getPuzzle(id: string): PuzzleSpec | undefined {
  return loadPuzzles().puzzles.find((p) => p.id === id);
}

export function getPuzzleForLesson(lessonId: string): PuzzleSpec | undefined {
  return loadPuzzles().puzzles.find((p) => p.lesson === lessonId);
}

export function toPublicPuzzle(spec: PuzzleSpec, hintsFromLesson: string[] | undefined, live: boolean): PublicPuzzle {
  return {
    id: spec.id,
    lesson: spec.lesson,
    title: spec.title,
    goal: spec.goal,
    field: spec.field,
    passing: spec.passing,
    testCount: new Set(spec.tests.map((t) => t.group ?? t.id)).size,
    hints: spec.hints ?? hintsFromLesson,
    live,
    hasSimulator: Boolean(spec.simulator),
  };
}

// ---------- public API ----------

export function getCourse(): { modules: Module[]; errors: PuzzleLoadError[] } {
  const titles = loadModuleTitles();
  const { puzzles, errors } = loadPuzzles();
  const runnableLessons = new Set(puzzles.map((p) => p.lesson));
  const byModule = new Map<string, Module>();
  for (const raw of loadRaw().sort((a, b) => compareIds(a.meta.id, b.meta.id))) {
    const key = raw.meta.module;
    if (!byModule.has(key)) byModule.set(key, { key, title: titles[key] ?? `Module ${key}`, track: raw.meta.track, lessons: [] });
    byModule.get(key)!.lessons.push({ ...raw.meta, runnable: runnableLessons.has(raw.meta.id) });
  }
  const modules = [...byModule.values()].sort((a, b) => (a.track === b.track ? compareIds(a.key + ".0", b.key + ".0") : a.track === "core" ? -1 : 1));
  return { modules, errors };
}

export function getLesson(id: string): Lesson | null {
  const { modules } = getCourse();
  const flat = modules.filter((m) => m.track === "core").flatMap((m) => m.lessons);
  const track = modules.filter((m) => m.track === "fundamentals").flatMap((m) => m.lessons);
  const raw = loadRaw().find((l) => l.meta.id === id);
  if (!raw) return null;
  const list = raw.meta.track === "core" ? flat : track;
  const idx = list.findIndex((l) => l.id === id);
  const nav = (l?: LessonMeta) => (l ? { id: l.id, title: l.title } : null);
  const meta = list[idx] ?? { ...raw.meta, runnable: false };
  return {
    ...meta,
    rightNow: raw.rightNow,
    lastReviewed: raw.lastReviewed,
    owner: raw.owner,
    sections: splitSections(raw.body),
    prev: nav(list[idx - 1]),
    next: nav(list[idx + 1]),
  };
}
