/* menue.js — Sabai Sabai
   Legt auf schmalen Schirmen die Knoepfe der Kopfzeile in ein
   Ausklappmenue.

   Die Knoepfe werden nicht neu gebaut, sondern umgehaengt. Dadurch
   bleiben alle bereits gesetzten Ereignisse erhalten, etwa der
   Warenkorb auf der Bestellseite.

   Auch der leere Kasten fuer das Konto wandert mit. Den fuellt
   auth.js spaeter, das Umhaengen vorher stoert nicht.

   Die Entscheidung faellt einmal beim Laden. Wer das Fenster von
   Hand schmaler zieht, muss neu laden. Auf einem Telefon kommt das
   nicht vor, und ein Umbau bei jeder Groessenaenderung waere fuer
   den Nutzen zu viel Aufwand. */

export function menueAufbauen() {
  if (!window.matchMedia('(max-width: 900px)').matches) return;

  // Kopfzeile finden: im Hero der Startseite oder in der
  // Navigationsleiste der Unterseiten.
  const zeile =
    document.querySelector('.hero-top') ||
    document.querySelector('.nav .nav__inner');
  if (zeile === null) return;

  const kontoSlot = zeile.querySelector('.hero-top__konto, .nav__konto-slot');
  const aktionen = zeile.querySelector('.hero-top__aktionen, .nav__aktionen');
  if (aktionen === null) return;

  // Knopf zum Aufklappen
  const knopf = document.createElement('button');
  knopf.className = 'menue-btn';
  knopf.type = 'button';
  knopf.setAttribute('aria-label', 'Menü');
  knopf.setAttribute('aria-expanded', 'false');
  knopf.innerHTML =
    '<span class="menue-btn__strich"></span>' +
    '<span class="menue-btn__strich"></span>' +
    '<span class="menue-btn__strich"></span>';

  // Klappfeld, in das die Knoepfe wandern
  const feld = document.createElement('div');
  feld.className = 'menue-panel';
  feld.id = 'menue-panel';
  knopf.setAttribute('aria-controls', 'menue-panel');

  if (kontoSlot !== null) feld.appendChild(kontoSlot);
  while (aktionen.firstElementChild !== null) {
    feld.appendChild(aktionen.firstElementChild);
  }
  aktionen.remove();

  zeile.appendChild(knopf);
  zeile.appendChild(feld);

  function schliessen() {
    feld.classList.remove('menue-panel--offen');
    knopf.setAttribute('aria-expanded', 'false');
  }

  knopf.addEventListener('click', (e) => {
    e.stopPropagation();
    const offen = feld.classList.toggle('menue-panel--offen');
    knopf.setAttribute('aria-expanded', String(offen));
  });

  // Klick daneben und Escape schliessen das Feld wieder
  document.addEventListener('click', (e) => {
    if (!feld.contains(e.target)) schliessen();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') schliessen();
  });
}
