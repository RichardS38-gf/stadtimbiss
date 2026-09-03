/* oeffnung.js — Sabai Sabai
   Fuellt im Abschnitt Öffnungszeiten die grosse Zeile und die
   Restzeit darunter und hebt den heutigen Wochentag hervor.

   Die Zeiten stehen einmal hier und einmal im HTML. Das ist
   Absicht: ohne Skript steht die Woche trotzdem vollstaendig da,
   nur ohne Hervorhebung und ohne Restzeit. Wenn du die Zeiten
   aenderst, musst du beide Stellen anfassen.

   Wochentage: 0 ist Sonntag, wie bei getDay(). */

const ZEITEN = {
  0: { von: 12, bis: 21 },   // Sonntag
  1: null,                   // Montag, Ruhetag
  2: { von: 17, bis: 22 },
  3: { von: 17, bis: 22 },
  4: { von: 17, bis: 22 },
  5: { von: 17, bis: 23 },
  6: { von: 17, bis: 23 }
};

const NAMEN = [
  'Sonntag', 'Montag', 'Dienstag', 'Mittwoch',
  'Donnerstag', 'Freitag', 'Samstag'
];

export function oeffnungAnzeigen() {
  const gross = document.getElementById('oeffnung-gross');
  const rest = document.getElementById('oeffnung-rest');
  const tage = Array.from(document.querySelectorAll('[data-tag]'));
  if (gross === null && tage.length === 0) return;

  const jetzt = new Date();
  const tag = jetzt.getDay();
  const stunde = jetzt.getHours() + jetzt.getMinutes() / 60;
  const heute = ZEITEN[tag];

  // Heutigen Tag in der Liste hervorheben
  tage.forEach((el) => {
    el.classList.toggle('woche__tag--heute', Number(el.dataset.tag) === tag);
  });

  if (gross === null || rest === null) return;

  // Die grosse Zeile ist dreiteilig: Einleitung, Uhrzeit, Nachsatz.
  // Die Uhrzeit steht in em und bekommt im Stylesheet den
  // Schreibstrich.
  const schreiben = (vorne, zeit, hinten) => {
    gross.innerHTML =
      `<span>${vorne}</span><em>${zeit}</em><span>${hinten}</span>`;
  };

  const offen = heute !== null && stunde >= heute.von && stunde < heute.bis;

  if (offen) {
    schreiben('Heute bis', `${heute.bis} Uhr`, 'geöffnet');

    // Restzeit in Stunden und Minuten
    const uebrig = heute.bis - stunde;
    const std = Math.floor(uebrig);
    const min = Math.round((uebrig - std) * 60);
    rest.textContent = std > 0
      ? `noch ${std} Stunden ${min} Minuten`
      : `noch ${min} Minuten`;
    return;
  }

  // Geschlossen: heute spaeter oder an einem der naechsten Tage
  if (heute !== null && stunde < heute.von) {
    schreiben('Heute ab', `${heute.von} Uhr`, 'geöffnet');
    rest.textContent = 'Gerade geschlossen';
    return;
  }

  for (let i = 1; i <= 7; i++) {
    const naechster = (tag + i) % 7;
    const zeit = ZEITEN[naechster];
    if (zeit === null) continue;

    const wann = i === 1 ? 'Morgen ab' : `${NAMEN[naechster]} ab`;
    schreiben(wann, `${zeit.von} Uhr`, 'geöffnet');
    rest.textContent = 'Gerade geschlossen';
    return;
  }
}
