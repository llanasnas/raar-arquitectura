import type { Metadata } from "next";
import { Cover } from "@/components/site/Cover";
import { Intro } from "@/components/site/intro/Intro";
import { Band, Closing, MANIFESTO_LINE, Statement } from "@/components/site/v2/Pieces";
import { StripB } from "@/components/site/v2/StripB";
import { Feature } from "@/components/site/v2/Feature";
import { getFeaturedProjects, getProject } from "@/lib/content";
import { copy } from "@/lib/copy";
import { HomeJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

// Propuesta B de home: «Cinta». Las obras pasan de lado mientras bajas, con la sección
// clavada; luego una obra a sangre corta el ritmo y se cierra con la llamada.
export const metadata: Metadata = {
  title: { absolute: `${site.name} · home B · cinta` },
  description: site.description,
  robots: { index: false, follow: false },
};

export default function HomeBPage() {
  const projects = getFeaturedProjects();
  const feature = getProject("im10") ?? projects[0];

  return (
    <>
      <Intro />
      <Cover brandCorner="br" opening />

      <Band index="Obra" title={copy.featured.title} lead={copy.featured.lead} />
      <StripB projects={projects} />

      <Statement text={MANIFESTO_LINE} />
      <Feature project={feature} />

      <Closing />
      <HomeJsonLd projects={projects} />
    </>
  );
}
