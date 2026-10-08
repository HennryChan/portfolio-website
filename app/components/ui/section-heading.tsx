import { cn } from "~/lib/cn";

/** Props de SectionHeading. */
interface SectionHeadingProps {
  /** id del <h2>; la sección lo usa en `aria-labelledby`. */
  id: string;
  /** Título de la sección. */
  title: string;
  /** Una o dos líneas que presentan la sección. */
  intro?: string;
  /** Clases del contenedor. */
  className?: string;
}

/** Título (<h2>) y presentación breve con los que abre cada sección de la portada. */
export function SectionHeading({ id, title, intro, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <h2 id={id} className="text-4xl font-bold tracking-tight font-semiwide lg:text-5xl">
        {title}
      </h2>
      {intro && <p className="mt-5 max-w-xl text-lg text-ink-soft lg:text-xl">{intro}</p>}
    </div>
  );
}
