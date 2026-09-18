"use client";

import Image from "next/image";
import { useState, type AnimationEvent, type SyntheticEvent } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useIntroPlays } from "@/lib/intro";
import { copy } from "@/lib/copy";

// La portada (maqueta «Opción S» del cliente, 18/09/2026): el lema en caja alta y, debajo,
// las cuatro palabras del estudio en lista, a la izquierda; la lámina a la derecha.
//
// Las palabras **se encienden una a una al ritmo del vídeo**: el bucle dura doce segundos
// y cada palabra manda durante un cuarto, de arriba abajo. No es un reloj aparte: se lee
// del propio vídeo (`timeupdate`), así que si el vídeo se para, la palabra se queda.
//
// Y siguen **mandando sobre la lámina**: al pasar por encima de «atemporalidad», la lámina
// deja el vídeo y enseña la obra que la explica, con su pie debajo de la lista. Al salir,
// vuelve el vídeo. En táctil se toca y se queda fijada hasta que se toca otra o la misma.
export type Slide = { src: string; alt: string; caption: string };

const WORDS = copy.hero.words;

export function CoverBody({
  slides,
  opening = false,
}: {
  slides: Slide[];
  opening?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const plays = useIntroPlays(opening);
  const [active, setActive] = useState<number | null>(null);
  const [lit, setLit] = useState(0);
  const [settling, setSettling] = useState(opening);
  // sin apertura (atrás, menú) la lámina ya está en su sitio desde el primer fotograma
  const isOpening = settling && plays && !reducedMotion;

  // La lámina pasa de `fixed` a estático cuando termina de recogerse: mismo nodo, sin salto.
  const onAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.animationName.includes("stage-settle")) setSettling(false);
  };

  // Qué palabra toca según por dónde va el vídeo. `timeupdate` llega unas cuatro veces por
  // segundo: de sobra para un cambio cada tres.
  const onTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (!video.duration) return;
    const next = Math.min(
      WORDS.length - 1,
      Math.floor((video.currentTime / video.duration) * WORDS.length),
    );
    setLit((current) => (current === next ? current : next));
  };

  return (
    <>
      <div className="cover-left">
        <div className="cover-text">
          <h1 className="cover-slogan mb-6" aria-label={copy.hero.tagline}>
            {copy.hero.taglineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <ul
            className="cover-words"
            data-touched={active !== null || undefined}
          >
            {WORDS.map((word, i) => (
              <li key={word}>
                <button
                  type="button"
                  className="cover-key"
                  data-lit={(active === null && lit === i) || undefined}
                  data-active={active === i || undefined}
                  aria-pressed={active === i}
                  onPointerEnter={(event) =>
                    event.pointerType !== "touch" && setActive(i)
                  }
                  onPointerLeave={(event) =>
                    event.pointerType !== "touch" && setActive(null)
                  }
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() =>
                    setActive((current) => (current === i ? null : i))
                  }
                >
                  {word}
                </button>
              </li>
            ))}
          </ul>

          {/* El pie de la obra va con las palabras, no sobre la foto: encima de un render claro
              el blanco no se lee, y aquí además se lee como la nota al pie de la lista. */}
          <p
            className="cover-note t-label"
            data-on={active !== null || undefined}
            aria-live="polite"
          >
            {active !== null ? slides[active]?.caption : ""}
          </p>
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
            onTimeUpdate={onTimeUpdate}
          />
        )}

        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className="stage-slide"
            data-on={active === i || undefined}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(min-width: 900px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
}
