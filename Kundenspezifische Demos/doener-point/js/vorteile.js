/* vorteile.js — Döner Point
   Laesst Karten in einer Buehne durchlaufen. Wird auf der
   Startseite zweimal benutzt: fuer die drei Vorteile und fuer die
   Kundenstimmen.

   Aufbau im HTML: ein Element als Buehne, darin die Karten, dazu
   Punkte mit einem eigenen Sammelelement. Sichtbar ist immer genau
   eine Karte, gesteuert ueber die Klasse --aktiv am Kind. Kein
   Verschieben, kein Ueberlauf: so kann nichts seitlich aus dem
   Layout laufen.

   Ohne dieses Modul stehen alle Karten schlicht untereinander und
   sind lesbar. Erst hier wird die Klasse --js an die Buehne
   gesetzt, die im CSS auf Stapel umschaltet.

   Der Lauf haelt an, solange die Maus auf der Buehne steht oder
   ein Punkt den Tastaturfokus hat. Bei prefers-reduced-motion
   laeuft nichts von selbst, die Punkte schalten trotzdem. */

const DAUER = 5000;

/* buehneWahl: Auswahl der Buehne
   kartenWahl: Auswahl der Karten darin
   punktWahl:  Auswahl der Punkte
   pfeilWahl:  Auswahl der Pfeilknoepfe, data-richtung="vor"|"zurueck"
   jsKlasse:   Klasse, die das CSS auf Stapel umschaltet
   aktivKlasse: Klasse der sichtbaren Karte */
function sliderStarten({ buehneWahl, kartenWahl, punktWahl, pfeilWahl, jsKlasse, aktivKlasse }) {
  const buehne = document.querySelector(buehneWahl);
  if (buehne === null) return;

  const karten = Array.from(buehne.querySelectorAll(kartenWahl));
  if (karten.length < 2) return;

  const punkte = Array.from(document.querySelectorAll(punktWahl));
  const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  buehne.classList.add(jsKlasse);

  let aktuell = 0;
  let uhr = null;

  function zeige(i) {
    aktuell = (i + karten.length) % karten.length;

    karten.forEach((k, n) => {
      k.classList.toggle(aktivKlasse, n === aktuell);
      k.setAttribute('aria-hidden', n === aktuell ? 'false' : 'true');
    });

    punkte.forEach((p, n) => {
      p.classList.toggle(p.className.split(' ')[0] + '--aktiv', n === aktuell);
      p.setAttribute('aria-selected', n === aktuell ? 'true' : 'false');
    });
  }

  function start() {
    if (ruhig || uhr !== null) return;
    uhr = window.setInterval(() => zeige(aktuell + 1), DAUER);
  }

  function stopp() {
    if (uhr === null) return;
    window.clearInterval(uhr);
    uhr = null;
  }

  punkte.forEach((p, n) => {
    p.addEventListener('click', () => { zeige(n); stopp(); start(); });
    p.addEventListener('focus', stopp);
    p.addEventListener('blur', start);
  });

  /* Pfeile. Sie sind im HTML versteckt und werden erst sichtbar,
     wenn dieses Modul laeuft — ohne Schaltung haetten sie keine
     Funktion. */
  if (pfeilWahl) {
    for (const pfeil of document.querySelectorAll(pfeilWahl)) {
      pfeil.hidden = false;
      pfeil.addEventListener('click', () => {
        zeige(aktuell + (pfeil.dataset.richtung === 'zurueck' ? -1 : 1));
        stopp();
        start();
      });
      pfeil.addEventListener('focus', stopp);
      pfeil.addEventListener('blur', start);
    }
  }

  buehne.addEventListener('mouseenter', stopp);
  buehne.addEventListener('mouseleave', start);

  zeige(0);
  start();
}

export function vorteileStarten() {
  sliderStarten({
    buehneWahl: '.vorteile__buehne',
    kartenWahl: '.vorteil',
    punktWahl: '.vorteile__punkt',
    pfeilWahl: '.vorteile__pfeil',
    jsKlasse: 'vorteile__buehne--js',
    aktivKlasse: 'vorteil--aktiv'
  });
}

export function stimmenStarten() {
  sliderStarten({
    buehneWahl: '.stimmen__buehne',
    kartenWahl: '.stimme',
    punktWahl: '.stimmen__punkt',
    pfeilWahl: '.stimmen__pfeil',
    jsKlasse: 'stimmen__buehne--js',
    aktivKlasse: 'stimme--aktiv'
  });
}
