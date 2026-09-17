# 04 · Plan de la nueva web: landing, hero scrollvideo y producción

**Estado:** plan sobre papel. Sin código.
**Base:** [`PRODUCT.md`](../PRODUCT.md) · [`03-critica-web-actual.md`](./03-critica-web-actual.md) · `content/` · `public/images/`
**Skills aplicados:** impeccable (init + shape, Persuade), copywriting, cro, marketing-psychology (principios), seo-audit, ai-seo, gsap-scrolltrigger.

---

## 0. Decisiones ya tomadas

| Decisión | Valor |
|---|---|
| Obra del hero | **IM10** — reforma + ampliación en Sarrià (Barcelona). Recorrido fachada → sala → cocina → comedor → oficina → dormitorio |
| Tipo de hero | Vídeo generado con IA (Seedance 2.5 o similar) desde los renders de IM10. Cámara tipo **dron que entra en la casa**. Primer tramo autoplay (3–4 s) para que haya movimiento sin tocar nada; el resto **scrubbed por scroll** con GSAP ScrollTrigger |
| Mensajes sobre el vídeo | **6 beats** (ver §3.2), uno por tramo de scroll |
| Longitud del pin del hero | **≤ 350 vh** (≈ 3.5 pantallas). Todo lo demás: scroll normal con reveals ligeros. **No** se meten los proyectos en el scrollvideo |
| Estructura | Landing + páginas: Proyectos, Servicios, Estudio, Contacto (+ legales). No es one-page |
| CTA principal | **Primera visita gratuita** |
| Pruebas disponibles | Fotos de obra terminada ✅ · Testimonios ✅ · Nombres/fotos de socios ❓ (no confirmado) |
| Idiomas | ES (default) · CA · EN |
| Dirección visual | **Pendiente** (ver §6). El hero funciona en cualquiera de las 4 |

---

## 1. Estrategia: a quién, qué debe creer, en qué orden

**Modo del surface:** Persuade. El visitante tiene que decidir y actuar (pedir visita).

**Quién llega:** propietario en Barcelona/área con una reforma integral u obra nueva en la cabeza. Compara 2–4 estudios. Llega por Google ("arquitectos reforma casa Sarrià"), Instagram o recomendación. Miedo real: equivocarse de arquitecto, obra eterna, sobrecostes, que "no me entiendan".

**Cadena de creencias que la landing debe construir, en este orden:**

1. *"Esto es un estudio de arquitectura de Barcelona que hace casas como la que quiero."* → hero: vídeo + H1 + subtítulo + CTA.
2. *"Quiero vivir ahí."* → el recorrido dron por IM10: deseo antes que argumento.
3. *"Han hecho esto de verdad, aquí cerca."* → proyectos destacados con **foto real** de obra terminada, municipios reales.
4. *"Hacen exactamente mi tipo de proyecto."* → servicios: reforma integral / obra nueva / rehabilitación con carácter.
5. *"Sé qué va a pasar si les llamo."* → proceso en 4 pasos, empezando por la visita gratuita.
6. *"Otros como yo quedaron contentos."* → testimonios reales con nombre y municipio.
7. *"Son personas, no un logo."* → los tres socios.
8. *"Mis dudas tienen respuesta."* → FAQ (precio, plazos, licencias, zona).
9. *"Es fácil dar el primer paso y no me compromete."* → formulario corto + visita gratuita + teléfono.

**Psicología aplicada (sin trucos):**
- *Deseo antes que razón:* el vídeo vende la sensación; los argumentos vienen después.
- *Reducción de miedo > promesa de belleza:* el proceso y la FAQ desactivan las objeciones que hoy impiden llamar.
- *Prueba local:* nombres de barrios y municipios reales (Sarrià, Gràcia, Sant Cugat, La Garriga, Gironès) = "trabajan donde yo vivo".
- *Compromiso mínimo:* "primera visita gratuita, sin compromiso" repetido en hero, mitad y final.
- *Autoridad silenciosa:* el vocabulario preciso de sus textos (medianeras, bóveda catalana, muros cardinales) transmite dominio sin presumir.
- *Nada inventado:* cero cifras, premios o clientes ficticios. Los huecos se dejan explícitos hasta que lleguen los datos.

---

## 2. Arquitectura de la web y menú

### 2.1 Menú actual → menú nuevo

