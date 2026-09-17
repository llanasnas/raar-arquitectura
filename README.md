# RAAR arquitectura — nueva web

Rediseño de https://www.raar-arquitectura.eu en Next.js 16 (App Router, React 19, Tailwind 4, GSAP, pnpm).

## Estado

**Fase 1 — build funcional (ES).** Landing con hero scrollvideo, proyectos, fichas, servicios, estudio, contacto con formulario, legales, SEO/JSON-LD, sitemap y robots.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
node scripts/shots.mjs http://localhost:3000 shots   # capturas desktop + móvil (Chrome local)
```

| Carpeta | Contenido |
|---|---|
| [`DESIGN.md`](./DESIGN.md) | Sistema visual «vidrio y piedra»: tokens, tipografía, superficies, motion, reglas |
| [`PRODUCT.md`](./PRODUCT.md) | Verdad de producto (usuarios, propósito, posicionamiento, evidencia) |
| [`docs/`](./docs/README.md) | Análisis de la web antigua, crítica, plan de landing/hero, snapshot original |
| [`content/`](./content/README.md) | Textos de proyectos (EN original + `es/` traducciones), páginas, `site.json` |
| [`lib/copy.ts`](./lib/copy.ts) | Todo el copy de la interfaz (ES). Preparado para CA/EN |
| [`lib/content.ts`](./lib/content.ts) | Loader de proyectos (gray-matter) |
| [`components/hero/HeroScrollVideo.tsx`](./components/hero/HeroScrollVideo.tsx) | Hero: 240 frames en canvas, autoplay 4 s + scrub GSAP ScrollTrigger |
| [`public/hero/`](./public/hero/) | Frames WebP desktop (1600 px) y móvil (900×1200) + posters |
| [`public/images/`](./public/images/) | Imágenes optimizadas (15 MB); originales en `assets-src/` (gitignored) |
| [`scripts/`](./scripts/) | `hero/generate-hero-video.mjs` (Seedance 2.5 vía fal.ai), `hero/extract-frames.mjs`, `optimize-images.mjs`, `shots.mjs` |

## Variables de entorno (`.env.local`)

| Variable | Uso |
|---|---|
| `FAL_KEY` | Generación del vídeo del hero (solo scripts) |
| `RESEND_API_KEY` | Envío del formulario. Sin ella, el lead se escribe en el log del servidor |
| `CONTACT_TO`, `CONTACT_FROM` | Destinatario y remitente del formulario (por defecto `arquitectura@raar-arquitectura.eu`) |
| `NEXT_PUBLIC_SITE_URL` | Dominio canónico (por defecto `https://www.raar-arquitectura.eu`) |

## Pendiente

- Datos de RAAR: nombres/fotos de socios, fotos de obra terminada, testimonios, año/m²/fase por proyecto, MO07 vs MO23, GV75/SE08/PR37/GR16, logo SVG, razón social para legales.
- Idiomas CA y EN (estructura preparada; hoy solo ES).
- Resend configurado y probado en producción; analítica con consentimiento.
- Redirecciones 301 desde las URLs antiguas (`/works.html` → `/proyectos`, `/worksvi02.html` → `/proyectos/vi02`…).
- Vídeo del hero: el máster actual es 720p (12 s, Seedance 2.5, $5.68). Para más nitidez en desktop: regenerar a 1080p (~$12.50) o upscale con Topaz.
