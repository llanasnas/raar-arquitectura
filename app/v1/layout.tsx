import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

// Web v1 («vidrio y piedra»), congelada como referencia mientras se construye la v2.
// Conserva su propio cromado: nav de burbujas de cristal, footer y tipografía Poppins (.v1-shell).
export default function V1Layout({ children }: LayoutProps<"/v1">) {
  return (
    <div className="v1-shell flex min-h-svh flex-col">
      <Nav />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
