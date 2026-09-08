/* demo-daten.js — Anaar
   Beispieldaten fuer den Demo-Kundenbereich und der Katalog
   aller Artikel.

   Diese Datei ist die EINZIGE, die sich zwischen den Shops
   unterscheidet. auth.js, konto.js und konto.css sind
   shop-neutral und erwarten genau die Exporte, die hier stehen.

   Der Schluessel je Artikel ist die Kennung, die im HTML an den
   Knoepfen als data-id steht. Preis in Euro, schaerfe von 0 bis 3
   (auf der Bestellseite wird die Skala derzeit nicht angezeigt,
   der Wert bleibt fuer die Favoritenansicht erhalten). img ist
   der Pfad zum Bild, alle Namen klein und ohne Umlaute, weil der
   Server zwischen Gross- und Kleinschreibung unterscheidet. */

export const LIEFERKOSTEN = 3.90;
export const MINDESTBESTELLWERT = 20.00;

const TAG = 24 * 60 * 60 * 1000;
const vorTagen = (n) => new Date(Date.now() - n * TAG).toISOString();
const datumIn = (n) => new Date(Date.now() + n * TAG).toISOString().slice(0, 10);

export const DEMO_PROFILE = {
  id: 'demo-kunde-0001',
  first_name: 'Max',
  last_name: 'Mustermann',
  email: 'max.mustermann@example.de',
  phone: '0531 887744',
  birth_date: '1991-06-14',
  marketing_consent: true,
  created_at: vorTagen(198),
  updated_at: vorTagen(7)
};

export const DEMO_ADDRESSES = [
  {
    id: 'adr-1', profile_id: 'demo-kunde-0001', label: 'Zuhause',
    first_name: 'Max', last_name: 'Mustermann',
    street: 'Wilhelmstraße 22', postal_code: '38100', city: 'Braunschweig',
    phone: '0531 887744', delivery_note: 'Zweiter Stock, Klingel Mustermann',
    is_default: true, created_at: vorTagen(198)
  },
  {
    id: 'adr-2', profile_id: 'demo-kunde-0001', label: 'Büro',
    first_name: 'Max', last_name: 'Mustermann',
    street: 'Hamburger Straße 9', postal_code: '38114', city: 'Braunschweig',
    phone: '0531 887744', delivery_note: 'Am Empfang abgeben',
    is_default: false, created_at: vorTagen(52)
  }
];

export const DEMO_PAYMENT_METHODS = [
  {
    id: 'pay-1', profile_id: 'demo-kunde-0001', type: 'karte',
    stripe_payment_method_id: null, brand: 'Visa', last4: '4417',
    exp_month: 8, exp_year: 2028, is_default: true, created_at: vorTagen(198)
  },
  {
    id: 'pay-2', profile_id: 'demo-kunde-0001', type: 'bar',
    stripe_payment_method_id: null, brand: null, last4: null,
    exp_month: null, exp_year: null, is_default: false, created_at: vorTagen(198)
  }
];

function bestellung(id, nummer, tage, mode, positionen, extras = {}) {
  const subtotal = positionen.reduce((s, p) => s + p.unit_price * p.qty, 0);
  const delivery_fee = mode === 'lieferung' ? LIEFERKOSTEN : 0;
  const discount = extras.discount || 0;
  return {
    id,
    profile_id: 'demo-kunde-0001',
    order_number: nummer,
    status: extras.status || 'abgeschlossen',
    mode,
    address_id: mode === 'lieferung' ? 'adr-1' : null,
    address_snapshot: mode === 'lieferung'
      ? { street: 'Wilhelmstraße 22', postal_code: '38100', city: 'Braunschweig' }
      : null,
    payment_type: extras.payment_type || 'karte',
    subtotal: Math.round(subtotal * 100) / 100,
    delivery_fee,
    discount,
    voucher_id: extras.voucher_id || null,
    total: Math.round((subtotal + delivery_fee - discount) * 100) / 100,
    note: extras.note || null,
    placed_at: vorTagen(tage),
    completed_at: vorTagen(tage),
    items: positionen.map((p, i) => ({
      id: `${id}-pos-${i + 1}`,
      order_id: id,
      product_id: p.product_id,
      name: p.name,
      unit_price: p.unit_price,
      qty: p.qty,
      options: null
    }))
  };
}

/* Sieben Bestellungen, davon sechs ueber dem Mindestwert von 15
   Euro aus TREUE.min_order_value in auth.js. AN-3011 liegt
   bewusst darunter und hat deshalb keinen Stempel ergeben, sonst
   passt die Zahl auf der Stempelkarte nicht zur Liste. */
