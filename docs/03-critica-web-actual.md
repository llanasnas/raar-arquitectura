# 03 · Por qué la web actual no funciona

**Web analizada:** https://www.raar-arquitectura.eu · 14 sep 2026
**Evidencia:** snapshot completo en [`docs/original-site/`](./original-site/); inventario en [`02-inventario-contenido-y-assets.md`](./02-inventario-contenido-y-assets.md).

---

## Resumen ejecutivo

La web tiene **buen material** (renders de calidad, textos de proyecto bien escritos, una identidad visual reconocible) y **cero infraestructura para que ese material trabaje**: nadie la encuentra (sin SEO), quien llega no entiende qué es (hero sin mensaje), y quien lo entiende no puede hacer nada (sin CTAs, formulario roto).

Es una web de portfolio pensada para enseñar a quien ya conoce el estudio. No está pensada para captar clientes.

### Los 7 problemas que más pesan

| # | Problema | Impacto |
|--:|---|---|
| 1 | **La home no dice qué es RAAR.** Hero negro a pantalla completa con "We design, DREAMS…" y un logo. Sin scroll, sin texto, sin botón. El visitante tiene que abrir el menú para averiguar que es un estudio de arquitectura de Barcelona. | Rebote alto, cero posicionamiento |
| 2 | **No hay ningún CTA en toda la web.** Ni "Ver proyectos", ni "Cuéntanos tu proyecto", ni teléfono clicable. La única vía de contacto es un formulario que **no envía nada** (inputs sin `name`, `send_email.php` inexistente). | Conversión ≈ 0 |
| 3 | **SEO prácticamente inexistente.** `<title>Works</title>` en 10 de 12 páginas; `<meta name="description" content="description">` (literal) en todas; sin H1 real, sin `alt`, sin canonical, sin Open Graph, sin sitemap, sin robots.txt, sin datos estructurados. Solo en inglés para un mercado local ES/CA. | Invisible en Google para "arquitectos Barcelona", "reforma casa Sant Cugat", etc. |
| 4 | **GEO (AI search) nulo.** Sin entidad `Organization`/`ArchitectureFirm`, sin dirección estructurada, sin autores, sin FAQs, sin datos verificables (año, m², fase). Un LLM no puede citar a RAAR porque no hay nada extraíble. | Ausente de ChatGPT/Perplexity/AI Overviews |
| 5 | **273 MB de imágenes.** GIFs conceptuales de 55, 37 y 31 MB; PNG de 7 MB; planos de 70 megapíxeles. La ficha GG01 pesa ~70 MB. Sin lazy-load, sin `srcset`, sin WebP/AVIF. | LCP catastrófico, móvil inusable, penalización Core Web Vitals |
| 6 | **Sin señales de confianza (E-E-A-T).** No aparecen los nombres de los socios, ni titulación, ni colegiación, ni año de fundación, ni fotos de obra terminada, ni testimonios. Footer: `© UNTITLED`. | Un cliente que va a gastar 100k–500k € no contrata a un estudio anónimo |
| 7 | **Errores visibles.** 5 imágenes rotas (404) en producción, código de proyecto inconsistente (MO07 vs MO_23), errata "hplace", enlaces Facebook/LinkedIn a las home genéricas, botón "ES" muerto, slide vacío en IM10. | Percepción de abandono |

---

## 1. Posicionamiento: la home no comunica

### Problema
La home es un hero de 100vh con fondo negro estrellado, `<h1>We design,</h1>` y una palabra que se teclea en bucle (DREAMS / ETERNITY / ATEMPORALITY / ARCHITECTURE). Debajo, nada: no hay scroll. El único texto indexable son esas 5 palabras.

