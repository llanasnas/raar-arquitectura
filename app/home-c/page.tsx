import type { Metadata } from "next";
import { Cover } from "@/components/site/Cover";
import { SlatsIntro } from "@/components/site/intro/SlatsIntro";
import { Band, Closing, MANIFESTO_LINE, Statement } from "@/components/site/v2/Pieces";
import { IndexC } from "@/components/site/v2/IndexC";
import { Feature } from "@/components/site/v2/Feature";
import { getPublishedProjects, getProject } from "@/lib/content";
import { copy } from "@/lib/copy";
import { HomeJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

// Propuesta C de home: «Índice». La página se abre como el sumario de una revista y la
// lámina de cada obra aparece al recorrerlo; después, una obra a tamaño grande.
export const metadata: Metadata = {
  title: { absolute: `${site.name} · home C · índice` },
  description: site.description,
  robots: { index: false, follow: false },
};

export default function HomeCPage() {
  const projects = getPublishedProjects();
  const feature = getProject("gg01") ?? projects[0];

  return (
    <>
      <SlatsIntro />
      <Cover brandCorner="br" opening />

      <Band index="Sumario" title={copy.featured.title} lead={copy.featured.lead} />
      <IndexC projects={projects} />

      <Feature project={feature} />
      <Statement text={MANIFESTO_LINE} />

      <Closing />
      <HomeJsonLd projects={projects} />
    </>
  );
}
