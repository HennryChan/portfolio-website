import type { MaybeLocalized } from "../content/types";
import type { Locale } from "./paths";

/**
 * El texto en un idioma. Lo que no cambia entre idiomas (nombres propios,
 * tecnologías) se guarda como texto simple; lo demás, traducido.
 *
 * @example localize({ es: "APIs REST", en: "REST APIs" }, "en") → "REST APIs"
 */
export function localize(value: MaybeLocalized, locale: Locale): string {
  return typeof value === "string" ? value : value[locale];
}
