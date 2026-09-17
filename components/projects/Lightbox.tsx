"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Media } from "@/lib/content";
import { copy } from "@/lib/copy";
import { ArrowRight, Close } from "@/components/ui/Icon";

gsap.registerPlugin(useGSAP);

type Ctx = { open: (index: number) => void };
const LightboxCtx = createContext<Ctx | null>(null);

// Any image on a project page opens the same lightbox: hero, renders and plans in one sequence.
// Native <dialog> gives us the top layer, focus trap and Esc; we add arrows, swipe and a square v2 frame.
export function LightboxProvider({ items, label, children }: { items: Media[]; label: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const count = items.length;
  const t = copy.projects.lightbox;

  const open = useCallback((i: number) => {
    setIndex(i);
    const d = dialog.current;
    if (d && !d.open) d.showModal();
  }, []);
  const close = useCallback(() => dialog.current?.close(), []);
  const step = useCallback((dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + count) % count)), [count]);

  // lock page scroll while open (dialog does not do this on its own)
  useEffect(() => {
    if (index === null) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  useGSAP(
    () => {
      if (index === null || !stage.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(stage.current, { autoAlpha: 0, scale: 0.975 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out", overwrite: true });
      });
    },
    { dependencies: [index], scope: dialog },
  );

  // swipe on touch: horizontal drag over 40px flips the image
  const drag = useRef<number | null>(null);
  const swiped = useRef(false);
  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse") return;
    drag.current = e.clientX;
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    if (drag.current === null) return;
    const dx = e.clientX - drag.current;
    drag.current = null;
    if (Math.abs(dx) > 40) {
      swiped.current = true;
      step(dx < 0 ? 1 : -1);
    }
  };
  // a click anywhere that is not the image or a control closes, like tapping the backdrop
  const onClick = (e: ReactMouseEvent) => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    if (!(e.target as HTMLElement).closest("img, button")) close();
  };

  const current = index === null ? null : items[index];
  // neighbours stay mounted (invisible) so the next image is already decoded when the user moves
  const visible = index === null ? [] : count <= 3 ? items.map((_, i) => i) : [index, (index + 1) % count, (index - 1 + count) % count];

  return (
    <LightboxCtx.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={label}
        onClose={() => setIndex(null)}
        onClick={onClick}
      >
        {current && (
          <div className="flex h-full w-full flex-col text-white select-none">
            <div className="flex items-center justify-between gap-3 px-(--gutter) pt-4 md:pt-5">
              <span className="t-label lightbox-count">
                {(index ?? 0) + 1} <span className="opacity-60">{t.of}</span> {count}
              </span>
              <button type="button" onClick={close} className="lightbox-btn" aria-label={t.close} autoFocus>
                <Close />
              </button>
            </div>

            <div className="relative flex-1 min-h-0 px-(--gutter) py-4 md:py-6" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (drag.current = null)}>
              <div ref={stage} className="relative h-full w-full mx-auto max-w-[1600px] touch-pan-y">
                {visible.map((i) => (
                  <Image
                    key={items[i].src}
                    src={items[i].src}
                    alt={items[i].alt}
                    fill
                    sizes="100vw"
                    quality={85}
                    className={`object-contain ${i === index ? "" : "invisible"}`}
                    aria-hidden={i !== index}
                  />
                ))}
              </div>

              {count > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} className="lightbox-btn hidden md:inline-flex absolute left-(--gutter) top-1/2 -translate-y-1/2" aria-label={t.prev}>
                    <ArrowRight className="rotate-180" />
                  </button>
                  <button type="button" onClick={() => step(1)} className="lightbox-btn hidden md:inline-flex absolute right-(--gutter) top-1/2 -translate-y-1/2" aria-label={t.next}>
                    <ArrowRight />
                  </button>
                </>
              )}
            </div>

            {/* on phones the arrows sit under the image, beside the caption; swipe works too */}
            <div className="flex items-center justify-between gap-4 px-(--gutter) pb-5 md:pb-6 min-h-[3.5rem]">
              {count > 1 && (
                <button type="button" onClick={() => step(-1)} className="lightbox-btn md:hidden shrink-0" aria-label={t.prev}>
                  <ArrowRight className="rotate-180" />
                </button>
              )}
              <p className="t-label lightbox-cap" aria-live="polite">
                {current.label ?? current.alt}
              </p>
              {count > 1 && (
                <button type="button" onClick={() => step(1)} className="lightbox-btn md:hidden shrink-0" aria-label={t.next}>
                  <ArrowRight />
                </button>
              )}
            </div>
          </div>
        )}
      </dialog>
    </LightboxCtx.Provider>
  );
}

export function LightboxItem({ index, label, className = "", style, children }: { index: number; label?: string; className?: string; style?: CSSProperties; children: ReactNode }) {
  const ctx = useContext(LightboxCtx);
  const t = copy.projects.lightbox;
  return (
    <button type="button" onClick={() => ctx?.open(index)} className={`cursor-zoom-in ${className}`} style={style} aria-label={label ? `${label} · ${t.open}` : t.open}>
      {children}
    </button>
  );
}
