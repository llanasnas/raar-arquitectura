# SEO local, GEO y lanzamiento (25/09/2026)

Qué se ha montado para que la web posicione por zona, qué hay que hacer al publicar y qué depende del cliente.

## Qué hay en la web

| Pieza | Dónde | Para qué |
|---|---|---|
| Páginas de zona | `/arquitectos` + `/arquitectos/{barcelona,sant-cugat,girona,costa-brava,andorra}` · contenido en `content/zonas/*.md` | Búsquedas «arquitecto en X». Cada una con obra real de la zona, normativa local con fuentes, FAQ, artículos relacionados, JSON-LD `Service` + `FAQPage` + `BreadcrumbList` |
| Blog | `/blog` + `/blog/<slug>` · contenido en `content/blog/*.md` | Búsquedas informativas locales (licencias, masías, Ley de Costas, Andorra, cédula). JSON-LD `BlogPosting` (con `citation`) + `FAQPage` |
| Loader | `lib/editorial.ts` (Markdown con `marked`, ids en los h2, índice lateral) | Añadir un artículo = añadir un `.md` |
| llms.txt | `/llms.txt` y `/llms-full.txt` (`lib/llms.ts`) | Resumen del estudio para ChatGPT, Claude, Perplexity… Se genera con los mismos datos que la web |
| robots | `app/robots.ts` | Permite todo y nombra a los bots de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…) |
| sitemap | `app/sitemap.ts` | Incluye zonas y artículos con su fecha real |
| Organización | `components/seo/JsonLd.tsx` | `ProfessionalService` (antes `ArchitectureFirm`, que no existe en schema.org), `areaServed` por zona, catálogo de servicios, primera visita gratuita como oferta, LinkedIn en `sameAs` |
| Pie | `SiteFoot` | Columna «Dónde trabajamos» con las cinco zonas y enlace al blog: todas las páginas enlazan a las zonas |
| Redirecciones 301 | `next.config.ts` | `/works.html`, `/about.html`, `/contact.html`, `/index.html`, `/worksXX.html` (incluida `worksariño.html` → AR07) y `/proyectos/mo23` → `mo07` |
| Cabeceras | `next.config.ts` | `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, HSTS (sin `preload`), sin `X-Powered-By`, AVIF + WebP |

Los textos existentes de la web **no se han tocado**. El copy nuevo va en `editorialCopy` (`lib/copy.ts`) y en los `.md`.

## Mapa de palabras clave

| Página | Búsqueda principal | Secundarias |
|---|---|---|
| `/arquitectos/barcelona` | arquitectos en Barcelona | reforma integral piso Barcelona, rehabilitación nave Barcelona, arquitecto Eixample / Gràcia / Sarrià |
| `/arquitectos/sant-cugat` | arquitecto Sant Cugat del Vallès | casa unifamiliar Sant Cugat, ampliación casa, arquitecto Vallès, Valldoreix, La Garriga |
| `/arquitectos/girona` | arquitectos en Girona | rehabilitar masía Girona, casa obra nueva Gironès, Empordà |
| `/arquitectos/costa-brava` | arquitecto Costa Brava | casa segunda residencia Costa Brava, reforma casa Begur / Palafrugell |
| `/arquitectos/andorra` | arquitecto Andorra | construir casa Andorra, casa unifamiliar Andorra, project management Andorra |
| `/blog/licencia-obras-reforma-piso-barcelona` | licencia obras reforma piso Barcelona | comunicado previo, IIT, ORPIMO |
| `/blog/construir-casa-sant-cugat-del-valles` | construir casa Sant Cugat | comprar terreno Vallès, proyecto básico y de ejecución |
| `/blog/rehabilitar-masia-girona` | rehabilitar masía Girona | catálogo de masías, suelo no urbanizable |
| `/blog/reformar-construir-costa-brava-ley-de-costas` | Ley de Costas reforma casa | servidumbre de protección 100 / 20 metros |
| `/blog/construir-casa-andorra` | construir casa Andorra | comprar terreno Andorra no residente, Llei 5/2025 |
| `/blog/cedula-habitabilidad-cataluna` | cédula de habitabilidad Cataluña | primera / segunda ocupación |
| `/blog/fases-reforma-integral-arquitecto` | fases reforma integral | qué hace un arquitecto en una reforma |
| `/blog/project-management-direccion-de-obra` | project management vs dirección de obra | dirección facultativa |

## Competencia revisada

- **Estudios locales que posicionan con páginas de zona largas**: QART Studio («Arquitecto en la Costa Brava», ~3.000 palabras, dos obras propias, FAQ de seis preguntas), PG Arquitectura (Costa Brava), RM Arq (Sant Feliu de Guíxols), RB Arquitectura Studio y VIVA (Sant Cugat), Engitec, DATA y ABAA (Andorra), Naiara Aldamiz y Terram (Girona).
- **Directorios que ocupan la primera página**: Houzz, Plan Reforma, Páginas Amarillas, Certicalia. Conviene tener ficha en Houzz y Plan Reforma con enlace a la web (citas de terceros: pesan mucho en las respuestas de IA).
- **Patrón que funciona**: obra propia de la zona + normativa concreta + FAQ + contacto. Es lo que llevan las páginas de zona, con la diferencia de que aquí cada afirmación normativa lleva su fuente oficial.

## Al publicar (checklist)

1. `.env` de producción: `NEXT_PUBLIC_SITE_URL=https://www.raar-arquitectura.eu` (canonical, sitemap, llms.txt y JSON-LD salen de aquí), `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`, `NEXT_PUBLIC_GA_ID` si hay analítica.
2. Dominio: que `raar-arquitectura.eu` (sin www) redirija a `www` con 301, o al revés, pero uno solo.
3. **Google Search Console**: verificar el dominio, enviar `sitemap.xml`, pedir indexación de `/`, `/arquitectos/*` y `/blog`.
4. **Bing Webmaster Tools**: importar desde Search Console (Copilot y ChatGPT tiran de Bing).
5. **Google Business Profile** (ya lo tiene el cliente): web → `https://www.raar-arquitectura.eu`, categoría «Arquitecto», zonas de servicio Barcelona, Sant Cugat, Girona, Costa Brava y Andorra, y enlazar alguna publicación a los artículos.
6. Probar un par de URL en el [Rich Results Test](https://search.google.com/test/rich-results).
7. Comprobar en producción: `/robots.txt`, `/sitemap.xml`, `/llms.txt`, y que `/works.html` da 308 a `/proyectos`.

## Pendiente del cliente

- **Andorra**: cómo firma RAAR allí (colegiación en el COAA o colaboración con un arquitecto colegiado). La página y el artículo lo dejan en «te lo explicamos en la primera visita»; si están colegiados, decirlo en claro ayuda.
- **Fotos de obra en Andorra** (la lámina del índice de zonas va en gris, sin foto).
- Revisar con el cliente la normativa de los artículos antes de publicarlos: está contrastada con fuentes oficiales, pero lo firma el estudio.
- Autoría de los artículos: ahora firma «RAAR arquitectura». Con nombre y colegiación de un arquitecto del estudio, los artículos ganan autoridad (E-E-A-T).
- Nuevos artículos: uno al mes por zona es suficiente. Ideas: ampliar una casa en Sant Cugat, reforma en Sarrià (casas en ladera), naves a vivienda en Barcelona (cambio de uso), casas de montaña en Andorra (aislamiento y nieve), segunda residencia en el Empordà.
- CA/EN: los catalanohablantes de Girona y Andorra buscan en catalán. Es lo siguiente con más retorno para el SEO local.

## Cómo añadir un artículo

Copiar un `.md` de `content/blog/`, cambiar el frontmatter (`title` ≤ 53 caracteres, `description` ≤ 158, `zones`, `projects`, `faq`, `sources`) y escribir el cuerpo con `##`. Se publica solo en el siguiente build: sitemap, llms.txt, blog, zona y relacionados se actualizan. `draft: true` lo oculta.
