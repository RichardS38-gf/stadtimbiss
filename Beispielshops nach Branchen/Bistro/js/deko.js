/* deko.js — Café Marlene
   Bewegung fuer die freigestellten Deko-Bilder (.zeit__deko).

   Zwei Effekte, beide ueber dieselbe rAF-Schleife, damit sie sich
   nicht gegenseitig die transform-Eigenschaft ueberschreiben:

   1. Drehung, dauerhaft an die Scrollposition gekoppelt.
      Beim Auftauchen unten -MAX_GRAD, in der Bildschirmmitte 0,
      beim Verlassen oben +MAX_GRAD.
      Richtung ueber data-dreh am Bild: 1 im Uhrzeigersinn
      (Vorgabe), -1 dagegen.

   2. Einflug von rechts, einmalig, sobald das Bild weit genug im
      Viewport steht. Nur bei Bildern mit data-einflug="rechts".
      Ausgeloest ueber einen IntersectionObserver, der Ablauf
      selbst laeuft ueber die Zeit, nicht ueber den Scroll.

   Bewusst kein animation-timeline: view() und keine CSS-Transition
   auf einer @property-Variablen. Beides koennen noch nicht alle
   Browser, und die Demos laufen auch auf fremden Rechnern.

   Ohne Server passiert gar nichts, weil ES-Module ueber file://
   blockiert werden. Die Bilder stehen dann einfach still und
   sichtbar da, das ist der gewollte Rueckfall. */

const MAX_GRAD = 55;          // Ausschlag der Drehung in Grad
const EINFLUG_MS = 900;       // Dauer des Einflugs
const EINFLUG_WEG = 130;      // Startversatz in Prozent der Bildbreite

/* Weich auslaufend, startet schnell und wird zum Ende hin langsamer. */
function weichAus(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function dekoDrehen() {
  const bilder = Array.from(document.querySelectorAll('.zeit__deko'));
  if (bilder.length === 0) return;

  const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Wer Bewegung reduziert haben moechte, bekommt die Bilder gerade
     und sofort sichtbar. Wichtig: die Startwerte setzt das Skript,
     nicht das Stylesheet. Sonst waeren die Bilder ohne laufendes
     JavaScript dauerhaft unsichtbar. */
  if (ruhig) return;

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

      // Einflug: 0 bis der Observer ausloest, dann bis 1 ueber die Zeit
      let e = 1;
      if (z.fliegt) {
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

  /* Startschuss fuer den Einflug, sobald ein Drittel des Bildes
     im Viewport steht. Danach wird nicht mehr beobachtet, der
     Effekt laeuft nur ein einziges Mal. */
  const fliegende = bilder.filter((b) => zustand.get(b).fliegt);

  if (fliegende.length > 0) {
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        for (const eintrag of eintraege) {
          if (!eintrag.isIntersecting) continue;
          const z = zustand.get(eintrag.target);
          if (z.start === 0) {
            z.start = performance.now();
            anfordern();
          }
          beobachter.unobserve(eintrag.target);
        }
      },
      { threshold: 0.33 }
    );

    for (const bild of fliegende) beobachter.observe(bild);
  }

  window.addEventListener('scroll', anfordern, { passive: true });
  window.addEventListener('resize', anfordern);

  anfordern();
}
