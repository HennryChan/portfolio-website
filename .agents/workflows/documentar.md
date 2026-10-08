---
description: Documentar código nuevo o cambiado en español (TSDoc) y comprobar que el comportamiento no cambie.
---

# Documentar

1. Busca lo que falta.
   // turbo
   `npm run qa:docs`

2. Documenta en español siguiendo el estilo del proyecto:
   - **Inicio de cada archivo:** para qué sirve. Si exporta un solo componente, basta con la
     documentación de ese componente.
   - **Funciones, componentes, constantes, tipos y cada campo de interfaz:** `/** … */`. Agrega
     `@param` y `@returns` cuando no sean obvios.
   - **Explica el porqué:** decisiones, límites del navegador, accesibilidad. No repitas lo que el
     código dice.
   - **Props convencionales** (`className`, `children`): no necesitan comentario.

3. Formatea y vuelve a contar; el resultado debe ser 0.
   // turbo
   `npx prettier --write <archivos> && npm run qa:docs`

4. Si solo documentaste, confirma que el código no cambió respecto del último commit.
   // turbo
   `npm run qa:comments`

5. Termina con `/verificar`.
