import type { Metadata } from "next";
import { Cover } from "@/components/site/Cover";
import { NextStrip } from "@/components/site/NextStrip";
import { SlatsIntro } from "@/components/site/intro/SlatsIntro";
import { site } from "@/lib/site";

// Apertura elegida por el cliente: persiana de obras sobre el vídeo. El logotipo se queda
// abajo a la derecha (decisión cerrada), con el menú abajo a la izquierda.
export const metadata: Metadata = {
  title: { absolute: `${site.name} · Estudio de arquitectura en Barcelona` },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <SlatsIntro />
      <Cover brandCorner="br" opening />
      <NextStrip />
    </>
  );
}
