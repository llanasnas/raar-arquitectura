import Link from "next/link";
import { PageHead, SiteFoot } from "@/components/site/v2/Page";
import { routes } from "@/lib/site";
import { copy } from "@/lib/copy";

export default function NotFound() {
  return (
    <div className="page">
      <PageHead
        kicker="404"
        title="Esta página no está en el plano."
        lead="Puede que el enlace sea antiguo. Los proyectos y el contacto siguen aquí."
      >
        <div className="cta-2-row">
          <Link href={routes.projects} className="link-big">
            Ver proyectos
          </Link>
          <Link href={routes.contact} className="t-label link-line">
            {copy.nav.ctaLong}
          </Link>
        </div>
      </PageHead>
      <SiteFoot />
    </div>
  );
}
