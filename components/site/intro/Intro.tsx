"use client";

import { useEffect } from "react";
import { SlatsIntro } from "@/components/site/intro/SlatsIntro";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { INTRO_KEY, keepIntro, markIntroSeen, navigationType, resetIntro, useIntroPlays } from "@/lib/intro";

// La apertura, con sus reglas de cuándo se ve (lib/intro.ts) y lo que pasa mientras dura:
//
// - **No se puede hacer scroll** hasta que el logotipo aterriza (`data-intro-lock` en <html>).
// - **Con F5 la página vuelve arriba**: el navegador recuerda dónde estabas y, si no, la
//   apertura se abriría a media página. Se apaga la restauración de scroll solo para esa
//   recarga y se vuelve a encender en cuanto ha cargado, porque el router de Next se apoya en
//   ella para que «atrás» te deje donde estabas.
//
// El script en línea va **antes** del telón en el HTML servido y decide sin esperar a React:
// misma regla que `decide()` en lib/intro.ts (recarga o primera vez de la sesión → se ve).
// Chrome devuelve el scroll de antes de la recarga **antes de ejecutar ningún script** (a los
// 9 ms ya estaba a 2000 px), así que no basta con apagar la restauración: hay que subir a
// mano, y en seco: `html` lleva `scroll-behavior: smooth` y un scrollTo normal se ve viajar.
const SCRIPT = `(function(){var h=document.documentElement,n=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0],t=n?n.type:"navigate",s=false;try{s=sessionStorage.getItem("${INTRO_KEY}")==="1"}catch(e){}if(t==="reload"||!s){h.setAttribute("data-intro","play");h.setAttribute("data-intro-lock","");if(t==="reload"){history.scrollRestoration="manual";window.scrollTo({top:0,behavior:"instant"})}try{sessionStorage.setItem("${INTRO_KEY}","1")}catch(e){}}else{h.setAttribute("data-intro","skip")}})();`;

export function Intro() {
  const plays = useIntroPlays();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!plays) return;
    const html = document.documentElement;
    markIntroSeen();

    // sin movimiento no hay telón que esperar: nada que bloquear
    if (reducedMotion) {
      html.removeAttribute("data-intro-lock");
      return;
    }
    html.setAttribute("data-intro-lock", "");

    // Tras un F5 la página empieza arriba, y la restauración de scroll se vuelve a encender
    // solo cuando la apertura ha terminado: si se enciende en `load`, Chrome aprovecha ese
    // instante para devolver el scroll a donde estaba (se vio a 203 px).
    const reloaded = navigationType() === "reload" && html.getAttribute("data-intro") === "play";
    if (reloaded) {
      // el script ya lo hizo; se repite por si un desmontaje intermedio (StrictMode) lo deshizo
      history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // `intro-logo-land` es lo último que termina: cuando el logotipo aterriza, se suelta
    const unlock = () => {
      html.removeAttribute("data-intro-lock");
      if (reloaded) {
        window.scrollTo({ top: 0, behavior: "instant" });
        history.scrollRestoration = "auto";
      }
    };
    const onEnd = (event: AnimationEvent) => {
      if (event.animationName.includes("intro-logo-land")) unlock();
    };
    document.addEventListener("animationend", onEnd, true);
    // por si la animación no llega a avisar (pestaña en segundo plano, etc.)
    const timer = setTimeout(unlock, 12000);
    return () => {
      document.removeEventListener("animationend", onEnd, true);
      clearTimeout(timer);
      // al salir a media apertura: soltar sin mover el scroll (Next lo coloca él)
      html.removeAttribute("data-intro-lock");
      if (reloaded) history.scrollRestoration = "auto";
    };
  }, [plays, reducedMotion]);

  // al salir de la portada, la próxima visita vuelve a decidir (y al volver a montar en el
  // mismo tick, como hace StrictMode, no se borra nada)
  useEffect(() => {
    keepIntro();
    return resetIntro;
  }, []);

  if (!plays) return null;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      <SlatsIntro />
    </>
  );
}
