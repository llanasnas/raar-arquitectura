import Link from "next/link";
import { Reveal } from "@/components/site/v2/Reveal";
import { formatDate, type Faq, type Heading, type Post, type Source } from "@/lib/editorial";
import { routes } from "@/lib/site";

// Piezas del blog y de las páginas de zona. Mismo papel y misma retícula que la ficha de obra
// (.sheet): la columna estrecha a la izquierda con los datos y el índice, el texto a la derecha.

// El cuerpo en Markdown ya convertido (lib/editorial.ts). Es contenido propio, del repositorio.
export function MdBody({ html }: { html: string }) {
  return <div className="md" dangerouslySetInnerHTML={{ __html: html }} />;
}

// Índice lateral con los h2 del texto
export function Toc({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null;
  return (
    <nav aria-label="Índice" className="md-toc">
      <span className="t-label">Índice</span>
      <ol>
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="link-line">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Preguntas propias de la página, con el mismo <details> que la FAQ general. El JSON-LD lo pone la página.
export function FaqBlock({ items, title }: { items: Faq[]; title: string }) {
  if (!items.length) return null;
  return (
    <section data-menu="dark" className="sheet wrap" aria-labelledby="faq-local">
      <div className="sheet-facts">
        <div className="sheet-facts-inner">
          <Reveal className="t-label" variant="line">
            Preguntas
          </Reveal>
          <Reveal as="h2" id="faq-local" className="t-title" delay={60}>
            {title}
          </Reveal>
        </div>
      </div>
      <div className="sheet-text faq">
        {items.map((item) => (
          <details key={item.q} className="faq-item">
            <summary>{item.q}</summary>
            <p className="t-body faq-a">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// Fuentes: las normas y páginas oficiales que respaldan lo que dice el texto
export function Sources({ items }: { items: Source[] }) {
  if (!items.length) return null;
  return (
    <div className="md-sources">
      <span className="t-label">Fuentes</span>
      <ul>
        {items.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener" className="link-line">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Lista de artículos: filas con regla, como el índice de una revista. `heading` baja a h3 si
// la sección ya tiene su h2.
export function PostList({ posts, heading = "h2" }: { posts: Post[]; heading?: "h2" | "h3" }) {
  const Title = heading;
  return (
    <ol className="posts">
      {posts.map((p) => (
        <li key={p.slug} className="post-row">
          <Link href={routes.post(p.slug)} className="post-link">
            <span className="t-label post-meta">
              {p.kicker} · <time dateTime={p.date}>{formatDate(p.date)}</time> · {p.minutes} min
            </span>
            <Title className="post-title">{p.h1}</Title>
            <p className="t-body post-sum">{p.description}</p>
          </Link>
        </li>
      ))}
    </ol>
  );
}
