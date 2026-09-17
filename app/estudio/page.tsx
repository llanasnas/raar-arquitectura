import type { Metadata } from "next";
import Image from "next/image";
import { PageHead, Steps, CtaBlock, SiteFoot } from "@/components/site/v2/Page";
import { Reveal } from "@/components/site/v2/Reveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { copy, studioPage } from "@/lib/copy";
import { routes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "El estudio · tres arquitectos en Barcelona",
  description: studioPage.manifesto[0],
  alternates: { canonical: routes.studio },
};

// El estudio, en lenguaje revista: rótulo, foto a sangre y el manifiesto a dos columnas.
// El primer párrafo va grande porque es el que define al estudio; el resto, en columna de
// lectura. Después, cómo trabajan y dónde están.
export default function StudioPage() {
  const [opening, ...rest] = studioPage.manifesto;

  return (
    <div className="page">
      <PageHead kicker={studioPage.title} title={copy.studio.title} lead={studioPage.teamNote} />

      <figure className="bleed">
        <Image
          src="/images/about/team-aerial.jpg"
          alt={copy.studio.photoAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </figure>

      <section data-menu="dark" className="prose wrap">
        <Reveal as="p" className="prose-lead" variant="up">
          {opening}
        </Reveal>
        <Reveal className="t-body cols-2" delay={80}>
          {rest.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </Reveal>
      </section>

      <Steps />

      <section data-menu="dark" className="contact wrap vspace">
        <div className="contact-side">
          <h2 className="t-title">{studioPage.whereTitle}</h2>
          <div className="contact-list">
            <p className="t-body">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </p>
            <a href={site.phoneHref} className="t-label link-line">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="t-label link-line">
              {site.email}
            </a>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="t-label link-line">
              @raar.arquitectura
            </a>
          </div>
        </div>
        <div className="contact-main">
          <iframe
            title="Mapa: C/ Bruc 136, Barcelona"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${site.geo.lng - 0.006}%2C${site.geo.lat - 0.004}%2C${site.geo.lng + 0.006}%2C${site.geo.lat + 0.004}&layer=mapnik&marker=${site.geo.lat}%2C${site.geo.lng}`}
            className="map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <CtaBlock />
      <SiteFoot />
      <BreadcrumbJsonLd items={[{ name: "Inicio", href: "/" }, { name: studioPage.title, href: routes.studio }]} />
    </div>
  );
}
