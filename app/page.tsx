import type { Metadata } from "next";
import { Cover } from "@/components/site/Cover";
import { Intro } from "@/components/site/intro/Intro";
import { Closing, MANIFESTO_LINE, Statement } from "@/components/site/v2/Pieces";
import { Diagram } from "@/components/site/v2/Diagram";
import { Feature } from "@/components/site/v2/Feature";
import { getPublishedProjects, getProject } from "@/lib/content";
import { getDiagram } from "@/lib/diagram";
import { HomeJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

// La portada: la propuesta C, que es la que eligió el cliente (17/09/2026). Apertura de
// persiana sobre el vídeo, la portada con el eslogan, el diagrama de obra (cada arco una
// tipología, los códigos en el perímetro), una obra a tamaño grande y el cierre.
// El logotipo abajo a la derecha y el menú abajo a la izquierda los pone el layout.
export const metadata: Metadata = {
  title: { absolute: `${site.name} · Estudio de arquitectura en Barcelona` },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const projects = getPublishedProjects();
  const feature = getProject("gg01") ?? projects[0];

  return (
    <>
      <Intro />
      <Cover brandCorner="br" opening />

      <Diagram groups={getDiagram()} />

      <Feature project={feature} />
      <Statement text={MANIFESTO_LINE} />

      <Closing />
      <HomeJsonLd projects={projects} />
    </>
  );
}
