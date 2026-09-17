"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import manifest from "@/lib/hero-manifest.json";
import { copy } from "@/lib/copy";
import { routes } from "@/lib/site";
import { ArrowDown, ArrowUpRight } from "@/components/ui/Icon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Set = { dir: string; count: number; width: number; height: number; autoplayEnd: number };
type Frame = ImageBitmap | HTMLImageElement;

const PIN_DISTANCE = "+=350%"; // ≤ 3.5 screens: the one authored scroll moment on the site
const MAX_DPR = 1.5;

function frameUrl(set: Set, i: number) {
  return `${set.dir}/f_${String(i + 1).padStart(3, "0")}.webp`;
}

async function loadFrame(url: string): Promise<Frame> {
  const res = await fetch(url, { cache: "force-cache" });
  const blob = await res.blob();
  if (typeof createImageBitmap === "function") return createImageBitmap(blob);
  const img = document.createElement("img");
  img.src = URL.createObjectURL(blob);
  await img.decode();
  return img;
}

export function HeroScrollVideo() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(Frame | null)[]>([]);
  const setRef = useRef<Set | null>(null);
  const stateRef = useRef({ frame: 0 });
  const lastDrawn = useRef(-1);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(manifest.desktop.count);
  const [ready, setReady] = useState(false);
  const hasFrames = manifest.desktop.count > 0;

  // draw current frame with object-fit: cover
  const draw = useCallback((force = false) => {
    const canvas = canvasRef.current;
    const set = setRef.current;
    if (!canvas || !set) return;
    const i = Math.max(0, Math.min(set.count - 1, Math.round(stateRef.current.frame)));
    // walk back to the nearest loaded frame so scrubbing never blanks
    let j = i;
    while (j > 0 && !framesRef.current[j]) j--;
    const frame = framesRef.current[j];
    if (!frame || (!force && j === lastDrawn.current)) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const fw = "width" in frame ? frame.width : set.width;
    const fh = "height" in frame ? frame.height : set.height;
    const scale = Math.max(cw / fw, ch / fh);
    const dw = fw * scale;
    const dh = fh * scale;
    ctx.drawImage(frame, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    lastDrawn.current = j;
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const section = root.current;
    if (!canvas || !section) return;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.round(section.clientWidth * dpr);
    canvas.height = Math.round(section.clientHeight * dpr);
    draw(true);
  }, [draw]);

  useEffect(() => {
    if (!hasFrames) return;
    const ro = new ResizeObserver(resize);
    if (root.current) ro.observe(root.current);
    return () => ro.disconnect();
  }, [resize, hasFrames]);

  useGSAP(
    () => {
      if (!hasFrames || !root.current) return;
      const section = root.current;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { mobile, reduce } = ctx.conditions as Record<string, boolean>;
          const set: Set = mobile ? manifest.mobile : manifest.desktop;
          setRef.current = set;
          framesRef.current = new Array(set.count).fill(null);
          lastDrawn.current = -1;
          stateRef.current.frame = 0;
          setLoaded(0);
          setTotal(set.count);
          setReady(false);
          resize();

          let cancelled = false;
          const load = async (from: number, to: number, parallel: number) => {
            for (let i = from; i < to && !cancelled; i += parallel) {
              const batch = [];
              for (let k = i; k < Math.min(i + parallel, to); k++) {
                batch.push(
                  loadFrame(frameUrl(set, k)).then((f) => {
                    if (cancelled) return;
                    framesRef.current[k] = f;
                    setLoaded((n) => n + 1);
                    if (k === 0) {
                      draw(true);
                      setReady(true);
                    }
                  }),
                );
              }
              await Promise.all(batch);
            }
          };
          // priority: autoplay range, then the rest in the background
          load(0, set.autoplayEnd + 1, 6).then(() => load(set.autoplayEnd + 1, set.count, 4));

          const intro = q(".hero-intro");
          const beats = q(".hero-beat");

          if (reduce) {
            // static: first frame + intro copy; the beats are listed under the hero (see .hero-beats-static)
            gsap.set([...intro, ...q(".hero-hint")], { autoAlpha: 1 });
            gsap.set(beats, { autoAlpha: 0 });
            return;
          }

          // ── phase 1: intro (autoplay ~4s, no scroll needed)
          const introTl = gsap.timeline({ defaults: { ease: "expo.out" } });
          introTl
            .fromTo(q(".hero-line"), { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.1, stagger: 0.09 }, 0.35)
            .fromTo(q(".hero-sub"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.8)
            .fromTo(q(".hero-actions"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.95)
            .fromTo(q(".hero-hint"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 2.2);

          const autoplay = gsap.to(stateRef.current, {
            frame: set.autoplayEnd,
            duration: manifest.autoplaySeconds,
            ease: "none",
            delay: 0.2,
            onUpdate: () => draw(),
          });

          // ── phase 2: scroll scrub (one ScrollTrigger, one timeline, ease none for 1:1)
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: PIN_DISTANCE,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (self.progress > 0 && autoplay.isActive()) autoplay.kill();
              },
            },
          });

          tl.fromTo(
            stateRef.current,
            { frame: set.autoplayEnd },
            { frame: set.count - 1, ease: "none", duration: 1, immediateRender: false, onUpdate: () => draw() },
            0,
          );
          // intro copy leaves early
          tl.to([...intro, ...q(".hero-hint")], { autoAlpha: 0, y: -20, duration: 0.07, ease: "power2.in" }, 0.01);

          // beats: one at a time, never overlapping
          const n = beats.length;
          const span = 0.86 / n; // 0.10 → 0.96
          beats.forEach((el, i) => {
            const at = 0.1 + i * span;
            tl.fromTo(el, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.05, ease: "power2.out" }, at);
            if (i < n - 1) tl.to(el, { autoAlpha: 0, y: -12, duration: 0.03, ease: "power2.in" }, at + span - 0.03);
          });

          // fonts settle after first paint → recompute pin distances
          document.fonts?.ready.then(() => ScrollTrigger.refresh());

          return () => {
            cancelled = true;
            autoplay.kill();
          };
        },
      );
    },
    { scope: root, dependencies: [hasFrames] },
  );

  const skip = () => {
    const st = ScrollTrigger.getAll().find((t) => t.trigger === root.current);
    const top = st ? st.end + 1 : (root.current?.offsetHeight ?? 0);
    window.scrollTo({ top, behavior: "smooth" });
  };

  const progress = total ? Math.min(1, loaded / total) : 1;

  return (
    <>
    <section ref={root} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink text-white" aria-label="Recorrido por la casa IM10">
      {/* poster = LCP; canvas paints over it once frame 0 is decoded */}
      <Image
        src={manifest.poster}
        alt="Casa IM10 en Sarrià: fachada de tres plantas abierta al jardín y la piscina"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover md:block hidden"
      />
      <Image src={manifest.posterMobile} alt="" fill priority sizes="100vw" className="object-cover md:hidden" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
      />
      <div className="absolute inset-x-0 bottom-0 h-[70%] scrim-b pointer-events-none" />

      {/* frame-loading hairline (red pencil) */}
      {hasFrames && progress < 1 && (
        <div className="absolute left-0 top-(--nav-h) h-px bg-red/80 transition-[width] duration-300" style={{ width: `${progress * 100}%` }} aria-hidden="true" />
      )}

      {/* intro copy */}
      <div className="hero-intro absolute left-(--gutter) right-(--gutter) bottom-[max(10vh,72px)] md:bottom-[9vh] md:max-w-[54rem]">
        <h1 className="display-1 text-white" aria-label={copy.hero.h1}>
          {copy.hero.h1Lines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.06em]" aria-hidden="true">
              <span className="hero-line block">{line}</span>
            </span>
          ))}
        </h1>
        <p className="hero-sub lead mt-5 text-white/85 max-w-[38rem]">{copy.hero.sub}</p>
        <div className="hero-actions mt-7 flex flex-wrap gap-3">
          <Link href={routes.contact} className="btn btn-red">
            {copy.hero.ctaPrimary}
          </Link>
          <Link href={routes.projects} className="btn btn-glass">
            {copy.hero.ctaSecondary}
          </Link>
        </div>
      </div>

      {/* scroll hint */}
      <button
        type="button"
        onClick={skip}
        className="hero-hint absolute left-1/2 -translate-x-1/2 bottom-5 md:bottom-6 inline-flex items-center gap-2 label text-white/80 hover:text-white opacity-0"
        aria-label={copy.hero.skip}
      >
        <ArrowDown className="hero-hint-arrow" /> {copy.hero.scrollHint}
      </button>

      {/* beats over the video: frosted notes, the frame stays visible behind the text */}
      <div className="absolute left-(--gutter) right-(--gutter) bottom-[max(10vh,72px)] md:bottom-[9vh] max-w-[36rem] pointer-events-none">
        {copy.hero.beats.map((b, i) => (
          <div key={i} className="hero-beat absolute left-0 bottom-0 w-full opacity-0 pointer-events-auto">
            <div className="glass rounded-[var(--r-lg)] px-6 py-6 md:px-8 md:py-7">
              <p className="display-2">{b.text}</p>
              {b.code && <p className="label mt-4">{b.code}</p>}
            </div>
            {i === copy.hero.beats.length - 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={routes.contact} className="btn btn-red">
                  {copy.hero.ctaPrimary}
                </Link>
                <Link href={routes.project("im10")} className="btn btn-glass">
                  {copy.hero.projectLink} <ArrowUpRight />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

    </section>

    {/* reduced motion / no JS: the same five notes as a plain list */}
    <ol className="hero-beats-static hidden motion-reduce:grid px-(--gutter) py-10 gap-6 md:grid-cols-5 border-b border-line">
      {copy.hero.beats.map((b, i) => (
        <li key={i}>
          <p className="font-medium leading-snug">{b.text}</p>
          {b.code && <p className="label mt-2">{b.code}</p>}
        </li>
      ))}
    </ol>
    </>
  );
}
