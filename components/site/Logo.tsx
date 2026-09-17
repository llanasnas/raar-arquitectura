import Image from "next/image";
import Link from "next/link";
import { site, routes } from "@/lib/site";

// PNG wordmark (2444×824, rendered from the client's vector by scripts/build-brand.mjs, served at 1600). v1 only.
export function Logo({ className = "", width = 112, invert = false }: { className?: string; width?: number; invert?: boolean }) {
  const height = Math.round(width * (824 / 2444));
  return (
    <Link href={routes.home} aria-label={`${site.name} — inicio`} className={`inline-flex items-center ${className}`}>
      <Image
        src={invert ? "/images/brand/logo-white.png" : "/images/brand/logo-black.png"}
        alt=""
        width={width}
        height={height}
        priority
        sizes={`${width}px`}
      />
    </Link>
  );
}
