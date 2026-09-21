"use client";

import { useSyncExternalStore } from "react";

// Consentimiento de cookies. Solo hay una categoría que pedir: la analítica (Google
// Analytics 4, ver components/site/Analytics.tsx). Las cookies técnicas no necesitan
// consentimiento y no hay publicidad.
//
// La decisión se guarda en localStorage (no es una cookie: no viaja al servidor) con la
// versión de la política: si un día cambia lo que se pide, se sube `VERSION` y se vuelve a
// preguntar. Sin decisión guardada, el aviso se enseña; con «rechazado», la analítica no se
// carga y se borran las cookies de Google que pudiera haber.
export const CONSENT_KEY = "raar:consent";
const VERSION = 1;

export type Consent = "granted" | "denied" | null;

type Stored = { v: number; analytics: boolean; at: string };

let cached: Consent | undefined;
const listeners = new Set<() => void>();

function read(): Consent {
  if (cached !== undefined) return cached;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return (cached = null);
    const stored = JSON.parse(raw) as Stored;
    if (stored.v !== VERSION) return (cached = null);
    return (cached = stored.analytics ? "granted" : "denied");
  } catch {
    return (cached = null);
  }
}

export function setConsent(analytics: boolean) {
  cached = analytics ? "granted" : "denied";
  try {
    const stored: Stored = { v: VERSION, analytics, at: new Date().toISOString() };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(stored));
  } catch {
    // sin localStorage, la decisión vale para esta página; se volverá a preguntar
  }
  listeners.forEach((listener) => listener());
}

// Volver a preguntar (desde la página de cookies): se borra la decisión y sale el aviso.
export function resetConsent() {
  cached = null;
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    // nada que borrar
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// En servidor no hay decisión (null): el aviso no se pinta hasta hidratar, y así el HTML
// servido es el mismo para todo el mundo.
export function useConsent(): Consent {
  return useSyncExternalStore(subscribe, read, () => null);
}

// Con el consentimiento retirado, Google Analytics deja de medir (bandera oficial) y se
// expiran sus cookies `_ga*` en el host y en el dominio raíz, que es donde las pone.
export function dropAnalytics(gaId: string) {
  (window as unknown as Record<string, boolean>)[`ga-disable-${gaId}`] = true;
  const host = location.hostname;
  const root = host.split(".").slice(-2).join(".");
  for (const name of document.cookie.split(";").map((c) => c.trim().split("=")[0])) {
    if (!name.startsWith("_ga")) continue;
    for (const domain of [host, `.${host}`, `.${root}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    }
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}
