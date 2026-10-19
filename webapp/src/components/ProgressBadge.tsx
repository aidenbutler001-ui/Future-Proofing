"use client";
import { useProgress } from "@/lib/progress";

export function DoneMark({ id }: { id: string }) {
  const { completed } = useProgress();
  return completed[id] ? <span className="done" title="Completed" aria-label="Completed">✓</span> : <span className="todo" aria-hidden="true" />;
}

export function ModuleCount({ ids }: { ids: string[] }) {
  const { completed } = useProgress();
  const n = ids.filter((i) => completed[i]).length;
  return <span className="count">{n} of {ids.length} done</span>;
}

export function ContinueLink({ order, titles }: { order: string[]; titles: Record<string, string> }) {
  const { completed } = useProgress();
  const next = order.find((id) => !completed[id]);
  if (!next || next === order[0]) return null;
  return (
    <a className="btn primary" href={`/lessons/${next}`}>
      Continue: {next} {titles[next]}
    </a>
  );
}
