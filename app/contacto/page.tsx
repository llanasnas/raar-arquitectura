import type { Metadata } from "next";
import { PageHead, SiteFoot } from "@/components/site/v2/Page";
import { ContactFormV2 } from "@/components/forms/ContactFormV2";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { copy } from "@/lib/copy";
import { routes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pide tu primera visita gratuita",
  description: `${copy.contactCta.lead} ${site.address.street}, ${site.address.city}. ${site.phone}.`,
  alternates: { canonical: routes.contact },
};

const VALID = new Set(["reforma", "obra-nueva", "rehabilitacion", "no-se"]);

// Contacto: el rótulo con la promesa, los datos del estudio en mono a la izquierda y el
// formulario a la derecha, en la misma retícula de doce columnas que el resto de la web.
export default async function ContactPage(props: PageProps<"/contacto">) {
  const sp = await props.searchParams;
  const tipo = typeof sp.tipo === "string" && VALID.has(sp.tipo) ? sp.tipo : undefined;

  return (
    <div className="page">
      <PageHead kicker="Contacto" title={copy.contactCta.title} lead={copy.contactCta.lead} />

      <section data-menu="dark" className="contact wrap">
        <div className="contact-side">
          <h2 className="t-label">{copy.form.or}</h2>
          <div className="contact-list">
            <a href={site.phoneHref} className="t-label link-line">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="t-label link-line">
              {site.email}
            </a>
            <p className="t-body">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </p>
            <p className="t-body">{site.areas.join(" · ")}</p>
          </div>
        </div>
        <div className="contact-main">
          <ContactFormV2 defaultType={tipo} />
        </div>
      </section>

      <SiteFoot />
      <BreadcrumbJsonLd items={[{ name: "Inicio", href: "/" }, { name: "Contacto", href: routes.contact }]} />
    </div>
  );
}
