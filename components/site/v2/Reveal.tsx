"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

// Entradas al hacer scroll. Un solo IntersectionObserver para toda la página: con uno por
// elemento, una home de revista con cincuenta láminas se vuelve pesada al scrollear.
//
// El estado final es el de reposo (sin transform), así que si el JS no llega la página se ve
// entera igual: `.rv` solo existe mientras el observador no ha dicho nada, y con
// prefers-reduced-motion el CSS lo neutraliza.
let observer: IntersectionObserver | null = null;

function watch(el: HTMLElement) {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          observer?.unobserve(entry.target);
        }
      },
      // un poco antes de que asome del todo: la lámina no debe entrar «tarde»
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
  }
  observer.observe(el);
  return () => observer?.unobserve(el);
}

export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay,
  className = "",
  style,
  children,
}: {
  as?: ElementType;
  variant?: "up" | "wipe" | "scale" | "line";
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return watch(el);
  }, []);

  return (
    <Tag
      ref={ref}
      className={`rv ${className}`}
      data-rv={variant}
      style={delay ? ({ "--rv-delay": `${delay}ms`, ...style } as CSSProperties) : style}
    >
      {children}
    </Tag>
  );
}
