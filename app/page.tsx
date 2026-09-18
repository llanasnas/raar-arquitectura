import type { Metadata } from "next";
import { Cover } from "@/components/site/Cover";
import { Intro } from "@/components/site/intro/Intro";
import { SiteFoot } from "@/components/site/v2/Page";
import { Diagram } from "@/components/site/v2/Diagram";
import { About, Featured, HomeContact, Philosophy, Rule, Where } from "@/components/site/v2/Home";
import { OffGrid } from "@/components/site/v2/OffGrid";
import { getPublishedProjects, getProject } from "@/lib/content";
import { getDiagram } from "@/lib/diagram";
import { HomeJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

// La portada según la maqueta del cliente («Opción S», 18/09/2026): apertura de persiana
// sobre el vídeo, la portada con el lema y las cuatro palabras, la filosofía, el diagrama de
// obra, cuatro obras destacadas, el estudio, off grid, dónde estamos, el formulario y el pie
// con el isotipo. Entre bloques, una regla; fuera de la portada nada sale a sangre.
// El logotipo abajo a la derecha y el menú abajo a la izquierda los pone el layout.
export const metadata: Metadata = {
  title: { absolute: `${site.name} · Estudio de arquitectura en Barcelona` },
  description: site.description,
  alternates: { canonical: "/" },
};

// Las cuatro obras destacadas, en el orden de la maqueta (GV75 no va: la cambiamos por VI02).
const FEATURED_IDS = ["ar07", "co38", "vi02", "gg01"] as const;

export default function HomePage() {
  const projects = getPublishedProjects();
  const featured = FEATURED_IDS.flatMap((id) => getProject(id) ?? []);

  return (
    <>
      <Intro />
      <Cover brandCorner="br" opening />

      <Rule />
      <Philosophy />

      <Rule />
      <Diagram groups={getDiagram()} />

      <Rule />
      <Featured projects={featured} />

      <Rule />
      <About />

      <Rule />
      <OffGrid />

      <Rule />
      <Where />

      <Rule />
      <HomeContact />

      <SiteFoot mark />
      <HomeJsonLd projects={projects} />
    </>
  );
}
