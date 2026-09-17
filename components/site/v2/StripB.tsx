"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { routes } from "@/lib/site";
import type { Project } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Propuesta B · «Cinta». Las obras pasan de lado mientras se hace scroll hacia abajo: el
// gesto de pasar páginas de una revista, con la sección clavada durante el recorrido.
// Retiene porque el movimiento lateral no tiene fin visible hasta que pasan todas.
//
// Solo en escritorio y solo si hay movimiento permitido: en móvil clavar la pantalla y
// secuestrar el scroll se siente como un error, así que ahí es un carrusel normal con
// scroll-snap, que además se puede pasar con el dedo.
export function StripB({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current;
        const wrap = section.current;
        if (!el || !wrap) return;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => wrap.style.setProperty("--strip-progress", String(self.progress)),
          },
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} data-menu="dark" className="strip">
      <div ref={track} className="strip-track">
        {projects.map((project, i) => (
          <article key={project.id} className="strip-card">
            <Link href={routes.project(project.id)} className="strip-plate">
              <Image
                src={(project.hero ?? project.thumb).src}
                alt={(project.hero ?? project.thumb).alt}
                fill
                sizes="(min-width: 900px) 34vw, 82vw"
                className="object-cover"
              />
            </Link>
            <div className="strip-caption">
              <span className="t-label">
                {String(i + 1).padStart(2, "0")} — {project.codeDisplay}
              </span>
              <h3 className="strip-name">{project.name}</h3>
              <span className="t-label strip-place">{project.place}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="strip-rail" aria-hidden="true">
        <span className="strip-rail-fill" />
      </div>
    </section>
  );
}
