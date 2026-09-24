// icons.js — Bosporus Grill
// Feine Linien-Icons mit doppelten Konturen, gleicher Stil wie in den
// anderen Shops, aber mit eigenen Motiven aus Grill und Orient.
//
// Alle Pfade ohne Füllung, Farbe kommt über currentColor.
//
// Verwendung im HTML:
//   <span data-icon="drehspiess"></span>

const PFADE = {
  // Drehspiess, das Wahrzeichen jedes Doenerladens
  drehspiess: `
    <path d="M12 2.6v18.8"/>
    <path d="M8.4 20.6h7.2"/>
    <path d="M12 4.4c-2.9 1-4.6 3.6-4.6 6.6 0 3.2 1.9 5.6 4.6 6.6 2.7-1 4.6-3.4 4.6-6.6 0-3-1.7-5.6-4.6-6.6z"/>
    <path d="M8.1 8.4h7.8"/>
    <path d="M7.6 11.6h8.8"/>
    <path d="M8.4 14.8h7.2"/>`,

  // Grillrost mit Flamme
  grill: `
    <path d="M3.4 12.6h17.2"/>
    <path d="M3.4 15.2h17.2"/>
    <path d="M5.6 15.2 4.4 20.6"/>
    <path d="M18.4 15.2l1.2 5.4"/>
    <path d="M12 3.4c1.6 1.6 2.4 3 2.4 4.4a2.4 2.4 0 0 1-4.8 0c0-1.4.8-2.8 2.4-4.4z"/>
    <path d="M7.6 6.4c.9.9 1.4 1.8 1.4 2.6"/>
    <path d="M16.4 6.4c-.9.9-1.4 1.8-1.4 2.6"/>`,

  // Spiess mit Fleisch und Gemuese
  spiess: `
    <path d="M4.4 19.6 19.6 4.4"/>
    <path d="M18.2 3 21 5.8"/>
    <rect x="6.8" y="12.4" width="3.6" height="3.6" rx="0.8" transform="rotate(-45 8.6 14.2)"/>
    <rect x="11.4" y="7.8" width="3.6" height="3.6" rx="0.8" transform="rotate(-45 13.2 9.6)"/>
    <circle cx="10.9" cy="11.9" r="1.2"/>`,

  // Tuerkische Teekanne
  teekanne: `
    <path d="M6.4 9.4h9.4a4 4 0 0 1 0 8H6.4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z"/>
    <path d="M15.8 11.4a2 2 0 0 1 0 4"/>
    <path d="M5.4 11.4 2.6 8.6"/>
    <path d="M9.4 9.4V7.6a1.6 1.6 0 0 1 3.2 0v1.8"/>
    <path d="M11 5.2V3.4"/>
    <path d="M5.4 17.4v2.2h11v-2.2"/>`,

  // Fladenbrot
  brot: `
    <ellipse cx="12" cy="12" rx="9" ry="7.2"/>
    <ellipse cx="12" cy="12" rx="6.6" ry="4.9"/>
    <path d="M9.4 10.6h.01"/>
    <path d="M13.4 11h.01"/>
    <path d="M11.4 13.4h.01"/>`,

  // Kraeuter und Salat
  blatt: `
    <path d="M20.3 3.7C11.4 3.7 5.2 8.5 5.2 15.3c0 1.9.5 3.5 1.4 4.9 6.4-.4 13.7-5.5 13.7-16.5z"/>
    <path d="M3.7 20.3C6.8 15.2 11 11.4 16.5 8.7"/>
    <path d="M9.4 15.3c1.4-2.2 3.3-4 5.5-5.4"/>`,

  // Meze-Teller mit kleinen Schaelchen
  meze: `
    <circle cx="12" cy="12" r="9"/>
    <circle cx="9" cy="9.6" r="2.4"/>
    <circle cx="15.2" cy="9.6" r="2.4"/>
    <circle cx="12" cy="15.4" r="2.4"/>`,

  // Halbmond mit Stern, orientalisches Zeichen
  halbmond: `
    <path d="M16.4 3.6a9 9 0 1 0 0 16.8 9.6 9.6 0 0 1 0-16.8z"/>
    <path d="m18.6 8.4.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z"/>`,

  // Lieferroller
  roller: `
    <circle cx="6" cy="17.3" r="2.9"/>
    <circle cx="6" cy="17.3" r="1"/>
    <circle cx="18.1" cy="17.3" r="2.9"/>
    <circle cx="18.1" cy="17.3" r="1"/>
    <path d="M8.9 17.3h6.3"/>
    <path d="M5.6 14.5V9.6a2 2 0 0 1 2-2h2.2l3.9 7"/>
    <path d="M14.4 5.4h2.9l1.5 9.1"/>
    <path d="M16.2 8.3h1.5"/>`,

  // Tisch mit Stuhl
  tisch: `
    <path d="M2.8 10.2h18.4"/>
    <path d="M2.8 11.6h18.4"/>
    <path d="M5.4 11.6v8.6"/>
    <path d="M18.6 11.6v8.6"/>
    <path d="M8.2 10.2V6.3a1.6 1.6 0 0 1 1.6-1.6h4.4a1.6 1.6 0 0 1 1.6 1.6v3.9"/>
    <path d="M9.6 10.2V6.6h4.8v3.6"/>`,

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

  stern: `
    <path d="m12 3.3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9z"/>
    <path d="m12 6.2 1.8 3.7 4.1.6-3 2.9.7 4.1-3.6-1.9-3.6 1.9.7-4.1-3-2.9 4.1-.6z"/>`,

  herz: `
    <path d="M20.4 6a5 5 0 0 0-7.1 0L12 7.3l-1.3-1.3A5 5 0 0 0 3.6 13l.9.9L12 21.4l7.5-7.5.9-.9a5 5 0 0 0 0-7z"/>
    <path d="M18.7 7.6a3 3 0 0 0-4.2 0L12 10"/>`,

  person: `
    <circle cx="12" cy="7.9" r="3.6"/>
    <circle cx="12" cy="7.9" r="2.3"/>
    <path d="M4.4 20.4c0-4.2 3.4-7.6 7.6-7.6s7.6 3.4 7.6 7.6"/>
    <path d="M6.6 20.4c0-3 2.4-5.4 5.4-5.4s5.4 2.4 5.4 5.4"/>`,

  korb: `
    <path d="M3.2 4.6h2.2l2.5 10.9a1.8 1.8 0 0 0 1.8 1.4h7.5a1.8 1.8 0 0 0 1.8-1.4L20.6 8.4H6.1"/>
    <path d="M6.6 10.6h13.3"/>
    <path d="M7.5 13.5h11.8"/>
    <circle cx="10" cy="20" r="1.3"/>
    <circle cx="17.4" cy="20" r="1.3"/>`,

  haken: `
    <path d="m4.4 12.3 5 5L19.6 6.7"/>
    <path d="m4.4 14.6 5 5"/>`
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
