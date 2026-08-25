// demo-daten.js — Beispieldaten fuer den Demo-Kundenbereich
// Shop: Café Marlene
//
// Diese Datei ist die EINZIGE, die sich zwischen den Shops unterscheidet.
// auth.js, konto.js und konto.css sind shop-neutral.

export const LIEFERKOSTEN = 2.50;

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
    id: 'adr-1', profile_id: 'demo-kunde-0001', label: 'Zuhause',
    first_name: 'Max', last_name: 'Mustermann',
    street: 'Wilhelmstraße 24', postal_code: '38100', city: 'Braunschweig',
    phone: '0531 123456', delivery_note: 'Zweiter Stock, Klingel Mustermann',
    is_default: true, created_at: vorTagen(214)
  },
  {
    id: 'adr-2', profile_id: 'demo-kunde-0001', label: 'Arbeit',
    first_name: 'Max', last_name: 'Mustermann',
    street: 'Hamburger Straße 210', postal_code: '38114', city: 'Braunschweig',
    phone: '0531 123456', delivery_note: 'Bitte am Empfang abgeben',
    is_default: false, created_at: vorTagen(61)
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
// MA-2266 liegt bewusst darunter und hat deshalb keinen Stempel ergeben.
export const DEMO_ORDERS = [
  bestellung('ord-7', 'MA-2418', 6, 'lieferung', [
    { product_id: 'k1', name: 'Cappuccino', unit_price: 3.60, qty: 2 },
    { product_id: 's2', name: 'Käsekuchen', unit_price: 4.50, qty: 2 }
  ]),
  bestellung('ord-6', 'MA-2377', 15, 'abholung', [
    { product_id: 'e2', name: 'Croque Marlene', unit_price: 11.50, qty: 1 },
    { product_id: 'e5', name: 'Bowl mit Falafel', unit_price: 13.50, qty: 1 }
  ]),
  bestellung('ord-5', 'MA-2301', 24, 'lieferung', [
    { product_id: 'e1', name: 'Frühstücksteller', unit_price: 14.90, qty: 1 },
    { product_id: 'k2', name: 'Flat White', unit_price: 4.20, qty: 1 },
    { product_id: 's1', name: 'Croissant', unit_price: 2.80, qty: 2 }
  ]),
  bestellung('ord-4', 'MA-2266', 33, 'abholung', [
    { product_id: 'k1', name: 'Cappuccino', unit_price: 3.60, qty: 1 },
    { product_id: 's1', name: 'Croissant', unit_price: 2.80, qty: 1 }
  ], { payment_type: 'bar' }),
  bestellung('ord-3', 'MA-2198', 45, 'lieferung', [
    { product_id: 'e3', name: 'Pasta al Limone', unit_price: 13.90, qty: 1 },
    { product_id: 'c1', name: 'Aperol Spritz', unit_price: 8.50, qty: 2 }
  ]),
  bestellung('ord-2', 'MA-2104', 58, 'lieferung', [
    { product_id: 'e4', name: 'Flammkuchen', unit_price: 12.50, qty: 1 },
    { product_id: 'c3', name: 'Gin Basil Smash', unit_price: 10.50, qty: 1 }
  ]),
  bestellung('ord-1', 'MA-2011', 72, 'abholung', [
    { product_id: 'e6', name: 'Rührei mit Lachs', unit_price: 12.90, qty: 1 },
    { product_id: 'k4', name: 'Latte Macchiato', unit_price: 4.40, qty: 1 },
    { product_id: 's3', name: 'Zimtschnecke', unit_price: 3.90, qty: 1 }
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
  { id: 'fav-1', profile_id: 'demo-kunde-0001', product_id: 'k2', created_at: vorTagen(58) },
  { id: 'fav-2', profile_id: 'demo-kunde-0001', product_id: 'e2', created_at: vorTagen(45) },
  { id: 'fav-3', profile_id: 'demo-kunde-0001', product_id: 's2', created_at: vorTagen(15) }
];

export const DEMO_RESERVATIONS = [
  {
    id: 'res-1', profile_id: 'demo-kunde-0001',
    reservation_date: datumIn(4), reservation_time: '10:30', guests: 3,
    first_name: 'Max', last_name: 'Mustermann',
    phone: '0531 123456', email: 'max.mustermann@example.de',
    note: 'Gerne draußen, wenn das Wetter passt', status: 'bestaetigt', created_at: vorTagen(3)
  },
  {
    id: 'res-2', profile_id: 'demo-kunde-0001',
    reservation_date: datumIn(-27), reservation_time: '18:30', guests: 2,
    first_name: 'Max', last_name: 'Mustermann',
    phone: '0531 123456', email: 'max.mustermann@example.de',
    note: null, status: 'bestaetigt', created_at: vorTagen(33)
  }
];

// Artikelkatalog fuer die Favoriten-Ansicht
export const KATALOG = {
  'k1': { name: 'Cappuccino',          price: 3.60,  kategorie: 'Kaffee',    img: 'Bilder/platzhalter.svg' },
  'k2': { name: 'Flat White',          price: 4.20,  kategorie: 'Kaffee',    img: 'Bilder/platzhalter.svg' },
  'k3': { name: 'Espresso',            price: 2.40,  kategorie: 'Kaffee',    img: 'Bilder/platzhalter.svg' },
  'k4': { name: 'Latte Macchiato',     price: 4.40,  kategorie: 'Kaffee',    img: 'Bilder/platzhalter.svg' },
  'k5': { name: 'Chai Latte',          price: 4.60,  kategorie: 'Kaffee',    img: 'Bilder/platzhalter.svg' },
  'e1': { name: 'Frühstücksteller',    price: 14.90, kategorie: 'Küche',     img: 'Bilder/platzhalter.svg' },
  'e2': { name: 'Croque Marlene',      price: 11.50, kategorie: 'Küche',     img: 'Bilder/platzhalter.svg' },
  'e3': { name: 'Pasta al Limone',     price: 13.90, kategorie: 'Küche',     img: 'Bilder/platzhalter.svg' },
  'e4': { name: 'Flammkuchen',         price: 12.50, kategorie: 'Küche',     img: 'Bilder/platzhalter.svg' },
  'e5': { name: 'Bowl mit Falafel',    price: 13.50, kategorie: 'Küche',     img: 'Bilder/platzhalter.svg' },
  'e6': { name: 'Rührei mit Lachs',    price: 12.90, kategorie: 'Küche',     img: 'Bilder/platzhalter.svg' },
  'c1': { name: 'Aperol Spritz',       price: 8.50,  kategorie: 'Cocktails', img: 'Bilder/platzhalter.svg' },
  'c2': { name: 'Espresso Martini',    price: 11.50, kategorie: 'Cocktails', img: 'Bilder/platzhalter.svg' },
  'c3': { name: 'Gin Basil Smash',     price: 10.50, kategorie: 'Cocktails', img: 'Bilder/platzhalter.svg' },
  'c4': { name: 'Moscow Mule',         price: 10.90, kategorie: 'Cocktails', img: 'Bilder/platzhalter.svg' },
  'c5': { name: 'Hugo',                price: 8.90,  kategorie: 'Cocktails', img: 'Bilder/platzhalter.svg' },
  's1': { name: 'Croissant',           price: 2.80,  kategorie: 'Süßes',     img: 'Bilder/platzhalter.svg' },
  's2': { name: 'Käsekuchen',          price: 4.50,  kategorie: 'Süßes',     img: 'Bilder/platzhalter.svg' },
  's3': { name: 'Zimtschnecke',        price: 3.90,  kategorie: 'Süßes',     img: 'Bilder/platzhalter.svg' },
  's4': { name: 'Schokotarte',         price: 4.90,  kategorie: 'Süßes',     img: 'Bilder/platzhalter.svg' }
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
