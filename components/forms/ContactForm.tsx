"use client";

import { useActionState, useId } from "react";
import Link from "next/link";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { copy } from "@/lib/copy";
import { routes, site, whatsappUrl } from "@/lib/site";
import { Check, WhatsApp } from "@/components/ui/Icon";

const initial: ContactState = { status: "idle" };

function errorText(code?: string) {
  if (!code) return null;
  if (code === "email") return copy.form.invalidEmail;
  if (code === "phone") return copy.form.invalidPhone;
  if (code === "consent") return copy.form.consentRequired;
  return copy.form.required;
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  inputMode?: "tel" | "email" | "text";
};

function Field({ id, name, label, error, type = "text", autoComplete, required, inputMode }: FieldProps) {
  const e = errorText(error);
  return (
    <div>
      <label htmlFor={`${id}-${name}`} className="block label mb-1.5">
        {label}
        {required && <span className="text-red"> *</span>}
      </label>
      <input
        id={`${id}-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required={required}
        aria-invalid={e ? "true" : undefined}
        aria-describedby={e ? `${id}-${name}-err` : undefined}
        className="field"
      />
      {e && (
        <p id={`${id}-${name}-err`} className="text-xs text-red mt-1.5">
          {e}
        </p>
      )}
    </div>
  );
}

export function ContactForm({ defaultType }: { defaultType?: string }) {
  const [state, action, pending] = useActionState(sendContact, initial);
  const id = useId();
  const f = copy.form;

  if (state.status === "ok") {
    return (
      <div role="status" aria-live="polite" className="py-6">
        <p className="inline-flex items-center gap-2 label">
          <Check /> {f.successTitle}
        </p>
        <p className="lead mt-3">{f.successText}</p>
      </div>
    );
  }

  const err = state.errors ?? {};

  return (
    <form action={action} noValidate className="relative grid gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field id={id} name="name" label={f.name} error={err.name} autoComplete="name" required />
        <Field id={id} name="phone" label={f.phone} error={err.phone} type="tel" autoComplete="tel" inputMode="tel" required />
      </div>
      <Field id={id} name="email" label={f.email} error={err.email} type="email" autoComplete="email" inputMode="email" required />
      <div className="grid sm:grid-cols-2 gap-5">
        <Field id={id} name="place" label={f.place} error={err.place} autoComplete="address-level2" />
        <div>
          <label htmlFor={`${id}-type`} className="block label mb-1.5">
            {f.type}
          </label>
          <select id={`${id}-type`} name="type" defaultValue={defaultType ?? "no-se"} className="field appearance-none bg-white">
            {f.typeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-message`} className="block label mb-1.5">
          {f.message}
        </label>
        <textarea id={`${id}-message`} name="message" rows={4} placeholder={f.messagePlaceholder} className="field resize-y" />
      </div>

      {/* honeypot */}
      <div className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-[0.95rem] text-ink-2 cursor-pointer">
          <input type="checkbox" name="consent" required className="mt-1 accent-[var(--red)] w-4 h-4" aria-invalid={err.consent ? "true" : undefined} />
          <span>
            {f.consent}{" "}
            <Link href={routes.privacy} className="link-red">
              Política de privacidad
            </Link>
            .
          </span>
        </label>
        {errorText(err.consent) && <p className="text-xs text-red mt-1.5">{errorText(err.consent)}</p>}
      </div>

      {state.status === "error" && !state.errors && (
        <p role="alert" className="text-sm text-red">
          {f.errorTitle} {f.errorText}{" "}
          <a href={`mailto:${site.email}`} className="underline">
            {site.email}
          </a>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" className="btn btn-red" disabled={pending} aria-disabled={pending}>
          {pending ? f.sending : f.submit}
        </button>
        <a href={whatsappUrl(copy.whatsapp.message)} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          <WhatsApp /> {copy.whatsapp.cta}
        </a>
        <span className="label">* {f.required.toLowerCase()}</span>
      </div>
    </form>
  );
}
