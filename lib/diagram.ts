import { getProject } from "@/lib/content";
import { routes } from "@/lib/site";

// El diagrama de obra de la home: cinco tipologías (una por arco) y, en el perímetro, los
// proyectos de cada una. Lista cerrada por el cliente el 17/09/2026. IM10 y TO39 siguen en
// /proyectos pero el cliente aún no ha decidido si van en la home; GV75 y PR37 no van.
//
// `ring` es el anillo en que se dibuja el arco (0 = exterior). Se reparten para que el
// dibujo tenga profundidad, como en el boceto del cliente; no significan nada.
export type DiagramGroupDef = {
  id: string;
  label: string;
  ring: 0 | 1 | 2;
  /** ancla en /servicios, cuando el servicio existe allí */
  service: string | null;
  items: string[];
};

export const DIAGRAM_GROUPS: DiagramGroupDef[] = [
  { id: "obra-nueva", label: "Obra nueva", ring: 0, service: "obra-nueva", items: ["bo24", "gr16", "ar07", "gg01"] },
  { id: "rehabilitacion", label: "Rehabilitación", ring: 1, service: "rehabilitacion", items: ["vi02", "co38", "se08", "pe17", "mo07"] },
  { id: "project-management", label: "Project management", ring: 2, service: null, items: ["cm25"] },
  { id: "direccion-obra", label: "Dirección de obra", ring: 1, service: null, items: ["ll14"] },
  { id: "off-grid", label: "Off grid", ring: 2, service: null, items: ["eventos", "moda"] },
];

// Elementos del perímetro que todavía no tienen ficha en la web: se dibujan, pero no llevan
// a ningún sitio. BO24, CM25 y LL14 son obras de las que el cliente aún no ha pasado material;
// Eventos y Moda serán una sección nueva (tipo boletín) que no existe todavía.
const PENDING: Record<string, { label: string; note: string }> = {
  bo24: { label: "BO_24", note: "Ficha en preparación" },
  cm25: { label: "CM_25", note: "Ficha en preparación" },
  ll14: { label: "LL_14", note: "Ficha en preparación" },
  eventos: { label: "Eventos", note: "Sección en preparación" },
  moda: { label: "Moda", note: "Sección en preparación" },
};

// Los códigos se leen igual en todo el perímetro: las obras en proceso vienen sin guion bajo
// («GR16») y aquí se les pone («GR_16»), como en las fichas.
const code = (display: string) => display.replace(/^([A-Z]+)(\d+)$/, "$1_$2");

export type DiagramItem = {
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
  return DIAGRAM_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    ring: group.ring,
    href: group.service ? `${routes.services}#${group.service}` : routes.services,
    items: group.items.map((id): DiagramItem => {
      const project = getProject(id);
      if (project) {
        const media = project.hero ?? project.thumb;
        return {
          id,
          label: code(project.codeDisplay),
          name: project.name,
          place: project.place,
          image: { src: media.src, alt: media.alt },
          href: routes.project(id),
          note: project.status === "processing" ? "En proceso" : null,
        };
      }
      const pending = PENDING[id] ?? { label: id.toUpperCase(), note: "Ficha en preparación" };
      return { id, label: pending.label, name: null, place: null, image: null, href: null, note: pending.note };
    }),
  }));
}
