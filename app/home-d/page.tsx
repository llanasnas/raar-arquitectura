import type { Metadata } from "next";
import { Cover } from "@/components/site/Cover";
import { Intro } from "@/components/site/intro/Intro";
import { Band, Closing, MANIFESTO_LINE } from "@/components/site/v2/Pieces";
import { StackD } from "@/components/site/v2/StackD";
import { DuoScroll } from "@/components/site/v2/DuoScroll";
import { getFeaturedProjects } from "@/lib/content";
import { copy } from "@/lib/copy";
import { HomeJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

// Propuesta D de home: «Cuadernillo». Cada obra es una página a pantalla completa que se
// queda pegada mientras la siguiente sube por encima, con el folio en el lateral; luego un
// interludio de dos columnas a distinta velocidad y el cierre.
export const metadata: Metadata = {
  title: { absolute: `${site.name} · home D · cuadernillo` },
  description: site.description,
  robots: { index: false, follow: false },
};

export default function HomeDPage() {
  const projects = getFeaturedProjects();

  return (
    <>
      <Intro />
      <Cover brandCorner="br" opening />

      <Band index="Cuadernillo" title={copy.featured.title} lead={copy.featured.lead} />
      <StackD projects={projects} />

      <DuoScroll projects={projects} text={MANIFESTO_LINE} />

      <Closing />
      <HomeJsonLd projects={projects} />
    </>
  );
}
