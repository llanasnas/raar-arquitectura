import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, CtaBlock, SiteFoot } from "@/components/site/v2/Page";
import { Works } from "@/components/site/v2/Works";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getProjects, type Project } from "@/lib/content";
import { copy } from "@/lib/copy";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Proyectos de arquitectura en Barcelona, Vallès y Girona",
  description: copy.projects.lead,
  alternates: { canonical: routes.projects },
};

const TYPES: { key: string; label: string; match: (p: Project) => boolean }[] = [
  { key: "obra-nueva", label: "Obra nueva", match: (p) => p.typeLabel === "Obra nueva" },
  { key: "reforma", label: "Reforma integral", match: (p) => p.typeLabel === "Reforma integral" },
  { key: "rehabilitacion", label: "Rehabilitación", match: (p) => p.typeLabel === "Rehabilitación" },
  { key: "en-proceso", label: copy.projects.processing, match: (p) => p.status === "processing" },
];

// Las obras en proceso se publican en gris, así que si van en orden de archivo se amontonan
// todas al final y la última pantalla queda apagada. Se reparten entre las terminadas.
function spread(list: Project[]) {
  const done = list.filter((p) => p.status !== "processing");
  const wip = list.filter((p) => p.status === "processing");
  if (done.length === 0 || wip.length === 0) return list;
  const every = Math.ceil(done.length / wip.length);
  const out: Project[] = [];
  done.forEach((p, i) => {
    out.push(p);
    if ((i + 1) % every === 0 && wip.length) out.push(wip.shift()!);
  });
  return out.concat(wip);
}

export default async function ProjectsPage(props: PageProps<"/proyectos">) {
  const sp = await props.searchParams;
  const tipo = typeof sp.tipo === "string" ? sp.tipo : undefined;
  const all = getProjects();
  const active = TYPES.find((t) => t.key === tipo);
  const list = spread(active ? all.filter(active.match) : all);

  return (
    <div className="page">
      <PageHead kicker="Índice de obra" title={copy.projects.title} lead={copy.projects.lead} />

      {/* Filtros como sumario: etiquetas mono con una línea debajo del activo, sin píldoras. */}
      <div className="wrap">
        <nav aria-label={copy.projects.filterType} className="filters">
          <Link href={routes.projects} className="t-label filter" aria-current={!active ? "true" : undefined}>
            {copy.projects.all} <span className="filter-n">{all.length}</span>
          </Link>
          {TYPES.map((t) => {
            const n = all.filter(t.match).length;
            if (n === 0) return null;
            return (
              <Link
                key={t.key}
                href={`${routes.projects}?tipo=${t.key}`}
                className="t-label filter"
                aria-current={active?.key === t.key ? "true" : undefined}
              >
                {t.label} <span className="filter-n">{n}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {list.length === 0 ? (
        <p className="wrap t-lead vspace">{copy.projects.empty}</p>
      ) : (
        <Works projects={list} />
      )}

      <CtaBlock title={copy.projects.ctaTitle} lead={copy.projects.ctaText} />
      <SiteFoot />
      <BreadcrumbJsonLd items={[{ name: "Inicio", href: "/" }, { name: copy.projects.title, href: routes.projects }]} />
    </div>
  );
}
