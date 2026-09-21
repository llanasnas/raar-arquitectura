import { site, routes } from "@/lib/site";
import type { Project } from "@/lib/content";

function Script({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD is static, authored here; escape "<" to be safe inside <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": ["ArchitectureFirm", "LocalBusiness"],
        "@id": `${site.url}/#org`,
        name: site.name,
        url: site.url,
        description: site.description,
        telephone: site.phone,
        email: site.email,
        image: `${site.url}/opengraph-image`,
        logo: `${site.url}/images/brand/logo-black.png`,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          postalCode: site.address.postalCode,
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          addressCountry: site.address.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
        areaServed: site.areas.map((name) => ({ "@type": "AdministrativeArea", name })),
        sameAs: [site.instagram],
        knowsAbout: ["reforma integral", "obra nueva", "rehabilitación", "arquitectura residencial"],
        priceRange: "$$$",
      }}
    />
  );
}

export function ProjectJsonLd({ project }: { project: Project }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": `${site.url}${routes.project(project.id)}`,
        name: `${project.name} (${project.code})`,
        description: project.summary,
        url: `${site.url}${routes.project(project.id)}`,
        image: project.hero ? `${site.url}${project.hero.src}` : `${site.url}${project.thumb.src}`,
        locationCreated: { "@type": "Place", name: project.placeFull || project.place },
        about: project.typeLabel,
        inLanguage: project.lang,
        author: { "@id": `${site.url}/#org` },
        creator: { "@id": `${site.url}/#org` },
        ...(project.year ? { dateCreated: project.year } : {}),
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((i) => ({
          "@type": "Question",
          name: i.q,
          acceptedAnswer: { "@type": "Answer", text: i.a },
        })),
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; href: string }[] }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: `${site.url}${it.href}`,
        })),
      }}
    />
  );
}

// Portada: el sitio y la lista de obras. La lista es lo que permite que Google (y los
// buscadores con IA) entiendan la home como un índice de proyectos y no como una página suelta.
export function HomeJsonLd({ projects }: { projects: Project[] }) {
  return (
    <>
      <Script
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${site.url}/#web`,
          url: site.url,
          name: site.name,
          inLanguage: "es-ES",
          publisher: { "@id": `${site.url}/#org` },
        }}
      />
      <Script
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Proyectos de ${site.name}`,
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          numberOfItems: projects.length,
          itemListElement: projects.map((project, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${site.url}${routes.project(project.id)}`,
            name: project.name,
          })),
        }}
      />
    </>
  );
}
