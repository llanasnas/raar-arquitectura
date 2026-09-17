import type { Metadata } from "next";
import { HeroScrollVideo } from "@/components/hero/HeroScrollVideo";
import { ContextStrip, FeaturedProjects, Services, Process, Testimonials, StudioTeaser, Faq, ContactCta } from "@/components/sections/Landing";
import { site } from "@/lib/site";

// Landing de la v1. Fuera del índice: existe solo para comparar con la v2.
export const metadata: Metadata = {
  title: { absolute: `${site.name} · versión 1 (archivada)` },
  description: site.description,
  robots: { index: false, follow: false },
  alternates: { canonical: "/v1" },
};

export default function V1HomePage() {
  return (
    <>
      <HeroScrollVideo />
      <ContextStrip />
      <FeaturedProjects />
      <Services />
      <Process />
      <Testimonials />
      <StudioTeaser />
      <Faq />
      <ContactCta />
    </>
  );
}
