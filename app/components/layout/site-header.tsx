/**
 * Cabecera fija de todas las páginas: logo, menú de secciones, idioma y
 * tema. En pantallas chicas el menú se abre a pantalla completa. Al bajar
 * por la página se oculta y reaparece al subir (estilos `.site-header`
 * en app.css).
 */
import { AnimatePresence, m } from "motion/react";
import { useCallback, useEffect, useRef, useState, type MouseEvent, type RefObject } from "react";
import { Link, useLocation } from "react-router";

import { fullName } from "~/content/profile";
import { useActiveSection } from "~/hooks/use-active-section";
import { homePath, isHomePath } from "~/i18n/paths";
import { useLocale, useT } from "~/i18n/use-locale";
import { cn } from "~/lib/cn";

import { SectionLink } from "../section-link";
import { scrollToTop, useLenis } from "../smooth-scroll";
import { CloseIcon, LogoMark, MenuIcon } from "../ui/icons";
import { LanguageSwitch } from "./language-switch";
import { ThemeToggle } from "./theme-toggle";

/** Secciones de la portada que aparecen en el menú, en el orden de la página. */
const sections = ["projects", "stack", "experience", "contact"] as const;
/** Fuera de la portada no hay secciones que marcar como activas. */
const noSections: readonly string[] = [];

/**
 * Cabecera con enlace para saltar al contenido, logo, navegación (con la
 * sección activa subrayada) y, en pantallas chicas, el botón del menú.
 */
export function SiteHeader() {
  const t = useT();
  const locale = useLocale();
  const { pathname } = useLocation();
  const onHome = isHomePath(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  // El menú se cierra solo al cambiar de página: guarda en qué ruta se abrió.
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null);
  const menuOpen = menuOpenedAt === pathname;
  const closeMenu = useCallback(() => setMenuOpenedAt(null), []);

  const active = useActiveSection(onHome ? sections : noSections);
  useHeaderScrollState(headerRef);
  useMenuSideEffects(menuOpen, closeMenu, lenis, menuButtonRef);

  const labels: Record<(typeof sections)[number], string> = {
    projects: t.nav.projects,
    stack: t.nav.stack,
    experience: t.nav.experience,
    contact: t.nav.contact,
  };

  /** En la portada, el logo sube al inicio con suavidad; Cmd/Ctrl + clic se respeta. */
  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!onHome || event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    closeMenu();
    scrollToTop();
  }

  return (
    <>
      <header
        ref={headerRef}
        className="site-header fixed inset-x-0 top-0 z-50 border-b border-transparent"
        // Si el foco del teclado entra a la cabecera oculta, vuelve a mostrarse.
        onFocusCapture={() => headerRef.current?.setAttribute("data-hidden", "false")}
      >
        {/* Saltar al contenido: solo se ve al llegar con el teclado. */}
        <a
          href="#main"
          className="sr-only rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper focus:not-sr-only focus:absolute focus:top-3 focus:left-4"
        >
          {t.skipToContent}
        </a>

        <div className="mx-auto flex h-(--header-h) max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
          <Link
            to={homePath(locale)}
            onClick={handleLogoClick}
            className="flex items-center gap-3 rounded-full"
            aria-label={`${fullName}, ${t.nav.home}`}
          >
            <LogoMark />
            <span className="hidden text-base font-semibold font-semiwide sm:inline">
              {fullName}
            </span>
          </Link>

          <nav aria-label={t.nav.label} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {sections.map((id) => (
                <li key={id} className="relative">
                  <SectionLink
                    section={id}
                    aria-current={active === id ? "location" : undefined}
                    className={cn(
                      "block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                      active === id ? "text-ink" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {labels[id]}
                  </SectionLink>
                  {/* La línea bajo la sección activa se desliza de un enlace al otro. */}
                  {active === id && (
                    <m.span
                      layoutId="nav-indicator"
                      className="pointer-events-none absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-ink"
                      transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                      aria-hidden="true"
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <LanguageSwitch className="hidden sm:block" />
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              className="button grid size-10 place-items-center rounded-full text-ink hover:bg-surface lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t.menu.close : t.menu.open}
              onClick={() => (menuOpen ? closeMenu() : setMenuOpenedAt(pathname))}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            key="mobile-menu"
            id="mobile-menu"
            className="fixed inset-x-0 top-(--header-h) bottom-0 z-40 flex flex-col justify-between overflow-y-auto bg-paper px-5 pt-10 pb-12 sm:px-8 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <nav aria-label={t.nav.label}>
              <ul className="flex flex-col gap-2">
                {sections.map((id, index) => (
                  <m.li
                    key={id}
                    initial={{ opacity: 0, transform: "translateY(12px)" }}
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    transition={{
                      delay: 0.04 + index * 0.04,
                      duration: 0.35,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                  >
                    <SectionLink
                      section={id}
                      onNavigate={closeMenu}
                      className="block py-2 text-4xl font-bold tracking-tight font-wide"
                    >
                      {labels[id]}
                    </SectionLink>
                  </m.li>
                ))}
              </ul>
            </nav>
            {/* Otro layoutId: si no, la píldora del menú "volaría" desde la de la cabecera. */}
            <LanguageSwitch className="mt-12 self-start" layoutId="language-pill-menu" />
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Fondo al hacer scroll; se oculta al bajar y reaparece al subir.
 *
 * @param ref - La cabecera. Recibe `data-scrolled` (ya no está arriba del
 * todo) y `data-hidden` (oculta), que app.css convierte en estilos.
 */
function useHeaderScrollState(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const header = ref.current;
    if (!header) return;

    let lastY = window.scrollY;
    let frame = 0;

    // Se oculta al bajar pasados los 200 px y reaparece al subir. Los 6 px de tolerancia
    // evitan que parpadee con movimientos mínimos del scroll.
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      header.dataset.scrolled = String(y > 8);
      if (y > lastY + 6 && y > 200) header.dataset.hidden = "true";
      else if (y < lastY - 6 || y <= 200) header.dataset.hidden = "false";
      lastY = y;
    };

    // Como mucho un cálculo por frame, aunque lleguen muchos eventos de scroll.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}

/**
 * Con el menú abierto: sin scroll de fondo, contenido inerte y Escape para cerrar.
 * Al abrirse, el foco pasa al primer enlace del menú.
 *
 * @param open - El menú está abierto.
 * @param close - Cierra el menú (Escape).
 * @param lenis - Scroll suave, que se detiene mientras el menú está abierto.
 * @param menuButtonRef - Botón que abre el menú; recupera el foco al cerrarlo.
 */
function useMenuSideEffects(
  open: boolean,
  close: () => void,
  lenis: ReturnType<typeof useLenis>,
  menuButtonRef: RefObject<HTMLButtonElement | null>,
) {
  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const menuButton = menuButtonRef.current;
    const background = [document.getElementById("main"), document.querySelector("footer")];
    root.style.overflow = "hidden";
    lenis?.stop();
    background.forEach((element) => element?.setAttribute("inert", ""));
    document.querySelector<HTMLElement>("#mobile-menu a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      root.style.overflow = "";
      lenis?.start();
      background.forEach((element) => element?.removeAttribute("inert"));
      window.removeEventListener("keydown", onKeyDown);
      // Si el foco quedó dentro del menú que se cierra, vuelve al botón que lo abrió.
      if (document.getElementById("mobile-menu")?.contains(document.activeElement)) {
        menuButton?.focus();
      }
    };
  }, [open, close, lenis, menuButtonRef]);
}
