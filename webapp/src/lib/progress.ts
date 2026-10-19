"use client";
import { useSyncExternalStore } from "react";

/** Progress lives on the learner's device only (localStorage). Nothing is sent to a server. */
export interface Progress {
  completed: Record<string, string>; // lesson id -> ISO time
  drafts: Record<string, string>; // key -> text (puzzle drafts, reflections)
}

const KEY = "fp:progress:v1";
const EMPTY: Progress = { completed: {}, drafts: {} };
const listeners = new Set<() => void>();
let cache: Progress | null = null;

function read(): Progress {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

function write(next: Progress) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage may be blocked (private window); progress then lasts for this visit only.
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function markComplete(id: string, done = true) {
  const p = read();
  const completed = { ...p.completed };
  if (done) completed[id] = new Date().toISOString();
  else delete completed[id];
  write({ ...p, completed });
}

export function saveDraft(key: string, text: string) {
  const p = read();
  write({ ...p, drafts: { ...p.drafts, [key]: text } });
}
