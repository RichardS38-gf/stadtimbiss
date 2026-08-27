/* schreibmaschine.js — Pommes Paul
   Schreibt das Zitat im Emailleschild Zeichen fuer Zeichen aus,
   sobald der Abschnitt ins Bild kommt.

   Der vollstaendige Text steht im HTML. Dieses Skript merkt ihn
   sich, leert das Element und tippt ihn dann. Laeuft es nicht,
   etwa ueber file://, steht das Zitat einfach da. So kann der
   Effekt den Inhalt nicht verschlucken.

   Vor dem Leeren wird die Hoehe des Absatzes festgehalten. Ohne
   das waechst der Kasten waehrend des Tippens und alles darunter
   ruckelt nach unten. */

const TEMPO_MS = 14;

export function zitatSchreiben() {
  const el = document.querySelector('.schild__text');
  if (el === null) return;

  // Wer Bewegung reduziert haben moechte, bekommt den fertigen Text
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const voll = el.textContent.trim().replace(/\s+/g, ' ');
  if (voll.length === 0) return;

  el.style.minHeight = el.offsetHeight + 'px';
  el.textContent = '';

  let gestartet = false;

  const beobachter = new IntersectionObserver(
    (eintraege) => {
      for (const eintrag of eintraege) {
        if (!eintrag.isIntersecting || gestartet) continue;
        gestartet = true;
        beobachter.disconnect();
        tippen();
      }
    },
    { threshold: 0.15 }
  );

  beobachter.observe(el);

  function tippen() {
    el.classList.add('schild__text--schreibt');
    let i = 0;

    const uhr = setInterval(() => {
      i += 1;
      el.textContent = voll.slice(0, i);

      if (i >= voll.length) {
        clearInterval(uhr);
        el.classList.remove('schild__text--schreibt');
      }
    }, TEMPO_MS);
  }
}
