# 02 · Inventario de contenido y assets

Snapshot de https://www.raar-arquitectura.eu — 14 sep 2026.

Fuentes máquina: [`original-site/asset-map.json`](./original-site/asset-map.json), [`original-site/image_inventory.json`](./original-site/image_inventory.json), [`original-site/download_report.json`](./original-site/download_report.json).


## 1. Dónde está cada cosa en este repo

| Qué | Dónde | Formato |
|---|---|---|
| Datos globales (marca, nav, contacto, redes, SEO original, diseño) | [`content/site.json`](../content/site.json) | JSON |
| Páginas Home / About / Contact | [`content/pages/*.md`](../content/pages/) | Markdown + frontmatter YAML |
| 12 proyectos (8 publicados + 4 processing) | [`content/projects/*.md`](../content/projects/) | Markdown + frontmatter YAML |
| Imágenes renombradas y organizadas | [`public/images/`](../public/images/) | jpg / png / gif originales, sin recomprimir |
| HTML/CSS/JS original íntegro | [`docs/original-site/`](./original-site/) | referencia, no usar en producción |

Convención de nombres en `public/images/projects/<id>/`:

- `thumb.jpg` — miniatura 500×500 de la parrilla Works
- `hero.*` — imagen de cabecera de la ficha (cuando no coincide con un render de galería)
- `concept.gif` — GIF conceptual animado
- `render-NN-<descripcion>.*` — galería de renders, en el orden del carrusel original
- `plan-NN[-<descripcion>].*` — planos, en el orden del carrusel original

## 2. Textos: qué hay y cuánto

| Página | Palabras | Idioma | Título `<title>` | Meta description |
|---|---:|---|---|---|
| Home | 5 (+4 palabras animadas) | EN | `RAAR arquitectura` | `description` (placeholder) |
| Works | 12 códigos + 4 "PROCESSING" | — | `Works` | `description` |
| About | ~215 | EN | `Works` | `description` |
| Contact | ~20 + form | EN | `Works` | `description` |
| AR07 | ~430 | EN | `Works` | `description` |
| CO38 | ~430 | EN | `Works` | `description` |
| GG01 | ~470 | EN | `Works` | `description` |
| IM10 | ~360 | EN | `Works` | `description` |
| TO39 | ~330 | EN | `Works` | `description` |
| VI02 | ~430 | EN | `Works` | `description` |
| MO07 | ~420 | EN | `Works` | `description` |
| PE17 | ~250 | EN | `Works` | `description` |

Texto íntegro de cada página: ver `content/`. Todos los textos de proyecto están completos y son reutilizables (traducir a ES/CA).

## 3. Proyectos: resumen

| # | Código | Ubicación | Tipo | Ficha | GIF | Renders | Planos | Rotos |
|--:|---|---|---|:-:|:-:|--:|--:|---|
| 1 | AR07 | Sant Cugat del Vallès | New build | ✅ | 4.7 MB | 3 | 4 | — |
| 2 | CO38 | Barcelona | Rebuild | ✅ | **31.5 MB** | 1 (+2 rotos) | 1 | 2 renders 404 |
| 3 | GG01 | Girona (Gironès) | New build | ✅ | **55.6 MB** | 4 | 4 | — |
| 4 | IM10 | Barcelona (Sarrià) | Rebuild | ✅ | — | 5 | 1 (+1 slide vacío) | — |
| 5 | TO39 | Barcelona (Gràcia) | Rebuild | ✅ | **37.3 MB** | 4 | 0 (2 rotos) | 2 planos 404 |
| 6 | VI02 | La Garriga | Rebuild | ✅ | — | 6 | 3 | — |
| 7 | MO07 (ficha dice MO_23) | Barcelona | Rebuild | ✅ | 0.15 MB | 4 | 4 | — |
| 8 | PE17 | Barcelona (Gràcia) | Rebuild | ✅ | — | 4 | 2 | — |
| 9 | GV75 | ? | ? | ❌ processing | — | — | — | — |
| 10 | SE08 | ? | ? | ❌ processing | — | — | — | — |
| 11 | PR37 | ? | ? | ❌ processing | — | — | — | — |
| 12 | GR16 | ? | ? (render obra nueva) | ❌ processing | — | — | — | — |

Datos que **no existen** en ningún proyecto: año, superficie (salvo GG01: 200 m²), fase (proyecto / en obra / terminado), fotos de obra acabada (todo son renders), cliente, colaboradores, presupuesto.

## 4. Referencias rotas en la web viva (404)

