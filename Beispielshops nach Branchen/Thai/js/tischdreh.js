/* tischdreh.js — Sabai Sabai
   Der Abschnitt "Konzept" hat zwei Fassungen.

   Auf breiten Schirmen bleibt das runde Tischbild mittig stehen
   und dreht sich mit dem Scrollfortschritt, drumherum erscheint
   jeweils genau einer der vier Texte.

   Auf schmalen Schirmen wird daraus ein Wisch-Slider: die vier
   Texte liegen als Karten nebeneinander, das Bild steht darueber
   und dreht sich beim Wischen mit. Punkte unter dem Slider zeigen,
   wo man ist.

   Laeuft das Skript nicht, bleiben alle vier Texte sichtbar und
   stehen untereinander. Das Ausblenden und der Umbau haengen an
   Klassen, die dieses Skript setzt. */

const DREHUNG_GRAD = 140;

/* Grad je Karte im Wisch-Slider. Deutlich mehr als auf dem
   Desktop pro Abschnitt, weil auf dem Telefon nur vier Wischer
   zur Verfuegung stehen und die Drehung sonst kaum auffaellt. */
const DREHUNG_JE_KARTE = 90;

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

  if (window.matchMedia('(max-width: 900px)').matches) {
    sliderAufbauen(bahn, bild, punkte);
    return;
  }

  drehungAmScroll(bahn, bild, punkte);
}

/* ── Mobil: Wisch-Slider ──────────────────────────────────────── */
function sliderAufbauen(bahn, bild, punkte) {
  bahn.classList.add('tisch-bahn--mobil');

  const slider = document.createElement('div');
  slider.className = 'tisch-slider';

  // Die Karten wandern in den Slider und bekommen eine Zaehlung.
  punkte.forEach((el, i) => {
    const nr = document.createElement('span');
    nr.className = 'tisch-punkt__nr';
    nr.textContent = `0${i + 1} / 0${punkte.length}`;
    el.prepend(nr);
    slider.appendChild(el);
  });

  bild.after(slider);

  // Punkte als Standanzeige
  const dots = document.createElement('div');
  dots.className = 'tisch-dots';
  punkte.forEach(() => dots.appendChild(document.createElement('span')));
  slider.after(dots);

  const marken = Array.from(dots.children);
  marken[0].classList.add('tisch-dots__an');

  // Beim Aufbau haengt der Browser mitunter an einer alten
  // Scrollposition oder rueckt ein Element ins Bild. Beides
  // wuerde die erste Karte halb nach links schieben.
  //
  // Das Zuruecksetzen muss mehrfach passieren: einmal sofort,
  // einmal im naechsten Bild und einmal, wenn alle Bilder geladen
  // sind. Genau dann rechnet Safari das Layout neu und springt
  // sonst wieder weg.
  function anfangSetzen() {
    slider.scrollLeft = 0;
  }

  anfangSetzen();
  requestAnimationFrame(anfangSetzen);
  window.addEventListener('load', anfangSetzen);

  let angefordert = false;

  function rechnen() {
    angefordert = false;

    // Kartenbreite samt Abstand ergibt sich aus dem ersten Kind.
    // Fest verdrahtete Werte waeren hier falsch, die Breite haengt
    // an der Fenstergroesse.
    const erste = slider.firstElementChild;
    if (erste === null) return;

    const schritt = erste.getBoundingClientRect().width +
      parseFloat(getComputedStyle(slider).columnGap || 0);
    if (schritt <= 0) return;

    const index = Math.min(
      punkte.length - 1,
      Math.round(slider.scrollLeft / schritt)
    );

    // Der Drehwinkel folgt dem Wischen fliessend, nicht in Stufen.
    const fortschritt = slider.scrollLeft / schritt;
    bild.style.transform = `rotate(${fortschritt * DREHUNG_JE_KARTE}deg)`;

    marken.forEach((m, i) => {
      m.classList.toggle('tisch-dots__an', i === index);
    });
  }

  function anfordern() {
    if (angefordert) return;
    angefordert = true;
    requestAnimationFrame(rechnen);
  }

  slider.addEventListener('scroll', anfordern, { passive: true });
  rechnen();
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
