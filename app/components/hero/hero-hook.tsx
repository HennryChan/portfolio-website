import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useRef } from "react";

import { gsap, useGSAP } from "~/animation/gsap";

// ScrambleText solo se usa aquí, así que se registra aquí y no en animation/gsap.ts.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrambleTextPlugin);
}

/** Caracteres de "texto cifrado": hexadecimal en minúsculas, como un hash SHA-256. */
const CIPHER = "0123456789abcdef";

/** Cada oración va en su propia línea: la frase se lee en dos tiempos, no como un párrafo. */
const splitSentences = (text: string) => text.split(/(?<=[.!?])\s+(?=\S)/);

/**
 * Frase breve sobre el nombre, escrita como en una terminal: prompt al
 * inicio, cursor al final y, en la primera carga, cada línea se "descifra"
 * desde un hash. Con fuente monoespaciada cada carácter cifrado ocupa lo
 * mismo que la letra final, así que nada se mueve. El texto real está
 * siempre en el HTML para buscadores y lectores de pantalla.
 *
 * Sin JavaScript, con "reducir movimiento" o al volver desde otra página,
 * la frase se muestra completa (respaldo `.hero-hook` en app.css).
 */
export function HeroHook({
  text,
}: {
  /** Frase completa, p. ej. "Primero entiendo el problema. Después escribo el código." */
  text: string;
}) {
  const container = useRef<HTMLParagraphElement>(null);
  const sentences = splitSentences(text);

  useGSAP(
    () => {
      const root = document.documentElement;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!container.current || !root.classList.contains("intro") || reduceMotion) return;

      // Todas las líneas arrancan cifradas a la vez; cada una se descifra un poco después que la anterior.
      gsap.utils.toArray<HTMLElement>(".hook-line-text").forEach((line, index) => {
        gsap.to(line, {
          duration: 1.5 + index * 0.4,
          ease: "none",
          scrambleText: {
            text: sentences[index],
            chars: CIPHER,
            // Segundos que la línea se queda cifrada antes de empezar a revelar el texto.
            revealDelay: 0.45 + index * 0.4,
            // Frecuencia con la que cambian los caracteres cifrados (1 = la de GSAP por defecto).
            speed: 0.45,
            // Clase de los caracteres que aún no se revelan (color propio en app.css).
            oldClass: "hook-cipher",
          },
          // La frase aparece recién cuando ya está cifrada: no hay destello del texto final.
          onStart: () => container.current?.classList.add("is-live"),
        });
      });
    },
    { scope: container, dependencies: [text] },
  );

  return (
    <p ref={container} className="hero-hook mb-7 font-mono text-base text-ink-soft lg:text-lg">
      <span className="sr-only">{text}</span>
      {sentences.map((sentence, index) => (
        // key con el texto: si cambia el idioma, React crea nodos nuevos en vez de pisar los que animó GSAP.
        <span key={`${index}-${sentence}`} aria-hidden="true" className="relative block pl-[2ch]">
          {index === 0 && <span className="absolute top-0 left-0 text-code-accent">&gt;</span>}
          <span className="relative inline-block overflow-hidden align-top">
            {/* Reserva el espacio exacto de la línea final. */}
            <span className="invisible">{sentence}</span>
            <span className="hook-line-text absolute inset-0 wrap-anywhere">{sentence}</span>
          </span>
          {index === sentences.length - 1 && <span className="hook-caret" />}
        </span>
      ))}
    </p>
  );
}
