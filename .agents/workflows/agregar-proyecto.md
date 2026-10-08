---
description: Agregar o actualizar un proyecto del portafolio con datos verificables, en español e inglés.
---

# Agregar o actualizar un proyecto

1. **Reúne los hechos antes de escribir.** Pregunta a Hennry lo que no tenga fuente:
   - nombre y organización;
   - periodo;
   - su rol y lo que hizo él;
   - tecnologías por capa;
   - enlaces públicos;
   - si hay permiso para usar capturas.

   Lee las páginas públicas del proyecto si existen. No inventes cifras ni resultados.

2. **Agrega el proyecto en `app/content/projects.ts`.** El orden de la lista es el orden en la
   portada. Los campos están documentados en `app/content/types.ts`.
   - `slug`: minúsculas y guiones. No cambiarlo después.
   - `summary` y `context`: obligatorios, en `es` y `en`.
   - `features`: lo que hace el producto. `solution`: lo que hizo Hennry, empezando con un verbo
     en pasado («Participé…», «Optimicé…»).
   - `architecture`: tecnologías por capa (`ui`, `api`, `data`, `infra`). La primera de cada capa
     resume el stack en la tarjeta.
   - `results`: solo cifras reales, de una a tres.
   - `art`: siempre, como respaldo. Elige `variant` y `hue` (de 0 a 360).

3. **Si hay captura con permiso:**
   - guárdala en `images/<nombre>.png`;
   - ejecuta `npm run images`;
   - agrega `image: { src: "<nombre>", ratio: <ancho> / <alto>, alt: { es, en } }`.

4. **Si el proyecto es de una empresa:** cuida el tono. Hennry participó; el producto no es suyo
   (ver la regla de contenido).

5. **Verifica.**
   // turbo
   `npm test`

   Después, sigue `/verificar`. Revisa la tarjeta en la portada y la página del proyecto en ambos
   idiomas y en móvil (`npm run qa:screenshots -- proyecto-<slug>`).
