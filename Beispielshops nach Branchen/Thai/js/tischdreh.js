/* tischdreh.js — Sabai Sabai
   Abschnitt "Konzept" auf breiten Schirmen: das runde Tischbild
   bleibt beim Scrollen stehen und dreht sich, drumherum erscheint
   jeweils genau einer der vier Texte.

   Auf schmalen Schirmen steigt dieses Skript aus. Dort erledigt
   das Stylesheet alles: die Texte wechseln auf Zeit und das Bild
   dreht sich in Stufen mit. Der Grund ist die Hoehe. Ein Wechsel
   am Scrollstand braucht Scrollstrecke, und die Sektion soll auf
   dem Telefon flach bleiben.

   Laeuft das Skript nicht, stehen alle vier Texte untereinander.
   Das Ausblenden haengt an einer Klasse, die dieses Skript setzt. */

const DREHUNG_DESKTOP = 140;

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

  const schmal = window.matchMedia('(max-width: 900px)').matches;

  // Auf schmalen Schirmen macht das alles das Stylesheet: die
  // Texte wechseln dort auf Zeit und das Bild dreht sich in
  // Stufen mit. Ein Wechsel am Scrollstand braucht zwangslaeufig
  // Scrollstrecke, und die Sektion soll flach bleiben.
  if (schmal) return;

  bahn.classList.add('tisch-bahn--js');

  const drehung = DREHUNG_DESKTOP;

  let angefordert = false;

  function rechnen() {
    angefordert = false;

    const rect = bahn.getBoundingClientRect();
    const strecke = rect.height - window.innerHeight;
    if (strecke <= 0) return;

    // 0 sobald die Bahn oben anliegt, 1 wenn sie durchgelaufen ist
    let p = -rect.top / strecke;
    p = Math.min(1, Math.max(0, p));

    bild.style.transform = `rotate(${p * drehung}deg)`;

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
