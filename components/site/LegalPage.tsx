import type { ReactNode } from "react";
import { PageHead, SiteFoot } from "@/components/site/v2/Page";
import { legalCopy } from "@/lib/copy";
import { site } from "@/lib/site";

// Páginas legales: el mismo papel que el resto, una sola columna de lectura y nada más.
// `children` va después de las secciones (la página de cookies pone ahí sus ajustes).
export function LegalPage({ title, sections, children }: { title: string; sections: { h: string; p: string[] }[]; children?: ReactNode }) {
  return (
    <div className="page">
      <PageHead kicker="Legal" title={title} lead={legalCopy.pending} />

      <div data-menu="dark" className="wrap vspace">
        <div className="legal">
          {sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </section>
          ))}
          {children}
          <p className="t-label">
            {site.name} · {site.address.street}, {site.address.postalCode} {site.address.city} · {site.email}
          </p>
        </div>
      </div>

      <SiteFoot />
    </div>
  );
}
