// Global site facts. Single source of truth for NAP, socials and routes.
// Mirrors content/site.json (the snapshot of the old site) but only with what the new site uses.

export const site = {
  name: "RAAR arquitectura",
  shortName: "RAAR",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.raar-arquitectura.eu",
  description:
    "Tres arquitectos en Barcelona. Reformas integrales y casas de obra nueva pensadas para durar: luz, materiales nobles y respeto por lo que tu casa ya tiene. Primera visita gratuita.",
  locale: "es",
  phone: "+34 93 488 02 56",
  phoneHref: "tel:+34934880256",
  whatsapp: "644 59 55 28",
  whatsappE164: "+34644595528",
  email: "arquitectura@raar-arquitectura.eu",
  address: {
    street: "C/ Bruc 136, bajos 2a",
    postalCode: "08037",
    city: "Barcelona",
    region: "Catalunya",
    country: "ES",
  },
  geo: { lat: 41.3979, lng: 2.1654 },
  instagram: "https://www.instagram.com/raar.arquitectura/",
  // Municipios reales donde hay proyectos publicados (prueba local + SEO geográfico)
  areas: ["Sarrià", "Gràcia", "Sant Cugat del Vallès", "La Garriga", "Gironès"],
} as const;

// wa.me link, optionally with a prefilled message
export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${site.whatsappE164.replace("+", "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const routes = {
  home: "/",
  projects: "/proyectos",
  project: (id: string) => `/proyectos/${id}`,
  services: "/servicios",
  studio: "/estudio",
  contact: "/contacto",
  legal: "/aviso-legal",
  privacy: "/privacidad",
  cookies: "/cookies",
} as const;

export const nav = [
  { label: "Proyectos", href: routes.projects },
  { label: "Servicios", href: routes.services },
  { label: "Estudio", href: routes.studio },
] as const;
