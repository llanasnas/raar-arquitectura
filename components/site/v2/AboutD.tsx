"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/v2/Reveal";
import { copy, studioPage } from "@/lib/copy";
import { routes } from "@/lib/site";

// D · Al hilo del texto. Los tres párrafos del manifiesto van uno debajo de otro, con aire, y
// la lámina de al lado se queda pegada y **cambia con el párrafo que se está leyendo**: el
// equipo cuando habla del origen, la materia cuando habla de materiales, el espacio cuando
// habla del proceso. Es el único de los cuatro en que el scroll cuenta algo.
//
// Un IntersectionObserver mira qué párrafo cruza el centro de la pantalla; sin JS se ve la
// primera lámina y el texto entero, que es el estado de reposo.
const SLIDES = [
  { src: "/images/about/team-aerial.jpg", alt: copy.studio.photoAlt, caption: studioPage.teamNote },
  { src: "/images/projects/vi02/render-01-zona-social-1.jpg", alt: "", caption: "VI_02 · La Garriga" },
  { src: "/images/projects/im10/render-01-sala.jpg", alt: "", caption: "IM_10 · Sarrià" },
];

export function AboutD() {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = steps.current.indexOf(entry.target as HTMLParagraphElement);
          if (index >= 0) setActive(index);
        }
      },
      // una franja estrecha a media pantalla: manda el párrafo que la cruza
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    steps.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section data-menu="dark" className="about-d wrap">
      <div className="about-d-text">
        <Reveal className="t-label" variant="line">
          {studioPage.title}
        </Reveal>
        <Reveal as="h2" className="t-title about-title" delay={60}>
          {copy.studio.title}
        </Reveal>
        {studioPage.manifesto.map((text, i) => (
          <p
            key={i}
            ref={(el) => {
              steps.current[i] = el;
            }}
            className="about-d-step"
            data-on={active === i || undefined}
          >
            {text}
          </p>
        ))}
        <Link href={routes.studio} className="link-underline">
          {copy.studio.cta}
        </Link>
      </div>

      <div className="about-d-media">
        <div className="about-d-sticky">
          <div className="about-plate about-plate-tall">
            {SLIDES.map((slide, i) => (
              <Image
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(min-width: 900px) 40vw, 100vw"
                className="object-cover about-d-img"
                data-on={active === i || undefined}
              />
            ))}
          </div>
          <span className="t-label about-cap" aria-live="polite">
            {SLIDES[active].caption}
          </span>
        </div>
      </div>
    </section>
  );
}
