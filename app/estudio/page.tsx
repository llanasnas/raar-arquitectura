import type { Metadata } from "next";
import Image from "next/image";
import { PageHead, Steps, CtaBlock, SiteFoot } from "@/components/site/v2/Page";
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

// El estudio, en lenguaje revista: rótulo y titular, y debajo el pliego de apertura con el
// primer párrafo del manifiesto en grande a la izquierda y la foto del equipo a la derecha,
// a su tamaño. La foto es de 640 px: a sangre se pixelaba y el recorte dejaba fuera a los
// tres socios, que es justo lo que enseña. Su pie es la única nota sobre quiénes son.
// El resto del manifiesto sigue a dos columnas. Después, cómo trabajan y dónde están.
export default function StudioPage() {
  const [opening, ...rest] = studioPage.manifesto;

  return (
    <div className="page">
      <PageHead kicker={studioPage.title} title={copy.studio.title} />

      <section data-menu="dark" className="studio-open wrap">
        <Reveal as="p" className="prose-lead studio-open-text" variant="up">
          {opening}
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
          <figcaption className="t-label about-cap">{studioPage.teamNote}</figcaption>
        </figure>
      </section>

      <section data-menu="dark" className="prose studio-prose wrap">
        <Reveal className="t-body cols-2" delay={80}>
          {rest.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </Reveal>
      </section>

      <Steps />

      <Where />

      <CtaBlock />
      <SiteFoot />
      <BreadcrumbJsonLd items={[{ name: "Inicio", href: "/" }, { name: studioPage.title, href: routes.studio }]} />
    </div>
  );
}
