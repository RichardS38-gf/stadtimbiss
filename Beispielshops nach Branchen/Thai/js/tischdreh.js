/* tischdreh.js — Sabai Sabai
   Der Abschnitt "Konzept" hat zwei Fassungen.

   Auf breiten Schirmen bleibt das runde Tischbild mittig stehen
   und dreht sich mit dem Scrollfortschritt, drumherum erscheint
   jeweils genau einer der vier Texte.

   Auf schmalen Schirmen wird daraus ein Wisch-Slider. Der wird
   NICHT ueber das Scrollen des Browsers geloest, sondern ueber
   transform: das Skript bestimmt die Position allein.

   Grund: mit scroll-snap sprang Safari nach jeder Layoutaenderung
   an einen anderen Rastpunkt, etwa wenn das Bild darueber nachlud.
   Mit transform kann das nicht passieren, weil der Browser die
   Position nicht anfasst.

   Laeuft das Skript nicht, stehen alle vier Texte untereinander. */

const DREHUNG_GRAD = 140;

/* Grad je Karte im Wisch-Slider. Deutlich mehr als auf dem
   Desktop pro Abschnitt, weil auf dem Telefon nur vier Wischer
   zur Verfuegung stehen und die Drehung sonst kaum auffaellt. */
const DREHUNG_JE_KARTE = 90;

/* Ab dieser Wischstrecke in Pixeln wird umgeblaettert. Darunter
   federt die Karte zurueck. */
const SCHWELLE_PX = 45;

export function tischDrehung() {
  const bahn = document.getElementById('tisch-bahn');
  const bild = document.getElementById('tisch-bild');
  if (bahn === null || bild === null) return;

  const punkte = Array.from(bahn.querySelectorAll('[data-punkt]'));
  if (punkte.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (window.matchMedia('(max-width: 900px)').matches) {
    sliderAufbauen(bahn, bild, punkte);
    return;
  }

  drehungAmScroll(bahn, bild, punkte);
}

/* ── Mobil: Wisch-Slider ueber transform ──────────────────────── */
function sliderAufbauen(bahn, bild, punkte) {
  bahn.classList.add('tisch-bahn--mobil');

  // Fenster mit Sichtbereich, darin die Spur mit den Karten
  const fenster = document.createElement('div');
  fenster.className = 'tisch-slider';

  const spur = document.createElement('div');
  spur.className = 'tisch-spur';
  fenster.appendChild(spur);

  punkte.forEach((el, i) => {
    const nr = document.createElement('span');
    nr.className = 'tisch-punkt__nr';
    nr.textContent = `0${i + 1} / 0${punkte.length}`;
    el.prepend(nr);
    spur.appendChild(el);
  });

  bild.after(fenster);

  // Standanzeige, antippbar
  const dots = document.createElement('div');
  dots.className = 'tisch-dots';
  punkte.forEach((_, i) => {
    const p = document.createElement('button');
    p.type = 'button';
    p.setAttribute('aria-label', `Punkt ${i + 1}`);
    p.addEventListener('click', () => gehe(i));
    dots.appendChild(p);
  });
  fenster.after(dots);

  const marken = Array.from(dots.children);

  let index = 0;
  let startX = null;
  let zugX = 0;

  // Schrittweite: Kartenbreite plus Abstand. Wird bei jedem
  // Wischen neu gemessen, damit ein Drehen des Geraets nichts
  // kaputt macht.
  function schritt() {
    const erste = spur.firstElementChild;
    if (erste === null) return 0;
    const gap = parseFloat(getComputedStyle(spur).columnGap) || 0;
    return erste.getBoundingClientRect().width + gap;
  }

  function zeichnen(zusatz = 0) {
    const s = schritt();
    spur.style.transform = `translateX(${-(index * s) + zusatz}px)`;

    const fortschritt = s > 0 ? index - zusatz / s : index;
    bild.style.transform = `rotate(${fortschritt * DREHUNG_JE_KARTE}deg)`;

    marken.forEach((m, i) => {
      m.classList.toggle('tisch-dots__an', i === index);
    });
  }

  function gehe(ziel) {
    index = Math.min(punkte.length - 1, Math.max(0, ziel));
    spur.classList.remove('tisch-spur--zieht');
    zeichnen();
  }

  // Wischen. Pointer-Ereignisse deckuen Finger und Maus zugleich ab.
  spur.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    zugX = 0;
    spur.classList.add('tisch-spur--zieht');
  });

  spur.addEventListener('pointermove', (e) => {
    if (startX === null) return;
    zugX = e.clientX - startX;
    zeichnen(zugX);
  });

  function loslassen() {
    if (startX === null) return;
    startX = null;
    spur.classList.remove('tisch-spur--zieht');

    if (zugX <= -SCHWELLE_PX) gehe(index + 1);
    else if (zugX >= SCHWELLE_PX) gehe(index - 1);
    else zeichnen();

    zugX = 0;
  }

  spur.addEventListener('pointerup', loslassen);
  spur.addEventListener('pointercancel', loslassen);
  spur.addEventListener('pointerleave', loslassen);

  window.addEventListener('resize', () => zeichnen());
  window.addEventListener('load', () => zeichnen());
  zeichnen();
}

/* ── Desktop: Drehung am Scrollfortschritt ────────────────────── */
function drehungAmScroll(bahn, bild, punkte) {
  bahn.classList.add('tisch-bahn--js');

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
