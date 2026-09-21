import { getProject } from "@/lib/content";
import { routes } from "@/lib/site";
import { TYPOLOGIES } from "@/lib/typologies";

// El diagrama de obra de la home: una tipología por arco y, en el perímetro, los proyectos de
// cada una. La lista vive en lib/typologies.ts («Guia per a web» del cliente, 21/09/2026):
// cuatro tipologías; Off grid ya no va en el dibujo, es su propia sección de la portada.

// Elementos del perímetro que todavía no tienen ficha en la web: se dibujan, pero no llevan
// a ningún sitio. Son obras de las que el cliente aún no ha pasado material.
const PENDING: Record<string, { label: string; note: string }> = {
  bo24: { label: "BO_24", note: "Ficha en preparación" },
  cm25: { label: "CM_25", note: "Ficha en preparación" },
  ll14: { label: "LL_14", note: "Ficha en preparación" },
  so30: { label: "SO_30", note: "Ficha en preparación" },
};

// Los códigos se leen igual en todo el perímetro: las obras en proceso vienen sin guion bajo
// («GR16») y aquí se les pone («GR_16»), como en las fichas.
const code = (display: string) => display.replace(/^([A-Z]+)(\d+)$/, "$1_$2");

export type DiagramItem = {
  /** único en todo el dibujo (tipología/obra): CM25 está en dos arcos y cada uno se marca aparte */
  id: string;
  /** lo que se lee en el perímetro: el código de obra */
  label: string;
  name: string | null;
  place: string | null;
  image: { src: string; alt: string } | null;
  href: string | null;
  note: string | null;
};

export type DiagramGroup = {
  id: string;
  label: string;
  ring: 0 | 1 | 2;
  href: string | null;
  items: DiagramItem[];
};

// Resuelve la lista del cliente contra las fichas que hay: lo que existe enlaza y lleva
// foto; lo que no, se dibuja y avisa. Solo en servidor (lee de disco a través de content.ts).
export function getDiagram(): DiagramGroup[] {
  return TYPOLOGIES.map((group) => ({
    id: group.id,
    label: group.label,
    ring: group.ring,
    href: group.service ? `${routes.services}#${group.service}` : routes.services,
    items: group.items.map((projectId): DiagramItem => {
      const id = `${group.id}/${projectId}`;
      const project = getProject(projectId);
      if (project) {
        const media = project.hero ?? project.thumb;
        return {
          id,
          label: code(project.codeDisplay),
          name: project.name,
          place: project.place,
          image: { src: media.src, alt: media.alt },
          href: routes.project(projectId),
          note: project.status === "processing" ? "En proceso" : null,
        };
      }
      const pending = PENDING[projectId] ?? { label: projectId.toUpperCase(), note: "Ficha en preparación" };
      return { id, label: pending.label, name: null, place: null, image: null, href: null, note: pending.note };
    }),
  }));
}
