"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { routes } from "@/lib/site";
import type { Project } from "@/lib/content";

// Propuesta C · «Índice». La página se abre como el sumario de una revista: una lista de
// obras en tipografía grande y, al pasar por encima, la lámina aparece flotando y sigue al
// cursor con retardo. Retiene porque cada fila premia el gesto de recorrerla.
//
// En móvil no hay cursor, así que la lámina no flota: cada fila lleva su miniatura al lado,
// que es como se lee un sumario en papel.
export function IndexC({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const peek = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // La lámina persigue al cursor con inercia: sin retardo parece pegada al puntero y se
  // vuelve nerviosa; con retardo se lee como un objeto que flota sobre la página.
  useEffect(() => {
    if (reducedMotion) return;
    const el = peek.current;
    if (!el) return;
    let frame = 0;
    const pointer = { x: window.innerWidth * 0.68, y: window.innerHeight * 0.5 };
    const at = { ...pointer };
    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const loop = () => {
      at.x += (pointer.x - at.x) * 0.12;
      at.y += (pointer.y - at.y) * 0.12;
      // sin tope, al acercarse a un borde la lámina se sale de la pantalla y parece rota
      const half = { x: el.offsetWidth / 2 + 12, y: el.offsetHeight / 2 + 12 };
      at.x = Math.min(Math.max(at.x, half.x), window.innerWidth - half.x);
      at.y = Math.min(Math.max(at.y, half.y), window.innerHeight - half.y);
      el.style.transform = `translate3d(${Math.round(at.x)}px, ${Math.round(at.y)}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <section data-menu="dark" className="index-block wrap" onPointerLeave={() => setActive(null)}>
      <ol className="index-list">
        {projects.map((project, i) => (
          <li key={project.id}>
            <Link
              href={routes.project(project.id)}
              className="index-row"
              data-active={active === i || undefined}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="t-label index-code">{project.codeDisplay}</span>
              <span className="index-name">{project.name}</span>
              <span className="t-label index-place">{project.place}</span>
              <span className="index-thumb">
                <Image src={project.thumb.src} alt="" fill sizes="96px" className="object-cover" />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div ref={peek} className="index-peek" aria-hidden="true">
        {projects.map((project, i) => (
          <Image
            key={project.id}
            src={(project.hero ?? project.thumb).src}
            alt=""
            fill
            sizes="(min-width: 900px) 30vw, 1px"
            className="object-cover"
            style={{ opacity: active === i ? 1 : 0 }}
          />
        ))}
      </div>
    </section>
  );
}
