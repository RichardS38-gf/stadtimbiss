/* einfliegen.js — Anaar
   Die Bilder in der Speisekarte fliegen beim Scrollen von der
   Seite herein, auf der sie stehen.

   Die Klasse fuer den Startzustand setzt das Skript selbst am
   Abschnitt. Laeuft es nicht, sind die Bilder normal sichtbar
   statt unsichtbar zu bleiben. Das ist der Grund, warum das
   Ausblenden nicht direkt im Stylesheet steht.

   Beobachtet wird mit IntersectionObserver, nicht mit einem
   Scroll-Ereignis. Der Browser meldet dann selbst, wann ein Bild
   ins Bild kommt, und es muss bei jedem Scrollen nichts
   gerechnet werden. */

export function bilderEinfliegen() {
  const abschnitt = document.getElementById('karte');
  if (abschnitt === null) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const bilder = Array.from(abschnitt.querySelectorAll('.zeile__bild'));
  if (bilder.length === 0) return;

  // Erst jetzt den Startzustand setzen, damit die Bilder ohne
  // Skript nicht verschwinden.
  abschnitt.classList.add('kat-flug');

  const beobachter = new IntersectionObserver((eintraege) => {
    eintraege.forEach((eintrag) => {
      if (!eintrag.isIntersecting) return;
      eintrag.target.classList.add('ist-da');
      // Einmal eingeflogen, muss nicht weiter beobachtet werden.
      beobachter.unobserve(eintrag.target);
    });
  }, {
    // Erst auslösen, wenn das Bild ein Stück im Fenster ist.
    // Sonst fliegt es genau am unteren Rand herein und man
    // bekommt die Bewegung nicht mit.
    rootMargin: '0px 0px -18% 0px',
    threshold: 0.15
  });

  bilder.forEach((bild) => beobachter.observe(bild));
}
