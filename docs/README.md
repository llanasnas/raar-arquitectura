# Documentación — rediseño web RAAR arquitectura

Snapshot y análisis de https://www.raar-arquitectura.eu (14 sep 2026), base para la nueva web en Next.js.

| Doc | Qué contiene |
|---|---|
| [01 · Cómo funciona la web actual](./01-como-funciona-la-web-actual.md) | Stack, mapa de páginas, anatomía de cada plantilla, sistema visual, flujo de usuario, qué conservar |
| [02 · Inventario de contenido y assets](./02-inventario-contenido-y-assets.md) | Dónde está cada cosa en el repo, tabla de proyectos, recuento de textos, 76 imágenes con mapa original → nuevo, referencias rotas, assets que faltan |
| [03 · Por qué la web actual no funciona](./03-critica-web-actual.md) | Crítica: posicionamiento/hero, CTAs, SEO, GEO, rendimiento, E-E-A-T, UX, errores, legal, idiomas. Priorización y objetivos medibles |
| [04 · Plan: landing, hero scrollvideo y producción](./04-plan-landing-hero-scrollvideo.md) | Estrategia de venta, menú nuevo, mapa de páginas, storyboard del hero IM10 (6 beats), mecánica GSAP, specs y prompts del vídeo IA, secciones de la landing con copy, dirección visual (pendiente), checklist de producción |
| [05 · Reunión con el cliente](./05-reunion-cliente-preguntas.md) | Lista larga de dudas (referencia interna): qué asumí, qué bloquea publicar, material a pedir |
| [`cuestionario-raar.html`](./cuestionario-raar.html) | **Para la reunión.** 31 preguntas de negocio con inputs, «i» con el porqué de cada una, selector de estilo visual (8 mockups de su web, ampliables) y de color corporativo; «Enviar» descarga un PDF con las respuestas. Autónomo (fuentes, logo, imágenes y jsPDF embebidos): funciona sin conexión con doble clic. Se genera con `node scripts/build-cuestionario.mjs` a partir de `cuestionario-raar.template.html` y `cuestionario-mocks.html` |
| [`../PRODUCT.md`](../PRODUCT.md) | Verdad de producto para `impeccable` (usuarios, propósito, posicionamiento, evidencia, principios) |
| [`../DESIGN.md`](../DESIGN.md) | Sistema visual construido: «vidrio y piedra» (tokens, tipografía, cristal, radios, motion, reglas) |
| [`original-site/`](./original-site/) | HTML de las 12 páginas, CSS y JS originales, `asset-map.json`, `image_inventory.json`, `download_report.json` |

Contenido estructurado (textos + frontmatter) en [`../content/`](../content/README.md). Imágenes en [`../public/images/`](../public/images/).
