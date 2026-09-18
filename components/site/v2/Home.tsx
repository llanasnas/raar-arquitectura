import Image from "next/image";
import Link from "next/link";
import { Isotype } from "@/components/site/Isotype";
import { Reveal } from "@/components/site/v2/Reveal";
import { Works } from "@/components/site/v2/Works";
import { ContactFormV2 } from "@/components/forms/ContactFormV2";
import { Mail, Phone, Pin, Instagram } from "@/components/ui/Icon";
import { copy, studioPage } from "@/lib/copy";
import { routes, site } from "@/lib/site";
import type { Project } from "@/lib/content";

// Los bloques de la portada según la maqueta del cliente («Opción S», 18/09/2026): filosofía,
// obras destacadas, el estudio, dónde estamos y el formulario. Entre bloque y bloque va una
// regla que respeta los márgenes; nada sale a sangre fuera de la portada, que fue la primera
// indicación del cliente.

// Regla entre bloques: va dentro del `.wrap` para que empiece y acabe en el margen del texto.
export function Rule() {
  return (
    <div className="wrap" aria-hidden="true">
      <hr className="rule-line" />
    </div>
  );
}

// Filosofía: el isotipo, el rótulo y el arranque del manifiesto, centrado y en grande.
export function Philosophy() {
  const { kicker, text } = copy.home.philosophy;
  return (
    <section data-menu="dark" className="philo wrap">
      <Reveal className="philo-mark" variant="scale">
        <Isotype />
      </Reveal>
      <Reveal className="t-label philo-kicker" variant="line" delay={60}>
        {kicker}
      </Reveal>
      <Reveal as="blockquote" className="philo-text" delay={120}>
        {text}
      </Reveal>
    </section>
  );
}

// Obras destacadas: cuatro, en la retícula del índice pero con su propio ritmo (dos iguales
// arriba, una vertical y una apaisada abajo), y el enlace al índice entero.
export function Featured({ projects }: { projects: Project[] }) {
  return (
    <section
      data-menu="dark"
      className="featured"
      aria-labelledby="featured-title"
    >
      <div className="wrap">
        <Reveal as="h2" id="featured-title" className="t-title" variant="up">
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

// El estudio, como lo puso el cliente en la maqueta: rótulo, titular y el primer párrafo del
// manifiesto a la izquierda, con el isotipo debajo (que lleva a la página del estudio), y la
// foto de los tres a la derecha. La foto es de 640 px: a su tamaño, nunca a sangre.
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
          className="t-title about-title"
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

// Dónde estamos: los datos con su icono a la izquierda y el mapa a la derecha. Lo usan la
// portada y la página del estudio.
export function Where() {
  return (
    <section
      data-menu="dark"
      className="contact where wrap"
      aria-labelledby="where-title"
    >
      <div className="contact-side">
        <Reveal as="h2" id="where-title" className="t-title" variant="up">
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
        </ul>
      </div>
      <div className="contact-main">
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

// El cierre de la portada es el formulario, con las dos frases del cliente al lado.
export function HomeContact() {
  return (
    <section
      data-menu="dark"
      className="contact home-contact wrap"
      id="contacto"
      aria-labelledby="home-contact-title"
    >
      <div className="contact-side">
        <Reveal
          as="h2"
          id="home-contact-title"
          className="t-title home-contact-title"
          variant="up"
        >
          {copy.home.contact.title}
        </Reveal>
        <Reveal as="p" className="t-title home-contact-cta" delay={80}>
          {copy.home.contact.cta}
        </Reveal>
      </div>
      <div className="contact-main">
        <ContactFormV2 />
      </div>
    </section>
  );
}
