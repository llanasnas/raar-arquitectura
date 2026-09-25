import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs, SiteFoot } from "@/components/site/v2/Page";
import { Reveal } from "@/components/site/v2/Reveal";
import { ProjectJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { HeroSlider } from "@/components/projects/HeroSlider";
import { LightboxItem, LightboxProvider } from "@/components/projects/Lightbox";
import { getAdjacentProjects, getProject, getProjects } from "@/lib/content";
import { copy } from "@/lib/copy";
import { routes, site } from "@/lib/site";

export function generateStaticParams() {
  return getProjects().map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<"/proyectos/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const p = getProject(id);
  if (!p) return {};
  const title = `${p.name} · ${p.place}`;
  const description =
    p.status === "published"
      ? `${p.typeLabel} en ${p.placeFull || p.place}. ${p.text.intro[0]?.slice(0, 150) ?? ""}`
      : copy.projects.inProcessText;
  return {
    title,
    description,
    alternates: { canonical: routes.project(id) },
    openGraph: { title: `${title} · ${site.name}`, description, images: p.hero ? [p.hero.src] : [p.thumb.src], url: routes.project(id) },
  };
}

// Ficha de obra en lenguaje v2, afinada con la guía del cliente (21/09/2026): la apertura es
// un pase de tres fotos, y debajo, como en su web anterior, la referencia, el lugar y el tipo
// en grande a la izquierda con el texto a media columna, en un cuerpo más pequeño. Los renders
// y los planos abren la lupa; la apertura no (el clic pasa a la foto siguiente).
export default async function ProjectPage(props: PageProps<"/proyectos/[id]">) {
  const { id } = await props.params;
  const p = getProject(id);
  if (!p) notFound();
  const { prev, next } = getAdjacentProjects(id);
  const t = copy.projects;

  // la apertura: la lámina principal y las dos primeras de la galería que no sean ella
  const heroItems = p.hero ? [p.hero, ...p.gallery.filter((g) => g.src !== p.hero?.src)].slice(0, 3) : [];
  // una sola lupa para renders y planos, en la misma secuencia
  const lightbox = [...p.gallery, ...p.plans];
  const plansOffset = p.gallery.length;

  return (
    <LightboxProvider items={lightbox} label={`${p.name} · ${t.renders}`}>
      <div className="page">
        <div className="pj-head wrap">
          <Crumbs items={[{ label: t.back, href: routes.projects }, { label: p.codeDisplay }]} />
        </div>

        {heroItems.length > 0 ? (
          <HeroSlider items={heroItems} label={`${p.name} · ${t.renders}`} title={p.name} />
        ) : (
          <h1 className="t-title pj-title wrap">{p.name}</h1>
        )}

        {p.status === "processing" ? (
          <section data-menu="dark" className="sheet wrap">
            <div className="sheet-facts">
              <div className="sheet-facts-inner">
                <span className="t-label">{p.codeDisplay}</span>
                <div className="plate-wip">
                  <Image src={p.thumb.src} alt={p.thumb.alt} fill sizes="(min-width: 900px) 25vw, 100vw" className="object-cover" />
                </div>
              </div>
            </div>
            <div className="sheet-text">
              <h2 className="t-title">{t.inProcessTitle}</h2>
              <p className="sheet-p">{t.inProcessText}</p>
            </div>
          </section>
        ) : (
          <>
            {/* ficha técnica pegada al margen + texto de apertura */}
            <section data-menu="dark" className="sheet wrap">
              <div className="sheet-facts">
                <div className="sheet-facts-inner">
                  {/* referencia, lugar y tipo en grande, como las tres líneas de la web anterior */}
                  <h2 className="pj-big">
                    <span>{p.codeDisplay}</span>
                    <span>{p.place}</span>
                    <span>{p.typeLabel}</span>
                  </h2>
                  {(p.typology || p.surface || p.year) && (
                    <dl className="facts">
                      {p.typology && (
                        <>
                          <dt className="t-label">{t.typology}</dt>
                          <dd className="t-body">{p.typology}</dd>
                        </>
                      )}
                      {p.surface && (
                        <>
                          <dt className="t-label">{t.surface}</dt>
                          <dd className="t-body">{p.surface}</dd>
                        </>
                      )}
                      {p.year && (
                        <>
                          <dt className="t-label">{t.year}</dt>
                          <dd className="t-body">{p.year}</dd>
                        </>
                      )}
                    </dl>
                  )}
                  {p.text.facts.length > 0 && (
                    <ul className="sheet-notes">
                      {p.text.facts.map((f, i) => (
                        <li key={i} className="sheet-note">
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  {p.lang === "en" && <p className="t-label">{t.langNote}</p>}
                </div>
              </div>
              <div className="sheet-text">
                {p.text.intro.map((text, i) => (
                  <Reveal key={i} as="p" className="sheet-p" variant="up" delay={i * 70}>
                    {text}
                  </Reveal>
                ))}
              </div>
            </section>

            {/* diagrama de proyecto: del emplazamiento a la planta. Su pie va a la izquierda, en
                la columna de la ficha, y el dibujo en la del texto (guía del cliente, 21/09) */}
            {p.conceptVideo && (
              <figure className="sheet pj-diagram wrap">
                <figcaption className="sheet-facts pj-diagram-cap">
                  <span className="t-label">{t.concept}</span>
                  <span className="t-label">{t.conceptNote}</span>
                </figcaption>
                <div className="sheet-text gal-diagram">
                  <video
                    src={p.conceptVideo.src}
                    poster={p.conceptVideo.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="gal-ink"
                    aria-label={`${t.concept} — ${p.code}`}
                  />
                </div>
              </figure>
            )}

            {/* segundo bloque de texto + renders */}
            {p.text.block2.length > 0 && (
              <section data-menu="dark" className="sheet wrap">
                <div className="sheet-text">
                  {p.text.block2.map((text, i) => (
                    <Reveal key={i} as="p" className="sheet-p" variant="up" delay={i * 70}>
                      {text}
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {p.gallery.length > 0 && (
              <div className="gal wrap">
                {p.gallery.map((g, i) => {
                  const wide = i % 3 === 0;
                  return (
                    <Reveal key={g.src} as="figure" className={`gal-item ${wide ? "gal-wide" : ""}`} variant="wipe" delay={(i % 2) * 90}>
                      <LightboxItem index={i} label={g.alt} className="gal-plate">
                        <Image src={g.src} alt={g.alt} fill sizes={wide ? "100vw" : "(min-width: 900px) 50vw, 100vw"} className="object-cover" />
                      </LightboxItem>
                      {g.alt && <figcaption className="t-label gal-cap">{g.alt}</figcaption>}
                    </Reveal>
                  );
                })}
              </div>
            )}

            {/* tercer bloque de texto + planos */}
            {p.text.block3.length > 0 && (
              <section data-menu="dark" className="sheet wrap">
                <div className="sheet-text">
                  {p.text.block3.map((text, i) => (
                    <Reveal key={i} as="p" className="sheet-p" variant="up" delay={i * 70}>
                      {text}
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {p.plans.length > 0 && (
              <div className="wrap">
                <h2 className="t-label">{t.plans}</h2>
                <div className="gal">
                  {p.plans.map((pl, i) => (
                    <figure key={pl.src} className="gal-item">
                      {/* sin caja blanca, la lámina toma la proporción real del plano: así no queda aire arriba y abajo */}
                      <LightboxItem
                        index={plansOffset + i}
                        label={pl.label ?? pl.alt}
                        className="gal-plate gal-plate-plan"
                        style={pl.width && pl.height ? ({ "--gal-ar": `${pl.width} / ${pl.height}` } as CSSProperties) : undefined}
                      >
                        <Image src={pl.src} alt={pl.label ?? pl.alt} fill sizes="(min-width: 900px) 50vw, 100vw" className="gal-ink object-contain" />
                      </LightboxItem>
                      <figcaption className="t-label gal-cap">{pl.label ?? pl.alt}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <nav aria-label="Otros proyectos" className="pager wrap">
          {prev && (
            <Link href={routes.project(prev.id)}>
              <span className="t-label">← {t.prev}</span>
              <span className="pager-name">{prev.name}</span>
            </Link>
          )}
          {next && (
            <Link href={routes.project(next.id)} className="pager-next">
              <span className="t-label">{t.next} →</span>
              <span className="pager-name">{next.name}</span>
            </Link>
          )}
        </nav>

        {/* sin «¿Tienes una casa parecida?»: el cliente lo quitó entero (guía del 21/09) */}
        <SiteFoot />
        <ProjectJsonLd project={p} />
        <BreadcrumbJsonLd
          items={[{ name: "Inicio", href: "/" }, { name: t.title, href: routes.projects }, { name: p.name, href: routes.project(p.id) }]}
        />
      </div>
    </LightboxProvider>
  );
}
