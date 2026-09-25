import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, SiteFoot } from "@/components/site/v2/Page";
import { ContactSpread } from "@/components/site/v2/Home";
import { PostList } from "@/components/site/v2/Editorial";
import { BlogJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPosts, getZones } from "@/lib/editorial";
import { copy, editorialCopy } from "@/lib/copy";
import { routes, site } from "@/lib/site";

const t = editorialCopy.blog;

export const metadata: Metadata = {
  title: { absolute: `${t.metaTitle} | ${site.shortName}` },
  description: t.lead,
  alternates: { canonical: routes.blog },
  openGraph: { title: t.metaTitle, description: t.lead, url: routes.blog, type: "website" },
};

// El índice del blog: filas con regla y, arriba, las zonas como filtros de lectura (enlazan a
// la página de cada zona, que ya lista sus artículos).
export default function BlogPage() {
  const posts = getPosts();
  const zones = getZones();
  return (
    <div className="page">
      <PageHead kicker={t.kicker} title={t.title} lead={t.lead}>
        <nav aria-label={editorialCopy.zones.kicker} className="filters">
          {zones.map((z) => (
            <Link key={z.slug} href={routes.zone(z.slug)} className="t-label filter">
              {z.name}
            </Link>
          ))}
        </nav>
      </PageHead>
      <section data-menu="dark" className="wrap posts-index">
        <PostList posts={posts} />
      </section>
      {/* el blog cierra con el formulario, no con la llamada a la visita (usuario, 25/09) */}
      <ContactSpread title={copy.contactCta.title} id="contacto" />
      <SiteFoot />
      <BlogJsonLd posts={posts} />
      <BreadcrumbJsonLd items={[{ name: "Inicio", href: "/" }, { name: t.kicker, href: routes.blog }]} />
    </div>
  );
}
