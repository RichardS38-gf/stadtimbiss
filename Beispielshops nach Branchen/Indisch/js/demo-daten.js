/* demo-daten.js — Anaar
   Der Katalog aller Artikel und die Demo-Bestellungen.

   Der Schluessel je Artikel ist die Kennung, die im HTML an den
   Knoepfen als data-id steht. Preis in Euro, schaerfe von 0 bis 3.
   img ist der Pfad zum Bild, alle Namen klein und ohne Umlaute,
   weil der Server zwischen Gross- und Kleinschreibung
   unterscheidet. */

export const LIEFERKOSTEN = 3.90;
export const MINDESTBESTELLWERT = 20.00;

export const KATALOG = {
  /* Vorspeisen */
  'v1': { name: 'Samosa',            dev: 'समोसा',        price: 6.50,  kategorie: 'Vorspeisen',  schaerfe: 1, img: 'Bilder/samosa.webp' },
  'v2': { name: 'Onion Bhaji',       dev: 'प्याज़ भजिया',   price: 6.90,  kategorie: 'Vorspeisen',  schaerfe: 1, img: 'Bilder/bhaji.webp' },
  'v3': { name: 'Papdi Chaat',       dev: 'पापड़ी चाट',    price: 7.90,  kategorie: 'Vorspeisen',  schaerfe: 2, img: 'Bilder/chaat.webp' },

  /* Aus dem Tandoor */
  't1': { name: 'Murgh Tikka',       dev: 'मुर्ग़ टिक्का',   price: 13.90, kategorie: 'Tandoor',     schaerfe: 2, img: 'Bilder/murghtikka.webp' },
  't2': { name: 'Seekh Kebab',       dev: 'सीख कबाब',     price: 14.50, kategorie: 'Tandoor',     schaerfe: 2, img: 'Bilder/seekhkebab.webp' },
  't3': { name: 'Paneer Tikka',      dev: 'पनीर टिक्का',   price: 12.90, kategorie: 'Tandoor',     schaerfe: 1, img: 'Bilder/paneertikka.webp' },
  't4': { name: 'Tandoori Jhinga',   dev: 'तंदूरी झींगा',   price: 17.90, kategorie: 'Tandoor',     schaerfe: 2, img: 'Bilder/jhinga.webp' },

  /* Currys */
  'c1': { name: 'Murgh Makhani',     dev: 'मुर्ग़ मखनी',    price: 15.50, kategorie: 'Currys',      schaerfe: 1, img: 'Bilder/makhani.webp' },
  'c2': { name: 'Rogan Josh',        dev: 'रोगन जोश',      price: 17.50, kategorie: 'Currys',      schaerfe: 2, img: 'Bilder/roganjosh.webp' },
  'c3': { name: 'Vindaloo',          dev: 'विंदालू',        price: 16.50, kategorie: 'Currys',      schaerfe: 3, img: 'Bilder/vindaloo.webp' },
  'c4': { name: 'Korma',             dev: 'कोरमा',         price: 15.90, kategorie: 'Currys',      schaerfe: 0, img: 'Bilder/korma.webp' },

  /* Vegetarisch */
  'g1': { name: 'Palak Paneer',      dev: 'पालक पनीर',     price: 13.50, kategorie: 'Vegetarisch', schaerfe: 1, img: 'Bilder/palakpaneer.webp' },
  'g2': { name: 'Dal Makhani',       dev: 'दाल मखनी',      price: 12.50, kategorie: 'Vegetarisch', schaerfe: 1, img: 'Bilder/dalmakhani.webp' },
  'g3': { name: 'Chana Masala',      dev: 'छोले मसाला',     price: 12.90, kategorie: 'Vegetarisch', schaerfe: 2, img: 'Bilder/chana.webp' },
  'g4': { name: 'Baingan Bharta',    dev: 'बैंगन भर्ता',    price: 13.90, kategorie: 'Vegetarisch', schaerfe: 2, img: 'Bilder/baingan.webp' },

  /* Brot und Reis */
  'b1': { name: 'Butter Naan',       dev: 'नान',           price: 3.90,  kategorie: 'Brot & Reis', schaerfe: 0, img: 'Bilder/naan.webp' },
  'b2': { name: 'Garlic Naan',       dev: 'लहसुन नान',     price: 4.50,  kategorie: 'Brot & Reis', schaerfe: 0, img: 'Bilder/garlicnaan.webp' },
  'b3': { name: 'Basmatireis',       dev: 'बासमती',        price: 3.50,  kategorie: 'Brot & Reis', schaerfe: 0, img: 'Bilder/basmati.webp' },
  'b4': { name: 'Jeera Reis',        dev: 'जीरा चावल',      price: 4.20,  kategorie: 'Brot & Reis', schaerfe: 0, img: 'Bilder/jeerareis.webp' },

  /* Suesses */
  'd1': { name: 'Gulab Jamun',       dev: 'गुलाब जामुन',    price: 5.90,  kategorie: 'Süßes',       schaerfe: 0, img: 'Bilder/gulabjamun.webp' },
  'd2': { name: 'Kheer',             dev: 'खीर',           price: 5.50,  kategorie: 'Süßes',       schaerfe: 0, img: 'Bilder/kheer.webp' },

  /* Getraenke */
  'k1': { name: 'Mango Lassi',       dev: 'मैंगो लस्सी',     price: 4.90,  kategorie: 'Getränke',    schaerfe: 0, img: 'Bilder/lassi.webp' },
  'k2': { name: 'Masala Chai',       dev: 'मसाला चाय',     price: 3.90,  kategorie: 'Getränke',    schaerfe: 0, img: 'Bilder/chai.webp' },
  'k3': { name: 'Nimbu Pani',        dev: 'नीम्बू पानी',    price: 4.20,  kategorie: 'Getränke',    schaerfe: 0, img: 'Bilder/nimbupani.webp' },
  'k4': { name: 'Lager 0,33',        dev: 'बियर',          price: 4.50,  kategorie: 'Getränke',    schaerfe: 0, img: 'Bilder/lager.webp' }
};

