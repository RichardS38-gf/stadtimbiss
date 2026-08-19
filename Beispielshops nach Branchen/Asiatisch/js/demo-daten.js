// demo-daten.js — Beispieldaten fuer den Demo-Kundenbereich
// Shop: Asia Garden
//
// Diese Datei ist die EINZIGE, die sich zwischen den Shops unterscheidet.
// auth.js, konto.js und konto.css sind shop-neutral.
//
// Alle Artikel-IDs, Namen und Preise muessen exakt zu den data-Attributen
// der .add-to-cart Buttons in bestellen.html passen.

// Lieferkosten dieses Shops. Liegt hier und nicht in auth.js, damit
// auth.js in allen Shops byte-identisch bleibt und ohne Nacharbeit
// kopiert werden kann.
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
  const delivery_fee = mode === 'lieferung' ? 2.50 : 0;
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
// Die Bestellung AG-2266 liegt darunter und hat deshalb bewusst keinen
// Stempel ergeben. Das laesst sich beim Kundengespraech gut zeigen.
export const DEMO_ORDERS = [
  bestellung('ord-7', 'AG-2418', 6, 'lieferung', [
    { product_id: 'su1', name: 'Tonkotsu Ramen', unit_price: 13.90, qty: 1 },
    { product_id: 'v1', name: 'Gyoza', unit_price: 6.90, qty: 1 },
    { product_id: 'g2', name: 'Matcha Latte', unit_price: 3.90, qty: 1 }
  ]),
  bestellung('ord-6', 'AG-2377', 15, 'abholung', [
    { product_id: 's1', name: 'California Roll', unit_price: 8.90, qty: 1 },
    { product_id: 's4', name: 'Thunfisch Maki', unit_price: 7.90, qty: 1 },
    { product_id: 'v3', name: 'Edamame', unit_price: 4.50, qty: 1 }
  ]),
  bestellung('ord-5', 'AG-2301', 24, 'lieferung', [
    { product_id: 'c1', name: 'Thai Green Curry', unit_price: 13.50, qty: 1 },
    { product_id: 'v2', name: 'Frühlingsrollen', unit_price: 5.90, qty: 1 },
    { product_id: 'g3', name: 'Jasmin Tee', unit_price: 2.90, qty: 2 }
  ]),
  bestellung('ord-4', 'AG-2266', 33, 'abholung', [
    { product_id: 'v1', name: 'Gyoza', unit_price: 6.90, qty: 1 },
    { product_id: 'su3', name: 'Miso Suppe', unit_price: 3.90, qty: 1 }
  ], { payment_type: 'bar' }),
  bestellung('ord-3', 'AG-2198', 45, 'lieferung', [
    { product_id: 'b1', name: 'Lachs Bento', unit_price: 18.90, qty: 1 },
    { product_id: 'd2', name: 'Mochi Variationen', unit_price: 4.90, qty: 1 }
  ]),
  bestellung('ord-2', 'AG-2104', 58, 'lieferung', [
    { product_id: 'w3', name: 'Pad Thai', unit_price: 12.90, qty: 1 },
    { product_id: 'w1', name: 'Rindfleisch Wok', unit_price: 13.90, qty: 1 },
    { product_id: 'g4', name: 'Cola 0,5l', unit_price: 2.50, qty: 2 }
  ]),
  bestellung('ord-1', 'AG-2011', 72, 'abholung', [
    { product_id: 's2', name: 'Lachs Sashimi Platte', unit_price: 10.90, qty: 1 },
    { product_id: 'c2', name: 'Massaman Curry', unit_price: 14.50, qty: 1 }
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
  { id: 'fav-1', profile_id: 'demo-kunde-0001', product_id: 'su1', created_at: vorTagen(58) },
  { id: 'fav-2', profile_id: 'demo-kunde-0001', product_id: 'v1', created_at: vorTagen(45) },
  { id: 'fav-3', profile_id: 'demo-kunde-0001', product_id: 's1', created_at: vorTagen(15) }
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
  's1':  { name: 'California Roll',        price: 8.90,  kategorie: 'Sushi',     img: 'Bilder/California%20Roll.png' },
  's2':  { name: 'Lachs Sashimi Platte',   price: 10.90, kategorie: 'Sushi',     img: 'Bilder/Lachs%20Sashimi%20Platte.png' },
  's4':  { name: 'Thunfisch Maki',         price: 7.90,  kategorie: 'Sushi',     img: 'Bilder/Thunfisch%20Maki.png' },
  'w1':  { name: 'Rindfleisch Wok',        price: 13.90, kategorie: 'Wok',       img: 'Bilder/Rindfleisch%20Wok.png' },
  'w3':  { name: 'Pad Thai',               price: 12.90, kategorie: 'Wok',       img: 'Bilder/Pad%20Thai.png' },
  'v1':  { name: 'Gyoza',                  price: 6.90,  kategorie: 'Vorspeisen', img: 'Bilder/Gyoza.png' },
  'v2':  { name: 'Frühlingsrollen',        price: 5.90,  kategorie: 'Vorspeisen', img: 'Bilder/Fr%C3%BChlingsrolle.png' },
  'v3':  { name: 'Edamame',                price: 4.50,  kategorie: 'Vorspeisen', img: 'Bilder/Edamame.png' },
  'su1': { name: 'Tonkotsu Ramen',         price: 13.90, kategorie: 'Suppen',    img: 'Bilder/Tonkotsu%20Ramen.png' },
  'su3': { name: 'Miso Suppe',             price: 3.90,  kategorie: 'Suppen',    img: 'Bilder/Miso%20Suppe.png' },
  'c1':  { name: 'Thai Green Curry',       price: 13.50, kategorie: 'Curry',     img: 'Bilder/Thai%20Green%20Curry.png' },
  'c2':  { name: 'Massaman Curry',         price: 14.50, kategorie: 'Curry',     img: 'Bilder/Massaman%20Curry.png' },
  'b1':  { name: 'Lachs Bento',            price: 18.90, kategorie: 'Bento',     img: 'Bilder/Lachs%20Bento.png' },
  'd2':  { name: 'Mochi Variationen',      price: 4.90,  kategorie: 'Dessert',   img: 'Bilder/Mochi%20Variationen.png' },
  'g2':  { name: 'Matcha Latte',           price: 3.90,  kategorie: 'Getränke',  img: 'Bilder/Matcha%20Latte.png' },
  'g3':  { name: 'Jasmin Tee',             price: 2.90,  kategorie: 'Getränke',  img: 'Bilder/Jasmin%20Tee.png' },
  'g4':  { name: 'Cola 0,5l',              price: 2.50,  kategorie: 'Getränke',  img: 'Bilder/Cola.png' }
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
