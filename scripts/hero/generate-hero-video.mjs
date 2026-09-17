// Generates the IM10 hero clip with Seedance 2.5 (reference-to-video) on fal.ai.
//
//   node scripts/hero/generate-hero-video.mjs            -> dry run: prints prompt + cost, submits nothing
//   node scripts/hero/generate-hero-video.mjs --confirm  -> uploads references, submits, waits, downloads
//
// Output: assets-src/hero/im10-hero-v<N>.mp4 + .json (prompt, seed, request id) — gitignored.
// Cost guard: DURATION_S * PRICE_PER_S is printed; nothing runs without --confirm.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import sharp from "sharp";
import { fal } from "@fal-ai/client";

const ROOT = resolve(import.meta.dirname, "../..");
const OUT_DIR = join(ROOT, "assets-src", "hero");
const MODEL = "bytedance/seedance-2.5/reference-to-video";
const DURATION_S = 12;
const RESOLUTION = "720p";
const PRICE_PER_S = 0.473; // fal.ai listed price, 720p 16:9 with images-only references

// Reference images in the order the prompt cites them (@Image1 … @Image5).
const REFERENCES = [
  "public/images/projects/im10/hero.jpg", // @Image1 exterior
  "public/images/projects/im10/render-01-sala.jpg", // @Image2 living room
  "public/images/projects/im10/render-02-cocina.jpg", // @Image3 kitchen
  "public/images/projects/im10/render-03-comedor.jpg", // @Image4 dining
  "public/images/projects/im10/render-05-habitacion-principal.jpg", // @Image5 master bedroom
];

const PROMPT = `FORMAT: 12-second continuous single take, 16:9, real-time speed, one uninterrupted camera path, no cuts.

REFERENCE ROLES: All five images are rooms of the same house, photographed in the same late-morning daylight. @Image1 controls only the exterior: a three-storey Mediterranean house with terracotta roof, balconies, a fully glazed ground floor, a lawn, a swimming pool and a gabion stone wall. @Image2 controls only the living room look: light oak, pale stone floor, low sofa, garden windows. @Image3 controls only the kitchen: oak island, matte white surfaces. @Image4 controls only the dining area. @Image5 controls only the master bedroom: linen bed, warm wood, large window onto the garden. Preserve their materials, colours and daylight. Do not copy any framing or crop from the images.

STARTING STATE: The camera is a small cinematic drone hovering 1.5 m above the lawn, 12 m from the house, with the glazed ground floor centered in frame and the pool in the lower left. Sun from the left, soft shadows. The wide sliding glass door of the ground floor is open. No people anywhere.

TIMELINE: 0-3 s: the drone glides forward over the lawn, passes the pool on its left and approaches the open glass door. 3-5.5 s: the drone crosses the threshold into the living room; reflections of the garden slide across the glass and the interior of @Image2 brightens as it enters. 5.5-8 s: the drone turns gently to the right and tracks along the kitchen island of @Image3 into the dining area of @Image4. 8-11 s: the drone continues through an open doorway along a short corridor and enters the master bedroom of @Image5. 11-12 s: the drone slows to a near stop, settling with the bedroom window and the garden trees centered in frame.

CAMERA: eye-level, wide lens, steady gimbal, constant slow forward speed of about one metre per second, gentle yaw only when turning, no roll, no zoom, deep focus, horizon level.

CONTINUITY: one house throughout; oak wood, pale stone floor, white walls and warm daylight remain constant; door openings stay where they are; no furniture appears, disappears or changes; the garden stays visible through the windows.

AUDIO: none, silent.

CONSTRAINTS: no cuts, no fades, no people, no animals, no text, no lens flare, no speed ramps, no slow motion, no camera shake, no duplicated rooms, no impossible geometry. Photoreal architectural visualization.`;

const confirm = process.argv.includes("--confirm");
const est = (DURATION_S * PRICE_PER_S).toFixed(2);

console.log(`Model      ${MODEL}\nResolution ${RESOLUTION}\nDuration   ${DURATION_S}s\nEstimate   ~$${est}\n`);
console.log("--- prompt ---\n" + PROMPT + "\n--------------\n");

if (!confirm) {
  console.log("Dry run. Re-run with --confirm to generate.");
  process.exit(0);
}

const env = readFileSync(join(ROOT, ".env.local"), "utf8");
const key = env.match(/^FAL_KEY=(.+)$/m)?.[1]?.trim();
if (!key) throw new Error("FAL_KEY not found in .env.local");
fal.config({ credentials: key });

mkdirSync(OUT_DIR, { recursive: true });
const version = readdirSync(OUT_DIR).filter((f) => /^im10-hero-v\d+\.mp4$/.test(f)).length + 1;

// Downscale references to 2048px JPEG q90: clean inputs, small uploads.
console.log("Preparing + uploading references…");
const imageUrls = [];
for (const rel of REFERENCES) {
  const buf = await sharp(join(ROOT, rel))
    .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();
  const url = await fal.storage.upload(new Blob([buf], { type: "image/jpeg" }));
  imageUrls.push(url);
  console.log("  ↑", rel, `${(buf.length / 1e3).toFixed(0)} KB`);
}

const input = {
  prompt: PROMPT,
  image_urls: imageUrls,
  task: "reference",
  resolution: RESOLUTION,
  duration: DURATION_S,
  aspect_ratio: "16:9",
  generate_audio: false,
  bitrate_mode: "high",
};

console.log("\nSubmitting…");
const { request_id } = await fal.queue.submit(MODEL, { input });
console.log("request_id", request_id);

let status;
do {
  await new Promise((r) => setTimeout(r, 8000));
  status = await fal.queue.status(MODEL, { requestId: request_id, logs: true });
  const last = status.logs?.at(-1)?.message;
  process.stdout.write(`  ${status.status}${last ? " · " + last : ""}\n`);
} while (status.status !== "COMPLETED");

const result = await fal.queue.result(MODEL, { requestId: request_id });
const video = result.data.video;
const mp4 = join(OUT_DIR, `im10-hero-v${version}.mp4`);
const res = await fetch(video.url);
writeFileSync(mp4, Buffer.from(await res.arrayBuffer()));
writeFileSync(
  mp4.replace(/\.mp4$/, ".json"),
  JSON.stringify({ model: MODEL, request_id, seed: result.data.seed, input: { ...input, image_urls: REFERENCES }, video, generated_at: new Date().toISOString() }, null, 2),
);
console.log(`\nSaved ${mp4} (${(video.file_size / 1e6).toFixed(1)} MB) · seed ${result.data.seed}`);
