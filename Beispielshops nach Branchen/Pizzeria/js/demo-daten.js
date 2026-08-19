// demo-daten.js — Beispieldaten fuer den Demo-Kundenbereich
// Shop: Pizzeria Napoli
//
// Diese Datei ist die EINZIGE, die sich zwischen den Shops unterscheidet.
// auth.js, konto.js und konto.css sind shop-neutral.
//
// Alle Artikel-IDs, Namen und Preise muessen exakt zu den data-Attributen
// der .add-to-cart Buttons in bestellen.html passen.

// Lieferkosten dieses Shops. Liegt hier und nicht in auth.js, damit
// auth.js in allen Shops byte-identisch bleibt.
export const LIEFERKOSTEN = 2.50;

// Datumshilfen: relativ zu heute, damit die Demo nicht veraltet
const TAG = 24 * 60 * 60 * 1000;
const vorTagen = (n) => new Date(Date.now() - n * TAG).toISOString();
const datumIn = (n) => new Date(Date.now() + n * TAG).toISOString().slice(0, 10);

export const DEMO_PROFILE = {
  id: 'demo-kunde-0001',
  first_name: 'Max',
  last_name: 'Mustermann',
  email: 'max.mustermann@example.de',
  phone: '0531 123456',
  birth_date: '1991-06-14',
  marketing_consent: true,
  created_at: vorTagen(214),
  updated_at: vorTagen(9)
};

export const DEMO_ADDRESSES = [
  {
    id: 'adr-1',
    profile_id: 'demo-kunde-0001',
    label: 'Zuhause',
    first_name: 'Max',
    last_name: 'Mustermann',
    street: 'Wilhelmstraße 24',
    postal_code: '38100',
    city: 'Braunschweig',
    phone: '0531 123456',
    delivery_note: 'Zweiter Stock, Klingel Mustermann',
    is_default: true,
    created_at: vorTagen(214)
  },
  {
    id: 'adr-2',
    profile_id: 'demo-kunde-0001',
    label: 'Arbeit',
    first_name: 'Max',
    last_name: 'Mustermann',
    street: 'Hamburger Straße 210',
    postal_code: '38114',
    city: 'Braunschweig',
    phone: '0531 123456',
    delivery_note: 'Bitte am Empfang abgeben',
    is_default: false,
    created_at: vorTagen(61)
  }
];

