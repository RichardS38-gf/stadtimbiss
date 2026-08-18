// demo-daten.js — Beispieldaten fuer den Demo-Kundenbereich
// Shop: Burger Joint
//
// Diese Datei ist die EINZIGE, die sich zwischen den Shops unterscheidet.
// auth.js, konto.js und konto.css sind shop-neutral.
//
// Alle Artikel-IDs, Namen und Preise muessen exakt zu den data-Attributen
// der .add-to-cart Buttons in bestellen.html passen.

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
    id: 'pay-1',
    profile_id: 'demo-kunde-0001',
    type: 'ec',
    stripe_payment_method_id: null,
    brand: null, last4: null, exp_month: null, exp_year: null,
    is_default: true,
    created_at: vorTagen(214)
  },
  {
    id: 'pay-2',
    profile_id: 'demo-kunde-0001',
    type: 'bar',
    stripe_payment_method_id: null,
    brand: null, last4: null, exp_month: null, exp_year: null,
    is_default: false,
    created_at: vorTagen(214)
  }
];

function bestellung(id, nummer, tage, mode, positionen, extras = {}) {
  const subtotal = positionen.reduce((s, p) => s + p.unit_price * p.qty, 0);
  const delivery_fee = mode === 'lieferung' ? 1.99 : 0;
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
// Die Bestellung BJ-2266 liegt darunter und hat deshalb bewusst keinen
// Stempel ergeben. Das laesst sich beim Kundengespraech gut zeigen.
export const DEMO_ORDERS = [
  bestellung('ord-7', 'BJ-2418', 6, 'lieferung', [
    { product_id: 'b2', name: 'Double Smash', unit_price: 12.90, qty: 1 },
    { product_id: 's1', name: 'Crispy Fries', unit_price: 3.90, qty: 1 },
    { product_id: 'sh2', name: 'Chocolate Shake', unit_price: 5.90, qty: 1 }
  ]),
  bestellung('ord-6', 'BJ-2377', 15, 'abholung', [
    { product_id: 'b1', name: 'Classic Smash', unit_price: 8.90, qty: 2 },
    { product_id: 's2', name: 'Onion Rings', unit_price: 4.50, qty: 1 }
  ]),
  bestellung('ord-5', 'BJ-2301', 24, 'lieferung', [
    { product_id: 'c1', name: 'Crispy Chicken', unit_price: 9.90, qty: 1 },
    { product_id: 'c2', name: 'Spicy Chicken', unit_price: 10.50, qty: 1 },
    { product_id: 'g1', name: 'Cola 0,5l', unit_price: 2.90, qty: 2 }
  ]),
  bestellung('ord-4', 'BJ-2266', 33, 'abholung', [
    { product_id: 'w1', name: 'Chicken Wrap', unit_price: 7.90, qty: 1 },
    { product_id: 'g3', name: 'Wasser 0,5l', unit_price: 1.90, qty: 1 }
  ], { payment_type: 'bar' }),
  bestellung('ord-3', 'BJ-2198', 45, 'lieferung', [
    { product_id: 'b3', name: 'BBQ Bacon Smash', unit_price: 11.50, qty: 1 },
    { product_id: 's4', name: 'Sweet Potato Fries', unit_price: 4.90, qty: 1 },
    { product_id: 'sh1', name: 'Vanilla Shake', unit_price: 5.50, qty: 1 }
  ]),
  bestellung('ord-2', 'BJ-2104', 58, 'lieferung', [
    { product_id: 'v1', name: 'Veggie Smash', unit_price: 10.90, qty: 1 },
    { product_id: 'w3', name: 'Veggie Wrap', unit_price: 7.50, qty: 1 },
    { product_id: 'g2', name: 'Lemonade', unit_price: 3.50, qty: 1 }
  ]),
  bestellung('ord-1', 'BJ-2011', 72, 'abholung', [
    { product_id: 'b1', name: 'Classic Smash', unit_price: 8.90, qty: 1 },
    { product_id: 'b2', name: 'Double Smash', unit_price: 12.90, qty: 1 },
    { product_id: 's1', name: 'Crispy Fries', unit_price: 3.90, qty: 1 }
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
  { id: 'fav-1', profile_id: 'demo-kunde-0001', product_id: 'b2', created_at: vorTagen(58) },
  { id: 'fav-2', profile_id: 'demo-kunde-0001', product_id: 's4', created_at: vorTagen(45) },
  { id: 'fav-3', profile_id: 'demo-kunde-0001', product_id: 'sh2', created_at: vorTagen(15) }
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

// Artikelkatalog fuer die Favoriten-Ansicht
// Bilddateien liegen lokal in Bilder/, Leerzeichen und Umlaute
// muessen URL-encoded werden.
export const KATALOG = {
  'b1':  { name: 'Classic Smash',      price: 8.90,  kategorie: 'Burger',   img: 'Bilder/burger.png' },
  'b2':  { name: 'Double Smash',       price: 12.90, kategorie: 'Burger',   img: 'Bilder/doubleburger.png' },
  'b3':  { name: 'BBQ Bacon Smash',    price: 11.50, kategorie: 'Burger',   img: 'Bilder/baconburger.png' },
  'c1':  { name: 'Crispy Chicken',     price: 9.90,  kategorie: 'Chicken',  img: 'Bilder/crispychicken.png' },
  'c2':  { name: 'Spicy Chicken',      price: 10.50, kategorie: 'Chicken',  img: 'Bilder/chicken.png' },
  'v1':  { name: 'Veggie Smash',       price: 10.90, kategorie: 'Veggie',   img: 'Bilder/veggie.png' },
  'w1':  { name: 'Chicken Wrap',       price: 7.90,  kategorie: 'Wraps',    img: 'Bilder/wraps.png' },
  'w3':  { name: 'Veggie Wrap',        price: 7.50,  kategorie: 'Wraps',    img: 'Bilder/veggiewrap.png' },
  's1':  { name: 'Crispy Fries',       price: 3.90,  kategorie: 'Sides',    img: 'Bilder/fries.png' },
  's2':  { name: 'Onion Rings',        price: 4.50,  kategorie: 'Sides',    img: 'Bilder/onion.png' },
  's4':  { name: 'Sweet Potato Fries', price: 4.90,  kategorie: 'Sides',    img: 'Bilder/s%C3%BC%C3%9Fkartoffel.png' },
  'sh1': { name: 'Vanilla Shake',      price: 5.50,  kategorie: 'Shakes',   img: 'Bilder/vanille.png' },
  'sh2': { name: 'Chocolate Shake',    price: 5.90,  kategorie: 'Shakes',   img: 'Bilder/shakes.png' },
  'g1':  { name: 'Cola 0,5l',          price: 2.90,  kategorie: 'Getränke', img: 'Bilder/cola.png' },
  'g2':  { name: 'Lemonade',           price: 3.50,  kategorie: 'Getränke', img: 'Bilder/lemon.png' },
  'g3':  { name: 'Wasser 0,5l',        price: 1.90,  kategorie: 'Getränke', img: 'Bilder/wasser.png' }
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
