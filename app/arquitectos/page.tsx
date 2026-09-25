import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHead, CtaBlock, SiteFoot } from "@/components/site/v2/Page";
import { Reveal } from "@/components/site/v2/Reveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getProject } from "@/lib/content";
import { getZones } from "@/lib/editorial";
import { editorialCopy } from "@/lib/copy";
import { routes, site } from "@/lib/site";

const t = editorialCopy.zones;

export const metadata: Metadata = {
  title: { absolute: `${t.metaTitle} | ${site.shortName}` },
  description: t.lead,
  alternates: { canonical: routes.zones },
  openGraph: { title: t.metaTitle, description: t.lead, url: routes.zones },
};

// Las zonas como índice: una fila por zona con su lámina (la primera obra que tenga foto) y su
// entradilla. Es el nudo que enlaza la portada, el pie y el blog con cada página local.
export default function ZonesPage() {
  const zones = getZones();
  return (
    <div className="page">
      <PageHead kicker={t.kicker} title={t.title} lead={t.lead} />
      <ol data-menu="dark" className="wrap zones">
        {zones.map((z, i) => {
          const media = z.projects
            .map((id) => getProject(id))
            .map((p) => (p ? (p.status === "published" && p.hero ? p.hero : p.thumb) : null))
            .find((m) => !!m);
          return (
            <li key={z.slug} className="zone-row">
              <Link href={routes.zone(z.slug)} className="zone-link">
                <span className="zone-plate">
                  {media ? (
                    <Reveal className="zone-img" variant="wipe" delay={(i % 2) * 90}>
                      <Image src={media.src} alt={media.alt} fill sizes="(min-width: 900px) 30vw, 100vw" className="object-cover" />
                    </Reveal>
                  ) : (
                    <span className="zone-empty t-label">{z.name}</span>
                  )}
                </span>
                <span className="zone-cap">
                  <span className="t-label">{z.region}</span>
                  <h2 className="t-title zone-name">{z.h1}</h2>
                  <p className="t-body">{z.lead}</p>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <CtaBlock />
      <SiteFoot />
      <BreadcrumbJsonLd items={[{ name: "Inicio", href: "/" }, { name: t.kicker, href: routes.zones }]} />
    </div>
  );
}
