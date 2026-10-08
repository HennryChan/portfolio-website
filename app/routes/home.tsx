/** Portada ("/" y "/en"): todas las secciones del sitio. */
import { Hero } from "~/components/hero/hero";
import { About } from "~/components/sections/about";
import { Contact } from "~/components/sections/contact";
import { Experience } from "~/components/sections/experience";
import { Projects } from "~/components/sections/projects";
import { Stack } from "~/components/sections/stack";
import { experience } from "~/content/experience";
import { fullName, profile } from "~/content/profile";
import { site } from "~/content/site";
import { homePath, localeFromPathname } from "~/i18n/paths";
import { absoluteUrl, pageMeta } from "~/lib/seo";

import type { Route } from "./+types/home";

/**
 * Título, descripción, enlaces entre idiomas y datos estructurados
 * (JSON-LD de tipo Person) para buscadores. `worksFor` aparece solo
 * mientras haya un trabajo sin fecha de fin.
 */
export function meta({ location }: Route.MetaArgs) {
  const locale = localeFromPathname(location.pathname);
  const role = profile.role[locale];
  const currentJob = experience.find((job) => job.end === null);

  return [
    ...pageMeta({
      locale,
      title: `${fullName} — ${role}`,
      description: profile.tagline[locale],
      pathFor: homePath,
    }),
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Person",
        name: fullName,
        jobTitle: role,
        url: absoluteUrl(homePath(locale)),
        ...(site.email ? { email: `mailto:${site.email}` } : {}),
        address: { "@type": "PostalAddress", addressLocality: profile.location[locale] },
        sameAs: site.socials.map((social) => social.href),
        ...(currentJob ? { worksFor: { "@type": "Organization", name: currentJob.company } } : {}),
      },
    },
  ];
}

/** Hero, "Sobre mí" y las cuatro secciones del menú, en ese orden. */
export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <Hero />
      <About />
      <Projects />
      <Stack />
      <Experience />
      <Contact />
    </main>
  );
}
