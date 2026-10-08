---
description: Revisión visual con capturas reales en tema claro y oscuro, español e inglés, escritorio y móvil.
---

# Revisar el diseño

1. Compila el sitio.
   // turbo
   `npm run build`

2. Toma las capturas. Agrega un filtro para limitarlas: `-- movil`, `-- proyecto-pki-reports` o
   `-- dark`.
   // turbo
   `npm run qa:screenshots`

3. Revisa cada captura de `qa/capturas/` con la regla de diseño (`.agents/rules/diseno.md`):
   - Contraste y legibilidad en ambos temas.
   - Colores de sintaxis bien usados: tecnologías en `--code-tech`, fechas en `--code-number`.
   - Nada cortado ni desbordado en 390 px.
   - El 3D visible en el hero de escritorio.
   - Las animaciones de entrada ya terminadas en la captura (el script espera 4.5 s).

4. Para revisar movimiento o interacción (hover, menú móvil, scroll), usa las skills
   `review-animations` y `web-design-guidelines`. Usa `accessibility` para una auditoría WCAG.

5. Informa lo que encontraste con referencias concretas (archivo y captura) antes de cambiar algo
   grande. Los ajustes pequeños los puedes hacer directamente.
