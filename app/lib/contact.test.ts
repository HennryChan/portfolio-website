/** Pruebas de la validación del formulario de contacto. */
import { describe, expect, it } from "vitest";

import { MIN_MESSAGE_LENGTH, validateContact } from "./contact";

/** Un envío válido; cada prueba cambia solo el campo que revisa. */
const valid = {
  name: "Ana",
  email: "ana@ejemplo.com",
  message: "Hola, quiero cotizar una aplicación web.",
};

describe("validateContact", () => {
  it("acepta un mensaje completo", () => {
    expect(validateContact(valid)).toEqual([]);
  });

  it("marca los campos inválidos en el orden del formulario", () => {
    expect(validateContact({ name: " ", email: "ana@", message: "Hola" })).toEqual([
      "name",
      "email",
      "message",
    ]);
  });

  it("rechaza correos sin dominio válido", () => {
    for (const email of ["ana", "ana@ejemplo", "ana @ejemplo.com", "@ejemplo.com"]) {
      expect(validateContact({ ...valid, email })).toEqual(["email"]);
    }
  });

  it(`pide al menos ${MIN_MESSAGE_LENGTH} caracteres sin contar espacios de los extremos`, () => {
    const short = `  ${"a".repeat(MIN_MESSAGE_LENGTH - 1)}   `;
    expect(validateContact({ ...valid, message: short })).toEqual(["message"]);
    expect(validateContact({ ...valid, message: "a".repeat(MIN_MESSAGE_LENGTH) })).toEqual([]);
  });

  it("rechaza nombres o mensajes con patrones de spam (URLs o etiquetas HTML)", () => {
    expect(validateContact({ ...valid, name: "Bot http://spam.com" })).toEqual(["name"]);
    expect(
      validateContact({
        ...valid,
        message: "Mira esto: http://link1.com y http://link2.com y http://link3.com",
      }),
    ).toEqual(["message"]);
    expect(
      validateContact({
        ...valid,
        message: 'Hola <a href="http://spam.com">haz clic aquí</a> para ganar dinero.',
      }),
    ).toEqual(["message"]);
  });
});
