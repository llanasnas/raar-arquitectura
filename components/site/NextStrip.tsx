import Image from "next/image";

// Lo que asoma por debajo de la portada en las pruebas: una lámina a sangre que confirma
// que hay scroll. Es material de prueba; aquí irá el primer bloque de revista de verdad.
//
// data-menu va por la luminancia de la imagen, no por el tipo de sección: este render es
// claro, así que el menú y el logotipo se leen en tinta («dark»), no en blanco.
export function NextStrip() {
  return (
    <section
      data-menu="dark"
      className="relative h-svh w-full overflow-hidden bg-carbon mt-10"
    >
      <Image
        src="/images/projects/mo07/render-01-escena-1.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
    </section>
  );
}
