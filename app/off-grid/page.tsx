import type { Metadata } from "next";
import { SiteFoot } from "@/components/site/v2/Page";
import { OffGrid } from "@/components/site/v2/OffGrid";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { copy } from "@/lib/copy";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: copy.home.offgrid.title,
  description: copy.home.offgrid.items[0].text.slice(0, 155),
  alternates: { canonical: routes.offgrid },
};

// Off grid como página propia (cliente, 22/09/2026): antes era solo el ancla de la portada.
// Es el mismo bloque, con su rótulo de h1, y nada más: sin cierre de contacto (22/09).
// Los textos y las fotos son de relleno hasta que el cliente mande los suyos (ver copy.ts).
export default function OffGridPage() {
  return (
    <div className="page">
      <OffGrid heading="h1" />
      <SiteFoot />
      <BreadcrumbJsonLd items={[{ name: "Inicio", href: "/" }, { name: copy.home.offgrid.title, href: routes.offgrid }]} />
    </div>
  );
}
