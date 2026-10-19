"use client";
import Link from "next/link";
import { useProgress } from "@/lib/progress";

export function Prereqs({ items }: { items: { id: string; title: string }[] }) {
  const { completed } = useProgress();
  if (!items.length) return null;
  const missing = items.filter((i) => !completed[i.id]);
  return (
    <div className="prereqs">
      <span className="who">Builds on</span>{" "}
      {items.map((p, i) => (
        <span key={p.id}>
          {i > 0 && ", "}
          <Link href={`/lessons/${p.id}`}>{completed[p.id] ? "✓ " : ""}{p.id} {p.title}</Link>
        </span>
      ))}
      {missing.length > 0 && <p className="note">Recommended first: {missing.map((m) => m.id).join(", ")}. You can skip ahead if you already know it.</p>}
    </div>
  );
}
