import { CoverBody } from "@/components/site/CoverBody";

// Portada: el lema a la izquierda y el vídeo a la derecha, a toda altura. El logotipo no vive
// aquí (es el `SiteBrand` fijo, que a la altura de la portada se pone grande cruzando la
// pantalla) y el vídeo tampoco se duplica: el que asoma por las franjas de la apertura es
// este mismo.
//
// La portada está montada desde el primer momento: el telón de la apertura la tapa y al
// subir la descubre, no hay nada que entre después.
export function Cover({ brandCorner = "tl", opening = false }: { brandCorner?: "tl" | "br"; opening?: boolean }) {
  return (
    <section data-menu="dark" className="cover" data-brand={brandCorner}>
      <CoverBody opening={opening} />
    </section>
  );
}
