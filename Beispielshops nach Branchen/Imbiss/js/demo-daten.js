// demo-daten.js — Beispieldaten fuer den Demo-Kundenbereich
// Shop: Pommes Paul
//
// Diese Datei ist die EINZIGE, die sich zwischen den Shops unterscheidet.
// auth.js, konto.js und konto.css sind shop-neutral.
//
// Die Artikel-IDs entsprechen den Bestellnummern der Karte. Im Imbiss
// bestellt man "einmal die 17", deshalb ist die Nummer hier kein
// Beiwerk sondern der Schluessel.

export const LIEFERKOSTEN = 2.50;

const TAG = 24 * 60 * 60 * 1000;
const vorTagen = (n) => new Date(Date.now() - n * TAG).toISOString();
const datumIn = (n) => new Date(Date.now() + n * TAG).toISOString().slice(0, 10);

export const DEMO_PROFILE = {
  id: 'demo-kunde-0001',
  first_name: 'Max',
  last_name: 'Mustermann',
  email: 'max.mustermann@example.de',
  phone: '0209 887744',
  birth_date: '1991-06-14',
  marketing_consent: true,
  created_at: vorTagen(214),
  updated_at: vorTagen(9)
};

export const DEMO_ADDRESSES = [
  {
    id: 'adr-1', profile_id: 'demo-kunde-0001', label: 'Zuhause',
    first_name: 'Max', last_name: 'Mustermann',
    street: 'Virchowstraße 41', postal_code: '45886', city: 'Gelsenkirchen',
    phone: '0209 887744', delivery_note: 'Dritter Stock, Klingel Mustermann',
    is_default: true, created_at: vorTagen(214)
  },
  {
    id: 'adr-2', profile_id: 'demo-kunde-0001', label: 'Baustelle',
    first_name: 'Max', last_name: 'Mustermann',
    street: 'Ückendorfer Straße 8', postal_code: '45886', city: 'Gelsenkirchen',
    phone: '0209 887744', delivery_note: 'Am Bauwagen abgeben, nach Max fragen',
    is_default: false, created_at: vorTagen(61)
  }
];

