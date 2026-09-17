// Turns the hero master video into scrub-able frame sequences + posters + manifest.
//
//   node scripts/hero/extract-frames.mjs assets-src/hero/im10-hero-v1.mp4 [--desktop 240] [--mobile 120] [--autoplay 4]
//
// Writes:
//   public/hero/desktop/f_001.webp …   16:9, 1600px wide
//   public/hero/mobile/f_001.webp …    3:4 centre crop, 900px wide
//   public/hero/poster.jpg, poster-mobile.jpg   (frame 0, LCP image)
//   lib/hero-manifest.json                     (counts, sizes, autoplay range)

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith("--"));
if (!input) throw new Error("usage: extract-frames.mjs <video.mp4> [--desktop N] [--mobile N] [--autoplay seconds]");
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const DESKTOP = opt("desktop", 240);
const MOBILE = opt("mobile", 120);
const AUTOPLAY_S = opt("autoplay", 4);

const src = resolve(ROOT, input);
const probe = (entry) =>
  execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", entry, "-of", "default=nw=1:nk=1", src]).toString().trim();
const duration = Number(probe("format=duration"));
const srcHeight = Number(probe("stream=height"));
// a 720p master needs a touch of unsharp after lanczos; a 1080p one (see upscale-master.mjs) does not
const sharpen = srcHeight < 1080 ? ",unsharp=5:5:0.35:5:5:0.0" : "";
console.log(`source ${input} · ${duration.toFixed(2)} s · ${srcHeight}p${sharpen ? " (+unsharp)" : ""}`);

const OUT = join(ROOT, "public", "hero");
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "desktop"), { recursive: true });
mkdirSync(join(OUT, "mobile"), { recursive: true });

function run(vf, count, dir, w, h) {
  const fps = count / duration;
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-i", src,
    "-vf", `fps=${fps},${vf}`,
    "-frames:v", String(count),
    "-c:v", "libwebp", "-quality", "74", "-compression_level", "6", "-preset", "photo",
    join(OUT, dir, "f_%03d.webp"),
  ]);
  const files = readdirSync(join(OUT, dir));
  const bytes = files.reduce((s, f) => s + statSync(join(OUT, dir, f)).size, 0);
  console.log(`${dir}: ${files.length} frames ${w}×${h} · ${(bytes / 1e6).toFixed(1)} MB`);
  return files.length;
}

// desktop 16:9 → 1600 wide
const dCount = run(`scale=1600:-2:flags=lanczos${sharpen}`, DESKTOP, "desktop", 1600, 900);
// mobile 3:4 centre crop → 900×1200
const mCount = run(`crop=ih*3/4:ih,scale=900:1200:flags=lanczos${sharpen}`, MOBILE, "mobile", 900, 1200);

execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-vframes", "1", "-vf", "scale=1600:-2:flags=lanczos", "-q:v", "3", join(OUT, "poster.jpg")]);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-vframes", "1", "-vf", "crop=ih*3/4:ih,scale=900:1200:flags=lanczos", "-q:v", "3", join(OUT, "poster-mobile.jpg")]);

const manifest = {
  source: input,
  duration,
  autoplaySeconds: AUTOPLAY_S,
  desktop: { dir: "/hero/desktop", count: dCount, width: 1600, height: 900, autoplayEnd: Math.round((AUTOPLAY_S / duration) * dCount) },
  mobile: { dir: "/hero/mobile", count: mCount, width: 900, height: 1200, autoplayEnd: Math.round((AUTOPLAY_S / duration) * mCount) },
  poster: "/hero/poster.jpg",
  posterMobile: "/hero/poster-mobile.jpg",
  generatedAt: new Date().toISOString(),
};
writeFileSync(join(ROOT, "lib", "hero-manifest.json"), JSON.stringify(manifest, null, 2));
console.log("manifest → lib/hero-manifest.json");
