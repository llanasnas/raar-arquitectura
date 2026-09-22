"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type AnimationEvent } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useIntroPlays } from "@/lib/intro";
import { copy } from "@/lib/copy";

// La portada (maqueta «Opción S» del cliente, 18/09/2026): el lema en caja alta y, debajo,
// las cuatro palabras del estudio en lista, a la izquierda; la lámina a la derecha.
//
// Las palabras **se encienden una a una, una por segundo** (cliente, 22/09/2026; antes
// iban al ritmo del vídeo, cada tres). Con `prefers-reduced-motion` no hay pase: manda la
// primera.
//
// El lema va en dos líneas **del mismo ancho**: la de arriba, más grande y un punto más
// gruesa, se escala hasta medir lo que la de abajo. La proporción se mide una vez, con la
// fuente ya cargada, y se deja en `--l1`; el CSS lleva un valor aproximado para que el
// servidor ya pinte algo parecido.
//
// Arriba de la columna va **RAAR en grande** (solo el wordmark, sin «arquitectura»), de lado
// a lado de la columna, y el texto baja al pie (cliente, 22/09/2026). Aparece cuando el
// logotipo pequeño ha aterrizado abajo a la derecha: comparte el `data-opening` de la lámina,
// que se quita justo cuando el vídeo termina de recogerse, a la vez que aterriza el logotipo.
//
// Y siguen **mandando sobre la lámina**: al pasar por encima de «atemporalidad», la lámina
// deja el vídeo y enseña la obra que la explica, con su pie debajo de la lista. Al salir,
// vuelve el vídeo. En táctil se toca y se queda fijada hasta que se toca otra o la misma.
export type Slide = { src: string; alt: string; caption: string };

const WORDS = copy.hero.words;
const EVERY = 1000;

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
  const slogan = useRef<HTMLHeadingElement>(null);
  // sin apertura (atrás, menú) la lámina ya está en su sitio desde el primer fotograma
  const isOpening = settling && plays && !reducedMotion;

  // una palabra por segundo, en bucle
  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => setLit((current) => (current + 1) % WORDS.length), EVERY);
    return () => clearInterval(timer);
  }, [reducedMotion]);

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

  // La lámina pasa de `fixed` a estático cuando termina de recogerse: mismo nodo, sin salto.
  const onAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.animationName.includes("stage-settle")) setSettling(false);
  };

  return (
    <>
      <div className="cover-left">
        <span className="cover-mark" data-opening={isOpening || undefined} aria-hidden="true" />
        <div className="cover-text">
          <h1 ref={slogan} className="cover-slogan mb-6" aria-label={copy.hero.tagline}>
            {copy.hero.taglineLines.map((line, i) => (
              <span key={line} className={i === 0 ? "cover-slogan-l1" : undefined}>
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
