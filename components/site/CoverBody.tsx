"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type AnimationEvent } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useIntroPlays } from "@/lib/intro";
import { copy } from "@/lib/copy";

// La portada (cliente, 22/09/2026): **RAAR enorme cruzando toda la pantalla** —no vive aquí,
// es el logotipo fijo de la web en su posición grande, ver components/site/SiteBrand.tsx—,
// debajo el lema del estudio a la izquierda, y el vídeo a la derecha **a toda altura**: ya no
// se recoge para dejar la banda del menú.
//
// El lema va en dos líneas **del mismo ancho**: la de arriba, más grande y un punto más
// gruesa, se escala hasta medir lo que la de abajo. La proporción se mide una vez, con la
// fuente ya cargada, y se deja en `--l1`; el CSS lleva un valor aproximado para que el
// servidor ya pinte algo parecido.
//
// Las cuatro palabras (Arquitectura · Diseño · Atemporalidad · Rigor) y las obras que
// enseñaban al pasar por encima se quitaron el 22/09: manda el logotipo.
export function CoverBody({ opening = false }: { opening?: boolean }) {
  const reducedMotion = useReducedMotion();
  const plays = useIntroPlays(opening);
  const [settling, setSettling] = useState(opening);
  const slogan = useRef<HTMLHeadingElement>(null);
  // sin apertura (atrás, menú) la lámina ya está en su sitio desde el primer fotograma
  const isOpening = settling && plays && !reducedMotion;

  // La lámina pasa de `fixed` a estático cuando acaba la apertura: mismo nodo, sin salto.
  const onAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.animationName.includes("stage-settle")) setSettling(false);
  };

  // la primera línea del lema mide lo que la segunda: se miden las dos al mismo cuerpo y la
  // proporción va a `--l1`. Cada línea es un bloque a su ancho (`width: fit-content`).
  useEffect(() => {
    const el = slogan.current;
    if (!el) return;
    let cancelled = false;
    const fit = () => {
      if (cancelled) return;
      const [first, second] = Array.from(el.querySelectorAll<HTMLElement>("span"));
      if (!first || !second) return;
      first.style.fontSize = getComputedStyle(second).fontSize;
      const ratio = second.getBoundingClientRect().width / first.getBoundingClientRect().width;
      first.style.fontSize = "";
      if (Number.isFinite(ratio) && ratio > 0) el.style.setProperty("--l1", ratio.toFixed(4));
    };
    document.fonts.ready.then(fit);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="cover-left">
        <div className="cover-text">
          <h1 ref={slogan} className="cover-slogan" aria-label={copy.hero.tagline}>
            {copy.hero.taglineLines.map((line, i) => (
              <span key={line} className={i === 0 ? "cover-slogan-l1" : undefined}>
                {line}
              </span>
            ))}
          </h1>
        </div>
      </div>

      <div
        className="cover-stage"
        data-menu="light"
        data-opening={isOpening || undefined}
        onAnimationEnd={onAnimationEnd}
      >
        {reducedMotion ? (
          <Image
            src="/hero/poster.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 900px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <video
            className="cover-video"
            src="/hero/im10-1080p.mp4"
            poster="/hero/poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        )}
      </div>
    </>
  );
}
