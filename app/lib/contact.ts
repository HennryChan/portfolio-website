/**
 * Lectura y validación del formulario de contacto. No depende de React, así
 * que se prueba en Node (contact.test.ts). El formulario usa `noValidate`:
 * estas reglas reemplazan la validación nativa del navegador para mostrar
 * los mensajes en el idioma de la página.
 */

/** Campos que llena la persona, en el orden del formulario. */
export type ContactField = "name" | "email" | "message";

/** Valores del formulario, ya sin espacios al inicio ni al final. */
export interface ContactValues {
  /** Nombre de quien escribe: al menos 2 caracteres. */
  name: string;
  /** Correo al que se responde. */
  email: string;
  /** Mensaje: al menos {@link MIN_MESSAGE_LENGTH} caracteres. */
  message: string;
}

/**
 * Forma básica de un correo (algo@dominio.ext). Solo atrapa errores de dedo;
 * si el correo existe de verdad, se sabe al responder.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Largo mínimo del mensaje: evita envíos vacíos como "hola". */
export const MIN_MESSAGE_LENGTH = 20;

/**
 * Devuelve los campos inválidos en el orden en que aparecen en el formulario.
 * El formulario pone el foco en el primero.
 *
 * @param values - Valores a revisar; los espacios al inicio y al final no cuentan.
 * @returns Lista vacía si todo es válido.
 */
export function validateContact(values: ContactValues): ContactField[] {
  const invalid: ContactField[] = [];
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  // Nombre: entre 2 y 70 caracteres, sin enlaces URLs (típico de spam).
  if (name.length < 2 || name.length > 70 || /(https?:\/\/|www\.)/i.test(name)) {
    invalid.push("name");
  }

  // Correo: patrón válido y largo razonable.
  if (!EMAIL_PATTERN.test(email) || email.length > 100) {
    invalid.push("email");
  }

  // Mensaje: entre MIN_MESSAGE_LENGTH y 3000 caracteres, sin etiquetas HTML o exceso de enlaces.
  const urlMatches = message.match(/(https?:\/\/|www\.)/gi) ?? [];
  const hasSpamMarkup = /<[a-z][\s\S]*>/i.test(message) || /\[url=/i.test(message);
  if (
    message.length < MIN_MESSAGE_LENGTH ||
    message.length > 3000 ||
    urlMatches.length > 2 ||
    hasSpamMarkup
  ) {
    invalid.push("message");
  }

  return invalid;
}

/**
 * Lee los campos del formulario sin espacios al inicio ni al final.
 *
 * @param form - El `<form>` que se envió.
 * @returns Los valores y `honeypot`: los campos trampa "company" o "botcheck", que una
 * persona nunca ve; si traen texto, el envío viene de un bot.
 */
export function readContactForm(form: HTMLFormElement): ContactValues & {
  /** Valor del campo trampa "company" o "botcheck"; vacío si quien envía es una persona. */
  honeypot: string;
} {
  const data = new FormData(form);
  const read = (key: string) => String(data.get(key) ?? "").trim();
  const company = read("company");
  const botcheck = read("botcheck");
  return {
    name: read("name"),
    email: read("email"),
    message: read("message"),
    honeypot: company || botcheck,
  };
}