| Archivo original | Dónde se usa | Efecto visible |
|---|---|---|
| `assets/favicon.ico` | favicon (referenced in every <head>) | imagen rota |
| `assets/images/TO39/pb.png` | TO39 planta baja (referenced in worksto39.html plans carousel) | imagen rota |
| `assets/images/TO39/p1.png` | TO39 planta 1 (referenced in worksto39.html plans carousel) | imagen rota |
| `assets/images/ariño/RENDER INTERIOR (1).jpg` | CO38 carousel item 1 (points to non-existent folder 'ariño/'; AR07 image intended?) | imagen rota |
| `assets/images/ariño/RENDER  EXTERIOR (1).jpg` | CO38 carousel item 3 (same broken folder) | imagen rota |

## 5. Inventario completo de imágenes (76 archivos, 273 MB)

Mapa original → nuevo. Tamaños y dimensiones medidos sobre el archivo descargado.


### `brand/` — 3 archivos, 61 KB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `brand/logo-black.png` | `assets/images/logo definitiu.png` | 2444×824 | PNG | 39 KB |
| `brand/logo-white.png` | `assets/images/logo definitiu blanc.png` | 2444×824 | PNG | 19 KB |
| `brand/apple-icon-180x180.png` | `assets/apple-icon-180x180.png` | 180×180 | PNG | 3 KB |

### `home/` — 1 archivos, 0.30 MB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `home/hero-space.jpg` | `assets/images/space 2.jpg` | 1920×1080 | JPEG | 0.30 MB |

### `about/` — 1 archivos, 0.19 MB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `about/team-aerial.jpg` | `assets/images/profil.jpg` | 640×483 | JPEG | 0.19 MB |

### `projects/ar07/` — 10 archivos, 25.24 MB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `projects/ar07/thumb.jpg` | `images/portfolio-img3.jpg` | 500×500 | JPEG | 0.21 MB |
| `projects/ar07/hero.jpg` | `assets/images/AR07/arino exterior.jpg` | 3840×2121 | JPEG | 6.65 MB |
| `projects/ar07/concept.gif` | `assets/images/AR07/gif ariño bo.gif` | 1020×1020 | GIF (144 fr) | 4.71 MB |
| `projects/ar07/render-01-acceso.jpg` | `assets/images/AR07/RENDER  ACCESO FINAL SIN ESCALA (1).jpg` | 3840×2160 | JPEG | 3.52 MB |
| `projects/ar07/render-02-exterior.jpg` | `assets/images/AR07/RENDER  EXTERIOR (1).jpg` | 3840×2121 | JPEG | 6.05 MB |
| `projects/ar07/render-03-interior.jpg` | `assets/images/AR07/RENDER INTERIOR (1).jpg` | 3840×2160 | JPEG | 3.88 MB |
| `projects/ar07/plan-01.jpg` | `assets/images/AR07/planta.jpg` | 1020×1020 | JPEG | 43 KB |
| `projects/ar07/plan-02.jpg` | `assets/images/AR07/planta2.jpg` | 1020×1020 | JPEG | 57 KB |
| `projects/ar07/plan-03.jpg` | `assets/images/AR07/planta3.jpg` | 1020×1020 | JPEG | 57 KB |
| `projects/ar07/plan-04.jpg` | `assets/images/AR07/planta4.jpg` | 1020×1020 | JPEG | 50 KB |

### `projects/co38/` — 4 archivos, 33.52 MB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `projects/co38/thumb.jpg` | `images/portfolio-img2.jpg` | 500×500 | JPEG | 0.19 MB |
| `projects/co38/render-01-frontal.jpg` | `assets/images/CO38/RENDER FRONTAL.jpg` | 2200×1100 | JPEG | 1.50 MB |
| `projects/co38/concept.gif` | `assets/images/CO38/co38.gif` | 4252×4252 | GIF (144 fr) | 31.54 MB |
| `projects/co38/plan-01.jpg` | `assets/images/CO38/planta FINAL.jpg` | 3952×4252 | JPEG | 0.29 MB |

