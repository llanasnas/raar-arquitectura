import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs, CtaBlock, SiteFoot, Steps } from "@/components/site/v2/Page";
import { Reveal } from "@/components/site/v2/Reveal";
import { Works } from "@/components/site/v2/Works";
import { FaqBlock, MdBody, PostList, Sources, Toc } from "@/components/site/v2/Editorial";
import { BreadcrumbJsonLd, FaqJsonLd, ZoneJsonLd } from "@/components/seo/JsonLd";
import { getProject, type Project } from "@/lib/content";
import { getZone, getZones, postsForZone } from "@/lib/editorial";
import { copy, editorialCopy } from "@/lib/copy";
import { routes, site } from "@/lib/site";

const t = editorialCopy.zones;

export const dynamicParams = false;

export function generateStaticParams() {
  return getZones().map((z) => ({ zona: z.slug }));
}

export async function generateMetadata(props: PageProps<"/arquitectos/[zona]">): Promise<Metadata> {
  const { zona } = await props.params;
  const zone = getZone(zona);
  if (!zone) return {};
  const project = zone.projects.map((id) => getProject(id)).find((p) => p?.hero);
  return {
    title: { absolute: `${zone.title} | ${site.shortName}` },
    description: zone.description,
    alternates: { canonical: routes.zone(zona) },
    openGraph: {
      title: `${zone.title} · ${site.name}`,
      description: zone.description,
      url: routes.zone(zona),
      ...(project?.hero ? { images: [project.hero.src] } : {}),
    },
  };
}

// Página de zona (SEO local): qué hacemos allí, la obra que tenemos allí, lo que hay que saber
// de su normativa y cómo empezamos. Retícula de la ficha de obra, y obra con el índice de siempre.
export default async function ZonePage(props: PageProps<"/arquitectos/[zona]">) {
  const { zona } = await props.params;
  const zone = getZone(zona);
  if (!zone) notFound();

  const works = zone.projects.map((id) => getProject(id)).filter((p): p is Project => !!p);
  const posts = postsForZone(zone.slug);
  const others = getZones().filter((z) => z.slug !== zone.slug);

  return (
    <div className="page">
      <header className="page-head wrap">
        <Crumbs items={[{ label: t.kicker, href: routes.zones }, { label: zone.name }]} />
        <Reveal as="h1" className="t-display page-title" delay={60}>
          {zone.h1}
        </Reveal>
        <Reveal as="p" className="t-lead page-lead" delay={130}>
          {zone.lead}
        </Reveal>
        <Reveal className="cta-2-row" delay={180}>
          <Link href={routes.contact} className="link-big">
            {copy.nav.ctaLong}
          </Link>
          <a href={site.phoneHref} className="t-label link-line">
            {site.phone}
          </a>
        </Reveal>
      </header>

      <div data-menu="dark" className="sheet wrap">
        <aside className="sheet-facts">
          <div className="sheet-facts-inner">
            <dl className="facts">
              <dt className="t-label">{t.area}</dt>
              <dd className="t-body">{zone.region}</dd>
              <dt className="t-label">{t.studio}</dt>
              <dd className="t-body">
                {site.address.street}, {site.address.city}
              </dd>
              <dt className="t-label">{t.visit}</dt>
              <dd className="t-body">{t.visitText}</dd>
            </dl>
            <Toc headings={zone.headings} />
          </div>
        </aside>
        <div className="sheet-text">
          <MdBody html={zone.html} />
          <Sources items={zone.sources} />
        </div>
      </div>

      <section data-menu="dark" aria-labelledby="zone-works">
        <div className="wrap">
          <h2 id="zone-works" className="t-title vspace-title">
            {t.works}
          </h2>
          {works.length === 0 && <p className="t-body vspace-note">{t.worksNone}</p>}
        </div>
        {works.length > 0 && <Works projects={works} heading="h3" />}
      </section>

      <FaqBlock items={zone.faq} title={`${t.faqTitle} ${zone.name}`} />

      {posts.length > 0 && (
        <section data-menu="dark" className="wrap vspace" aria-labelledby="zone-posts">
          <h2 id="zone-posts" className="t-title">
            {t.posts}
          </h2>
          <PostList posts={posts} heading="h3" />
        </section>
      )}

      <Steps />

      <nav data-menu="dark" aria-label={t.all} className="wrap vspace">
        <div className="filters">
          <Link href={routes.zones} className="t-label filter">
            {t.all}
          </Link>
          {others.map((z) => (
            <Link key={z.slug} href={routes.zone(z.slug)} className="t-label filter">
              {z.name}
            </Link>
          ))}
        </div>
      </nav>

      <CtaBlock />
      <SiteFoot />
      <ZoneJsonLd zone={zone} />
      {zone.faq.length > 0 && <FaqJsonLd items={zone.faq} />}
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", href: "/" },
          { name: t.kicker, href: routes.zones },
          { name: zone.h1, href: routes.zone(zone.slug) },
        ]}
      />
    </div>
  );
}