export const DEMO_PAYMENT_METHODS = [
  {
    id: 'pay-1', profile_id: 'demo-kunde-0001', type: 'ec',
    stripe_payment_method_id: null, brand: null, last4: null,
    exp_month: null, exp_year: null, is_default: true, created_at: vorTagen(214)
  },
  {
    id: 'pay-2', profile_id: 'demo-kunde-0001', type: 'bar',
    stripe_payment_method_id: null, brand: null, last4: null,
    exp_month: null, exp_year: null, is_default: false, created_at: vorTagen(214)
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
      ? { street: 'Wilhelmstraße 24', postal_code: '38100', city: 'Braunschweig' }
      : null,
    payment_type: extras.payment_type || 'ec',
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

// 7 Bestellungen, davon 6 ueber dem Mindestbestellwert von 15 Euro.
// Die Bestellung NA-2266 liegt darunter und hat deshalb bewusst keinen
// Stempel ergeben. Das laesst sich beim Kundengespraech gut zeigen.
export const DEMO_ORDERS = [
  bestellung('ord-7', 'NA-2418', 6, 'lieferung', [
    { product_id: 'p3', name: 'Diavola', unit_price: 12.50, qty: 1 },
    { product_id: 'p1', name: 'Margherita', unit_price: 9.50, qty: 1 },
    { product_id: 'd1', name: 'Tiramisu', unit_price: 6.50, qty: 1 }
  ]),
  bestellung('ord-6', 'NA-2377', 15, 'abholung', [
    { product_id: 'p8', name: 'Bufala', unit_price: 14.50, qty: 1 },
    { product_id: 'a1', name: 'Bruschetta al Pomodoro', unit_price: 6.50, qty: 1 },
    { product_id: 'g6', name: 'Chianti 0,2l', unit_price: 5.50, qty: 1 }
  ]),
  bestellung('ord-5', 'NA-2301', 24, 'lieferung', [
    { product_id: 'pa1', name: 'Spaghetti Carbonara', unit_price: 13.50, qty: 1 },
    { product_id: 'pa3', name: 'Tagliatelle al Ragù', unit_price: 14.50, qty: 1 },
    { product_id: 'g1', name: 'Acqua Panna 0,75l', unit_price: 3.50, qty: 1 }
  ]),
  bestellung('ord-4', 'NA-2266', 33, 'abholung', [
    { product_id: 'p2', name: 'Marinara', unit_price: 8.50, qty: 1 },
    { product_id: 'g3', name: 'Coca-Cola 0,33l', unit_price: 2.90, qty: 1 }
  ], { payment_type: 'bar' }),
  bestellung('ord-3', 'NA-2198', 45, 'lieferung', [
    { product_id: 'p11', name: 'Tartufo', unit_price: 16.50, qty: 1 },
    { product_id: 'a3', name: 'Insalata Caprese', unit_price: 9.50, qty: 1 }
  ]),
  bestellung('ord-2', 'NA-2104', 58, 'lieferung', [
    { product_id: 'p12', name: 'Calzone', unit_price: 13.00, qty: 1 },
    { product_id: 'p5', name: 'Prosciutto e Funghi', unit_price: 13.00, qty: 1 },
    { product_id: 'g5', name: 'Birra Moretti 0,33l', unit_price: 3.90, qty: 2 }
  ]),
  bestellung('ord-1', 'NA-2011', 72, 'abholung', [
    { product_id: 'pa4', name: 'Lasagne al Forno', unit_price: 14.00, qty: 1 },
    { product_id: 'a4', name: 'Focaccia al Rosmarino', unit_price: 5.50, qty: 1 },
    { product_id: 'g7', name: 'Espresso', unit_price: 2.20, qty: 2 }
  ], { payment_type: 'bar' })
];

export const DEMO_STAMP_CARD = {
  id: 'karte-1',
  profile_id: 'demo-kunde-0001',
  stamps_count: 6,
  status: 'aktiv',
  completed_at: null,
  created_at: vorTagen(72)
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
    valid_until: datumIn(38),
    stamp_card_id: null,
    redeemed_order_id: null,
    created_at: vorTagen(22)
  }
];

export const DEMO_FAVORITES = [
  { id: 'fav-1', profile_id: 'demo-kunde-0001', product_id: 'p3',  created_at: vorTagen(58) },
  { id: 'fav-2', profile_id: 'demo-kunde-0001', product_id: 'p8',  created_at: vorTagen(45) },
  { id: 'fav-3', profile_id: 'demo-kunde-0001', product_id: 'd1',  created_at: vorTagen(15) }
];

export const DEMO_RESERVATIONS = [
  {
    id: 'res-1',
    profile_id: 'demo-kunde-0001',
    reservation_date: datumIn(4),
    reservation_time: '19:30',
    guests: 4,
    first_name: 'Max',
    last_name: 'Mustermann',
    phone: '0531 123456',
    email: 'max.mustermann@example.de',
    note: 'Gerne ein Tisch am Fenster',
    status: 'bestaetigt',
    created_at: vorTagen(3)
  },
  {
    id: 'res-2',
    profile_id: 'demo-kunde-0001',
    reservation_date: datumIn(-27),
    reservation_time: '18:00',
    guests: 2,
    first_name: 'Max',
    last_name: 'Mustermann',
    phone: '0531 123456',
    email: 'max.mustermann@example.de',
    note: null,
    status: 'bestaetigt',
    created_at: vorTagen(33)
  }
];

// Artikelkatalog fuer die Favoriten-Ansicht.
// Die Bildpfade zeigen vorerst auf einen Platzhalter, bis die
// echten Produktbilder erstellt sind.
export const KATALOG = {
  'p1': { name: "Margherita", price: 9.50, kategorie: 'Pizza', img: 'Bilder/platzhalter.svg' },
  'p2': { name: "Marinara", price: 8.50, kategorie: 'Pizza', img: 'Bilder/platzhalter.svg' },
  'p3': { name: "Diavola", price: 12.50, kategorie: 'Pizza', img: 'Bilder/platzhalter.svg' },
  'p4': { name: "Quattro Formaggi", price: 13.50, kategorie: 'Pizza', img: 'Bilder/platzhalter.svg' },
  'p5': { name: "Prosciutto e Funghi", price: 13.00, kategorie: 'Pizza', img: 'Bilder/platzhalter.svg' },
  'p6': { name: "Capricciosa", price: 14.00, kategorie: 'Pizza', img: 'Bilder/platzhalter.svg' },
  'p7': { name: "Napoli", price: 12.00, kategorie: 'Pizza', img: 'Bilder/platzhalter.svg' },
  'p8': { name: "Bufala", price: 14.50, kategorie: 'Pizza', img: 'Bilder/platzhalter.svg' },
  'p9': { name: "Salsiccia e Friarielli", price: 14.50, kategorie: 'Pizza', img: 'Bilder/platzhalter.svg' },
  'p10': { name: "Ortolana", price: 12.50, kategorie: 'Pizza', img: 'Bilder/platzhalter.svg' },
  'p11': { name: "Tartufo", price: 16.50, kategorie: 'Pizza', img: 'Bilder/platzhalter.svg' },
  'p12': { name: "Calzone", price: 13.00, kategorie: 'Pizza', img: 'Bilder/platzhalter.svg' },
  'pa1': { name: "Spaghetti Carbonara", price: 13.50, kategorie: 'Pasta', img: 'Bilder/platzhalter.svg' },
  'pa2': { name: "Penne all'Arrabbiata", price: 11.50, kategorie: 'Pasta', img: 'Bilder/platzhalter.svg' },
  'pa3': { name: "Tagliatelle al Ragù", price: 14.50, kategorie: 'Pasta', img: 'Bilder/platzhalter.svg' },
  'pa4': { name: "Lasagne al Forno", price: 14.00, kategorie: 'Pasta', img: 'Bilder/platzhalter.svg' },
  'pa5': { name: "Gnocchi al Gorgonzola", price: 13.50, kategorie: 'Pasta', img: 'Bilder/platzhalter.svg' },
  'pa6': { name: "Spaghetti Aglio e Olio", price: 10.50, kategorie: 'Pasta', img: 'Bilder/platzhalter.svg' },
  'a1': { name: "Bruschetta al Pomodoro", price: 6.50, kategorie: 'Antipasti', img: 'Bilder/platzhalter.svg' },
  'a2': { name: "Antipasto Misto", price: 11.50, kategorie: 'Antipasti', img: 'Bilder/platzhalter.svg' },
  'a3': { name: "Insalata Caprese", price: 9.50, kategorie: 'Antipasti', img: 'Bilder/platzhalter.svg' },
  'a4': { name: "Focaccia al Rosmarino", price: 5.50, kategorie: 'Antipasti', img: 'Bilder/platzhalter.svg' },
  'a5': { name: "Olive Ascolane", price: 7.00, kategorie: 'Antipasti', img: 'Bilder/platzhalter.svg' },
  'd1': { name: "Tiramisu", price: 6.50, kategorie: 'Dolci', img: 'Bilder/platzhalter.svg' },
  'd2': { name: "Panna Cotta", price: 5.50, kategorie: 'Dolci', img: 'Bilder/platzhalter.svg' },
  'd3': { name: "Cannolo Siciliano", price: 5.00, kategorie: 'Dolci', img: 'Bilder/platzhalter.svg' },
  'g1': { name: "Acqua Panna 0,75l", price: 3.50, kategorie: 'Bevande', img: 'Bilder/platzhalter.svg' },
  'g2': { name: "San Pellegrino 0,75l", price: 3.90, kategorie: 'Bevande', img: 'Bilder/platzhalter.svg' },
  'g3': { name: "Coca-Cola 0,33l", price: 2.90, kategorie: 'Bevande', img: 'Bilder/platzhalter.svg' },
  'g4': { name: "Limonata 0,33l", price: 3.20, kategorie: 'Bevande', img: 'Bilder/platzhalter.svg' },
  'g5': { name: "Birra Moretti 0,33l", price: 3.90, kategorie: 'Bevande', img: 'Bilder/platzhalter.svg' },
  'g6': { name: "Chianti 0,2l", price: 5.50, kategorie: 'Bevande', img: 'Bilder/platzhalter.svg' },
  'g7': { name: "Espresso", price: 2.20, kategorie: 'Bevande', img: 'Bilder/platzhalter.svg' },
  'g8': { name: "Cappuccino", price: 3.20, kategorie: 'Bevande', img: 'Bilder/platzhalter.svg' }
};

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
