import Link from "next/link";
import type { ReactNode } from "react";
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
export function Faq() {
  return (
    <section data-menu="dark" className="wrap vspace">
      <Reveal as="h2" className="t-title" variant="up">
        {copy.faq.title}
      </Reveal>
      <div className="faq vspace-list">
        {copy.faq.items.map((item) => (
          <details key={item.q} className="faq-item">
            <summary>{item.q}</summary>
            <p className="t-body faq-a">{item.a}</p>
          </details>
        ))}
      </div>
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
        {title ?? copy.contactCta.title}
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

// Pie: mono, de una sola línea de alto, con lo que la ley pide y nada más. El menú fijo está
// justo debajo, así que la página reserva su altura con .page.
export function SiteFoot() {
  return (
    <footer data-menu="dark" className="foot wrap">
      <div className="foot-row t-label">
        <span>
          {site.name} · {site.address.street}, {site.address.postalCode} {site.address.city}
        </span>
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <a href={site.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </div>
      <div className="foot-row t-label">
        <Link href={routes.projects}>Proyectos</Link>
        <Link href={routes.services}>Servicios</Link>
        <Link href={routes.studio}>Estudio</Link>
        <Link href={routes.contact}>Contacto</Link>
        <Link href={routes.legal}>Aviso legal</Link>
        <Link href={routes.privacy}>Privacidad</Link>
        <Link href={routes.cookies}>Cookies</Link>
      </div>
    </footer>
  );
}
