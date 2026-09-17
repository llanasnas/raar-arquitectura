"use client";

import { useSyncExternalStore } from "react";

// Cuándo se ve la apertura de la portada. Regla del cliente (17/09/2026):
//
// - Al cargar la web por primera vez en la sesión, y **siempre** que se recargue (F5).
// - **Nunca** al volver con «atrás» ni al entrar a la portada desde el menú: ya se ha visto.
//
// Con carga completa lo decide el script en línea de `components/site/intro/Intro.tsx`
// antes de pintar nada, y lo deja escrito en `<html data-intro="play|skip">`: así el HTML
// servido (que siempre lleva la apertura puesta) se neutraliza por CSS sin un solo fotograma
// de más. Con navegación de cliente (atrás, menú) no hay script: se decide aquí con la misma
// regla. La decisión vale para una visita a la portada: `resetIntro` la borra al salir.
export const INTRO_KEY = "raar:intro";

type Decision = "play" | "skip";
let decision: Decision | null = null;
const listeners = new Set<() => void>();

export function navigationType(): string {
  const entry = performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined;
  return entry?.type ?? "navigate";
}

export function introSeen(): boolean {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    // sin sessionStorage (modo privado antiguo) la apertura se verá cada vez; no pasa nada
  }
}

// Ojo: la regla de la recarga solo la aplica el script en línea, que solo corre con carga
// completa de la portada. Aquí no se mira `navigationType()`: el tipo de navegación es del
// documento entero, así que tras un F5 seguiría diciendo «reload» al volver con «atrás».
function decide(): Decision {
  if (decision) return decision;
  const fromScript = document.documentElement.getAttribute("data-intro");
  if (fromScript === "play" || fromScript === "skip") return (decision = fromScript);
  return (decision = introSeen() ? "skip" : "play");
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// `enabled` = este elemento participa en la apertura (el logotipo solo en la portada). Con
// `false` no se decide nada: si no, el logotipo de /proyectos daría la apertura por vista.
// En servidor siempre «se ve»: el HTML lleva la apertura y el script en línea la apaga si toca.
export function useIntroPlays(enabled = true): boolean {
  return useSyncExternalStore(
    subscribe,
    () => enabled && decide() === "play",
    () => enabled,
  );
}

// Al salir de la portada: la próxima visita vuelve a decidir (y ya la habrá visto).
export function resetIntro() {
  decision = null;
  document.documentElement.removeAttribute("data-intro");
  document.documentElement.removeAttribute("data-intro-lock");
  listeners.forEach((listener) => listener());
}
