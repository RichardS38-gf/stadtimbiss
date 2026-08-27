/* oeffnung.js — Pommes Paul
   Setzt den Statusbalken der Anschlagtafel im Hero.

   Der Balken beantwortet die Frage, die abends jeder zuerst hat:
   Haben die jetzt noch auf? Deshalb wird er aus Wochentag und
   Uhrzeit berechnet statt fest hineingeschrieben.

   Ohne dieses Skript bleibt der Text im HTML stehen. Der ist so
   formuliert, dass er auch dann nicht falsch ist.

   ACHTUNG bei Aenderungen: die Zeiten stehen ausserdem in der
   Fusszeile und im Kontaktabschnitt der Startseite. Wenn du sie
   hier anpasst, dort mit anpassen. */

// Schluessel ist getDay(): 0 = Sonntag, 1 = Montag ... 6 = Samstag
const PLAN = {
  0: [12, 21],
  1: [11, 22],
  2: [11, 22],
  3: [11, 22],
  4: [11, 22],
  5: [11, 23],
  6: [11, 23]
};

const TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

export function oeffnungAnzeigen() {
  const band = document.getElementById('status-band');
  const text = document.getElementById('status-text');
  const heute = document.getElementById('heute-zeit');
  if (band === null || text === null) return;

  const jetzt = new Date();
  const tag = jetzt.getDay();
  const [auf, zu] = PLAN[tag];

  // Minuten seit Mitternacht, damit auch halbe Stunden gehen
  const minutenJetzt = jetzt.getHours() * 60 + jetzt.getMinutes();
  const minutenAuf = auf * 60;
  const minutenZu = zu * 60;

  if (heute !== null) heute.textContent = `${auf} \u2013 ${zu} Uhr`;

  if (minutenJetzt >= minutenAuf && minutenJetzt < minutenZu) {
    band.classList.remove('tafel-info__status--zu');
    text.textContent = 'Jetzt geöffnet';
    return;
  }

  band.classList.add('tafel-info__status--zu');

  // Im geschlossenen Zustand steht die naechste Oeffnung direkt im
  // Statustext. Die Zeile "Heute" darunter beantwortet das nicht,
  // wenn es bereits nach Feierabend ist.
  if (minutenJetzt < minutenAuf) {
    text.textContent = `Geschlossen, ab ${auf} Uhr`;
    return;
  }

  const naechster = (tag + 1) % 7;
  text.textContent = `Zu, ${TAGE[naechster]} ab ${PLAN[naechster][0]} Uhr`;
}
