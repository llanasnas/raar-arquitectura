import Link from "next/link";
import { Reveal } from "@/components/site/v2/Reveal";
import { copy, studioPage } from "@/lib/copy";
import { routes, site } from "@/lib/site";

// Piezas que comparten las tres propuestas de home: la banda de apertura de sección, el
// respiro tipográfico y el cierre. Así lo que cambia entre propuestas es el bloque de
// proyectos, que es lo que hay que decidir.

// Rótulo de sección: número de pliego + título. La numeración es de revista, no decorativa:
// ayuda a saber por dónde va uno en una página larga.
export function Band({ index, title, lead }: { index: string; title: string; lead?: string }) {
  return (
    <div className="band wrap">
      <Reveal className="t-label band-index" variant="line">
        {index}
      </Reveal>
      <Reveal as="h2" className="t-display band-title" delay={60}>
        {title}
      </Reveal>
      {lead && (
        <Reveal as="p" className="t-lead band-lead" delay={140}>
          {lead}
        </Reveal>
      )}
    </div>
  );
}

// Respiro tipográfico entre bloques de imágenes: una sola frase, del texto que escribió el
// estudio. Sirve para bajar el pulso después de mucha lámina seguida.
export function Statement({ text }: { text: string }) {
  return (
    <section data-menu="dark" className="statement wrap">
      <Reveal as="blockquote" className="statement-text" variant="up">
        {text}
      </Reveal>
    </section>
  );
}

export const MANIFESTO_LINE = studioPage.manifesto[1].split(". ")[0] + ".";

// Cierre: la única llamada a la acción de la página, en grande y sin adornos.
export function Closing() {
  return (
    <section data-menu="dark" className="closing wrap">
      <Reveal className="t-label">{copy.context.line}</Reveal>
      <Reveal as="p" className="closing-areas t-title" delay={60}>
        {site.areas.join(" · ")}
      </Reveal>
      <Reveal className="closing-cta" delay={120}>
        <Link href={routes.contact} className="link-big">
          {copy.nav.ctaLong}
        </Link>
        <span className="t-label closing-note">{copy.process.steps[0].text}</span>
      </Reveal>
    </section>
  );
}
