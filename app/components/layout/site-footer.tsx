import { Link } from "react-router";

import { fullName } from "~/content/profile";
import { getProject } from "~/content/projects";
import { site } from "~/content/site";
import { projectPath } from "~/i18n/paths";
import { useLocale, useT } from "~/i18n/use-locale";

import { scrollToTop } from "../smooth-scroll";

/**
 * Pie de todas las páginas: nombre y año, con qué está hecho el sitio,
 * enlaces a cómo se hizo, al código fuente y a las redes, y "volver arriba".
 */
export function SiteFooter() {
  const t = useT();
  const locale = useLocale();
  const year = new Date().getFullYear();
  // Solo si el proyecto configurado en site.caseStudy existe.
  const caseStudy = site.caseStudy ? getProject(site.caseStudy) : undefined;

  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-col gap-8 py-10 text-sm text-ink-soft md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-ink">
            © {year} {fullName}
          </p>
          <p>{t.footer.builtWith}</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {caseStudy && (
            <li>
              <Link
                to={projectPath(locale, caseStudy.slug)}
                viewTransition
                className="underline-offset-4 hover:text-ink hover:underline"
              >
                {t.footer.caseStudy}
              </Link>
            </li>
          )}
          <li>
            <a
              className="underline-offset-4 hover:text-ink hover:underline"
              href={site.repositoryUrl}
            >
              {t.footer.source}
            </a>
          </li>
          {site.socials.map((social) => (
            <li key={social.href}>
              <a
                className="underline-offset-4 hover:text-ink hover:underline"
                href={social.href}
                // rel="me": indica que el perfil es de la misma persona que este sitio.
                rel="me"
              >
                {social.label}
              </a>
            </li>
          ))}
          <li>
            <a
              className="underline-offset-4 hover:text-ink hover:underline"
              href="#main"
              // Sube con scroll suave y deja el foco al inicio, como un ancla nativa.
              onClick={(event) => {
                event.preventDefault();
                scrollToTop();
                document.getElementById("main")?.focus({ preventScroll: true });
              }}
            >
              {t.footer.backToTop}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
