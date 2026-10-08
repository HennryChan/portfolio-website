/**
 * Raíz de la app: el documento HTML (Layout), lo común a todas las
 * páginas (App: animación, scroll suave, cabecera y pie) y las pantallas
 * de carga (HydrateFallback) y de error (ErrorBoundary).
 *
 * Fuentes: Mona Sans (variable, con eje de ancho) para todo el texto y
 * Cascadia Code para los detalles "de terminal".
 */
import "@fontsource-variable/cascadia-code/index.css";
import "@fontsource-variable/mona-sans/wdth.css";
import "lenis/dist/lenis.css";
import "./styles/app.css";

import cascadiaCodeLatin from "@fontsource-variable/cascadia-code/files/cascadia-code-latin-wght-normal.woff2?url";
import monaSansLatin from "@fontsource-variable/mona-sans/files/mona-sans-latin-wdth-normal.woff2?url";
import { useEffect, type ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import { ScrollTrigger } from "./animation/gsap";
import { MotionProvider } from "./animation/motion-provider";
import { SiteFooter } from "./components/layout/site-footer";
import { SiteHeader } from "./components/layout/site-header";
import { SmoothScroll } from "./components/smooth-scroll";
import { themeInitScript } from "./hooks/use-theme";
import { localeFromPathname } from "./i18n/paths";
import { ui } from "./i18n/ui";

import type { Route } from "./+types/root";

/** Precarga las fuentes y declara los íconos del sitio (con la base del sitio, BASE_URL). */
export const links: Route.LinksFunction = () => [
  // La fuente del nombre del hero llega antes que el CSS que la pide.
  { rel: "preload", href: monaSansLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  // La frase-gancho del hero usa la fuente de terminal.
  {
    rel: "preload",
    href: cascadiaCodeLatin,
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.svg`, type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: `${import.meta.env.BASE_URL}apple-touch-icon.png` },
];

/**
 * El documento HTML de todas las páginas, también el de la 404 y el de
 * error. `lang` sale de la URL. El script del <head> pone el tema antes
 * de pintar para que no haya destello del tema equivocado.
 */
export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    // El script del <head> cambia data-theme y las clases antes de hidratar.
    <html lang={localeFromPathname(pathname)} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Color de la barra del navegador en móviles: el fondo (--paper) de cada tema. */}
        <meta name="theme-color" content="#edf0f3" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#141414" media="(prefers-color-scheme: dark)" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {import.meta.env.VITE_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${import.meta.env.VITE_GA_MEASUREMENT_ID}');`,
              }}
            />
          </>
        )}
        <Meta />
        <Links />
      </head>
      <body className="min-h-dvh bg-paper text-ink">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** Lo que comparten todas las páginas: proveedores de animación, cabecera, contenido y pie. */
export default function App() {
  useEffect(() => {
    // La entrada de la portada solo se ve en la primera carga, no al volver desde otra página.
    const timer = window.setTimeout(() => document.documentElement.classList.remove("intro"), 2600);
    // Con la fuente cargada cambian las alturas: ScrollTrigger recalcula sus posiciones.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <MotionProvider>
      <SmoothScroll>
        <SiteHeader />
        <Outlet />
        <SiteFooter />
      </SmoothScroll>
    </MotionProvider>
  );
}

/** Lo que se ve mientras carga la página de respaldo (404.html en GitHub Pages). */
export function HydrateFallback() {
  return <div className="min-h-dvh" />;
}

/**
 * Pantalla de error inesperado. Si la ruta respondió con un error, muestra
 * su código (p. ej. "404 Not Found"); si fue una excepción, en desarrollo
 * muestra el mensaje y publicado solo una indicación para recargar.
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { pathname } = useLocation();
  const t = ui[localeFromPathname(pathname)];
  const details = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : import.meta.env.DEV && error instanceof Error
      ? error.message
      : t.error.body;

  return (
    <main id="main" className="shell grid min-h-svh content-center gap-4">
      <h1 className="text-4xl font-extrabold font-wide">{t.error.title}</h1>
      <p className="text-lg text-ink-soft">{details}</p>
    </main>
  );
}
