"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useTone } from "@/lib/use-tone";
import { routes } from "@/lib/site";

// Menú v2: abajo a la izquierda, sin fondo, en mayúsculas muy espaciadas.
// Referencia: estudiodiir.com (esquina inferior, activo marcado con un punto).
//
// Legibilidad sin fondo: cada sección declara sobre qué se lee con data-menu="light|dark"
// y el menú mira qué hay debajo (ver lib/use-tone.ts). Se probó mix-blend-mode: difference
// y falla sobre tonos medios (una piscina, un cielo gris): la inversión queda con la misma
// luminancia que el fondo.
const items = [
  { label: "Inicio", href: routes.home },
  { label: "Proyectos", href: routes.projects },
  { label: "Estudio", href: routes.studio },
  { label: "Contacto", href: routes.contact },
] as const;

export function Menu() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const hidden = pathname.startsWith("/v1");
  const tone = useTone(ref, !hidden);

  // La web v1 archivada conserva su propia navegación.
  if (hidden) return null;

  // Inicio solo se marca en la portada: con href "/" el prefijo sería "//" y no casa con
  // ninguna ruta, que es justo lo que se quiere.
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav ref={ref} aria-label="Principal" className="menu" data-tone={tone}>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
              {item.label}
              <span className="menu-dot" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
