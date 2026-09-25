export type OffGridEntry = {
  slug: string;
  title: string;
  category: "Eventos" | "Moda";
  summary: string;
  cover: { src: string; alt: string };
  images: { src: string; alt: string }[];
  videos?: { src: string; poster: string; label: string }[];
};

const image = (name: string, alt: string) => ({ src: `/images/off-grid/${name}.jpg`, alt });

export const offGridEntries: OffGridEntry[] = [
  {
    slug: "plqs-evento",
    title: "PLQS · Encuentro",
    category: "Eventos",
    summary: "Una jornada compartida entre diseño, música y comunidad.",
    cover: image("plqs-encuentro", "Asistentes reunidos durante el evento PLQS"),
    images: [
      image("plqs-encuentro", "Asistentes reunidos durante el evento PLQS"),
      image("plqs-moto", "Una motocicleta y prendas PLQS en el espacio"),
      image("plqs-dj", "Sesión musical durante el encuentro"),
      image("plqs-asistentes", "Conversaciones entre asistentes"),
      image("plqs-conversacion", "Participantes conversando en el evento"),
      image("plqs-espacio", "Vista general del espacio del evento"),
      image("plqs-instalacion", "Instalación y prendas expuestas"),
      image("plqs-camiseta", "Detalle de la identidad en una camiseta"),
    ],
  },
  {
    slug: "co38",
    title: "CO38",
    category: "Eventos",
    summary: "Un recorrido visual por el espacio, las piezas y su encuentro con el público.",
    cover: image("co38-instalacion", "Instalación iluminada en el espacio CO38"),
    images: [
      image("co38-instalacion", "Instalación iluminada en el espacio CO38"),
      image("co38-encuentro", "Visitantes frente a una pieza luminosa"),
      image("co38-espacio", "Vista de la instalación textil"),
      image("co38-detalles", "Detalle de una pieza expuesta"),
      image("co38-muro", "Muro con obras expuestas"),
      image("co38-documentacion", "Documentación visual de la exposición"),
      image("co38-sala", "Vista de la sala CO38"),
      image("co38-objeto", "Detalle de un objeto iluminado"),
    ],
  },
  {
    slug: "plqs-moda",
    title: "PLQS · Moda",
    category: "Moda",
    summary: "Prendas, identidad y movimiento en una serie de imágenes y vídeo.",
    cover: image("plqs-modelo", "Modelo con una camiseta PLQS"),
    images: [
      image("plqs-modelo", "Modelo con una camiseta PLQS"),
      image("plqs-prendas", "Prendas dobladas con gráfica PLQS"),
      image("plqs-espacio", "Prendas PLQS en el espacio"),
      image("plqs-identidad", "Camisetas con gráfica RAAR durante el evento"),
      image("plqs-detalle", "Detalle de la identidad gráfica de una camiseta"),
    ],
    videos: [1, 2, 3].map((n) => ({
      src: `/videos/off-grid/plqs-0${n}.mp4`,
      poster: `/videos/off-grid/plqs-0${n}-poster.jpg`,
      label: `Fragmento ${String(n).padStart(2, "0")}`,
    })),
  },
];

export const getOffGridEntry = (slug: string) => offGridEntries.find((entry) => entry.slug === slug);
