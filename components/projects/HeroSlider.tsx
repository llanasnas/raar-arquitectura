"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icon";
import { copy } from "@/lib/copy";
import type { Media } from "@/lib/content";

// La apertura de la ficha de obra como pase de tres fotos (guía del cliente, 21/09/2026): se
// avanza con un clic sobre la lámina, con las flechas o arrastrando hacia la derecha. Es una
// cinta con `scroll-snap`: el arrastre lo hace el navegador, así que en táctil va nativo y sin
// JS también se ve la primera foto entera. El JS solo mueve la cinta y lleva la cuenta.
//
// Las fotos se ven **enteras**: la caja toma la proporción de la primera (con tope de altura)
// y las demás se encajan dentro sin recortar. Con una caja a la medida de la pantalla cada
// render perdía un tercio por arriba y por abajo, y en móvil los lados.
//
// Va dentro del `.wrap`, con los mismos márgenes que el texto de debajo (cliente, 22/09): a
// sangre, la foto y el texto no empezaban ni acababan en la misma línea.
export function HeroSlider({ items, label, title }: { items: Media[]; label: string; title: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const n = items.length;

  const goTo = (next: number) => {
    const el = track.current;
    if (!el) return;
    const i = ((next % n) + n) % n;
    el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
  };

  // la cuenta sigue al scroll (también al arrastre), no al botón: así los puntos no mienten
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const t = copy.projects.lightbox;
  const first = items[0];
  const ratio = first?.width && first?.height ? `${first.width} / ${first.height}` : "3 / 2";

  return (
    <div className="pj-slider wrap" style={{ "--pj-ar": ratio } as CSSProperties}>
      <div className="pj-hero">
        <div ref={track} className="pj-hero-track" role="group" aria-roledescription="carrusel" aria-label={label}>
          {items.map((m, i) => (
            <div key={m.src} className="pj-hero-slide">
              <Image src={m.src} alt={m.alt} fill priority={i === 0} sizes="100vw" className="object-contain" />
              {n > 1 && (
                // la lámina entera avanza al clic: es el gesto que pidió el cliente
                <button type="button" className="pj-hero-hit" aria-label={t.next} onClick={() => goTo(i + 1)} />
              )}
            </div>
          ))}
        </div>

        <h1 className="pj-hero-title">{title}</h1>

        {n > 1 && (
          <>
            <button type="button" className="pj-hero-arrow" data-dir="prev" aria-label={t.prev} onClick={() => goTo(index - 1)}>
              <ArrowLeft />
            </button>
            <button type="button" className="pj-hero-arrow" data-dir="next" aria-label={t.next} onClick={() => goTo(index + 1)}>
              <ArrowRight />
            </button>
          </>
        )}
      </div>

      {/* puntos y cuenta debajo, en tinta sobre papel: encima de la foto no se leían */}
      {n > 1 && (
        <div className="pj-hero-bar">
          <div className="pj-hero-dots" aria-hidden="true">
            {items.map((m, i) => (
              <button key={m.src} type="button" tabIndex={-1} className="pj-hero-dot" data-on={i === index || undefined} onClick={() => goTo(i)} />
            ))}
          </div>
          <span className="t-label pj-hero-count" aria-live="polite">
            {index + 1} {t.of} {n}
          </span>
        </div>
      )}
    </div>
  );
}
