"use client";

import { useActionState, useId } from "react";
import Link from "next/link";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { copy } from "@/lib/copy";
import { routes, site, whatsappUrl } from "@/lib/site";

// El formulario en lenguaje v2: sin cajas ni píldoras. Cada campo es una línea de papel
// pautado y el botón, un bloque de tinta cuadrado. El error no se dice con color —aquí no
// hay rojo—: la línea se dobla y debajo va la nota en mono.
//
// La versión v1 (`ContactForm`) sigue viva para la web archivada en /v1.
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
    <div className="field-2">
      <label htmlFor={`${id}-${name}`} className="t-label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
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
      />
      {e && (
        <p id={`${id}-${name}-err`} className="t-label field-err">
          {e}
        </p>
      )}
    </div>
  );
}

export function ContactFormV2({ defaultType }: { defaultType?: string }) {
  const [state, action, pending] = useActionState(sendContact, initial);
  const id = useId();
  const f = copy.form;

  if (state.status === "ok") {
    return (
      <div role="status" aria-live="polite">
        <p className="t-label">{f.successTitle}</p>
        <p className="t-lead vspace-note">{f.successText}</p>
      </div>
    );
  }

  const err = state.errors ?? {};

  return (
    <form action={action} noValidate className="form-2">
      <div className="form-row">
        <Field id={id} name="name" label={f.name} error={err.name} autoComplete="name" required />
        <Field id={id} name="phone" label={f.phone} error={err.phone} type="tel" autoComplete="tel" inputMode="tel" required />
      </div>
      <Field id={id} name="email" label={f.email} error={err.email} type="email" autoComplete="email" inputMode="email" required />
      <div className="form-row">
        <Field id={id} name="place" label={f.place} error={err.place} autoComplete="address-level2" />
        <div className="field-2 field-sel">
          <label htmlFor={`${id}-type`} className="t-label">
            {f.type}
          </label>
          <select id={`${id}-type`} name="type" defaultValue={defaultType ?? "no-se"}>
            {f.typeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field-2">
        <label htmlFor={`${id}-message`} className="t-label">
          {f.message}
        </label>
        <textarea id={`${id}-message`} name="message" rows={4} placeholder={f.messagePlaceholder} />
      </div>

      {/* honeypot */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="consent-2">
          <input type="checkbox" name="consent" required aria-invalid={err.consent ? "true" : undefined} />
          <span>
            {f.consent}{" "}
            <Link href={routes.privacy} className="link-line">
              Política de privacidad
            </Link>
            .
          </span>
        </label>
        {errorText(err.consent) && <p className="t-label field-err">{errorText(err.consent)}</p>}
      </div>

      {state.status === "error" && !state.errors && (
        <p role="alert" className="t-body">
          {f.errorTitle} {f.errorText}{" "}
          <a href={`mailto:${site.email}`} className="link-line">
            {site.email}
          </a>
        </p>
      )}

      <div className="form-foot">
        <button type="submit" className="btn-2" disabled={pending} aria-disabled={pending}>
          {pending ? f.sending : f.submit}
        </button>
        <a href={whatsappUrl(copy.whatsapp.message)} target="_blank" rel="noopener noreferrer" className="btn-2 btn-2-ghost">
          {copy.whatsapp.cta}
        </a>
        <span className="t-label">* {f.required.toLowerCase()}</span>
      </div>
    </form>
  );
}
