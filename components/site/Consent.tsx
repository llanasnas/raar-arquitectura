"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { consentCopy } from "@/lib/copy";
import { routes } from "@/lib/site";
import { setConsent, useConsent } from "@/lib/consent";

// Aviso de cookies: una tarjeta pequeña encima de la barra del menú, a la izquierda, sin velo
// ni bloqueo. Dos botones con el mismo peso (aceptar y rechazar, como pide la AEPD) y el
// enlace a la política. Solo sale si no hay decisión guardada (ver lib/consent.ts) y, en la
// portada, no se ve mientras dura la apertura (`html[data-intro-lock]`, en globals.css).
export function Consent() {
  const consent = useConsent();
  const pathname = usePathname();
  // en la página de cookies ya están los ajustes: el aviso sobraría encima
  if (consent !== null || pathname === routes.cookies) return null;

  return (
    <aside className="consent" role="region" aria-label="Aviso de cookies">
      <p className="consent-text">{consentCopy.text}</p>
      <div className="consent-row">
        <button type="button" className="btn-2 consent-btn" onClick={() => setConsent(true)}>
          {consentCopy.accept}
        </button>
        <button type="button" className="btn-2 btn-2-ghost consent-btn" onClick={() => setConsent(false)}>
          {consentCopy.reject}
        </button>
        <Link href={routes.cookies} className="t-label link-line consent-more">
          {consentCopy.more}
        </Link>
      </div>
    </aside>
  );
}

// Ajustes en la página de cookies: qué hay decidido y cómo cambiarlo.
export function ConsentSettings() {
  const consent = useConsent();
  const t = consentCopy.settings;
  const state = consent === "granted" ? t.granted : consent === "denied" ? t.denied : t.none;

  return (
    <section className="consent-settings">
      <h2>{t.title}</h2>
      <p aria-live="polite">{state}</p>
      <div className="consent-row">
        {consent !== "granted" && (
          <button type="button" className="btn-2" onClick={() => setConsent(true)}>
            {t.enable}
          </button>
        )}
        {consent !== "denied" && (
          <button type="button" className="btn-2 btn-2-ghost" onClick={() => setConsent(false)}>
            {t.disable}
          </button>
        )}
      </div>
    </section>
  );
}
