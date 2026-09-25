"use server";

import { z } from "zod";
import { sendMail } from "@/lib/mail";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(2, "required").max(120),
  email: z.string().trim().email("email"),
  phone: z
    .string()
    .trim()
    .min(6, "phone")
    .max(30)
    .regex(/^[+\d\s().-]+$/, "phone"),
  place: z.string().trim().max(120).optional().default(""),
  type: z.enum(["reforma", "obra-nueva", "rehabilitacion", "no-se"]).catch("no-se"),
  message: z.string().trim().max(3000).optional().default(""),
  consent: z.literal("on", { message: "consent" }),
  // honeypot: real users never fill it
  website: z.string().max(0).optional().default(""),
});

export type ContactState = {
  status: "idle" | "ok" | "error";
  errors?: Partial<Record<keyof z.infer<typeof schema>, string>>;
  message?: string;
};

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof schema>;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    // honeypot hit → pretend success, send nothing
    if (errors.website) return { status: "ok" };
    return { status: "error", errors };
  }

  const d = parsed.data;
  const typeLabel: Record<string, string> = {
    reforma: "Reforma integral",
    "obra-nueva": "Obra nueva",
    rehabilitacion: "Rehabilitación de nave o local",
    "no-se": "Todavía no lo sabe",
  };

  const text = [
    `Nueva solicitud de primera visita — ${site.name}`,
    "",
    `Nombre:    ${d.name}`,
    `Email:     ${d.email}`,
    `Teléfono:  ${d.phone}`,
    `Municipio: ${d.place || "—"}`,
    `Proyecto:  ${typeLabel[d.type]}`,
    "",
    d.message ? `Mensaje:\n${d.message}` : "(sin mensaje)",
    "",
    `Consentimiento RGPD: sí · ${new Date().toISOString()}`,
  ].join("\n");

  const esc = (v: string) => v.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const rows: [string, string][] = [
    ["Nombre", d.name],
    ["Email", d.email],
    ["Teléfono", d.phone],
    ["Municipio", d.place || "—"],
    ["Proyecto", typeLabel[d.type]],
  ];
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111110">
<p style="margin:0 0 16px"><strong>Nueva solicitud de primera visita</strong> · ${esc(site.name)}</p>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#6B6B66;padding-right:16px">${k}</td><td>${esc(v)}</td></tr>`)
    .join("")}</table>
<p style="margin:16px 0 0;white-space:pre-wrap">${d.message ? esc(d.message) : "<em>(sin mensaje)</em>"}</p>
<p style="margin:16px 0 0;color:#6B6B66;font-size:12px">Consentimiento RGPD: sí · ${new Date().toISOString()}</p>
</div>`;

  try {
    await sendMail({
      subject: `Primera visita · ${d.name} · ${d.place || typeLabel[d.type]}`,
      text,
      html,
      replyTo: d.email,
    });
    return { status: "ok" };
  } catch (err) {
    // sin credenciales en el log: nodemailer solo da código y respuesta del servidor
    console.error("[contact] send failed", err instanceof Error ? err.message : err);
    return { status: "error", message: "send" };
  }
}
