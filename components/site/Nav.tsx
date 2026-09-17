"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { nav, routes, site } from "@/lib/site";
import { copy } from "@/lib/copy";
import { Close, Menu, Phone } from "@/components/ui/Icon";

// Floating glass bubbles: logo, links, action. They read on the hero video and on the stone alike.
export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-(--nav-h) pointer-events-none">
      <div className="h-full flex items-center justify-between px-(--gutter) gap-3 mx-auto max-w-(--container)">
        <div className="glass bubble pointer-events-auto flex items-center h-11 md:h-12 px-3.5 md:px-4">
          <Logo width={84} />
        </div>

        <nav aria-label="Principal" className="glass bubble pointer-events-auto hidden md:flex items-center h-12 gap-0.5 px-1.5">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`px-4 h-9 inline-flex items-center rounded-full text-[0.95rem] font-medium transition-colors duration-200 ${
                isActive(item.href) ? "bg-ink text-stone" : "hover:bg-white/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pointer-events-auto flex items-center gap-2">
          <Link href={routes.contact} className="btn btn-red min-h-11 px-4 text-[0.92rem] md:min-h-12 md:px-6 md:text-[0.98rem]">
            {copy.nav.cta}
          </Link>
          <button
            type="button"
            className="glass bubble md:hidden h-11 w-11 shrink-0 inline-flex items-center justify-center"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? copy.nav.close : copy.nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div id="menu-movil" hidden={!open} className="pointer-events-auto md:hidden fixed inset-0 top-(--nav-h) px-(--gutter) pb-6">
        <nav aria-label="Principal móvil" className="glass rounded-[var(--r-lg)] p-4 flex flex-col mt-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`display-3 px-4 py-4 rounded-2xl flex items-baseline justify-between ${isActive(item.href) ? "bg-ink text-stone" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <Link href={routes.contact} className="btn btn-red mt-4">
            {copy.nav.ctaLong}
          </Link>
          <a href={site.phoneHref} className="btn btn-outline mt-2">
            <Phone /> {site.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
