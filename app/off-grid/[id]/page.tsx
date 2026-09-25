import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs, SiteFoot } from "@/components/site/v2/Page";
import { LightboxItem, LightboxProvider } from "@/components/projects/Lightbox";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getOffGridEntry, offGridEntries } from "@/lib/off-grid";
import { routes, site } from "@/lib/site";

export function generateStaticParams() {
  return offGridEntries.map((entry) => ({ id: entry.slug }));
}

export async function generateMetadata(props: PageProps<"/off-grid/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const entry = getOffGridEntry(id);
  if (!entry) return {};
  return {
    title: `${entry.title} · Off grid`,
    description: entry.summary,
    alternates: { canonical: `${routes.offgrid}/${id}` },
    openGraph: { title: `${entry.title} · ${site.name}`, description: entry.summary, images: [entry.cover.src] },
  };
}

export default async function OffGridDetailPage(props: PageProps<"/off-grid/[id]">) {
  const { id } = await props.params;
  const entry = getOffGridEntry(id);
  if (!entry) notFound();
  const current = offGridEntries.findIndex((item) => item.slug === id);
  const next = offGridEntries[(current + 1) % offGridEntries.length];

  return (
    <LightboxProvider items={entry.images} label={`${entry.title} · Galería`}>
    <div className="page">
      <div data-menu="dark" className="pj-head wrap">
        <Crumbs items={[{ label: "Off grid", href: routes.offgrid }, { label: entry.category, href: routes.offgrid }, { label: entry.title }]} />
      </div>
      <LightboxItem index={0} label={entry.cover.alt} className="og-detail-cover wrap">
        <Image src={entry.cover.src} alt={entry.cover.alt} fill priority sizes="(min-width: 900px) 84vw, 100vw" className="object-cover" />
      </LightboxItem>
      <header data-menu="dark" className="og-detail-head wrap">
        <span className="t-label">{entry.category}</span>
        <h1 className="pj-project-title">{entry.title}</h1>
        <p className="t-lead">{entry.summary}</p>
      </header>
      <div data-menu="dark" data-entry={entry.slug} className="og-gallery wrap">
        {entry.images.slice(1).map((photo, i) => (
          <figure className="og-photo" key={photo.src}>
            <LightboxItem index={i + 1} label={photo.alt} className="og-photo-hit">
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 900px) 50vw, 100vw" className="object-cover" />
            </LightboxItem>
            <figcaption className="t-label">{String(i + 2).padStart(2, "0")}</figcaption>
          </figure>
        ))}
      </div>
      {entry.videos && (
        <section data-menu="dark" className="og-video-section wrap" aria-labelledby="og-video-title">
          <h2 id="og-video-title" className="sec-title">En movimiento</h2>
          <div className="og-videos">
            {entry.videos.map((clip) => (
              <figure key={clip.src}>
                <video controls playsInline preload="none" poster={clip.poster} aria-label={clip.label}>
                  <source src={clip.src} type="video/mp4" />
                  Tu navegador no puede reproducir este vídeo.
                </video>
                <figcaption className="t-label">{clip.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      <nav data-menu="dark" className="og-next wrap" aria-label="Siguiente entrada">
        <span className="t-label">Siguiente en Off grid</span>
        <Link href={`${routes.offgrid}/${next.slug}`} className="sec-title link-underline">{next.title} ↗</Link>
      </nav>
      <SiteFoot />
      <BreadcrumbJsonLd items={[{ name: "Inicio", href: "/" }, { name: "Off grid", href: routes.offgrid }, { name: entry.title, href: `${routes.offgrid}/${entry.slug}` }]} />
    </div>
    </LightboxProvider>
  );
}