export const DEMO_PAYMENT_METHODS = [
  {
    id: 'pay-1', profile_id: 'demo-kunde-0001', type: 'bar',
    stripe_payment_method_id: null, brand: null, last4: null,
    exp_month: null, exp_year: null, is_default: true, created_at: vorTagen(214)
  },
  {
    id: 'pay-2', profile_id: 'demo-kunde-0001', type: 'ec',
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
      ? { street: 'Virchowstraße 41', postal_code: '45886', city: 'Gelsenkirchen' }
      : null,
    payment_type: extras.payment_type || 'bar',
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
// PP-2266 liegt bewusst darunter und hat deshalb keinen Stempel ergeben.
export const DEMO_ORDERS = [
  bestellung('ord-7', 'PP-2418', 4, 'abholung', [
    { product_id: 'n23', name: 'Schnitzel mit Champignonrahm', unit_price: 13.50, qty: 1 },
    { product_id: 'n41', name: 'Pils 0,33', unit_price: 3.20, qty: 2 }
  ]),
  bestellung('ord-6', 'PP-2377', 12, 'lieferung', [
    { product_id: 'n17', name: 'Currywurst mit Pommes', unit_price: 7.90, qty: 2 },
    { product_id: 'n43', name: 'Cola 0,33', unit_price: 2.60, qty: 2 }
  ]),
  bestellung('ord-5', 'PP-2301', 21, 'abholung', [
    { product_id: 'n31', name: 'Taxiteller', unit_price: 11.50, qty: 1 },
    { product_id: 'n35', name: 'Cheeseburger', unit_price: 8.90, qty: 1 }
  ]),
  bestellung('ord-4', 'PP-2266', 30, 'abholung', [
    { product_id: 'n15', name: 'Currywurst', unit_price: 4.90, qty: 1 },
    { product_id: 'n11', name: 'Pommes rot-weiß', unit_price: 4.50, qty: 1 }
  ]),
  bestellung('ord-3', 'PP-2198', 44, 'lieferung', [
    { product_id: 'n25', name: 'Jägerschnitzel', unit_price: 13.50, qty: 1 },
    { product_id: 'n41', name: 'Pils 0,33', unit_price: 3.20, qty: 1 }
  ]),
  bestellung('ord-2', 'PP-2104', 57, 'lieferung', [
    { product_id: 'n37', name: 'Doppel-Cheeseburger', unit_price: 11.90, qty: 1 },
    { product_id: 'n11', name: 'Pommes rot-weiß', unit_price: 4.50, qty: 1 }
  ]),
  bestellung('ord-1', 'PP-2011', 70, 'abholung', [
    { product_id: 'n21', name: 'Schnitzel Wiener Art', unit_price: 11.90, qty: 1 },
    { product_id: 'n33', name: 'Pita mit Hähnchen', unit_price: 7.50, qty: 1 }
  ], { payment_type: 'ec' })
];

export const DEMO_STAMP_CARD = {
  id: 'karte-1',
  profile_id: 'demo-kunde-0001',
  stamps_count: 6,
  status: 'aktiv',
  completed_at: null,
  created_at: vorTagen(70)
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
  { id: 'fav-1', profile_id: 'demo-kunde-0001', product_id: 'n17', created_at: vorTagen(58) },
  { id: 'fav-2', profile_id: 'demo-kunde-0001', product_id: 'n23', created_at: vorTagen(45) },
  { id: 'fav-3', profile_id: 'demo-kunde-0001', product_id: 'n31', created_at: vorTagen(15) }
];

export const DEMO_RESERVATIONS = [
  {
    id: 'res-1', profile_id: 'demo-kunde-0001',
    reservation_date: datumIn(3), reservation_time: '18:30', guests: 4,
    first_name: 'Max', last_name: 'Mustermann',
    phone: '0209 887744', email: 'max.mustermann@example.de',
    note: 'Gerne der große Tisch hinten', status: 'bestaetigt', created_at: vorTagen(2)
  },
  {
    id: 'res-2', profile_id: 'demo-kunde-0001',
    reservation_date: datumIn(-25), reservation_time: '19:00', guests: 2,
    first_name: 'Max', last_name: 'Mustermann',
    phone: '0209 887744', email: 'max.mustermann@example.de',
    note: null, status: 'bestaetigt', created_at: vorTagen(31)
  }
];

// Artikelkatalog fuer die Favoriten-Ansicht.
// Die Karte dieses Shops kommt ohne Produktfotos aus, deshalb steht
// hier bei allen Artikeln der Platzhalter. Wenn du spaeter Bilder
// haben willst, reichen vier Kategoriebilder statt siebzehn
// Einzelaufnahmen.
export const KATALOG = {
  'n11': { name: 'Pommes rot-weiß',               price: 4.50,  kategorie: 'Von der Theke', img: 'Bilder/platzhalter.svg' },
  'n13': { name: 'Bratwurst mit Brötchen',        price: 4.20,  kategorie: 'Von der Theke', img: 'Bilder/platzhalter.svg' },
  'n15': { name: 'Currywurst',                    price: 4.90,  kategorie: 'Von der Theke', img: 'Bilder/platzhalter.svg' },
  'n17': { name: 'Currywurst mit Pommes',         price: 7.90,  kategorie: 'Von der Theke', img: 'Bilder/platzhalter.svg' },
  'n19': { name: 'Frikadelle im Brötchen',        price: 4.20,  kategorie: 'Von der Theke', img: 'Bilder/platzhalter.svg' },
  'n21': { name: 'Schnitzel Wiener Art',          price: 11.90, kategorie: 'Aus der Pfanne', img: 'Bilder/platzhalter.svg' },
  'n23': { name: 'Schnitzel mit Champignonrahm',  price: 13.50, kategorie: 'Aus der Pfanne', img: 'Bilder/platzhalter.svg' },
  'n25': { name: 'Jägerschnitzel',                price: 13.50, kategorie: 'Aus der Pfanne', img: 'Bilder/platzhalter.svg' },
  'n27': { name: 'Paprikaschnitzel',              price: 13.50, kategorie: 'Aus der Pfanne', img: 'Bilder/platzhalter.svg' },
  'n31': { name: 'Taxiteller',                    price: 11.50, kategorie: 'Vom Grill',     img: 'Bilder/platzhalter.svg' },
  'n33': { name: 'Pita mit Hähnchen',             price: 7.50,  kategorie: 'Vom Grill',     img: 'Bilder/platzhalter.svg' },
  'n35': { name: 'Cheeseburger',                  price: 8.90,  kategorie: 'Vom Grill',     img: 'Bilder/platzhalter.svg' },
  'n37': { name: 'Doppel-Cheeseburger',           price: 11.90, kategorie: 'Vom Grill',     img: 'Bilder/platzhalter.svg' },
  'n41': { name: 'Pils 0,33',                     price: 3.20,  kategorie: 'Getränke',      img: 'Bilder/platzhalter.svg' },
  'n43': { name: 'Cola 0,33',                     price: 2.60,  kategorie: 'Getränke',      img: 'Bilder/platzhalter.svg' },
  'n45': { name: 'Wasser 0,25',                   price: 2.20,  kategorie: 'Getränke',      img: 'Bilder/platzhalter.svg' },
  'n47': { name: 'Kaffee',                        price: 2.20,  kategorie: 'Getränke',      img: 'Bilder/platzhalter.svg' }
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
