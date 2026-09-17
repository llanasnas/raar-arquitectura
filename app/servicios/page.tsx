import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHead, Steps, Faq, CtaBlock, SiteFoot } from "@/components/site/v2/Page";
import { Reveal } from "@/components/site/v2/Reveal";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { getProject } from "@/lib/content";
import { copy, servicesPage } from "@/lib/copy";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reforma integral, obra nueva y rehabilitación en Barcelona",
  description: servicesPage.lead,
  alternates: { canonical: routes.services },
};

// Las fotos que dio el cliente para cada servicio (las mismas que en la home).
const SERVICE_IMAGE: Record<string, string> = {
  "reforma-integral": "/services/reforma_integral.png",
  "obra-nueva": "/services/obra_nueva.png",
  rehabilitacion: "/services/rehabilitacion_de_naves.png",
};

// Adónde lleva cada servicio en el formulario: el desplegable ya viene elegido.
const FORM_TYPE: Record<string, string> = {
  "reforma-integral": "reforma",
  "obra-nueva": "obra-nueva",
  rehabilitacion: "rehabilitacion",
};

// Servicios como pliegos alternos: la foto a un lado, la ficha al otro y, debajo, tres obras
// de ejemplo. Lo que antes eran tarjetas con sombra ahora son láminas a media página.
export default function ServicesPage() {
  return (
    <div className="page">
      <PageHead kicker="Servicios" title={servicesPage.title} lead={servicesPage.lead}>
        <nav aria-label="Servicios" className="filters">
          {copy.services.items.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="t-label filter">
              {s.title}
            </a>
          ))}
        </nav>
      </PageHead>

      {copy.services.items.map((s, i) => {
        const examples = s.examples.map((id) => getProject(id)).filter((p) => !!p);
        return (
          <section key={s.id} id={s.id} data-menu="dark" className="srv wrap" data-side={i % 2 ? "right" : "left"}>
            <div className="srv-media">
              <Reveal className="srv-plate" variant="wipe">
                <Image
                  src={SERVICE_IMAGE[s.id]}
                  alt=""
                  fill
                  sizes="(min-width: 900px) 50vw, 100vw"
                  priority={i === 0}
                  className="object-cover"
                />
              </Reveal>
              {examples.length > 0 && (
                <div className="srv-eg">
                  {examples.map((p) => (
                    <Link key={p.id} href={routes.project(p.id)}>
                      <span className="srv-eg-plate">
                        <Image src={p.thumb.src} alt={p.thumb.alt} fill sizes="(min-width: 900px) 17vw, 30vw" className="object-cover" />
                      </span>
                      <span className="t-label gal-cap">{p.codeDisplay}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="srv-body">
              <div className="srv-body-inner">
                <span className="t-label">{`0${i + 1}`}</span>
                <h2 className="t-title srv-name">{s.title}</h2>
                <p className="t-label">{s.who}</p>
                <p className="t-body srv-text">{s.text}</p>
                <Link href={`${routes.contact}?tipo=${FORM_TYPE[s.id]}`} className="link-underline">
                  {copy.nav.ctaLong}
                </Link>
              </div>
            </div>
          </section>
        );
      })}

      <section data-menu="dark" className="sheet wrap">
        <div className="sheet-facts">
          <div className="sheet-facts-inner">
            <h2 className="t-title">{servicesPage.includes}</h2>
            <p className="t-label">{servicesPage.scopeNote}</p>
          </div>
        </div>
        <ul className="sheet-text list-rule">
          {servicesPage.scope.map((item) => (
            <li key={item} className="t-body">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <Steps />
      <Faq />
      <CtaBlock />
      <SiteFoot />
      <FaqJsonLd items={copy.faq.items} />
      <BreadcrumbJsonLd items={[{ name: "Inicio", href: "/" }, { name: servicesPage.title, href: routes.services }]} />
    </div>
  );
}
