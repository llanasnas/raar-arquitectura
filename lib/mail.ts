import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { Resend } from "resend";
import { site } from "@/lib/site";

// Envío de correo del formulario. Manda lo que haya en el entorno, por este orden:
//   1. SMTP (SMTP_HOST…): el buzón propio del estudio (Gmail/Workspace, IONOS, OVH…)
//   2. Resend (RESEND_API_KEY)
//   3. nada: el lead se escribe en el log del servidor y no se pierde del todo
// Las credenciales solo viven en .env.local / variables del hosting; nunca se loguean.

export type Mail = { subject: string; text: string; html?: string; replyTo?: string };
export type Transport = "smtp" | "resend" | "log";

const env = (key: string) => process.env[key]?.trim() || undefined;

export function mailTo() {
  return env("CONTACT_TO") ?? site.email;
}

export function mailFrom() {
  return env("CONTACT_FROM") ?? env("SMTP_USER") ?? `RAAR web <web@${new URL(site.url).hostname.replace(/^www\./, "")}>`;
}

export function mailTransport(): Transport {
  if (env("SMTP_HOST")) return "smtp";
  if (env("RESEND_API_KEY")) return "resend";
  return "log";
}

// Un solo transporte por proceso: reutiliza la conexión entre envíos.
let smtp: Transporter | null = null;

function smtpTransport() {
  if (smtp) return smtp;
  const port = Number(env("SMTP_PORT") ?? 587);
  // 465 = TLS directo; 587/25 = STARTTLS. SMTP_SECURE fuerza uno u otro si el proveedor es raro.
  const secure = env("SMTP_SECURE") ? env("SMTP_SECURE") === "true" : port === 465;
  const user = env("SMTP_USER");
  smtp = nodemailer.createTransport({
    host: env("SMTP_HOST"),
    port,
    secure,
    requireTLS: !secure && port !== 25,
    auth: user ? { user, pass: env("SMTP_PASS") ?? "" } : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return smtp;
}

export async function sendMail(mail: Mail): Promise<Transport> {
  const transport = mailTransport();
  const to = mailTo();
  const from = mailFrom();

  if (transport === "smtp") {
    await smtpTransport().sendMail({ from, to, replyTo: mail.replyTo, subject: mail.subject, text: mail.text, html: mail.html });
    return transport;
  }

  if (transport === "resend") {
    const { error } = await new Resend(env("RESEND_API_KEY")).emails.send({
      from,
      to,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      ...(mail.html ? { html: mail.html } : {}),
    });
    if (error) throw new Error(`resend: ${error.message}`);
    return transport;
  }

  console.warn("[mail] sin SMTP_HOST ni RESEND_API_KEY: el mensaje solo queda en el log\n" + mail.text);
  return transport;
}

/** Comprueba conexión y credenciales SMTP sin enviar nada (scripts/test-mail.mjs, arranque). */
export async function verifySmtp() {
  if (mailTransport() !== "smtp") return false;
  return smtpTransport().verify();
}
