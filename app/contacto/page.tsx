import type { Metadata } from "next";
import { SiteFoot } from "@/components/site/v2/Page";
import { ContactSpread } from "@/components/site/v2/Home";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { copy } from "@/lib/copy";
import { routes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pide tu primera visita gratuita",
  description: `${copy.contactCta.lead} ${site.address.street}, ${site.address.city}. ${site.phone}.`,
  alternates: { canonical: routes.contact },
};

const VALID = new Set(["reforma", "obra-nueva", "rehabilitacion", "no-se"]);

// Contacto, como en la portada (guía del cliente, 21/09/2026): su título («Hazlo tuyo. Hazlo
// RAAR.») en grande, la foto del teléfono a la izquierda con los datos del estudio debajo, y el
// formulario a la derecha.
export default async function ContactPage(props: PageProps<"/contacto">) {
  const sp = await props.searchParams;
  const tipo = typeof sp.tipo === "string" && VALID.has(sp.tipo) ? sp.tipo : undefined;

  return (
    <div className="page">
      <ContactSpread
        heading="h1"
        id="contacto"
        title={copy.contactCta.title}
        defaultType={tipo}
        aside={
          <div className="contact-list">
            <h2 className="t-label">{copy.form.or}</h2>
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
        }
      />

      <SiteFoot />
      <BreadcrumbJsonLd items={[{ name: "Inicio", href: "/" }, { name: "Contacto", href: routes.contact }]} />
    </div>
  );
}
