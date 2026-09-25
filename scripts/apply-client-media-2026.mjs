// Connect the optimized September 2026 client images to their project records.
// Run after import-client-assets-2026.mjs. Idempotent; preserves the original notes/body.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const base = join(process.cwd(), "content", "projects");
const image = (id, name) => `/images/projects/${id}/client-2026-${name}.jpg`;
const entry = (id, name, caption) => `  - { src: ${image(id, name)}, alt_suggested: ${JSON.stringify(caption)}, label_suggested: ${JSON.stringify(caption)} }`;
const records = {
  ar07: {
    hero: "render-final-frontal",
    gallery: [
      ["render-acceso", "Acceso peatonal y rodado"],
      ["render-final-frontal", "Fachada posterior"],
      ["render-pasillo-interior", "Preámbulo de entrada exterior"],
      ["render-relleno", "Recorrido interior"],
    ],
  },
  bo24: {
    hero: "rendair-edit-canvas-22-09-2026-aae1e2ac",
    gallery: [
      ["rendair-edit-canvas-22-09-2026-aae1e2ac", "Fachada y zona exterior"],
      ["comedor", "Cocina exterior"],
      ["garaje", "Acceso al garaje"],
      ["interior", "Sala de estar"],
    ],
  },
  gg01: {
    hero: "patio-interior",
    gallery: [
      ["patio-interior", "Patio como núcleo central"],
      ["render-trasera", "Fachada posterior que abraza el patio"],
      ["render-terraza", "Fachada abierta al valle"],
      ["render-acceso-aprobado", "Acceso a la vivienda"],
    ],
  },
  gr16: {
    hero: "fachada",
    gallery: [
      ["fachada", "Fachada de calle"],
      ["acceso", "Acceso a la vivienda"],
      ["terrraza", "Terraza superior"],
    ],
  },
  cm25: {
    hero: "imagen-1",
    gallery: [
      ["imagen-1", "Vista exterior del proyecto CM25"],
      ["imagen-2", "Fachada de CM25"],
      ["imagen-3", "Terraza de CM25"],
      ["imagen-4", "Acceso de CM25"],
      ["imagen-5", "Detalle de fachada de CM25"],
    ],
  },
  to39: {
    hero: "ceramica",
    gallery: [
      ["ceramica", "Taller de cerámica"],
      ["recepcion", "Recepción"],
      ["salapp", "Sala de estar"],
      ["yoga", "Espacio para movimiento"],
    ],
  },
  co38: {
    hero: "piso-raar-via-laietana-32",
    gallery: [
      ["piso-raar-via-laietana-32", "Sala de estar y comedor"],
      ["piso-raar-via-laietana-28", "Cocina abierta"],
      ["piso-raar-via-laietana-23", "Pasillo de la vivienda"],
      ["piso-raar-via-laietana-41", "Detalle del techo recuperado"],
      ["piso-raar-via-laietana-2", "Conexión lineal entre estancias"],
      ["piso-raar-via-laietana-34", "Espacio antes de la intervención"],
      ["piso-raar-via-laietana-59", "Baño de la vivienda"],
      ["piso-raar-via-laietana-82", "Vista del Eixample desde la vivienda"],
      ["piso-raar-via-laietana-86", "Detalle de materiales"],
    ],
  },
  im10: {
    hero: null,
    gallery: [
      ["cocina", "Cocina abierta al jardín"],
      ["despacho", "Despacho"],
      ["espacio-de-dia", "Espacio de día"],
    ],
    append: true,
  },
  mo07: {
    hero: "insta-1",
    gallery: [
      ["insta-1", "Interior del antiguo taller transformado"],
      ["insta-2", "Escalera y estructura original"],
      ["insta-3", "Patio y núcleo vertical"],
      ["insta-5", "Espacio de circulación"],
    ],
  },
  pe17: {
    hero: "raar-gracia-4",
    gallery: [
      ["raar-gracia-4", "Cocina de la vivienda en Gràcia"],
      ["raar-gracia", "Patio interior"],
      ["raar-gracia-2", "Baño de la vivienda"],
      ["raar-gracia-8", "Carpintería de madera recuperada"],
      ["raar-gracia-9", "Suelo hidráulico original"],
      ["raar-gracia-14", "Detalle de materiales"],
      ["raar-gracia-20", "Bóveda catalana"],
      ["raar-gracia-26", "Acceso al edificio"],
      ["raar-gracia-27", "Escalera original"],
    ],
  },
  so30: {
    hero: "foto-1-so30",
    gallery: [
      ["foto-1-so30", "Sala de estar"],
      ["foto-2-so30", "Espacio de trabajo"],
      ["foto-3-so30", "Dormitorio"],
      ["foto-4-so30", "Detalle de la intervención"],
      ["foto-5-so30", "Comedor"],
      ["foto-6-so30", "Sala junto a la ventana"],
    ],
  },
  vi02: {
    hero: "garriga-2",
    gallery: [
      ["garriga-1", "Sala de estar"],
      ["garriga-2", "Patio y zona de día"],
      ["garriga-3", "Comedor"],
      ["garriga-4", "Escalera y patio vertical"],
    ],
  },
};

for (const [id, record] of Object.entries(records)) {
  const file = join(base, `${id}.md`);
  let content = readFileSync(file, "utf8");
  if (record.hero) {
    content = content.replace(/^thumb:.*$/m, `thumb: ${image(id, record.hero)}`);
    content = content.replace(/^hero:.*$/m, `hero: ${image(id, record.hero)}`);
  }
  const entries = record.gallery.map(([name, caption]) => entry(id, name, caption)).join("\n");
  if (record.append) {
    content = content.replace(/^  - \{ src: \/images\/projects\/im10\/render-02-cocina[^\n]*\n/m, "");
    content = content.replace(/^  - \{ src: \/images\/projects\/im10\/render-04-oficina[^\n]*\n/m, "");
    content = content.replace(/^  - \{ src: \/images\/projects\/im10\/client-2026-[^\n]*\n/gm, "");
    content = content.replace(/^plans:/m, `${entries}\nplans:`);
  } else {
    content = content.replace(/^gallery:[\s\S]*?(?=^plans:)/m, `gallery:\n${entries}\n`);
  }
  if (id === "gr16") content = content.replace(/^status:.*$/m, "status: published");
  writeFileSync(file, content);
}
