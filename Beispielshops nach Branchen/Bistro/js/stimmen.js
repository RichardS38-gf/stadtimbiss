/* stimmen.js — Café Marlene
   Wandernde Hervorhebung in der Bewertungssektion.

   Alle TAKT_MS wechselt das aktive Zitat: es steht voll deckend da,
   die anderen treten zurueck, und links faehrt ein feiner Strich
   in Rosé auf.

   Zwei Bremsen, damit die Dauerbewegung nicht stoert:
   - Der Wechsel laeuft nur, solange die Sektion im Viewport steht.
     Ausserhalb wird die Uhr angehalten, sonst springt beim
     Zurueckscrollen ein voellig anderes Zitat an.
   - Solange der Zeiger ueber der Liste steht, pausiert sie. Wer
     gerade liest, wird nicht unterbrochen.

   Das Abdunkeln haengt an der Klasse stimmen--rotiert, die dieses
   Skript selbst setzt. Laeuft es nicht, etwa ueber file://, stehen
   alle drei Zitate normal lesbar da. */

const TAKT_MS = 7000;

export function stimmenRotieren() {
  const liste = document.querySelector('.stimmen');
  if (liste === null) return;

  const stimmen = Array.from(liste.querySelectorAll('.stimme'));
  if (stimmen.length < 2) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  liste.classList.add('stimmen--rotiert');

  let aktiv = 0;
  stimmen[0].classList.add('stimme--aktiv');

  let uhr = 0;
  let pausiert = false;

  function weiter() {
    stimmen[aktiv].classList.remove('stimme--aktiv');
    aktiv = (aktiv + 1) % stimmen.length;
    stimmen[aktiv].classList.add('stimme--aktiv');
  }

  function starten() {
    if (uhr !== 0 || pausiert) return;
    uhr = setInterval(weiter, TAKT_MS);
  }

  function anhalten() {
    clearInterval(uhr);
    uhr = 0;
  }

  const beobachter = new IntersectionObserver(
    (eintraege) => {
      for (const eintrag of eintraege) {
        if (eintrag.isIntersecting) starten();
        else anhalten();
      }
    },
    { threshold: 0.2 }
  );
  beobachter.observe(liste);

  liste.addEventListener('mouseenter', () => {
    pausiert = true;
    anhalten();
  });

  liste.addEventListener('mouseleave', () => {
    pausiert = false;
    starten();
  });
}
