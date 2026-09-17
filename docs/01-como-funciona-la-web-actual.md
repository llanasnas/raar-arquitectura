# 01 · Cómo funciona la web actual de RAAR arquitectura

**URL:** https://www.raar-arquitectura.eu
**Snapshot:** 14 sep 2026
**Snapshot HTML/CSS/JS original:** [`docs/original-site/`](./original-site/)

---

## 1. Qué es

Web de portfolio de **RAAR arquitectura**, estudio de arquitectura fundado por tres socios en Barcelona (C/ Bruc 136 bajos 2a). Muestra 12 proyectos residenciales (8 con ficha, 4 "en proceso"), una página "About" y un formulario de contacto.

Idioma único: **inglés**. El botón "ES" del menú es un enlace vacío.

## 2. Stack técnico

| Capa | Tecnología | Observaciones |
|---|---|---|
| HTML | Estático, 12 archivos `.html` planos en raíz | Sin generador, sin CMS. Cada página duplica header/footer a mano. |
| CSS | Bootstrap 3 (bundle `main.3f6952e4.css`, 89 KB) + `css/CS/style.css` (portfolio, de plantilla **Tooplate 2082 Pure Mix**) + Owl Carousel 2 | Fuentes Google: **Roboto 900** (display) y **Roboto Mono 300/400/700** (cuerpo). Font Awesome 4.7 por CDN. |
| JS | Bundle webpack `main.70a66962.js` (138 KB): jQuery 3, Bootstrap 3 JS, **Typed.js**, y 3 funciones propias expuestas en `window` (`type`, `movingBackgroundImage`, `navActivePage`). Además `js/main.js` de plantilla **FreeHTML5 (fh5co)** con Owl Carousel, Waypoints, Flexslider | Todo el JS es de 2017-2019. Sin módulos, sin tree-shaking. |
| Build | Hashes en nombre (`main.3f6952e4.css`) → generado con un starter tipo *webpack-static* / "Initializr" | Plantilla de agencia adaptada; el título del `<head>` de la plantilla ("Initializr") se cambió, pero quedan restos (`© UNTITLED`, `UA-XXXXX-X`, `send_email.php`). |
| Hosting | Estático (.eu). `sitemap.xml` y `robots.txt` → 404 | Sin cabeceras de caché comprobadas. |
| Analítica | Snippet de Google Analytics **comentado** con ID placeholder | No hay medición. |

## 3. Mapa de páginas (12 URLs)

```
/                      index.html          Hero 100vh + footer. Nada más.
/works.html            Parrilla 3 columnas con 12 thumbnails 500x500
/about.html            Texto (3 párrafos) + foto
/contact.html          Formulario (roto) + datos de contacto + iconos sociales
/worksariño.html       AR07  · St. Cugat   · New build
/worksco38.html        CO38  · Barcelona   · Rebuild
/worksgg01.html        GG01  · Girona      · New build
/worksim10.html        IM10  · Barcelona   · Rebuild
/worksto39.html        TO39  · Barcelona   · Rebuild
/worksvi02.html        VI02  · La Garriga  · Rebuild
/worksmo07.html        MO07  · Barcelona   · Rebuild   (la ficha dice "MO_23")
/workspe17.html        PE17  · Barcelona   · Rebuild
```

Sin página propia (thumb con etiqueta "PROCESSING" y `href=""`): **GV75, SE08, PR37, GR16**.

### Navegación

Menú fijo superior, transparente, mismo en todas las páginas:

`01 : RAAR` · `02 : Works` · `03 : About us` · `04 : Contact us` · `ES` (vacío) · icono Instagram · logo (solo en interiores, 15 % ancho)

En móvil colapsa en hamburguesa (Bootstrap collapse). `navActivePage()` marca el `<a>` activo comparando `location.pathname` — solo se llama en contact.html.

Profundidad: cualquier ficha de proyecto está a 2 clics de la home (Home → Works → Proyecto). **No hay enlaces cruzados** entre proyectos ni desde la home ni desde About.

## 4. Anatomía de cada plantilla

### 4.1 Home (`index.html`)

```
<header>  nav fija transparente
<div.hero-full-container 100vh background-image: space 2.jpg>
    <h1>We design,</h1>
    <h3 4em>  Typed.js: DREAMS → ETERNITY → ATEMPORALITY → ARCHITECTURE (loop infinito)
    <img logo-white 30%>  alineado derecha
<footer>  © UNTITLED | Website created by RAAR
```

- Marco negro de 4 bordes (`#site-border-*`) alrededor del viewport.
- `movingBackgroundImage()`: parallax — al mover el ratón, el contenedor se desplaza `translate3d(-1.5·x/(w/5), -1.5·y/(h/5), 0)`.
- **No hay scroll.** La página es exactamente el viewport. Para hacer cualquier cosa hay que abrir el menú.

### 4.2 Works (`works.html`)

```
<h2 centrado> 02 : Works
<section#portfolio>
    12 × <div.iso-box col-md-4 col-sm-6>
            <img portfolio-imgN.jpg 500x500 alt="Portfolio">
            <div.portfolio-overlay>  (hover → fondo #141414 al 90 %)
                <a href="worksXX.html"><i fa-link></i></a>
                <h2>CÓDIGO</h2>
                [<h4>PROCESSING</h4>]
```

