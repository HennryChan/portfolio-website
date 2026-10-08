import { Link } from "react-router";

import { homePath } from "~/i18n/paths";
import { useLocale, useT } from "~/i18n/use-locale";

import { buttonClass } from "./ui/button";

/**
 * Contenido de la página 404 (ruta inexistente o proyecto que no existe):
 * mensaje, botón a la portada y una placa suelta, "la capa que falta".
 */
export function NotFoundView() {
  const locale = useLocale();
  const t = useT();

  return (
    <main id="main" tabIndex={-1} className="shell grid min-h-[80svh] items-center pt-(--header-h)">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="text-sm font-semibold text-ink-soft font-wide">404</p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight font-wide lg:text-6xl">
            {t.notFound.title}
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-soft">{t.notFound.body}</p>
          <Link to={homePath(locale)} className={buttonClass("primary", "mt-10")}>
            {t.notFound.home}
          </Link>
        </div>

        {/* Una placa suelta: la capa que falta. */}
        <svg
          viewBox="-130 -20 320 220"
          className="mx-auto w-full max-w-sm lg:col-span-5 lg:col-start-8"
          aria-hidden="true"
        >
          <g transform="rotate(-8 30 90)">
            <polygon
              points="0,0 169.7,98 55.4,164 -114.3,66"
              fill="none"
              stroke="var(--line)"
              strokeWidth={1.5}
              strokeDasharray="6 6"
            />
          </g>
          <polygon
            points="0,20 169.7,118 55.4,184 -114.3,86"
            fill="color-mix(in oklab, var(--layer-ui) 16%, transparent)"
            stroke="var(--layer-ui)"
            strokeWidth={1.5}
          />
        </svg>
      </div>
    </main>
  );
}
