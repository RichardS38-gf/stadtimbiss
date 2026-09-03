/* tuktuk.js — Sabai Sabai
   Laesst das Tuk-Tuk im Werbebanner beim Scrollen von links ins
   Bild fahren und beim Zurueckscrollen wieder heraus.

   Anders als beim Tischbild wird hier kein sticky-Abschnitt
   gebraucht: der Fortschritt ergibt sich daraus, wie weit die
   Sektion bereits ins Fenster gelaufen ist. Ein Wert von 0 heisst,
   sie taucht gerade unten auf, ein Wert von 1, sie steht mittig.

   Weil der Wert direkt am Scrollstand haengt und nicht an einer
   einmaligen Klasse, faehrt das Bild beim Zurueckscrollen von
   selbst wieder hinaus.

   Ohne Skript steht das Bild einfach an seinem Platz. Das
   Verschieben haengt an der Klasse banner--js, und die setzt
   dieses Skript. */

const WEG_PX = 220;

export function tuktukFahrt() {
  const banner = document.getElementById('lieferung');
  const bild = document.getElementById('tuktuk-bild');
  if (banner === null || bild === null) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  banner.classList.add('banner--js');

  let angefordert = false;

  function rechnen() {
    angefordert = false;

    const rect = banner.getBoundingClientRect();
    const fenster = window.innerHeight;

    // Der Start liegt bewusst nicht an der Fensterunterkante,
    // sondern erst bei 55 Prozent der Fensterhoehe. Sonst ist die
    // Fahrt schon vorbei, bevor die Sektion richtig im Blick ist.
    // 1 ist erreicht, sobald die Sektionsmitte die Fenstermitte
    // erreicht hat.
    const start = fenster * 0.55;
    const ende = fenster / 2 - rect.height / 2;
    const strecke = start - ende;
    if (strecke <= 0) return;

    let p = (start - rect.top) / strecke;
    p = Math.min(1, Math.max(0, p));

    // Von links hereinfahren: bei 0 ganz aussen, bei 1 am Platz
    bild.style.transform = `translateX(${(p - 1) * WEG_PX}px)`;
    bild.style.opacity = String(Math.min(1, p * 1.6));
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
