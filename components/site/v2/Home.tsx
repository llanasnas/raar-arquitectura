import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Isotype } from "@/components/site/Isotype";
import { Reveal } from "@/components/site/v2/Reveal";
import { Works } from "@/components/site/v2/Works";
import { ContactFormV2 } from "@/components/forms/ContactFormV2";
import { Mail, Phone, Pin, Instagram, LinkedIn } from "@/components/ui/Icon";
import { copy, studioPage } from "@/lib/copy";
import { routes, site } from "@/lib/site";
import type { Project } from "@/lib/content";

// Los bloques de la portada según la maqueta del cliente («Opción S», 18/09/2026) y su «Guia
// per a web» (21/09/2026): filosofía, obras destacadas, el estudio, dónde estamos y el
// formulario. Entre bloque y bloque va una regla que respeta los márgenes; nada sale a
// sangre fuera de la portada, que fue la primera indicación del cliente.

// Regla entre bloques: va dentro del `.wrap` para que empiece y acabe en el margen del texto.
export function Rule() {
  return (
    <div className="wrap" aria-hidden="true">
      <hr className="rule-line" />
    </div>
  );
}

// Filosofía: solo el arranque del manifiesto, centrado y en grande, y el isotipo debajo.
// El rótulo «Filosofía» lo quitó el cliente (guía del 21/09).
export function Philosophy() {
  return (
    <section data-menu="dark" className="philo wrap">
      <Reveal as="blockquote" className="philo-text">
        {copy.home.philosophy.text}
      </Reveal>
      <Reveal className="philo-mark" variant="scale" delay={120}>
        <Isotype />
      </Reveal>
    </section>
  );
}

