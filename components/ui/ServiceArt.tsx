"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type ServiceArtId = "reforma-integral" | "obra-nueva" | "rehabilitacion";

// Line sketches for the three services, drawn once on scroll. Same stroke system as the icons
// (1.5, round caps, currentColor). What already exists is light (ink-3); what RAAR adds is ink,
// and it is drawn last. Under reduced motion everything is simply there.
// Every stroke has pathLength=100 so the dash trick needs no measuring: dashoffset 100 → 0 draws it
// (100, not 1: GSAP rounds px values to whole numbers, and 1 → 0 would snap instead of draw).
function D({ d, className }: { d: string; className?: string }) {
  return <path d={d} pathLength={100} data-draw vectorEffect="non-scaling-stroke" className={className} />;
}

const ART: Record<ServiceArtId, ReactNode> = {
  // Section of a flat: catalan vault, a partition that goes (dashed), a new window and the light it brings.
  "reforma-integral": (
    <>
      <g className="text-ink-3">
        <D d="M20 132H220" />
        <D d="M20 132V40" />
        <D d="M220 40v20M220 112v20" />
        <D d="M20 40c8-12 32-12 40 0c8-12 32-12 40 0c8-12 32-12 40 0c8-12 32-12 40 0c8-12 32-12 40 0" />
        <path d="M120 132V40" strokeDasharray="4 5" data-fade vectorEffect="non-scaling-stroke" />
      </g>
      <D d="M216 112V60h8v52" />
      <D d="M210 112h20" />
      <D d="M214 70L146 92" />
      <D d="M214 86L146 108" />
      <D d="M214 102L146 124" />
    </>
  ),
  // A single-storey house going up on a sloping site: footings, walls, roof slab, glass.
  "obra-nueva": (
    <>
      <g className="text-ink-3">
        <D d="M8 128C50 128 78 120 120 120H232" />
        <D d="M214 120V97" />
        <D d="M214 97a13 13 0 1 1 .1 0" />
      </g>
      <D d="M46 127v9h12v-9" />
      <D d="M178 120v9h12v-9" />
      <D d="M40 116H196" />
      <D d="M52 127V72" />
      <D d="M184 120V72" />
      <D d="M36 66h164v6H36z" />
      <D d="M96 72v44M140 72v44" className="text-ink-3" />
    </>
  ),
  // A sawtooth-roofed shed kept as it is; inside, a new mezzanine with its stair and rail.
  rehabilitacion: (
    <>
      <g className="text-ink-3">
        <D d="M20 132H220" />
        <D d="M20 132V70" />
        <D d="M220 132V70" />
        <D d="M20 70L62 42 70 70 112 42 120 70 162 42 170 70 212 42 220 70" />
      </g>
      <D d="M100 102H220M100 106H220M100 102v4" />
      <D d="M112 106v26M200 106v26" />
      <D d="M60 132h8v-6h8v-6h8v-6h8v-6h8v-6" />
      <D d="M104 102V88h116" />
      <D d="M132 88v14M160 88v14M188 88v14" />
    </>
  ),
};

export function ServiceArt({ id, className = "" }: { id: ServiceArtId; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const strokes = svg.querySelectorAll<SVGElement>("[data-draw]");
        const fades = svg.querySelectorAll<SVGElement>("[data-fade]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 85%", once: true } });
        tl.fromTo(strokes, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut", stagger: 0.13 });
        if (fades.length) tl.fromTo(fades, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: "expo.out" }, "<0.5");
      });
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 240 160"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`art block w-full h-auto ${className}`}
    >
      {ART[id]}
    </svg>
  );
}
