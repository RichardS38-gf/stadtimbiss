// demo-daten.js — Beispieldaten fuer den Demo-Kundenbereich
// Shop: Bosporus Grill
//
// Diese Datei ist die EINZIGE, die sich zwischen den Shops unterscheidet.
// auth.js, konto.js und konto.css sind shop-neutral.
//
// Alle Artikel-IDs, Namen und Preise muessen exakt zu den data-Attributen
// der .add-to-cart Buttons in bestellen.html passen.

// Lieferkosten dieses Shops.
export const LIEFERKOSTEN = 2.00;

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
// Die Bestellung BG-2266 liegt darunter und hat deshalb bewusst keinen
// Stempel ergeben. Das laesst sich beim Kundengespraech gut zeigen.
export const DEMO_ORDERS = [
  bestellung('ord-7', 'BG-2418', 6, 'lieferung', [
    { product_id: 'k3', name: 'Döner Teller', unit_price: 13.50, qty: 1 },
    { product_id: 'm2', name: 'Cacık', unit_price: 4.50, qty: 1 },
    { product_id: 't1', name: 'Ayran 0,25l', unit_price: 1.90, qty: 2 }
  ]),
  bestellung('ord-6', 'BG-2377', 15, 'abholung', [
    { product_id: 'g1', name: 'Adana Kebab', unit_price: 15.90, qty: 1 },
    { product_id: 'm1', name: 'Hummus', unit_price: 5.50, qty: 1 }
  ]),
  bestellung('ord-5', 'BG-2301', 24, 'lieferung', [
    { product_id: 'k1', name: 'Döner Kebab', unit_price: 7.50, qty: 2 },
    { product_id: 'm5', name: 'Pommes', unit_price: 3.50, qty: 1 },
    { product_id: 't3', name: 'Cola 0,33l', unit_price: 2.90, qty: 2 }
  ]),
  bestellung('ord-4', 'BG-2266', 33, 'abholung', [
    { product_id: 'k5', name: 'Lahmacun', unit_price: 5.50, qty: 1 },
    { product_id: 't2', name: 'Çay', unit_price: 2.00, qty: 1 }
  ], { payment_type: 'bar' }),
  bestellung('ord-3', 'BG-2198', 45, 'lieferung', [
    { product_id: 'g5', name: 'Mixed Grill Teller', unit_price: 21.90, qty: 1 },
    { product_id: 's1', name: 'Baklava', unit_price: 4.90, qty: 1 }
  ]),
  bestellung('ord-2', 'BG-2104', 58, 'lieferung', [
    { product_id: 'k2', name: 'Dürüm Döner', unit_price: 8.50, qty: 1 },
    { product_id: 'g3', name: 'Köfte', unit_price: 13.90, qty: 1 },
    { product_id: 't1', name: 'Ayran 0,25l', unit_price: 1.90, qty: 1 }
  ]),
  bestellung('ord-1', 'BG-2011', 72, 'abholung', [
    { product_id: 'g2', name: 'Şiş Kebab', unit_price: 14.90, qty: 1 },
    { product_id: 'm3', name: 'Sucuk', unit_price: 6.90, qty: 1 },
    { product_id: 's2', name: 'Künefe', unit_price: 6.50, qty: 1 }
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
  { id: 'fav-1', profile_id: 'demo-kunde-0001', product_id: 'k3', created_at: vorTagen(58) },
  { id: 'fav-2', profile_id: 'demo-kunde-0001', product_id: 'g1', created_at: vorTagen(45) },
  { id: 'fav-3', profile_id: 'demo-kunde-0001', product_id: 's1', created_at: vorTagen(15) }
];

export const DEMO_RESERVATIONS = [
  {
    id: 'res-1', profile_id: 'demo-kunde-0001',
    reservation_date: datumIn(4), reservation_time: '19:30', guests: 4,
    first_name: 'Max', last_name: 'Mustermann',
    phone: '0531 123456', email: 'max.mustermann@example.de',
    note: 'Gerne ein Tisch am Fenster', status: 'bestaetigt', created_at: vorTagen(3)
  },
  {
    id: 'res-2', profile_id: 'demo-kunde-0001',
    reservation_date: datumIn(-27), reservation_time: '18:00', guests: 2,
    first_name: 'Max', last_name: 'Mustermann',
    phone: '0531 123456', email: 'max.mustermann@example.de',
    note: null, status: 'bestaetigt', created_at: vorTagen(33)
  }
];

// Artikelkatalog fuer die Favoriten-Ansicht
export const KATALOG = {
  'k1': { name: 'Döner Kebab',        price: 7.50,  kategorie: 'Döner',    img: 'Bilder/platzhalter.svg' },
  'k2': { name: 'Dürüm Döner',        price: 8.50,  kategorie: 'Döner',    img: 'Bilder/platzhalter.svg' },
  'k3': { name: 'Döner Teller',       price: 13.50, kategorie: 'Döner',    img: 'Bilder/platzhalter.svg' },
  'k4': { name: 'Yufka Chicken',      price: 8.50,  kategorie: 'Döner',    img: 'Bilder/platzhalter.svg' },
  'k5': { name: 'Lahmacun',           price: 5.50,  kategorie: 'Döner',    img: 'Bilder/platzhalter.svg' },
  'k6': { name: 'Pide mit Käse',      price: 8.90,  kategorie: 'Döner',    img: 'Bilder/platzhalter.svg' },
  'g1': { name: 'Adana Kebab',        price: 15.90, kategorie: 'Grill',    img: 'Bilder/platzhalter.svg' },
  'g2': { name: 'Şiş Kebab',          price: 14.90, kategorie: 'Grill',    img: 'Bilder/platzhalter.svg' },
  'g3': { name: 'Köfte',              price: 13.90, kategorie: 'Grill',    img: 'Bilder/platzhalter.svg' },
  'g4': { name: 'Lammkotelett',       price: 18.90, kategorie: 'Grill',    img: 'Bilder/platzhalter.svg' },
  'g5': { name: 'Mixed Grill Teller', price: 21.90, kategorie: 'Grill',    img: 'Bilder/platzhalter.svg' },
  'm1': { name: 'Hummus',             price: 5.50,  kategorie: 'Meze',     img: 'Bilder/platzhalter.svg' },
  'm2': { name: 'Cacık',              price: 4.50,  kategorie: 'Meze',     img: 'Bilder/platzhalter.svg' },
  'm3': { name: 'Sucuk',              price: 6.90,  kategorie: 'Meze',     img: 'Bilder/platzhalter.svg' },
  'm4': { name: 'Falafel',            price: 6.50,  kategorie: 'Meze',     img: 'Bilder/platzhalter.svg' },
  'm5': { name: 'Pommes',             price: 3.50,  kategorie: 'Meze',     img: 'Bilder/platzhalter.svg' },
  's1': { name: 'Baklava',            price: 4.90,  kategorie: 'Süßes',    img: 'Bilder/platzhalter.svg' },
  's2': { name: 'Künefe',             price: 6.50,  kategorie: 'Süßes',    img: 'Bilder/platzhalter.svg' },
  't1': { name: 'Ayran 0,25l',        price: 1.90,  kategorie: 'Getränke', img: 'Bilder/platzhalter.svg' },
  't2': { name: 'Çay',                price: 2.00,  kategorie: 'Getränke', img: 'Bilder/platzhalter.svg' },
  't3': { name: 'Cola 0,33l',         price: 2.90,  kategorie: 'Getränke', img: 'Bilder/platzhalter.svg' }
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
