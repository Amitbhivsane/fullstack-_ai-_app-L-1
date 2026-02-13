import { NextResponse } from "next/server";
import { z } from "zod";
import { createChatModel } from "@/lib/lc-model";

const AskResultSchema = z.object({
  summary: z.string().min(1),
  confidence: z.number().min(0),
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "query required" }, { status: 400 });
    }

    const system = "You are a concise assistant. Return only JSON.";
    const user = `Summarize for a beginner:\n"${query}"\nReturn summary & confidence`;

    const { model } = createChatModel();

    const structured = model.withStructuredOutput(AskResultSchema);

    const result = await structured.invoke([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "failed to answer" }, { status: 500 });
  }
}
