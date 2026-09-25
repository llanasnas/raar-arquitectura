// Import the selected material from the client's September 2026 ZIP after extraction.
// Usage: node scripts/import-client-assets-2026.mjs "<extracted/01. 2026 ACTUALITZACIÓ DE WEB>"
import { existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const source = process.argv[2];
if (!source || !existsSync(join(source, "02. PROJECTES"))) {
  throw new Error("Pass the extracted '01. 2026 ACTUALITZACIÓ DE WEB' directory.");
}

const projects = [
  ["ar07", "OBRA NOVA/Ar07/RENDERS", ["RENDER ACCESO.png", "RENDER FINAL FRONTAL.jpg", "RENDER PASILLO INTERIOR.png", "RENDER RELLENO.png"]],
  ["bo24", "OBRA NOVA/Bo24/RENDERS", ["COMEDOR.png", "GARAJE.png", "INTERIOR.png", "rendair-edit-canvas-22-09-2026-aae1e2ac.png"]],
  ["gg01", "OBRA NOVA/GG01/RENDERS", ["PATIO INTERIOR.png", "RENDER ACCESO APROBADO .jpg", "RENDER TERRAZA.jpg", "RENDER TRASERA .jpg"]],
  ["gr16", "OBRA NOVA/Gr16/RENDERS", ["ACCESO.png", "FACHADA.png", "TERRRAZA.png"]],
  ["cm25", "PROJECT MANAGEMENT/Cm25/RENDERS", ["IMAGEN 1 .png", "IMAGEN 2.png", "IMAGEN 3 .png", "IMAGEN 4 .png", "IMAGEN 5.png"]],
  ["to39", "PROJECT MANAGEMENT/To39/RENDERS", ["CERAMICA.jpg", "RECEPCION.jpg", "SALAPP.jpg", "YOGA.jpg"]],
  ["co38", "REHABILITACIÓN/Co38/IMÁGENES", ["PISO RAAR VIA LAIETANA-2.jpg", "PISO RAAR VIA LAIETANA-23.jpg", "PISO RAAR VIA LAIETANA-28.jpg", "PISO RAAR VIA LAIETANA-32.jpg", "PISO RAAR VIA LAIETANA-34.jpg", "PISO RAAR VIA LAIETANA-41.jpg", "PISO RAAR VIA LAIETANA-59.jpg", "PISO RAAR VIA LAIETANA-82.jpg", "PISO RAAR VIA LAIETANA-86.jpg"]],
  ["im10", "REHABILITACIÓN/IM10", ["cocina.png", "Despacho.jpg", "Espacio de día_.jpg"]],
  ["mo07", "REHABILITACIÓN/M023/RENDERS", ["INSTA 1.jpg", "INSTA 2.jpg", "INSTA 3.jpg", "INSTA 5.jpg"]],
  ["pe17", "REHABILITACIÓN/Pe 17/FOTOGRAFÍAS", ["RAAR_GRACIA-14.jpg", "RAAR_GRACIA-2.jpg", "RAAR_GRACIA-20.jpg", "RAAR_GRACIA-26.jpg", "RAAR_GRACIA-27.jpg", "RAAR_GRACIA-4.jpg", "RAAR_GRACIA-8.jpg", "RAAR_GRACIA-9.jpg", "RAAR_GRACIA.jpg"]],
  ["so30", "REHABILITACIÓN/So30/RENDERS", ["FOTO 1 SO30.png", "FOTO 2 SO30.jpg", "FOTO 3 SO30.jpg", "FOTO 4 SO30.PNG", "FOTO 5 SO30.jpg", "FOTO 6 SO30.jpg"]],
  ["vi02", "REHABILITACIÓN/Vi02/RENDERS", ["GARRIGA 1.png", "GARRIGA 2.png", "GARRIGA 3.png", "GARRIGA 4.jpg"]],
];

const slug = (name) => name.replace(/\.[^.]+$/, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
let bytesBefore = 0;
let bytesAfter = 0;
for (const [id, folder, names] of projects) {
  const dest = join(process.cwd(), "public", "images", "projects", id);
  mkdirSync(dest, { recursive: true });
  for (const name of names) {
    const input = join(source, "02. PROJECTES", folder, name);
    if (!existsSync(input)) throw new Error(`Missing client file: ${input}`);
    const output = join(dest, `client-2026-${slug(name)}.jpg`);
    bytesBefore += statSync(input).size;
    if (!existsSync(output)) {
      await sharp(input).rotate().flatten({ background: "#f5f4f1" })
        .resize({ width: 2200, height: 2200, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(output);
    }
    bytesAfter += statSync(output).size;
  }
}
console.log(`Client project images: ${(bytesBefore / 1e6).toFixed(1)} MB originals -> ${(bytesAfter / 1e6).toFixed(1)} MB web JPEGs`);

const home = [
  ["equipo", "251028 RAAR 0044.jpg"], ["equipo", "251028 RAAR 0473.jpg"],
  ["materiales", "IMG_4740.JPG"], ["materiales", "IMG_4815.JPG"],
  ["obra", "20240123_100707 (Copy).jpg"], ["obra", "251028 RAAR 0071.jpg"],
  ["renders", "ACCESO.png"], ["renders", "COMEDOR.png"],
];
const homeDest = join(process.cwd(), "public", "images", "home-2026");
mkdirSync(homeDest, { recursive: true });
for (const [folder, name] of home) {
  const input = join(source, "01. IMATGES PORTADA", "Selección Home", folder[0].toUpperCase() + folder.slice(1), name);
  const output = join(homeDest, `${folder}-${slug(name)}.jpg`);
  if (!existsSync(input)) throw new Error(`Missing home image: ${input}`);
  if (!existsSync(output)) {
    await sharp(input).rotate().flatten({ background: "#f5f4f1" })
      .resize({ width: 2200, height: 2200, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(output);
  }
  console.log(`home: ${folder}/${name} -> ${(statSync(output).size / 1024).toFixed(0)} KiB`);
}
