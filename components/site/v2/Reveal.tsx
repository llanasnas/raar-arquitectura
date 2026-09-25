"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from "react";

// Entradas al hacer scroll. Un solo IntersectionObserver para toda la página: con uno por
// elemento, una home de revista con cincuenta láminas se vuelve pesada al scrollear.
//
// El estado final es el de reposo (sin transform), así que si el JS no llega la página se ve
// entera igual: `.rv` solo existe mientras el observador no ha dicho nada, y con
// prefers-reduced-motion el CSS lo neutraliza.
let observer: IntersectionObserver | null = null;
let ahead: IntersectionObserver | null = null;

// Las fotos van con loading="lazy" y el navegador no las pide hasta tenerlas casi encima: con
// scroll rápido llegaban 1,5 s tarde y la cortina se abría sobre una caja vacía. Este segundo
// observador mira pantalla y media por delante y las pasa a «eager» para que se pidan ya.
function prefetch(el: HTMLElement) {
  if (!ahead) {
    ahead = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => {
            img.loading = "eager";
          });
          ahead?.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px 150% 0px" },
    );
  }
  ahead.observe(el);
  return () => ahead?.unobserve(el);
}

// La cortina (wipe) no se abre hasta que su foto está descodificada: si no, se anima un hueco
// y la foto aparece de golpe al final. Con un tope, para no dejar nunca una lámina sin entrar.
const IMAGE_WAIT_MS = 2500;

function ready(img: HTMLImageElement | null): Promise<void> {
  if (!img || (img.complete && img.naturalWidth > 0)) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer);
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
      // decode() evita el último frame en blanco mientras el navegador pinta la foto
      img.decode().catch(() => {}).finally(resolve);
    };
    const timer = setTimeout(done, IMAGE_WAIT_MS);
    img.addEventListener("load", done);
    img.addEventListener("error", done);
  });
}

function watch(el: HTMLElement) {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          observer?.unobserve(target);
          const wait = target.dataset.rv === "wipe" ? ready(target.querySelector("img")) : Promise.resolve();
          wait.then(() => target.setAttribute("data-in", ""));
        }
      },
      // un poco antes de que asome del todo: la lámina no debe entrar «tarde»
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
  }
  observer.observe(el);
  const stopAhead = el.querySelector("img") ? prefetch(el) : null;
  return () => {
    observer?.unobserve(el);
    stopAhead?.();
  };
}

// `none` no anima nada: solo marca `data-in` al entrar, para que lo que hay dentro se dibuje
// solo (el diagrama de obra usa eso para completar sus trazos).
export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay,
  className = "",
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  variant?: "up" | "wipe" | "scale" | "line" | "none";
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "style" | "children">) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return watch(el);
  }, []);

  return (
    <Tag
      ref={ref}
      {...rest}
      className={`rv ${className}`}
      data-rv={variant}
      style={delay ? ({ "--rv-delay": `${delay}ms`, ...style } as CSSProperties) : style}
    >
      {children}
    </Tag>
  );
}
