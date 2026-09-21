// Las tipologías del cliente y qué obra va en cada una («Guia per a web», 21/09/2026). Es la
// única lista: de aquí salen los arcos del diagrama de la portada, el filtro de /proyectos y
// la etiqueta de tipo de cada obra (tarjeta y ficha). Una obra puede estar en dos (CM25 es
// project management y dirección de obra a la vez).
//
// Sin dependencias a propósito: la lee content.ts (etiquetas) y diagram.ts (dibujo), y si
// esto importara content.ts habría un ciclo.
export type TypologyDef = {
  id: string;
  label: string;
  /** anillo del diagrama (0 = exterior): reparto para dar profundidad, sin significado */
  ring: 0 | 1 | 2;
  /** ancla en /servicios, cuando el servicio existe allí */
  service: string | null;
  items: string[];
};

export const TYPOLOGIES: TypologyDef[] = [
  { id: "obra-nueva", label: "Obra nueva", ring: 0, service: "obra-nueva", items: ["bo24", "gr16", "ar07", "gg01"] },
  { id: "rehabilitacion", label: "Rehabilitación", ring: 1, service: "rehabilitacion", items: ["vi02", "co38", "pe17", "mo07", "im10", "so30"] },
  { id: "project-management", label: "Project management", ring: 2, service: null, items: ["cm25", "to39", "se08"] },
  { id: "direccion-obra", label: "Dirección de obra", ring: 1, service: null, items: ["cm25", "ll14"] },
];

/** Las tipologías de una obra, en el orden de la lista del cliente. Vacío si no está en ninguna. */
export function typologiesOf(projectId: string): TypologyDef[] {
  return TYPOLOGIES.filter((t) => t.items.includes(projectId));
}
