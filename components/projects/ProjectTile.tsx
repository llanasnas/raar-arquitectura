import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";
import { routes } from "@/lib/site";
import { Parallax } from "@/components/ui/Parallax";
import { ArrowRight } from "@/components/ui/Icon";

export type TileAspect = "4/5" | "3/4" | "4/3" | "1/1";

type Props = {
  project: Project;
  aspect?: TileAspect;
  image?: string; // a specific gallery render instead of the hero
  sizes?: string;
  priority?: boolean;
  className?: string;
  reveal?: "up" | "left" | "right" | "scale";
};

// Mosaic tile: the image alone, no tag. The name and place
// live in a glass note that rises on hover / focus; on touch screens, where there is no hover,
// the same text sits under the plate instead so the image stays uncovered.
export function ProjectTile({ project, aspect = "4/3", image, sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw", priority, className = "", reveal = "up" }: Props) {
  const fromGallery = image ? project.gallery.find((g) => g.src === image) : undefined;
  const media = fromGallery ?? project.hero ?? project.thumb;
  const where = project.typeLabel ? `${project.place} · ${project.typeLabel}` : project.place;

  return (
    <Link href={routes.project(project.id)} className={`tile group block ${className}`} aria-label={`${project.name}, ${project.place}`} data-reveal={reveal}>
      <div className="plate relative shadow-[var(--shadow-soft)] transition-shadow duration-500 group-hover:shadow-[var(--shadow-lift)]" style={{ aspectRatio: aspect.replace("/", " / ") }}>
        <Parallax className="absolute inset-0" amount={6}>
          <Image src={media.src} alt={media.alt} fill sizes={sizes} priority={priority} className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]" />
        </Parallax>
        <div className="tile-note glass absolute inset-x-3 bottom-3 rounded-(--r) p-5 pointer-events-none">
          <h3 className="title text-[1.25rem] xl:text-[1.35rem] text-balance">{project.name}</h3>
          <p className="mt-2.5 flex items-end justify-between gap-4">
            <span className="label">{where}</span>
            <ArrowRight className="shrink-0 tile-arrow" />
          </p>
        </div>
      </div>
      <div className="tile-caption mt-4 px-1">
        <h3 className="title text-[1.2rem]">{project.name}</h3>
        <p className="label mt-1.5">{where}</p>
      </div>
    </Link>
  );
}
