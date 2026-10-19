"use client";
import { useEffect, useState } from "react";
import type { PublicPuzzle, RunResult } from "@/lib/puzzles/types";
import { markComplete, saveDraft, useProgress } from "@/lib/progress";

export function PuzzleRunner({ puzzle }: { puzzle: PublicPuzzle }) {
  const draftKey = `puzzle:${puzzle.id}`;
  const progress = useProgress();
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);

  // Restore the saved draft once on the client; server render has no access to it.
  useEffect(() => {
    setText(progress.drafts[draftKey] ?? "");
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function edit(v: string) {
    setText(v);
    saveDraft(draftKey, v);
  }

  async function run() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/puzzles/${puzzle.id}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Something went wrong.");
        setResult(null);
      } else {
        setResult(body);
        if (body.solved) markComplete(puzzle.lesson);
      }
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const f = puzzle.field;
  return (
    <div className="puzzle">
      {!puzzle.live && (
        <p className="notice" role="note">
          Practice mode: no live model is connected, so a simple simulated model answers. Scores here are approximate.
        </p>
      )}
      {puzzle.goal.length > 0 && (
        <ul className="goal">
          {puzzle.goal.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      )}
      <p className="note">
        {puzzle.testCount} hidden test{puzzle.testCount === 1 ? "" : "s"}. You see the replies after each run, not the test list in advance.
      </p>
      <label htmlFor={`f-${puzzle.id}`} className="who">{f.label}</label>
      <textarea
        id={`f-${puzzle.id}`}
        value={ready ? text : ""}
        maxLength={f.max_chars}
        placeholder={f.placeholder}
        onChange={(e) => edit(e.target.value)}
      />
      <div className="row">
        <button className="btn primary" onClick={run} disabled={busy || !text.trim()}>
          {busy ? "Running…" : "Run tests"}
        </button>
        {f.starter && (
          <button className="btn" onClick={() => edit(f.starter!)} disabled={busy}>
            {f.starter_label}
          </button>
        )}
        <span className="note">{text.length}/{f.max_chars} · draft saved on this device</span>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <Results result={result} puzzle={puzzle} />}
    </div>
  );
}

function Results({ result, puzzle }: { result: RunResult; puzzle: PublicPuzzle }) {
  if (result.fieldFailures.length) {
    return (
      <div className="results" aria-live="polite">
        <h3>Before the tests can run</h3>
        <ul>{result.fieldFailures.map((m, i) => <li key={i}>{m}</li>)}</ul>
      </div>
    );
  }
  return (
    <div className="results" aria-live="polite">
      <div className="score">
        {result.passedCount} of {result.total} passed{result.solved ? ". Nicely done." : ""}
      </div>
      {result.simulated && <p className="note">Simulated model: a live model may behave differently.</p>}
      {result.tests.map((t) => (
        <div className="test" key={t.id}>
          {t.user && (<><div className="who">Test message</div><div className="bubble">{t.user}</div></>)}
          <div className="who">Reply</div>
          <div className="bubble bot">{t.reply}</div>
          <span className={`verdict ${t.passed ? "pass" : "fail"}`}>{t.passed ? "PASS" : "FAIL"}</span>
          {t.failures.map((m, i) => <div className="why" key={i}>{m}</div>)}
          {t.skipped > 0 && <div className="why">A quality check could not run in practice mode.</div>}
        </div>
      ))}
      {!result.solved && puzzle.hints?.length ? <p className="note">Stuck? Open a hint below.</p> : null}
    </div>
  );
}
