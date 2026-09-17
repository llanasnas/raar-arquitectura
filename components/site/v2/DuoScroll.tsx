"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Interludio de dos columnas a distinta velocidad, con el texto del estudio en medio.
// Es el respiro entre el cuadernillo y el cierre: nada que decidir, solo material pasando.
// Las columnas se mueven en sentidos opuestos, que es lo que hace que el papel parezca tener
// dos planos; sin eso son dos rejillas quietas.
export function DuoScroll({ projects, text }: { projects: Project[]; text: string }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(".duo-col-a", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: 0.5 },
        });
        gsap.to(".duo-col-b", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: 0.5 },
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  const left = projects.slice(0, 2);
  const right = projects.slice(2, 4);

  return (
    <section ref={scope} data-menu="dark" className="duo wrap">
      <div className="duo-col duo-col-a">
        {left.map((project) => {
          const media = project.gallery[0] ?? project.thumb;
          return (
            <figure key={project.id} className="duo-plate">
              <Image src={media.src} alt={media.alt} fill sizes="(min-width: 900px) 26vw, 44vw" className="object-cover" />
              <figcaption className="t-label duo-cap">{project.codeDisplay}</figcaption>
            </figure>
          );
        })}
      </div>

      <p className="duo-text">{text}</p>

      <div className="duo-col duo-col-b">
        {right.map((project) => {
          const media = project.gallery[1] ?? project.thumb;
          return (
            <figure key={project.id} className="duo-plate">
              <Image src={media.src} alt={media.alt} fill sizes="(min-width: 900px) 26vw, 44vw" className="object-cover" />
              <figcaption className="t-label duo-cap">{project.codeDisplay}</figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