/* Demo-Bestellungen fuer das Kundenkonto. Die Kennungen in
   artikel muessen im KATALOG oben vorkommen, sonst kann die
   Nachbestellen-Funktion sie nicht auflösen. */
export const BESTELLUNGEN = [
  {
    nummer: 'AN-3182', datum: '2026-08-30', status: 'Geliefert',
    summe: 38.80, modus: 'Lieferung',
    artikel: [
      { id: 'c1', menge: 1 },
      { id: 'g2', menge: 1 },
      { id: 'b1', menge: 2 },
      { id: 'k1', menge: 1 }
    ]
  },
  {
    nummer: 'AN-3140', datum: '2026-08-21', status: 'Geliefert',
    summe: 46.30, modus: 'Lieferung',
    artikel: [
      { id: 't1', menge: 1 },
      { id: 'c2', menge: 1 },
      { id: 'b3', menge: 1 },
      { id: 'd1', menge: 2 }
    ]
  },
  {
    nummer: 'AN-3097', datum: '2026-08-09', status: 'Geliefert',
    summe: 29.70, modus: 'Abholung',
    artikel: [
      { id: 'g1', menge: 1 },
      { id: 'g3', menge: 1 },
      { id: 'b2', menge: 1 }
    ]
  },
  {
    nummer: 'AN-3055', datum: '2026-07-28', status: 'Geliefert',
    summe: 52.40, modus: 'Lieferung',
    artikel: [
      { id: 'c3', menge: 1 },
      { id: 't2', menge: 1 },
      { id: 't3', menge: 1 },
      { id: 'b1', menge: 1 }
    ]
  },
  {
    nummer: 'AN-3011', datum: '2026-07-14', status: 'Geliefert',
    summe: 24.30, modus: 'Abholung',
    artikel: [
      { id: 'v1', menge: 2 },
      { id: 'g2', menge: 1 }
    ]
  },
  {
    nummer: 'AN-2968', datum: '2026-06-30', status: 'Geliefert',
    summe: 41.10, modus: 'Lieferung',
    artikel: [
      { id: 'c4', menge: 1 },
      { id: 'g4', menge: 1 },
      { id: 'b4', menge: 1 },
      { id: 'k2', menge: 2 }
    ]
  },
  {
    nummer: 'AN-2921', datum: '2026-06-15', status: 'Geliefert',
    summe: 33.60, modus: 'Lieferung',
    artikel: [
      { id: 't4', menge: 1 },
      { id: 'b3', menge: 1 },
      { id: 'd2', menge: 1 }
    ]
  }
];
