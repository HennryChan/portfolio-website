---
description: Actualizar el caso de estudio «Este portafolio» con trabajo nuevo hecho con agentes de IA, solo con datos medidos.
---

# Actualizar el caso de estudio «Este portafolio»

El caso de estudio (`slug: "portafolio"` en `app/content/projects.ts`) cuenta cómo se construyó el
sitio dirigiendo a un agente de IA. Sus cifras actuales vienen del registro de la sesión de Claude
Code y un segundo agente las verificó en dos rondas. Son estas:

- **Duraciones:** etapas de 49 min, 1 h 11 min, 1 h 56 min, 36 min, 33 min, 37 min y 35 min.
- **Dirección:** 15 mensajes y 523 acciones del agente.
- **Verificación:** 83 capturas, 20 skills y de 304 a 0 elementos sin documentar.

No las cambies. Para trabajo nuevo:

1. **Mide mientras trabajas.** Anota la hora de inicio y de fin de cada etapa, cuántos mensajes de
   Hennry hubo y qué hizo el agente. No reconstruyas cifras de memoria; si no se midió, no se
   publica.

2. **Agrega lo nuevo sin borrar lo anterior:**
   - Una etapa nueva en `process` (en `es` y `en`, con la misma `duration`), por ejemplo «Nueva
     función con Antigravity». Agrégala antes o después de «Este caso de estudio», según el orden
     real.
   - Si cambian las herramientas, actualiza `team` y `context` («Claude Code y Antigravity»). Deja
     claro qué parte hizo cada una.
   - Agrega un resultado nuevo solo si es una cifra medida, y di hasta cuándo se midió.

3. **Respeta lo que ya se comprobó:**
   - Sí hubo verificación con un segundo agente: Claude Code lo lanzó solo para revisar el texto
     del caso de estudio.
   - El sitio lo construyó un solo agente. No hubo «varios agentes coordinados».
   - El agente trabajó en modo automático. Hennry no aprobó cada cambio: dirigió con objetivos,
     respuestas y correcciones.
   - Las citas de Hennry van parafraseadas, nunca entre comillas si no son literales.

4. **Pide una revisión independiente:** que otra conversación del agente compare cada afirmación
   nueva con la evidencia (registro, commits, código) y corrige lo que señale.

5. **Verifica.**
   // turbo
   `npm test`

   Después sigue `/verificar`. La prueba de contenido exige la misma duración por etapa en ambos
   idiomas.