- Orden de la parrilla: AR07, CO38, GG01, IM10, TO39, VI02, MO07, PE17, GV75*, SE08*, PR37*, GR16*.
- Clases `template graphic photoshop branding` son restos del filtro Isotope de la plantilla; **no hay filtro** funcional.
- El thumb entero NO es clicable: solo el icono de link dentro del overlay (que aparece al hover). En táctil, el primer toque muestra el overlay y el segundo debe acertar el icono.
- Sin ubicación, tipología ni año en la parrilla; solo el código (AR07…).

### 4.3 Ficha de proyecto (`worksXX.html`) — 8 páginas, misma plantilla

```
<div.hero-full-container 100vh background-image: render>   ← sin texto encima
<section#about>
    col-md-3: <h2>CÓDIGO</h2> <h2>Ubicación</h2> <h2>New build|Rebuild</h2>
    col-md-9: <p> intro (1-3 párrafos)
    [<img concept.gif 50%>]                                 ← 5 de 8 proyectos
<section#about>  <p> bloque 2
<section id="works ariño">  Owl Carousel 1 item, dots, autoHeight: 3-6 renders
<section#about>  <p> bloque 3
<section id="works ariño">  Owl Carousel: 1-4 planos (width 80 %)
<footer>
```

- Los `id="about"` están repetidos 3 veces por página y `id="works ariño"` (con espacio y ñ) 2 veces — HTML inválido, copiado de la primera ficha.
- Los carruseles Owl se inicializan en `js/main.js` (`testimonialCarousel()` → `.owl-carousel-fullwidth`, `items:1, loop, dots, autoHeight`).
- Sin título de proyecto legible, sin ficha técnica (m², año, cliente, fase, colaboradores), sin "siguiente proyecto", sin CTA.
- `<title>Works</title>` en las 8 fichas.

### 4.4 About (`about.html`)

Título `03 : About us` · dos columnas: 3 párrafos (col-md-6) + foto `profil.jpg` cenital B/N de tres personas (col-md-6). Sin nombres, sin cargos, sin credenciales.

### 4.5 Contact (`contact.html`)

Título `04 : Contact us` · col-md-7 formulario (email, subject, textarea, botón Send → `send_email.php`) · col-md-5 lista teléfono/email/dirección + "Follow us on social media" (Facebook genérico, Instagram real, LinkedIn genérico).

**El formulario no funciona:** los inputs no tienen `name`, así que el POST va vacío; y `send_email.php` no existe en un hosting estático.

## 5. Sistema visual

| Elemento | Valor |
|---|---|
| Fondo / texto | Blanco `#fff` / negro `#000`. Casi monocromo. |
| Acento | `#001aff` (azul de plantilla, apenas visible) |
| Overlay portfolio | `#141414` @ 0.9 |
| Tipografía display | Roboto 900 |
| Tipografía cuerpo | Roboto Mono 300/400/700 — da el tono "técnico/plano" |
| Marco | Bordes finos en los 4 lados del viewport (negro en home, blanco en interiores) |
| Logo | Wordmark "RAAR" con las letras partidas por una franja horizontal + "arquitectura" pequeño. Versión negra y blanca. |
| Imágenes | Renders fotorrealistas cálidos (madera, cerámica, luz natural). Planos en línea negra sobre blanco. GIFs conceptuales B/N. |
| Numeración | Menú `01 :`, `02 :`… y códigos de proyecto tipo `AR_07` refuerzan la estética de plano técnico. |

## 6. Assets

- **76 imágenes, 273 MB** (ver [`02-inventario-contenido-y-assets.md`](./02-inventario-contenido-y-assets.md)).
- 3 GIFs conceptuales de **55.6 MB (GG01), 37.3 MB (TO39) y 31.5 MB (CO38)**. La ficha GG01 descarga ~70 MB.
- Renders de 3840 px y PNG de 4–7 MB servidos a `width:100%` sin `srcset`, sin lazy-load, sin WebP.
- Planos a 9923×7016 px (70 Mpx).
- 5 referencias rotas (404) en la web viva: favicon, 2 planos de TO39, 2 renders de CO38.

## 7. Flujo de usuario real

1. Aterriza en un hero negro con "We design, DREAMS…" y un logo. No sabe que es un estudio de arquitectura de Barcelona hasta que abre el menú.
2. Abre menú → Works → parrilla de 12 cuadrados con códigos crípticos (AR07, CO38…) sin ubicación ni tipología.
3. Hover → icono de link → ficha con hero de render sin texto → scroll → texto largo en inglés → carruseles.
4. Fin de ficha: footer "© UNTITLED". Sin siguiente proyecto, sin contacto. Vuelve al menú.
5. Contact → formulario que no envía nada.

## 8. Qué vale la pena conservar

- **Los renders y planos**: calidad alta, coherentes, transmiten bien la materialidad.
- **Los textos de proyecto**: bien escritos, con vocabulario específico (medianeras, bóveda catalana, Collserola, Gironès…). Base excelente para SEO local si se traducen a ES/CA y se estructuran.
- **El tono visual**: monocromo, Roboto Mono, numeración `01 :`, códigos de proyecto. Identidad reconocible; se puede mantener modernizándola.
- **Los GIFs conceptuales** como idea (diagrama animado del proceso) — pero rehechos como vídeo MP4/WebM o Lottie/SVG.
- **El logo** (PNG con transparencia; conviene pedir SVG).
- Instagram real: https://www.instagram.com/raar.arquitectura/
