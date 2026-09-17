// Builds docs/cuestionario-raar.html (self-contained questionnaire for the client meeting)
// from docs/cuestionario-raar.template.html: embeds Poppins, jsPDF, logo, backdrop, the four
// stub thumbnails and eight style mockups rendered from docs/cuestionario-mocks.html.
//   node scripts/build-cuestionario.mjs
// Needs assets-src/cuestionario/{Poppins-Regular.ttf,Poppins-Medium.ttf,jspdf.umd.min.js}
// (Poppins: github.com/google/fonts/tree/main/ofl/poppins · jsPDF 3.0.1 UMD from cdnjs).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { chromium } from "playwright-core";

const ROOT = process.cwd();
const A = resolve(ROOT, "assets-src/cuestionario");
for (const f of ["Poppins-Regular.ttf", "Poppins-Medium.ttf", "jspdf.umd.min.js"]) {
  if (!existsSync(resolve(A, f))) throw new Error(`Falta ${f} en assets-src/cuestionario/`);
}
const b64 = (buf, mime) => `data:${mime};base64,${buf.toString("base64")}`;

const logoSrc = "public/images/brand/logo-black.png";
const meta = await sharp(logoSrc).metadata();
const logo = b64(await sharp(logoSrc).resize({ width: 900 }).png({ compressionLevel: 9 }).toBuffer(), "image/png");
const logoPdf = b64(await sharp(logoSrc).resize({ width: 1200 }).png().toBuffer(), "image/png");
const bg = b64(await sharp("public/images/projects/im10/hero.jpg").resize({ width: 1600 }).jpeg({ quality: 55 }).toBuffer(), "image/jpeg");
const stubs = {};
for (const id of ["gv75", "se08", "pr37", "gr16"]) {
  stubs[id] = b64(await sharp(`public/images/projects/${id}/thumb.jpg`).resize({ width: 220, height: 220, fit: "cover" }).jpeg({ quality: 70 }).toBuffer(), "image/jpeg");
}

// style mockups: same mini-home in eight styles, screenshot per block
const P = pathToFileURL(resolve(ROOT, "public/images")).href + "/";
const mocks = readFileSync("docs/cuestionario-mocks.html", "utf8")
  .replaceAll("url(BG)", `url(${P}projects/im10/hero.jpg)`).replaceAll('src="BG"', `src="${P}projects/im10/hero.jpg"`)
  .replaceAll('src="LOGO"', `src="${P}brand/logo-black.png"`).replaceAll('src="VI02"', `src="${P}projects/vi02/hero.jpg"`).replaceAll('src="AR07"', `src="${P}projects/ar07/hero.jpg"`);
const built = resolve(A, "mocks.built.html");
writeFileSync(built, mocks);
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await (await browser.newContext({ viewport: { width: 1100, height: 800 }, deviceScaleFactor: 1.5 })).newPage();
await page.goto(pathToFileURL(built).href, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const styles = {};
for (const el of await page.locator(".mock").all()) {
  const name = await el.getAttribute("data-style");
  const png = await el.screenshot({ type: "png" });
  styles[name] = {
    big: b64(await sharp(png).resize({ width: 1200 }).jpeg({ quality: 78 }).toBuffer(), "image/jpeg"),
    thumb: b64(await sharp(png).resize({ width: 480 }).jpeg({ quality: 72 }).toBuffer(), "image/jpeg"),
  };
}
await browser.close();

const tpl = readFileSync("docs/cuestionario-raar.template.html", "utf8");
const out = tpl
  .replaceAll("__FONT_REGULAR__", readFileSync(resolve(A, "Poppins-Regular.ttf")).toString("base64"))
  .replaceAll("__FONT_MEDIUM__", readFileSync(resolve(A, "Poppins-Medium.ttf")).toString("base64"))
  .replace("__JSPDF__", () => readFileSync(resolve(A, "jspdf.umd.min.js"), "utf8"))
  .replace("__LOGO_PDF__", logoPdf).replace("__LOGO__", logo).replace("__LOGO_RATIO__", (meta.width / meta.height).toFixed(4))
  .replace("__BG__", bg).replace("__STYLES__", () => JSON.stringify(styles)).replace("__STUBS__", () => JSON.stringify(stubs));
writeFileSync("docs/cuestionario-raar.html", out);
console.log("docs/cuestionario-raar.html", Math.round(out.length / 1024), "KB");
