// Batched screenshot round for the finish review.
//   node scripts/shots.mjs [baseUrl] [outDir]
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3010";
const out = process.argv[3] ?? "shots";
mkdirSync(out, { recursive: true });

const exe = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath: exe, headless: true });

const viewports = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

const pages = ["/", "/proyectos", "/proyectos/vi02", "/servicios", "/estudio", "/contacto"];

for (const [name, vp] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor, isMobile: vp.isMobile, hasTouch: vp.hasTouch });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  for (const path of pages) {
    const slug = path === "/" ? "home" : path.replace(/\//g, "_").replace(/^_/, "");
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(path === "/" ? 5200 : 800); // let the hero intro play
    await page.screenshot({ path: join(out, `${name}-${slug}-top.png`) });
    if (path === "/") {
      // hero scrub states: 30 %, 60 %, 95 % of the pin distance, then just past it
      const h = vp.height;
      for (const f of [0.3, 0.6, 0.95, 1.25]) {
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(h * 3.5 * f));
        await page.waitForTimeout(900);
        await page.screenshot({ path: join(out, `${name}-home-hero-${Math.round(f * 100)}.png`) });
      }
      await page.evaluate(() => window.scrollTo(0, 0));
    }
  }
  await ctx.close();

  // static pass (reduced motion): full pages without reveal/pin artifacts
  const ctx2 = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: vp.isMobile, hasTouch: vp.hasTouch, reducedMotion: "reduce" });
  const page2 = await ctx2.newPage();
  for (const path of pages) {
    const slug = path === "/" ? "home" : path.replace(/\//g, "_").replace(/^_/, "");
    await page2.goto(base + path, { waitUntil: "networkidle" });
    // force lazy images in
    await page2.evaluate(async () => { window.scrollTo(0, document.body.scrollHeight); await new Promise(r => setTimeout(r, 600)); window.scrollTo(0, 0); });
    await page2.waitForTimeout(600);
    await page2.screenshot({ path: join(out, `${name}-${slug}-full.png`), fullPage: true });
  }
  await ctx2.close();
  console.log(name, "errors:", errors.length ? errors : "none");
}
await browser.close();
console.log("done →", out);
