// Mide, en las láminas con revelado (data-rv="wipe"), cuánto tarda la foto en estar lista
// respecto al momento en que empieza la animación. Red 4G simulada.
//   node scripts/measure-reveal.mjs [url] [mobile]
import { chromium } from "playwright-core";
const url = process.argv[2] ?? "http://localhost:3010/";
const mobile = process.argv[3] === "mobile";
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const c = await b.newContext(
  mobile
    ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }
    : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
);
await c.addInitScript(() => {
  sessionStorage.setItem("raar:intro", "1");
  localStorage.setItem("raar:consent", JSON.stringify({ v: 1, analytics: false, at: "" }));
  window.__rv = [];
  // cuándo asoma cada lámina de verdad (mismo umbral que Reveal), para medir la espera
  window.__seen = new Map();
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && !window.__seen.has(e.target) && window.__seen.set(e.target, performance.now())), { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
  addEventListener("DOMContentLoaded", () => document.querySelectorAll('[data-rv="wipe"]').forEach((el) => io.observe(el)));
  new MutationObserver((ms) => {
    for (const m of ms) {
      if (m.attributeName !== "data-in") continue;
      const img = m.target.querySelector("img");
      if (!img) continue;
      const rec = { wait: Math.round(performance.now() - (window.__seen.get(m.target) ?? performance.now())), t: performance.now(), done: img.complete && img.naturalWidth > 0, src: "", w: 0, load: null };
      window.__rv.push(rec);
      const fin = () => { rec.load = performance.now(); rec.src = img.currentSrc; rec.w = Math.round(img.getBoundingClientRect().width); };
      if (rec.done) fin(); else img.addEventListener("load", fin, { once: true });
    }
  }).observe(document, { subtree: true, attributes: true, attributeFilter: ["data-in"] });
});
const p = await c.newPage();
const cdp = await c.newCDPSession(p);
await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (9 * 1024 * 1024) / 8, uploadThroughput: (1.5 * 1024 * 1024) / 8 });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(1500);
for (let y = 0; y < 9000; y += 350) { await p.mouse.wheel(0, 350); await p.waitForTimeout(220); }
await p.waitForTimeout(4000);
const r = await p.evaluate(() => window.__rv);
for (const x of r) {
  const w = x.src ? new URL(x.src).searchParams.get("w") : "?";
  const f = x.src ? decodeURIComponent(new URL(x.src).searchParams.get("url") ?? "").split("/").pop() : "?";
  console.log(`${x.done ? "foto lista al abrir" : "cortina sin foto " + Math.round((x.load ?? NaN) - x.t) + " ms"} · espera ${x.wait} ms  caja ${x.w}px  pide w=${w}  ${f}`);
}
await b.close();
