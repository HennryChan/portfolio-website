import { applyTheme, useTheme } from "~/hooks/use-theme";
import { useT } from "~/i18n/use-locale";
import { cn } from "~/lib/cn";

import { MoonIcon, SunIcon } from "../ui/icons";

/**
 * Cambia entre tema claro y oscuro. Los dos íconos están siempre en el
 * HTML y el CSS muestra el que corresponde (`.theme-icon-*` en app.css),
 * así que el botón es correcto incluso antes de hidratar.
 * `aria-pressed` = tema oscuro activo.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const t = useT();

  return (
    <button
      type="button"
      className={cn(
        "button grid size-10 place-items-center rounded-full text-ink-soft hover:bg-surface hover:text-ink",
        className,
      )}
      aria-label={t.theme.label}
      aria-pressed={theme === null ? undefined : theme === "dark"}
      onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
    >
      <MoonIcon className="theme-icon-moon" />
      <SunIcon className="theme-icon-sun" />
    </button>
  );
}
