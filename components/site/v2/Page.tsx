import Link from "next/link";
import type { ReactNode } from "react";
import { Isotype } from "@/components/site/Isotype";
import { Reveal } from "@/components/site/v2/Reveal";
import { copy } from "@/lib/copy";
import { routes, site } from "@/lib/site";

// Piezas comunes de las páginas interiores en el lenguaje v2 «revista»: papel, tinta y mono.
// Sin cabecera: cada página abre con su rótulo, porque el menú vive abajo.

// Rótulo de página: etiqueta mono, título grande y entradilla. Es el equivalente al rótulo de
// sección de la home (Band), pero aquí el título es el h1 de la página.
export function PageHead({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-head wrap">
      <Reveal className="t-label" variant="line">
        {kicker}
      </Reveal>
      <Reveal as="h1" className="t-display page-title" delay={60}>
        {title}
      </Reveal>
      {lead && (
        <Reveal as="p" className="t-lead page-lead" delay={130}>
          {lead}
        </Reveal>
      )}
      {children}
    </div>
  );
}

// Migas de pan de la ficha de obra: una línea mono, no una barra de navegación.
export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Migas" className="t-label">
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && <span aria-hidden="true"> / </span>}
          {item.href ? (
            <Link href={item.href} className="link-line">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// Cómo trabajamos: cuatro filas con regla, no cuatro tarjetas. El «gratis» del primer paso
// se dice con palabras, que es el único sitio donde hay una promesa concreta.
export function Steps() {
  return (
    <section data-menu="dark" className="wrap">
      <Reveal as="h2" className="t-title" variant="up">
        {copy.process.title}
      </Reveal>
      <ol className="steps vspace-list">
        {copy.process.steps.map((step) => (
          <li key={step.n} className="step">
            <span className="t-label">{step.n}</span>
            <h3 className="step-title">
              {step.title}
              {"free" in step && step.free && <span className="t-label step-free">Gratuita</span>}
            </h3>
            <p className="t-body step-text">{step.text}</p>
          </li>
        ))}
      </ol>
      <p className="t-label vspace-note">
        {copy.process.note}
      </p>
    </section>
  );
}

// Preguntas: <details> nativo, sin JS. El signo es mono y cuadrado (ver .faq-item en globals).
// `split` es la versión de la home: rótulo pegado al margen y las preguntas en la columna de
// lectura, la misma retícula que la ficha de obra. El JSON-LD (FaqJsonLd) lo pone la página.
export function Faq({ split = false }: { split?: boolean }) {
  const list = (
    <div className={split ? "faq" : "faq vspace-list"}>
      {copy.faq.items.map((item) => (
        <details key={item.q} className="faq-item">
          <summary>{item.q}</summary>
          <p className="t-body faq-a">{item.a}</p>
        </details>
      ))}
    </div>
  );

  if (split) {
    return (
      <section data-menu="dark" className="sheet wrap faq-split" aria-labelledby="faq-title">
        <div className="sheet-facts">
          <div className="sheet-facts-inner">
            <Reveal className="t-label" variant="line">
              Preguntas
            </Reveal>
            <Reveal as="h2" id="faq-title" className="t-title faq-title" delay={60}>
              {copy.faq.title}
            </Reveal>
            <Reveal className="t-label faq-note" delay={120}>
              {copy.process.note}
            </Reveal>
          </div>
        </div>
        <div className="sheet-text">{list}</div>
      </section>
    );
  }

  return (
    <section data-menu="dark" className="wrap vspace">
      <Reveal as="h2" className="t-title" variant="up">
        {copy.faq.title}
      </Reveal>
      {list}
    </section>
  );
}

// Cierre de página: una sola llamada, en grande y sin adornos. Mismo gesto que el cierre de
// la home, para que todas las páginas terminen igual.
export function CtaBlock({ title, lead }: { title?: string; lead?: string }) {
  return (
    <section data-menu="dark" className="cta-2 wrap">
      <Reveal className="t-label" variant="line">
        {copy.context.line} {site.areas.join(" · ")}
      </Reveal>
      <Reveal as="h2" className="t-display cta-2-title" delay={60}>
        {title ?? copy.contactCta.closingTitle}
      </Reveal>
      <Reveal as="p" className="t-lead cta-2-lead" delay={120}>
        {lead ?? copy.contactCta.lead}
      </Reveal>
      <Reveal className="cta-2-row" delay={180}>
        <Link href={routes.contact} className="link-big">
          {copy.nav.ctaLong}
        </Link>
        <a href={site.phoneHref} className="t-label link-line">
          {site.phone}
        </a>
      </Reveal>
    </section>
  );
}

// Pie de toda la web, en el mismo lenguaje: tres columnas con regla (contacto, web, legal),
// el rótulo del estudio arriba y el copyright abajo. Reserva la altura de la barra fija
// (menú y logotipo) para que la última línea no quede debajo. `mark` añade el isotipo
// centrado al final, como cierra la portada en la maqueta del cliente.
export function SiteFoot({ mark = false }: { mark?: boolean }) {
  const year = new Date().getFullYear();
  return (
    <footer data-menu="dark" className="foot wrap">
      {/* la regla va dentro del wrap, como las demás: de margen a margen, no a sangre */}
      <hr className="rule-line" aria-hidden="true" />
      <div className="foot-head">
        <span className="t-label">
          {site.name} · {copy.footer.tagline}
        </span>
        <span className="t-label foot-areas">{site.areas.join(" · ")}</span>
      </div>

      <div className="foot-grid">
        <div className="foot-col">
          <span className="t-label foot-col-title">{copy.footer.contact}</span>
          <p className="t-body">
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}
          </p>
          <a href={site.phoneHref} className="t-body foot-link">
            {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="t-body foot-link">
            {site.email}
          </a>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="t-body foot-link">
            Instagram
          </a>
        </div>
        <div className="foot-col">
          <span className="t-label foot-col-title">Web</span>
          <Link href={routes.home} className="t-body foot-link">
            Inicio
          </Link>
          <Link href={routes.projects} className="t-body foot-link">
            Proyectos
          </Link>
          <Link href={routes.services} className="t-body foot-link">
            Servicios
          </Link>
          <Link href={routes.studio} className="t-body foot-link">
            Estudio
          </Link>
          <Link href={routes.contact} className="t-body foot-link">
            Contacto
          </Link>
        </div>
        <div className="foot-col">
          <span className="t-label foot-col-title">{copy.footer.legal}</span>
          <Link href={routes.legal} className="t-body foot-link">
            Aviso legal
          </Link>
          <Link href={routes.privacy} className="t-body foot-link">
            Política de privacidad
          </Link>
          <Link href={routes.cookies} className="t-body foot-link">
            Cookies
          </Link>
        </div>
      </div>

      <div className="foot-bottom t-label">
        <span>
          © {year} {site.name}
        </span>
        <span>{copy.footer.rights}</span>
      </div>
      {mark && (
        <div className="foot-mark" aria-hidden="true">
          <Isotype />
        </div>
      )}
    </footer>
  );
}
