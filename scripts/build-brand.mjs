// Marca desde el vector del cliente.
//   node scripts/build-brand.mjs
//
// Entrada: assets-src/images/brand/logo-definitiu.svg (exportado de Illustrator: mesa A4 con
// el logotipo en medio, dos grupos: «arquitectura» y el wordmark RAAR).
//
// Salida:
//   public/images/brand/logo-black.svg / logo-white.svg   viewBox recortado a la caja del
//                                                          trazado, sin <style>, pasado por svgo
//   public/images/brand/wordmark-black.svg                 solo RAAR, sin «arquitectura»
//   public/images/brand/logo-black.png / logo-white.png   1600 px de ancho, fondo transparente
//   assets-src/images/brand/logo-black.png / logo-white.png   2444 px (el «original» que
//                                                          optimize-images vuelve a bajar a 1600)
//   app/icon.png (64) y app/apple-icon.png (180)           solo el wordmark, sobre blanco
//
// El recorte se calcula rasterizando a 20× y midiendo la caja: es exacto a 0,05 unidades y
// evita parsear los trazados a mano.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { optimize } from "svgo";

const ROOT = resolve(import.meta.dirname, "..");
const SRC = join(ROOT, "assets-src", "images", "brand", "logo-definitiu.svg");
const OUT = join(ROOT, "public", "images", "brand");
const ORIG = join(ROOT, "assets-src", "images", "brand");
mkdirSync(OUT, { recursive: true });

const source = readFileSync(SRC, "utf8");
// solo los grupos hoja (los que contienen únicamente <path>), no la capa que los envuelve
const groups = [...source.matchAll(/<g id="[^"]*">((?:\s*<path[^>]*\/>)+)\s*<\/g>/g)].map((m) => m[1]);
if (groups.length !== 2) throw new Error(`esperaba 2 grupos de trazados, hay ${groups.length}`);
const [wordmarkText, wordmark] = groups;

// Quita ids, clases y estilos: el color va en el <svg> raíz y lo hereda todo
const clean = (g) => g.replace(/\s(id|class)="[^"]*"/g, "").trim();

const SCALE = 20;
async function bbox(paths) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 842 595">${paths}</svg>`;
  const { info } = await sharp(Buffer.from(svg), { density: 72 * SCALE })
    .trim({ threshold: 1 })
    .toBuffer({ resolveWithObject: true });
  const r = (n) => Math.round((n / SCALE) * 100) / 100;
  return { x: r(-info.trimOffsetLeft), y: r(-info.trimOffsetTop), w: r(info.width), h: r(info.height) };
}

function svgOf(paths, box, fill) {
  const raw = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.x} ${box.y} ${box.w} ${box.h}" fill="${fill}">${paths}</svg>`;
  return optimize(raw, {
    multipass: true,
    floatPrecision: 2,
    plugins: ["preset-default"],
  }).data;
}

const full = clean(wordmark) + clean(wordmarkText);
const box = await bbox(full);
console.log(`caja del logotipo: ${box.x} ${box.y} ${box.w} ${box.h}  (aspecto ${(box.w / box.h).toFixed(3)})`);

for (const [name, fill] of [
  ["logo-black", "#000"],
  ["logo-white", "#fff"],
]) {
  const svg = svgOf(full, box, fill);
  writeFileSync(join(OUT, `${name}.svg`), svg);
  console.log(`${(svg.length / 1e3).toFixed(1).padStart(6)} KB  ${name}.svg`);

  for (const [dir, width] of [
    [ORIG, 2444],
    [OUT, 1600],
  ]) {
    const density = (72 * width) / box.w;
    const out = join(dir, `${name}.png`);
    await sharp(Buffer.from(svg), { density }).png({ compressionLevel: 9 }).toFile(out);
    const { width: w, height: h } = await sharp(out).metadata();
    console.log(`  ${w}×${h}  ${out.replace(ROOT, "").replace(/\\/g, "/")}`);
  }
}

// Solo RAAR, sin «arquitectura»: el wordmark grande de la portada (cliente, 22/09/2026) y los
// iconos. Va como máscara CSS (.cover-mark), así que hace falta su caja para el aspect-ratio.
const markBox = await bbox(clean(wordmark));
const markSvg = svgOf(clean(wordmark), markBox, "#000");
console.log(`caja del wordmark: ${markBox.x} ${markBox.y} ${markBox.w} ${markBox.h}  (aspecto ${(markBox.w / markBox.h).toFixed(3)})`);
writeFileSync(join(OUT, "wordmark-black.svg"), markSvg);
console.log(`${(markSvg.length / 1e3).toFixed(1).padStart(6)} KB  wordmark-black.svg`);

// Iconos: solo RAAR, sobre blanco, casi a sangre (como los que había)
for (const [file, size] of [
  ["app/icon.png", 64],
  ["app/apple-icon.png", 180],
]) {
  const inner = Math.round(size * 0.98);
  const mark = await sharp(Buffer.from(markSvg), { density: (72 * inner) / markBox.w })
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 3, background: "#ffffff" } })
    .composite([{ input: mark, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toFile(join(ROOT, file));
  console.log(`  ${size}×${size}  /${file}`);
}
