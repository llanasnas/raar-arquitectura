import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";

// Contenido editorial en Markdown: el blog (content/blog) y las páginas de zona
// (content/zonas). Los dos se escriben igual —frontmatter + cuerpo con ## secciones— y se
// pintan con el mismo HTML, así que un artículo y una zona se leen igual y se enlazan entre sí.
//
// Nada de aquí inventa datos del estudio: las obras que se citan son las de content/projects
// y la normativa lleva siempre su fuente en `sources`.

const ROOT = path.join(process.cwd(), "content");

export type Faq = { q: string; a: string };
export type Source = { label: string; url: string };
export type Heading = { id: string; text: string };

type Base = {
  slug: string;
  title: string; // <title> sin la marca
  description: string;
  h1: string;
  lead: string;
  faq: Faq[];
  sources: Source[];
  html: string;
  headings: Heading[];
  words: number;
  /** el Markdown del cuerpo tal cual, para llms-full.txt */
  md: string;
};

export type Post = Base & {
  kicker: string;
  date: string; // ISO
  updated: string; // ISO
  zones: string[]; // slugs de zona
  projects: string[];
  minutes: number;
};

export type Zone = Base & {
  name: string; // «Girona»
  kicker: string;
  region: string; // «Girona, Catalunya»
  country: "ES" | "AD";
  geo: { lat: number; lng: number } | null;
  places: string[]; // municipios y barrios concretos que se nombran en la página
  projects: string[];
  updated: string;
  order: number;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Cada h2 lleva su id (índice lateral y enlaces a una sección desde otra página). Los enlaces
// externos salen en pestaña nueva y sin pasar autoridad a la publicidad de nadie.
function render(md: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const plain = text.replace(/<[^>]+>/g, "");
        if (depth === 2) {
          const id = slugify(plain);
          headings.push({ id, text: plain });
          return `<h2 id="${id}">${text}</h2>\n`;
        }
        return `<h${depth}>${text}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const t = title ? ` title="${title}"` : "";
        if (/^https?:\/\//.test(href)) {
          return `<a href="${href}"${t} target="_blank" rel="noopener">${text}</a>`;
        }
        return `<a href="${href}"${t}>${text}</a>`;
      },
      table(token) {
        // la tabla puede ser más ancha que la columna en móvil: se desplaza dentro de su caja
        const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const rows = token.rows
          .map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`)
          .join("");
        return `<div class="md-table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    },
  });
  const html = marked.parse(md, { async: false }) as string;
  return { html, headings };
}

function plainText(md: string) {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>|]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function iso(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v ?? "");
}

function readDir(dir: string) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, f), "utf8"));
      return { slug: f.replace(/\.md$/, ""), data: data as Record<string, unknown>, content };
    });
}

function base(slug: string, data: Record<string, unknown>, content: string): Base {
  const { html, headings } = render(content);
  const plain = plainText(content);
  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    h1: String(data.h1 ?? data.title),
    lead: String(data.lead ?? data.description),
    faq: (data.faq as Faq[] | undefined) ?? [],
    sources: (data.sources as Source[] | undefined) ?? [],
    html,
    headings,
    words: plain.split(/\s+/).filter(Boolean).length,
    md: content.trim(),
  };
}

let posts: Post[] | null = null;
let zones: Zone[] | null = null;

export function getPosts(): Post[] {
  if (posts) return posts;
  posts = readDir("blog")
    .filter(({ data }) => data.draft !== true)
    .map(({ slug, data, content }) => {
      const b = base(slug, data, content);
      return {
        ...b,
        kicker: String(data.kicker ?? "Blog"),
        date: iso(data.date),
        updated: iso(data.updated ?? data.date),
        zones: (data.zones as string[] | undefined) ?? [],
        projects: (data.projects as string[] | undefined) ?? [],
        minutes: Math.max(1, Math.round(b.words / 220)),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export function getPost(slug: string) {
  return getPosts().find((p) => p.slug === slug);
}

export function getZones(): Zone[] {
  if (zones) return zones;
  zones = readDir("zonas")
    .map(({ slug, data, content }) => ({
      ...base(slug, data, content),
      name: String(data.name),
      kicker: String(data.kicker ?? `Arquitectos en ${data.name}`),
      region: String(data.region ?? ""),
      country: (data.country as "ES" | "AD") ?? "ES",
      geo: (data.geo as Zone["geo"]) ?? null,
      places: (data.places as string[] | undefined) ?? [],
      projects: (data.projects as string[] | undefined) ?? [],
      updated: iso(data.updated),
      order: Number(data.order ?? 99),
    }))
    .sort((a, b) => a.order - b.order);
  return zones;
}

export function getZone(slug: string) {
  return getZones().find((z) => z.slug === slug);
}

export function postsForZone(slug: string) {
  return getPosts().filter((p) => p.zones.includes(slug));
}

/** Artículos relacionados: primero los que comparten zona, después los más recientes. */
export function relatedPosts(post: Post, n = 3) {
  const others = getPosts().filter((p) => p.slug !== post.slug);
  const shared = others.filter((p) => p.zones.some((z) => post.zones.includes(z)));
  const rest = others.filter((p) => !shared.includes(p));
  return [...shared, ...rest].slice(0, n);
}

export function formatDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Madrid",
  });
}
