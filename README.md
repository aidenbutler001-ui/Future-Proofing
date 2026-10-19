# Future Proofing

A hands-on, interactive course on using AI well: read a short page, then solve a puzzle with a real model.
Free for individuals; paid for universities and commercial use.

```
lessons/        one Markdown file per lesson (core track; on-ramp S.*, then modules 0 to 8)
fundamentals/   optional track: how models work (F1 to F6)
puzzles/        one folder per playable puzzle (puzzle.yaml: goal, hidden tests, checks, feedback)
research/       dated notes that feed quarterly reviews (not shown to learners)
webapp/         the web app (Next.js + TypeScript); reads everything above at request time
STRUCTURE.md    how the course is organised and kept current
course-design.md  goals, principles, platform options
```

To run the app, see [webapp/README.md](webapp/README.md). The app reads lessons and puzzles from this repository's root by default
(`CONTENT_DIR`), so changing the course layout is a content change, not a code change.
