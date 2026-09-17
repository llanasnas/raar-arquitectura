import { PageHead, SiteFoot } from "@/components/site/v2/Page";
import { legalCopy } from "@/lib/copy";
import { site } from "@/lib/site";

// Páginas legales: el mismo papel que el resto, una sola columna de lectura y nada más.
export function LegalPage({ title, sections }: { title: string; sections: { h: string; p: string[] }[] }) {
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
          <p className="t-label">
            {site.name} · {site.address.street}, {site.address.postalCode} {site.address.city} · {site.email}
          </p>
        </div>
      </div>

      <SiteFoot />
    </div>
  );
}
