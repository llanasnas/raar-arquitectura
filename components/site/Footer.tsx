import Link from "next/link";
import { Logo } from "./Logo";
import { nav, routes, site, whatsappUrl } from "@/lib/site";
import { copy } from "@/lib/copy";
import { Instagram, Mail, Phone, Pin, WhatsApp } from "@/components/ui/Icon";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 px-(--gutter) pb-6"><div className="mx-auto max-w-(--container)">
      <div className="card rounded-[var(--r-lg)] px-7 py-12 md:px-12 md:py-14 grid gap-10 md:grid-cols-[1.2fr_1.5fr_0.9fr_0.9fr]">
        <div className="max-w-sm">
          <Logo width={132} />
          <p className="mt-5 text-ink-2">{copy.footer.tagline}</p>
          <p className="mt-2 label normal-case tracking-normal">{site.areas.join(" · ")}</p>
        </div>

        <div>
          <h2 className="label mb-4">{copy.footer.contact}</h2>
          <ul className="space-y-2.5">
            <li>
              <a href={site.phoneHref} className="inline-flex items-center gap-2 hover:text-red">
                <Phone /> {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-red break-words">
                <Mail /> {site.email}
              </a>
            </li>
            <li className="inline-flex items-start gap-2 text-ink-2">
              <Pin className="shrink-0 mt-1" />
              <span>
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </span>
            </li>
          </ul>
          <a href={whatsappUrl(copy.whatsapp.message)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm mt-6">
            <WhatsApp /> {copy.whatsapp.cta}
          </a>
        </div>

        <div>
          <h2 className="label mb-4">{site.shortName}</h2>
          <ul className="space-y-2.5">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-red">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={routes.contact} className="hover:text-red">
                Contacto
              </Link>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-red">
                <Instagram /> Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="label mb-4">{copy.footer.legal}</h2>
          <ul className="space-y-2.5">
            <li>
              <Link href={routes.legal} className="hover:text-red">
                Aviso legal
              </Link>
            </li>
            <li>
              <Link href={routes.privacy} className="hover:text-red">
                Privacidad
              </Link>
            </li>
            <li>
              <Link href={routes.cookies} className="hover:text-red">
                Cookies
              </Link>
            </li>
          </ul>
          <div className="mt-6 inline-flex gap-1 rounded-full border border-line p-1" aria-label="Idioma">
            {copy.footer.langs.map((l) => (
              <span
                key={l.code}
                className={`code px-2.5 py-1 rounded-full ${l.active ? "bg-ink text-stone" : "text-ink-3"}`}
                aria-current={l.active ? "true" : undefined}
                title={l.active ? undefined : "Próximamente"}
              >
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="px-2 pt-5 flex flex-wrap justify-between gap-2 text-xs text-ink-3">
        <span>
          © {year} {site.name}. {copy.footer.rights}
        </span>
        <span>{site.address.city}</span>
      </div>
    </div></footer>
  );
}
