// icons.js — Pizzeria Napoli
// Linien-Icons im Stil dünner Outline-Zeichnungen.
// Alle Pfade ohne Füllung, Farbe kommt über currentColor.
//
// Verwendung im HTML:
//   <span data-icon="pizza"></span>
// oder im JS:
//   import { icon } from './icons.js';
//   el.innerHTML = icon('pizza', 'ic ic--lg');

const PFADE = {
  // Besteck, wie im Referenzbild
  besteck: `
    <path d="M8.2 3v6.4c0 .9-.7 1.6-1.6 1.6h0c-.9 0-1.6-.7-1.6-1.6V3"/>
    <path d="M6.6 3v8"/>
    <path d="M6.6 11v10"/>
    <path d="M17.4 3c-1.5 1.1-2.3 3-2.3 5.2 0 1.7.9 2.9 2.3 3.2V3z"/>
    <path d="M17.4 11.4V21"/>`,

  // Runde Pizza mit Rand und Belag
  pizza: `
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="6.6"/>
    <path d="M9.9 10.3h.01"/>
    <path d="M14.2 10.9h.01"/>
    <path d="M11.5 14.3h.01"/>
    <path d="M14.7 14.1h.01"/>`,

  // Holzofen
  ofen: `
    <path d="M3.4 20.4V12a8.6 8.6 0 0 1 17.2 0v8.4z"/>
    <path d="M7.6 20.4v-4.2a4.4 4.4 0 0 1 8.8 0v4.2"/>
    <path d="M2 20.4h20"/>
    <path d="M12 4.4V2.6"/>`,

  // Weinglas
  wein: `
    <path d="M7.4 3h9.2l-.7 6.2a4 4 0 0 1-7.8 0z"/>
    <path d="M12 13.4V21"/>
    <path d="M8.6 21h6.8"/>`,

  // Basilikumblatt
  blatt: `
    <path d="M20.4 3.6C11.2 3.6 5 8.4 5 15.4c0 2 .6 3.6 1.4 5 6.6-.4 14-5.6 14-16.8z"/>
    <path d="M3.6 20.4C6.8 15.2 11 11.4 16.6 8.6"/>`,

  // Lieferroller
  roller: `
    <circle cx="6" cy="17.4" r="2.8"/>
    <circle cx="18.2" cy="17.4" r="2.8"/>
    <path d="M8.8 17.4h6.6"/>
    <path d="M5.6 14.6V9.4a2 2 0 0 1 2-2h2.2l4 7.2"/>
    <path d="M14.6 5.2h2.8l1.4 9.4"/>`,

  // Tisch mit Stuhl, für Reservierungen
  tisch: `
    <path d="M3 10.4h18"/>
    <path d="M5.6 10.4V20"/>
    <path d="M18.4 10.4V20"/>
    <path d="M8 10.4V6.4a1.6 1.6 0 0 1 1.6-1.6h4.8A1.6 1.6 0 0 1 16 6.4v4"/>`,

  // Uhr, für Öffnungszeiten
  uhr: `
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 6.8V12l3.4 2.2"/>`,

  // Standort
  ort: `
    <path d="M12 21.4c4.4-4.6 6.6-8 6.6-10.6a6.6 6.6 0 1 0-13.2 0c0 2.6 2.2 6 6.6 10.6z"/>
    <circle cx="12" cy="10.8" r="2.4"/>`,

  // Telefon
  telefon: `
    <path d="M8.2 3.6 10 7.4l-1.9 1.7a12 12 0 0 0 5.4 5.2l1.7-1.9 3.8 1.8v3.4c0 .8-.7 1.5-1.5 1.4C10 18.4 5 13.4 4.1 5.1c-.1-.8.6-1.5 1.4-1.5z"/>`,

  // Stern für Bewertungen
  stern: `
    <path d="m12 3.4 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.8l6-.9z"/>`,

  // Herz, für Favoriten
  herz: `
    <path d="M20.4 6a5 5 0 0 0-7.1 0L12 7.3l-1.3-1.3A5 5 0 0 0 3.6 13l.9.9L12 21.4l7.5-7.5.9-.9a5 5 0 0 0 0-7z"/>`,

  // Person, für das Konto
  person: `
    <circle cx="12" cy="8" r="3.6"/>
    <path d="M4.4 20.4c0-4.2 3.4-7.6 7.6-7.6s7.6 3.4 7.6 7.6"/>`,

  // Warenkorb
  korb: `
    <path d="M3.4 5h2.2l2.4 10.6a1.8 1.8 0 0 0 1.8 1.4h7.4a1.8 1.8 0 0 0 1.8-1.4L20.6 8.4H6.2"/>
    <circle cx="10" cy="20" r="1.2"/>
    <circle cx="17.4" cy="20" r="1.2"/>`,

  // Häkchen
  haken: `<path d="m4.4 12.4 5 5 10.2-10.6"/>`,

  // Mehl und Teig, für die Handwerk-Sektion
  teig: `
    <ellipse cx="12" cy="14.6" rx="8.4" ry="5.4"/>
    <path d="M6.4 11.4c1.6-1.6 3.6-2.4 5.6-2.4s4 .8 5.6 2.4"/>
    <path d="M9.6 6.6c.8-1.4 2-2.2 2.4-3.2.4 1 1.6 1.8 2.4 3.2"/>`
};

export function icon(name, klasse = 'ic') {
  const pfad = PFADE[name];
  if (!pfad) return '';
  return `<svg class="${klasse}" viewBox="0 0 24 24" aria-hidden="true">${pfad}</svg>`;
}

// Ersetzt alle <span data-icon="..."> im Dokument durch das SVG
export function iconsEinsetzen(wurzel = document) {
  wurzel.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.dataset.icon;
    const klasse = el.dataset.iconClass || 'ic';
    const svg = icon(name, klasse);
    if (svg) el.outerHTML = svg;
  });
}

export { PFADE };
