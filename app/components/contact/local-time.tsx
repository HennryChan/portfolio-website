import { useSyncExternalStore } from "react";

import { profile } from "~/content/profile";
import { useLocale, useT } from "~/i18n/use-locale";

/**
 * Un "reloj" que avisa cada 15 s. React solo vuelve a pintar cuando cambia
 * el minuto, así que la hora nunca se atrasa más de 15 s.
 */
function subscribe(onChange: () => void) {
  const interval = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(interval);
}

/** Minutos desde 1970: cambia una vez por minuto y es fácil de comparar. */
const currentMinute = () => Math.floor(Date.now() / 60_000);

/**
 * Hora actual en la zona horaria del perfil (`profile.timezone`), en el
 * formato del idioma de la página. Solo se muestra en el navegador: en el
 * HTML prerenderizado quedaría la hora del build.
 */
export function LocalTime() {
  const locale = useLocale();
  const t = useT();
  const minute = useSyncExternalStore(subscribe, currentMinute, () => null);

  if (minute === null) return null;

  const time = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: profile.timezone,
  }).format(new Date(minute * 60_000));

  return <span>{t.contact.localTime(time)}</span>;
}
