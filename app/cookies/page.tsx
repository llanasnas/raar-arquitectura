import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { ConsentSettings } from "@/components/site/Consent";
import { routes } from "@/lib/site";

export const metadata: Metadata = { title: "Política de cookies", alternates: { canonical: routes.cookies }, robots: { index: false } };

// Cookies: solo hay una categoría que pedir, la analítica. Lo demás son las técnicas que
// hacen funcionar la web. Al final, los ajustes para cambiar de opinión.
export default function Page() {
  return (
    <LegalPage
      title="Política de cookies"
      sections={[
        {
          h: "Qué son",
          p: [
            "Una cookie es un pequeño archivo que el navegador guarda al visitar una web. Sirve para que el sitio funcione, para recordar tus preferencias o para medir cómo se usa.",
          ],
        },
        {
          h: "Cookies técnicas (necesarias)",
          p: [
            "Son las que hacen funcionar la web y no requieren consentimiento. Esta web guarda en tu navegador tu decisión sobre las cookies (raar:consent, durante un año) y si ya has visto la apertura de la portada en esta sesión (raar:intro, se borra al cerrar el navegador). No se ceden a nadie.",
          ],
        },
        {
          h: "Cookies de analítica (opcionales)",
          p: [
            "Solo si las aceptas, usamos Google Analytics 4 (Google Ireland Ltd.) para saber qué páginas se ven y desde dónde, con la IP anonimizada y sin señales de publicidad. Instala las cookies _ga (2 años) y _ga_<id> (2 años). Google puede tratar estos datos en Estados Unidos bajo el Marco de Privacidad de Datos UE-EE. UU. Más información en policies.google.com/privacy.",
            "Si las rechazas o no eliges nada, no se carga ningún script de Google.",
          ],
        },
        {
          h: "Cómo cambiar de opinión",
          p: [
            "Aquí abajo puedes activar o desactivar la analítica en cualquier momento. También puedes bloquear o borrar las cookies desde la configuración de tu navegador.",
          ],
        },
      ]}
    >
      <ConsentSettings />
    </LegalPage>
  );
}
