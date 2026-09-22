"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type AnimationEvent } from "react";
import { routes } from "@/lib/site";
import { useTone } from "@/lib/use-tone";
import { useIntroPlays } from "@/lib/intro";
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

// cuánto scroll basta para mandarlo a su esquina (y volver a lo grande al subir del todo)
const TOP = 40;

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

export function SiteBrand({ intro, corner = "tl", hero = false }: { intro?: BrandIntro; corner?: BrandCorner; hero?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [landed, setLanded] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const reducedMotion = useReducedMotion();
  // Solo en la portada, y solo si la apertura se ve esta vez (ver lib/intro.ts: no al volver
  // con «atrás»). Sin movimiento tampoco hay viaje: el logotipo ya está en su esquina.
  const plays = useIntroPlays(Boolean(intro));
  const travelling = plays && !landed && !reducedMotion;

  // En la portada, arriba del todo, el logotipo es el RAAR enorme que cruza la pantalla
  // (cliente, 22/09/2026); al primer scroll baja a su esquina y al volver arriba vuelve a
  // crecer. Es el mismo elemento: no hay relevo.
  useEffect(() => {
    if (!hero) return;
    const read = () => setAtTop(window.scrollY < TOP);
    read();
    window.addEventListener("scroll", read, { passive: true });
    return () => window.removeEventListener("scroll", read);
  }, [hero]);
  const big = hero && atTop;

  // grande no lee el tono: es tinta sobre el papel y sobre el vídeo, como en la maqueta
  const tone = useTone(ref, !travelling && !big);

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
      data-hero={big ? "" : undefined}
      data-intro={travelling ? intro : undefined}
      data-tone={travelling || big ? undefined : tone}
      onAnimationEnd={onAnimationEnd}
    />
  );
}