// Obras destacadas: las seis que eligió el cliente, en la retícula del índice pero con su
// propio ritmo (ver .works-featured), y el enlace al índice entero.
export function Featured({ projects }: { projects: Project[] }) {
  return (
    <section
      data-menu="dark"
      className="featured"
      aria-labelledby="featured-title"
    >
      <div className="wrap">
        <Reveal as="h2" id="featured-title" className="sec-title" variant="up">
          {copy.home.featured.title}
        </Reveal>
      </div>
      <Works projects={projects} rhythm="featured" heading="h3" />
      <div className="wrap">
        <Reveal delay={80}>
          <Link href={routes.projects} className="link-underline">
            {copy.home.featured.all}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

// El estudio, como lo puso el cliente en la maqueta: rótulo, titular (grande, guía del 21/09)
// y el primer párrafo del manifiesto a la izquierda, con el isotipo debajo (que lleva a la
// página del estudio), y la foto de los tres a la derecha. La foto es de 640 px: a su tamaño,
// nunca a sangre.
export function About() {
  const [opening] = studioPage.manifesto;
  return (
    <section
      data-menu="dark"
      className="about wrap"
      id="estudio"
      aria-labelledby="about-title"
    >
      <div className="about-text">
        <Reveal className="t-label" variant="line">
          {studioPage.title}
        </Reveal>
        <Reveal
          as="h2"
          id="about-title"
          className="sec-title about-title"
          delay={60}
        >
          {copy.studio.title}
        </Reveal>
        <Reveal as="p" className="about-p" delay={120}>
          {opening}
        </Reveal>
        <Reveal className="about-foot" delay={180}>
          <Link
            href={routes.studio}
            className="about-mark"
            aria-label={copy.studio.cta}
          >
            <Isotype />
          </Link>
        </Reveal>
      </div>
      <figure className="about-media">
        <Reveal className="studio-plate" variant="wipe" delay={80}>
          <Image
            src="/images/about/team-aerial.jpg"
            alt={copy.studio.photoAlt}
            fill
            sizes="(min-width: 900px) 640px, 100vw"
            className="object-cover"
          />
        </Reveal>
      </figure>
    </section>
  );
}

// Dónde estamos: el título y los datos en la columna de la izquierda, el mapa a la derecha,
// en la misma retícula que el estudio (así el mapa y la foto de los tres quedan alineados por
// los dos lados). El título arranca a la altura del mapa y los datos van con su interlínea
// normal: lo que sobra, sobra por abajo (cliente, 22/09). Lo usan la portada y /estudio.
export function Where() {
  return (
    <section
      data-menu="dark"
      className="where wrap"
      aria-labelledby="where-title"
    >
      <div className="where-side">
        <Reveal as="h2" id="where-title" className="sec-title" variant="up">
          {studioPage.whereTitle}
        </Reveal>
        <ul className="where-list">
          <li>
            <Phone />
            <a href={site.phoneHref} className="t-label link-line">
              {site.phone}
            </a>
          </li>
          <li>
            <Mail />
            <a href={`mailto:${site.email}`} className="t-label link-line">
              {site.email}
            </a>
          </li>
          <li>
            <Pin />
            <span className="t-label">
              {site.address.street}, {site.address.postalCode}{" "}
              {site.address.city}
            </span>
          </li>
          <li>
            <Instagram />
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="t-label link-line"
            >
              @raar.arquitectura
            </a>
          </li>
          {/* la URL de LinkedIn la tiene que dar el cliente: sin ella, no se pinta el enlace */}
          {site.linkedin && (
            <li>
              <LinkedIn />
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="t-label link-line">
                LinkedIn
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="where-map">
        <iframe
          title={`Mapa: ${site.address.street}, ${site.address.city}`}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${site.geo.lng - 0.006}%2C${site.geo.lat - 0.004}%2C${site.geo.lng + 0.006}%2C${site.geo.lat + 0.004}&layer=mapnik&marker=${site.geo.lat}%2C${site.geo.lng}`}
          className="map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}

// El bloque de contacto, el mismo en la portada y en /contacto (guía del cliente, 21/09):
// el título grande arriba, a una línea, la foto del teléfono a la izquierda y a la derecha
// «Contacta con nosotros:» con el formulario debajo, **a la altura de la foto**: la foto va
// a su proporción y los campos se reparten hasta abajo (cliente, 22/09). Si el formulario es
// más alto que la foto (pantalla estrecha), es la foto la que se estira. `heading` es h1 en
// la página de contacto y h2 en la portada; `aside` va bajo la foto, en su propia fila (los
// datos del estudio en /contacto).
//
// `parts` parte el título en dos y cada mitad **sube desde debajo de su línea**, una detrás
// de otra (cliente, 22/09): es el título de /contacto, «Hazlo tuyo. Hazlo RAAR.».
export function ContactSpread({
  title,
  parts,
  cta = copy.home.contact.cta,
  heading: Heading = "h2",
  id = "contacto",
  defaultType,
  aside,
}: {
  title: string;
  parts?: readonly string[];
  cta?: string;
  heading?: "h1" | "h2";
  id?: string;
  defaultType?: string;
  aside?: ReactNode;
}) {
  return (
    <section
      data-menu="dark"
      className="contact-2 wrap"
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <Reveal
        as={Heading}
        id={`${id}-title`}
        className="sec-title contact-2-title"
        variant={parts ? "none" : "up"}
        data-parts={parts ? "" : undefined}
        aria-label={parts ? title : undefined}
      >
        {parts
          ? parts.map((part, i) => (
              // el espacio va fuera de la caja que recorta: dentro se lo come el overflow
              <Fragment key={part}>
                {i > 0 ? " " : null}
                <span className="hz" style={{ "--i": i } as CSSProperties}>
                  <span>{part}</span>
                </span>
              </Fragment>
            ))
          : title}
      </Reveal>
      <div className="contact-2-body">
        <div className="contact-2-side">
          <figure className="contact-2-media">
            <Reveal className="contact-2-plate" variant="wipe" delay={60}>
              <Image
                src="/images/contact/phone.jpg"
                alt={copy.home.contact.photoAlt}
                fill
                sizes="(min-width: 900px) 34vw, 100vw"
                className="object-cover"
              />
            </Reveal>
          </figure>
        </div>
        <div className="contact-2-main">
          <Reveal as="p" className="t-title contact-2-cta" delay={80}>
            {cta}
          </Reveal>
          <ContactFormV2 defaultType={defaultType} />
        </div>
        {/* los datos van en una fila aparte, bajo la foto: en la misma columna estiraban la
            fila y el formulario ya no acababa donde la foto */}
        {aside && <div className="contact-2-aside">{aside}</div>}
      </div>
    </section>
  );
}

// El cierre de la portada es el formulario, con las frases del cliente.
export function HomeContact() {
  return <ContactSpread title={copy.home.contact.title} />;
}
