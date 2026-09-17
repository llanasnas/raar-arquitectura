---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/layout.tsx"]
---

# Surface brief — Landing (app/page.tsx)

Scope: home landing + shared shell (nav, footer) inherited by Proyectos / Servicios / Estudio / Contacto. Visitor mode: Persuade.
Audience: propietario en Barcelona/área con reforma integral u obra nueva en mente; compara estudios. Job: entender qué hace RAAR, desear la casa, creer que pueden, pedir primera visita gratuita.
Action: «Pide tu primera visita gratuita» (nav + hero + hero end + form). Proof on hand: 8 proyectos con renders/planos/textos; fotos de obra y testimonios existen pero no están en repo (huecos explícitos).
Constraints (user-pinned, 2026-09-14): esquinas redondeadas y botones píldora; sin fondo cuadriculado; cristal con blur en logo/menú/notas del hero (fondo visible, texto legible); parallax en láminas; entradas slide para textos e imágenes tras el hero; contenedor máximo en pantallas grandes; fuente acorde a arquitectura. Hero = vídeo IM10 dron (autoplay 4 s + scrub ≤350vh); resto scroll normal; ≤1.5 MB/página; reduced-motion sin pin.

## Direction contract

THESIS: la obra se ve siempre; la interfaz se apoya sobre ella como el vidrio de sus fachadas. Refusa el portfolio blanco de sans fina y bordes rectos, y refusa la libreta cuadriculada anterior (sustituida a petición del cliente).

OWN-WORLD: piedra clara (#F2F2EF) con una sola luz radial desde arriba; tinta #1A1A18; rojo #D8321F solo para acción. Cristal: blanco 58 % + blur 22 px + borde blanco 65 % + brillo interior. Radios 12/20/28 y píldora. Poppins en todo: display 500 con tracking negativo, cuerpo 400, itálica para acentos; etiquetas mayúsculas con tracking .09em; sin serif ni monoespaciada. Láminas .plate con sombra suave y parallax; tarjetas blancas .card. Iconos SVG trazo 1.5.

STORY: llega frío → ve la casa moverse y lee «Casas en Barcelona pensadas para durar» (Poppins 500 blanca sobre scrim) → desea IM10 (notas de cristal sobre el vídeo) → entiende (municipios, 3 láminas con parallax) → identifica su servicio (3 tarjetas) → ve los 4 pasos (el 01 invertido, gratis) → conoce a los socios → resuelve dudas (FAQ en tarjetas) → pide la visita.

FIRST VIEWPORT: canvas 100svh a sangre con frame 0 de IM10 avanzando solo. Tres burbujas de cristal arriba: logo izq, Proyectos·Servicios·Estudio centro, CTA rojo der. Tercio inferior izquierdo: H1 Poppins 500 en 2 líneas, sub, botón rojo + botón cristal. Hint «Desliza para entrar» abajo. Scrim 72→45→0 en el 80 % inferior.

FORM: Vidrio y piedra — mundo pinned por el cliente tras revisar «Libreta de obra» (seed 124f3575, direction, persuade); el brief gana al roll. Raises conservados: 2 tamaños de display; código de proyecto como dirección de página; el CTA siguiente aparece antes de llegar.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
