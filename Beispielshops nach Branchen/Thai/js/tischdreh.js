/* tischdreh.js — Sabai Sabai
   Dreht das runde Tischbild im Abschnitt "So isst man bei uns"
   mit dem Scrollfortschritt und blendet dabei immer genau einen
   der vier Texte ein.

   Aufbau im HTML:
   - .tisch-bahn ist vier Bildschirmhoehen hoch
   - darin sitzt .tisch-buehne mit position sticky, eine
     Bildschirmhoehe hoch, und bleibt stehen
   - der Scrollfortschritt innerhalb der Bahn, ein Wert von 0 bis 1,
     steuert Drehwinkel und sichtbaren Text

   Laeuft das Skript nicht, bleiben alle vier Texte sichtbar. Das
   Stylesheet blendet sie nur aus, wenn die Klasse tisch-bahn--js
   gesetzt ist, und die setzt dieses Skript. So kann der Effekt den
   Inhalt nicht verschlucken. */

const DREHUNG_GRAD = 140;

export function tischDrehung() {
  const bahn = document.getElementById('tisch-bahn');
  const bild = document.getElementById('tisch-bild');
  if (bahn === null || bild === null) return;

  const punkte = Array.from(bahn.querySelectorAll('[data-punkt]'));
  if (punkte.length === 0) return;

  // Wer Bewegung reduziert haben moechte, bekommt die einfache
  // Liste. Ohne das waere fuer diese Nutzer nur einer von vier
  // Punkten sichtbar.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Auf schmalen Schirmen ist neben dem Bild kein Platz fuer Text.
  // Dort bleibt das Bild oben stehen und dreht sich weiter, die
  // Punkte laufen darunter durch und werden nacheinander
  // hervorgehoben.
  const schmal = window.matchMedia('(max-width: 900px)').matches;
  bahn.classList.add(schmal ? 'tisch-bahn--mobil' : 'tisch-bahn--js');

  let angefordert = false;

  function rechnen() {
    angefordert = false;

    const rect = bahn.getBoundingClientRect();
    const strecke = rect.height - window.innerHeight;
    if (strecke <= 0) return;

    // 0 sobald die Bahn oben anliegt, 1 wenn sie durchgelaufen ist
    let p = -rect.top / strecke;
    p = Math.min(1, Math.max(0, p));

    bild.style.transform = `rotate(${p * DREHUNG_GRAD}deg)`;

    // Auf Mobil richtet sich der aktive Punkt danach, welcher der
    // Fenstermitte am naechsten steht. Das ist genauer als der
    // Scrollfortschritt, weil die Punkte dort unterschiedlich hoch
    // sind.
    if (schmal) {
      const mitte = window.innerHeight * 0.55;
      let bester = 0;
      let kleinster = Infinity;

      punkte.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const abstand = Math.abs(r.top + r.height / 2 - mitte);
        if (abstand < kleinster) {
          kleinster = abstand;
          bester = i;
        }
      });

      punkte.forEach((el, i) => {
        el.classList.toggle('tisch-punkt--an', i === bester);
      });
      return;
    }

    // Die Bahn in so viele Abschnitte teilen, wie es Texte gibt.
    // Das 0.999 verhindert, dass am Ende ein Index zu hoch kommt.
    const index = Math.min(
      punkte.length - 1,
      Math.floor(p * punkte.length * 0.999)
    );

    punkte.forEach((el, i) => {
      el.classList.toggle('tisch-punkt--an', i === index);
    });
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