### Por qué falla
- **Test de los 5 segundos:** un visitante frío no puede responder "¿qué es esto?", "¿para quién?", "¿dónde?", "¿qué hago ahora?". "We design dreams" es un eslogan, no una propuesta de valor.
- **Obliga a navegar por el menú.** El menú es la única salida, y sus etiquetas (`01 : RAAR`, `02 : Works`) no ayudan: "RAAR" es la propia home.
- **Sin jerarquía visual hacia una acción.** El logo ocupa el sitio donde iría el CTA.
- **El efecto typed + parallax son de plantilla 2017.** Consumen atención y no aportan información.
- **Mobile:** el `<h3>` a `4em` con "ATEMPORALITY" desborda en pantallas estrechas.

### Qué debe hacer la nueva home
1. Titular que diga literalmente qué hace RAAR y dónde: *"Estudio de arquitectura en Barcelona. Obra nueva y reformas integrales de vivienda."* (ajustar copy después).
2. Subtítulo con el ángulo diferencial que ya está en el texto de About: arquitectura atemporal, materiales nobles, respeto por el entorno.
3. CTA primario (**"Cuéntanos tu proyecto"**) + secundario (**"Ver proyectos"**) visibles sin scroll.
4. Scroll con: proyectos destacados (3–4), servicios, proceso de trabajo, los tres socios, zona geográfica, contacto.
5. El hero puede mantener el render de un proyecto real a pantalla completa — pero con texto y botón encima. El cielo estrellado "space 2.jpg" no representa arquitectura.

---

## 2. Conversión: no hay ningún camino hacia "contactar"

### Evidencia
- **0 CTAs** en 12 páginas. Las fichas de proyecto terminan en el footer `© UNTITLED | Website created by RAAR`.
- **Teléfono y email como texto plano**, no `tel:` / `mailto:`. En móvil no se puede pulsar para llamar.
- **Formulario roto:** `<input type="email" id="email">` sin `name` → el navegador no envía el campo. `action="send_email.php"` en hosting estático → 404 o error. Sin validación, sin mensaje de éxito, sin protección anti-spam, sin checkbox RGPD.
- **Sin campos útiles**: no pregunta nombre, teléfono, tipo de proyecto (obra nueva / reforma), ubicación ni presupuesto — lo mínimo para cualificar un lead de arquitectura.
- **Parrilla Works:** el thumb no es clicable; solo el icono `fa-link` que aparece al hover. En táctil hay que tocar dos veces y acertar un círculo de 3.5 rem.
- **Sin "siguiente proyecto"** ni "proyectos relacionados": cada ficha es un callejón sin salida.
- **Redes:** Facebook → `http://www.facebook.com`, LinkedIn → `http://www.linkedin.com`. Placeholders de plantilla nunca rellenados.

### Qué debe tener la nueva web
- CTA primario en header (sticky) y al final de **cada** página y ficha: "Cuéntanos tu proyecto" / "Pide una primera visita".
- Formulario funcional (Server Action / Resend / Formspree): nombre, email, teléfono, tipo de proyecto, municipio, mensaje, consentimiento. Confirmación en pantalla y email.
- `tel:` y `mailto:` clicables; WhatsApp si el estudio lo usa.
- Tarjetas de proyecto enteras clicables con código + nombre legible + ubicación + tipología.
- Navegación anterior/siguiente y "proyectos similares" en fichas.
- Bloque de contacto repetido (dirección, mapa, horario) en el footer.

---

## 3. SEO técnico y on-page

### 3.1 Metadatos

