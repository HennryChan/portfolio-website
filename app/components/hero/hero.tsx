import type { CSSProperties } from "react";

import { profile } from "~/content/profile";
import { useLocale, useT } from "~/i18n/use-locale";

import { SectionLink } from "../section-link";
import { buttonClass, Magnetic } from "../ui/button";
import { BadgeIcon } from "../ui/icons";
import { HeroHook } from "./hero-hook";
import { HeroVisual } from "./hero-visual";

/** Retraso (ms) de cada elemento en la entrada; ver `.intro [data-intro]` en app.css. */
const delay = (ms: number) => ({ "--delay": ms }) as CSSProperties;

/**
 * Portada: frase-gancho, nombre, rol, resumen, certificación y los dos
 * botones principales; al lado, las cuatro capas de una aplicación
 * (HeroVisual). En la primera carga cada elemento entra con su propio
 * retraso; sin JavaScript todo se ve de inmediato.
 */
export function Hero() {
  const locale = useLocale();
  const t = useT();

  // El tamaño del nombre depende de su palabra más larga para no desbordar la columna:
  // cada letra mide en promedio 0.66 veces el tamaño de la fuente.
  const longest = Math.max(profile.firstName.length, profile.lastName.length);
  const nameFit = {
    "--name-fit": `calc(100cqi / ${(longest * 0.66).toFixed(2)})`,
  } as CSSProperties;

  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="shell grid min-h-svh items-center gap-x-8 gap-y-14 pt-[calc(var(--header-h)+3rem)] pb-16 lg:grid-cols-12 lg:pb-24">
        <div className="hero-copy lg:col-span-6" style={nameFit}>
          {profile.availability && (
            <p
              data-intro
              style={delay(0)}
              className="mb-8 flex items-center gap-2.5 text-sm text-ink-soft"
            >
              <span className="size-2 rounded-full bg-ok" aria-hidden="true" />
              {profile.availability[locale]}
            </p>
          )}

          {profile.hook && <HeroHook text={profile.hook[locale]} />}

          <h1 id="hero-title" className="hero-name">
            <span className="hero-name-line">
              <span style={{ "--i": 0 } as CSSProperties}>{profile.firstName}</span>
            </span>
            <span className="hero-name-line">
              <span style={{ "--i": 1 } as CSSProperties}>{profile.lastName}</span>
            </span>
          </h1>

          <p
            data-intro
            style={delay(700)}
            className="mt-8 text-2xl font-semibold text-balance font-semiwide"
          >
            {profile.role[locale]}
          </p>
          <p
            data-intro
            style={delay(800)}
            className="mt-4 max-w-[42ch] text-lg text-ink-soft lg:text-xl"
          >
            {profile.tagline[locale]}
          </p>
          {profile.credential && (
            <p
              data-intro
              style={delay(860)}
              className="mt-6 flex items-center gap-2.5 text-sm font-medium"
            >
              <BadgeIcon className="shrink-0 text-layer-ui" width={20} height={20} />
              {profile.credential[locale]}
            </p>
          )}

          <div data-intro style={delay(920)} className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <SectionLink section="projects" className={buttonClass("primary")}>
                {t.hero.viewProjects}
              </SectionLink>
            </Magnetic>
            <Magnetic>
              <SectionLink section="contact" className={buttonClass("secondary")}>
                {t.hero.contact}
              </SectionLink>
            </Magnetic>
          </div>
        </div>

        <HeroVisual className="lg:col-span-6" />
      </div>
    </section>
  );
}