| Actual | Problema | Nuevo |
|---|---|---|
| `01 : RAAR` | Es la home; el logo ya hace eso | **Logo** (→ home). Se elimina la entrada |
| `02 : Works` | Cripticos códigos, 2 clics para ver una obra | **Proyectos** (`/proyectos`), y además 3 destacados en la home (0 clics) |
| `03 : About us` | Sin nombres | **Estudio** (`/estudio`) |
| `04 : Contact us` | Formulario roto | **Contacto** como **botón CTA** en la nav: «Primera visita» (`/contacto`) |
| `ES` | Enlace vacío | Selector **ES · CA · EN** discreto, funcional |
| Icono Instagram | Ocupa la nav | Al footer |
| — | No existe | **Servicios** (`/servicios`) — necesario para SEO de intención comercial |

Nav final (desktop): `[logo]  Proyectos · Servicios · Estudio   [ES/CA/EN]  [ Primera visita gratuita ]`
Móvil: logo + botón CTA siempre visible + hamburguesa con las 3 entradas e idiomas.

La numeración `01 :` y los códigos de proyecto (`AR07`) se conservan como **rasgo de identidad dentro de las fichas y tarjetas**, no como etiquetas de navegación.

### 2.2 Mapa de páginas

```
/                       Landing (esta doc, §3–§4)
/proyectos              Parrilla 12 proyectos, filtros: tipo (obra nueva / reforma / rehabilitación) · municipio · estado
/proyectos/[slug]       Ficha: hero foto/render, ficha técnica, texto por bloques, galería, planos (lightbox), anterior/siguiente, CTA
/servicios              3 bloques: reforma integral · obra nueva · rehabilitación de naves y pisos con carácter (+ FAQ por servicio)
/estudio                Los tres socios, manifiesto (texto About), cómo trabajamos, dirección, mapa
/contacto               Formulario completo + tel/mail/WhatsApp + mapa + horario
/aviso-legal  /privacidad  /cookies
/ca/…  /en/…            Mismas rutas por idioma (hreflang, x-default → /)
```

Reducción de clics respecto a hoy: ver una obra pasa de 2 clics (menú → works → icono) a **0** (scroll en home) o **1** (tarjeta). Contactar pasa de 2 clics + formulario roto a **1 clic** desde cualquier página (botón nav) o **0** (tel/WhatsApp clicable en footer).

---

## 3. Hero scrollvideo — IM10

### 3.1 Concepto

**"Entrar en la casa."** Un plano continuo, como un dron pequeño y silencioso: llega desde el jardín, cruza la nueva fachada acristalada de la planta baja, atraviesa el salón, la cocina y el comedor, sigue el pasillo hasta el dormitorio y termina mirando otra vez al jardín. Es literalmente la tesis del proyecto IM10 ("abrir la casa al jardín") y la tesis del estudio (luz, materiales, continuidad interior-exterior).

Dos fases:

1. **Autoplay (0–4 s, sin scroll):** el dron se acerca por el jardín hacia la fachada. Mientras, H1 + subtítulo + CTA aparecen con un stagger. El visitante que no hace scroll ya ha visto movimiento, ya sabe qué es esto y ya tiene un botón. **Este es el 60 % de la venta.**
2. **Scroll-scrub (350 vh):** el scroll controla el avance del vídeo. Cada tramo revela un mensaje. Al final, el hero se despina y la página sigue con scroll normal.

Sin scroll → no se pierde nada esencial. Con scroll → recompensa.

### 3.2 Storyboard y mensajes (6 beats)

Tiempos sobre un máster de ~20 s / 480 frames a 24 fps. Los porcentajes son del pin (350 vh). El rango 0–4 s es autoplay; 4–20 s es scrub.

