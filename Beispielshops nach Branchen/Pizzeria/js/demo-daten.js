// demo-daten.js — Beispieldaten fuer den Demo-Kundenbereich
// Shop: Stadtimbiss (Pizzeria-Ordner, noch Burger- und Doener-Karte)
//
// Diese Datei ist die EINZIGE, die sich zwischen den Shops unterscheidet.
// Beim Rollout auf Burger und Asiatisch nur die Artikel und Adressen tauschen.
//
// Alle Artikel-IDs, Namen und Preise muessen exakt zu den data-Attributen
// der .add-to-cart Buttons in bestellen.html passen. Sonst legt
// "Nochmal bestellen" Artikel in den Warenkorb, die es nicht gibt.

// Datumshilfen: relativ zu heute, damit die Demo nicht veraltet
const TAG = 24 * 60 * 60 * 1000;
const vorTagen = (n) => new Date(Date.now() - n * TAG).toISOString();
const inTagen = (n) => new Date(Date.now() + n * TAG).toISOString();
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
    brand: null,
    last4: null,
    exp_month: null,
    exp_year: null,
    is_default: true,
    created_at: vorTagen(214)
  },
  {
    id: 'pay-2',
    profile_id: 'demo-kunde-0001',
    type: 'bar',
    stripe_payment_method_id: null,
    brand: null,
    last4: null,
    exp_month: null,
    exp_year: null,
    is_default: false,
    created_at: vorTagen(214)
  }
];

// Hilfsfunktion, damit die Bestellungen unten kurz bleiben
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
// Die Bestellung ord-4 liegt darunter und hat deshalb bewusst keinen
// Stempel ergeben. Das laesst sich beim Kundengespraech gut zeigen.
export const DEMO_ORDERS = [
  bestellung('ord-7', 'SI-2418', 6, 'lieferung', [
    { product_id: 'burger-1', name: 'Double Smash Burger', unit_price: 8.90, qty: 2 },
    { product_id: 'beilage-2', name: 'Süßkartoffel-Pommes', unit_price: 3.50, qty: 1 },
    { product_id: 'getraenk-1', name: 'Cola 0,5l', unit_price: 2.50, qty: 2 }
  ]),
  bestellung('ord-6', 'SI-2377', 15, 'abholung', [
    { product_id: 'doener-1', name: 'Döner', unit_price: 6.50, qty: 2 },
    { product_id: 'doener-3', name: 'Dürüm', unit_price: 7.00, qty: 1 },
    { product_id: 'getraenk-5', name: 'Ayran 0,25l', unit_price: 1.50, qty: 2 }
  ]),
  bestellung('ord-5', 'SI-2301', 24, 'lieferung', [
    { product_id: 'burger-3', name: 'BBQ Bacon Burger', unit_price: 9.50, qty: 1 },
    { product_id: 'burger-4', name: 'Crispy Chicken Burger', unit_price: 7.90, qty: 1 },
    { product_id: 'beilage-3', name: 'Onion Rings', unit_price: 3.00, qty: 1 }
  ]),
  bestellung('ord-4', 'SI-2266', 33, 'abholung', [
    { product_id: 'doener-1', name: 'Döner', unit_price: 6.50, qty: 1 },
    { product_id: 'beilage-1', name: 'Pommes Frites', unit_price: 2.50, qty: 1 }
  ], { payment_type: 'bar' }),
  bestellung('ord-3', 'SI-2198', 45, 'lieferung', [
    { product_id: 'burger-2', name: 'Classic Cheeseburger', unit_price: 6.90, qty: 2 },
    { product_id: 'beilage-1', name: 'Pommes Frites', unit_price: 2.50, qty: 2 },
    { product_id: 'getraenk-3', name: 'Sprite 0,5l', unit_price: 2.50, qty: 1 }
  ]),
  bestellung('ord-2', 'SI-2104', 58, 'lieferung', [
    { product_id: 'burger-5', name: 'Veggie Burger', unit_price: 7.50, qty: 2 },
    { product_id: 'beilage-4', name: 'Coleslaw', unit_price: 2.00, qty: 1 },
    { product_id: 'getraenk-4', name: 'Wasser 0,5l', unit_price: 1.50, qty: 2 }
  ]),
  bestellung('ord-1', 'SI-2011', 72, 'abholung', [
    { product_id: 'doener-4', name: 'Lahmacun', unit_price: 5.50, qty: 2 },
    { product_id: 'doener-1', name: 'Döner', unit_price: 6.50, qty: 1 },
    { product_id: 'getraenk-1', name: 'Cola 0,5l', unit_price: 2.50, qty: 1 }
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
  { id: 'fav-1', profile_id: 'demo-kunde-0001', product_id: 'burger-1', created_at: vorTagen(58) },
  { id: 'fav-2', profile_id: 'demo-kunde-0001', product_id: 'doener-1', created_at: vorTagen(45) },
  { id: 'fav-3', profile_id: 'demo-kunde-0001', product_id: 'beilage-2', created_at: vorTagen(15) }
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

// Artikelkatalog: wird fuer Favoriten und Warenkorb-Anzeige gebraucht.
// Muss exakt zu den data-Attributen der .add-to-cart Buttons in
// bestellen.html passen.
export const KATALOG = {
  'burger-1': { name: 'Double Smash Burger', price: 8.90, kategorie: 'Burger', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300' },
  'burger-2': { name: 'Classic Cheeseburger', price: 6.90, kategorie: 'Burger', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300' },
  'burger-3': { name: 'BBQ Bacon Burger', price: 9.50, kategorie: 'Burger', img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300' },
  'burger-4': { name: 'Crispy Chicken Burger', price: 7.90, kategorie: 'Burger', img: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300' },
  'burger-5': { name: 'Veggie Burger', price: 7.50, kategorie: 'Burger', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300' },
  'doener-1': { name: 'Döner', price: 6.50, kategorie: 'Döner', img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300' },
  'doener-3': { name: 'Dürüm', price: 7.00, kategorie: 'Döner', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300' },
  'doener-4': { name: 'Lahmacun', price: 5.50, kategorie: 'Döner', img: 'https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=300' },
  'beilage-1': { name: 'Pommes Frites', price: 2.50, kategorie: 'Beilagen', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300' },
  'beilage-2': { name: 'Süßkartoffel-Pommes', price: 3.50, kategorie: 'Beilagen', img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=300' },
  'beilage-3': { name: 'Onion Rings', price: 3.00, kategorie: 'Beilagen', img: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=300' },
  'beilage-4': { name: 'Coleslaw', price: 2.00, kategorie: 'Beilagen', img: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=300' },
  'getraenk-1': { name: 'Cola 0,5l', price: 2.50, kategorie: 'Getränke', img: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300' },
  'getraenk-2': { name: 'Cola Zero 0,5l', price: 2.50, kategorie: 'Getränke', img: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300' },
  'getraenk-3': { name: 'Sprite 0,5l', price: 2.50, kategorie: 'Getränke', img: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300' },
  'getraenk-4': { name: 'Wasser 0,5l', price: 1.50, kategorie: 'Getränke', img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300' },
  'getraenk-5': { name: 'Ayran 0,25l', price: 1.50, kategorie: 'Getränke', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300' }
};

// Wird von auth.js beim Auto-Login eingespielt
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
