import { useRef } from "react";

import { gsap, motionQueries, useGSAP } from "~/animation/gsap";
import { fullName, profile } from "~/content/profile";
import { useLocale, useT } from "~/i18n/use-locale";

import { Portrait } from "./portrait";

/**
 * Sección "Sobre mí": una declaración grande que se "enciende" con el
 * scroll y, debajo, foto, párrafos de detalle y datos breves (base,
 * experiencia, idiomas).
 */
export function About() {
  const locale = useLocale();
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const statement = profile.statement[locale];
  const words = statement.split(" ");

  // El texto se "enciende" palabra por palabra al ritmo del scroll.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQueries.ok, () => {
        gsap.fromTo(
          ".statement-word",
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.06,
            scrollTrigger: {
              trigger: ".statement",
              start: "top 80%",
              end: "bottom 50%",
              scrub: 0.5,
            },
          },
        );
      });
    },
    // Al cambiar de idioma cambian las palabras: se deshace y se vuelve a crear la animación.
    { scope: ref, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <section id="about" ref={ref} aria-labelledby="about-title" className="shell py-28 lg:py-40">
      <h2 id="about-title" className="sr-only">
        {t.about.title}
      </h2>

      <p className="statement max-w-[30ch] text-3xl leading-[1.18] font-semibold tracking-tight font-semiwide lg:text-[3.25rem]">
        {/* El texto completo para lectores de pantalla; las palabras sueltas solo se ven. */}
        <span className="sr-only">{statement}</span>
        <span aria-hidden="true">
          {words.map((word, index) => (
            <span key={index} className="statement-word">
              {word}{" "}
            </span>
          ))}
        </span>
      </p>

      <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-8">
        <Portrait
          className="max-w-sm lg:col-span-4 lg:max-w-none"
          label={t.about.portrait(fullName)}
        />

        <div className="space-y-5 text-lg text-ink-soft lg:col-span-4 lg:col-start-6 lg:self-end">
          {profile.details[locale].map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <dl className="grid content-end gap-6 text-base lg:col-span-3 lg:col-start-10">
          {profile.facts[locale].map((fact) => (
            <div key={fact.term} className="border-t border-line pt-3">
              <dt className="text-sm text-ink-soft">{fact.term}</dt>
              <dd className="mt-1 font-medium">{fact.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