export const DEMO_ORDERS = [
  bestellung('ord-7', 'AN-3182', 5, 'lieferung', [
    { product_id: 'c1', name: 'Murgh Makhani', unit_price: 15.50, qty: 1 },
    { product_id: 'g2', name: 'Dal Makhani', unit_price: 12.50, qty: 1 },
    { product_id: 'b1', name: 'Butter Naan', unit_price: 3.90, qty: 2 },
    { product_id: 'k1', name: 'Mango Lassi', unit_price: 4.90, qty: 1 }
  ]),
  bestellung('ord-6', 'AN-3140', 14, 'abholung', [
    { product_id: 't1', name: 'Murgh Tikka', unit_price: 13.90, qty: 1 },
    { product_id: 'c2', name: 'Rogan Josh', unit_price: 17.50, qty: 1 },
    { product_id: 'b3', name: 'Basmatireis', unit_price: 3.50, qty: 1 },
    { product_id: 'd1', name: 'Gulab Jamun', unit_price: 5.90, qty: 2 }
  ]),
  bestellung('ord-5', 'AN-3097', 23, 'lieferung', [
    { product_id: 'g1', name: 'Palak Paneer', unit_price: 13.50, qty: 1 },
    { product_id: 'g3', name: 'Chana Masala', unit_price: 12.90, qty: 1 },
    { product_id: 'b2', name: 'Garlic Naan', unit_price: 4.50, qty: 1 }
  ]),
  bestellung('ord-4', 'AN-3055', 34, 'lieferung', [
    { product_id: 'c3', name: 'Vindaloo', unit_price: 16.50, qty: 1 },
    { product_id: 't2', name: 'Seekh Kebab', unit_price: 14.50, qty: 1 },
    { product_id: 't3', name: 'Paneer Tikka', unit_price: 12.90, qty: 1 },
    { product_id: 'b1', name: 'Butter Naan', unit_price: 3.90, qty: 1 }
  ]),
  bestellung('ord-3', 'AN-3011', 48, 'abholung', [
    { product_id: 'v1', name: 'Samosa', unit_price: 6.50, qty: 1 },
    { product_id: 'b1', name: 'Butter Naan', unit_price: 3.90, qty: 1 }
  ], { payment_type: 'bar' }),
  bestellung('ord-2', 'AN-2968', 61, 'lieferung', [
    { product_id: 'c4', name: 'Korma', unit_price: 15.90, qty: 1 },
    { product_id: 'g4', name: 'Baingan Bharta', unit_price: 13.90, qty: 1 },
    { product_id: 'b4', name: 'Jeera Reis', unit_price: 4.20, qty: 1 },
    { product_id: 'k2', name: 'Masala Chai', unit_price: 3.90, qty: 2 }
  ]),
  bestellung('ord-1', 'AN-2921', 74, 'lieferung', [
    { product_id: 't4', name: 'Tandoori Jhinga', unit_price: 17.90, qty: 1 },
    { product_id: 'b3', name: 'Basmatireis', unit_price: 3.50, qty: 1 },
    { product_id: 'd2', name: 'Kheer', unit_price: 5.50, qty: 1 }
  ])
];

export const DEMO_STAMP_CARD = {
  id: 'karte-1',
  profile_id: 'demo-kunde-0001',
  stamps_count: 6,
  status: 'aktiv',
  completed_at: null,
  created_at: vorTagen(74)
};

export const DEMO_VOUCHERS = [
  {
    id: 'gut-1',
    profile_id: 'demo-kunde-0001',
    code: 'GEBURTSTAG-5EUR',
    type: 'amount',
    value: 5.00,
    description: '5 Euro Geburtstagsgutschein',
    source: 'geburtstag',
    status: 'offen',
    valid_until: datumIn(41),
    stamp_card_id: null,
    redeemed_order_id: null,
    created_at: vorTagen(19)
  }
];

export const DEMO_FAVORITES = [
  { id: 'fav-1', profile_id: 'demo-kunde-0001', product_id: 'c1', created_at: vorTagen(60) },
  { id: 'fav-2', profile_id: 'demo-kunde-0001', product_id: 't1', created_at: vorTagen(41) },
  { id: 'fav-3', profile_id: 'demo-kunde-0001', product_id: 'g2', created_at: vorTagen(12) }
];

export const DEMO_RESERVATIONS = [
  {
    id: 'res-1', profile_id: 'demo-kunde-0001',
    reservation_date: datumIn(4), reservation_time: '19:00', guests: 4,
    first_name: 'Max', last_name: 'Mustermann',
    phone: '0531 887744', email: 'max.mustermann@example.de',
    note: 'Gerne der Tisch am Fenster', status: 'bestaetigt', created_at: vorTagen(2)
  },
  {
    id: 'res-2', profile_id: 'demo-kunde-0001',
    reservation_date: datumIn(-27), reservation_time: '18:30', guests: 2,
    first_name: 'Max', last_name: 'Mustermann',
    phone: '0531 887744', email: 'max.mustermann@example.de',
    note: null, status: 'bestaetigt', created_at: vorTagen(33)
  }
];

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

/* Genau dieser Name wird von auth.js importiert. Fehlt er, bricht
   das Modul beim Verknuepfen ab und auf jeder Seite laeuft dann
   kein einziges Skript mehr. */
export function demoDatenSatz() {
  return {
    profile: structuredClone(DEMO_PROFILE),
    addresses: structuredClone(DEMO_ADDRESSES),
    payment_methods: structuredClone(DEMO_PAYMENT_METHODS),
    orders: structuredClone(DEMO_ORDERS),
    stamp_card: structuredClone(DEMO_STAMP_CARD),
    vouchers: structuredClone(DEMO_VOUCHERS),
    favorites: structuredClone(DEMO_FAVORITES),
    reservations: structuredClone(DEMO_RESERVATIONS)
  };
}
