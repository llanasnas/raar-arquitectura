import { getPublishedProjects } from "@/lib/content";
import { getPosts, getZones } from "@/lib/editorial";
import { copy, servicesPage } from "@/lib/copy";
import { routes, site } from "@/lib/site";
import { TYPOLOGIES } from "@/lib/typologies";

// llms.txt (https://llmstxt.org): el resumen del estudio para asistentes y buscadores con IA,
// en Markdown plano. Se genera con los mismos datos que la web (site, copy, proyectos, zonas,
// blog), así que no se desincroniza. `full` añade el texto completo de zonas y artículos.

const abs = (href: string) => `${site.url}${href}`;
// los enlaces internos del Markdown pasan a absolutos, y los títulos bajan un nivel
const demote = (md: string) =>
  md.replace(/^### /gm, "#### ").replace(/^## /gm, "### ").replace(/\]\((\/[^)]*)\)/g, (_, href) => `](${abs(href)})`);

export function buildLlms({ full = false } = {}) {
  const projects = getPublishedProjects();
  const zones = getZones();
  const posts = getPosts();
  const out: string[] = [];

  out.push(`# ${site.name}`);
  out.push("");
  out.push(`> ${site.description}`);
  out.push("");
  out.push(
    `${site.name} es un estudio de arquitectura de tres arquitectos con sede en ${site.address.street}, ${site.address.postalCode} ${site.address.city} (${site.address.region}). ` +
      `Trabaja en ${zones.map((z) => z.name).join(", ")}. ` +
      `Líneas de trabajo: ${TYPOLOGIES.map((t) => t.label.toLowerCase()).join(", ")}, además de reforma integral e interiorismo. ` +
      `La primera visita es gratuita y sin compromiso.`,
  );
  out.push("");
  out.push("## Contacto");
  out.push("");
  out.push(`- Teléfono: ${site.phone}`);
  out.push(`- WhatsApp: ${site.whatsappE164}`);
  out.push(`- Email: ${site.email}`);
  out.push(`- Dirección: ${site.address.street}, ${site.address.postalCode} ${site.address.city}`);
  out.push(`- Formulario: ${abs(routes.contact)}`);
  out.push(`- Instagram: ${site.instagram}`);
  out.push(`- LinkedIn: ${site.linkedin}`);
  out.push("");

  out.push("## Servicios");
  out.push("");
  out.push(`- [Servicios](${abs(routes.services)}): ${servicesPage.lead}`);
  for (const s of copy.services.items) out.push(`- ${s.title}: ${s.text}`);
  out.push(`- Incluye: ${servicesPage.scope.join("; ")}.`);
  out.push("");

  out.push("## Cómo trabajan");
  out.push("");
  for (const step of copy.process.steps) out.push(`${Number(step.n)}. ${step.title}: ${step.text}`);
  out.push("");

  out.push("## Dónde trabajan");
  out.push("");
  for (const z of zones) out.push(`- [${z.h1}](${abs(routes.zone(z.slug))}): ${z.description}`);
  out.push("");

  out.push("## Proyectos");
  out.push("");
  for (const p of projects) {
    out.push(`- [${p.code} · ${p.name}](${abs(routes.project(p.id))}): ${p.typeLabel}. ${p.placeFull || p.place}. ${p.summary}`);
  }
  out.push("");

  out.push("## Blog");
  out.push("");
  for (const p of posts) out.push(`- [${p.h1}](${abs(routes.post(p.slug))}): ${p.description}`);
  out.push("");

  out.push("## Preguntas frecuentes");
  out.push("");
  for (const f of copy.faq.items) {
    out.push(`### ${f.q}`);
    out.push("");
    out.push(f.a);
    out.push("");
  }

  if (full) {
    for (const z of zones) {
      out.push(`## ${z.h1}`);
      out.push("");
      out.push(`URL: ${abs(routes.zone(z.slug))}`);
      out.push("");
      out.push(z.lead);
      out.push("");
      out.push(demote(z.md));
      out.push("");
    }
    for (const p of posts) {
      out.push(`## ${p.h1}`);
      out.push("");
      out.push(`URL: ${abs(routes.post(p.slug))} · Publicado: ${p.date} · Actualizado: ${p.updated}`);
      out.push("");
      out.push(p.lead);
      out.push("");
      out.push(demote(p.md));
      out.push("");
      if (p.sources.length) {
        out.push("Fuentes:");
        for (const s of p.sources) out.push(`- ${s.label}: ${s.url}`);
        out.push("");
      }
    }
  } else {
    out.push("## Optional");
    out.push("");
    out.push(`- [Texto completo de zonas y artículos](${abs("/llms-full.txt")})`);
    out.push(`- [Estudio](${abs(routes.studio)})`);
    out.push(`- [Off grid](${abs(routes.offgrid)})`);
    out.push(`- [Sitemap](${abs("/sitemap.xml")})`);
    out.push("");
  }

  return out.join("\n");
}
