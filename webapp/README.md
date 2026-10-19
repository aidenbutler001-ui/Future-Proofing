# Future Proofing web app

Next.js (App Router) + TypeScript. Renders the course from plain content files and runs puzzles
through a thin server-side model-calling API.

## Run it

```bash
npm install
cp .env.example .env.local        # optional; add ANTHROPIC_API_KEY for the live model
npm run dev                       # http://localhost:3000
npm test                          # unit tests (checks, runner, rate limit)
npm run build && npm start        # production
```

Without `ANTHROPIC_API_KEY` the puzzle runner uses a built-in simulated model (approximate scores).
**Keys go in the environment or `.env.local` on the machine that runs the app, never in the shared project folder.**
Run `npm install` on a local disk, not on the shared network folder (copy the source out first).

## Content comes from files, not code

The app reads `CONTENT_DIR` (default: the folder above `webapp/`) on every request, so adding,
renaming or reordering lessons needs no rebuild.

| Path | What it does |
|---|---|
| `lessons/<id>-<slug>.md` | One lesson per file. The id comes from the file name (`2.4-...`); order is by id (`S` first, then numeric). Frontmatter: title, level, prereqs, concept, right_now, last_reviewed, owner. Sections `## Read / Example / Opsec check / Puzzle / Hints / Reflect` get their own treatment; any other `##` section renders as a plain card. |
| `fundamentals/F<n>-<slug>.md` | Optional track. Each `## F1.1 Title` section becomes a lesson. |
| `puzzles/<name>/puzzle.yaml` | Makes a lesson's puzzle playable; attached by `lesson: "2.4"`. Schema: `src/lib/puzzles/types.ts`. Lessons without one show the written brief and a "being built" note. |
| `modules.json` (optional) | `{"2": "Prompting"}` overrides module titles or adds new modules. |

Hidden-test and grader bullets in a lesson's Puzzle section are hidden from learners. The browser never receives test
messages or checks until after a run.

### Puzzle spec in short

A puzzle has a learner text field (the system prompt), optional `field_checks` (free, instant checks on that text),
and `tests`. Tests that share a `group` are alternatives; one is drawn per run (rotation). Each test has a hidden user
message and `checks`: `contains`, `not_contains`, `regex`, `not_regex`, `max_sentences`, `max_words`, `min_words`,
`json_valid`, `json_keys`, `json_equals`, and `judge` (model-judged rubric; optional `fallback_regex` for practice mode).
Every check carries `feedback` that names the idea. `repeats` re-runs each test for live-model variance.
`simulator` names a built-in fake model (`src/lib/puzzles/simulators.ts`) for practice mode.

## Backend

- `POST /api/puzzles/<id>/run` with `{ "input": "..." }` runs the hidden tests and returns per-test results.
- `GET /api/health` reports lesson count, whether a live model is configured, and puzzle files that failed to load.
- Models: `PUZZLE_MODEL` (default `claude-haiku-5-5`) answers the learner's prompt; `JUDGE_MODEL` (default `claude-sonnet-5-5`) grades `judge` checks.
- Abuse limits (in memory; use a shared store for several instances): per client `RATE_LIMIT_PER_HOUR` runs and `RATE_LIMIT_CALLS_PER_HOUR` model calls, and overall `DAILY_RUN_CAP` runs and `DAILY_CALL_CAP` model calls. Invalid values fall back to the defaults.
- Client identity for those limits comes only from a header you declare trusted (`TRUST_IP_HEADER`, or `TRUSTED_PROXY_HOPS` for X-Forwarded-For). Set one when deploying behind a proxy; otherwise all callers share a single strict bucket.
- Learner text is never logged.

## Not built yet

Accounts and server-side progress (progress is in the browser's localStorage), instructor or class spaces and the paid
tier, more puzzle modes (user-message and multi-turn puzzles, agent/tool simulators, code puzzles for the fundamentals
track), spaced review, and the quarterly freshness job. The live-model path (`src/lib/puzzles/model.ts`) is written
but has not been run against the API yet because no key was available here.
