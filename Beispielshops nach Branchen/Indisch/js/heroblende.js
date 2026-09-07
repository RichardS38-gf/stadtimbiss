/* heroblende.js — Anaar
   Beim Scrollen wandert der Inhalt des Heros langsam nach oben
   und blendet dabei aus.

   Der Fortschritt ergibt sich allein daraus, wie weit die Seite
   gescrollt ist, gemessen an der Hoehe des Heros. Kein Zeitgeber,
   keine Beobachter: die Bewegung folgt dem Finger und laesst
   sich nicht verstellen.

   Bei 60 Prozent der Hero-Hoehe ist der Inhalt ganz verschwunden.
   Weiter unten muss nicht gerechnet werden, deshalb bricht die
   Funktion dort ab.

   Wer Bewegung reduziert haben moechte, sieht den Inhalt
   unveraendert stehen. */

const WEG_PX = 80;      // wie weit der Inhalt nach oben wandert
const ENDE = 0.6;       // Anteil der Hero-Hoehe bis zum Verschwinden

export function heroBlende() {
  const hero = document.querySelector('.hero');
  const inhalt = document.querySelector('.hero__inhalt');
  if (hero === null || inhalt === null) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let angefordert = false;

  function rechnen() {
    angefordert = false;

    const hoehe = hero.offsetHeight;
    if (hoehe <= 0) return;

    // 0 am Seitenanfang, 1 wenn der Inhalt verschwunden ist
    let p = window.scrollY / (hoehe * ENDE);
    p = Math.min(1, Math.max(0, p));

    inhalt.style.opacity = String(1 - p);
    inhalt.style.transform = `translateY(${-p * WEG_PX}px)`;
  }

  function anfordern() {
    if (angefordert) return;
    angefordert = true;
    requestAnimationFrame(rechnen);
  }

  window.addEventListener('scroll', anfordern, { passive: true });
  window.addEventListener('resize', anfordern);
  rechnen();
}
