import { buildLlmsTxt } from "@/lib/llms";

// /llms.txt – concise, markdown site guide for AI assistants & answer engines (GEO / AEO)
export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
