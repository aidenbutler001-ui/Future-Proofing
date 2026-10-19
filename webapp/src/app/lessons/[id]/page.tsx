import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getLesson, getPuzzleForLesson, toPublicPuzzle } from "@/lib/content";
import { CompleteButton, HintLadder, Reflect } from "@/components/LessonExtras";
import { PuzzleRunner } from "@/components/PuzzleRunner";
import { Prereqs } from "@/components/Prereqs";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lesson = getLesson((await params).id);
  return { title: lesson ? `${lesson.id} ${lesson.title}` : "Lesson not found" };
}

export default async function LessonPage({ params }: Props) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) notFound();

  const { modules } = getCourse();
  const mod = modules.find((m) => m.key === lesson.module);
  const all = new Map(modules.flatMap((m) => m.lessons).map((l) => [l.id, l.title]));
  const prereqs = lesson.prereqs.filter((p) => all.has(p)).map((p) => ({ id: p, title: all.get(p)! }));

  // A puzzle attaches to a lesson through `lesson: "<id>"` in its puzzle.yaml.
  const spec = getPuzzleForLesson(lesson.id);
  const hints = lesson.sections.find((s) => s.kind === "hints")?.items;
  const puzzle = spec ? toPublicPuzzle(spec, hints, Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN)) : null;

  return (
    <article className="page lesson">
      <nav className="crumb" aria-label="Breadcrumb">
        <Link href="/">Course</Link> · {mod ? `${mod.key.match(/^\d$/) ? "Module " + mod.key + " · " : ""}${mod.title}` : ""}
      </nav>
      <h1>{lesson.title}</h1>
      <p className="meta">
        <span className="chip">Lesson {lesson.id}</span>
        {lesson.level && <span className="chip">Level {lesson.level}</span>}
        {lesson.lastReviewed && <span className="chip">Reviewed {lesson.lastReviewed}</span>}
      </p>
      {lesson.concept && <p className="concept">{lesson.concept}</p>}
      <Prereqs items={prereqs} />

      {lesson.sections.map((s, i) => {
        switch (s.kind) {
          case "puzzle":
            return (
              <section className="card puzzle-card" key={i}>
                <h2>Puzzle{s.subtitle ? `: ${s.subtitle}` : ""}</h2>
                <div className="prose" dangerouslySetInnerHTML={{ __html: s.html }} />
                {puzzle ? (
                  <PuzzleRunner puzzle={puzzle} />
                ) : (
                  <p className="notice">The playable version of this puzzle is still being built. Read the brief, try it in any chat assistant, then mark the lesson complete.</p>
                )}
              </section>
            );
          case "hints":
            return (
              <section className="card" key={i}>
                <h2>Hints</h2>
                <HintLadder hints={s.items ?? []} />
              </section>
            );
          case "reflect":
            return (
              <section className="card" key={i}>
                <h2>Reflect</h2>
                <div className="prose" dangerouslySetInnerHTML={{ __html: s.html }} />
                <Reflect lessonId={lesson.id} />
              </section>
            );
          case "opsec":
            return (
              <section className="card opsec" key={i}>
                <h2>{s.heading}</h2>
                <div className="prose" dangerouslySetInnerHTML={{ __html: s.html }} />
              </section>
            );
          default:
            return (
              <section className="card" key={i}>
                {s.heading && <h2>{s.heading}</h2>}
                <div className="prose" dangerouslySetInnerHTML={{ __html: s.html }} />
                {s.kind === "read" && lesson.rightNow && (
                  <p className="rightnow"><strong>Right now:</strong> {lesson.rightNow}</p>
                )}
              </section>
            );
        }
      })}

      <div className="row done-row"><CompleteButton lessonId={lesson.id} /></div>
      <nav className="pager" aria-label="Lesson navigation">
        {lesson.prev ? <Link href={`/lessons/${lesson.prev.id}`}>← {lesson.prev.id} {lesson.prev.title}</Link> : <span />}
        {lesson.next ? <Link href={`/lessons/${lesson.next.id}`}>{lesson.next.id} {lesson.next.title} →</Link> : <span />}
      </nav>
    </article>
  );
}
