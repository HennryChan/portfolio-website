---
description: Conectar el formulario de contacto a Formspree o Web3Forms para que deje el modo demostración.
---

# Conectar el formulario de contacto

Hoy `site.contactForm.endpoint` está vacío. Por eso el formulario valida, simula el envío y avisa
que no se mandó nada (modo demostración).

1. **Pregunta a Hennry qué servicio prefiere** y pídele los datos. Él crea la cuenta; tú no.
   - **Formspree:** URL `https://formspree.io/f/<id>`.
   - **Web3Forms:** URL `https://api.web3forms.com/submit` y una `access_key`. La llave de Web3Forms
     es pública por diseño (va en el navegador). Aun así, confírmalo con él antes de guardarla en
     el repositorio.

2. **Configura `app/content/site.ts`:**
   - Formspree: `contactForm: { endpoint: "https://formspree.io/f/<id>" }`.
   - Web3Forms: `contactForm: { endpoint: "https://api.web3forms.com/submit", extraFields: { access_key: "<llave>" } }`.

   El formulario envía un JSON con `name`, `email` y `message`, más los `extraFields`. Revisa
   `app/components/contact/contact-form.tsx` si el servicio pide otro formato.

3. **Verifica sin enviar mensajes reales:**
   // turbo
   `npm run build && npm run qa:smoke`

   La prueba de humo intercepta los envíos y espera el mensaje de éxito.

4. **Prueba real:** pídele a Hennry que envíe un mensaje desde el sitio ya publicado y confirme que
   le llegó al correo.

5. El texto del modo demostración (`ui.ts`, `contact.form.demo`) deja de verse solo. No hace falta
   borrarlo: sigue siendo el respaldo si se vacía el endpoint.
