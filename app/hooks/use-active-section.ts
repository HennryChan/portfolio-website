import { useEffect, useState } from "react";

/**
 * Devuelve la sección que cruza la "línea de lectura" (un poco arriba del
 * centro de la pantalla). Con la lista vacía no observa nada.
 *
 * @param ids - Ids de las secciones, en el orden de la página. Si varias
 * cruzan la línea a la vez, gana la primera de la lista.
 * @returns El id de la sección activa, o `null` si ninguna cruza la línea.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  // Un texto en vez del arreglo: el efecto no se repite si llega otro arreglo con los mismos ids.
  const key = ids.join(",");

  useEffect(() => {
    const sectionIds = key ? key.split(",") : [];
    if (sectionIds.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActive(sectionIds.find((id) => visible.has(id)) ?? null);
      },
      // La "línea" es la franja entre el 40 % y el 45 % de la altura de la pantalla.
      { rootMargin: "-40% 0px -55% 0px" },
    );

    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [key]);

  // Sin secciones (fuera de la portada) no queda marcada la última que estuvo activa.
  return key ? active : null;
}
