"use client";
import { useEffect, useState } from "react";
import { markComplete, saveDraft, useProgress } from "@/lib/progress";

export function HintLadder({ hints }: { hints: string[] }) {
  const [shown, setShown] = useState(0);
  return (
    <div className="hints">
      {hints.slice(0, shown).map((h, i) => (
        <p key={i} className="hint"><strong>Hint {i + 1}.</strong> {h}</p>
      ))}
      {shown < hints.length && (
        <button className="btn" onClick={() => setShown(shown + 1)}>
          {shown === 0 ? "Show a hint" : "Show the next hint"}
        </button>
      )}
    </div>
  );
}

export function Reflect({ lessonId }: { lessonId: string }) {
  const key = `reflect:${lessonId}`;
  const progress = useProgress();
  const [text, setText] = useState("");
  useEffect(() => setText(progress.drafts[key] ?? ""),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
  return (
    <>
      <label className="who" htmlFor={`r-${lessonId}`}>Your note (kept on this device)</label>
      <textarea id={`r-${lessonId}`} className="short" value={text} onChange={(e) => { setText(e.target.value); saveDraft(key, e.target.value); }} />
    </>
  );
}

export function CompleteButton({ lessonId }: { lessonId: string }) {
  const { completed } = useProgress();
  const done = Boolean(completed[lessonId]);
  return (
    <button className={`btn ${done ? "" : "primary"}`} onClick={() => markComplete(lessonId, !done)}>
      {done ? "✓ Completed (undo)" : "Mark lesson complete"}
    </button>
  );
}
