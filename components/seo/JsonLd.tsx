import { site, routes } from "@/lib/site";
import type { Project } from "@/lib/content";
import type { Post, Zone } from "@/lib/editorial";

function Script({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD is static, authored here; escape "<" to be safe inside <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

// Lo que el estudio hace, tal como lo ordena el cliente (tipologías, guía del 21/09) más la
// reforma integral, que es el servicio que más se busca.
const SERVICES = ["Reforma integral", "Obra nueva", "Rehabilitación", "Project management", "Dirección de obra", "Interiorismo"];

// Dónde trabajan: las zonas con página propia. Andorra es un país, el resto son lugares de Cataluña.
const AREAS = [
  { "@type": "City", name: "Barcelona" },
  { "@type": "City", name: "Sant Cugat del Vallès" },
  { "@type": "AdministrativeArea", name: "Vallès Occidental" },
  { "@type": "AdministrativeArea", name: "Vallès Oriental" },
  { "@type": "AdministrativeArea", name: "Girona" },
  { "@type": "Place", name: "Costa Brava" },
  { "@type": "Country", name: "Andorra" },
  { "@type": "AdministrativeArea", name: "Catalunya" },
];

// Organización del estudio. schema.org no tiene un tipo «estudio de arquitectura»: el más
// cercano es ProfessionalService (un LocalBusiness), y lo que hacen va en knowsAbout y en el
// catálogo de servicios.
export function OrganizationJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `${site.url}/#org`,
        name: site.name,
        alternateName: site.shortName,
        url: site.url,
        description: site.description,
        telephone: site.phone,
        email: site.email,
        image: `${site.url}/opengraph-image.jpg`,
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
        hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name}, ${site.address.street}, ${site.address.city}`)}`,
        areaServed: AREAS,
        sameAs: [site.instagram, site.linkedin],
        knowsAbout: [
          "arquitectura residencial",
          "reforma integral de viviendas",
          "casas unifamiliares de obra nueva",
          "rehabilitación de naves industriales",
          "rehabilitación de masías",
          "dirección de obra",
          "project management",
          "licencias de obra",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios de arquitectura",
          itemListElement: SERVICES.map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name, provider: { "@id": `${site.url}/#org` } },
          })),
        },
        makesOffer: {
          "@type": "Offer",
          name: "Primera visita gratuita",
          price: "0",
          priceCurrency: "EUR",
        },
        priceRange: "$$$",
      }}
    />
  );
}

// Página de zona: el servicio de arquitectura en ese lugar, dado por el estudio de Barcelona.
export function ZoneJsonLd({ zone }: { zone: Zone }) {
  const url = `${site.url}${routes.zone(zone.slug)}`;
  const area =
    zone.country === "AD"
      ? { "@type": "Country", name: "Andorra" }
      : {
          "@type": "Place",
          name: zone.name,
          ...(zone.geo ? { geo: { "@type": "GeoCoordinates", latitude: zone.geo.lat, longitude: zone.geo.lng } } : {}),
          containedInPlace: { "@type": "AdministrativeArea", name: zone.region },
        };
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${url}#service`,
        name: zone.h1,
        serviceType: "Arquitectura",
        description: zone.description,
        url,
        provider: { "@id": `${site.url}/#org` },
        areaServed: [area, ...zone.places.map((name) => ({ "@type": "Place", name }))],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `Arquitectura en ${zone.name}`,
          itemListElement: SERVICES.map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
        },
      }}
    />
  );
}

// Artículo del blog. El autor es el estudio: no hay firmas personales que el cliente haya dado.
export function PostJsonLd({ post }: { post: Post }) {
  const url = `${site.url}${routes.post(post.slug)}`;
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.h1,
        description: post.description,
        url,
        mainEntityOfPage: url,
        datePublished: post.date,
        dateModified: post.updated,
        inLanguage: "es-ES",
        wordCount: post.words,
        image: `${site.url}/opengraph-image.jpg`,
        author: { "@id": `${site.url}/#org` },
        publisher: { "@id": `${site.url}/#org` },
        isPartOf: { "@id": `${site.url}/blog#blog` },
        about: post.kicker,
        citation: post.sources.map((s) => ({ "@type": "CreativeWork", name: s.label, url: s.url })),
      }}
    />
  );
}

export function BlogJsonLd({ posts }: { posts: Post[] }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${site.url}/blog#blog`,
        name: `Blog de ${site.name}`,
        url: `${site.url}${routes.blog}`,
        inLanguage: "es-ES",
        publisher: { "@id": `${site.url}/#org` },
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.h1,
          url: `${site.url}${routes.post(p.slug)}`,
          datePublished: p.date,
        })),
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
