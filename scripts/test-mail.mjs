// Comprueba el SMTP de .env.local sin pasar por la web.
//   node scripts/test-mail.mjs          → conecta y valida usuario y contraseña, no envía nada
//   node scripts/test-mail.mjs --send   → además envía un correo de prueba a CONTACT_TO
//   node scripts/test-mail.mjs --ethereal [--send]  → usa una cuenta de prueba de ethereal.email
// Misma configuración que lib/mail.ts. Nunca imprime la contraseña.
import nodemailer from "nodemailer";
import { existsSync } from "node:fs";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const env = (k) => process.env[k]?.trim() || undefined;
const send = process.argv.includes("--send");

let host = env("SMTP_HOST");
let port = Number(env("SMTP_PORT") ?? 587);
let user = env("SMTP_USER");
let pass = env("SMTP_PASS");
if (process.argv.includes("--ethereal")) {
  const acc = await nodemailer.createTestAccount();
  ({ host, port } = acc.smtp);
  ({ user, pass } = acc);
}
if (!host) {
  console.error("Falta SMTP_HOST en .env.local (ver .env.example).");
  process.exit(1);
}
const secure = env("SMTP_SECURE") ? env("SMTP_SECURE") === "true" : port === 465;
const to = env("CONTACT_TO") ?? "arquitectura@raar-arquitectura.eu";
const from = env("CONTACT_FROM") ?? user;

console.log(`SMTP ${host}:${port} ${secure ? "TLS" : "STARTTLS"} · usuario ${user ?? "(sin auth)"} · de ${from} · para ${to}`);
const t = nodemailer.createTransport({
  host,
  port,
  secure,
  requireTLS: !secure && port !== 25,
  auth: user ? { user, pass: pass ?? "" } : undefined,
  connectionTimeout: 10_000,
});

try {
  await t.verify();
  console.log("Conexión y credenciales: OK");
  if (send) {
    const info = await t.sendMail({
      from,
      to,
      subject: "Prueba del formulario · RAAR web",
      text: `Correo de prueba enviado por scripts/test-mail.mjs el ${new Date().toISOString()}.`,
    });
    console.log("Enviado:", info.messageId, info.response);
    const url = nodemailer.getTestMessageUrl(info);
    if (url) console.log("Ver en Ethereal:", url);
  }
} catch (err) {
  console.error("Fallo SMTP:", err.code ?? "", err.response ?? err.message);
  process.exit(1);
}
