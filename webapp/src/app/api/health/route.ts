import { NextResponse } from "next/server";
import { getCourse } from "@/lib/content";

export const dynamic = "force-dynamic";

export function GET() {
  const { modules, errors } = getCourse();
  return NextResponse.json({
    ok: errors.length === 0,
    lessons: modules.reduce((n, m) => n + m.lessons.length, 0),
    modules: modules.length,
    liveModel: Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN),
    puzzleErrors: errors.map((e) => ({ file: e.file.split("/").slice(-2).join("/"), message: e.message.slice(0, 300) })),
  });
}
