"use client";

import Image from "next/image";
import { useState, type AnimationEvent } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { copy } from "@/lib/copy";

// La portada: eslogan y frase a la izquierda, lámina a la derecha.
//
// Las cuatro palabras del estudio no van sueltas: viven dentro de una frase y **mandan sobre
// la lámina**. Al pasar por encima de «atemporalidad», la lámina deja el vídeo y enseña la
// obra que lo explica, con su pie. Al salir, vuelve el vídeo. Es la única interacción de la
// portada, y sirve para algo: enseña obra mientras se lee la frase.
//
// En táctil no hay «pasar por encima», así que se toca: la palabra se queda fijada hasta que
// se toca otra o la misma.
export type Slide = { src: string; alt: string; caption: string };

// La frase es fija, así que el reparto de qué palabra manda sobre qué obra se resuelve una
// vez, fuera del render: dentro habría que llevar un contador mutable mientras se pinta.
const TOKENS = copy.hero.statement.map((token, i) => ({
  text: token.t,
  slide:
    "key" in token && token.key
      ? copy.hero.statement.slice(0, i).filter((previous) => "key" in previous && previous.key).length
      : null,
}));

export function CoverBody({ slides, opening = false }: { slides: Slide[]; opening?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [settling, setSettling] = useState(opening);
  const isOpening = settling && !reducedMotion;

  // La lámina pasa de `fixed` a estático cuando termina de recogerse: mismo nodo, sin salto.
  const onAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.animationName.includes("stage-settle")) setSettling(false);
  };

  return (
    <>
      <div className="cover-left">
        <div className="cover-text">
          <h1 className="cover-slogan">{copy.hero.h1}</h1>
          <p className="cover-sub">{copy.hero.sub}</p>
        </div>

        <p className="cover-statement" data-touched={active !== null || undefined}>
          {TOKENS.map((token, i) =>
            token.slide === null ? (
              <span key={i}>{token.text}</span>
            ) : (
              <button
                key={i}
                type="button"
                className="cover-key"
                data-active={active === token.slide || undefined}
                aria-pressed={active === token.slide}
                onPointerEnter={(event) => event.pointerType !== "touch" && setActive(token.slide)}
                onPointerLeave={(event) => event.pointerType !== "touch" && setActive(null)}
                onFocus={() => setActive(token.slide)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((current) => (current === token.slide ? null : token.slide))}
              >
                {token.text}
              </button>
            ),
          )}
        </p>

        {/* El pie de la obra va con las palabras, no sobre la foto: encima de un render claro
            el blanco no se lee, y aquí además se lee como la nota al pie de la frase. */}
        <p className="cover-note t-label" data-on={active !== null || undefined} aria-live="polite">
          {active !== null ? slides[active].caption : ""}
        </p>
      </div>

      <div className="cover-stage" data-menu="light" data-opening={isOpening || undefined} onAnimationEnd={onAnimationEnd}>
        {reducedMotion ? (
          <Image src="/hero/poster.jpg" alt="" fill priority sizes="(min-width: 900px) 50vw, 100vw" className="object-cover" />
        ) : (
          <video className="cover-video" src="/hero/im10-1080p.mp4" poster="/hero/poster.jpg" autoPlay muted loop playsInline preload="auto" />
        )}

        {slides.map((slide, i) => (
          <div key={slide.src} className="stage-slide" data-on={active === i || undefined}>
            <Image src={slide.src} alt={slide.alt} fill sizes="(min-width: 900px) 50vw, 100vw" className="object-cover" />
          </div>
        ))}
      </div>
    </>
  );
}
