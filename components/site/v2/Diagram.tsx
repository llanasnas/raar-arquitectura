"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Reveal } from "@/components/site/v2/Reveal";
import type { DiagramGroup, DiagramItem } from "@/lib/diagram";
import { copy } from "@/lib/copy";
import { routes, site } from "@/lib/site";

// El diagrama de obra: la versión circular del sumario, dibujada a partir del boceto del
// cliente (17/09/2026). Cada arco negro es una tipología, los códigos del perímetro son los
// proyectos y una línea lleva de cada código a su arco. Al pasar por encima de un código se
// pone en negrita, la columna de la izquierda enseña la obra (título y foto) y el clic lleva a
// la ficha. En el centro está el isotipo, que lleva al estudio.
//
// Todo es SVG en línea: los arcos y las líneas se dibujan al entrar en pantalla (trazo que se
// completa, ver .dg-arc en globals.css) y las etiquetas son enlaces de verdad, rastreables.
//
// En táctil no hay «pasar por encima»: el primer toque selecciona y el segundo lleva.
// En móvil no caben trece códigos alrededor de un círculo de 350 px: allí el dibujo va sin
// etiquetas y debajo sale la lista de tipologías con sus obras.

// Geometría, en unidades del viewBox (-550 … 550). Tres anillos y el isotipo en el centro.
const RINGS = [288, 238, 188] as const;
const R_INNER = 124;
const R_LINE = 324;
const R_LABEL = 340;
const ARC_W = 22;
const GAP = 7; // grados entre tipologías
const UNIT = 22; // grados por proyecto
const MIN_SPAN = 44; // un arco de un solo proyecto no puede ser una miga

const RAD = Math.PI / 180;
const pt = (r: number, a: number) => [r * Math.cos(a * RAD), r * Math.sin(a * RAD)] as const;
const f = (n: number) => n.toFixed(1);

function arcPath(r: number, a0: number, a1: number) {
  const [x0, y0] = pt(r, a0);
  const [x1, y1] = pt(r, a1);
  return `M ${f(x0)} ${f(y0)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)}`;
}

// La línea parte del arco y sale hacia el código: así el dibujo también «sale» del arco.
function linePath(r: number, a: number) {
  const [x0, y0] = pt(r + ARC_W / 2 + 3, a);
  const [x1, y1] = pt(R_LINE, a);
  return `M ${f(x0)} ${f(y0)} L ${f(x1)} ${f(y1)}`;
}

// El código se lee a lo largo del radio. En la mitad izquierda se da la vuelta para que no
// quede boca abajo, como en cualquier diagrama circular.
const isLeft = (a: number) => {
  const n = ((a % 360) + 360) % 360;
  return n > 90 && n < 270;
};
function labelTransform(a: number) {
  return isLeft(a) ? `rotate(${f(a + 180)}) translate(${-R_LABEL} 0)` : `rotate(${f(a)}) translate(${R_LABEL} 0)`;
}

type Placed = DiagramGroup & { a0: number; a1: number; r: number; angles: number[] };

// Reparto angular: cada tipología ocupa lo que le corresponde por número de obras, con un
// mínimo para las de una sola, y todo se escala para cerrar los 360°. Arranca arriba.
function layout(groups: DiagramGroup[]): Placed[] {
  const raw = groups.map((g) => Math.max(MIN_SPAN, g.items.length * UNIT));
  const k = (360 - GAP * groups.length) / raw.reduce((s, v) => s + v, 0);
  let a = -90;
  return groups.map((group, i) => {
    const span = raw[i] * k;
    const a0 = a;
    const a1 = a + span;
    a = a1 + GAP;
    return {
      ...group,
      a0,
      a1,
      r: RINGS[group.ring],
      angles: group.items.map((_, j) => a0 + (span * (j + 0.5)) / group.items.length),
    };
  });
}

