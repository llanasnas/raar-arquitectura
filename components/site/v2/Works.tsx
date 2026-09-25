import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/v2/Reveal";
import { routes } from "@/lib/site";
import type { Project } from "@/lib/content";
import { copy } from "@/lib/copy";

// El índice de obra como pliego: doce columnas y un ritmo de siete posiciones que se repite
// (ver .work en globals.css). Ninguna obra ocupa lo mismo que la anterior, así que la página
// se recorre como una revista y no como una parrilla de tarjetas.
//
// Las obras en proceso van en gris y con su etiqueta: no se enseñan como si estuvieran
// terminadas. La foto de una obra en proceso es la miniatura, que es lo único que hay.
//
// `sizes` sale de las columnas que ocupa cada posición (ver .work y .works-featured en
// globals.css): con un 58vw para todas, una lámina de 4 columnas pedía la foto de 1920 px y
// tardaba el doble en llegar. El .wrap se para en 1680 px, así que ahí el ancho es fijo.
const SPANS = { index: [7, 4, 4, 7, 5, 5, 8], featured: [6, 6, 4, 7, 7, 4] } as const;

function sizesFor(rhythm: "index" | "featured", i: number) {
  const cycle = SPANS[rhythm];
  const span = cycle[i % cycle.length];
  return `(min-width: 1680px) ${Math.round((1680 * span) / 12)}px, (min-width: 900px) ${Math.round((100 * span) / 12)}vw, 100vw`;
}

// `rhythm="featured"` es la versión de la portada: cuatro obras con su propio reparto (ver
// .works-featured). `heading` baja el título a h3 cuando la sección ya lleva su h2.
export function Works({ projects, rhythm = "index", heading = "h2", typeFilter }: { projects: Project[]; rhythm?: "index" | "featured"; heading?: "h2" | "h3"; typeFilter?: string }) {
  const Name = heading;
  return (
    <ol data-menu="dark" className={rhythm === "featured" ? "works works-featured wrap" : "works wrap"}>
      {projects.map((project, i) => {
        const wip = project.status === "processing";
        const media = wip || !project.hero ? project.thumb : project.hero;
        return (
          <li key={project.id} className="work" data-wip={wip || undefined}>
            <Link href={typeFilter ? `${routes.project(project.id)}?tipo=${encodeURIComponent(typeFilter)}` : routes.project(project.id)} className="work-link">
              <Reveal className="work-plate" variant="wipe" delay={(i % 2) * 90}>
                <span className="work-zoom">
                  <Image src={media.src} alt={media.alt} fill sizes={sizesFor(rhythm, i)} priority={i < 2} className="object-cover" />
                </span>
              </Reveal>
              {/* pie según el cliente (guía del 21/09): «Referencia. Tipo. Ubicación», título y subtítulo */}
              <div className="work-cap">
                <span className="t-label">
                  {project.code}. {project.typeLabel}. {wip ? <span className="work-tag">{copy.projects.processing}</span> : project.place}
                </span>
                <Name className="work-name">{project.name}</Name>
                <p className="t-body work-sum">{project.summary}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
