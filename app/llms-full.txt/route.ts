import { buildLlms } from "@/lib/llms";

// /llms-full.txt: lo mismo que /llms.txt más el texto entero de las zonas y del blog.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlms({ full: true }), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
