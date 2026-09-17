import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { routes } from "@/lib/site";

export const metadata: Metadata = { title: "Política de cookies", alternates: { canonical: routes.cookies }, robots: { index: false } };

export default function Page() {
  return (
    <LegalPage
      title="Política de cookies"
      sections={[
        {
          h: "Cookies que usamos",
          p: [
            "Este sitio no instala cookies de seguimiento ni de publicidad. Solo se usan las estrictamente necesarias para su funcionamiento.",
            "Si en el futuro se añade analítica, se pedirá consentimiento previo mediante un aviso y se actualizará esta política.",
          ],
        },
        { h: "Cómo desactivarlas", p: ["Puedes bloquear o eliminar cookies desde la configuración de tu navegador."] },
      ]}
    />
  );
}
