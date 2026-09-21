"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { dropAnalytics, useConsent } from "@/lib/consent";

// Google Analytics 4, solo con consentimiento y solo si hay ID (`NEXT_PUBLIC_GA_ID` en
// .env.local; sin él, este componente no pinta nada y la web va sin analítica).
//
// - Se carga **después** de aceptar, no antes con el consentimiento en «denegado»: así no
//   entra ni un byte de Google hasta que el usuario dice que sí.
// - `send_page_view: false` y la vista de página se manda a mano al cambiar de ruta: con el
//   router de Next no hay recarga y GA no se enteraría de las navegaciones.
// - IP anonimizada (en GA4 ya lo es siempre; se deja explícito) y sin señales de publicidad.
// - Si el consentimiento se retira desde la página de cookies, se pone la bandera oficial
//   `ga-disable-<ID>` y se expiran las cookies `_ga*`.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const consent = useConsent();
  const pathname = usePathname();
  const on = Boolean(GA_ID) && consent === "granted";

  // vista de página en cada ruta (la primera la manda también esto, tras cargar gtag)
  useEffect(() => {
    if (!on || !window.gtag) return;
    window.gtag("event", "page_view", { page_path: pathname, page_location: location.href, page_title: document.title });
  }, [on, pathname]);

  // consentimiento retirado con gtag ya cargado: dejar de medir y limpiar
  useEffect(() => {
    if (GA_ID && consent === "denied" && window.gtag) dropAnalytics(GA_ID);
  }, [consent]);

  if (!on) return null;

  return (
    <>
      <Script id="ga-src" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script
        id="ga-init"
        strategy="afterInteractive"
        onReady={() => {
          window.gtag?.("event", "page_view", { page_path: pathname, page_location: location.href, page_title: document.title });
        }}
      >
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});gtag('config','${GA_ID}',{send_page_view:false,anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
    </>
  );
}