| # | Scroll | Plano (cámara) | Frames máster | Fuente Seedance | Mensaje en pantalla (ES) | Función |
|--:|---|---|---|---|---|---|
| 0 | carga | Estático → dron avanza sobre el césped hacia la fachada; la piscina pasa por debajo; la planta baja acristalada crece en el encuadre | 0–96 (autoplay) | `hero.jpg` (fachada 3840×2160) | **H1:** *Casas en Barcelona pensadas para durar.* **Sub:** *Reforma integral y obra nueva. Tres arquitectos, un proyecto a la vez.* **CTA:** [Pide tu primera visita gratuita] [Ver proyectos] · pista «desliza» | Qué es, dónde, qué hago |
| 1 | 0–15 % | El dron frena ante el umbral de vidrio; reflejo del jardín en el cristal; se ve el interior al fondo | 96–168 | transición `hero.jpg` → `render-01-sala.jpg` | *IM10 · Sarrià, Barcelona.* *Una casa de tres plantas que daba la espalda a su jardín.* | Problema (identificación) |
| 2 | 15–35 % | Cruza el umbral. Salón: luz lateral, techo bajo → alto, el jardín queda detrás a través del vidrio | 168–240 | `render-01-sala.jpg` | *Ampliamos la planta baja hacia el jardín.* *Ahora la luz entra, y el salón se abre.* | Gesto arquitectónico |
| 3 | 35–55 % | Giro suave hacia cocina y comedor; travelling lateral pegado a la isla | 240–312 | `render-02-cocina.png` → `render-03-comedor.png` | *Cocina, comedor y salón en un solo espacio continuo.* | Programa / cómo se vive |
| 4 | 55–75 % | Avanza por el pasillo; pasa junto al despacho; entra en el dormitorio principal, que mira al jardín | 312–408 | `render-04-oficina.png` → `render-05-habitacion-principal.png` | *Madera, piedra y luz. Materiales que respetan el origen de la casa.* | Materialidad (posicionamiento) |
| 5 | 75–100 % | El dron se detiene en el dormitorio y gira lentamente hacia la ventana/jardín; el plano se aquieta; sobre el frame final aparece la planta baja (`plan-01`) como línea fina | 408–480 | `render-05` + `plan-01-planta-baja.png` (overlay) | *¿Y tu casa?* **CTA:** [Pide tu primera visita gratuita] · *Sin compromiso. Barcelona y alrededores.* | Acción |

Reglas del texto sobre vídeo:
- Un mensaje a la vez; máximo 2 líneas; entra con fade + 12 px de desplazamiento, sale antes de que entre el siguiente. Nunca dos mensajes superpuestos.
- Zona de texto fija (p. ej. tercio inferior izquierdo) con un scrim degradado sutil para legibilidad sobre renders claros.
- El H1 del beat 0 es el único `<h1>` de la página y está en el DOM desde el servidor (SEO). Los beats 1–5 son `<p>` reales, no canvas.
- Beat 5 repite el CTA: quien ha hecho scroll hasta aquí está caliente.

### 3.3 Mecánica técnica (GSAP + Next.js)

**Decisión: secuencia de imágenes en `<canvas>`, no `<video currentTime>`.** Scrubbear `currentTime` de un `<video>` es irregular en Safari/iOS (busca keyframes, latencia, a veces se congela) y exige codificar todo-intra. Una secuencia de frames dibujada en canvas responde frame a frame, funciona igual en todos los navegadores y permite carga progresiva. Es el patrón "AirPods".

| Parámetro | Desktop | Móvil |
|---|---|---|
| Frames totales | 240 (máster 480 → 1 de cada 2) | 120 (1 de cada 4) |
| Resolución | 1920×1080 (canvas escala a viewport) | 810×1440 vertical (9:16) |
| Formato | WebP q75 (~45–60 KB) · AVIF si el pipeline lo permite | WebP q70 (~20 KB) |
| Peso total | ≈ 12 MB, **cargado progresivamente** | ≈ 2.5 MB |
| Primer render (LCP) | `poster.jpg` = frame 0 como `next/image priority`, 1600 px, < 120 KB | ídem 810 px |
| Carga | frames 0–96 con prioridad (autoplay); 97–240 en segundo plano con `fetch` + `createImageBitmap`; si un frame no ha llegado, se pinta el último disponible | ídem |

**Arquitectura del componente** (descripción, no código):

