import { buildLlms } from "@/lib/llms";

// /llms.txt: se genera en el build con los datos de la web (lib/llms.ts).
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlms(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
