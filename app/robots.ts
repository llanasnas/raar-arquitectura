import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Buscadores y motores de respuesta con IA son bienvenidos: queremos que citen al estudio.
// Se nombran uno a uno para que quede claro que no es un olvido. La v1 archivada y las
// propuestas de home no se bloquean aquí a propósito: llevan `noindex`, y si el robot no
// puede entrar no ve esa etiqueta.
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "meta-externalagent",
  "MistralAI-User",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_BOTS, allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
