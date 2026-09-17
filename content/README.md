# `content/` — fuente única de contenido

Todo el texto y los metadatos de la web original, extraídos tal cual (inglés) y estructurados para consumirlos desde Next.js (gray-matter / MDX / o migrar a un CMS más adelante).

```
content/
├── site.json          marca, navegación, contacto, redes, SEO original, sistema visual original
├── pages/
│   ├── home.md        hero original (h1, palabras typed, fondo), lo que falta
│   ├── about.md       3 párrafos "About us" + datos que faltan
│   └── contact.md     datos de contacto, formulario original y sus problemas
└── projects/
    ├── ar07.md  co38.md  gg01.md  im10.md  to39.md  vi02.md  mo07.md  pe17.md   (8 publicados)
    └── gv75.md  se08.md  pr37.md  gr16.md                                        (4 "processing")
```

## Frontmatter de proyecto

| Campo | Significado |
|---|---|
| `id` / `slug` | identificador en minúscula → carpeta `public/images/projects/<id>/` y ruta `/works/<id>` |
| `code` / `code_display_original` | código público (`AR07`) y cómo aparece en la ficha original (`AR_07`) |
| `title_suggested` | propuesta de nombre descriptivo (no existe en la original) |
| `order` | posición en la parrilla Works original (1–12) |
| `status` | `published` (tiene ficha) · `processing` (solo thumb) |
| `location` / `location_full` | tal cual en la ficha / ampliado con comarca-barrio deducido del texto |
| `type` / `type_normalized` | `New build` / `Rebuild` tal cual · `new-build` / `renovation` |
| `thumb`, `hero`, `concept_gif` | rutas en `public/images/` |
| `gallery[]`, `plans[]` | orden del carrusel original; `original` = nombre de archivo en la web vieja; `broken: true` = 404 en producción |
| `alt_suggested`, `label_suggested` | propuestas (la web original no tiene alt ni etiquetas) |
| `content_issues[]` | erratas, inconsistencias y errores detectados en esa ficha |

El cuerpo Markdown reproduce los bloques de texto **en el orden en que aparecen en la ficha original** (Intro → GIF → Bloque 2 → carrusel renders → Bloque 3 → carrusel planos) y cierra con "Datos extraíbles del texto" (hechos concretos para ficha técnica / schema).

## Pendiente antes de construir

- Traducir todo a ES y CA (el original solo está en EN).
- Rellenar `year`, `surface`, `client`, fase, y confirmar `MO07` vs `MO23`.
- Contenido de los 4 proyectos `processing`.
- Nombres/fotos de los socios (about.md).