| Elemento | Estado actual | Evidencia |
|---|---|---|
| `<title>` | 10 de 12 páginas = `Works`; home = `RAAR arquitectura` | Duplicados masivos; ninguna keyword ni ubicación |
| `<meta description>` | `content="description"` en **todas** | Placeholder literal sin rellenar |
| `<h1>` | Solo en home ("We design,"). Fichas: 3 `<h2>` seguidos (código, ciudad, tipo). Works/About/Contact: `<h2>` con "02 : Works" | Sin H1 semántico en 11 páginas |
| `alt` | `alt="Portfolio"` ×12 en works; `alt=""` o ausente en el resto | 76 imágenes, 0 alt descriptivos |
| `canonical` | No | Riesgo `index.html` vs `/` duplicado |
| Open Graph / Twitter Card | No | Compartir en WhatsApp/LinkedIn muestra nada |
| `lang` | `en` | Correcto para el contenido, incorrecto para el mercado |
| `<meta name="google" content="notranslate">` | Sí | **Bloquea activamente** que Chrome ofrezca traducir la web a un usuario español |
| `<meta name="Hugo Fernandez" content="RAAR arquitectura">` | Sí | Atributo `name` mal usado (debería ser `author`) |
| JSON-LD / schema.org | No | Sin `Organization`, `LocalBusiness`, `ArchitectureFirm`, `CreativeWork` |

### 3.2 Rastreo e indexación
- `robots.txt` → **404**. `sitemap.xml` → **404**.
- URLs: `worksariño.html` (ñ en URL → `worksari%C3%B1o.html`), `worksco38.html`. Sin jerarquía (`/proyectos/co38`), sin keywords, con extensión `.html`.
- Enlaces internos: cada ficha recibe **1 solo enlace** (desde works.html). Home y About no enlazan a ningún proyecto. Sin breadcrumbs.
- 5 recursos 404 en producción (favicon, 2 planos TO39, 2 renders CO38).
- Analytics: snippet UA comentado con `UA-XXXXX-X`. **No hay medición de nada** desde que existe la web.

### 3.3 Contenido y keywords
- **Idioma equivocado para el mercado.** El estudio está en Barcelona, sus proyectos están en Sant Cugat, La Garriga, Gràcia, Sarrià, Gironès. Sus clientes buscan en español y catalán: *"arquitecto reforma casa Sant Cugat"*, *"estudi d'arquitectura Barcelona"*, *"reforma integral piso Gràcia"*. La web solo existe en inglés → no compite por ninguna de esas búsquedas.
- **Sin páginas de servicio.** No hay URL para "reforma integral", "obra nueva unifamiliar", "rehabilitación nave industrial", "proyecto de interiorismo". Todo el tráfico de intención comercial no tiene dónde aterrizar.
- **Sin páginas de zona.** Los proyectos ya demuestran trabajo en 5 municipios/barrios; no se capitaliza.
- **Los códigos de proyecto (AR07, CO38) son opacos.** Sin un nombre descriptivo ("Casa pareada en Sant Cugat") no hay keyword en título, H1 ni URL.
- Textos de proyecto: buenos, pero enterrados bajo un hero sin texto y estructurados como 3 párrafos sin subtítulos → sin extractabilidad.

### 3.4 Core Web Vitals
- **LCP:** hero de home = 300 KB (aceptable). Fichas: hero de 3–7 MB en `background-image` (no prioriza carga, sin `fetchpriority`).
- **Peso por página:** GG01 ≈ 70 MB, TO39 ≈ 50 MB, CO38 ≈ 34 MB, VI02 ≈ 29 MB, PE17 ≈ 25 MB. En 4G (~10 Mbps) GG01 tarda ~1 minuto en cargar del todo.
- Sin `loading="lazy"`, sin `srcset`, sin formatos modernos. Los renders se sirven a 3840 px para pintarse a ~1100 px.
- jQuery + Bootstrap 3 + Owl + Flexslider + Waypoints (~230 KB JS) para 2 carruseles.
- Fuentes de Google Fonts por `@import` en CSS (bloqueo de render).
- **CLS:** carruseles Owl con `autoHeight` → salto de layout al inicializar.

---

## 4. GEO / AI Search (ChatGPT, Perplexity, Gemini, AI Overviews)

Pregunta de prueba: *"¿Qué estudios de arquitectura en Barcelona hacen reformas de casas entre medianeras?"* Hoy ningún asistente puede citar a RAAR. Motivos:

