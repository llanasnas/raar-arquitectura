import fs from "node:fs";
import path from "node:path";

// Intrinsic size of a JPEG under public/, read from the SOF marker. Build-time only
// (content loader), so a plate can take the real proportion of its image instead of cropping.
const cache = new Map<string, { width: number; height: number } | null>();

export function imageSize(publicSrc: string): { width: number; height: number } | null {
  const hit = cache.get(publicSrc);
  if (hit !== undefined) return hit;
  const file = path.join(process.cwd(), "public", publicSrc);
  let out: { width: number; height: number } | null = null;
  if (/\.jpe?g$/i.test(publicSrc) && fs.existsSync(file)) out = jpegSize(fs.readFileSync(file));
  cache.set(publicSrc, out);
  return out;
}

function jpegSize(buf: Buffer): { width: number; height: number } | null {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    if (marker === 0xff) {
      i++;
      continue;
    }
    // SOF0..SOF15 except DHT (C4), JPG (C8), DAC (CC)
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    if (marker === 0xd9 || marker === 0xda) return null; // EOI / SOS: no SOF found
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}
