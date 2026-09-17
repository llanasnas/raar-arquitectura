import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/v2/Reveal";
import { routes } from "@/lib/site";
import type { Project } from "@/lib/content";

// Propuesta A · «Pliego». Cada obra ocupa un pliego de revista: la ficha se queda pegada
// mientras las láminas pasan por al lado, y el lado se alterna en cada obra para que la
// página tenga ritmo en vez de ser una lista.
//
// La ficha pegada (position: sticky) es lo que da retención: mientras miras las fotos sigues
// leyendo de qué obra son, y no hay que repetir el título en cada imagen.
export function SpreadA({ project, index }: { project: Project; index: number }) {
  const media = [project.hero ?? project.thumb, project.gallery[1] ?? project.gallery[0]].filter(Boolean);
  const side = index % 2 === 0 ? "left" : "right";

  return (
    <article className="spread wrap" data-side={side}>
      <div className="spread-meta">
        <div className="spread-meta-inner">
          <Reveal className="t-label" variant="line">
            {String(index + 1).padStart(2, "0")} — {project.codeDisplay}
          </Reveal>
          <Reveal as="h3" className="t-title spread-name" delay={60}>
            {project.name}
          </Reveal>
          <Reveal as="p" className="t-body spread-summary" delay={120}>
            {project.summary}
          </Reveal>
          <Reveal className="spread-facts t-label" delay={180}>
            <span>{project.typeLabel}</span>
            <span>{project.place}</span>
          </Reveal>
          <Reveal delay={240}>
            <Link href={routes.project(project.id)} className="link-underline">
              Ver el proyecto
            </Link>
          </Reveal>
        </div>
      </div>

      <div className="spread-media">
        {media.map((m, i) => (
          <Reveal key={m.src} variant="wipe" className={`plate-2 ${i === 1 ? "plate-2-small" : ""}`} delay={i * 120}>
            <Image
              src={m.src}
              alt={m.alt}
              fill
              sizes={i === 1 ? "(min-width: 900px) 30vw, 74vw" : "(min-width: 900px) 56vw, 100vw"}
              className="object-cover"
            />
          </Reveal>
        ))}
      </div>
    </article>
  );
}
