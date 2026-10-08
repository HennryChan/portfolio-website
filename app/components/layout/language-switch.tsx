import { m } from "motion/react";
import { Link, useLocation } from "react-router";

import { locales, switchLocalePath } from "~/i18n/paths";
import { useLocale, useT } from "~/i18n/use-locale";
import { cn } from "~/lib/cn";

/**
 * ES / EN. Mantiene la posición del scroll al cambiar de idioma y lleva a
 * la misma página en el otro idioma (un proyecto, a su traducción).
 */
export function LanguageSwitch({
  className,
  layoutId = "language-pill",
}: {
  className?: string;
  /**
   * Id de la animación de la píldora del idioma activo. Cada selector en
   * pantalla necesita uno propio para no animarse desde el otro.
   */
  layoutId?: string;
}) {
  const locale = useLocale();
  const t = useT();
  const { pathname } = useLocation();

  return (
    <nav aria-label={t.language.label} className={className}>
      <ul className="flex rounded-full border border-line p-0.5 font-mono text-xs font-semibold">
        {locales.map((code) => {
          const isCurrent = code === locale;
          return (
            <li key={code} className="relative">
              {isCurrent && (
                <m.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
                  aria-hidden="true"
                />
              )}
              <Link
                to={switchLocalePath(pathname, code)}
                lang={code}
                hrefLang={code}
                aria-current={isCurrent ? "true" : undefined}
                preventScrollReset
                viewTransition
                className={cn(
                  "relative block rounded-full px-2.5 py-1.5 uppercase transition-colors duration-200",
                  isCurrent ? "text-paper" : "text-ink-soft hover:text-ink",
                )}
              >
                {code}
                <span className="sr-only"> {t.language.names[code]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
