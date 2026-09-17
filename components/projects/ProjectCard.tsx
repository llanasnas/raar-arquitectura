import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";
import { routes } from "@/lib/site";
import { copy } from "@/lib/copy";
import { Parallax } from "@/components/ui/Parallax";
import { ArrowRight } from "@/components/ui/Icon";

type Props = {
  project: Project;
  aspect?: "4/3" | "4/5" | "21/9" | "1/1"; // omitted: the image's own proportion, nothing cropped
  sizes?: string;
  priority?: boolean;
  className?: string;
  image?: "hero" | "thumb";
  parallax?: boolean;
  reveal?: "up" | "left" | "right" | "scale";
};

// A rounded window onto the project: image with depth, project code as a glass tag. Name and place
// sit under the plate; where hover exists they rise over the image in a glass note instead (.tile-*, as on the home mosaic).
export function ProjectCard({ project, aspect, sizes = "(min-width: 768px) 50vw, 100vw", priority, className = "", image = "hero", parallax = true, reveal = "up" }: Props) {
  const media = image === "hero" && project.hero ? project.hero : project.thumb;
  const processing = project.status === "processing";
  // "En proceso" plates carry that label as place and type already; say it once.
  const where = project.typeLabel && project.typeLabel !== project.place ? `${project.place} · ${project.typeLabel}` : project.place;
  const showStatus = processing && !where.includes(copy.projects.processing);
  const ratio = aspect ? aspect.replace("/", " / ") : media.width && media.height ? `${media.width} / ${media.height}` : "4 / 3";
  const img = (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] ${processing ? "grayscale" : "group-hover:scale-[1.03]"}`}
    />
  );

  const inner = (
    <>
      <div className="plate relative shadow-[var(--shadow-soft)] transition-shadow duration-500 group-hover:shadow-[var(--shadow-lift)]" style={{ aspectRatio: ratio }}>
        {parallax && !processing ? <Parallax className="absolute inset-0">{img}</Parallax> : img}
        <span className="absolute left-4 top-4 glass bubble code px-3 py-1.5 pointer-events-none">{project.codeDisplay}</span>
        <div className="tile-note glass absolute inset-x-3 bottom-3 rounded-(--r) p-5 pointer-events-none">
          <h3 className="title text-[1.25rem] xl:text-[1.35rem] text-balance">{project.name}</h3>
          <p className="mt-2.5 flex items-end justify-between gap-4">
            <span className="label">{where}</span>
            {showStatus && <span className="label whitespace-nowrap">{copy.projects.processing}</span>}
            {!processing && <ArrowRight className="shrink-0 tile-arrow" />}
          </p>
        </div>
      </div>
      <div className="tile-caption mt-5 px-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="title text-[1.3rem] md:text-[1.45rem]">{project.name}</h3>
            <p className="label mt-2">{where}</p>
          </div>
          {showStatus && <span className="label whitespace-nowrap mt-1">{copy.projects.processing}</span>}
        </div>
      </div>
    </>
  );

  if (processing)
    return (
      <article className={`tile group block ${className}`} data-reveal={reveal}>
        {inner}
      </article>
    );
  return (
    <Link href={routes.project(project.id)} className={`tile group block ${className}`} aria-label={`${project.name}, ${project.place}`} data-reveal={reveal}>
      {inner}
    </Link>
  );
}