- `HeroScrollVideo` (client component) con `useGSAP` (`@gsap/react`) para limpieza automática.
- Estado: `{ frame: 0 }` → el objeto que GSAP tweena; en `onUpdate` dibuja `frames[Math.round(frame)]` en el canvas (`drawImage` con `object-fit: cover` manual).
- **Timeline 1 (autoplay):** `gsap.to(state, { frame: 96, duration: 4, ease: "none" })` + stagger de H1/sub/CTA con `power2.out`. Al terminar, deja el frame en 96.
- **Timeline 2 (scrub):** `gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "+=350%", pin: true, scrub: 0.6, anticipatePin: 1 } })`. Dentro: un tween `frame: 96 → 240` con `ease: "none"` (obligatorio para que scroll y vídeo vayan 1:1) y, en posiciones proporcionales, los tweens de entrada/salida de los 5 mensajes.
- **Un solo ScrollTrigger** para el hero (no uno por mensaje): los mensajes se colocan en la timeline con el parámetro de posición (`"<"`, `">-0.1"`, etiquetas). Evita desincronización y facilita `refresh()`.
- `gsap.matchMedia()`: variante desktop (16:9) / móvil (9:16) / `prefers-reduced-motion` (sin pin, poster estático, los 6 mensajes apilados como texto normal, CTA visible).
- `ScrollTrigger.refresh()` tras cargar fuentes y poster; `invalidateOnRefresh: true` en el pin.
- El canvas tiene `aria-hidden`; el contenido textual es real y accesible; un `<video>` MP4 corto (autoplay, muted, loop) puede servir de **fallback** para navegadores sin `createImageBitmap`.
- Nada más en la página se pina. Las secciones inferiores usan `ScrollTrigger.batch` para reveals (opacity + y) con `once: true`. Sin scroll-jacking adicional: es lo que satura.

**Presupuesto de rendimiento del hero:** LCP < 2.5 s (poster), CLS 0 (canvas con aspect-ratio reservado), INP < 200 ms, main-thread libre durante el autoplay (decodificación fuera del hilo con `createImageBitmap`).

### 3.4 Especificaciones del vídeo para producción (Seedance u otro)

**Máster:** 3840×2160 (o 1920×1080 upscaled a 4K), 24 fps, ~20 s, ProRes 422 o secuencia PNG. Movimiento continuo, sin cortes visibles, sin personas, sin texto dentro del vídeo.

**Estrategia de generación:** los modelos actuales generan clips de 5–12 s. Se producen **5 tramos** por image-to-video, cada uno arrancando del render correspondiente como frame inicial (y el siguiente render como frame final cuando el modelo lo permita), y se encadenan en montaje con un morph/dissolve corto en el punto de menor movimiento. Cámara lenta y constante (dron cinematográfico, gimbal), foco profundo, luz de media mañana coherente en todos los tramos.

Prompts base (en inglés, que es lo que mejor entienden los modelos de vídeo; ajustar al modelo):

```
T1 · exterior approach (from hero.jpg, 5 s)
Slow cinematic drone shot, low altitude, gliding forward over a lawn and a swimming pool toward a
three-storey Mediterranean house with terracotta roof, balconies and a fully glazed ground floor
opening onto the garden. Late-morning sun, soft shadows, gabion stone wall on the left. Camera moves
steadily toward the glass threshold, slight downward tilt, no people, no text, photorealistic
architectural visualization, 24fps, smooth stabilized motion.

T2 · threshold into living room (from hero.jpg → render-01-sala.jpg, 5 s)
Continuous forward camera move crossing a floor-to-ceiling sliding glass door into a bright open-plan
living room; garden reflections slide across the glass, then interior reveals: light wood, pale stone
floor, low sofa, diffuse daylight from the left. Slow, steady, cinematic, no cuts, no people.

T3 · living → kitchen/dining (from render-02-cocina.png → render-03-comedor.png, 4 s)
Slow lateral tracking shot along a kitchen island toward a dining table, continuous open space,
natural oak cabinetry, matte white surfaces, morning light through large garden windows. Steady
gimbal motion, shallow parallax, no people.

T4 · corridor → master bedroom (from render-04-oficina.png → render-05-habitacion-principal.png, 4 s)
Forward dolly through a calm corridor past a small home office, entering a master bedroom with a
large window onto the garden; linen bed, warm wood, soft daylight. Continuous motion, no cuts.

T5 · settle on the garden view (from render-05-habitacion-principal.png, 3 s)
Camera slows to a stop inside the bedroom and pans gently toward the window overlooking the garden
and trees; movement eases out to a near-still frame. Serene, photoreal, no people.
```

Post-producción: montaje y color en DaVinci Resolve; estabilización; upscale con Topaz Video AI si el máster sale a 1080p; **versión vertical 9:16** reencuadrando el máster con keyframes de pan (no un segundo render); exportación de frames:

```
ffmpeg -i master_4k.mov -vf "fps=12,scale=1920:-2" -q:v 3 frames/desktop/f_%03d.webp
ffmpeg -i master_vertical.mov -vf "fps=6,scale=810:-2" -q:v 3 frames/mobile/f_%03d.webp
ffmpeg -i master_4k.mov -vframes 1 -vf "scale=1600:-2" poster.jpg
```

