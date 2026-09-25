import type { NextConfig } from "next";

// Las URL de la web antigua (HTML estático, docs/original-site/) que pueden tener enlaces o
// estar en el índice de Google: 301 a su equivalente nuevo para no perder lo ganado.
const OLD_PROJECTS: Record<string, string> = {
  co38: "co38",
  gg01: "gg01",
  im10: "im10",
  mo07: "mo07",
  pe17: "pe17",
  to39: "to39",
  vi02: "vi02",
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Las franjas de la apertura son ventanas estrechas y muy altas: `object-fit: cover`
    // escala la foto por la altura, así que piden ~1600 px de ancho aunque solo se vean 240.
    // Sin este ancho en la lista, el navegador saltaba de 1200 a 1920 y o se veía pixelado
    // o pesaba el doble de lo necesario.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048, 3840],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/works.html", destination: "/proyectos", permanent: true },
      { source: "/about.html", destination: "/estudio", permanent: true },
      { source: "/contact.html", destination: "/contacto", permanent: true },
      ...Object.entries(OLD_PROJECTS).map(([old, id]) => ({
        source: `/works${old}.html`,
        destination: `/proyectos/${id}`,
        permanent: true,
      })),
      // AR07 se llamaba «worksariño.html» (con eñe) en la web antigua
      { source: "/worksari%C3%B1o.html", destination: "/proyectos/ar07", permanent: true },
      { source: "/worksarino.html", destination: "/proyectos/ar07", permanent: true },
      // la ficha de MO23 conserva la URL /proyectos/mo07; el código nuevo también lleva a ella
      { source: "/proyectos/mo23", destination: "/proyectos/mo07", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
        ],
      },
      {
        // llms.txt se lee como texto; que no lo indexen como página suelta
        source: "/:file(llms.txt|llms-full.txt)",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;