### `projects/gg01/` — 11 archivos, 68.84 MB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `projects/gg01/thumb.jpg` | `images/portfolio-img1.jpg` | 500×500 | JPEG | 0.28 MB |
| `projects/gg01/hero.jpg` | `assets/images/GG01/GG PORTADA.jpg` | 3840×1952 | JPEG | 2.48 MB |
| `projects/gg01/concept.gif` | `assets/images/GG01/GG01 bo.gif` | 3952×4252 | GIF (192 fr) | 55.59 MB |
| `projects/gg01/render-01-patio.jpg` | `assets/images/GG01/RENDER PATIO.jpg` | 1500×1130 | JPEG | 0.75 MB |
| `projects/gg01/render-02-trasera.jpg` | `assets/images/GG01/RENDER TRASERA .jpg` | 1500×1130 | JPEG | 0.57 MB |
| `projects/gg01/render-03-terraza.jpg` | `assets/images/GG01/RENDER TERRAZA.jpg` | 1500×1130 | JPEG | 0.44 MB |
| `projects/gg01/render-04-acceso.jpg` | `assets/images/GG01/RENDER ACCESO.jpg` | 2700×2160 | JPEG | 1.47 MB |
| `projects/gg01/plan-01.jpg` | `assets/images/GG01/planta.jpg` | 3952×4252 | JPEG | 1.50 MB |
| `projects/gg01/plan-02.jpg` | `assets/images/GG01/planta2.jpg` | 3952×4252 | JPEG | 1.82 MB |
| `projects/gg01/plan-03.jpg` | `assets/images/GG01/planta3.jpg` | 3952×4252 | JPEG | 1.97 MB |
| `projects/gg01/plan-04.jpg` | `assets/images/GG01/planta4.jpg` | 3952×4252 | JPEG | 1.96 MB |

### `projects/im10/` — 8 archivos, 19.35 MB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `projects/im10/thumb.jpg` | `images/portfolio-img6.jpg` | 500×500 | JPEG | 0.23 MB |
| `projects/im10/hero.jpg` | `assets/images/IM10/FACHADA.jpg` | 3840×2160 | JPEG | 5.78 MB |
| `projects/im10/render-01-sala.jpg` | `assets/images/IM10/SALAF.jpg` | 1635×920 | JPEG | 0.87 MB |
| `projects/im10/render-02-cocina.png` | `assets/images/IM10/COCINA.png` | 1635×920 | PNG | 1.64 MB |
| `projects/im10/render-03-comedor.png` | `assets/images/IM10/COMEDOR.png` | 1635×920 | PNG | 2.08 MB |
| `projects/im10/render-04-oficina.png` | `assets/images/IM10/OFICINA.png` | 1635×897 | PNG | 2.02 MB |
| `projects/im10/render-05-habitacion-principal.png` | `assets/images/IM10/HABPP1.png` | 2131×1500 | PNG | 6.45 MB |
| `projects/im10/plan-01-planta-baja.png` | `assets/images/IM10/pb.png` | 9923×7016 | PNG | 0.28 MB |

### `projects/to39/` — 6 archivos, 48.43 MB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `projects/to39/thumb.jpg` | `images/portfolio-img7.jpg` | 500×500 | JPEG | 0.20 MB |
| `projects/to39/concept.gif` | `assets/images/TO39/GIFTO39.gif` | 4252×4252 | GIF (128 fr) | 37.26 MB |
| `projects/to39/render-01-sala.jpg` | `assets/images/TO39/SALAPP.jpg` | 3769×2121 | JPEG | 3.26 MB |
| `projects/to39/render-02-recepcion.jpg` | `assets/images/TO39/RECEPCION.jpg` | 2828×2121 | JPEG | 2.52 MB |
| `projects/to39/render-03-yoga.jpg` | `assets/images/TO39/YOGA.jpg` | 2828×2121 | JPEG | 2.37 MB |
| `projects/to39/render-04-ceramica.jpg` | `assets/images/TO39/CERAMICA.jpg` | 3185×2121 | JPEG | 2.82 MB |

### `projects/vi02/` — 11 archivos, 31.11 MB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `projects/vi02/thumb.jpg` | `images/portfolio-img5.jpg` | 500×500 | JPEG | 0.20 MB |
| `projects/vi02/hero.png` | `assets/images/VI02/ZS2.png` | 1440×960 | PNG | 2.72 MB |
| `projects/vi02/render-01-zona-social-1.png` | `assets/images/VI02/ZS1.png` | 1802×1200 | PNG | 4.19 MB |
| `projects/vi02/render-02-zona-social-2.png` | `assets/images/VI02/ZS.png` | 1800×1200 | PNG | 4.30 MB |
| `projects/vi02/render-03-oficina.png` | `assets/images/VI02/OFI.png` | 1800×1200 | PNG | 4.44 MB |
| `projects/vi02/render-04-habitacion-principal.png` | `assets/images/VI02/HABPP1.png` | 1802×1200 | PNG | 4.79 MB |
| `projects/vi02/render-05-habitacion-2.png` | `assets/images/VI02/HAB2.png` | 1800×1200 | PNG | 4.01 MB |
| `projects/vi02/render-06-escena-9.png` | `assets/images/VI02/Escena9.png` | 1802×1200 | PNG | 4.02 MB |
| `projects/vi02/plan-01-planta-baja.jpg` | `assets/images/VI02/pb.jpg` | 9923×7016 | JPEG | 0.84 MB |
| `projects/vi02/plan-02-planta-1.jpg` | `assets/images/VI02/p1.jpg` | 9923×7016 | JPEG | 0.84 MB |
| `projects/vi02/plan-03-planta-2.jpg` | `assets/images/VI02/p2.jpg` | 9923×7016 | JPEG | 0.77 MB |