| Requisito para ser citado | Estado |
|---|---|
| Entidad clara (`Organization` con nombre, dirección, teléfono, fundadores, área servida) | ❌ No hay JSON-LD; la dirección solo está en texto plano en /contact |
| Página "About" con personas reales (nombre, cargo, titulación) | ❌ "three passionate views", sin nombres |
| Hechos extraíbles (año, m², municipio, tipología, fase) por proyecto | ❌ Solo GG01 menciona 200 m². Sin años. Sin fases |
| Respuestas directas a preguntas frecuentes ("¿cuánto cuesta un proyecto?", "¿qué fases tiene?", "¿trabajáis fuera de Barcelona?") | ❌ Sin FAQ |
| Contenido en el idioma de la consulta | ❌ Solo EN |
| Fecha de publicación / actualización | ❌ Ninguna |
| `llms.txt` / `robots.txt` que permita GPTBot, ClaudeBot, PerplexityBot | ❌ robots.txt no existe (por defecto permite, pero sin sitemap no hay descubrimiento) |
| Presencia en terceros (Google Business Profile, Houzz, Archello, COAC, Instagram con web enlazada) | ❓ Instagram sí. Resto no verificado — **acción para el cliente** |
| HTML semántico (`<main>`, `<article>`, `<nav>`, headings jerárquicos) | ❌ `<section id="about">` ×3 por página, `id="works ariño"` ×2, sin `<main>` |

### Qué debe tener la nueva web para GEO
- JSON-LD `ArchitectureFirm` (subtipo de `LocalBusiness`) con `address`, `geo`, `telephone`, `founder` ×3, `areaServed`, `sameAs` (Instagram, LinkedIn real).
- Cada proyecto como `CreativeWork`/`Article` con `locationCreated`, `dateCreated`, `about` (tipología), `author`.
- Bloque "Ficha técnica" en cada proyecto: municipio, tipología, superficie, año, fase, servicios prestados.
- Página de FAQs con `FAQPage` schema (fases, plazos, honorarios orientativos, zona, licencias).
- Textos ES/CA/EN con `hreflang` correcto y self-canonical por idioma.
- `llms.txt` en raíz describiendo el estudio, servicios, zona y enlaces clave.
- Fechas visibles en proyectos y "última actualización".

---

## 5. Rendimiento y assets

Ya cuantificado arriba. Puntos concretos:

- **GIFs conceptuales:** 55.6 MB (GG01, 3952×4252, 192 frames), 37.3 MB (TO39), 31.5 MB (CO38). Se muestran al 50 % de ancho. Un MP4/WebM equivalente pesaría 0.5–2 MB; un Lottie/SVG animado, < 200 KB. **La idea es buena, el formato es inviable.**
- **Planos:** IM10 `pb.png` 9923×7016; VI02 y MO07 similares. Son dibujos lineales → SVG o PNG a 2000 px.
- **PNG fotográficos:** PE17 Escena1/2/3 = 7 MB cada uno. → JPG/WebP/AVIF a 1600–2400 px, < 300 KB.
- **Hero de fichas:** 3840 px, 6.6 MB (AR07). → `next/image` con `priority`, `sizes="100vw"`, AVIF.
- **Mismo render usado como hero y como item de carrusel** (CO38, TO39, MO07, PE17): duplica descarga.
- Con `next/image` + AVIF/WebP + `sizes` correctos, los 273 MB deberían quedar en **< 15 MB** totales y **< 1.5 MB** por página.

---

## 6. Contenido y confianza (E-E-A-T)

