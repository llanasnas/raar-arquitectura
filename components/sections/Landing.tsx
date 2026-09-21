import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProjectTile, type TileAspect } from "@/components/projects/ProjectTile";
import { Parallax } from "@/components/ui/Parallax";
import { ArrowRight, Plus, Phone, Mail, Pin } from "@/components/ui/Icon";
import { copy } from "@/lib/copy";
import { routes, site } from "@/lib/site";
import { getFeaturedProjects, getProject } from "@/lib/content";
import { ContactForm } from "@/components/forms/ContactForm";

/* ── 4.1 contexto: prueba local ─────────────────────────────── */
export function ContextStrip() {
  return (
    <div className="px-(--gutter) py-6 border-b border-line"><div className="mx-auto max-w-(--container) flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-ink-2">{copy.context.line}</span>
        <span className="font-medium">{site.areas.join(" · ")}</span>
      </p>
      <p className="label">{copy.hero.videoNote}</p>
    </div></div>
  );
}

/* ── 4.2 proyectos destacados ───────────────────────────────── */
// Six plates flowing down three columns (two per way of starting a house). Heights come
// from the crops so the columns stagger on their own; a specific render replaces the hero
// where the crop asks for it. On phones only the first of each pair stays, one per way.
const MOSAIC: Record<string, { aspect: TileAspect; image?: string }> = {
  vi02: { aspect: "4/5" },
  pe17: { aspect: "4/3" },
  ar07: { aspect: "4/3" },
  gg01: { aspect: "4/5", image: "/images/projects/gg01/render-04-acceso.jpg" },
  mo07: { aspect: "3/4", image: "/images/projects/mo07/render-01-escena-1.jpg" },
  to39: { aspect: "4/3" },
};

export function FeaturedProjects() {
  const projects = getFeaturedProjects();
  return (
    <Section id="proyectos">
      <SectionHeading title={copy.featured.title} lead={copy.featured.lead} />
      <div className="mosaic">
        {projects.map((p, i) => (
          <ProjectTile key={p.id} project={p} aspect={MOSAIC[p.id]?.aspect ?? "4/3"} image={MOSAIC[p.id]?.image} reveal={i % 2 ? "scale" : "up"} className={i % 2 ? "max-sm:hidden" : ""} />
        ))}
      </div>
      <div className="mt-12" data-reveal="up">
        <Link href={routes.projects} className="btn btn-outline">
          {copy.featured.all} <ArrowRight />
        </Link>
      </div>
    </Section>
  );
}

/* ── 4.3 servicios ──────────────────────────────────────────── */
// En la home los servicios van con imagen; las láminas dibujadas (ServiceArt) siguen en /servicios.
const SERVICE_IMAGE: Record<string, string> = {
  "reforma-integral": "/services/reforma_integral.png",
  "obra-nueva": "/services/obra_nueva.png",
  rehabilitacion: "/services/rehabilitacion_de_naves.png",
};

