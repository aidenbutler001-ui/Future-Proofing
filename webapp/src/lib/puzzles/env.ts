/** Positive finite number from an env var, else the default. A typo must not silently disable a limit. */
export function envNumber(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return value !== undefined && value.trim() !== "" && Number.isFinite(n) && n > 0 ? n : fallback;
}
