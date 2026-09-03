/* zutaten.js — Sabai Sabai
   Blendet die fuenf Zutaten nacheinander ein, sobald die Sektion
   ins Bild kommt. Jede Kachel startet 120 Millisekunden nach der
   vorigen, dadurch laeuft der Blick von links nach rechts mit.

   Der IntersectionObserver loest nur einmal aus und haengt sich
   danach ab. Ein Effekt, der beim Zurueckscrollen wieder von vorn
   beginnt, wirkt bei einer Aufzaehlung nervoes.

   Ohne Skript stehen die Kacheln einfach da. Das Ausblenden haengt
   an der Klasse zutaten--js, und die setzt dieses Skript. */

const VERZOEGERUNG_MS = 120;

export function zutatenEinblenden() {
  const raster = document.querySelector('.zutaten');
  if (raster === null) return;

  const kacheln = Array.from(raster.querySelectorAll('[data-zutat]'));
  if (kacheln.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  raster.classList.add('zutaten--js');

  const beobachter = new IntersectionObserver(
    (eintraege) => {
      for (const eintrag of eintraege) {
        if (!eintrag.isIntersecting) continue;
        beobachter.disconnect();

        kacheln.forEach((kachel, i) => {
          kachel.style.transitionDelay = `${i * VERZOEGERUNG_MS}ms`;
          kachel.classList.add('zutat--an');
        });
      }
    },
    { threshold: 0.15 }
  );

  beobachter.observe(raster);
}
