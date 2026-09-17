"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { routes } from "@/lib/site";
import type { Project } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Propuesta D · «Cuadernillo». Cada obra es una página a pantalla completa que se queda
// pegada arriba mientras la siguiente sube por encima: se pasan páginas, no se recorre una
// lista. La que queda debajo se aleja un poco y se apaga, así se entiende que hay una pila.
//
// Retención: cada página es una unidad cerrada (imagen + pie) y siempre hay otra encima
// empezando a entrar. El contador del lateral dice por dónde vas, como el folio de un número.
//
// Al pasar por encima de una página cambia la imagen a otra de la misma obra: la portada del
// reportaje se convierte en la escena de dentro.
export function StackD({ projects }: { projects: Project[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const pages = gsap.utils.toArray<HTMLElement>(".stack-page");
        pages.forEach((page, i) => {
          // el contador sigue a la página que manda ahora mismo
          ScrollTrigger.create({
            trigger: page,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => self.isActive && setCurrent(i),
          });
          if (i === pages.length - 1) return;
          // La página que se queda debajo retrocede un poco y baja un punto de luz. Lo que
          // separa de verdad las dos páginas es la sombra que proyecta la de arriba.
          //
          // `fromTo` con el brillo de partida explícito: si se deja que GSAP lo deduzca, el
          // valor inicial es `filter: none` y lo interpreta como brightness(0), así que la
          // página arrancaba **en negro** y solo llegaba al valor bueno al final del recorrido.
          gsap.fromTo(
            page.querySelector(".stack-plate"),
            { filter: "brightness(1)" },
            {
              scale: 0.965,
              filter: "brightness(0.92)",
              ease: "none",
              scrollTrigger: { trigger: pages[i + 1], start: "top bottom", end: "top top", scrub: 0.4 },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} data-menu="light" className="stack">
      <span className="stack-counter t-label" aria-hidden="true">
        {String(current + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
      </span>

      {projects.map((project, i) => {
        const cover = project.hero ?? project.thumb;
        const inside = project.gallery[0] ?? project.gallery[1] ?? cover;
        return (
          <section key={project.id} className="stack-page">
            <div className="stack-plate">
              {/* las tres primeras páginas entran sin esperar: con scroll rápido, una página
                  puede llegar antes que su foto y se ve el hueco */}
              <Image src={cover.src} alt={cover.alt} fill priority={i < 3} sizes="100vw" className="stack-img" />
              <Image src={inside.src} alt="" fill sizes="100vw" className="stack-img stack-img-inside" />
              <div className="stack-shade" />

              <div className="stack-caption wrap">
                <span className="t-label stack-code">
                  {String(i + 1).padStart(2, "0")} — {project.codeDisplay} · {project.typeLabel}
                </span>
                <h3 className="stack-name">{project.name}</h3>
                <p className="stack-summary">{project.summary}</p>
                <Link href={routes.project(project.id)} className="link-underline stack-link">
                  Ver el proyecto
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
