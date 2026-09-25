import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHead, SiteFoot } from "@/components/site/v2/Page";
import { Reveal } from "@/components/site/v2/Reveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { offGridEntries } from "@/lib/off-grid";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Off grid · Eventos y moda",
  description: "El archivo de eventos y moda de RAAR.",
  alternates: { canonical: routes.offgrid },
};

export default function OffGridPage() {
  return (
    <div className="page">
      <PageHead kicker="Archivo" title="Off grid" />
      <ol data-menu="dark" className="works wrap offgrid-index">
        {offGridEntries.map((entry, i) => (
          <li key={entry.slug} className="work">
            <Link href={`${routes.offgrid}/${entry.slug}`} className="work-link">
              <Reveal className="work-plate" variant="wipe" delay={(i % 2) * 90}>
                <span className="work-zoom">
                  <Image src={entry.cover.src} alt={entry.cover.alt} fill priority={i < 2} sizes="(min-width: 900px) 58vw, 100vw" className="object-cover" />
                </span>
              </Reveal>
              <div className="work-cap">
                <span className="t-label">{String(i + 1).padStart(2, "0")}. {entry.category}</span>
                <h2 className="work-name">{entry.title}</h2>
                <p className="t-body work-sum">{entry.summary}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
      <SiteFoot />
      <BreadcrumbJsonLd items={[{ name: "Inicio", href: "/" }, { name: "Off grid", href: routes.offgrid }]} />
    </div>
  );
}
