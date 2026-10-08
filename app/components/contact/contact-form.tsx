/**
 * Formulario de contacto. Valida en el navegador (app/lib/contact.ts) y
 * envía un JSON al servicio configurado en `site.contactForm`. Mientras
 * no haya servicio, funciona en modo demostración: valida, simula el
 * envío y avisa que el mensaje no se mandó.
 */
import { AnimatePresence, m } from "motion/react";
import { useId, useState, type FormEvent } from "react";

import { site } from "~/content/site";
import { useT } from "~/i18n/use-locale";
import { readContactForm, validateContact, type ContactField } from "~/lib/contact";
import { cn } from "~/lib/cn";

import { buttonClass } from "../ui/button";

/**
 * Estado del envío:
 * - `idle`: nada enviado todavía.
 * - `sending`: esperando al servicio (el botón se desactiva).
 * - `success`: el servicio recibió el mensaje.
 * - `demo`: no hay servicio configurado; no se envió nada.
 * - `error`: el servicio falló; se ofrece el correo como alternativa.
 */
type Status = "idle" | "sending" | "success" | "demo" | "error";

/** Campos visibles, en el orden en que se muestran. */
const fields: ContactField[] = ["name", "email", "message"];

/**
 * Campos con etiqueta, errores enlazados con `aria-describedby`, foco en
 * el primer campo inválido y un mensaje de estado que los lectores de
 * pantalla anuncian (`role="status"`).
 */
export function ContactForm({ className }: { className?: string }) {
  const t = useT();
  const copy = t.contact.form;
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [invalid, setInvalid] = useState<ContactField[]>([]);

  /** Revisa la trampa para bots, valida y envía (o simula el envío). */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const { honeypot, ...values } = readContactForm(form);

    // Los bots suelen llenar el campo oculto: se ignora el envío sin avisar.
    if (honeypot) return;

    const errors = validateContact(values);
    setInvalid(errors);
    if (errors.length > 0) {
      form.querySelector<HTMLElement>(`[name="${errors[0]}"]`)?.focus();
      return;
    }

    setStatus("sending");

    // Sin servicio configurado (ver app/content/site.ts) el formulario no envía nada.
    if (!site.contactForm.endpoint) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setStatus("demo");
      return;
    }

    try {
      const response = await fetch(site.contactForm.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...site.contactForm.extraFields, ...values }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  // Ids únicos por formulario (useId) para enlazar etiquetas y mensajes de error.
  const fieldId = (field: ContactField) => `${id}-${field}`;
  const errorId = (field: ContactField) => `${id}-${field}-error`;
  const isInvalid = (field: ContactField) => invalid.includes(field);
  // El error de un campo desaparece en cuanto la persona vuelve a escribir en él.
  const clearError = (field: ContactField) => {
    if (isInvalid(field)) setInvalid((current) => current.filter((item) => item !== field));
  };

  // Texto del estado actual; null mientras no hay nada que anunciar.
  const message =
    status === "success"
      ? copy.success
      : status === "demo"
        ? copy.demo
        : status === "error"
          ? copy.error(site.email)
          : null;

  return (
    <form noValidate onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {fields.map((field) => {
        const multiline = field === "message";
        const inputClass = cn(
          "mt-2 block w-full rounded-xl border bg-raised px-4 text-base text-ink transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-ink-soft focus:border-ink focus:ring-4 focus:ring-[color-mix(in_oklab,var(--layer-ui)_22%,transparent)]",
          isInvalid(field) ? "border-layer-infra" : "border-line",
          multiline ? "min-h-40 resize-y py-3" : "h-12",
        );
        // Atributos comunes a <input> y <textarea>.
        const shared = {
          id: fieldId(field),
          name: field,
          className: inputClass,
          "aria-invalid": isInvalid(field) || undefined,
          "aria-describedby": isInvalid(field) ? errorId(field) : undefined,
          onInput: () => clearError(field),
        };
        return (
          <div key={field}>
            <label htmlFor={fieldId(field)} className="text-sm font-medium">
              {copy[field]}
            </label>
            {multiline ? (
              <textarea {...shared} rows={5} />
            ) : (
              <input
                {...shared}
                type={field === "email" ? "email" : "text"}
                autoComplete={field === "email" ? "email" : "name"}
                inputMode={field === "email" ? "email" : undefined}
              />
            )}
            {isInvalid(field) && (
              <p id={errorId(field)} className="mt-2 text-sm text-layer-infra">
                {copy.errors[field]}
              </p>
            )}
          </div>
        );
      })}

      {/* Trampa para bots: invisible para personas y lectores de pantalla. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <button
          type="submit"
          className={buttonClass("primary", "sm:self-start")}
          disabled={status === "sending"}
        >
          {status === "sending" ? copy.sending : copy.submit}
        </button>

        <div role="status" aria-live="polite" className="min-h-6 text-sm">
          {/* mode="wait": el mensaje anterior termina de salir antes de que entre el nuevo. */}
          <AnimatePresence mode="wait" initial={false}>
            {message && (
              <m.p
                key={status}
                className={status === "error" ? "text-layer-infra" : "text-ink-soft"}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.12 } }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              >
                {message}
              </m.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
}
