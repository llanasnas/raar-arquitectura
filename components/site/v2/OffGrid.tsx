"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/v2/Reveal";
import { copy } from "@/lib/copy";

// Off grid (maqueta del cliente, 18/09/2026): lo que el estudio hace fuera de la obra, en
// dos entradas, eventos y moda. La lámina de la izquierda se queda pegada y **cambia con la
// entrada que se está leyendo**, «como en la propuesta 4» del estudio: un IntersectionObserver
// mira qué entrada cruza el centro de la pantalla. Sin JS se ve la primera lámina y el texto
// entero, que es el estado de reposo.
//
// En móvil la lámina va encima del texto y ya no está a la vista cuando la segunda entrada
// cruza el centro: ahí no manda el scroll, **van cambiando solas** (lámina y texto a la vez,
// cada pocos segundos). Con prefers-reduced-motion no hay pase: se ven las dos entradas.
//
// Textos y fotos son de relleno hasta que el cliente mande los suyos (ver lib/copy.ts).
const ITEMS = copy.home.offgrid.items;
const MOBILE = "(max-width: 899px)";
const REDUCED = "(prefers-reduced-motion: reduce)";
const EVERY = 5000;

export function OffGrid() {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const mobile = window.matchMedia(MOBILE);
    let stop = () => {};

    const start = () => {
      stop();
      if (mobile.matches) {
        if (window.matchMedia(REDUCED).matches) return;
        const timer = setInterval(() => setActive((current) => (current + 1) % ITEMS.length), EVERY);
        stop = () => clearInterval(timer);
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const index = steps.current.indexOf(entry.target as HTMLElement);
            if (index >= 0) setActive(index);
          }
        },
        // una franja estrecha a media pantalla: manda la entrada que la cruza
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
      );
      steps.current.forEach((el) => el && observer.observe(el));
      stop = () => observer.disconnect();
    };

    start();
    mobile.addEventListener("change", start);
    return () => {
      stop();
      mobile.removeEventListener("change", start);
    };
  }, []);

  return (
    <section data-menu="dark" className="offgrid wrap" id="off-grid" aria-labelledby="offgrid-title">
      <Reveal as="h2" id="offgrid-title" className="sec-title" variant="up">
        {copy.home.offgrid.title}
      </Reveal>

      <div className="offgrid-body">
        <div className="offgrid-media">
          <div className="offgrid-sticky">
            <div className="offgrid-plate">
              {ITEMS.map((item, i) => (
                <Image
                  key={item.image.src}
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 900px) 40vw, 100vw"
                  className="object-cover offgrid-img"
                  data-on={active === i || undefined}
                />
              ))}
            </div>
            <span className="t-label about-cap" aria-live="polite">
              {ITEMS[active].n} · {ITEMS[active].title}
            </span>
          </div>
        </div>

        <div className="offgrid-text">
          {ITEMS.map((item, i) => (
            <article
              key={item.title}
              ref={(el) => {
                steps.current[i] = el;
              }}
              className="offgrid-step"
              data-on={active === i || undefined}
            >
              <h3 className="t-label offgrid-step-title">
                {item.n} · {item.title}
              </h3>
              <p className="offgrid-step-text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
