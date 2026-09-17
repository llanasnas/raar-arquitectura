// Builds docs/propuesta-extras.html (self-contained proposal of optional add-ons for the client)
// from docs/propuesta-extras.template.html: embeds Poppins, logo, backdrop and five block covers
// taken from the studio's own renders. Then prints docs/propuesta-extras.pdf with local Chrome.
//   node scripts/build-propuesta.mjs
// Needs assets-src/cuestionario/{Poppins-Regular.ttf,Poppins-Medium.ttf} (shared with the questionnaire).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { chromium } from "playwright-core";

const ROOT = process.cwd();
const A = resolve(ROOT, "assets-src/cuestionario");
for (const f of ["Poppins-Regular.ttf", "Poppins-Medium.ttf"]) {
  if (!existsSync(resolve(A, f))) throw new Error(`Falta ${f} en assets-src/cuestionario/`);
}
const b64 = (buf, mime) => `data:${mime};base64,${buf.toString("base64")}`;
const jpg = async (src, width, quality) => b64(await sharp(src).resize({ width }).jpeg({ quality, mozjpeg: true }).toBuffer(), "image/jpeg");

const logo = b64(await sharp("public/images/brand/logo-black.png").resize({ width: 900 }).png({ compressionLevel: 9 }).toBuffer(), "image/png");
const bg = await jpg("public/images/projects/im10/hero.jpg", 1400, 50);
// one cover per block, all from RAAR's own material (16:6 crop happens in CSS)
const covers = {
  b1: await jpg("public/images/projects/im10/hero.jpg", 1600, 66),
  b2: await jpg("public/images/projects/ar07/hero.jpg", 1600, 66),
  b3: await jpg("public/images/projects/vi02/hero.jpg", 1600, 66),
  b4: await jpg("public/images/projects/gg01/hero.jpg", 1600, 66),
  b5: await jpg("public/images/about/team-aerial.jpg", 1600, 66),
};

const tpl = readFileSync("docs/propuesta-extras.template.html", "utf8");
const out = tpl
  .replaceAll("__FONT_REGULAR__", readFileSync(resolve(A, "Poppins-Regular.ttf")).toString("base64"))
  .replaceAll("__FONT_MEDIUM__", readFileSync(resolve(A, "Poppins-Medium.ttf")).toString("base64"))
  .replace("__LOGO__", logo).replace("__BG__", bg)
  .replace("__COVERS__", () => JSON.stringify(covers));
const html = resolve(ROOT, "docs/propuesta-extras.html");
writeFileSync(html, out);
console.log("docs/propuesta-extras.html", Math.round(out.length / 1024), "KB");

// PDF: same file printed by Chrome (print stylesheet: one block per page, no blur, white cards)
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 710, height: 1030 } }); // A4 content box at 96 dpi
await page.goto(pathToFileURL(html).href, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.emulateMedia({ media: "print" });
await page.pdf({ path: "docs/propuesta-extras.pdf", format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log("docs/propuesta-extras.pdf");
