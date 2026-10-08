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
  if (values.name.trim().length < 2) invalid.push("name");
  if (!EMAIL_PATTERN.test(values.email.trim())) invalid.push("email");
  if (values.message.trim().length < MIN_MESSAGE_LENGTH) invalid.push("message");
  return invalid;
}

/**
 * Lee los campos del formulario sin espacios al inicio ni al final.
 *
 * @param form - El `<form>` que se envió.
 * @returns Los valores y `honeypot`: el campo oculto "company", que una
 * persona nunca ve; si trae texto, el envío viene de un bot.
 */
export function readContactForm(form: HTMLFormElement): ContactValues & {
  /** Valor del campo trampa "company"; vacío si quien envía es una persona. */
  honeypot: string;
} {
  const data = new FormData(form);
  const read = (key: string) => String(data.get(key) ?? "").trim();
  return {
    name: read("name"),
    email: read("email"),
    message: read("message"),
    honeypot: read("company"),
  };
}
