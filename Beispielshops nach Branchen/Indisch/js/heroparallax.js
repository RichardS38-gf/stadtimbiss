/* heroparallax.js — Anaar
   Verschiebt die freigestellten Gerichte im Hero beim Scrollen,
   jedes mit eigenem Tempo. Dadurch bekommt die weisse Flaeche
   Tiefe, obwohl alle Bilder flach nebeneinander liegen.

   Tempo und Drehung stehen im HTML an jedem Bild als data-tempo
   und data-dreh. So laesst sich das Zusammenspiel dort einstellen,
   ohne diese Datei anzufassen.

   Ein Tempo von 0.2 heisst: das Bild wandert ein Fuenftel des
   Scrollwegs mit nach unten, bleibt also gegenueber der Seite
   zurueck. Groessere Werte wirken naeher am Betrachter.

   Auf schmalen Schirmen liegt im Hero ein festes Foto, die
   Einzelbilder sind dort ausgeblendet. Dann macht dieses Modul
   nichts. */

export function heroParallax() {
  const hero = document.querySelector('.hero');
  if (hero === null) return;

  const bilder = Array.from(hero.querySelectorAll('.hero__gericht'));
  if (bilder.length === 0) return;

  if (!window.matchMedia('(min-width: 900px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const teile = bilder.map((bild) => ({
    el: bild,
    tempo: parseFloat(bild.dataset.tempo) || 0.2,
    dreh: parseFloat(bild.dataset.dreh) || 0
  }));

  let angefordert = false;

  function zeichnen() {
    angefordert = false;

    const y = window.scrollY;

    /* Ist der Hero durchgescrollt, lohnt das Rechnen nicht mehr.
       Die Bilder stehen dann ohnehin ausserhalb des Bildes, und
       overflow: hidden schneidet sie ab. */
    if (y > hero.offsetHeight + 200) return;

    for (const teil of teile) {
      const weg = y * teil.tempo;
      const winkel = teil.dreh * (y / 400);
      teil.el.style.transform =
        'translate3d(0, ' + weg.toFixed(1) + 'px, 0) rotate(' + winkel.toFixed(2) + 'deg)';
    }
  }

  window.addEventListener('scroll', () => {
    if (angefordert) return;
    angefordert = true;
    requestAnimationFrame(zeichnen);
  }, { passive: true });

  zeichnen();
}
