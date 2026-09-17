---
slug: /
original_file: index.html
title_original: "RAAR arquitectura"
meta_description_original: "description"
nav_label: "01 : RAAR"
hero:
  background: /images/home/hero-space.jpg
  background_description: "Imagen 1920x1080 casi negra con puntos blancos diminutos (cielo estrellado / 'space'). Se mueve con parallax al mover el ratón (movingBackgroundImage)."
  logo_overlay: /images/brand/logo-white.png
  h1: "We design,"
  typed_words: ["DREAMS", "ETERNITY", "ATEMPORALITY", "ARCHITECTURE"]
  typed_config: { typeSpeed: 100, backSpeed: 20, loop: true }
  height: 100vh
  cta: null
sections_below_hero: []
---

# Home — contenido íntegro de la página original

La home es **solo un hero a pantalla completa**. No hay nada debajo salvo el footer.

## Texto visible

- H1: `We design,`
- H3 (efecto máquina de escribir, en bucle infinito): `DREAMS` → `ETERNITY` → `ATEMPORALITY` → `ARCHITECTURE`
- Logo blanco RAAR alineado a la derecha, al 30 % de ancho.
- Footer: `© UNTITLED | Website created by RAAR`

## Lo que NO hay

- Ninguna frase que diga qué es RAAR (estudio de arquitectura en Barcelona).
- Ningún CTA (ver proyectos / contactar).
- Ningún proyecto destacado, ningún servicio, ninguna prueba social.
- Ningún texto indexable más allá de 5 palabras.

## Comportamiento

1. Al cargar: `type()` inicializa Typed.js sobre `#typed` con los strings de `#typed-strings`.
2. `movingBackgroundImage()`: al mover el ratón sobre `.hero-full-container` aplica `translate3d(-1.5·x/5, -1.5·y/5, 0)` → parallax sutil.
3. Nav fija transparente arriba; en móvil colapsa en hamburguesa (Bootstrap 3).
