import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { routes, site } from "@/lib/site";

export const metadata: Metadata = { title: "Política de privacidad", alternates: { canonical: routes.privacy }, robots: { index: false } };

export default function Page() {
  return (
    <LegalPage
      title="Política de privacidad"
      sections={[
        { h: "Responsable", p: [`${site.name}, ${site.address.street}, ${site.address.postalCode} ${site.address.city}. ${site.email}.`] },
        {
          h: "Qué datos tratamos y para qué",
          p: [
            "Los datos que envías por el formulario (nombre, email, teléfono, municipio, tipo de proyecto y mensaje) se usan únicamente para responder a tu solicitud y organizar la primera visita.",
            "La base legal es tu consentimiento, que puedes retirar en cualquier momento.",
          ],
        },
        {
          h: "Conservación y destinatarios",
          p: [
            "Conservamos los datos mientras dure la relación o hasta que pidas su supresión. No se ceden a terceros salvo obligación legal. El envío del formulario se gestiona mediante un proveedor de correo electrónico que actúa como encargado del tratamiento.",
          ],
        },
        {
          h: "Analítica",
          p: [
            "Solo si aceptas las cookies de analítica, medimos el uso de la web con Google Analytics 4 (Google Ireland Ltd.), con la IP anonimizada y sin señales de publicidad. La base legal es tu consentimiento, que puedes retirar en la página de cookies. Google puede tratar esos datos en Estados Unidos bajo el Marco de Privacidad de Datos UE-EE. UU.",
          ],
        },
        {
          h: "Tus derechos",
          p: [
            `Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${site.email}. También puedes reclamar ante la Agencia Española de Protección de Datos.`,
          ],
        },
      ]}
    />
  );
}
