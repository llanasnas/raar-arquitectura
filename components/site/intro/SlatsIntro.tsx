import { SlatShow } from "@/components/site/intro/SlatShow";

// Apertura: telón de obras. Seis franjas que se quitan en escalera y descubren la portada,
// que está montada debajo desde el primer momento: no tapa una transición, descubre la página.
//
// En escritorio son seis columnas. El vídeo ocupa la mitad derecha a toda altura, así que la
// 4ª y la 6ª son ventanas que lo dejan ver y la 5ª lo parte por la mitad. Suben: 3ª, 5ª, 2ª, 1ª.
//
// En móvil son seis filas que salen hacia la izquierda, porque seis columnas en 390 px son
// tiras que no dejan leer ninguna foto. Ahí el vídeo ocupa la franja de abajo y el reparto
// es el mismo: la 5ª cae por el medio del vídeo y lo parte, la 4ª y la 6ª son ventanas.
//
// El orden de salida vive en el CSS, no aquí: un `--lift` en línea ganaría a la media query.
//
// Dos fotos por franja (ocho obras). Con tres, la apertura se comía medio mega de más para
// enseñar una foto que casi no da tiempo a ver.
//
// El logotipo es el `SiteBrand` de la página: viaja del centro a su esquina al final.
type Slat = { photos?: string[]; start?: number };

const SLATS: Slat[] = [
  {
    start: 0,
    photos: [
      "/images/projects/im10/hero.jpg",
      "/images/projects/pe17/render-01-escena-1.jpg",
    ],
  },
  {
    start: 420,
    photos: [
      "/images/projects/gg01/render-01-patio.jpg",
      "/images/projects/to39/render-02-recepcion.jpg",
    ],
  },
  {
    start: 840,
    photos: [
      "/images/projects/ar07/render-03-interior.jpg",
      "/images/projects/vi02/render-01-zona-social-1.jpg",
    ],
  },
  // 4ª · ventana al vídeo
  {},
  {
    // 5ª · la que parte el vídeo por la mitad, en los dos tamaños
    start: 1260,
    photos: [
      "/images/projects/mo07/render-02-escena-7.jpg",
      "/images/projects/to39/render-03-yoga.jpg",
    ],
  },
  // 6ª · ventana al vídeo
  {},
];

export function SlatsIntro() {
  return (
    <div className="sintro" aria-hidden="true">
      {SLATS.map((slat, index) =>
        slat.photos ? (
          <div key={index} className="sintro-slat">
            <SlatShow photos={slat.photos} start={slat.start} />
          </div>
        ) : (
          <div key={index} className="sintro-window" />
        ),
      )}
    </div>
  );
}
