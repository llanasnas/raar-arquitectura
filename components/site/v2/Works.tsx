import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/v2/Reveal";
import { routes } from "@/lib/site";
import type { Project } from "@/lib/content";

// El índice de obra como pliego: doce columnas y un ritmo de siete posiciones que se repite
// (ver .work en globals.css). Ninguna obra ocupa lo mismo que la anterior, así que la página
// se recorre como una revista y no como una parrilla de tarjetas.
//
// Las obras en proceso van en gris y con su etiqueta: no se enseñan como si estuvieran
// terminadas. La foto de una obra en proceso es la miniatura, que es lo único que hay.
const SIZES = "(min-width: 900px) 58vw, 100vw";

export function Works({ projects }: { projects: Project[] }) {
  return (
    <ol data-menu="dark" className="works wrap">
      {projects.map((project, i) => {
        const wip = project.status === "processing";
        const media = wip || !project.hero ? project.thumb : project.hero;
        return (
          <li key={project.id} className="work" data-wip={wip || undefined}>
            <Link href={routes.project(project.id)} className="work-link">
              <Reveal className="work-plate" variant="wipe" delay={(i % 2) * 90}>
                <span className="work-zoom">
                  <Image src={media.src} alt={media.alt} fill sizes={SIZES} priority={i < 2} className="object-cover" />
                </span>
              </Reveal>
              <div className="work-cap">
                <span className="t-label">
                  {project.codeDisplay} · {project.place}
                  {wip && <span className="work-tag"> · En proceso</span>}
                </span>
                <h2 className="work-name">{project.name}</h2>
                <p className="t-body work-sum">{project.summary}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
