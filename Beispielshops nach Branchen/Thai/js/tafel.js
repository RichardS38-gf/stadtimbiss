/* tafel.js — Sabai Sabai
   Schaltet die Kategorien der Karte auf der Startseite um.

   Sichtbar ist immer genau eine Gruppe. Das Ausblenden steht im
   Stylesheet, dieses Skript setzt nur die Klasse um. Laeuft es
   nicht, bleibt die erste Gruppe stehen, weil sie die Klasse
   bereits im HTML traegt. */

export function tafelReiter() {
  const leiste = document.querySelector('.karte-reiter');
  if (leiste === null) return;

  const reiter = Array.from(leiste.querySelectorAll('.karte-reiter__btn'));
  if (reiter.length === 0) return;

  const gruppen = reiter
    .map((btn) => document.getElementById(btn.dataset.ziel))
    .filter((el) => el !== null);

  if (gruppen.length !== reiter.length) return;

  function zeigen(index) {
    reiter.forEach((btn, i) => {
      const aktiv = i === index;
      btn.classList.toggle('karte-reiter__btn--aktiv', aktiv);
      btn.setAttribute('aria-selected', aktiv ? 'true' : 'false');
      btn.tabIndex = aktiv ? 0 : -1;
      gruppen[i].classList.toggle('karte-gruppe--aktiv', aktiv);
    });
  }

  reiter.forEach((btn, i) => {
    btn.addEventListener('click', () => zeigen(i));

    // Pfeiltasten, damit die Reiter auch ohne Maus bedienbar sind
    btn.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const schritt = e.key === 'ArrowRight' ? 1 : -1;
      const ziel = (i + schritt + reiter.length) % reiter.length;
      zeigen(ziel);
      reiter[ziel].focus();
    });
  });

  zeigen(0);
}
