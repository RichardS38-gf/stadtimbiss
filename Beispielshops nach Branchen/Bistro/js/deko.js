/* deko.js — Café Marlene
   Bewegung fuer die freigestellten Deko-Bilder (.zeit__deko).

   Zwei Effekte, beide ueber dieselbe rAF-Schleife, damit sie sich
   nicht gegenseitig die transform-Eigenschaft ueberschreiben:

   1. Drehung, dauerhaft an die Scrollposition gekoppelt.
      Beim Auftauchen unten -MAX_GRAD, in der Bildschirmmitte 0,
      beim Verlassen oben +MAX_GRAD.
      Richtung ueber data-dreh am Bild: 1 im Uhrzeigersinn
      (Vorgabe), -1 dagegen.

   2. Einflug von rechts, einmalig, sobald die Oberkante des Bildes
      weit genug im Viewport steht. Nur bei data-einflug="rechts".

   Der Ausloeser haengt bewusst NICHT an einem IntersectionObserver.
   Diese Bilder ragen weit ueber den rechten Fensterrand hinaus und
   sind hoeher als viele Bildschirme. Der sichtbare Anteil erreicht
   deshalb keine verlaessliche Schwelle, der Beobachter feuerte nie
   und das Bild blieb dauerhaft auf opacity 0 stehen. Jetzt genuegt
   es, dass die Oberkante die untere Fensterkante erreicht.

   Ohne Server passiert gar nichts, weil ES-Module ueber file://
   blockiert werden. Die Bilder stehen dann still und sichtbar da,
   das ist der gewollte Rueckfall. */

const MAX_GRAD = 55;          // Ausschlag der Drehung in Grad
const EINFLUG_MS = 900;       // Dauer des Einflugs
const EINFLUG_WEG = 130;      // Startversatz in Prozent der Bildbreite
const AUSLOESER = 0.9;        // Anteil der Fensterhoehe, ab dem es startet

/* Weich auslaufend, startet schnell und wird zum Ende hin langsamer. */
function weichAus(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function dekoDrehen() {
  const bilder = Array.from(document.querySelectorAll('.zeit__deko'));
  if (bilder.length === 0) return;

  /* Wer Bewegung reduziert haben moechte, bekommt die Bilder gerade
     und sichtbar. Wichtig: hier wird nichts auf opacity 0 gesetzt. */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const zustand = new Map();

  for (const bild of bilder) {
    const fliegt = bild.dataset.einflug === 'rechts';
    zustand.set(bild, { fliegt, start: 0 });
    if (fliegt) {
      bild.style.opacity = '0';
      bild.style.transform = 'translateX(' + EINFLUG_WEG + '%)';
    }
  }

  let angefordert = false;

  function zeichnen(jetzt) {
    angefordert = false;
    const fensterhoehe = window.innerHeight;
    let laeuftNoch = false;

    for (const bild of bilder) {
      const kasten = bild.getBoundingClientRect();
      if (kasten.height === 0) continue;   // unter 1100px ausgeblendet

      const z = zustand.get(bild);

      let e = 1;
      if (z.fliegt) {
        // Startschuss: Oberkante hat die untere Fensterkante erreicht
        if (z.start === 0 && kasten.top < fensterhoehe * AUSLOESER) {
          z.start = jetzt;
        }
        if (z.start === 0) {
          e = 0;
        } else {
          const t = Math.min(1, (jetzt - z.start) / EINFLUG_MS);
          e = weichAus(t);
          if (t < 1) laeuftNoch = true;
        }
      }

      // Drehung: 0 = Bild taucht unten auf, 1 = Bild ist oben raus
      let anteil = (fensterhoehe - kasten.top) / (fensterhoehe + kasten.height);
      anteil = Math.min(1, Math.max(0, anteil));
      const richtung = Number(bild.dataset.dreh) || 1;
      const grad = (anteil - 0.5) * 2 * MAX_GRAD * richtung;

      const versatz = (1 - e) * EINFLUG_WEG;

      bild.style.transform =
        'translateX(' + versatz.toFixed(2) + '%) rotate(' + grad.toFixed(2) + 'deg)';
      if (z.fliegt) bild.style.opacity = e.toFixed(3);
    }

    if (laeuftNoch) anfordern();
  }

  function anfordern() {
    if (angefordert) return;
    angefordert = true;
    requestAnimationFrame(zeichnen);
  }

  window.addEventListener('scroll', anfordern, { passive: true });
  window.addEventListener('resize', anfordern);

  anfordern();
}
