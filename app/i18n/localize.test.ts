/** Pruebas de localize(): textos iguales en todos los idiomas o traducidos. */
import { describe, expect, it } from "vitest";

import { localize } from "./localize";

describe("localize", () => {
  it("deja igual un texto que no se traduce", () => {
    expect(localize("React", "en")).toBe("React");
  });

  it("elige la versión del idioma pedido", () => {
    const value = { es: "APIs REST", en: "REST APIs" };
    expect(localize(value, "es")).toBe("APIs REST");
    expect(localize(value, "en")).toBe("REST APIs");
  });
});
