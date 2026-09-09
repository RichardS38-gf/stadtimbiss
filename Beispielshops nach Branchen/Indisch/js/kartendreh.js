/* kartendreh.js — Anaar
   Dreht die Bilder der Speisekarte beim Scrollen leicht mit,
   nachdem sie eingeflogen sind.

   Zusammenspiel mit js/einfliegen.js: dort setzt der
   IntersectionObserver die Klasse ist-da, und indisch.css laesst
   das Bild dann mit transform 0.8s an seinen Platz fahren. Erst
   danach darf hier gedreht werden, sonst wuerde der inline
   gesetzte transform die Einflugbewegung abschneiden.

   Deshalb wartet jedes Bild nach ist-da 850ms, bekommt dann eine
   kurze, gleichmaessige Uebergangszeit und wird ab da gedreht.
   Die kurze Zeit glaettet das Ruckeln zwischen zwei
   Scrollschritten, ohne der Bewegung nachzuhaengen.

   Der Winkel haengt daran, wo das Bild im Fenster steht: unten
   angekommen dreht es in die eine Richtung, oben aus dem Bild
   heraus in die andere. Zeilen mit .zeile--gedreht drehen
   entgegengesetzt, damit sich die Richtungen abwechseln.

   Nur ab 900px und nicht bei prefers-reduced-motion. */

const SPANNE = 5;      // Grad in jede Richtung
const WARTEN = 850;    // ms, etwas mehr als die 0.8s des Einflugs

export function kartenDrehen() {
  if (!window.matchMedia('(min-width: 900px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const bilder = Array.from(document.querySelectorAll('.zeile__bild'));
  if (bilder.length === 0) return;

  const teile = bilder.map((el) => ({
    el,
    richtung: el.closest('.zeile--gedreht') === null ? 1 : -1,
    seit: 0,
    frei: false
  }));

  let angefordert = false;

  function zeichnen() {
    angefordert = false;
    const jetzt = performance.now();
    const hoehe = window.innerHeight;

    for (const teil of teile) {
      if (!teil.frei) {
        if (!teil.el.classList.contains('ist-da')) continue;
        if (teil.seit === 0) { teil.seit = jetzt; continue; }
        if (jetzt - teil.seit < WARTEN) continue;

        teil.frei = true;
        teil.el.style.willChange = 'transform';
        teil.el.style.transition = 'transform 0.2s linear';
      }

      const kasten = teil.el.getBoundingClientRect();
      const mitte = kasten.top + kasten.height / 2;

      // 0 heisst unten am Fensterrand, 1 oben
      let fortschritt = 1 - mitte / hoehe;
      if (fortschritt < 0) fortschritt = 0;
      if (fortschritt > 1) fortschritt = 1;

      const winkel = (fortschritt - 0.5) * 2 * SPANNE * teil.richtung;
      teil.el.style.transform = 'rotate(' + winkel.toFixed(2) + 'deg)';
    }
  }

  window.addEventListener('scroll', () => {
    if (angefordert) return;
    angefordert = true;
    requestAnimationFrame(zeichnen);
  }, { passive: true });

  /* Nach dem Einflug einmal von selbst nachziehen, damit ein Bild
     auch ohne weiteres Scrollen seinen Startwinkel bekommt. */
  window.setTimeout(zeichnen, WARTEN + 100);
  zeichnen();
}