### Lo que falta y un cliente potencial busca
- **Quiénes son.** "RAAR is born from the meeting of three passionate views" — sin nombres, sin caras, sin titulación, sin número de colegiado COAC, sin año de fundación. La única foto es cenital y no se distinguen las caras.
- **Qué hacen exactamente.** No hay lista de servicios. Se deduce de los proyectos: obra nueva unifamiliar, reforma integral, rehabilitación industrial, cohousing. Hay que decirlo.
- **Obra real.** Los 8 proyectos son renders. No hay una sola foto de obra terminada ni de obra en curso salvo los 3 thumbs B/N de "processing". Un cliente quiere saber si han construido algo.
- **Proceso y precio.** Nada sobre fases (estudio previo → anteproyecto → básico → ejecución → dirección de obra), plazos, honorarios, licencias.
- **Prueba social.** Cero testimonios, premios, publicaciones, colaboradores, cifras (n.º proyectos, m² construidos, años).
- **Footer `© UNTITLED`**: literalmente el placeholder de la plantilla. Transmite abandono.
- **Sin aviso legal, política de privacidad ni cookies**: obligatorio en España (LSSI + RGPD) y una señal de seriedad.

### Lo que sí hay y hay que aprovechar
- Textos de proyecto con vocabulario preciso y local: *party walls, Catalan vaulted slab, Collserola, Gironès, Gràcia, gabled roof, wet cores*. Traducidos y estructurados (Reto → Propuesta → Programa → Materiales) son contenido de primera para SEO y GEO.
- Un posicionamiento implícito sólido: **arquitectura atemporal, materiales nobles, luz, respeto por lo preexistente** — coherente en About y en las 8 fichas.

---

## 7. UX, navegación y accesibilidad

- **Menú numerado `01 : RAAR`** — "RAAR" como etiqueta de la home no es evidente. El logo (que debería llevar a home) no está en la nav de la home.
- **Botón "ES"** → `href=""`: recarga la página. Frustración directa para el usuario local.
- **Códigos AR07/CO38 como único identificador** en la parrilla: el visitante no puede elegir qué ver.
- **Overlay hover** en works: patrón de escritorio; en móvil requiere doble toque y precisión.
- **Fichas:** hero 100vh sin texto → el usuario ve una imagen sin título y tiene que hacer scroll para saber qué está mirando. La ficha técnica son 3 `<h2>` en columna (código / ciudad / tipo) sin etiquetas.
- **Carruseles Owl** sin flechas (`nav:false`), solo dots: navegación poco descubrible; sin zoom/lightbox para planos, que a 80 % de ancho son ilegibles.
- **Sin `<main>`, sin landmarks, sin skip-link, sin foco visible**, `<span class="sr-only"></span>` vacío en la hamburguesa de la home.
- **Contraste:** texto blanco sobre render claro en fichas (hero `white-text-container` sobre imágenes con cielo blanco).
- **Sin página 404** personalizada.
- `<meta content="IE=edge" http-equiv="X-UA-Compatible">`, `msapplication-tap-highlight`: restos de 2015.

---

## 8. Errores técnicos concretos

| Página | Error |
|---|---|
| Todas | `<head>` anidado dentro de `<head>` en works/about/contact/fichas (HTML inválido) |
| Todas | `<meta name="description" content="description">` |
| Todas | `assets/favicon.ico` → 404 |
| index | `<div align="right" vertical-align:"botom">` (atributo inválido, errata) |
| index | `<span class="sr-only"></span>` vacío |
| works | 4 enlaces `href=""` (GV75, SE08, PR37, GR16) |
| works | Clases de filtro Isotope (`template graphic photoshop branding`) sin filtro |
| about | Dos `<p>` sin cerrar |
| contact | Inputs sin `name`; `send_email.php` inexistente; Facebook/LinkedIn genéricos |
| worksariño | ñ en la URL |
| worksco38 | 2 imágenes 404 (`assets/images/ariño/…`); planos sin wrapper `.owl-carousel` |
| worksgg01 | Divs de cierre sobrantes en el carrusel |
| worksim10 | Errata "hplace"; slide vacío en carrusel de planos |
| worksto39 | 2 planos 404 (`pb.png`, `p1.png`) |
| worksmo07 | Código MO07 en URL/parrilla vs MO_23/MO23 en la ficha |
| Fichas | `id="about"` ×3 y `id="works ariño"` ×2 por página (IDs duplicados con espacio y ñ) |
| Fichas | `<title>Works</title>` ×8 |

