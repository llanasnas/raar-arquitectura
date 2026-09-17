# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primario:** propietarios particulares en Barcelona y su área (Sarrià, Gràcia, Sant Cugat, La Garriga, Vallès, Gironès) que van a hacer una **reforma integral** de su casa o piso, o a **construir una casa unifamiliar**. Presupuesto de obra alto (seis cifras). Están comparando 2–4 estudios, llegan por Google, Instagram o recomendación, y necesitan decidir a quién llamar primero. Estado de ánimo: ilusión + miedo a equivocarse (plazos, licencias, sobrecostes, "que no me entiendan").

**Secundario (confirmado por el portfolio):** propietarios de naves/talleres industriales que quieren convertirlos en vivienda o espacio híbrido (TO39, MO07); grupos que quieren un cohousing/coliving (CO38).

Idiomas del usuario: español y catalán primero; inglés para compradores internacionales en la zona.

## Product Purpose

Web del estudio **RAAR arquitectura** (Barcelona). Debe convertir visitas en **solicitudes de primera visita gratuita** de clientes cualificados. Éxito = el visitante entiende en 5 segundos qué hace RAAR, ve una obra que le hace pensar "quiero esto en mi casa", cree que pueden hacerlo, y pide la visita sin fricción.

La web actual (https://www.raar-arquitectura.eu) no cumple nada de eso: hero sin mensaje, 0 CTAs, formulario roto, sin SEO. Ver `docs/03-critica-web-actual.md`.

## Positioning

Estudio de tres socios, formado en Barcelona, que hace **arquitectura atemporal**: gestos sutiles, materiales nobles (madera, cerámica, ladrillo, hormigón), luz natural como material, y respeto por lo preexistente (bóveda catalana, medianeras, estructura industrial, topografía). Especialidad demostrable: **transformar tipologías catalanas características** (piso de Gràcia, casa entre medianeras, nave industrial, casa de tres niveles en Collserola) sin borrar su carácter. Primera visita gratuita como puerta de entrada.

Lo que un vecino no puede copiar literalmente: los 8 proyectos con su lectura (patio vertical en VI02, muros cardinales en AR07, horizontalidad en CO38) y los diagramas conceptuales animados propios.

## Operating Context

- Primer contacto: **primera visita / consulta gratuita** (confirmado). Después: estudio previo → anteproyecto → proyecto básico → ejecución → dirección de obra (fases estándar; RAAR no las ha nombrado aún).
- Dirección: C/ Bruc 136 bajos 2a, Barcelona. Tel +34 93 488 02 56. arquitectura@raar-arquitectura.eu. Instagram @raar.arquitectura.
- Los proyectos se identifican por código (AR07, CO38…) + municipio + tipo (New build / Rebuild). Cada uno tiene: texto largo en inglés, 1–6 renders, planos, y en 5 casos un GIF conceptual (topografía → volúmenes → planta).
- Obra hero decidida: **IM10** (reforma + ampliación en Sarrià, Barcelona). Recorrido: fachada → sala → cocina → comedor → oficina → habitación principal. El vídeo se generará con IA (Seedance 2.5 o similar) a partir de sus renders.

## Capabilities and Constraints

- Stack: Next.js 16 App Router, React 19, Tailwind 4, pnpm. Animación: GSAP (ScrollTrigger). Vídeo scroll-driven en el hero.
- Multiidioma ES (default) / CA / EN con hreflang. Todo el contenido debe existir en los tres.
- Formulario funcional con consentimiento RGPD; aviso legal, privacidad, cookies obligatorios (España).
- Assets actuales: 273 MB sin optimizar; GIFs de 31–56 MB inservibles tal cual. Presupuesto de peso objetivo: < 1.5 MB por página + vídeo hero por streaming.
- Terminología: "reforma integral", "obra nueva", "rehabilitación", "entre medianeras", "bóveda catalana", "primera visita".
- **Undecided:** nombre público de cada proyecto (hoy solo códigos); confirmar MO07 vs MO23; año, m² y fase de cada proyecto; contenido de GV75/SE08/PR37/GR16; si se publican nombres y fotos de los socios.

## Brand Commitments

- Nombre: **RAAR arquitectura**. Logo: wordmark "RAAR" con las letras partidas por una franja horizontal + "arquitectura" pequeño; versiones negra y blanca en PNG (`public/images/brand/`). Pedir SVG.
- Voz confirmada por los textos existentes: serena, precisa, sin exclamaciones, vocabulario arquitectónico concreto. No hype.
- Rasgos incumbentes (no vinculantes, evidencia): monocromo blanco/negro, Roboto Mono, numeración `01 :`, códigos de proyecto tipo `AR_07`, marco fino en el viewport.
- Instagram real: https://www.instagram.com/raar.arquitectura/

## Evidence on Hand

- 8 proyectos documentados: texto completo (EN), renders, planos → `content/projects/*.md`, `public/images/projects/`.
- 3 GIFs conceptuales grandes (GG01, TO39, CO38) + 2 pequeños (AR07, MO07): la **idea** del diagrama animado es reutilizable.
- **Fotos de obra terminada: existen** (confirmado por el usuario), aún no están en el repo. Se desconoce de qué proyectos.
- **Testimonios de clientes: existen** (confirmado), aún no están en el repo. Sin nombres todavía.
- Nombres, fotos y credenciales de los 3 socios: **no confirmados**. No inventar.
- No existen: premios, prensa, cifras (n.º proyectos, años, m²), publicaciones. No inventar.

## Product Principles

1. **La obra vende, el estudio firma.** Cada pantalla debe mostrar arquitectura real de RAAR antes que hablar de RAAR.
2. **Una decisión por viewport.** Cada tramo de scroll responde a una pregunta del cliente (¿qué hacen? ¿lo han hecho ya? ¿cómo trabajan? ¿qué hago ahora?) y termina en una acción.
3. **Especificidad local.** Nombres de barrios, tipologías y materiales catalanes reales; nunca "espacios únicos" genéricos.
4. **Serenidad con energía.** La voz es calmada; la web no puede ser aburrida ni negra-vacía como la actual.
5. **Nada inventado.** Sin testimonios, cifras ni fotos que no existan; huecos explícitos hasta que lleguen.