(`fps=12` sobre 20 s ≈ 240 frames; `fps=6` ≈ 120.)

**Control de calidad de la IA:** revisar que no aparezcan geometrías imposibles (puertas que cambian, muebles que se derriten), que la luz sea coherente entre tramos y que la casa siga siendo IM10 (no "una casa parecida"). Si un tramo falla, regenerar solo ese tramo con más peso en la imagen de referencia. Reservar 2–3 iteraciones por tramo.

---

## 4. Secciones de la landing (debajo del hero)

Scroll normal. Cada sección: una idea, un CTA o un enlace. Reveals ligeros (fade + 24 px). Orden = cadena de creencias del §1.

### 4.1 Franja de contexto (inmediatamente bajo el hero)
- **Contenido:** una línea de texto + lista de municipios reales donde han trabajado: *Sarrià · Gràcia · Sant Cugat · La Garriga · Gironès*. Opcional: «Colegiados COAC» si se confirma.
- **Función:** prueba local + SEO geográfico. Sustituye a la típica barra de logos (no hay).
- **Animación:** marquee lento o simple lista; nada más.

### 4.2 Proyectos destacados
- **Contenido:** 3 tarjetas grandes, no 12. Selección por variedad de servicio y por tener **foto real**: p. ej. **VI02** (reforma entre medianeras, La Garriga), **AR07** (obra nueva, Sant Cugat), **MO07** (nave → vivienda, Barcelona). Cada tarjeta: imagen, nombre descriptivo (*Casa entre medianeras con patio vertical*), municipio, tipo, código pequeño (`VI_02`).
- **CTA:** «Ver los 12 proyectos» → `/proyectos`.
- **Toda la tarjeta clicable.** Hover: la imagen se desplaza 4 % + aparece el nombre del municipio; en táctil no hay overlay.

### 4.3 Servicios
- **Contenido:** 3 columnas → 3 párrafos cortos con «para quién» y enlace a `/servicios#…`:
  1. **Reforma integral** — pisos y casas con carácter (Gràcia, Eixample, Sarrià): bóveda catalana, patios, medianeras. *"Para quien quiere conservar lo que su casa tiene de bueno y arreglar el resto."*
  2. **Obra nueva** — casas unifamiliares en el Vallès y Girona, adaptadas a la topografía y la luz. *"Para quien tiene un terreno y quiere una casa que envejezca bien."*
  3. **Rehabilitación de naves y talleres** — vivienda, coliving, espacios híbridos. *"Para quien tiene un espacio raro y quiere vivir en él."*
- **CTA por columna:** «Cómo lo hacemos».

### 4.4 Cómo trabajamos (proceso)
- **Contenido:** 4 pasos horizontales (apilan en móvil):
  1. **Primera visita** — gratuita, en tu casa o solar. Escuchamos, medimos, te decimos si tiene sentido.
  2. **Estudio previo** — opciones, presupuesto orientativo y calendario realista.
  3. **Proyecto** — básico y ejecución, licencias, materiales.
  4. **Obra** — dirección de obra y control de costes hasta la entrega.
- **Función:** desactiva el miedo. Es el bloque que más falta hace hoy.
- **CTA:** «Empieza por la visita» → formulario.
- **Nota:** confirmar con RAAR las fases y qué incluye cada una. No inventar plazos ni precios.

### 4.5 Testimonios
- **Contenido:** 2–3 citas reales (existen) con nombre, municipio y proyecto. Si el cliente lo permite, foto de la obra terminada junto a la cita.
- **Formato:** cita grande, atribución pequeña. Sin carrusel automático (se lee mal); si hay más de 3, scroll horizontal manual.
- **Regla:** mientras no lleguen, la sección **no se publica**. Nada de placeholders.

### 4.6 El estudio (mini)
- **Contenido:** foto de los tres socios (o la cenital actual si no se pueden publicar caras) + 3–4 líneas del manifiesto (traducidas del About: «arquitectura que no necesita ostentación…») + nombres y titulación **si se confirman**.
- **CTA:** «Conoce al estudio» → `/estudio`.

### 4.7 Preguntas frecuentes
- **Contenido (borrador, confirmar respuestas con RAAR):**
  - ¿Cuánto cuesta un proyecto de arquitectura? (rango orientativo o «depende de…», con qué incluye)
  - ¿Cuánto dura una reforma integral? ¿Y una obra nueva?
  - ¿Os encargáis de las licencias y del ayuntamiento?
  - ¿Trabajáis fuera de Barcelona?
  - ¿Ya tengo constructor, puedo trabajar con vosotros?
  - ¿Qué pasa en la primera visita?
