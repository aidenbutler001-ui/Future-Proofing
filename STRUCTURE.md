# Course structure and how it is built (draft 0.1)

How the pieces fit, what a lesson contains, and how the course is kept current. Items marked **proposal** need Aiden's decision.

## 1. The map

```
Start here (S)  On-ramp: first real win and task audit   (everyone starts here)
Module 0  Safety first: data you share       (right after the on-ramp)
Core track
  1  Models: kinds, how they work, what they do
  2  Prompting
  3  Context and documents (retrieval)
  4  Tools and agents                          (opens with 4.0: agents on a computer with confidential files)
  5  Harnesses and systems
  6  Workflows and automation                (destination; flagship capstone)
  7  Judgement and safety                    (risk review of your automation)
  8  Frontier                                (living; quarterly review)
Optional track: how models work (F1 to F6)    (math, CS, physics/hardware, architecture, training, inference)
Add-ons (later): images, video, audio components
```
Order of the core track is the learning order. Each lesson lists prerequisites in its frontmatter, so a learner can skip what they know, and a tool can check that nobody reaches a lesson without its prerequisites. The on-ramp comes first so learners get a quick win; it carries a safe-start rule (public-only material) until Module 0. Safety (Module 0) is a prerequisite for Module 1. Lesson 4.0 is a prerequisite for every lesson that gives a model tools, files or access.

Levels: **1** no background, **2** comfortable with earlier lessons, **3** comfortable building small systems.

## 2. Folder layout (proposal)

```
course/
  STRUCTURE.md            this file
  course-design.md        goals, principles, platform options
  lessons/
    README.md             index of lessons with level and puzzle
    0.1-....md ... 8.7-....md
  fundamentals/
    README.md, F1-math.md ... F6-inference.md
  puzzles/                one folder per puzzle (spec, tests, grader)
    2.4-lighthouse/
  research/               dated notes that feed reviews (not shown to learners)
  changelog.md            what changed and why, by date
```

## 3. Lesson template

Frontmatter:
```
id, title, level, prereqs[], concept (one sentence), right_now (time-sensitive notes),
last_reviewed (date), owner
```
Body sections, in order:
1. **Read.** One core idea, plain language, about 5 minutes.
2. **Example.** One worked case.
3. **Opsec check and cost note.** Required when the lesson involves data, tools or access: what could leak, what to restrict. If none, write "No special risk here" so the absence is deliberate. Add a short **Cost note** wherever tokens or loops drive spend (lesson 6.5 teaches the method).
4. **Puzzle.** Goal, hidden tests, grader (see section 4).
5. **Hints.** Two or three, in order of how much they give away.
6. **Reflect.** One question that ties it to the learner's own work.

Writing rules: short sentences, no jargon before it is defined, every claim about a tool or a date lives in `right_now`, and a lesson says only what the earlier lessons have taught.

## 4. Puzzle spec

Each puzzle is a small folder:
```
puzzle.yaml     goal, passing score, time/token limits, hint ladder
inputs/         visible materials and the learner's editable field(s)
tests/          hidden cases (rotated), each with expected result
grader          rules, script, or model-judge rubric
feedback.md     what to say for each failure, naming the idea
```
Grader kinds: **rules** (exact, parse, count), **simulator** (a scripted environment, as in the prototype), **model judge** with a rubric calibrated on examples. Hidden tests are rotated so learners can't memorize them. Puzzles that use a live model are run several times and scored on the rate (lesson 5.5), not on one run.

Safety for puzzles: use fake data only. Never ask learners to upload real confidential material. Puzzles that involve files or agents run in a sandbox with no network by default.

## 5. The learning loop (recap)
Read, try, run, check, reflect, revisit. Revisit means earlier puzzles return in new form (spaced review).

## 6. Keeping the course current
- **Quarterly review.** Every lesson older than 90 days is checked: claims against primary sources, `right_now` rewritten, puzzles re-run on current models. Module 8 is rewritten most; Modules 0 and 7 are reviewed for new risks and rules.
- **Watch queue.** A running note of developments (as in `research/`). Each item is sorted: ignore, add to `right_now`, new lesson, or retire a lesson.
- **Source discipline.** Only claims found on a primary page go into lessons; secondary and disputed items stay in `research/` with a "not verified" label.
- **Changelog.** Each change gets a dated line. Learners see "what changed this quarter".
- **Ownership.** Each lesson has an owner who is responsible for its review date.

## 7. Audience and access (proposal, from Aiden's decisions)
- **Public individuals:** free. Full core track, optional track and puzzles, with fair-use limits on model calls.
- **Universities and commercial use:** paid. Candidates for what the fee covers: higher usage limits, class or team spaces with progress views for instructors, private cohorts, single sign-on, the ability to add institutional policies (lesson 7.5), custom lessons and puzzles, data-handling terms and support.
- To decide: whether progress data is stored, and where (privacy applies to the course itself; learners should never need to share real confidential data to complete it).

## 8. Platform (proposal)
Content as files in a repository; a web app that renders lessons and runs puzzles through a thin model-calling service; puzzle graders as separate scripts. Start by building Module 0 and Module 2 playable, then expand. Details in `course-design.md`.

## 9. Open decisions for Aiden
1. Name of the course and brand.
2. Where learners' progress lives (account, device only, or none at first).
3. Whether Module 0 is a hard gate (cannot proceed until passed) or strongly recommended.
4. Which model provider(s) to run puzzles on, and the usage limit for free users.
5. Who reviews content for accuracy (you, a review group, instructors at partner universities).
