"use client";

import { usePathname } from "next/navigation";
import { SiteBrand } from "@/components/site/SiteBrand";

// El logotipo es una pieza fija de la web, como el menú: abajo a la derecha en **todas** las
// páginas, no solo en la portada. Por eso vive en el layout y no en cada página.
//
// La apertura solo existe donde hay telón (la portada y las propuestas de home); en el resto
// el logotipo ya está en su esquina y manda el tono de lo que tenga debajo.
const OPENING = new Set(["/", "/home-a", "/home-b", "/home-c", "/home-d"]);

export function BrandSlot() {
  const pathname = usePathname();

  // La web v1 archivada conserva su propia cabecera con su logotipo.
  if (pathname.startsWith("/v1")) return null;

  // La clave lo remonta al cambiar de página: al volver a la portada el telón vuelve a
  // empezar desde el centro, y no se queda con el estado de «ya aterrizado».
  return <SiteBrand key={pathname} intro={OPENING.has(pathname) ? "slats" : undefined} corner="br" />;
}
