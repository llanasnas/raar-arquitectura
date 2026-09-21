import type { Metadata } from "next";
import Image from "next/image";
import { PageHead, CtaBlock, SiteFoot } from "@/components/site/v2/Page";
import { Where } from "@/components/site/v2/Home";
import { Reveal } from "@/components/site/v2/Reveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { copy, studioPage } from "@/lib/copy";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "El estudio · tres arquitectos en Barcelona",
  description: studioPage.manifesto[0],
  alternates: { canonical: routes.studio },
};

// El estudio como lo pidió el cliente en su guía (21/09/2026): igual que en su web anterior.
// Rótulo y titular («Tres miradas, un objetivo»), y debajo el manifiesto entero a la
// izquierda con la foto del equipo a la derecha, sin pie. La foto es de 640 px: a su tamaño,
// nunca a sangre. Después, cómo trabajan (una foto conceptual y las cinco líneas del
// cliente) y dónde están.
export default function StudioPage() {
  return (
    <div className="page">
      <PageHead kicker={studioPage.title} title={copy.studio.title} />

      <section data-menu="dark" className="studio-open wrap">
        <Reveal className="studio-open-text t-body studio-manifesto" variant="up">
          {studioPage.manifesto.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </Reveal>
        <figure className="studio-open-media">
          <Reveal className="studio-plate" variant="wipe" delay={80}>
            <Image
              src="/images/about/team-aerial.jpg"
              alt={copy.studio.photoAlt}
              fill
              priority
              sizes="(min-width: 900px) 640px, 100vw"
              className="object-cover"
            />
          </Reveal>
        </figure>
      </section>

      <HowWeWork />

      <Where />

      <CtaBlock />
      <SiteFoot />
      <BreadcrumbJsonLd items={[{ name: "Inicio", href: "/" }, { name: studioPage.title, href: routes.studio }]} />
    </div>
  );
}

// Cómo trabajamos: la foto conceptual a la izquierda y, a la derecha, las cinco líneas del
// cliente como una lista numerada. Sin texto debajo de cada una: no lo hay. La foto
// conceptual la tiene que mandar el cliente; hasta entonces va el diagrama de CO38.
function HowWeWork() {
  return (
    <section data-menu="dark" className="how wrap" aria-labelledby="how-title">
      <figure className="how-media">
        <Reveal className="how-plate" variant="wipe">
          <Image
            src="/images/projects/co38/concept-poster.jpg"
            alt=""
            fill
            sizes="(min-width: 900px) 42vw, 100vw"
            className="object-contain gal-ink"
          />
        </Reveal>
      </figure>
      <div className="how-text">
        <Reveal as="h2" id="how-title" className="t-display how-title" variant="up">
          {studioPage.howTitle}
        </Reveal>
        <ol className="how-list">
          {studioPage.howSteps.map((step, i) => (
            <Reveal key={step} as="li" className="how-step" delay={80 + i * 60}>
              <span className="t-label">{String(i + 1).padStart(2, "0")}</span>
              <span className="how-step-name">{step}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
