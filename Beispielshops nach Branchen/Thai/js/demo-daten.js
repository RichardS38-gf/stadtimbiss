// demo-daten.js — Beispieldaten fuer den Demo-Kundenbereich
// Shop: Sabai Sabai
//
// Diese Datei ist die EINZIGE, die sich zwischen den Shops
// unterscheidet. auth.js, konto.js und konto.css sind shop-neutral.

export const LIEFERKOSTEN = 3.50;

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

// 7 Bestellungen, davon 6 ueber dem Mindestbestellwert von 20 Euro.
// SB-2266 liegt bewusst darunter und hat deshalb keinen Stempel
// ergeben.
export const DEMO_ORDERS = [
  bestellung('ord-7', 'SB-2418', 5, 'lieferung', [
    { product_id: 'c1', name: 'Gaeng Keow Wan', unit_price: 14.50, qty: 1 },
    { product_id: 'w1', name: 'Pad Thai Goong', unit_price: 13.90, qty: 1 }
  ]),
  bestellung('ord-6', 'SB-2377', 14, 'abholung', [
    { product_id: 'c2', name: 'Gaeng Massaman', unit_price: 16.90, qty: 1 },
    { product_id: 's2', name: 'Tom Kha Gai', unit_price: 11.50, qty: 1 }
  ]),
  bestellung('ord-5', 'SB-2301', 23, 'lieferung', [
    { product_id: 'v2', name: 'Som Tam Thai', unit_price: 11.90, qty: 1 },
    { product_id: 'w2', name: 'Pad Krapao Moo', unit_price: 13.50, qty: 1 }
  ]),
  bestellung('ord-4', 'SB-2266', 34, 'abholung', [
    { product_id: 'v1', name: 'Por Pia Tod', unit_price: 7.50, qty: 1 },
    { product_id: 'n1', name: 'Jasminreis', unit_price: 3.50, qty: 1 }
  ], { payment_type: 'bar' }),
  bestellung('ord-3', 'SB-2198', 48, 'lieferung', [
    { product_id: 's1', name: 'Tom Yum Goong', unit_price: 12.50, qty: 2 }
  ]),
  bestellung('ord-2', 'SB-2104', 61, 'abholung', [
    { product_id: 'c3', name: 'Panaeng Nuea', unit_price: 16.50, qty: 1 },
    { product_id: 'v3', name: 'Satay Gai', unit_price: 9.50, qty: 1 }
  ]),
  bestellung('ord-1', 'SB-2011', 74, 'lieferung', [
    { product_id: 'w3', name: 'Khao Pad Sapparod', unit_price: 13.90, qty: 1 },
    { product_id: 'd1', name: 'Mango Sticky Rice', unit_price: 6.90, qty: 1 }
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
  { id: 'fav-2', profile_id: 'demo-kunde-0001', product_id: 's1', created_at: vorTagen(41) },
  { id: 'fav-3', profile_id: 'demo-kunde-0001', product_id: 'w1', created_at: vorTagen(12) }
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

// Artikelkatalog fuer die Favoriten-Ansicht.
// schaerfe ist eine Zahl von 0 bis 3 und steuert die Schotenskala
// auf der Bestellseite.
export const KATALOG = {
  'v1': { name: 'Por Pia Tod',        thai: 'ปอเปี๊ยะทอด',   price: 7.50,  kategorie: 'Vorspeisen',  schaerfe: 0, img: 'Bilder/porpiatod.webp' },
  'v2': { name: 'Som Tam Thai',       thai: 'ส้มตำไทย',      price: 11.90, kategorie: 'Vorspeisen',  schaerfe: 3, img: 'Bilder/somtam.webp' },
  'v3': { name: 'Satay Gai',          thai: 'สะเต๊ะไก่',      price: 9.50,  kategorie: 'Vorspeisen',  schaerfe: 0, img: 'Bilder/satay.webp' },
  'v4': { name: 'Miang Kham',         thai: 'เมี่ยงคำ',       price: 8.90,  kategorie: 'Vorspeisen',  schaerfe: 1, img: 'Bilder/miangkham.webp' },
  's1': { name: 'Tom Yum Goong',      thai: 'ต้มยำกุ้ง',      price: 12.50, kategorie: 'Suppen',      schaerfe: 2, img: 'Bilder/tomyum.webp' },
  's2': { name: 'Tom Kha Gai',        thai: 'ต้มข่าไก่',      price: 11.50, kategorie: 'Suppen',      schaerfe: 1, img: 'Bilder/tomkha.webp' },
  'c1': { name: 'Gaeng Keow Wan',     thai: 'แกงเขียวหวาน',  price: 14.50, kategorie: 'Currys',      schaerfe: 2, img: 'Bilder/gaengkeowwan.webp' },
  'c2': { name: 'Gaeng Massaman',     thai: 'แกงมัสมั่น',     price: 16.90, kategorie: 'Currys',      schaerfe: 1, img: 'Bilder/massaman.webp' },
  'c3': { name: 'Panaeng Nuea',       thai: 'พะแนงเนื้อ',     price: 16.50, kategorie: 'Currys',      schaerfe: 2, img: 'Bilder/panaeng.webp' },
  'c4': { name: 'Gaeng Ped Ped',      thai: 'แกงเผ็ดเป็ด',    price: 17.50, kategorie: 'Currys',      schaerfe: 3, img: 'Bilder/gaengpedped.webp' },
  'w1': { name: 'Pad Thai Goong',     thai: 'ผัดไทยกุ้ง',     price: 13.90, kategorie: 'Aus dem Wok', schaerfe: 1, img: 'Bilder/padthai.webp' },
  'w2': { name: 'Pad Krapao Moo',     thai: 'ผัดกะเพราหมู',  price: 13.50, kategorie: 'Aus dem Wok', schaerfe: 3, img: 'Bilder/padkrapao.webp' },
  'w3': { name: 'Khao Pad Sapparod',  thai: 'ข้าวผัดสับปะรด', price: 13.90, kategorie: 'Aus dem Wok', schaerfe: 0, img: 'Bilder/khaopad.webp' },
  'w4': { name: 'Pad See Ew',         thai: 'ผัดซีอิ๊ว',      price: 13.50, kategorie: 'Aus dem Wok', schaerfe: 0, img: 'Bilder/padseeew.webp' },
  'n1': { name: 'Jasminreis',         thai: 'ข้าวหอมมะลิ',   price: 3.50,  kategorie: 'Beilagen',    schaerfe: 0, img: 'Bilder/jasminreis.webp' },
  'n2': { name: 'Kokosreis',          thai: 'ข้าวมะพร้าว',   price: 4.50,  kategorie: 'Beilagen',    schaerfe: 0, img: 'Bilder/kokosreis.webp' },
  'd1': { name: 'Mango Sticky Rice',  thai: 'ข้าวเหนียวมะม่วง', price: 6.90, kategorie: 'Süßes',    schaerfe: 0, img: 'Bilder/mangostickyrice.webp' },
  'd2': { name: 'Gluay Tod',          thai: 'กล้วยทอด',      price: 5.90,  kategorie: 'Süßes',       schaerfe: 0, img: 'Bilder/gluaytod.webp' },
  'g1': { name: 'Cha Yen',            thai: 'ชาเย็น',        price: 4.50,  kategorie: 'Getränke',    schaerfe: 0, img: 'Bilder/chayen.webp' },
  'g2': { name: 'Nam Manao',          thai: 'น้ำมะนาว',      price: 4.20,  kategorie: 'Getränke',    schaerfe: 0, img: 'Bilder/nammanao.webp' },
  'g3': { name: 'Singha',             thai: 'สิงห์',         price: 4.90,  kategorie: 'Getränke',    schaerfe: 0, img: 'Bilder/singha.webp' },
  'g4': { name: 'Nam Maprao',         thai: 'น้ำมะพร้าว',    price: 5.50,  kategorie: 'Getränke',    schaerfe: 0, img: 'Bilder/nammaprao.webp' }
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
