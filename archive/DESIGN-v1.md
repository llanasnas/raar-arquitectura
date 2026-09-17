# DESIGN.md — RAAR arquitectura

<!-- impeccable:design-schema 1 -->

Sistema visual de la web de RAAR arquitectura. Derivado del código que se ha construido (`app/globals.css`, `components/`), no de intenciones. Cambia los tokens aquí y en `globals.css` a la vez.

## 1. Mundo: «vidrio y piedra»

Una casa de RAAR vista a media mañana: piedra clara bajo luz suave, vidrio que deja ver lo que hay detrás, madera y ladrillo dentro de las imágenes. La interfaz se comporta como el vidrio de sus fachadas: **superficies translúcidas con desenfoque** flotando sobre las láminas, **esquinas generosas**, **controles en píldora**. Nada de retículas, cuadrículas ni bordes duros.

Tesis: *la obra se ve siempre; la interfaz se apoya sobre ella sin taparla.*

Lo que refuta: el portfolio blanco de sans fina y esquinas rectas; el fondo cuadriculado; el mono como disfraz técnico.

## 2. Color

| Token | Valor | Uso |
|---|---|---|
| `--stone` | `#F2F2EF` | fondo de página (piedra clara) |
| `--stone-2` | `#E9E9E5` | fondos secundarios, placeholders de imagen, círculo del FAQ |
| `--stone-3` | `#DEDEDA` | scrollbar, bordes de contenedores neutros |
| `--white` | `#FFFFFF` | tarjetas, campos |
| `--ink` | `#1A1A18` | texto principal, botón secundario relleno, paso 01 del proceso |
| `--ink-2` | `#4F4F4A` | texto secundario, leads |
| `--ink-3` | `#66665F` | etiquetas pequeñas (`.label`), placeholders — ≥4.5:1 sobre stone |
| `--line` | `rgb(26 26 24 / .10)` | separadores |
| `--line-2` | `rgb(26 26 24 / .18)` | bordes de campos y chips |
| `--red` | `#D8321F` | **solo acción**: CTA principal, foco, error, enlace activo/hover |
| `--red-2` | `#B8281A` | hover del CTA |
| `--glass-bg` | `rgb(255 255 255 / .58)` | relleno de cristal |
| `--glass-line` | `rgb(255 255 255 / .65)` | borde de cristal |

Estrategia: **neutros + un acento**. El rojo nunca decora: no en etiquetas, no en códigos, no en iconos informativos. El color de las imágenes (madera, ladrillo, cerámica) es el color de la web.

Luz: `body` lleva un `radial-gradient` blanco desde arriba (`120% 55% at 50% -12%`) — una sola fuente de luz, sin patrón.

## 3. Tipografía

| Rol | Fuente | Detalle |
|---|---|---|
| Display (`.display-1/2/3`) | **Poppins** 500 | `clamp(2rem, 5vw, 4.4rem)` / `clamp(1.65rem, 3vw, 2.7rem)` / `clamp(1.3rem, 1.8vw, 1.7rem)`; line-height 1.04–1.2; tracking −0.025 / −0.02 / −0.015em |
| Acento (`.accent`) | Poppins 400 *italic* | frases cortas: «para quién», «gratis» |
| Cuerpo | **Poppins** 400 | 16 px / 1.6; `.lead` `clamp(1.05rem, 1.35vw, 1.3rem)` en `--ink-2` |
| Títulos de tarjeta (`.title`) | Poppins 500 | tracking −0.015em |
| Etiquetas (`.label`) | Poppins 500 | 0.76 rem, mayúsculas, tracking 0.09em, `--ink-3` |
| Códigos (`.code`) | Poppins 500 | 0.78 rem, mayúsculas, tabular |

Una sola familia: Poppins 400/500/600 + itálica, cargada con `next/font/google` (`--font-poppins`), `display: swap`. Sin serif ni monoespaciada; la jerarquía se hace con peso (500 en display), tamaño y tracking negativo.

Medida: `.measure` = 66ch. Titulares con `text-wrap: balance`, párrafos `pretty`.

## 4. Forma y superficies

