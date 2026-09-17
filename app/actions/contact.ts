"use server";

import { z } from "zod";
import { Resend } from "resend";
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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO ?? site.email;
  const from = process.env.CONTACT_FROM ?? `RAAR web <web@${new URL(site.url).hostname.replace(/^www\./, "")}>`;

  if (!apiKey) {
    // No mail provider configured yet: keep the lead visible in server logs.
    console.warn("[contact] RESEND_API_KEY missing — lead logged only:\n" + text);
    return { status: "ok" };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: d.email,
      subject: `Primera visita · ${d.name} · ${d.place || typeLabel[d.type]}`,
      text,
    });
    return { status: "ok" };
  } catch (err) {
    console.error("[contact] send failed", err);
    return { status: "error", message: "send" };
  }
}
