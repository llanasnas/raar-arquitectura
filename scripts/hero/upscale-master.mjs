// Upscales the 720p hero master to a 1080p master with Real-ESRGAN (ncnn-vulkan, local GPU, free).
//
//   node scripts/hero/upscale-master.mjs assets-src/hero/im10-hero-v1.mp4 [--model realesr-animevideov3|realesrgan-x4plus] [--scale 2|4] [--test 3] [--gpu 0]
//
// Needs tools/realesrgan/realesrgan-ncnn-vulkan.exe (gitignored; release 20220424 from xinntao/Real-ESRGAN).
//
//   --test N   upscales only N evenly spaced frames into assets-src/hero/work/test-<model>-x<scale>/ (compare models, no video)
//   (default)  all frames → assets-src/hero/<name>-1080p.mp4 (lanczos down to 1920×1080, x264 crf 10)
//
// Then: node scripts/hero/extract-frames.mjs assets-src/hero/<name>-1080p.mp4

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const EXE = join(ROOT, "tools", "realesrgan", "realesrgan-ncnn-vulkan.exe");
if (!existsSync(EXE)) throw new Error(`missing ${EXE}`);

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith("--"));
if (!input) throw new Error("usage: upscale-master.mjs <video.mp4> [--model M] [--scale 2|4] [--test N] [--gpu id]");
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const MODEL = opt("model", "realesr-animevideov3");
const SCALE = Number(opt("scale", "2"));
const TEST = Number(opt("test", "0"));
const GPU = opt("gpu", "0");

const src = resolve(ROOT, input);
const name = basename(src).replace(/\.mp4$/i, "");
const WORK = join(ROOT, "assets-src", "hero", "work");
const probe = (entry) =>
  execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", entry, "-of", "default=nw=1:nk=1", src]).toString().trim();
const fps = probe("stream=r_frame_rate");
const frames = Number(probe("stream=nb_frames"));
console.log(`source ${input} · ${probe("stream=width")}×${probe("stream=height")} · ${fps} fps · ${frames} frames · model ${MODEL} x${SCALE}`);

function upscale(inDir, outDir) {
  mkdirSync(outDir, { recursive: true });
  const t = Date.now();
  try {
    // the exe streams per-frame progress to stderr; keep it quiet unless it fails
    execFileSync(EXE, ["-i", inDir, "-o", outDir, "-n", MODEL, "-s", String(SCALE), "-g", GPU, "-f", "png", "-j", "2:2:2"], { stdio: "pipe" });
  } catch (e) {
    const tail = String(e.stderr ?? "").split(/\r?\n/).filter((l) => !/%$/.test(l)).slice(-10).join("\n");
    throw new Error(`realesrgan failed: ${tail}`);
  }
  const n = readdirSync(outDir).length;
  console.log(`upscaled ${n} frames in ${((Date.now() - t) / 1000).toFixed(0)} s → ${outDir}`);
}

if (TEST > 0) {
  // N frames spread over the clip, upscaled, plus the plain-ffmpeg 1080p equivalent for side-by-side comparison
  const dir = join(WORK, `test-${MODEL}-x${SCALE}`);
  rmSync(dir, { recursive: true, force: true });
  const inDir = join(dir, "in");
  mkdirSync(inDir, { recursive: true });
  const step = Math.floor(frames / TEST);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-vf", `select=not(mod(n\\,${step}))`, "-vsync", "vfr", "-frames:v", String(TEST), join(inDir, "f_%02d.png")]);
  upscale(inDir, join(dir, "up"));
  console.log(`compare in/ (720p) vs up/ (${1280 * SCALE}px) under ${dir}`);
} else {
  const inDir = join(WORK, `${name}-frames`);
  const upDir = join(WORK, `${name}-up`);
  rmSync(inDir, { recursive: true, force: true });
  rmSync(upDir, { recursive: true, force: true });
  mkdirSync(inDir, { recursive: true });
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, join(inDir, "f_%04d.png")]);
  console.log(`extracted ${readdirSync(inDir).length} png`);
  upscale(inDir, upDir);
  const out = join(ROOT, "assets-src", "hero", `${name}-1080p.mp4`);
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-framerate", fps, "-i", join(upDir, "f_%04d.png"),
    "-vf", "scale=1920:1080:flags=lanczos",
    "-c:v", "libx264", "-preset", "slow", "-crf", "10", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out,
  ]);
  console.log(`master → ${out}`);
  console.log(`next: node scripts/hero/extract-frames.mjs assets-src/hero/${name}-1080p.mp4`);
}