| Token | Valor |
|---|---|
| `--r-sm` | 12 px — campos, foco |
| `--r` | 20 px — tarjetas, láminas (`.plate`), pasos |
| `--r-lg` | 28 px — notas del hero, footer, menú móvil |
| `--pill` | 999 px — botones, chips, nav, etiquetas sobre imagen |

- `.glass` — cristal claro: `--glass-bg` + `backdrop-filter: blur(22px) saturate(150%)` + borde `--glass-line` + brillo interior `inset 0 1px 0 rgb(255 255 255 / .55)` + sombra `0 8px 30px rgb(26 26 24 / .12)`. Se usa **sobre imágenes**: nav, logo, notas del hero, etiquetas de las láminas, botón secundario del hero.
- `.glass-dark` — variante oscura (`rgb(26 26 24 / .42)`, texto blanco). Reservada para fotos muy claras si hiciera falta; hoy no se usa.
- `.card` — blanco, `--r`, `--shadow-soft`. Servicios, FAQ, formulario, footer, testimonios.
- `.plate` — lámina de imagen: `--r`, `overflow: hidden`, fondo `--stone-2` mientras carga. Siempre con `--shadow-soft`; al hover de una tarjeta, `--shadow-lift`.
- Sombras: `--shadow-soft: 0 10px 30px rgb(26 26 24 / .08), 0 1px 2px rgb(26 26 24 / .05)`; `--shadow-lift: 0 22px 50px rgb(26 26 24 / .14), 0 2px 6px rgb(26 26 24 / .06)`. Siempre con desplazamiento y desenfoque; nunca halo sin offset ni sombra dura.
- Scrim del hero (`.scrim-b`): `rgb(26 26 24 / .72) → .45 al 45 % → transparente al 85 %`, altura 80 % del hero. Garantiza el H1 blanco sobre cualquier frame.

## 5. Layout

- Contenedor: `--container: 1400px`, centrado; gutter `--gutter: clamp(16px, 4vw, 56px)`. El hero es la excepción: sus textos van al gutter, no al contenedor.
- Secciones: `py-16 md:py-24`; separadas por `border-t border-line`. Una idea por sección.
- Rejilla de 12 columnas para composiciones asimétricas: destacados `7 | 5` y `10` centrada (`col-start-2`); dos columnas `5 | 6 (start 7)` para texto + lámina o texto + formulario.
- Nav fija 72 px: tres burbujas de cristal (logo · enlaces · CTA rojo). En móvil: logo compacto + CTA `btn-sm` + hamburguesa; el menú abre una hoja de cristal `--r-lg`.
- Footer: una tarjeta `--r-lg` con cuatro columnas `1.2fr 1.5fr .9fr .9fr`.

## 6. Componentes

| Componente | Clases / notas |
|---|---|
| Botón primario | `.btn.btn-red` — píldora 48 px, sombra roja suave, hover eleva 1 px, active escala .985 |
| Botón secundario sobre imagen | `.btn.btn-glass` |
| Botón secundario sobre piedra | `.btn.btn-outline` (borde `--line-2`, hover invierte a ink) |
| Botón terciario | `.btn.btn-ink` |
| Chip / filtro | `.chip-pill`; `[aria-current]` invierte a ink |
| Campo | `.field` — 48 px, `--r-sm`, foco rojo (`0 0 0 4px rgb(216 50 31 / .12)`), `aria-invalid` borde rojo, error en `text-xs text-red` bajo el campo |
| Tarjeta de proyecto | `ProjectCard`: `.plate` con parallax + código del proyecto en `.glass.bubble.code` arriba-izq (única etiqueta sobre la imagen); título `.title` y `.label` debajo. Toda la tarjeta es el enlace |
| Mosaico de destacados | `.mosaic` (columnas CSS 1 / 2 / 3, gap 24–28) con `ProjectTile`: solo la imagen en `.plate` con parallax, sin código. Con hover, nota `.glass` `--r` inset 12 px que sube desde abajo (`.tile-note`, 500 ms expo) con `.title` + `.label` + flecha; sin hover (táctil), el mismo texto va bajo la lámina (`.tile-caption`). En móvil solo queda el primero de cada par (`max-sm:hidden`) |
| Lightbox | `LightboxProvider` + `LightboxItem` (`components/projects/Lightbox.tsx`): `<dialog>` nativo a pantalla completa, `::backdrop` ink al 88 % con blur 18, controles `.lightbox-btn` (cristal oscuro, 44/48 px), contador `.code`, pie en `.label` blanco 75 %. Flechas laterales en desktop, bajo la imagen en móvil; swipe, ← →, Esc y clic fuera cierran/navegan. Entrada `expo.out` 0.5 s, sin animación con reduced-motion |
| Nota del hero | `.glass` `--r-lg`, `display-2` + `.label` debajo (nunca encima: sin kickers) |
| FAQ | `<details>` en `.card`, icono + en círculo `--stone-2` que rota 45° |
| Proceso | 4 pasos en `--r`; el paso 01 invertido (`bg-ink text-stone`) con CTA; números en `.code` |
| Etiqueta de idioma | píldora con `.code`; activo invertido |

