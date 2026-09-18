import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs, CtaBlock, SiteFoot } from "@/components/site/v2/Page";
import { Reveal } from "@/components/site/v2/Reveal";
import { ProjectJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
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

// Ficha de obra en lenguaje v2: apertura a sangre, ficha pegada al margen y el texto del
// estudio a media columna, como el reportaje de una revista. Cualquier imagen abre la lupa.
export default async function ProjectPage(props: PageProps<"/proyectos/[id]">) {
  const { id } = await props.params;
  const p = getProject(id);
  if (!p) notFound();
  const { prev, next } = getAdjacentProjects(id);
  const t = copy.projects;

  // una sola lupa para toda la página: apertura, renders y planos en la misma secuencia
  const heroSrc = p.hero?.src;
  const heroInGallery = heroSrc ? p.gallery.findIndex((g) => g.src === heroSrc) : -1;
  const heroExtra = p.hero && heroInGallery < 0 ? [p.hero] : [];
  const lightbox = [...heroExtra, ...p.gallery, ...p.plans];
  const heroIndex = Math.max(heroInGallery, 0);
  const galleryOffset = heroExtra.length;
  const plansOffset = galleryOffset + p.gallery.length;

  return (
    <LightboxProvider items={lightbox} label={`${p.name} · ${t.renders}`}>
      <div className="page">
        <div className="pj-head wrap">
          <Crumbs items={[{ label: t.back, href: routes.projects }, { label: p.codeDisplay }]} />
          <Reveal as="h1" className="t-display pj-title" variant="up">
            {p.name}
          </Reveal>
          <div className="pj-meta t-label">
            <span>{p.placeFull || p.place}</span>
            <span>{p.typeLabel}</span>
            {p.surface && <span>{p.surface}</span>}
            {p.year && <span>{p.year}</span>}
          </div>
        </div>

        {p.hero && (
          <div className="pj-hero">
            <LightboxItem index={heroIndex} label={p.hero.alt} className="pj-hero-btn">
              <Image src={p.hero.src} alt={p.hero.alt} fill priority sizes="100vw" className="object-cover" />
            </LightboxItem>
          </div>
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
                  <h2 className="t-label">{t.sheet}</h2>
                  <dl className="facts">
                    <dt className="t-label">{t.location}</dt>
                    <dd className="t-body">{p.placeFull || p.place}</dd>
                    <dt className="t-label">{t.typeLabel}</dt>
                    <dd className="t-body">{p.typeLabel}</dd>
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

            {/* diagrama de proyecto: del emplazamiento a la planta */}
            {p.conceptVideo && (
              <div className="gal wrap">
                <figure className="gal-item gal-diagram">
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
                  <figcaption className="t-label gal-cap">
                    {t.concept} · {t.conceptNote}
                  </figcaption>
                </figure>
              </div>
            )}

            {/* segundo bloque de texto + renders */}
            <section data-menu="dark" className="sheet wrap">
              <div className="sheet-text">
                {p.text.block2.map((text, i) => (
                  <Reveal key={i} as="p" className="sheet-p" variant="up" delay={i * 70}>
                    {text}
                  </Reveal>
                ))}
              </div>
            </section>

            {p.gallery.length > 0 && (
              <div className="gal wrap">
                {p.gallery.map((g, i) => {
                  const wide = i % 3 === 0;
                  return (
                    <Reveal key={g.src} as="figure" className={`gal-item ${wide ? "gal-wide" : ""}`} variant="wipe" delay={(i % 2) * 90}>
                      <LightboxItem index={galleryOffset + i} label={g.alt} className="gal-plate">
                        <Image src={g.src} alt={g.alt} fill sizes={wide ? "100vw" : "(min-width: 900px) 50vw, 100vw"} className="object-cover" />
                      </LightboxItem>
                      {g.alt && <figcaption className="t-label gal-cap">{g.alt}</figcaption>}
                    </Reveal>
                  );
                })}
              </div>
            )}

            {/* tercer bloque de texto + planos */}
            <section data-menu="dark" className="sheet wrap">
              <div className="sheet-text">
                {p.text.block3.map((text, i) => (
                  <Reveal key={i} as="p" className="sheet-p" variant="up" delay={i * 70}>
                    {text}
                  </Reveal>
                ))}
              </div>
            </section>

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

        <CtaBlock title={t.ctaTitle} lead={t.ctaText} />
        <SiteFoot />
        <ProjectJsonLd project={p} />
        <BreadcrumbJsonLd
          items={[{ name: "Inicio", href: "/" }, { name: t.title, href: routes.projects }, { name: p.name, href: routes.project(p.id) }]}
        />
      </div>
    </LightboxProvider>
  );
}
