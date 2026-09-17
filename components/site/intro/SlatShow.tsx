"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// Las fotos que pasan dentro de una franja de la apertura.
//
// La que entra se pone **encima** y sube de 0 a 1; la que sale se queda opaca debajo hasta
// que la nueva la ha tapado del todo. Por eso no hay ni un instante de negro: nunca se
// cruzan dos fotos a media opacidad sobre el fondo de la franja.
//
// Cada franja arranca con su propio retardo (`start`), así que no cambian todas a la vez.
const FADE = 700;

// La franja es una ventana estrecha y muy alta: `object-fit: cover` escala la foto hasta
// cubrir la altura, así que el navegador necesita una imagen mucho más ancha que la franja
// (en escritorio, ≈ alto de pantalla × 1,5 ≈ 1600 px). Con "17vw" pedía 245 px y se veían
// pixeladas; 1600 está en deviceSizes (next.config.ts) para no saltar a 1920.
// En móvil las franjas son apaisadas y con el ancho de pantalla basta.
const SIZES = "(min-width: 900px) 1600px, 100vw";

export function SlatShow({ photos, start = 0, every = 1600 }: { photos: string[]; start?: number; every?: number }) {
  const reducedMotion = useReducedMotion();
  const [{ active, leaving }, setState] = useState({ active: 0, leaving: -1 });

  useEffect(() => {
    if (reducedMotion || photos.length < 2) return;
    const advance = () => setState((current) => ({ active: (current.active + 1) % photos.length, leaving: current.active }));
    let repeat: ReturnType<typeof setInterval> | undefined;
    const first = setTimeout(() => {
      advance();
      repeat = setInterval(advance, every);
    }, start);
    return () => {
      clearTimeout(first);
      if (repeat) clearInterval(repeat);
    };
  }, [photos.length, start, every, reducedMotion]);

  return (
    <>
      {photos.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes={SIZES}
          className="slat-photo"
          style={{ opacity: i === active || i === leaving ? 1 : 0, zIndex: i === active ? 2 : 1, "--fade": `${FADE}ms` } as CSSProperties}
        />
      ))}
    </>
  );
}
