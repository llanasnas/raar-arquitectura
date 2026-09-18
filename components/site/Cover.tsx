import { CoverBody, type Slide } from "@/components/site/CoverBody";
import { getProject } from "@/lib/content";

// Portada: eslogan y frase a la izquierda, vídeo a la derecha a toda altura.
// El logotipo no vive aquí (es el `SiteBrand` fijo de la página) y el vídeo tampoco se
// duplica: el que asoma por las franjas de la apertura es este mismo.
//
// La banda de abajo (--bar-h) es la línea del menú y el logotipo: el vídeo se recoge al
// final de la apertura para dejarla libre.
//
// La portada está montada desde el primer momento: el telón de la apertura la tapa y al
// subir la descubre, no hay nada que entre después.
//
// Cada palabra de la lista enseña una obra distinta, elegida porque explica esa palabra:
// la casa abierta al valle para «arquitectura», un interior resuelto para «diseño», la
// bóveda catalana que sigue ahí para «atemporalidad» y la casa entre medianeras para
// «rigor». Mismo orden que `copy.hero.words`.
const SLIDE_IDS = ["gg01", "im10", "pe17", "vi02"] as const;

export function Cover({ brandCorner = "tl", opening = false }: { brandCorner?: "tl" | "br"; opening?: boolean }) {
  const slides: Slide[] = SLIDE_IDS.flatMap((id) => {
    const project = getProject(id);
    if (!project) return [];
    const media = project.hero ?? project.thumb;
    return [{ src: media.src, alt: media.alt, caption: `${project.codeDisplay} · ${project.place}` }];
  });

  return (
    <section data-menu="dark" className="cover" data-brand={brandCorner}>
      <CoverBody slides={slides} opening={opening} />
    </section>
  );
}
