"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore, type AnimationEvent } from "react";
import { routes } from "@/lib/site";
import { useTone } from "@/lib/use-tone";
import { site } from "@/lib/site";

// El logotipo fijo de la web, y también el enlace a la portada: es la otra mitad de la barra
// de abajo (menú a la izquierda, marca a la derecha).
//
// **Es el mismo elemento durante la apertura y después**:
// empieza grande en el centro y viaja a su esquina, donde se queda mientras se hace scroll.
// No hay relevo entre un logotipo de la apertura y otro de la portada, así que no hay
// ningún instante en que desaparezca y vuelva a aparecer.
//
// Cuando termina el viaje se quita la clase de la apertura: a partir de ahí el color lo
// decide el tono de la sección que tenga debajo, igual que en el menú.
export type BrandIntro = "ident" | "video" | "reveal" | "slats";
export type BrandCorner = "tl" | "br";

const REDUCED = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

export function SiteBrand({ intro, corner = "tl" }: { intro?: BrandIntro; corner?: BrandCorner }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [landed, setLanded] = useState(false);
  const reducedMotion = useReducedMotion();
  // Sin movimiento no hay viaje: el logotipo ya está en su esquina y manda el tono.
  const travelling = Boolean(intro) && !landed && !reducedMotion;
  const tone = useTone(ref, !travelling);

  // `intro-logo-land` es la animación del viaje; las demás (tinta, barrido) terminan antes.
  const onAnimationEnd = (event: AnimationEvent<HTMLAnchorElement>) => {
    if (event.animationName.includes("intro-logo-land")) setLanded(true);
  };

  return (
    <Link
      ref={ref}
      href={routes.home}
      aria-label={`${site.name} · Inicio`}
      className="brandmark brand-fixed"
      data-corner={corner}
      data-intro={travelling ? intro : undefined}
      data-tone={travelling ? undefined : tone}
      onAnimationEnd={onAnimationEnd}
    />
  );
}