- **Función:** objeciones + GEO (schema `FAQPage`; respuestas de 40–60 palabras, directas).

### 4.8 CTA final + formulario
- **Titular:** *Empecemos por una visita.* **Sub:** *Gratuita y sin compromiso. Te decimos con sinceridad qué se puede hacer con tu casa.*
- **Formulario corto:** nombre · email · teléfono · municipio · tipo de proyecto (select: reforma / obra nueva / rehabilitación / no lo sé) · mensaje (opcional) · consentimiento RGPD. Botón: **«Pedir mi primera visita»**. Confirmación en pantalla + email.
- **Alternativas al lado:** teléfono `tel:` · WhatsApp (si lo usan) · email · dirección con mapa.

### 4.9 Footer
NAP completo (nombre, dirección, teléfono), Instagram, idiomas, legales, «© RAAR arquitectura» (adiós «UNTITLED»).

**Secciones descartadas a propósito:** logos de clientes (no hay), contador de cifras (no hay datos), blog (fase 2), «antes/después» (fase 2, cuando haya fotos reales emparejadas), carrusel de todos los proyectos (satura; están en `/proyectos`).

---

## 5. Copy: titulares, CTAs y metadatos

### H1 (hero) — opciones

| | Copy | Por qué |
|---|---|---|
| **A (recomendada)** | *Casas en Barcelona pensadas para durar.* | Qué (casas), dónde (Barcelona), diferenciador (durar = atemporal). 6 palabras |
| B | *Reformamos y construimos casas que envejecen bien.* | Servicios explícitos + promesa. Mejor SEO, menos poesía |
| C | *Tu casa, con la luz y los materiales que merece.* | Emocional, apela al propietario. Menos claro en «qué hacen» |

**Sub (con A):** *Reforma integral y obra nueva. Tres arquitectos, un proyecto a la vez.* — "un proyecto a la vez" comunica atención sin inventar cifras. Confirmar que es verdad.

### CTA principal — opciones

| | Copy | Nota |
|---|---|---|
| **A (recomendada)** | *Pide tu primera visita gratuita* | Verbo + qué obtiene + calificador. Baja fricción |
| B | *Cuéntanos tu proyecto* | Más neutro; peor si el usuario aún no tiene "proyecto" |
| C | *Reserva una visita* | Corto; pierde «gratuita» |

CTA secundario: *Ver proyectos*. En nav (botón): *Primera visita*.

### Metadatos (landing, ES)
- `<title>`: *RAAR arquitectura · Estudio de arquitectura en Barcelona — reforma integral y obra nueva*
- `description`: *Tres arquitectos en Barcelona. Reformas integrales y casas de obra nueva pensadas para durar: luz, materiales nobles y respeto por lo que tu casa ya tiene. Primera visita gratuita.*
- OG image: frame del hero con el logo.

### Voz
Serena, precisa, frases cortas, sin exclamaciones, sin «únicos/exclusivos/innovadores». Vocabulario real: medianeras, bóveda catalana, patio, planta baja, licencia, dirección de obra.

---

## 6. Dirección visual — DECISIÓN PENDIENTE

La ruleta de `impeccable` (seed `124f3575`, modo Persuade) asignó una dirección y repartió retadores. El hero scrollvideo funciona en las cuatro; cambia todo lo demás (color, tipografía, retícula, controles). **Hay que elegir antes de diseñar nada.**

