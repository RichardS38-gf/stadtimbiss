/* kategorien.js — Sabai Sabai
   Wechselt das Bild im Abschnitt "Vier Wege, satt zu werden",
   sobald die Maus auf eine der vier Zeilen kommt.

   Die vier Bilder liegen alle im HTML uebereinander, sichtbar ist
   immer nur eines. So gibt es beim Wechsel kein Nachladen und
   damit kein Flackern.

   Laeuft das Skript nicht, bleibt das erste Bild stehen und die
   Liste funktioniert als normale Linkliste. */

export function kategorienBildwechsel() {
  const buehne = document.getElementById('kat-buehne');
  if (buehne === null) return;

  const bilder = Array.from(buehne.querySelectorAll('.kat__bild'));
  const zeilen = Array.from(document.querySelectorAll('.kat__zeile'));
  if (bilder.length === 0 || zeilen.length !== bilder.length) return;

  function zeigen(index) {
    bilder.forEach((bild, i) => {
      bild.classList.toggle('kat__bild--an', i === index);
    });
    zeilen.forEach((zeile, i) => {
      zeile.classList.toggle('kat__zeile--an', i === index);
    });
  }

  zeilen.forEach((zeile, i) => {
    zeile.addEventListener('mouseenter', () => zeigen(i));
    // Tastaturbedienung: beim Antabben dasselbe Bild zeigen
    zeile.addEventListener('focus', () => zeigen(i));
  });
}