---

## 9. Legal

Ausente todo lo exigible en España para una web de empresa:
- Aviso legal (datos identificativos, CIF, colegiación).
- Política de privacidad (el formulario recoge email → RGPD).
- Política de cookies + banner si se instala analítica.
- Consentimiento explícito en el formulario.

---

## 10. Idiomas

- Mercado: Barcelona y comarcas → **catalán y español** primero. Inglés como tercero (clientes internacionales que compran en la zona).
- Web actual: solo inglés + `notranslate` (bloquea la traducción automática del navegador) + botón ES muerto.
- Nueva web: `/es` (default), `/ca`, `/en` con `hreflang`, `x-default`, sitemap multilingüe, y **todo** el contenido traducido (no solo el menú).

---

## Priorización para la nueva web

### Imprescindible (bloquea captar clientes)
1. Home con propuesta de valor + CTAs + scroll con proyectos, servicios, equipo, contacto.
2. Formulario que funcione + `tel:`/`mailto:` + CTA al final de cada página.
3. Títulos, descriptions, H1, alt, canonical, OG, sitemap, robots, JSON-LD `ArchitectureFirm`.
4. Contenido en ES/CA (+EN) con `hreflang`.
5. Imágenes optimizadas (`next/image`, AVIF/WebP, lazy, sizes). GIFs → MP4/WebM o SVG animado.
6. Nombres, fotos y credenciales de los tres socios. Aviso legal / privacidad / cookies.

### Alto impacto
7. Páginas de servicio (obra nueva, reforma integral, rehabilitación, interiorismo) y de zona (Barcelona, Vallès, Girona).
8. Fichas de proyecto con nombre descriptivo, ficha técnica (municipio, m², año, fase, tipología), estructura por subtítulos, anterior/siguiente, CTA.
9. Parrilla Works con filtros reales (tipología / municipio / estado) y tarjetas clicables con título y ubicación.
10. FAQ con schema; página de proceso de trabajo.
11. Analítica (GA4 o Plausible) + Search Console + Google Business Profile.

### Deseable
12. Fotos de obra terminada; testimonios; publicaciones/premios.
13. `llms.txt`; blog/notas de proyecto para fan-out de consultas ("reforma casa entre medianeras", "bóveda catalana rehabilitación").
14. Lightbox para planos; vídeo de proceso en lugar de GIF.

### Datos que hay que pedir al cliente antes de construir
- Nombres, cargos, fotos, titulación y n.º colegiado de los socios; año de fundación; CIF y razón social.
- Lista de servicios y zona de trabajo.
- Por proyecto: nombre público, año, m², fase actual, fotos reales si existen; confirmar MO07 vs MO23; contenido de GV75/SE08/PR37/GR16.
- Logo en SVG.
- Perfiles reales de LinkedIn/Facebook (o eliminarlos).
- Textos en ES/CA (o aprobación para traducir los actuales).
- Horario y cómo prefieren el primer contacto (llamada, visita, email, WhatsApp).

---

## Objetivos medibles para la nueva web

| Métrica | Hoy | Objetivo |
|---|---|---|
| Peso de la ficha más pesada | ~70 MB | < 1.5 MB |
| LCP móvil | > 10 s (estimado) | < 2.5 s |
| Páginas con title/description únicos | 1 / 12 | 100 % |
| Imágenes con alt | 0 / 76 | 100 % |
| Idiomas | 1 (EN) | 3 (ES, CA, EN) |
| CTAs por página | 0 | ≥ 2 |
| Formulario funcional | No | Sí, con confirmación y RGPD |
| Datos estructurados | 0 | Organization + CreativeWork ×N + FAQPage + BreadcrumbList |
| Enlaces internos a cada proyecto | 1 | ≥ 4 (home, works, relacionados, servicio, zona) |
| Recursos 404 | 5 | 0 |