| Opción | Mundo | Cómo se ve la landing | Riesgo honesto |
|---|---|---|---|
| **Libreta de obra** (asignada por la ruleta) | Papel cuadriculado blanco fino, grafito como tinta, lápiz rojo solo para CTA, cinta naranja de replanteo como marcador de sección. Vídeo/fotos = láminas pegadas a sangre. Mensajes del scroll como anotaciones/cotas a mano sobre el vídeo. Cada proyecto navegable por su código como dirección real | Tesis: *RAAR te acompaña hasta la obra, no solo hasta el render*. Refuta el portfolio blanco vacío. Raises tomados de los retadores descartados: 2 tamaños de tipo con jerarquía por caja/inversión; código = dirección de página; texto e imagen en la misma retícula; el siguiente CTA se ilumina antes de llegar | Si rojo/naranja dominan, lee «constructora». Grafito primero |
| **Estudio de luz solar** (mi favorita) | Carta solar, sombras que barren, gradiente del día (ámbar → blanco → azul) como color por sección; el scroll del hero = hora del día; etiquetas como marcas de azimut | Nace de sus textos («la luz como material»). Elegante y propio | Hero cálido con gradiente es un look frecuente; la diferencia está en el rigor del diagrama |
| **Vidriera de taller** (retadora competitiva) | Retícula de barras negras con paños de vidrio blanco; un paño cobalto se enciende = lo importante. Una frase por paño | Encaja con las naves de Gràcia (MO07, TO39). Muy claro | Las barras compiten con el vídeo a sangre; el hero debe ir sin retícula |
| **Portfolio blanco clásico** (salida estándar) | La convención del sector bien hecha. Variante lujo: serif monumental, fundidos lentos | Cero riesgo de extrañeza | Indistinguible de la competencia; es lo que ya tienen, mejor ejecutado |

Descartadas de la mano: Game Boy, teletexto, ASCII, bosque alienígena (pierden identificación y claridad para este cliente; sus disciplinas se han donado a la primera opción).

Cuando se elija: `/impeccable shape` cierra el brief con el contrato de dirección (tesis, mundo, primer viewport, forma) y se hacen comps del hero + 3 secciones antes de codificar.

---

## 7. SEO y GEO integrados desde el diseño

