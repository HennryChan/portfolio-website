---
description: Verificación completa antes de dar por terminado un cambio (tipos, lint, formato, pruebas, documentación, build y navegador).
---

# Verificar

1. Ejecuta la verificación estática y el build.
   // turbo
   `npm run check`
   Si falla, corrige la causa y vuelve a ejecutarlo. No desactives reglas ni pruebas para que pase.

2. Ejecuta el recorrido con navegador sobre el build: portada, idiomas, cada página del sitemap,
   404, formulario y pie de página.
   // turbo
   `npm run qa:smoke`

3. Si el cambio es visible (estilos, componentes, contenido), toma las capturas.
   // turbo
   `npm run qa:screenshots`
   Abre las de `qa/capturas/` que correspondan al cambio. Revisa ambos temas, el inglés y el móvil.
   El script avisa de errores en el navegador y de scroll horizontal.

4. Si el cambio fue solo de documentación y ya hay commits, confirma que no cambió el código.
   // turbo
   `npm run qa:comments`

5. Informa a Hennry en español:
   - qué cambiaste;
   - qué verificaste y con qué resultado (cifras reales: pruebas, páginas, capturas);
   - qué no pudiste verificar.
