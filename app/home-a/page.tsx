import type { Metadata } from "next";
import { Cover } from "@/components/site/Cover";
import { SlatsIntro } from "@/components/site/intro/SlatsIntro";
import { Band, Closing, MANIFESTO_LINE, Statement } from "@/components/site/v2/Pieces";
import { SpreadA } from "@/components/site/v2/SpreadA";
import { getFeaturedProjects } from "@/lib/content";
import { copy } from "@/lib/copy";
import { HomeJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

// Propuesta A de home: «Pliego». Misma apertura y misma portada; lo que cambia es el scroll,
// donde cada obra ocupa un pliego con la ficha pegada y las láminas pasando al lado.
export const metadata: Metadata = {
  title: { absolute: `${site.name} · home A · pliego` },
  description: site.description,
  robots: { index: false, follow: false },
};

export default function HomeAPage() {
  const projects = getFeaturedProjects();

  return (
    <>
      <SlatsIntro />
      <Cover brandCorner="br" opening />

      <section data-menu="dark" className="pliegos">
        <Band index={`01 — ${String(projects.length).padStart(2, "0")}`} title={copy.featured.title} lead={copy.featured.lead} />
        {projects.slice(0, 4).map((project, i) => (
          <SpreadA key={project.id} project={project} index={i} />
        ))}
      </section>

      <Statement text={MANIFESTO_LINE} />

      <section data-menu="dark" className="pliegos">
        {projects.slice(4).map((project, i) => (
          <SpreadA key={project.id} project={project} index={i + 4} />
        ))}
      </section>

      <Closing />
      <HomeJsonLd projects={projects} />
    </>
  );
}
