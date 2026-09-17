"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Dir = "up" | "left" | "right" | "scale";

const FROM: Record<Dir, gsap.TweenVars> = {
  up: { y: 44, autoAlpha: 0 },
  left: { x: -48, autoAlpha: 0 },
  right: { x: 48, autoAlpha: 0 },
  scale: { scale: 0.96, y: 24, autoAlpha: 0 },
};

// Entrance for everything below the hero. Marks: data-reveal="up|left|right|scale" on any
// descendant; without marks, the direct children animate. Once, exponential ease, no bounce.
export function Reveal({ children, className = "", stagger = 0.09 }: { children: ReactNode; className?: string; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const marked = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
        const items = marked.length ? marked : (Array.from(root.children) as HTMLElement[]);
        const byDir = new Map<Dir, HTMLElement[]>();
        for (const el of items) {
          const dir = ((el.dataset.reveal as Dir) || "up") in FROM ? ((el.dataset.reveal as Dir) || "up") : "up";
          gsap.set(el, FROM[dir]);
          byDir.set(dir, [...(byDir.get(dir) ?? []), el]);
        }
        for (const [dir, els] of byDir) {
          ScrollTrigger.batch(els, {
            start: "top 88%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                ...Object.fromEntries(Object.keys(FROM[dir]).map((k) => [k, k === "autoAlpha" ? 1 : k === "scale" ? 1 : 0])),
                duration: 1.15,
                ease: "expo.out",
                stagger,
                overwrite: true,
                clearProps: "transform",
              }),
          });
        }
      });
    },
    { scope: ref, dependencies: [stagger] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
