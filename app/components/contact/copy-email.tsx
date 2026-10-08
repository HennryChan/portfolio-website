import { useEffect, useRef, useState } from "react";

import { useT } from "~/i18n/use-locale";

import { CheckIcon, CopyIcon } from "../ui/icons";

/**
 * Botón que copia el correo al portapapeles y confirma durante 2 s con
 * "Copiado". El cambio de texto se anuncia a lectores de pantalla.
 */
export function CopyEmail({
  email,
}: {
  /** Correo que se copia. */
  email: string;
}) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  /** Temporizador que devuelve el botón a su texto original. */
  const timer = useRef<number | undefined>(undefined);

  // Al desmontar, el temporizador pendiente ya no debe cambiar el estado.
  useEffect(() => () => window.clearTimeout(timer.current), []);

  /** Copia el correo; si se vuelve a pulsar, los 2 s empiezan de nuevo. */
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Portapapeles bloqueado: el correo sigue visible y enlazado.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="button inline-flex h-9 items-center gap-2 rounded-full border border-line px-3.5 text-sm font-medium text-ink-soft hover:border-ink hover:text-ink"
    >
      {copied ? <CheckIcon width={16} height={16} /> : <CopyIcon width={16} height={16} />}
      <span aria-live="polite">{copied ? t.contact.emailCopied : t.contact.copyEmail}</span>
    </button>
  );
}
