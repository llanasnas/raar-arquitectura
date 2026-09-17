import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// Section = one idea. Everything inside enters with a slide (mark items with data-reveal),
// unless reveal={false}.
export function Section({ id, children, className = "", bleed = false, reveal = true }: { id?: string; tab?: string; children: ReactNode; className?: string; bleed?: boolean; reveal?: boolean }) {
  const inner = <div className={bleed ? "" : "px-(--gutter) mx-auto max-w-(--container)"}>{children}</div>;
  return (
    <section id={id} className={`relative py-16 md:py-24 ${className}`}>
      {reveal ? <Reveal>{inner}</Reveal> : inner}
    </section>
  );
}

export function SectionHeading({ title, lead, as: Tag = "h2" }: { title: string; lead?: string; as?: "h1" | "h2" }) {
  return (
    <header className="max-w-208 mb-10 md:mb-14">
      <Tag className={Tag === "h1" ? "display-1" : "display-2"} data-reveal="up">
        {title}
      </Tag>
      {lead && (
        <p className="lead mt-5 measure" data-reveal="up">
          {lead}
        </p>
      )}
    </header>
  );
}
