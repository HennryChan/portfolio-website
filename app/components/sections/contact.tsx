import { profile } from "~/content/profile";
import { sectionIntros } from "~/content/sections";
import { site } from "~/content/site";
import { useLocale, useT } from "~/i18n/use-locale";

import { ContactForm } from "../contact/contact-form";
import { CopyEmail } from "../contact/copy-email";
import { LocalTime } from "../contact/local-time";

/** Subrayado grueso que se oscurece al pasar el puntero. */
const linkClass =
  "underline decoration-line decoration-2 underline-offset-[6px] hover:decoration-ink";

/**
 * Sección de contacto: el formulario y, al lado, el correo (con botón para
 * copiarlo), la ubicación con la hora local y los enlaces a redes y CV.
 * El correo y el CV aparecen solo si están configurados en app/content/site.ts.
 */
export function Contact() {
  const locale = useLocale();
  const t = useT();

  return (
    <section id="contact" aria-labelledby="contact-title" className="shell py-28 lg:py-40">
      <div className="max-w-4xl">
        <h2
          id="contact-title"
          className="text-4xl font-extrabold tracking-tight font-wide sm:text-5xl lg:text-6xl"
        >
          {t.contact.title}
        </h2>
        <p className="mt-6 max-w-xl text-lg text-ink-soft lg:text-xl">
          {sectionIntros.contact[locale]}
        </p>
      </div>

      <div className="mt-16 grid gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-8">
        <ContactForm className="lg:col-span-7" />

        <dl className="space-y-10 lg:col-span-4 lg:col-start-9">
          {site.email && (
            <div>
              <dt className="text-sm text-ink-soft">{t.contact.email}</dt>
              <dd className="mt-2 space-y-3">
                <a
                  href={`mailto:${site.email}`}
                  className={`block text-2xl font-semibold break-all font-semiwide ${linkClass}`}
                >
                  {site.email}
                </a>
                <CopyEmail email={site.email} />
              </dd>
            </div>
          )}

          <div>
            <dt className="text-sm text-ink-soft">{t.contact.location}</dt>
            <dd className="mt-2">
              <p className="text-lg font-medium">{profile.location[locale]}</p>
              <p className="mt-1 text-sm text-ink-soft">
                <LocalTime />
              </p>
            </dd>
          </div>

          <div>
            <dt className="text-sm text-ink-soft">{t.contact.elsewhere}</dt>
            <dd className="mt-2">
              <ul className="space-y-1.5 text-lg font-medium">
                {site.socials.map((social) => (
                  <li key={social.href}>
                    <a href={social.href} rel="me" className={linkClass}>
                      {social.label}
                    </a>
                  </li>
                ))}
                {site.cv && (
                  <li>
                    {/* BASE_URL: el PDF vive en public/, que puede estar bajo un subdirectorio. */}
                    <a
                      href={`${import.meta.env.BASE_URL}${site.cv[locale].replace(/^\//, "")}`}
                      className={linkClass}
                    >
                      CV (PDF)
                    </a>
                  </li>
                )}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
