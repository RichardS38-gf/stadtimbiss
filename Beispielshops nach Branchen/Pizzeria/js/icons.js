// icons.js — Pizzeria Napoli
// Feine Linien-Icons mit doppelten Konturen, die Materialstärke
// andeuten. Bewusst dünner und detaillierter als einfache
// Outline-Icons, angelehnt an graviertes Besteck.
//
// Alle Pfade ohne Füllung, Farbe kommt über currentColor.
//
// Verwendung im HTML:
//   <span data-icon="pizza"></span>
// oder im JS:
//   import { icon } from './icons.js';
//   el.innerHTML = icon('pizza', 'ic ic--lg');

const PFADE = {
  // Besteck: Gabel mit ausgezeichneten Zinken, Messer mit Klingenruecken
  besteck: `
    <path d="M5.6 2.8v4.5a2.2 2.2 0 0 0 2.2 2.2h0a2.2 2.2 0 0 0 2.2-2.2V2.8"/>
    <path d="M6.9 2.8v4.1"/>
    <path d="M8 2.8v4.1"/>
    <path d="M9.1 2.8v4.1"/>
    <path d="M7.1 9.5v10.9a.7.7 0 0 0 1.4 0V9.5"/>
    <path d="M16 2.8c1.7 1.5 2.6 3.5 2.6 5.9 0 1.7-1 2.8-2.6 3.1z"/>
    <path d="M16.6 4.6c.9 1.2 1.4 2.6 1.4 4.1"/>
    <path d="M15.7 11.8v8.6a.7.7 0 0 0 1.4 0v-8.6"/>`,

  // Runde Pizza mit Rand, Belag und angedeuteter Dicke
  pizza: `
    <circle cx="12" cy="12" r="8.8"/>
    <circle cx="12" cy="12" r="6.5"/>
    <path d="M4.6 14.6a8.8 8.8 0 0 0 14.8 0"/>
    <circle cx="9.9" cy="10.4" r="0.75"/>
    <circle cx="14.1" cy="11" r="0.75"/>
    <circle cx="11.4" cy="14.2" r="0.75"/>
    <circle cx="14.6" cy="14.4" r="0.75"/>`,

  // Steinofen mit Kuppel, Ofenmund und Glut
  ofen: `
    <path d="M3.2 20.4v-8.2a8.8 8.8 0 0 1 17.6 0v8.2"/>
    <path d="M5.2 20.4v-8.1a6.8 6.8 0 0 1 13.6 0v8.1"/>
    <path d="M8 20.4v-4.1a4 4 0 0 1 8 0v4.1"/>
    <path d="M9.4 20.4v-3.9a2.6 2.6 0 0 1 5.2 0v3.9"/>
    <path d="M2 20.4h20"/>
    <path d="M2 22h20"/>
    <path d="M12 4.2V2.4"/>`,

  // Weinglas mit Kelchrand, Stiel und Fuss
  wein: `
    <path d="M7.6 3.2h8.8l-.6 5.6a3.9 3.9 0 0 1-7.6 0z"/>
    <path d="M7.9 5.8h8.2"/>
    <path d="M12 12.7v6.9"/>
    <path d="M8.8 20.5a3.4 1 0 0 1 6.4 0"/>
    <path d="M8.8 20.5h6.4"/>`,

  // Basilikumblatt mit Mittelrippe und Adern
  blatt: `
    <path d="M20.3 3.7C11.4 3.7 5.2 8.5 5.2 15.3c0 1.9.5 3.5 1.4 4.9 6.4-.4 13.7-5.5 13.7-16.5z"/>
    <path d="M3.7 20.3C6.8 15.2 11 11.4 16.5 8.7"/>
    <path d="M9.4 15.3c1.4-2.2 3.3-4 5.5-5.4"/>
    <path d="M12.8 12.6c1-1.6 2.4-2.9 4-3.9"/>`,

  // Lieferroller mit Nabe und Windschutz
  roller: `
    <circle cx="6" cy="17.3" r="2.9"/>
    <circle cx="6" cy="17.3" r="1"/>
    <circle cx="18.1" cy="17.3" r="2.9"/>
    <circle cx="18.1" cy="17.3" r="1"/>
    <path d="M8.9 17.3h6.3"/>
    <path d="M5.6 14.5V9.6a2 2 0 0 1 2-2h2.2l3.9 7"/>
    <path d="M14.4 5.4h2.9l1.5 9.1"/>
    <path d="M16.2 8.3h1.5"/>`,

  // Gedeckter Tisch mit Stuhl
  tisch: `
    <path d="M2.8 10.2h18.4"/>
    <path d="M2.8 11.6h18.4"/>
    <path d="M5.4 11.6v8.6"/>
    <path d="M18.6 11.6v8.6"/>
    <path d="M8.2 10.2V6.3a1.6 1.6 0 0 1 1.6-1.6h4.4a1.6 1.6 0 0 1 1.6 1.6v3.9"/>
    <path d="M9.6 10.2V6.6h4.8v3.6"/>`,

  // Uhr mit Zifferblatt
  uhr: `
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="7.3"/>
    <path d="M12 7.2V12l3.2 2.1"/>
    <path d="M12 4.1v1"/>
    <path d="M12 18.9v1"/>
    <path d="M19.9 12h-1"/>
    <path d="M5.1 12h-1"/>`,

  // Standortnadel
  ort: `
    <path d="M12 21.3c4.3-4.5 6.5-7.9 6.5-10.4a6.5 6.5 0 1 0-13 0c0 2.5 2.2 5.9 6.5 10.4z"/>
    <circle cx="12" cy="10.7" r="2.9"/>
    <circle cx="12" cy="10.7" r="1.4"/>`,

  // Telefonhoerer
  telefon: `
    <path d="M8.1 3.5 10 7.4l-1.9 1.7a12.1 12.1 0 0 0 5.4 5.2l1.7-1.9 3.9 1.8v3.5c0 .8-.7 1.5-1.5 1.4C9.9 18.4 4.9 13.4 4 5c-.1-.8.6-1.5 1.4-1.5z"/>
    <path d="M9.4 7.6 8.2 8.7"/>
    <path d="M15.3 13.4l-1.1 1.2"/>`,

  // Stern mit Innenkontur
  stern: `
    <path d="m12 3.3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9z"/>
    <path d="m12 6.2 1.8 3.7 4.1.6-3 2.9.7 4.1-3.6-1.9-3.6 1.9.7-4.1-3-2.9 4.1-.6z"/>`,

  // Herz mit Innenkontur
  herz: `
    <path d="M20.4 6a5 5 0 0 0-7.1 0L12 7.3l-1.3-1.3A5 5 0 0 0 3.6 13l.9.9L12 21.4l7.5-7.5.9-.9a5 5 0 0 0 0-7z"/>
    <path d="M18.7 7.6a3 3 0 0 0-4.2 0L12 10"/>`,

  // Person
  person: `
    <circle cx="12" cy="7.9" r="3.6"/>
    <circle cx="12" cy="7.9" r="2.3"/>
    <path d="M4.4 20.4c0-4.2 3.4-7.6 7.6-7.6s7.6 3.4 7.6 7.6"/>
    <path d="M6.6 20.4c0-3 2.4-5.4 5.4-5.4s5.4 2.4 5.4 5.4"/>`,

  // Warenkorb
  korb: `
    <path d="M3.2 4.6h2.2l2.5 10.9a1.8 1.8 0 0 0 1.8 1.4h7.5a1.8 1.8 0 0 0 1.8-1.4l1.6-7.3H6.1"/>
    <path d="M6.6 10.6h13.3"/>
    <path d="M7.5 13.5h11.8"/>
    <circle cx="10" cy="20" r="1.3"/>
    <circle cx="17.4" cy="20" r="1.3"/>`,

  // Haeckchen
  haken: `
    <path d="m4.4 12.3 5 5L19.6 6.7"/>
    <path d="m4.4 14.6 5 5"/>`,

  // Teigkugel auf der Arbeitsplatte
  teig: `
    <ellipse cx="12" cy="14.4" rx="8.4" ry="5.3"/>
    <ellipse cx="12" cy="13.4" rx="6.3" ry="3.9"/>
    <path d="M6.6 11.2c1.6-1.5 3.5-2.3 5.4-2.3s3.8.8 5.4 2.3"/>
    <path d="M9.7 6.6c.7-1.3 1.9-2.1 2.3-3.1.4 1 1.6 1.8 2.3 3.1"/>`
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
