// demo-daten.js — Döner Point
// Beispieldaten fuer den Demo-Kundenbereich, der Artikelkatalog
// und die Filialen.
//
// Diese Datei ist die EINZIGE, die sich zwischen den Shops
// unterscheidet. auth.js, konto.js und konto.css sind shop-neutral
// und erwarten genau die Exporte, die hier stehen.
//
// Preise und Beschreibungen stammen von der offiziellen
// Bestellseite donerpointneuss-neuss.de, Stand September 2026.
// Beim Uebergang in den Echtbetrieb gehoeren sie vom Betreiber
// bestaetigt.

// Kostenlose Lieferung ab Mindestbestellwert.
export const LIEFERKOSTEN = 0.00;
export const MINDESTBESTELLWERT = 19.90;

/* ── FILIALEN ──
   Die Auswahl steht in localStorage unter dp_filiale. Neuss ist
   der echte Standort, die zweite Filiale ist ein Platzhalter und
   muss noch mit den richtigen Angaben gefuellt werden.

   karte: welcher Katalog gilt. Beide zeigen derzeit auf 'standard'.
   Bekommen die Filialen spaeter unterschiedliche Karten, wird hier
   ein zweiter Schluessel gesetzt und in KATALOG hinterlegt. */
export const FILIALEN = [
  {
    id: 'neuss',
    name: 'Neuss',
    strasse: 'Niederstraße 11',
    plz: '41460',
    ort: 'Neuss',
    telefon: '02131 7188372',
    zeiten: 'Täglich 11:00 – 22:00 Uhr',
    lieferzeit: 'ca. 40 Min',
    abholzeit: 'ca. 20 Min',
    karte: 'standard',
    maps: 'https://www.google.com/maps?q=Niederstra%C3%9Fe+11,+41460+Neuss&output=embed'
  },
  {
    id: 'koeln',
    name: 'Köln Schildergasse',
    strasse: 'Krebsgasse 1',
    plz: '50667',
    ort: 'Köln',
    telefon: '0176 57871881',
    /* Zeiten noch nicht bestaetigt, vorerst wie in Neuss. */
    zeiten: 'Täglich 11:00 – 22:00 Uhr',
    lieferzeit: 'ca. 40 Min',
    abholzeit: 'ca. 20 Min',
    karte: 'standard',
    maps: 'https://www.google.com/maps?q=Krebsgasse+1,+50667+K%C3%B6ln&output=embed'
  }
];

export const STANDARD_FILIALE = 'neuss';

const TAG = 24 * 60 * 60 * 1000;
const vorTagen = (n) => new Date(Date.now() - n * TAG).toISOString();
const datumIn = (n) => new Date(Date.now() + n * TAG).toISOString().slice(0, 10);

export const DEMO_PROFILE = {
  id: 'demo-kunde-0001',
  first_name: 'Max',
  last_name: 'Mustermann',
  email: 'max.mustermann@example.de',
  phone: '02131 445566',
  birth_date: '1991-06-14',
  marketing_consent: true,
  created_at: vorTagen(214),
  updated_at: vorTagen(9)
};

