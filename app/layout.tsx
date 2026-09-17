import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Menu } from "@/components/site/Menu";
import { BrandSlot } from "@/components/site/BrandSlot";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

// Poppins para toda la web, v2 y v1: es la tipografía del cliente. Las etiquetas pequeñas
// (menú, códigos, pies) van en mayúsculas muy espaciadas, que es lo que les da el aire de
// revista; antes eso lo hacía una mono, y sobra.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Estudio de arquitectura en Barcelona`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: site.name,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#111110",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <main id="contenido">{children}</main>
        <Menu />
        <BrandSlot />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
