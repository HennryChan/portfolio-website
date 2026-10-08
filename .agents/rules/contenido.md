---
trigger: glob
globs: "app/content/**, app/i18n/ui.ts, README.md"
---

# Contenido del sitio

Aplica al editar perfil, proyectos, stack, experiencia, textos de sección o textos de la interfaz.

## Hechos

- Todo dato sobre trabajos, proyectos, fechas, cifras o tecnologías debe tener una fuente. Las
  fuentes usadas hasta ahora fueron:
  - el CV de Hennry (2026);
  - su portafolio anterior (https://hennrychan.github.io/dev_portfolio/);
  - su perfil público de GitHub (`hennrychan`);
  - las páginas públicas de PKI Reports en cegasecurity.com.
- LinkedIn no se puede leer de forma automática (devuelve HTTP 999). No lo cites como fuente.
- Si falta un dato, pregúntalo a Hennry. No lo deduzcas ni lo completes con algo plausible. Si no
  hay dato, deja el campo opcional vacío: la página oculta lo que no existe.
- En cada proyecto, `features` es lo que hace el producto (información pública) y `solution` es lo
  que hizo Hennry. No los mezcles.
- Las cifras del caso de estudio «Este portafolio» (`slug: "portafolio"`) salen del registro de la
  sesión de Claude Code:
  - 15 mensajes, 523 acciones, 83 capturas y 20 skills;
  - etapas de 49 min, 1 h 11 min, 1 h 56 min, 36 min, 33 min, 37 min y 35 min.

  Un segundo agente las verificó. No las cambies. Para trabajo nuevo hecho con Antigravity, agrega
  etapas o resultados nuevos con datos propios (usa `/caso-de-estudio`).

## Privacidad y permisos

- **Correo público:** dev.hennry.chan@gmail.com. El correo del CV no se publica.
- **Datos personales:** no se publica el teléfono. La ubicación se muestra como «Yucatán, México».
- **PKI Reports:** no hay permiso para usar capturas, así que se queda la ilustración SVG
  (`art.variant: "certificates"`). Es un producto de CEGA Security: Hennry participó en su nueva
  versión (dic 2025–2026). El texto no debe sonar a venta ni presentarlo como suyo.
- **Fecha de fin en CEGA:** octubre de 2026 es una deducción y no está confirmada. No la uses como
  hecho en textos nuevos hasta que Hennry la confirme.

## Idiomas

- Todo texto visible va en `{ es, en }` con el mismo significado y las mismas cifras. Si es una
  lista, los dos idiomas llevan la misma cantidad de elementos; la prueba de contenido lo exige.
- Los nombres propios y las tecnologías pueden ir como texto simple (`MaybeLocalized`). Se leen con
  `localize(value, locale)`.
- En español: «ingeniero de software», con acentos y signos de apertura. En inglés, ortografía de
  EE. UU.

## Tono

- Concreto, no genérico: nombra productos, empresas, certificaciones y cifras reales. Hennry
  rechazó textos «ambiguos».
- Frases cortas, voz activa y sin adjetivos de venta.
- El puesto es «Ingeniero de Software» / «Software Engineer», sin «full stack» en el título.
- La frase del hero es «Primero entiendo el problema. Después escribo el código.» La eligió Hennry;
  no la cambies sin que lo pida.

## Al terminar

Ejecuta `npm test`: valida idiomas, imágenes, slugs, capas, orden del stack y fechas. Después,
`npm run check`.