- Un `<h1>` por página, en el DOM del servidor. Beats del hero como `<p>` reales.
- `metadata` de Next.js por ruta e idioma; `alternates.languages` con self-reference; `sitemap.ts`, `robots.ts` (permitir GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
- JSON-LD: `ArchitectureFirm` (dirección, geo, teléfono, `founder` ×3 si se confirman, `areaServed`, `sameAs`) en layout; `CreativeWork` por proyecto (`locationCreated`, `dateCreated` cuando exista); `FAQPage` en la landing y en servicios; `BreadcrumbList` en fichas.
- Nombres descriptivos de proyecto en title/H1/URL (`/proyectos/casa-entre-medianeras-la-garriga-vi02`) o slug corto + nombre en H1 (decidir; recomiendo slug corto `vi02` + H1 descriptivo para no romper si el nombre cambia).
- Ficha técnica extraíble por proyecto (municipio, tipología, superficie, año, fase, servicios).
- `llms.txt` en raíz. Fechas visibles. Alt descriptivo en todas las imágenes (ya hay `alt_suggested` en `content/`).
- Google Business Profile + Search Console + Plausible/GA4 con consentimiento.

---

## 8. Qué hay que hacer para montar esto (plan de producción)

### 8.1 Pedir a RAAR (bloquea contenido)
- [ ] Confirmar **H1/sub** o dar la frase con la que ellos se describen.
- [ ] **Fotos de obra terminada**: de qué proyectos, en alta resolución, con permiso de los propietarios.
- [ ] **Testimonios**: texto, nombre, municipio, proyecto, permiso escrito.
- [ ] **Socios**: nombres, titulación, colegiación, fotos, ¿se publican?
- [ ] **Datos por proyecto**: nombre público, año, m², fase, servicios prestados. Resolver MO07/MO23. Contenido de GV75/SE08/PR37/GR16.
- [ ] **Proceso**: qué incluye cada fase, qué pasa en la primera visita, ¿hay coste en algún paso?
- [ ] **FAQ**: respuestas reales a las 6 preguntas del §4.7.
- [ ] **Logo en SVG**. Favicon. Razón social, CIF, dirección fiscal (aviso legal).
- [ ] Perfiles reales de LinkedIn/Facebook o eliminarlos. ¿Usan WhatsApp con clientes?
- [ ] Aprobación para usar IM10 como hero y para generar vídeo con IA a partir de sus renders (derechos del render, permiso del propietario si la casa es identificable).

### 8.2 Vídeo hero (pipeline IA)
1. [ ] Preparar keyframes: los 6 renders de IM10 limpios y **upscaled a 4K** (Topaz Photo AI / Magnific) con la misma temperatura de color.
2. [ ] Generar los 5 tramos con Seedance 2.5 (o Kling/Veo/Runway como plan B) con los prompts del §3.4, image-to-video, 2–3 iteraciones por tramo. Fijar seed cuando salga bien.
3. [ ] Montaje en Resolve: encadenar, dissolves en puntos de baja velocidad, color unificado, estabilizar, exportar máster 4K 24 fps ProRes.
4. [ ] Versión **vertical 9:16** reencuadrando el máster (keyframes de pan). Sin regenerar.
5. [ ] Extraer frames con ffmpeg (§3.4): 240 desktop WebP 1920 px, 120 móvil WebP 810 px, poster 1600 px. Comprobar peso total (≤ 12 MB / ≤ 2.5 MB).
6. [ ] MP4/WebM corto (autoplay loop, 4 s, < 1 MB) como fallback.
7. [ ] QA visual: geometrías coherentes, luz continua, ningún artefacto en frames que coinciden con un mensaje.

### 8.3 Diseño
1. [ ] **Elegir dirección visual** (§6) → `/impeccable shape` para cerrar el contrato.
2. [ ] Comps: hero (frame 0, frame con mensaje, frame final) + proyectos destacados + proceso + formulario. Desktop y móvil.
3. [ ] Tokens: color, tipografía (2 tamaños de display + cuerpo), espaciado, retícula. → `DESIGN.md` al terminar la build.
4. [ ] Iconos mínimos (tel, mail, WhatsApp, flecha, idiomas). Sin Font Awesome.

### 8.4 Desarrollo (cuando se decida empezar)
1. [ ] Rutas App Router por idioma (`/[locale]/…`), `next-intl` o equivalente, `hreflang`.
2. [ ] Capa de contenido: leer `content/*.md` con gray-matter (o migrar a MDX / CMS si RAAR quiere editar).
3. [ ] Pipeline de imágenes: script con `sharp` que convierte `public/images/` (273 MB) a AVIF/WebP en 3 tamaños; los GIFs de 30–56 MB → MP4/WebM con ffmpeg o SVG animado. Objetivo < 1.5 MB por página.
4. [ ] `gsap` + `@gsap/react`; `HeroScrollVideo` según §3.3; `matchMedia` para móvil y reduced-motion; `ScrollTrigger.batch` para reveals.
5. [ ] Formulario: Server Action + Resend (o Formspree) + validación + honeypot/Turnstile + email de confirmación + RGPD.
6. [ ] SEO: `metadata`, `sitemap.ts`, `robots.ts`, JSON-LD, OG image por ruta, `llms.txt`.
7. [ ] Analítica con consentimiento; página 404; legales.
8. [ ] Deploy en Vercel; dominio `raar-arquitectura.eu`; redirecciones 301 de las URLs viejas (`/works.html` → `/proyectos`, `/worksvi02.html` → `/proyectos/vi02`, etc.).
9. [ ] QA: Lighthouse móvil > 90, LCP < 2.5 s, CLS 0, test del hero en iOS Safari, Android Chrome, con y sin reduced-motion.

### 8.5 Orden recomendado
1. Pedir datos a RAAR (8.1) — en paralelo con 2 y 3.
2. Producir el vídeo hero (8.2) — es la tarea más larga e incierta; empezar ya.
3. Elegir dirección visual y hacer comps (8.3).
4. Traducir contenido ES/CA (el original está en EN).
5. Desarrollar (8.4).
6. Publicar landing + proyectos + contacto; servicios y FAQ pueden ir en una segunda entrega si faltan respuestas.

---

## 9. Riesgos y cómo se cubren

| Riesgo | Mitigación |
|---|---|
| El vídeo IA no mantiene la geometría de IM10 | Tramos cortos, image-to-video con frame inicial y final, iteraciones por tramo; plan B: recorrido 3D sencillo con los renders como texturas o un montaje de renders con parallax (Ken Burns 2.5D) |
| Hero pesado en móvil | 120 frames a 810 px, carga progresiva, poster como LCP, fallback MP4 |
| Scroll-jacking molesta | Un solo pin de ≤ 350 vh, `scrub: 0.6`, nada más pinado, botón «saltar» discreto que hace scroll al final del hero |
| No llegan fotos reales / testimonios | Las secciones 4.2 usan renders con etiqueta «Render» honesta; 4.5 no se publica hasta tenerlos |
| Socios no quieren aparecer | Foto de grupo sin caras + nombres o solo «tres arquitectos»; el JSON-LD omite `founder` |
| Dirección visual demasiado «obra» o demasiado «gradiente» | Comps del hero + 2 secciones antes de codificar; ajuste de paleta ahí, no en producción |
| Traducciones mediocres | Traducción humana o revisión por RAAR; nunca solo automática para la landing |
