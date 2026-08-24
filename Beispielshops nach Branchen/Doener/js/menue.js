// menue.js — Bosporus Grill
// Klappt das Seitenmenue in der Kopfzeile der Unterseiten auf und zu.
// Die Startseite braucht das nicht, dort liegt die Navigation im Hero.

function menueEinrichten() {
  const nav = document.querySelector('.nav');
  const btn = document.querySelector('.nav__menue-btn');
  if (!nav || !btn) return;

  const auf = () => nav.classList.contains('nav--offen');

  function setze(offen) {
    nav.classList.toggle('nav--offen', offen);
    btn.setAttribute('aria-expanded', String(offen));
  }

  btn.setAttribute('aria-expanded', 'false');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setze(!auf());
  });

  // Klick daneben schliesst das Menue
  document.addEventListener('click', (e) => {
    if (!auf()) return;
    if (nav.contains(e.target)) return;
    setze(false);
  });

  // Escape schliesst ebenfalls
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && auf()) {
      setze(false);
      btn.focus();
    }
  });

  // Nach einem Klick auf einen Link schliessen
  nav.querySelectorAll('.nav__links a').forEach(a => {
    a.addEventListener('click', () => setze(false));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', menueEinrichten);
} else {
  menueEinrichten();
}
