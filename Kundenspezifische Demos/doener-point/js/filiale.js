/* filiale.js — Döner Point
   Filialauswahl: Maske beim ersten Betreten der Bestellseite,
   danach ein Umschalter in der Kopfzeile.

   Die Wahl steht in localStorage unter dp_filiale. Sie entscheidet
   ueber Abholadresse, Telefonnummer und Karte auf der Kontaktseite.
   Solange beide Filialen dieselbe Speisekarte haben, bleibt der
   Warenkorb beim Wechsel unangetastet. Bekommen sie spaeter
   eigene Karten, gehoert an dieser Stelle eine Warnung hin. */

import { FILIALEN, STANDARD_FILIALE, MINDESTBESTELLWERT } from './demo-daten.js';

const SCHLUESSEL = 'dp_filiale';

export function getFiliale() {
  let id = null;
  try {
    id = window.localStorage.getItem(SCHLUESSEL);
  } catch (e) {
    id = null;
  }
  return FILIALEN.find((f) => f.id === id) || null;
}

export function setFiliale(id) {
  try {
    window.localStorage.setItem(SCHLUESSEL, id);
  } catch (e) {
    /* Privater Modus: die Wahl gilt dann nur fuer diesen Besuch. */
  }
}

/* Faellt auf die Standardfiliale zurueck, damit Seiten ohne Maske
   (Startseite, Fusszeile) immer etwas anzeigen koennen. */
export function filialeOderStandard() {
  return getFiliale() || FILIALEN.find((f) => f.id === STANDARD_FILIALE) || FILIALEN[0];
}

function maskeBauen(schliessbar) {
  const alt = document.getElementById('filialwahl');
  if (alt !== null) alt.remove();

  const karten = FILIALEN.map((f) => `
      <button class="filialwahl__karte" type="button" data-filiale="${f.id}">
        <span class="filialwahl__name">${f.name}</span>
        <span class="filialwahl__adresse">${f.strasse}<br>${f.plz} ${f.ort}</span>
        <span class="filialwahl__zeiten">${f.zeiten}</span>
      </button>`).join('');

  const feld = document.createElement('div');
  feld.className = 'filialwahl';
  feld.id = 'filialwahl';
  feld.innerHTML = `
    <div class="filialwahl__fenster" role="dialog" aria-modal="true" aria-labelledby="filialwahl-titel">
      <p class="filialwahl__kicker">Döner Point</p>
      <h2 class="filialwahl__titel" id="filialwahl-titel">Wo bestellst du?</h2>
      <p class="filialwahl__text">Wähle deine Filiale. Preise und Karte sind in beiden gleich, die Abholadresse nicht.</p>
      <div class="filialwahl__karten">${karten}</div>
      ${schliessbar ? '<button class="filialwahl__abbrechen" type="button">Abbrechen</button>' : ''}
    </div>`;

  document.body.appendChild(feld);
  document.body.classList.add('hat-maske');

  for (const knopf of feld.querySelectorAll('.filialwahl__karte')) {
    knopf.addEventListener('click', () => {
      setFiliale(knopf.dataset.filiale);
      maskeSchliessen();
      anzeigeAktualisieren();
    });
  }

  const abbrechen = feld.querySelector('.filialwahl__abbrechen');
  if (abbrechen !== null) abbrechen.addEventListener('click', maskeSchliessen);

  if (schliessbar) {
    feld.addEventListener('click', (e) => {
      if (e.target === feld) maskeSchliessen();
    });
    document.addEventListener('keydown', aufEscape);
  }

  const erste = feld.querySelector('.filialwahl__karte');
  if (erste !== null) erste.focus();
}

function aufEscape(e) {
  if (e.key === 'Escape') maskeSchliessen();
}

export function maskeSchliessen() {
  const feld = document.getElementById('filialwahl');
  if (feld !== null) feld.remove();
  document.body.classList.remove('hat-maske');
  document.removeEventListener('keydown', aufEscape);
}

export function maskeOeffnen() {
  maskeBauen(getFiliale() !== null);
}

/* Traegt die gewaehlte Filiale ueberall dort ein, wo sie sichtbar
   wird. Jede Stelle ist einzeln abgesichert, damit dasselbe Modul
   auf allen Seiten laufen kann. */
export function anzeigeAktualisieren() {
  const f = filialeOderStandard();

  const schalterName = document.getElementById('filiale-name');
  if (schalterName !== null) schalterName.textContent = f.name;

  const abholzeile = document.querySelector('[data-mode="abholung"] .modus__sub');
  if (abholzeile !== null) {
    abholzeile.textContent = `${f.abholzeit} \u00b7 ${f.strasse}, ${f.ort}`;
  }

  const lieferzeile = document.querySelector('[data-mode="lieferung"] .modus__sub');
  if (lieferzeile !== null) {
    const wert = MINDESTBESTELLWERT.toFixed(2).replace('.', ',');
    lieferzeile.textContent = `${f.lieferzeit} \u00b7 Mindestbestellwert ${wert} \u20ac`;
  }

  for (const el of document.querySelectorAll('[data-filiale-adresse]')) {
    el.innerHTML = `${f.strasse}<br>${f.plz} ${f.ort}`;
  }

  for (const el of document.querySelectorAll('[data-filiale-telefon]')) {
    el.textContent = f.telefon;
    if (el.tagName === 'A') el.href = 'tel:' + f.telefon.replace(/\s/g, '');
  }

  for (const el of document.querySelectorAll('[data-filiale-zeiten]')) {
    el.textContent = f.zeiten;
  }

  const karte = document.getElementById('filiale-karte');
  if (karte !== null && f.maps) karte.src = f.maps;
}

/* zwingend: auf der Bestellseite muss vor dem ersten Artikel
   feststehen, wohin die Bestellung geht. Auf allen anderen
   Seiten genuegt die Anzeige. */
export function filialeAufbauen({ zwingend = false } = {}) {
  anzeigeAktualisieren();

  const schalter = document.getElementById('filiale-schalter');
  if (schalter !== null) schalter.addEventListener('click', maskeOeffnen);

  if (zwingend && getFiliale() === null) maskeBauen(false);
}
