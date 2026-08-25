// icons.js — Café Marlene
// Feine Linien-Icons, gleicher technischer Aufbau wie in den
// anderen Shops, aber mit eigenen Motiven aus Café und Bistro.
//
// Alle Pfade ohne Füllung, Farbe kommt über currentColor.
//
// Verwendung im HTML:
//   <span data-icon="tasse"></span>

const PFADE = {
  // Kaffeetasse auf Untertasse
  tasse: `
    <path d="M4.2 7.4h12.4v6.2a4.4 4.4 0 0 1-4.4 4.4H8.6a4.4 4.4 0 0 1-4.4-4.4z"/>
    <path d="M16.6 8.8h1.8a2.6 2.6 0 0 1 0 5.2h-1.8"/>
    <path d="M2.6 20.4h15.6"/>
    <path d="M7.6 4.4c.7-.7.7-1.4 0-2.1"/>
    <path d="M10.8 4.4c.7-.7.7-1.4 0-2.1"/>
    <path d="M14 4.4c.7-.7.7-1.4 0-2.1"/>`,

  // Croissant
  croissant: `
    <path d="M3.2 15.6c0-5 4-9 9-9s9 4 9 9"/>
    <path d="M3.2 15.6c1.4 1.2 3 1.8 4.6 1.8"/>
    <path d="M21.2 15.6c-1.4 1.2-3 1.8-4.6 1.8"/>
    <path d="M7.8 17.4c1.5 0 2.9-.6 4.2-1.8 1.3 1.2 2.7 1.8 4.2 1.8"/>
    <path d="M9.4 8.2c.6 1.4.9 2.8.9 4.2"/>
    <path d="M14.6 8.2c-.6 1.4-.9 2.8-.9 4.2"/>`,

  // Cocktailglas
  cocktail: `
    <path d="M3.6 4.6h16.8L12 13.4z"/>
    <path d="M12 13.4v6.2"/>
    <path d="M8.4 19.6h7.2"/>
    <path d="M15.8 7.6 19 4.2"/>
    <circle cx="19.4" cy="3.8" r="1.1"/>`,

  // Teller mit Besteck, fuer die Kueche
  teller: `
    <circle cx="12" cy="12" r="8.6"/>
    <circle cx="12" cy="12" r="5.8"/>
    <path d="M9.4 9.2v2.2a1.3 1.3 0 0 0 2.6 0V9.2"/>
    <path d="M10.7 11.4v3.4"/>
    <path d="M14.4 9.2c.8.7 1.2 1.6 1.2 2.6 0 .8-.4 1.3-1.2 1.5V9.2z"/>
    <path d="M14.2 13.3v1.5"/>`,

  // Kuchenstueck
  kuchen: `
    <path d="M3.4 12.6h17.2v5.2a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6z"/>
    <path d="M3.4 12.6 12 6.2l8.6 6.4"/>
    <path d="M3.6 15.8h16.8"/>
    <path d="M12 6.2V3.6"/>
    <circle cx="12" cy="2.9" r="0.9"/>`,

  // Sonne, fuer das Fruehstueck
  sonne: `
    <circle cx="12" cy="12" r="4.4"/>
    <path d="M12 2.6v2.2"/>
    <path d="M12 19.2v2.2"/>
    <path d="M4.4 12H2.2"/>
    <path d="M21.8 12h-2.2"/>
    <path d="m6.3 6.3-1.6-1.6"/>
    <path d="m19.3 19.3-1.6-1.6"/>
    <path d="m6.3 17.7-1.6 1.6"/>
    <path d="m19.3 4.7-1.6 1.6"/>`,

  // Mond, fuer den Feierabend
  mond: `
    <path d="M20.4 14.8A8.6 8.6 0 0 1 9.2 3.6a8.6 8.6 0 1 0 11.2 11.2z"/>
    <path d="M17.4 4.2v2.4"/>
    <path d="M16.2 5.4h2.4"/>`,

  // Uhr
  uhr: `
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="7.3"/>
    <path d="M12 7.2V12l3.2 2.1"/>
    <path d="M12 4.1v1"/>
    <path d="M12 18.9v1"/>
    <path d="M19.9 12h-1"/>
    <path d="M5.1 12h-1"/>`,

  ort: `
    <path d="M12 21.3c4.3-4.5 6.5-7.9 6.5-10.4a6.5 6.5 0 1 0-13 0c0 2.5 2.2 5.9 6.5 10.4z"/>
    <circle cx="12" cy="10.7" r="2.9"/>
    <circle cx="12" cy="10.7" r="1.4"/>`,

  telefon: `
    <path d="M8.1 3.5 10 7.4l-1.9 1.7a12.1 12.1 0 0 0 5.4 5.2l1.7-1.9 3.9 1.8v3.5c0 .8-.7 1.5-1.5 1.4C9.9 18.4 4.9 13.4 4 5c-.1-.8.6-1.5 1.4-1.5z"/>
    <path d="M9.4 7.6 8.2 8.7"/>
    <path d="M15.3 13.4l-1.1 1.2"/>`,

  brief: `
    <rect x="2.8" y="5.2" width="18.4" height="13.6" rx="1.6"/>
    <path d="M3.4 6.4 12 13l8.6-6.6"/>
    <path d="M3.6 17.8 9.4 12"/>
    <path d="M20.4 17.8 14.6 12"/>`,

  tisch: `
    <path d="M2.8 10.2h18.4"/>
    <path d="M2.8 11.6h18.4"/>
    <path d="M5.4 11.6v8.6"/>
    <path d="M18.6 11.6v8.6"/>
    <path d="M8.2 10.2V6.3a1.6 1.6 0 0 1 1.6-1.6h4.4a1.6 1.6 0 0 1 1.6 1.6v3.9"/>
    <path d="M9.6 10.2V6.6h4.8v3.6"/>`,

  // Kalenderblatt, fuer die Reservierung
  kalender: `
    <rect x="3.2" y="5.2" width="17.6" height="15.6" rx="1.8"/>
    <path d="M3.4 9.8h17.2"/>
    <path d="M8.2 3.2v4"/>
    <path d="M15.8 3.2v4"/>
    <path d="M7.6 13.4h1.6"/>
    <path d="M11.2 13.4h1.6"/>
    <path d="M14.8 13.4h1.6"/>
    <path d="M7.6 17h1.6"/>
    <path d="M11.2 17h1.6"/>`,

  // Aufgeschlagene Speisekarte
  speisekarte: `
    <rect x="4" y="3" width="16" height="18" rx="1.6"/>
    <path d="M7.8 7.2h8.4"/>
    <path d="M7.8 10.8h8.4"/>
    <path d="M7.8 14.4h5.4"/>
    <path d="M7.8 17.8h3.2"/>`,

  korb: `
    <path d="M3.2 4.6h2.2l2.5 10.9a1.8 1.8 0 0 0 1.8 1.4h7.5a1.8 1.8 0 0 0 1.8-1.4L20.6 8.4H6.1"/>
    <path d="M6.6 10.6h13.3"/>
    <path d="M7.5 13.5h11.8"/>
    <circle cx="10" cy="20" r="1.3"/>
    <circle cx="17.4" cy="20" r="1.3"/>`,

  person: `
    <circle cx="12" cy="7.9" r="3.6"/>
    <circle cx="12" cy="7.9" r="2.3"/>
    <path d="M4.4 20.4c0-4.2 3.4-7.6 7.6-7.6s7.6 3.4 7.6 7.6"/>
    <path d="M6.6 20.4c0-3 2.4-5.4 5.4-5.4s5.4 2.4 5.4 5.4"/>`,

  herz: `
    <path d="M20.4 6a5 5 0 0 0-7.1 0L12 7.3l-1.3-1.3A5 5 0 0 0 3.6 13l.9.9L12 21.4l7.5-7.5.9-.9a5 5 0 0 0 0-7z"/>
    <path d="M18.7 7.6a3 3 0 0 0-4.2 0L12 10"/>`,

  stern: `
    <path d="m12 3.3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9z"/>
    <path d="m12 6.2 1.8 3.7 4.1.6-3 2.9.7 4.1-3.6-1.9-3.6 1.9.7-4.1-3-2.9 4.1-.6z"/>`,

  haken: `
    <path d="m4.4 12.3 5 5L19.6 6.7"/>
    <path d="m4.4 14.6 5 5"/>`,

  pfeil: `
    <path d="M4.4 12h15.2"/>
    <path d="m13.6 6 6 6-6 6"/>`
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
