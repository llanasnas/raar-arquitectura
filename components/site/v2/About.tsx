import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/v2/Reveal";
import { copy, studioPage } from "@/lib/copy";
import { routes } from "@/lib/site";

// El estudio en la home: cuatro propuestas (A, B, C y D, esta última en AboutD.tsx) montadas
// una tras otra para que el cliente elija. Todas con el mismo material: el manifiesto de su
// web anterior (tres párrafos, `studioPage.manifesto`), la foto aérea de los tres socios y,
// como ilustración, renders de sus propias obras. Nada más: ni nombres, ni cifras.
//
// La foto del equipo es de 640 px: no se pone a sangre en ninguna propuesta.

const TEAM = { src: "/images/about/team-aerial.jpg", alt: copy.studio.photoAlt };

// Marcador temporal de cada propuesta. Se quita cuando el cliente elija.
export function AboutMark({ letter }: { letter: string }) {
  return (
    <div className="wrap about-mark">
      <span className="t-label">Estudio · propuesta {letter}</span>
    </div>
  );
}

function StudioLink() {
  return (
    <Link href={routes.studio} className="link-underline">
      {copy.studio.cta}
    </Link>
  );
}

// A · Pliego. La foto pegada al margen y el manifiesto entero en la otra columna, con el
// primer párrafo grande, como la apertura de un reportaje. La más «revista» de las cuatro.
export function AboutA() {
  const [opening, ...rest] = studioPage.manifesto;
  return (
    <section data-menu="dark" className="about-a wrap">
      <div className="about-a-media">
        <div className="about-a-sticky">
          <Reveal className="about-plate" variant="wipe">
            <Image src={TEAM.src} alt={TEAM.alt} fill sizes="(min-width: 900px) 38vw, 100vw" className="object-cover" />
          </Reveal>
          <span className="t-label about-cap">{studioPage.teamNote}</span>
        </div>
      </div>
      <div className="about-a-text">
        <Reveal className="t-label" variant="line">
          {studioPage.title}
        </Reveal>
        <Reveal as="h2" className="t-title about-title" delay={60}>
          {copy.studio.title}
        </Reveal>
        <Reveal as="p" className="about-lead" delay={120}>
          {opening}
        </Reveal>
        {rest.map((text, i) => (
          <Reveal key={i} as="p" className="t-body about-p" delay={180 + i * 60}>
            {text}
          </Reveal>
        ))}
        <Reveal delay={320}>
          <StudioLink />
        </Reveal>
      </div>
    </section>
  );
}

// B · Tres columnas. «Tres miradas» tomado al pie de la letra: cada párrafo del manifiesto es
// una columna con su rótulo y una lámina encima (el equipo, la materia, el plano). Se lee
// como una página de revista de tres columnas con regla.
const COLUMN_IMAGES = [
  TEAM,
  { src: "/images/projects/vi02/render-01-zona-social-1.jpg", alt: "" },
  // un plano con muros gruesos: el de la casa del Gironès es un emplazamiento y casi no se ve
  { src: "/images/projects/vi02/plan-01-planta-baja.jpg", alt: "" },
];

export function AboutB() {
  return (
    <section data-menu="dark" className="about-b wrap">
      <div className="about-b-head">
        <div>
          <Reveal className="t-label" variant="line">
            {studioPage.title}
          </Reveal>
          <Reveal as="h2" className="t-title about-title" delay={60}>
            {copy.studio.title}
          </Reveal>
        </div>
        <Reveal className="t-label about-b-note" delay={120}>
          {studioPage.teamNote}
        </Reveal>
      </div>
      <ol className="about-b-cols">
        {studioPage.manifesto.map((text, i) => (
          <li key={i} className="about-b-col">
            <Reveal className="t-label" variant="line" delay={i * 90}>
              {String(i + 1).padStart(2, "0")} · {studioPage.themes[i]}
            </Reveal>
            <Reveal className={`about-plate about-plate-wide${i === 2 ? " about-plate-plan" : ""}`} variant="wipe" delay={i * 90}>
              <Image
                src={COLUMN_IMAGES[i].src}
                alt={COLUMN_IMAGES[i].alt}
                fill
                sizes="(min-width: 900px) 30vw, 100vw"
                className={i === 2 ? "object-contain p-3" : "object-cover"}
              />
            </Reveal>
            <Reveal as="p" className="t-body about-p" delay={120 + i * 90}>
              {text}
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal className="about-b-foot" delay={200}>
        <StudioLink />
      </Reveal>
    </section>
  );
}

// C · La cita. Una frase del manifiesto en grande, las cuatro palabras del estudio como cinta
// y, debajo, la foto pequeña con el resto del texto a dos columnas. Es la apertura de una
// entrevista: primero lo que dicen, luego quiénes son.
const KEYWORDS = copy.hero.statement.filter((token) => "key" in token && token.key).map((token) => token.t);

export function AboutC() {
  const [opening, , closing] = studioPage.manifesto;
  return (
    <section data-menu="dark" className="about-c wrap">
      <Reveal className="t-label" variant="line">
        {studioPage.title}
      </Reveal>
      <Reveal as="blockquote" className="t-display about-c-quote" delay={60}>
        {studioPage.quote}
      </Reveal>
      <Reveal className="about-c-keys t-label" delay={140}>
        {KEYWORDS.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </Reveal>
      <div className="about-c-body">
        <div>
          <Reveal className="about-plate" variant="wipe">
            <Image src={TEAM.src} alt={TEAM.alt} fill sizes="(min-width: 900px) 28vw, 100vw" className="object-cover" />
          </Reveal>
          <span className="t-label about-cap">{studioPage.teamNote}</span>
        </div>
        <div>
          <Reveal as="h2" className="t-title about-title" variant="up">
            {copy.studio.title}
          </Reveal>
          <Reveal className="t-body cols-2 about-c-cols" delay={80}>
            <p>{opening}</p>
            <p>{closing}</p>
          </Reveal>
          <Reveal delay={160}>
            <StudioLink />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