export const DEMO_ADDRESSES = [
  {
    id: 'adr-1', profile_id: 'demo-kunde-0001', label: 'Zuhause',
    first_name: 'Max', last_name: 'Mustermann',
    street: 'Oberstraße 42', postal_code: '41460', city: 'Neuss',
    phone: '02131 445566', delivery_note: 'Zweiter Stock, Klingel Mustermann',
    is_default: true, created_at: vorTagen(214)
  },
  {
    id: 'adr-2', profile_id: 'demo-kunde-0001', label: 'Arbeit',
    first_name: 'Max', last_name: 'Mustermann',
    street: 'Hammfelddamm 8', postal_code: '41460', city: 'Neuss',
    phone: '02131 445566', delivery_note: 'Bitte am Empfang abgeben',
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
    filiale: extras.filiale || 'neuss',
    address_id: mode === 'lieferung' ? 'adr-1' : null,
    address_snapshot: mode === 'lieferung'
      ? { street: 'Oberstraße 42', postal_code: '41460', city: 'Neuss' }
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

/* Sieben Bestellungen, davon sechs ueber dem Mindestwert von 15
   Euro aus TREUE.min_order_value in auth.js. DP-2266 liegt
   bewusst darunter und hat deshalb keinen Stempel ergeben, sonst
   passt die Zahl auf der Stempelkarte nicht zur Liste. */
export const DEMO_ORDERS = [
  bestellung('ord-7', 'DP-2418', 6, 'lieferung', [
    { product_id: 't2', name: 'Döner Teller', unit_price: 15.99, qty: 1 },
    { product_id: 'n2', name: 'Pommes Frites', unit_price: 6.50, qty: 1 },
    { product_id: 'n1', name: 'Onion Rings', unit_price: 5.00, qty: 1 }
  ]),
  bestellung('ord-6', 'DP-2377', 15, 'abholung', [
    { product_id: 'i1', name: 'İskender mit spezieller TomatenSoße', unit_price: 17.99, qty: 1 },
    { product_id: 'd7', name: 'Baklava (1 Portion, 4 Stk.)', unit_price: 6.00, qty: 1 }
  ]),
  bestellung('ord-5', 'DP-2301', 24, 'lieferung', [
    { product_id: 'w2', name: 'Döner Wrap', unit_price: 10.99, qty: 2 },
    { product_id: 'n1', name: 'Onion Rings', unit_price: 5.00, qty: 1 },
    { product_id: 'd7', name: 'Baklava, 4 Stück', unit_price: 6.00, qty: 1 }
  ]),
  bestellung('ord-4', 'DP-2266', 33, 'abholung', [
    { product_id: 'l2', name: 'Türkische Pizza Classic (Lahmacun)', unit_price: 6.50, qty: 1 },
    { product_id: 'n4', name: 'Falafel', unit_price: 5.00, qty: 1 }
  ], { payment_type: 'bar' }),
  bestellung('ord-3', 'DP-2198', 45, 'lieferung', [
    { product_id: 'a12', name: 'DP Box Menü', unit_price: 11.99, qty: 1 },
    { product_id: 'n6', name: 'Tenders', unit_price: 6.99, qty: 1 },
    { product_id: 'd1', name: 'Kazandibi', unit_price: 5.90, qty: 1 }
  ]),
  bestellung('ord-2', 'DP-2104', 58, 'lieferung', [
    { product_id: 's2', name: 'Sandwich Döner', unit_price: 9.99, qty: 1 },
    { product_id: 'h1', name: 'Döner Wrap mit spezieller Hatay Soße', unit_price: 10.99, qty: 1 },
    { product_id: 'd1', name: 'Kazandibi', unit_price: 5.90, qty: 1 }
  ]),
  bestellung('ord-1', 'DP-2011', 72, 'abholung', [
    { product_id: 'u1', name: 'Burrito', unit_price: 11.00, qty: 1 },
    { product_id: 'n5', name: 'Mozzarella Cheese Sticks', unit_price: 5.00, qty: 1 },
    { product_id: 'd6', name: 'Tiramisu Dessert', unit_price: 6.90, qty: 1 }
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
  { id: 'fav-1', profile_id: 'demo-kunde-0001', product_id: 'i1', created_at: vorTagen(58) },
  { id: 'fav-2', profile_id: 'demo-kunde-0001', product_id: 'w2', created_at: vorTagen(45) },
  { id: 'fav-3', profile_id: 'demo-kunde-0001', product_id: 'n2', created_at: vorTagen(15) }
];

export const DEMO_RESERVATIONS = [
  {
    id: 'res-1', profile_id: 'demo-kunde-0001',
    reservation_date: datumIn(4), reservation_time: '19:30', guests: 4,
    first_name: 'Max', last_name: 'Mustermann',
    phone: '02131 445566', email: 'max.mustermann@example.de',
    note: 'Gerne oben im ersten Stock', status: 'bestaetigt', created_at: vorTagen(3)
  },
  {
    id: 'res-2', profile_id: 'demo-kunde-0001',
    reservation_date: datumIn(-27), reservation_time: '18:00', guests: 2,
    first_name: 'Max', last_name: 'Mustermann',
    phone: '02131 445566', email: 'max.mustermann@example.de',
    note: null, status: 'bestaetigt', created_at: vorTagen(33)
  }
];

/* ── KATEGORIEN ──
   Reihenfolge wie auf der Speisekarte des Betreibers. Der
   Schluessel steht im Katalog bei jedem Artikel unter kategorie. */
export const KATEGORIEN = [
  { id: 'sparangebote', name: 'Sparangebote' },
  { id: 'sandwiches',   name: 'Sandwiches' },
  { id: 'wrap',         name: 'Wraps' },
  { id: 'lahmacun',     name: 'Türkische Pizza' },
  { id: 'doener',       name: 'Döner' },
  { id: 'iskender',     name: 'İskender' },
  { id: 'burrito',      name: 'Burrito' },
  { id: 'snacks',       name: 'Snacks' },
  { id: 'suesses',      name: 'Süßspeisen' }
];

/* ── ARTIKELKATALOG ──
   Der Schluessel ist die Kennung, die im Warenkorb und in den
   Bestellungen steht. img zeigt auf die noch zu erzeugenden
   Bilder; solange sie fehlen, zeigt die Karte eine ruhige
   Platzhalterflaeche. */
export const KATALOG = {
  /* Sparangebote */
  'a1':  { name: 'DP Fingerfood Combo Menü', price: 35.50, kategorie: 'sparangebote', img: 'Bilder/fingerfood-combo.webp', beschreibung: '4 Nuggets, 4 Chili Cheese Nuggets, 4 Mozzarella Sticks, 6 Onion Rings, 3 Tenders, Pommes und ein Softgetränk' },
  'a2':  { name: 'DP Burrito Menü', price: 20.00, kategorie: 'sparangebote', img: 'Bilder/burrito-menue.webp', beschreibung: 'Burrito, Pommes Frites und Softgetränk' },
  'a3':  { name: 'DP Premium Bundle', price: 60.00, kategorie: 'sparangebote', img: 'Bilder/premium-bundle.webp', beschreibung: '2 Sandwich Döner, 2 Pommes, 6 Tenders, 8 Nuggets und 2 Softgetränke' },
  'a4':  { name: 'Sandwich Menü (Hähnchen)', price: 19.99, kategorie: 'sparangebote', img: 'Bilder/sandwich-menue.webp', beschreibung: 'Sandwich Döner mit Hähnchen, Pommes Frites und Softgetränk' },
  'a5':  { name: 'Hatay Wrap Menü (Hähnchen)', price: 19.99, kategorie: 'sparangebote', img: 'Bilder/hatay-menue.webp', beschreibung: 'Döner Wrap mit spezieller Hatay Soße, Pommes Frites und Softgetränk' },
  'a6':  { name: 'Wrap Menü (Hähnchen)', price: 19.99, kategorie: 'sparangebote', img: 'Bilder/wrap-menue.webp', beschreibung: 'Döner Wrap mit Hähnchen, Pommes Frites und Softgetränk' },
  'a7':  { name: 'DP Tenders Menü', price: 22.00, kategorie: 'sparangebote', img: 'Bilder/tenders-menue.webp', beschreibung: '6 Tenders, Pommes Frites und Softgetränk' },
  'a8':  { name: 'DP Nuggets Menü', price: 39.50, kategorie: 'sparangebote', img: 'Bilder/nuggets-menue.webp', beschreibung: '12 Nuggets, 12 Chili Cheese Nuggets, Pommes Frites und Softgetränk' },
  'a9':  { name: 'DP Party Bundle', price: 88.00, kategorie: 'sparangebote', img: 'Bilder/party-bundle.webp', beschreibung: '2 Döner Wrap, 2 Sandwich Döner, 2 Pommes, 8 Nuggets, 8 Mozzarella Sticks, 6 Onion Rings und 4 Softgetränke' },
  'a10': { name: 'DP Döner Bundle', price: 37.00, kategorie: 'sparangebote', img: 'Bilder/doener-bundle.webp', beschreibung: 'Sandwich Döner, Döner Wrap, Döner Box und 3 Softgetränke' },
  'a11': { name: 'DP Taco Menü', price: 24.00, kategorie: 'sparangebote', img: 'Bilder/taco-menue.webp', beschreibung: '2 Taco, Pommes Frites und Softgetränk' },
  'a12': { name: 'DP Box Menü', price: 11.99, kategorie: 'sparangebote', img: 'Bilder/box-menue.webp', beschreibung: 'Döner Box mit Pommes und Softgetränk' },
  'a13': { name: 'DP Lahmacun Wrap Menü', price: 20.50, kategorie: 'sparangebote', img: 'Bilder/lahmacun-menue.webp', beschreibung: 'Lahmacun Wrap, Pommes Frites und Softgetränk' },

  /* Sandwiches */
  's1': { name: 'Gemüse Sandwich', price: 9.49, kategorie: 'sandwiches', img: 'Bilder/gemuese-sandwich.webp', beschreibung: 'Frisches Sandwichbrötchen mit Gemüse nach Wahl, Salatmix und drei Soßen' },
  's2': { name: 'Sandwich Döner', price: 9.99, kategorie: 'sandwiches', img: 'Bilder/sandwich-doener.webp', beschreibung: 'Fleisch nach Wahl mit speziellen Soßen und verschiedenen Beilagen' },
  's3': { name: 'Falafel Sandwich', price: 9.49, kategorie: 'sandwiches', img: 'Bilder/falafel-sandwich.webp', beschreibung: 'Falafel im Sandwichbrot, mit Salaten und Soßen nach Wahl' },

  /* Wrap */
  'w1': { name: 'İskender Wrap', price: 14.99, kategorie: 'wrap', img: 'Bilder/iskender-wrap.webp', beschreibung: 'Lavaş mit Dönerfleisch, Iskender-Soße, Joghurt und Butterfett' },
  'w2': { name: 'Döner Wrap', price: 10.99, kategorie: 'wrap', img: 'Bilder/doener-wrap.webp', beschreibung: 'Fleisch nach Wahl mit speziellen Soßen und verschiedenen Beilagen' },
  'w3': { name: 'Falafel Wrap', price: 9.49, kategorie: 'wrap', img: 'Bilder/falafel-wrap.webp', beschreibung: 'Tortilla mit sechs Falafel, Salat, scharfer Soße, Knoblauch und Kräutern' },
  'w4': { name: 'Chee Köfte Wrap', price: 8.49, kategorie: 'wrap', img: 'Bilder/cheekoefte-wrap.webp', beschreibung: 'Chee Köfte 100 g mit Beilagen und Soßen nach Wahl' },
  'w5': { name: 'Gemüse Wrap', price: 9.49, kategorie: 'wrap', img: 'Bilder/gemuese-wrap.webp', beschreibung: 'Tortilla mit Gemüse nach Wahl, Salatmix und drei Soßen' },

  /* Hatay */
  'h1': { name: 'Döner Wrap mit Hatay Soße', price: 10.99, kategorie: 'wrap', img: 'Bilder/hatay-wrap.webp', beschreibung: 'Fleisch nach Wahl mit der speziellen Hatay Soße und verschiedenen Beilagen' },

  /* Türkische Pizza */
  'l1': { name: 'Türkische Pizza Wrap', price: 11.50, kategorie: 'lahmacun', img: 'Bilder/lahmacun-wrap.webp', beschreibung: 'Lahmacun gerollt, mit Fleisch nach Wahl, Soßen und Beilagen' },
  'l2': { name: 'Türkische Pizza Classic', price: 6.50, kategorie: 'lahmacun', img: 'Bilder/lahmacun-classic.webp', beschreibung: 'Klassisch mit speziellen Soßen und verschiedenen Beilagen' },

  /* Döner: Teller, Reis und Box */
  'b1': { name: 'Döner Box mit Pommes', price: 9.99, kategorie: 'doener', img: 'Bilder/box-pommes.webp', beschreibung: 'Fleisch nach Wahl mit Pommes' },
  'b2': { name: 'Döner Box mit Salat', price: 9.99, kategorie: 'doener', img: 'Bilder/box-salat.webp', beschreibung: 'Fleisch nach Wahl mit Salat' },

  /* İskender */
  'i1': { name: 'İskender mit TomatenSoße', price: 17.99, kategorie: 'iskender', img: 'Bilder/iskender.webp', beschreibung: 'Knusprige Pide, Fleisch vom Spieß, Iskender-Soße, Joghurt und Butterfett' },

  /* Döner Teller */
  't1': { name: 'Döner auf Reis', price: 15.99, kategorie: 'doener', img: 'Bilder/doener-reis.webp', beschreibung: 'Fleisch nach Wahl mit Reis, Pommes, frischen Tomaten und sauren Gurken' },
  't2': { name: 'Döner Teller', price: 15.99, kategorie: 'doener', img: 'Bilder/doener-teller.webp', beschreibung: 'Fleisch nach Wahl dazu Pommes und Salat' },

  /* Burrito */
  'u1': { name: 'Burrito', price: 11.00, kategorie: 'burrito', img: 'Bilder/burrito.webp', beschreibung: 'Mit Reis, Döner, Beilagen und speziellen Soßen' },

  /* Snacks */
  'n1': { name: 'Onion Rings', price: 5.00, kategorie: 'snacks', img: 'Bilder/onionrings.webp', beschreibung: 'Goldbraun frittierte Zwiebelringe' },
  'n2': { name: 'Pommes Frites', price: 6.50, kategorie: 'snacks', img: 'Bilder/pommes.webp', beschreibung: 'Knusprig, mit besonderer Gewürzmischung' },
  'n3': { name: 'Nuggets', price: 5.00, kategorie: 'snacks', img: 'Bilder/nuggets.webp', beschreibung: 'Knusprige Chicken Nuggets zum Snacken und Teilen' },
  'n4': { name: 'Falafel', price: 5.00, kategorie: 'snacks', img: 'Bilder/falafel.webp', beschreibung: 'Goldbraun gebraten, als Snack oder Beilage' },
  'n5': { name: 'Mozzarella Cheese Sticks', price: 5.00, kategorie: 'snacks', img: 'Bilder/mozzarellasticks.webp', beschreibung: 'Knusprig paniert, mit cremigem Käse' },
  'n6': { name: 'Tenders', price: 6.99, kategorie: 'snacks', img: 'Bilder/tenders.webp', beschreibung: 'Zarte Hähnchenstreifen, saftig und knusprig paniert' },
  'n7': { name: 'Chili Cheese Nuggets', price: 5.00, kategorie: 'snacks', img: 'Bilder/chilicheese.webp', beschreibung: 'Knusprige Nuggets mit schmelzendem Käse und Chili' },

  /* Süßspeisen */
  'd1': { name: 'Kazandibi', price: 5.90, kategorie: 'suesses', img: 'Bilder/kazandibi.webp', beschreibung: 'Türkischer Milchpudding mit karamellisierter Oberseite' },
  'd2': { name: 'Sütlaç', price: 5.90, kategorie: 'suesses', img: 'Bilder/suetlac.webp', beschreibung: 'Milchreis nach türkischer Art, im Ofen goldbraun überbacken' },
  'd3': { name: 'Pistazien-Schoko Dessert', price: 6.90, kategorie: 'suesses', img: 'Bilder/pistazien-dessert.webp', beschreibung: 'Cremige Milchcreme mit Schokolade und Pistazien-Topping' },
  'd4': { name: 'Himbeer-Schoko Dessert', price: 6.90, kategorie: 'suesses', img: 'Bilder/himbeer-dessert.webp', beschreibung: 'Milchcreme mit Schokolade, Himbeere und Kokosnuss' },
  'd5': { name: 'Oreo Creme Dessert', price: 6.90, kategorie: 'suesses', img: 'Bilder/oreo-dessert.webp', beschreibung: 'Hausgemachte Milchcreme mit Oreo-Keks und Stückchen' },
  'd6': { name: 'Tiramisu Dessert', price: 6.90, kategorie: 'suesses', img: 'Bilder/tiramisu.webp', beschreibung: 'Hausgemacht, mit cremiger Mascarpone und feinem Kakao' },
  'd7': { name: 'Baklava, 4 Stück', price: 6.00, kategorie: 'suesses', img: 'Bilder/baklava.webp', beschreibung: 'Filoteig mit gehackten Nüssen, getränkt in süßem Sirup' }
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
