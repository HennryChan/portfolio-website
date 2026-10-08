/**
 * Enlaces a las secciones de la portada (#projects, #contact…) que
 * funcionan igual desde cualquier página y en ambos idiomas.
 */
import type { MouseEvent, ReactNode } from "react";
import { Link, useLocation } from "react-router";

import { isHomePath, sectionPath } from "~/i18n/paths";
import { useLocale } from "~/i18n/use-locale";

import { scrollToSection } from "./smooth-scroll";

/** Props de SectionLink. */
interface SectionLinkProps {
  /** id de la sección en la portada: projects, stack, experience, contact… */
  section: string;
  /** Clases del enlace. */
  className?: string;
  /** Texto del enlace. */
  children: ReactNode;
  /** Se llama al seguir el enlace; el menú móvil lo usa para cerrarse. */
  onNavigate?: () => void;
  /** "location" en el enlace de la sección que se está leyendo. */
  "aria-current"?: "location" | undefined;
}

/**
 * Enlace a una sección de la portada. En la portada desplaza con suavidad;
 * desde otra página navega a la portada y React Router baja hasta la sección.
 */
export function SectionLink({
  section,
  className,
  children,
  onNavigate,
  ...rest
}: SectionLinkProps) {
  const locale = useLocale();
  const { pathname } = useLocation();

  if (!isHomePath(pathname)) {
    return (
      <Link
        to={sectionPath(locale, section)}
        className={className}
        onClick={onNavigate}
        viewTransition
        {...rest}
      >
        {children}
      </Link>
    );
  }

  /** Desplaza con suavidad; con teclas modificadoras o clic medio, el navegador decide. */
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
      return;
    if (!document.getElementById(section)) return;
    event.preventDefault();

    if (onNavigate) {
      // Primero se cierra el menú (que bloquea el scroll y deja el fondo inerte); después se desplaza.
      onNavigate();
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(section)));
    } else {
      scrollToSection(section);
    }
  }

  return (
    <a href={`#${section}`} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
