import { buildLlmsFullTxt } from "@/lib/llms";

// /llms-full.txt – full bilingual content (tracks, achievements, live FAQ) for AI assistants
export async function GET() {
  return new Response(await buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
