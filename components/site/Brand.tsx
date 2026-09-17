import type { CSSProperties } from "react";
import { site } from "@/lib/site";

// El logotipo como máscara CSS, no como <img>: así toma el color del texto que lo rodea
// (blanco sobre vídeo, tinta sobre papel), puede animarse de un color a otro y admite
// un degradado dentro de la propia letra para el barrido de luz del ident.
// Fuente: public/images/brand/logo-black.svg (trazado del cliente, optimizado con svgo).
export function Brand({ className = "", style, label }: { className?: string; style?: CSSProperties; label?: string }) {
  return <span className={`brandmark ${className}`} style={style} role="img" aria-label={label ?? site.name} />;
}