// El isotipo del cliente (public/images/brand/isotype.svg), en línea para que tome el color
// del texto. Sus coordenadas originales van de 1281,7 a 5805 en x y de 177,3 a 2658,1 en y.
const ISO_D =
  "m5576.1 1102.28h-381.31l-285.78-800.83-285.77 800.83h-377.78-192.7l330.06-924.92-1681.89-0.07 330.09 924.99h-385.08-185.4l-285.77-800.83-285.78 800.83h-377.78l-229.55 630.79h382.23l-330.05 924.93 1681.88 0.06-330.08-924.99h385.07 185.4l285.78 800.83 285.78-800.83h377.77 192.7l-330.06 924.93 1681.89 0.06-330.09-924.99h385.08z";
const ISO_W = 4523.3;
const ISO_H = 2480.8;
const ISO_SCALE = 132 / ISO_W;
const ISO_TRANSFORM = `translate(${f(-66)} ${f((-ISO_H * ISO_SCALE) / 2)}) scale(${ISO_SCALE.toFixed(5)}) translate(-1281.7 -177.3)`;

type Active = { kind: "item" | "group"; id: string } | null;

export function Diagram({ groups }: { groups: DiagramGroup[] }) {
  const router = useRouter();
  const [active, setActive] = useState<Active>(null);
  const touch = useRef(false);
  const placed = layout(groups);

  const activeGroup =
    active?.kind === "group" ? active.id : active ? placed.find((g) => g.items.some((it) => it.id === active.id))?.id : undefined;
  const activeItem: DiagramItem | undefined = active?.kind === "item" ? placed.flatMap((g) => g.items).find((it) => it.id === active.id) : undefined;

  const hover = (next: Active) => (event: ReactPointerEvent) => {
    if (event.pointerType !== "touch") setActive(next);
  };
  // Un enlace del dibujo: con ratón lleva; en táctil el primer toque solo selecciona, el
  // segundo lleva. Sin href (obra sin ficha) el toque solo selecciona.
  const go = (next: Exclude<Active, null>, href: string | null) => (event: ReactMouseEvent) => {
    event.preventDefault();
    if (!href) return setActive(next);
    if (touch.current && (active?.kind !== next.kind || active.id !== next.id)) return setActive(next);
    router.push(href);
  };
  const numberOf = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section data-menu="dark" className="wrap">
      <Reveal
        className="dg"
        variant="none"
        data-dim={active ? "" : undefined}
        data-item={activeItem ? "" : undefined}
        onPointerDown={(event) => {
          touch.current = event.pointerType === "touch";
        }}
        onPointerLeave={hover(null)}
      >
        {/* Columna de texto: en reposo, las tipologías; sobre una obra, su ficha. */}
        <div className="dg-side">
          <div className="dg-groups" onPointerLeave={hover(null)}>
            <h2 className="t-title dg-title">{copy.projects.title}</h2>
            <ol className="dg-group-list">
              {placed.map((group, i) => (
                <li key={group.id}>
                  <Link
                    href={group.href ?? routes.services}
                    className="dg-group"
                    data-on={activeGroup === group.id || undefined}
                    onPointerEnter={hover({ kind: "group", id: group.id })}
                    onFocus={() => setActive({ kind: "group", id: group.id })}
                    onBlur={() => setActive(null)}
                  >
                    <span className="t-label">{numberOf(i)}</span>
                    <span className="dg-group-name">{group.label}</span>
                    <span className="t-label dg-group-n">{group.items.length}</span>
                  </Link>
                  {/* solo en móvil: las obras de cada tipología, ya que ahí el dibujo va sin códigos */}
                  <ul className="dg-items">
                    {group.items.map((item) =>
                      item.href ? (
                        <li key={item.id}>
                          <Link href={item.href} className="dg-item">
                            <span className="t-label">{item.label}</span>
                            <span className="dg-item-name">{item.name}</span>
                          </Link>
                        </li>
                      ) : (
                        <li key={item.id} className="dg-item" data-pending="">
                          <span className="t-label">{item.label}</span>
                          <span className="dg-item-name">{item.note}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </li>
              ))}
            </ol>
          </div>

          <div className="dg-card" aria-live="polite">
            <div className="dg-card-plate">
              {placed.flatMap((g) => g.items).map(
                (item) =>
                  item.image && (
                    <Image
                      key={item.id}
                      src={item.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 900px) 30vw, 1px"
                      className="object-cover"
                      data-on={activeItem?.id === item.id || undefined}
                    />
                  ),
              )}
            </div>
            {activeItem && (
              <>
                <span className="t-label">
                  {placed.find((g) => g.id === activeGroup)?.label} · {activeItem.label}
                </span>
                <h3 className="dg-card-name">{activeItem.name ?? activeItem.label}</h3>
                <p className="t-label">{activeItem.place ?? activeItem.note}</p>
                {activeItem.href ? (
                  <Link href={activeItem.href} className="link-underline">
                    Ver el proyecto
                  </Link>
                ) : (
                  activeItem.name && <span className="t-label">{activeItem.note}</span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="dg-figure">
          <svg className="dg-svg" viewBox="-550 -550 1100 1100" role="group" aria-label={`${copy.projects.title}: ${groups.map((g) => g.label).join(", ")}`}>
            {/* anillos de guía */}
            {[...RINGS, R_INNER].map((r) => (
              <circle key={r} r={r} className="dg-ring" />
            ))}

            {placed.map((group, i) => {
              const style = { "--i": i } as CSSProperties;
              const [nx, ny] = pt(group.r, (group.a0 + group.a1) / 2);
              const on = activeGroup === group.id || undefined;
              return (
                <g key={group.id} style={style}>
                  {/* el arco: una tipología */}
                  <a
                    href={group.href ?? routes.services}
                    aria-label={`${group.label}: ${group.items.length} proyectos`}
                    onPointerEnter={hover({ kind: "group", id: group.id })}
                    onPointerLeave={hover(null)}
                    onFocus={() => setActive({ kind: "group", id: group.id })}
                    onBlur={() => setActive(null)}
                    onClick={go({ kind: "group", id: group.id }, group.href ?? routes.services)}
                  >
                    <path d={arcPath(group.r, group.a0, group.a1)} pathLength={1} className="dg-arc" data-on={on} />
                    <text x={f(nx)} y={f(ny)} className="dg-num">
                      {numberOf(i)}
                    </text>
                  </a>

                  {/* las obras: línea desde el arco y código en el perímetro */}
                  {group.items.map((item, j) => {
                    const a = group.angles[j];
                    const itemOn = activeItem?.id === item.id || (active?.kind === "group" && on) || undefined;
                    const label = (
                      <text transform={labelTransform(a)} textAnchor={isLeft(a) ? "end" : "start"} className="dg-label" data-on={itemOn} data-pending={item.href ? undefined : ""}>
                        {item.label}
                      </text>
                    );
                    return (
                      <g key={item.id}>
                        <path d={linePath(group.r, a)} pathLength={1} className="dg-line" data-on={itemOn} />
                        {item.href ? (
                          <a
                            href={item.href}
                            aria-label={`${item.name} (${item.label})`}
                            onPointerEnter={hover({ kind: "item", id: item.id })}
                            onPointerLeave={hover(null)}
                            onFocus={() => setActive({ kind: "item", id: item.id })}
                            onBlur={() => setActive(null)}
                            onClick={go({ kind: "item", id: item.id }, item.href)}
                          >
                            {label}
                          </a>
                        ) : (
                          <g onPointerEnter={hover({ kind: "item", id: item.id })} onPointerLeave={hover(null)} onClick={() => setActive({ kind: "item", id: item.id })}>
                            {label}
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* el centro: el isotipo, que lleva al estudio */}
            <a
              href={routes.studio}
              aria-label={`${site.name} · ${copy.studio.cta}`}
              className="dg-center-link"
              onClick={(event) => {
                event.preventDefault();
                router.push(routes.studio);
              }}
            >
              <circle r={R_INNER - 12} className="dg-center-hit" />
              {/* el encaje va en un <g> aparte: el `transform-origin` del hover, aplicado al mismo
                  elemento, cambiaría el origen de este transform y el isotipo se iría de pantalla */}
              <g className="dg-center">
                <g transform={ISO_TRANSFORM}>
                  <path d={ISO_D} />
                </g>
              </g>
            </a>
          </svg>
        </div>
      </Reveal>
    </section>
  );
}