Iconos: SVG propios (`components/ui/Icon.tsx`), trazo 1.5, cajas 24. Sin emoji.

## 7. Movimiento

- **Un momento autor**: el hero. Autoplay 4 s del vídeo IM10 + scrub por scroll (`pin`, `end: +=350%`, `scrub: 0.6`) con cinco notas de cristal que entran/salen sin solaparse. Nada más se pina.
- **Entradas** (`Reveal`): todo lo que hay bajo el hero entra una sola vez con `expo.out`, 1.15 s, stagger 0.09. Marcas: `data-reveal="up|left|right|scale"` (`y: 44` / `x: ∓48` / `scale .96`). Sin marcas, entran los hijos directos.
- **Profundidad** (`Parallax`): las láminas escalan 1.08–1.10 y se desplazan ±4–5 % contra el scroll (`scrub: true`, `ease: none`).
- Micro: botones 220–260 ms con `--ease-out-expo` / `--ease-quint`; sombras 300–500 ms; hover de imagen `scale 1.03` en 700 ms.
- `prefers-reduced-motion`: sin pin, sin parallax, sin entradas; las notas del hero se listan bajo él (`.hero-beats-static`).
- Prohibido: bounce/elastic, animar width/height, entradas idénticas en bucle, movimiento sin causa.

## 8. Superficies del navegador

Selección `ink/stone`, caret rojo, `:focus-visible` rojo 2 px offset 3, scrollbar fina `--stone-3` sobre `--stone-2`, `underline-offset .18em`.

## 9. Reglas

**Sí**
- Rojo = acción. Cristal = sobre imagen. Blanco = tarjeta sobre piedra.
- Cada sección termina en una acción o un enlace.
- Etiquetas debajo del título, nunca encima.
- Imágenes siempre en `.plate` con radio y sombra; nunca a sangre salvo el hero.
- Copy en el idioma del cliente; nada inventado (testimonios, cifras) hasta que RAAR lo confirme.

**No**
- Fondos con patrón, cuadrículas, líneas de cota como decoración.
- Monoespaciada, kickers, iconos-emoji, sombras duras, radios < 12 px.
- Rojo en etiquetas, códigos o iconos informativos.
- Más de un pin de scroll por página.

## 10. Checklist antes de publicar (ui-ux-pro-max §1–§3)

- [x] Contraste ≥ 4.5:1 en texto (ink-3 sobre stone ≈ 5:1); H1 blanco sobre scrim ≥ 4.5:1
- [x] Foco visible; skip-link; `aria-current` en nav y filtros; formulario con labels visibles y errores junto al campo
- [x] Targets ≥ 44 px (botones 48, chips 36 + padding, hamburguesa 44)
- [x] Imágenes AVIF/WebP vía `next/image` con `sizes`; `aspect-ratio` reservado (CLS 0); lazy bajo el pliegue; poster del hero con `priority`
- [x] `prefers-reduced-motion` respetado en hero, parallax y entradas
- [x] 375 / 768 / 1024 / 1440 comprobados en capturas; contenedor 1400 en pantallas grandes
- [ ] Fotos reales de obra y testimonios cuando RAAR los aporte
- [ ] Logo en SVG (hoy PNG 1600 px con transparencia)
