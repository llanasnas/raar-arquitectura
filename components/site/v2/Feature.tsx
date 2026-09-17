import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/v2/Reveal";
import { routes } from "@/lib/site";
import type { Project } from "@/lib/content";

// Lámina a sangre con su pie, como la doble página de apertura de un reportaje. La usan las
// propuestas B y C para cortar el ritmo de la lista con una sola obra a tamaño grande.
//
// El menú queda sobre la imagen, pero detrás de él va el velo de papel (main::after en
// globals.css), así que la letra es tinta también aquí.
export function Feature({ project }: { project: Project }) {
  const media = project.gallery[0] ?? project.hero ?? project.thumb;
  return (
    <section data-menu="dark" className="feature">
      <Image src={media.src} alt={media.alt} fill sizes="100vw" className="object-cover" />
      <div className="feature-caption wrap">
        <Reveal className="t-label feature-code" variant="line">
          {project.codeDisplay} · {project.typeLabel}
        </Reveal>
        <Reveal as="h3" className="feature-name" delay={80}>
          {project.name}
        </Reveal>
        <Reveal delay={160}>
          <Link href={routes.project(project.id)} className="link-underline feature-link">
            Ver el proyecto
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
