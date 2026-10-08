import { useLocation } from "react-router";

import { localeFromPathname, type Locale } from "./paths";
import { ui, type UIStrings } from "./ui";

/** Idioma de la página actual, deducido de la URL (bajo /en es inglés). */
export function useLocale(): Locale {
  return localeFromPathname(useLocation().pathname);
}

/** Textos de la interfaz en el idioma de la página actual: `const t = useT(); t.nav.projects`. */
export function useT(): UIStrings {
  return ui[useLocale()];
}
