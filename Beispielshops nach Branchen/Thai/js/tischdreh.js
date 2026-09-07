/* tischdreh.js — Sabai Sabai
   Abschnitt "Konzept": das runde Tischbild bleibt beim Scrollen
   stehen und dreht sich, daneben wird der Text ausgetauscht.

   Auf breiten Schirmen liegen die vier Texte um das Bild herum,
   auf schmalen stehen Bild und Text nebeneinander. Der Ablauf ist
   in beiden Faellen derselbe, nur der Drehwinkel und das Layout
   unterscheiden sich. Deshalb gibt es hier nur eine Funktion.

   Kein Slider, kein Wischen, kein eigenes Scrollen: die Position
   ergibt sich allein daraus, wie weit die Sektion durchgelaufen
   ist. Damit kann der Browser nichts verstellen.

   Laeuft das Skript nicht, stehen alle vier Texte untereinander.
   Das Ausblenden haengt an Klassen, die dieses Skript setzt. */

const DREHUNG_DESKTOP = 140;

/* Auf Mobil mehr Drehung, weil das Bild kleiner ist und die
   Bewegung sonst kaum auffaellt. */
const DREHUNG_MOBIL = 270;

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
  bahn.classList.add(schmal ? 'tisch-bahn--mobil' : 'tisch-bahn--js');

  const drehung = schmal ? DREHUNG_MOBIL : DREHUNG_DESKTOP;

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
