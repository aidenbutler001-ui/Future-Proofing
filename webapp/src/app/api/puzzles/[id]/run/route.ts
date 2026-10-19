import { NextResponse, type NextRequest } from "next/server";
import { getPuzzle } from "@/lib/content";
import { getModelClient, ModelUnavailableError } from "@/lib/puzzles/model";
import { clientId } from "@/lib/puzzles/client-id";
import { checkLimits } from "@/lib/puzzles/ratelimit";
import { maxCalls, runPuzzle } from "@/lib/puzzles/run";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const spec = getPuzzle(id);
  if (!spec) return NextResponse.json({ error: "Unknown puzzle." }, { status: 404 });

  let input: unknown;
  try {
    ({ input } = await req.json());
  } catch {
    return NextResponse.json({ error: "Send JSON like {\"input\": \"...\"}." }, { status: 400 });
  }
  if (typeof input !== "string" || !input.trim()) {
    return NextResponse.json({ error: "Write something first, then run the tests." }, { status: 400 });
  }
  if (input.length > spec.field.max_chars) {
    return NextResponse.json({ error: `Keep it under ${spec.field.max_chars} characters.` }, { status: 400 });
  }

  const limit = checkLimits(clientId(req.headers), maxCalls(spec));
  if (!limit.ok) {
    return NextResponse.json({ error: limit.reason }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }

  try {
    const result = await runPuzzle(spec, input, getModelClient());
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ModelUnavailableError) return NextResponse.json({ error: err.message }, { status: 503 });
    // Learner text is never logged; only the failure class.
    console.error("puzzle run failed:", spec.id, err instanceof Error ? err.name : "unknown");
    return NextResponse.json({ error: "Something went wrong running your tests. Please try again." }, { status: 500 });
  }
}
