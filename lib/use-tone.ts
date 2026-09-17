"use client";

import { useEffect, useState, type RefObject } from "react";

export type Tone = "light" | "dark";

// Los elementos fijos (menú, logotipo) no tienen fondo propio, así que miran qué hay
// justo debajo de ellos: la sección más cercana con data-menu="light|dark" manda.
// "light" significa letra clara, es decir, medio oscuro debajo.
//
// Se muestrea con elementsFromPoint en vez de observar secciones porque resuelve solo
// los solapamientos y el orden de pintado. Los overlays de apertura llevan
// pointer-events: none, así que no cuentan.
export function useTone(ref: RefObject<HTMLElement | null>, enabled = true): Tone {
  const [tone, setTone] = useState<Tone>("dark");

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const x = Math.min(Math.max(box.left + box.width / 2, 1), window.innerWidth - 1);
      const y = Math.min(Math.max(box.top + box.height / 2, 1), window.innerHeight - 1);
      const under = document
        .elementsFromPoint(x, y)
        .find((node) => node !== el && !el.contains(node) && node instanceof HTMLElement && node.dataset.menu);
      setTone((under as HTMLElement | undefined)?.dataset.menu === "light" ? "light" : "dark");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // La apertura mueve cosas sin que nadie haga scroll: mientras el vídeo ocupa toda la
    // pantalla, debajo del menú hay medio oscuro, y cuando se recoge ya hay papel. Sin esto
    // el menú se quedaba con la lectura del primer instante.
    document.addEventListener("animationend", schedule, true);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("animationend", schedule, true);
    };
  }, [ref, enabled]);

  return tone;
}