export function Services() {
  return (
    <Section id="servicios" className="border-t border-line">
      <SectionHeading title={copy.services.title} />
      <div className="grid md:grid-cols-3 gap-6">
        {copy.services.items.map((s) => (
          <article key={s.id} className="card p-7 md:p-8 flex flex-col" data-reveal="up">
            <div className="plate relative aspect-[3/2] mb-6">
              <Image src={SERVICE_IMAGE[s.id]} alt="" fill sizes="(min-width: 768px) 30vw, 88vw" className="object-cover" />
            </div>
            <h3 className="display-3">{s.title}</h3>
            <p className="accent text-ink-2 text-[1.1rem] mt-3">{s.who}</p>
            <p className="mt-4 text-ink-2 flex-1">{s.text}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {s.examples.map((id) => {
                const p = getProject(id);
                if (!p) return null;
                return (
                  <li key={id}>
                    <Link href={routes.project(id)} className="chip-pill code">
                      {p.codeDisplay} <span className="font-normal normal-case tracking-normal text-ink-2">· {p.place}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link href={`${routes.services}#${s.id}`} className="inline-flex items-center gap-2 mt-7 font-medium hover:text-red">
              {copy.services.more} <ArrowRight />
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ── 4.4 proceso ────────────────────────────────────────────── */
export function Process() {
  return (
    <Section id="proceso" className="border-t border-line">
      <SectionHeading title={copy.process.title} lead={copy.process.lead} />
      <ol className="grid md:grid-cols-4 gap-6">
        {copy.process.steps.map((s, i) => (
          <li key={s.n} data-reveal="up" className={`rounded-(--r) p-7 flex flex-col ${i === 0 ? "bg-ink text-stone" : "bg-white/60 border border-line"}`}>
            <span className={`code ${i === 0 ? "text-stone/60" : "text-ink-3"}`}>{s.n}</span>
            <h3 className="display-3 mt-4 flex items-baseline gap-3">
              {s.title}
              {"free" in s && s.free && <span className="accent text-[1rem] opacity-70">gratis</span>}
            </h3>
            <p className={`mt-3 flex-1 ${i === 0 ? "text-stone/80" : "text-ink-2"}`}>{s.text}</p>
            {i === 0 && (
              <Link href={routes.contact} className="btn btn-red btn-sm mt-6 self-start">
                {copy.process.cta}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <p className="label mt-8 max-w-[60ch] normal-case tracking-normal" data-reveal="up">{copy.process.note}</p>
    </Section>
  );
}

/* ── 4.5 testimonios (oculto hasta tener reales) ────────────── */
export function Testimonials() {
  if (copy.testimonials.items.length === 0) return null;
  return (
    <Section id="clientes" className="border-t border-line">
      <SectionHeading title={copy.testimonials.title} />
      <ul className="grid md:grid-cols-3 gap-6">
        {copy.testimonials.items.map((t) => (
          <li key={t.name} className="card p-7" data-reveal="up">
            <blockquote className="display-3">“{t.quote}”</blockquote>
            <p className="label mt-5">
              {t.name} · {t.place}
              {t.project && ` · ${t.project}`}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ── 4.6 estudio (mini) ─────────────────────────────────────── */
export function StudioTeaser() {
  return (
    <Section id="estudio" className="border-t border-line">
      <div className="grid md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-5 md:sticky md:top-28" data-reveal="left">
          <Parallax className="plate relative aspect-[4/3] shadow-[var(--shadow-soft)]" amount={8}>
            <Image src="/images/about/team-aerial.jpg" alt={copy.studio.photoAlt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </Parallax>
        </div>
        <div className="md:col-span-6 md:col-start-7" data-reveal="right">
          <h2 className="display-2">{copy.studio.title}</h2>
          {copy.studio.text.map((p, i) => (
            <p key={i} className="lead mt-5 measure">
              {p}
            </p>
          ))}
          <Link href={routes.studio} className="btn btn-outline mt-8">
            {copy.studio.cta} <ArrowRight />
          </Link>
        </div>
      </div>
    </Section>
  );
}

/* ── 4.7 FAQ ────────────────────────────────────────────────── */
export function Faq({ items = copy.faq.items, title = copy.faq.title }: { items?: readonly { q: string; a: string }[]; title?: string }) {
  return (
    <Section id="preguntas" className="border-t border-line">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4" data-reveal="left">
          <h2 className="display-2 md:sticky md:top-28">{title}</h2>
        </div>
        <div className="md:col-span-8 flex flex-col gap-3">
          {items.map((f) => (
            <details key={f.q} data-reveal="up" className="group card px-6 md:px-7 open:shadow-[var(--shadow-lift)] transition-shadow duration-300">
              <summary className="list-none cursor-pointer flex items-start justify-between gap-6 py-5 text-[1.1rem] md:text-[1.2rem] font-medium leading-snug hover:text-red [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="shrink-0 mt-0.5 h-8 w-8 rounded-full bg-stone-2 inline-flex items-center justify-center transition-transform duration-300 group-open:rotate-45">
                  <Plus width={18} height={18} />
                </span>
              </summary>
              <p className="pb-6 text-ink-2 measure">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ── 4.8 CTA final + formulario ─────────────────────────────── */
export function ContactCta({ title = copy.contactCta.closingTitle, lead = copy.contactCta.lead }: { title?: string; lead?: string }) {
  return (
    <Section id="contacto" className="border-t border-line">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5" data-reveal="left">
          <h2 className="display-1">{title}</h2>
          <p className="lead mt-5 measure">{lead}</p>
          <p className="label mt-10 mb-3">{copy.form.or}</p>
          <ul className="space-y-3">
            <li>
              <a href={site.phoneHref} className="inline-flex items-center gap-3 text-[1.1rem] hover:text-red">
                <Phone /> {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 text-[1.1rem] hover:text-red break-words">
                <Mail /> {site.email}
              </a>
            </li>
            <li className="inline-flex items-start gap-3 text-ink-2">
              <Pin className="shrink-0 mt-1" />
              <span>
                {site.address.street}, {site.address.postalCode} {site.address.city}
              </span>
            </li>
          </ul>
        </div>
        <div className="md:col-span-6 md:col-start-7" data-reveal="right">
          <div className="card p-6 md:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </Section>
  );
}