### `projects/mo07/` — 10 archivos, 20.86 MB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `projects/mo07/thumb.jpg` | `images/portfolio-img4.jpg` | 500×500 | JPEG | 0.18 MB |
| `projects/mo07/concept.gif` | `assets/images/MO07/mo07.gif` | 785×1112 | GIF (10 fr) | 0.15 MB |
| `projects/mo07/render-01-escena-1.png` | `assets/images/MO07/Escena1.png` | 1200×1703 | PNG | 4.24 MB |
| `projects/mo07/render-02-escena-7.png` | `assets/images/MO07/Escena7.png` | 1800×1200 | PNG | 4.50 MB |
| `projects/mo07/render-03-escena-12.png` | `assets/images/MO07/Escena12.png` | 1440×959 | PNG | 2.59 MB |
| `projects/mo07/render-04-cubierta.png` | `assets/images/MO07/CUBIERTA2.png` | 1802×1200 | PNG | 5.19 MB |
| `projects/mo07/plan-01.jpg` | `assets/images/MO07/0.jpg` | 9415×4933 | JPEG | 1.47 MB |
| `projects/mo07/plan-02.jpg` | `assets/images/MO07/1.jpg` | 9415×4933 | JPEG | 0.86 MB |
| `projects/mo07/plan-03.jpg` | `assets/images/MO07/2.jpg` | 9415×4933 | JPEG | 0.80 MB |
| `projects/mo07/plan-04.jpg` | `assets/images/MO07/3.jpg` | 9415×4933 | JPEG | 0.88 MB |

### `projects/pe17/` — 7 archivos, 24.63 MB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `projects/pe17/thumb.jpg` | `images/portfolio-img8.jpg` | 500×500 | JPEG | 0.20 MB |
| `projects/pe17/render-01-escena-1.png` | `assets/images/PE17/Escena1.png` | 2252×1500 | PNG | 7.05 MB |
| `projects/pe17/render-02-escena-2.png` | `assets/images/PE17/Escena2.png` | 2252×1500 | PNG | 7.10 MB |
| `projects/pe17/render-03-escena-3.png` | `assets/images/PE17/Escena3.png` | 2252×1500 | PNG | 7.02 MB |
| `projects/pe17/render-04-habitacion.jpg` | `assets/images/PE17/HABITACIONFINAL.jpg` | 2828×2121 | JPEG | 2.63 MB |
| `projects/pe17/plan-02-planta-1.jpg` | `assets/images/PE17/p1.jpg` | 4961×3508 | JPEG | 0.32 MB |
| `projects/pe17/plan-01-planta-baja.jpg` | `assets/images/PE17/pb.jpg` | 4961×3508 | JPEG | 0.31 MB |

### `projects/gv75/` — 1 archivos, 0.16 MB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `projects/gv75/thumb.jpg` | `images/portfolio-img9.jpg` | 500×500 | JPEG | 0.16 MB |

### `projects/se08/` — 1 archivos, 0.17 MB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `projects/se08/thumb.jpg` | `images/portfolio-img10.jpg` | 500×500 | JPEG | 0.17 MB |

### `projects/pr37/` — 1 archivos, 0.17 MB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `projects/pr37/thumb.jpg` | `images/portfolio-img11.jpg` | 500×500 | JPEG | 0.17 MB |

### `projects/gr16/` — 1 archivos, 0.12 MB

| Nuevo (public/images/…) | Original | Dimensiones | Formato | Peso |
|---|---|---|---|---:|
| `projects/gr16/thumb.jpg` | `images/portfolio-img12.jpg` | 500×500 | JPEG | 0.12 MB |

**Total: 273.16 MB**


## 6. Assets que faltan para la nueva web

- Logo en **SVG** (solo hay PNG 2444×824).
- Favicon real (el actual da 404) + iconos PWA.
- Imagen Open Graph 1200×630.
- Fotos reales de obra terminada (todo son renders).
- Fotos y nombres de los tres socios.
- Contenido de GV75, SE08, PR37, GR16.
- Versiones ES y CA de todos los textos.
- Los 2 planos de TO39 y los 2 renders de CO38 que dan 404.
