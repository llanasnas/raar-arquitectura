// One-shot image pipeline.
//   node scripts/optimize-images.mjs
//
// 1. Moves the untouched originals from public/images → assets-src/images (gitignored) the first time.
// 2. Writes web-ready derivatives back into public/images at the same paths:
//      photos / renders / thumbs  → JPEG q82, max 2400px  (PNG photos become .jpg)
//      plans (line drawings)      → JPEG q88, max 2400px
//      logos / icons (alpha PNG)  → PNG, max 1600px
//      concept GIFs               → concept.mp4 (h264) + concept-poster.jpg
// 3. Rewrites content/**/*.md references for renamed files (.png → .jpg, .gif → .mp4).

import { existsSync, mkdirSync, readdirSync, renameSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, relative, dirname, extname, basename } from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "..");
const SRC = join(ROOT, "assets-src", "images");
const OUT = join(ROOT, "public", "images");

if (!existsSync(SRC)) {
  mkdirSync(dirname(SRC), { recursive: true });
  renameSync(OUT, SRC);
  console.log("moved originals → assets-src/images");
}
mkdirSync(OUT, { recursive: true });

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const renames = []; // [oldWebPath, newWebPath]
let total = 0;

for (const src of walk(SRC)) {
  const rel = relative(SRC, src).replace(/\\/g, "/");
  const ext = extname(rel).toLowerCase();
  const name = basename(rel, ext);
  const outDir = join(OUT, dirname(rel));
  mkdirSync(outDir, { recursive: true });

  const isBrand = rel.startsWith("brand/");
  const isPlan = name.startsWith("plan-");
  let outRel;

  if (ext === ".gif") {
    outRel = rel.replace(/\.gif$/, ".mp4");
    const mp4 = join(OUT, outRel);
    // scale to ≤1080 on the long side, force even dims, 24fps, silent
    execFileSync("ffmpeg", [
      "-y", "-loglevel", "error", "-i", src,
      "-vf", "scale='trunc(min(1080,iw)/2)*2':'trunc(ih*min(1080,iw)/iw/2)*2':flags=lanczos,format=yuv420p",
      "-r", "24", "-an", "-c:v", "libx264", "-profile:v", "high", "-crf", "24", "-preset", "slow", "-movflags", "+faststart",
      mp4,
    ]);
    const poster = join(outDir, `${name}-poster.jpg`);
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", mp4, "-vframes", "1", "-q:v", "3", poster]);
    renames.push([`/images/${rel}`, `/images/${outRel}`]);
  } else if (isBrand && ext === ".svg") {
    continue; // los SVG de marca los genera scripts/build-brand.mjs desde el vector del cliente
  } else if (isBrand) {
    outRel = rel;
    await sharp(src).resize({ width: 1600, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(join(OUT, outRel));
  } else {
    outRel = rel.replace(/\.(png|jpe?g)$/i, ".jpg");
    await sharp(src)
      .rotate()
      .flatten({ background: "#ffffff" })
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: isPlan ? 88 : 82, mozjpeg: true, progressive: true })
      .toFile(join(OUT, outRel));
    if (outRel !== rel) renames.push([`/images/${rel}`, `/images/${outRel}`]);
  }

  const size = statSync(join(OUT, outRel)).size;
  total += size;
  console.log(`${(size / 1e3).toFixed(0).padStart(6)} KB  ${outRel}`);
}

// rewrite content references
const contentFiles = walk(join(ROOT, "content")).filter((f) => f.endsWith(".md") || f.endsWith(".json"));
for (const f of contentFiles) {
  let s = readFileSync(f, "utf8");
  const before = s;
  for (const [a, b] of renames) s = s.split(a).join(b);
  if (s !== before) {
    writeFileSync(f, s);
    console.log("rewrote refs in", relative(ROOT, f));
  }
}

console.log(`\npublic/images total: ${(total / 1e6).toFixed(1)} MB (was 273 MB)`);
