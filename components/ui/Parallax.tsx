"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Depth on a plate: the inner image is scaled slightly and drifts against the scroll,
// so a photo behaves like a window rather than a sticker. Off under reduced motion.
export function Parallax({ children, amount = 10, className = "" }: { children: ReactNode; amount?: number; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          inner.current,
          { yPercent: -amount / 2, scale: 1 + amount / 100 },
          {
            yPercent: amount / 2,
            scale: 1 + amount / 100,
            ease: "none",
            scrollTrigger: { trigger: outer.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: outer, dependencies: [amount] },
  );

  // caller owns positioning + size of the outer box (e.g. "absolute inset-0" or "relative aspect-[4/3]")
  return (
    <div ref={outer} className={`overflow-hidden ${className}`}>
      <div ref={inner} className="absolute inset-0 will-change-transform">
        {children}
      </div>
    </div>
  );
}
