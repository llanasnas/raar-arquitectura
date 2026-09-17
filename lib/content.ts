import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { imageSize } from "./image-size";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export type Media = { src: string; alt: string; label?: string; width?: number; height?: number };
export type ProjectType = "new-build" | "renovation";
export type ProjectStatus = "published" | "processing";

export type Project = {
  id: string;
  code: string; // AR07
  codeDisplay: string; // AR_07 (como en la ficha original)
  name: string; // nombre descriptivo público
  summary: string; // una línea para tarjetas
  order: number;
  status: ProjectStatus;
  place: string; // "Sarrià, Barcelona"
  placeFull: string;
  type: ProjectType | null;
  typeLabel: string; // "Reforma integral" | "Obra nueva" | "Rehabilitación"
  typology: string | null;
  year: string | null;
  surface: string | null;
  thumb: Media;
  hero: Media | null;
  conceptVideo: { src: string; poster: string } | null;
  gallery: Media[];
  plans: Media[];
  text: { intro: string[]; block2: string[]; block3: string[]; facts: string[] };
  lang: "es" | "en";
};

type RawMedia = { src: string | null; alt_suggested?: string; label_suggested?: string; broken?: boolean };

function paragraphs(s: string | undefined): string[] {
  return (s ?? "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !p.startsWith("#"));
}

function sections(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  const parts = body.split(/^## +/m).slice(1);
  for (const part of parts) {
    const nl = part.indexOf("\n");
    const heading = part.slice(0, nl).trim().toLowerCase();
    out[heading] = part.slice(nl + 1).trim();
  }
  return out;
}

function pick(sec: Record<string, string>, prefix: string): string | undefined {
  const key = Object.keys(sec).find((k) => k.startsWith(prefix));
  return key ? sec[key] : undefined;
}

// Media with its intrinsic size, so plates can keep the real proportion of the image.
function sized(m: Media): Media {
  const dims = imageSize(m.src);
  return dims ? { ...m, ...dims } : m;
}

function media(list: RawMedia[] | undefined, fallbackAlt: string): Media[] {
  return (list ?? [])
    .filter((m) => m.src && !m.broken)
    .map((m) => sized({ src: m.src as string, alt: m.alt_suggested ?? fallbackAlt, label: m.label_suggested }));
}

const TYPE_LABEL: Record<string, string> = {
  "new-build": "Obra nueva",
  renovation: "Reforma integral",
};

// Proyectos cuyo "Rebuild" es rehabilitación de nave/taller, no reforma de vivienda.
const REHAB = new Set(["to39", "mo07"]);

function loadOne(id: string): Project | null {
  const file = path.join(PROJECTS_DIR, `${id}.md`);
  if (!fs.existsSync(file)) return null;
  const en = matter(fs.readFileSync(file, "utf8"));
  const fm = en.data as Record<string, unknown>;

  const esFile = path.join(PROJECTS_DIR, "es", `${id}.md`);
  const es = fs.existsSync(esFile) ? matter(fs.readFileSync(esFile, "utf8")) : null;
  const esFm = (es?.data ?? {}) as Record<string, unknown>;

  const src = es ? sections(es.content) : sections(en.content);
  const type = (fm.type_normalized as ProjectType | undefined) ?? null;
  const typeLabel = REHAB.has(id) ? "Rehabilitación" : type ? TYPE_LABEL[type] : "En proceso";

  const gallery = media(fm.gallery as RawMedia[], `${fm.code} — render`);
  const plans = media(fm.plans as RawMedia[], `${fm.code} — planta`);

  const heroSrc = (fm.hero as string | null) ?? null;
  const heroAlt =
    gallery.find((g) => g.src === heroSrc)?.alt ?? (esFm.hero_alt as string | undefined) ?? `${fm.code} — imagen principal`;

  const concept = fm.concept_gif as string | null;

  return {
    id,
    code: fm.code as string,
    codeDisplay: (fm.code_display_original as string) ?? (fm.code as string),
    name: (esFm.name as string) ?? (fm.title_suggested as string)?.split(" — ")[1] ?? (fm.code as string),
    summary: (esFm.summary as string) ?? (fm.typology as string) ?? "",
    order: fm.order as number,
    status: fm.status as ProjectStatus,
    place: (esFm.place as string) ?? (fm.location as string) ?? "",
    placeFull: (esFm.place_full as string) ?? (fm.location_full as string) ?? (fm.location as string) ?? "",
    type,
    typeLabel,
    typology: (esFm.typology as string) ?? (fm.typology as string) ?? null,
    year: (fm.year as string | null) ?? null,
    surface: (fm.surface as string | null) ?? null,
    thumb: sized({ src: fm.thumb as string, alt: (esFm.thumb_alt as string) ?? (fm.thumb_description as string) ?? `${fm.code}` }),
    hero: heroSrc ? sized({ src: heroSrc, alt: heroAlt }) : null,
    conceptVideo: concept ? { src: concept, poster: concept.replace(/\.mp4$/, "-poster.jpg") } : null,
    gallery,
    plans,
    text: {
      intro: paragraphs(pick(src, "intro")),
      block2: paragraphs(pick(src, "bloque 2")),
      block3: paragraphs(pick(src, "bloque 3")),
      facts: paragraphs(pick(src, es ? "ficha" : "datos")).map((l) => l.replace(/^[-•]\s*/, "")),
    },
    lang: es ? "es" : "en",
  };
}

let cache: Project[] | null = null;

export function getProjects(): Project[] {
  if (cache) return cache;
  const ids = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
  cache = ids
    .map(loadOne)
    .filter((p): p is Project => p !== null)
    .sort((a, b) => a.order - b.order);
  return cache;
}

export function getPublishedProjects(): Project[] {
  return getProjects().filter((p) => p.status === "published");
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

// Two per way of starting a house: reforma integral, obra nueva, rehabilitación.
export const FEATURED_IDS = ["vi02", "pe17", "ar07", "gg01", "mo07", "to39"] as const;

export function getFeaturedProjects(): Project[] {
  return FEATURED_IDS.map((id) => getProject(id)).filter((p): p is Project => !!p);
}

export function getAdjacentProjects(id: string): { prev: Project | null; next: Project | null } {
  const list = getPublishedProjects();
  const i = list.findIndex((p) => p.id === id);
  if (i === -1) return { prev: null, next: null };
  return { prev: list[(i - 1 + list.length) % list.length] ?? null, next: list[(i + 1) % list.length] ?? null };
}
