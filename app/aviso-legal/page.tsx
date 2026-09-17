import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { routes, site } from "@/lib/site";

export const metadata: Metadata = { title: "Aviso legal", alternates: { canonical: routes.legal }, robots: { index: false } };

export default function Page() {
  return (
    <LegalPage
      title="Aviso legal"
      sections={[
        {
          h: "Titular",
          p: [
            `${site.name}. Domicilio: ${site.address.street}, ${site.address.postalCode} ${site.address.city}. Email: ${site.email}. Teléfono: ${site.phone}.`,
            "Razón social, NIF y datos de colegiación: pendientes.",
          ],
        },
        {
          h: "Objeto",
          p: ["Este sitio web informa sobre los servicios de arquitectura del estudio y permite solicitar una primera visita. El uso del sitio implica la aceptación de estas condiciones."],
        },
        {
          h: "Propiedad intelectual",
          p: ["Los textos, imágenes, renders, planos y vídeos son propiedad del estudio o de sus autores y no pueden reproducirse sin autorización."],
        },
        {
          h: "Responsabilidad",
          p: ["El estudio no se hace responsable del uso indebido de la información publicada ni de los contenidos de sitios enlazados."],
        },
      ]}
    />
  );
}
