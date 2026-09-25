import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs, SiteFoot } from "@/components/site/v2/Page";
import { ContactSpread } from "@/components/site/v2/Home";
import { Reveal } from "@/components/site/v2/Reveal";
import { Works } from "@/components/site/v2/Works";
import { FaqBlock, MdBody, PostList, Sources, Toc } from "@/components/site/v2/Editorial";
import { BreadcrumbJsonLd, FaqJsonLd, PostJsonLd } from "@/components/seo/JsonLd";
import { getProject, type Project } from "@/lib/content";
import { formatDate, getPost, getPosts, getZone, relatedPosts } from "@/lib/editorial";
import { copy, editorialCopy } from "@/lib/copy";
import { routes, site } from "@/lib/site";

const t = editorialCopy.blog;

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: { absolute: `${post.title} | ${site.shortName}` },
    description: post.description,
    alternates: { canonical: routes.post(slug) },
    openGraph: {
      type: "article",
      title: `${post.title} · ${site.name}`,
      description: post.description,
      url: routes.post(slug),
      publishedTime: post.date,
      modifiedTime: post.updated,
      section: post.kicker,
    },
  };
}

// Artículo: rótulo y h1 arriba; debajo, la retícula de la ficha de obra (datos e índice a la
// izquierda, texto a la derecha). Cierran las preguntas, las obras citadas y otras lecturas.
export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const zones = post.zones.map((z) => getZone(z)).filter((z) => !!z);
  const works = post.projects.map((id) => getProject(id)).filter((p): p is Project => !!p && p.status === "published");
  const related = relatedPosts(post);

  return (
    <div className="page">
      <article>
        <header className="page-head wrap">
          <Crumbs items={[{ label: t.kicker, href: routes.blog }, { label: post.kicker }]} />
          <Reveal as="h1" className="t-display page-title post-h1" delay={60}>
            {post.h1}
          </Reveal>
          <Reveal as="p" className="t-lead page-lead" delay={130}>
            {post.lead}
          </Reveal>
        </header>

        <div data-menu="dark" className="sheet wrap">
          <aside className="sheet-facts">
            <div className="sheet-facts-inner">
              <dl className="facts">
                <dt className="t-label">{t.published}</dt>
                <dd className="t-body">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </dd>
                {post.updated !== post.date && (
                  <>
                    <dt className="t-label">{t.updated}</dt>
                    <dd className="t-body">
                      <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                    </dd>
                  </>
                )}
                <dt className="t-label">Lectura</dt>
                <dd className="t-body">
                  {post.minutes} {t.minutes}
                </dd>
                {zones.length > 0 && (
                  <>
                    <dt className="t-label">{t.zone}</dt>
                    <dd className="t-body md-zones">
                      {zones.map((z) => (
                        <Link key={z.slug} href={routes.zone(z.slug)} className="link-line">
                          {z.name}
                        </Link>
                      ))}
                    </dd>
                  </>
                )}
              </dl>
              <Toc headings={post.headings} />
            </div>
          </aside>
          <div className="sheet-text">
            <MdBody html={post.html} />
            <p className="t-label md-note">{t.note}</p>
            <Sources items={post.sources} />
          </div>
        </div>
      </article>

      <FaqBlock items={post.faq} title={t.faqTitle} />

      {works.length > 0 && (
        <section data-menu="dark" aria-labelledby="post-works">
          <div className="wrap">
            <h2 id="post-works" className="t-title vspace-title">
              {t.works}
            </h2>
          </div>
          <Works projects={works} heading="h3" />
        </section>
      )}

      {related.length > 0 && (
        <section data-menu="dark" className="wrap vspace" aria-labelledby="post-related">
          <h2 id="post-related" className="t-title">
            {t.related}
          </h2>
          <PostList posts={related} heading="h3" />
        </section>
      )}

      {/* el blog cierra con el formulario, no con la llamada a la visita (usuario, 25/09) */}
      <ContactSpread title={copy.contactCta.title} id="contacto" />
      <SiteFoot />
      <PostJsonLd post={post} />
      {post.faq.length > 0 && <FaqJsonLd items={post.faq} />}
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", href: "/" },
          { name: t.kicker, href: routes.blog },
          { name: post.h1, href: routes.post(post.slug) },
        ]}
      />
    </div>
  );
}
