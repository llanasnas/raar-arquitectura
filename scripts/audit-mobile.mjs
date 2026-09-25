// Revisión móvil de toda la web: desbordes horizontales, texto demasiado pequeño, zonas de toque
// pequeñas y errores de consola, más una captura de página entera por ruta (390 y 1440).
//   node scripts/audit-mobile.mjs [baseUrl] [outDir]
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3010";
const out = process.argv[3] ?? "shots/audit";
mkdirSync(out, { recursive: true });

const exe = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath: exe, headless: true });

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
paths.push("/no-existe", "/aviso-legal", "/privacidad", "/cookies");

const viewports = {
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  desktop: { viewport: { width: 1440, height: 900 } },
};

for (const [name, opts] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ ...opts, deviceScaleFactor: 1, reducedMotion: "reduce" });
  // saltar la apertura y el aviso de cookies en las capturas
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem("raar:intro", "1");
      localStorage.setItem("raar:consent", JSON.stringify({ v: 1, analytics: false, at: Date.now() }));
    } catch {}
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`${page.url()} ${e}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`${page.url()} ${m.text()}`));

  for (const path of paths) {
    const slug = path === "/" ? "home" : path.replace(/\//g, "_").replace(/^_/, "");
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    const report = await page.evaluate(() => {
      const doc = document.documentElement;
      const vw = doc.clientWidth;
      const wide = [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          if (!r.width) return false;
          // lo que vive dentro de una caja con scroll propio (tablas, cintas) no cuenta
          for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            const o = getComputedStyle(p).overflowX;
            if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") return false;
          }
          return r.right > vw + 1 || r.left < -1;
        })
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`);
      const tiny = [...document.querySelectorAll("p, li, a, span, dd, dt, td, summary, label")]
        .filter((el) => el.childElementCount === 0 && el.textContent.trim().length > 2 && el.offsetParent)
        .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 11)
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}:${el.textContent.trim().slice(0, 24)}`);
      const taps = [...document.querySelectorAll("a, button, summary, input, select, textarea")]
        .filter((el) => el.offsetParent)
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.height < 20 && r.width < 20;
        })
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}:${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 20)}`);
      // html lleva overflow-x: clip, así que scrollWidth no delata nada: se mide el contenido
      const contentW = Math.max(...[...document.body.children].map((el) => el.scrollWidth));
      return { scrollW: Math.max(doc.scrollWidth, contentW), vw, wide, tiny, taps, h1: document.querySelectorAll("h1").length };
    });
    const flags = [];
    if (report.scrollW > report.vw) flags.push(`scroll-x ${report.scrollW}>${report.vw}`);
    if (report.wide.length) flags.push(`wide ${report.wide.join(" ")}`);
    if (report.tiny.length) flags.push(`tiny ${report.tiny.join(" | ")}`);
    if (report.taps.length) flags.push(`taps ${report.taps.join(" | ")}`);
    if (report.h1 !== 1) flags.push(`h1=${report.h1}`);
    console.log(`${name} ${path} ${flags.length ? flags.join(" · ") : "ok"}`);
    await page.screenshot({ path: join(out, `${name}-${slug}.png`), fullPage: true });
  }
  console.log(name, "errores:", errors.length ? errors : "ninguno");
  await ctx.close();
}
await browser.close();
