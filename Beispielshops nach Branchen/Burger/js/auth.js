// auth.js — Datenschicht fuer den Kundenbereich
//
// WICHTIG: Dies ist die EINZIGE Datei im Projekt, die auf localStorage
// zugreifen darf. Alle anderen Dateien rufen ausschliesslich die hier
// exportierten Funktionen auf.
//
// Alle Funktionen sind async, obwohl sie heute synchron lesen. Beim
// spaeteren Umstieg auf Supabase wird nur das Objekt "store" ganz oben
// ersetzt, der Rest der Datei und alle aufrufenden Seiten bleiben gleich.
//
// Alle Feldnamen in snake_case, exakt wie die spaeteren Postgres-Spalten.
// Siehe Specs/datenmodell.md

import { addToCart, updateQty, clearCart } from './cart.js';
import { demoDatenSatz } from './demo-daten.js';

// ---------------------------------------------------------------
// Konfiguration Treueprogramm
// Entspricht der Tabelle loyalty_programs. Hier aendern, nicht im Code.
// ---------------------------------------------------------------
export const TREUE = {
  target_stamps: 8,
  min_order_value: 15.00,
  reward_type: 'free_item',
  reward_description: 'Ein Hauptgericht gratis',
  voucher_validity_days: 60,
  combinable_with_discounts: false,
  active: true
};

export const LIEFERKOSTEN = 1.99;

// ---------------------------------------------------------------
// Adapter: einzige Stelle mit Speicherzugriff
// Beim Umstieg auf Supabase wird genau dieses Objekt ausgetauscht.
// ---------------------------------------------------------------
const PRAEFIX = 'si_';

const KEYS = {
  session: PRAEFIX + 'session',
  profile: PRAEFIX + 'profile',
  addresses: PRAEFIX + 'addresses',
  payment_methods: PRAEFIX + 'payment_methods',
  orders: PRAEFIX + 'orders',
  stamp_card: PRAEFIX + 'stamp_card',
  vouchers: PRAEFIX + 'vouchers',
  favorites: PRAEFIX + 'favorites',
  reservations: PRAEFIX + 'reservations'
};

const store = {
  async get(key, fallback = null) {
    try {
      const roh = localStorage.getItem(key);
      return roh === null ? fallback : JSON.parse(roh);
    } catch {
      return fallback;
    }
  },
  async set(key, wert) {
    try {
      localStorage.setItem(key, JSON.stringify(wert));
      return wert;
    } catch {
      return null;
    }
  },
  async remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // stiller Fehlschlag, z.B. privater Modus mit vollem Speicher
    }
  },
  async clearAll() {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(PRAEFIX))
        .forEach(k => localStorage.removeItem(k));
    } catch {
      // siehe oben
    }
  }
};

// ---------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------
function neueId(praefix) {
  const zufall = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${praefix}-${zufall}`;
}

function gutscheinCode() {
  const zeichen = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += zeichen[Math.floor(Math.random() * zeichen.length)];
  }
  return 'TREUE-' + code;
}

function datumPlusTage(tage) {
  return new Date(Date.now() + tage * 86400000).toISOString().slice(0, 10);
}

function runde(betrag) {
  return Math.round(betrag * 100) / 100;
}

// ---------------------------------------------------------------
// Session
// ---------------------------------------------------------------

export async function getSession() {
  return store.get(KEYS.session, null);
}

export async function isLoggedIn() {
  return (await getSession()) !== null;
}

// Spielt den kompletten Demo-Datensatz ein
async function demoDatenEinspielen() {
  const daten = demoDatenSatz();
  await store.set(KEYS.profile, daten.profile);
  await store.set(KEYS.addresses, daten.addresses);
  await store.set(KEYS.payment_methods, daten.payment_methods);
  await store.set(KEYS.orders, daten.orders);
  await store.set(KEYS.stamp_card, daten.stamp_card);
  await store.set(KEYS.vouchers, daten.vouchers);
  await store.set(KEYS.favorites, daten.favorites);
  await store.set(KEYS.reservations, daten.reservations);
  await store.set(KEYS.session, {
    user_id: daten.profile.id,
    email: daten.profile.email,
    demo: true,
    logged_in_at: new Date().toISOString()
  });
}

export async function login(email = null, passwort = null) {
  // In der Demo wird nicht geprueft. Jede Eingabe fuehrt zum Demo-Kunden.
  const vorhanden = await store.get(KEYS.profile, null);
  if (!vorhanden) {
    await demoDatenEinspielen();
  } else {
    await store.set(KEYS.session, {
      user_id: vorhanden.id,
      email: vorhanden.email,
      demo: true,
      logged_in_at: new Date().toISOString()
    });
  }
  return getSession();
}

export async function register(daten = {}) {
  // In der Demo identisch zum Login, uebernimmt aber eingegebene Namen
  await demoDatenEinspielen();
  if (daten.first_name || daten.last_name || daten.email) {
    const profil = await store.get(KEYS.profile);
    if (daten.first_name) profil.first_name = daten.first_name;
    if (daten.last_name) profil.last_name = daten.last_name;
    if (daten.email) profil.email = daten.email;
    if (daten.phone) profil.phone = daten.phone;
    await store.set(KEYS.profile, profil);
  }
  return getSession();
}

export async function logout() {
  // Nur die Session loeschen, Daten bleiben fuer den naechsten Login liegen
  await store.remove(KEYS.session);
}

export async function resetDemo() {
  await store.clearAll();
  clearCart();
  await demoDatenEinspielen();
}

// Wird von jeder Seite beim Laden aufgerufen.
// Legt beim ersten Besuch automatisch die Demo-Session an.
export async function initAuth({ autoLogin = true } = {}) {
  const session = await getSession();
  if (!session && autoLogin) {
    const schonDagewesen = await store.get(KEYS.profile, null);
    // Wer sich bewusst abgemeldet hat, bleibt abgemeldet
    if (!schonDagewesen) {
      await demoDatenEinspielen();
    }
  }
  return getSession();
}

// ---------------------------------------------------------------
// Profil
// ---------------------------------------------------------------

export async function getProfile() {
  return store.get(KEYS.profile, null);
}

export async function updateProfile(patch) {
  const profil = await store.get(KEYS.profile, null);
  if (!profil) return null;
  const neu = { ...profil, ...patch, updated_at: new Date().toISOString() };
  return store.set(KEYS.profile, neu);
}

export async function deleteAccount() {
  await store.clearAll();
  clearCart();
}

export async function exportData() {
  return {
    exportiert_am: new Date().toISOString(),
    profile: await store.get(KEYS.profile, null),
    addresses: await store.get(KEYS.addresses, []),
    payment_methods: await store.get(KEYS.payment_methods, []),
    orders: await store.get(KEYS.orders, []),
    stamp_card: await store.get(KEYS.stamp_card, null),
    vouchers: await store.get(KEYS.vouchers, []),
    favorites: await store.get(KEYS.favorites, []),
    reservations: await store.get(KEYS.reservations, [])
  };
}

// ---------------------------------------------------------------
// Adressen
// ---------------------------------------------------------------

export async function getAddresses() {
  return store.get(KEYS.addresses, []);
}

export async function getDefaultAddress() {
  const liste = await getAddresses();
  return liste.find(a => a.is_default) || liste[0] || null;
}

export async function addAddress(adresse) {
  const liste = await getAddresses();
  const profil = await getProfile();
  const neu = {
    id: neueId('adr'),
    profile_id: profil ? profil.id : null,
    label: adresse.label || 'Adresse',
    first_name: adresse.first_name || '',
    last_name: adresse.last_name || '',
    street: adresse.street || '',
    postal_code: adresse.postal_code || '',
    city: adresse.city || '',
    phone: adresse.phone || '',
    delivery_note: adresse.delivery_note || null,
    is_default: liste.length === 0,
    created_at: new Date().toISOString()
  };
  liste.push(neu);
  await store.set(KEYS.addresses, liste);
  return neu;
}

export async function updateAddress(id, patch) {
  const liste = await getAddresses();
  const i = liste.findIndex(a => a.id === id);
  if (i === -1) return null;
  liste[i] = { ...liste[i], ...patch, id };
  await store.set(KEYS.addresses, liste);
  return liste[i];
}

export async function deleteAddress(id) {
  const liste = await getAddresses();
  const gefiltert = liste.filter(a => a.id !== id);
  // Falls die Standardadresse geloescht wurde, ruecken wir nach
  if (gefiltert.length && !gefiltert.some(a => a.is_default)) {
    gefiltert[0].is_default = true;
  }
  await store.set(KEYS.addresses, gefiltert);
}

export async function setDefaultAddress(id) {
  const liste = await getAddresses();
  liste.forEach(a => { a.is_default = (a.id === id); });
  await store.set(KEYS.addresses, liste);
}

// ---------------------------------------------------------------
// Zahlungsarten
// Es werden niemals Kartendaten gespeichert, nur Typ und Anzeigedaten.
// ---------------------------------------------------------------

export async function getPaymentMethods() {
  return store.get(KEYS.payment_methods, []);
}

export async function getDefaultPaymentMethod() {
  const liste = await getPaymentMethods();
  return liste.find(p => p.is_default) || liste[0] || null;
}

export async function addPaymentMethod(methode) {
  const liste = await getPaymentMethods();
  const profil = await getProfile();
  const neu = {
    id: neueId('pay'),
    profile_id: profil ? profil.id : null,
    type: methode.type || 'bar',
    stripe_payment_method_id: null,
    brand: methode.brand || null,
    last4: methode.last4 || null,
    exp_month: methode.exp_month || null,
    exp_year: methode.exp_year || null,
    is_default: liste.length === 0,
    created_at: new Date().toISOString()
  };
  liste.push(neu);
  await store.set(KEYS.payment_methods, liste);
  return neu;
}

export async function deletePaymentMethod(id) {
  const liste = await getPaymentMethods();
  const gefiltert = liste.filter(p => p.id !== id);
  if (gefiltert.length && !gefiltert.some(p => p.is_default)) {
    gefiltert[0].is_default = true;
  }
  await store.set(KEYS.payment_methods, gefiltert);
}

export async function setDefaultPaymentMethod(id) {
  const liste = await getPaymentMethods();
  liste.forEach(p => { p.is_default = (p.id === id); });
  await store.set(KEYS.payment_methods, liste);
}

// ---------------------------------------------------------------
// Bestellungen
// ---------------------------------------------------------------

export async function getOrders() {
  const liste = await store.get(KEYS.orders, []);
  return liste.slice().sort((a, b) => new Date(b.placed_at) - new Date(a.placed_at));
}

export async function getOrder(id) {
  const liste = await getOrders();
  return liste.find(o => o.id === id) || null;
}

export async function getLastOrder() {
  const liste = await getOrders();
  return liste[0] || null;
}

// Legt eine Bestellung an und vergibt bei Bedarf einen Stempel.
// Im Echtbetrieb uebernimmt die Stempelvergabe die Postgres-Funktion
// vergebe_stempel(), siehe Specs/datenmodell.md. Die Schnittstelle
// nach aussen bleibt identisch.
export async function createOrder(bestellung) {
  const profil = await getProfile();
  const liste = await store.get(KEYS.orders, []);

  const positionen = bestellung.items || [];
  const subtotal = runde(positionen.reduce((s, p) => s + p.unit_price * p.qty, 0));
  const delivery_fee = bestellung.mode === 'abholung' ? 0 : LIEFERKOSTEN;
  const discount = runde(bestellung.discount || 0);

  const neu = {
    id: neueId('ord'),
    profile_id: profil ? profil.id : null,
    order_number: 'SI-' + Math.floor(2500 + Math.random() * 500),
    status: 'abgeschlossen',
    mode: bestellung.mode || 'lieferung',
    address_id: bestellung.address_id || null,
    address_snapshot: bestellung.address_snapshot || null,
    payment_type: bestellung.payment_type || 'bar',
    subtotal,
    delivery_fee,
    discount,
    voucher_id: bestellung.voucher_id || null,
    total: runde(subtotal + delivery_fee - discount),
    note: bestellung.note || null,
    placed_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    items: positionen.map((p, i) => ({
      id: neueId('pos'),
      order_id: null,
      product_id: p.product_id,
      name: p.name,
      unit_price: p.unit_price,
      qty: p.qty,
      options: p.options || null
    }))
  };
  neu.items.forEach(p => { p.order_id = neu.id; });

  liste.push(neu);
  await store.set(KEYS.orders, liste);

  const stempelErgebnis = await stempelVergeben(neu);

  return { order: neu, stempel: stempelErgebnis };
}

// Legt alle Positionen einer alten Bestellung erneut in den Warenkorb
export async function reorder(orderId) {
  const bestellung = await getOrder(orderId);
  if (!bestellung) return false;
  bestellung.items.forEach(p => {
    addToCart({ id: p.product_id, name: p.name, price: p.unit_price });
    if (p.qty > 1) updateQty(p.product_id, p.qty);
  });
  return true;
}

// ---------------------------------------------------------------
// Treueprogramm
// ---------------------------------------------------------------

export async function getLoyaltyProgram() {
  return { ...TREUE };
}

export async function getStampCard() {
  const karte = await store.get(KEYS.stamp_card, null);
  if (!karte) return null;
  return {
    ...karte,
    target_stamps: TREUE.target_stamps,
    verbleibend: Math.max(0, TREUE.target_stamps - karte.stamps_count)
  };
}

// Interne Stempellogik. Gibt zurueck, was passiert ist, damit die
// Danke-Seite eine passende Meldung anzeigen kann.
async function stempelVergeben(bestellung) {
  if (!TREUE.active) {
    return { vergeben: false, grund: 'programm_inaktiv' };
  }
  if (!bestellung.profile_id) {
    return { vergeben: false, grund: 'gastbestellung' };
  }
  if (bestellung.subtotal < TREUE.min_order_value) {
    return {
      vergeben: false,
      grund: 'unter_mindestwert',
      fehlbetrag: runde(TREUE.min_order_value - bestellung.subtotal)
    };
  }
  if (!TREUE.combinable_with_discounts && bestellung.discount > 0) {
    return { vergeben: false, grund: 'rabatt_kombiniert' };
  }

  let karte = await store.get(KEYS.stamp_card, null);
  if (!karte) {
    karte = {
      id: neueId('karte'),
      profile_id: bestellung.profile_id,
      stamps_count: 0,
      status: 'aktiv',
      completed_at: null,
      created_at: new Date().toISOString()
    };
  }

  karte.stamps_count += 1;

  // Karte voll: Gutschein erzeugen und neue Karte anlegen
  if (karte.stamps_count >= TREUE.target_stamps) {
    const gutscheine = await store.get(KEYS.vouchers, []);
    const gutschein = {
      id: neueId('gut'),
      profile_id: bestellung.profile_id,
      code: gutscheinCode(),
      type: TREUE.reward_type,
      value: null,
      description: TREUE.reward_description,
      source: 'stempelkarte',
      status: 'offen',
      valid_until: datumPlusTage(TREUE.voucher_validity_days),
      stamp_card_id: karte.id,
      redeemed_order_id: null,
      created_at: new Date().toISOString()
    };
    gutscheine.push(gutschein);
    await store.set(KEYS.vouchers, gutscheine);

    await store.set(KEYS.stamp_card, {
      id: neueId('karte'),
      profile_id: bestellung.profile_id,
      stamps_count: 0,
      status: 'aktiv',
      completed_at: null,
      created_at: new Date().toISOString()
    });

    return {
      vergeben: true,
      karte_voll: true,
      stempel_stand: TREUE.target_stamps,
      gutschein
    };
  }

  await store.set(KEYS.stamp_card, karte);
  return {
    vergeben: true,
    karte_voll: false,
    stempel_stand: karte.stamps_count,
    verbleibend: TREUE.target_stamps - karte.stamps_count
  };
}

// Zeigt an, was eine geplante Bestellung fuer die Stempelkarte bedeuten
// wuerde. Fuer die Anzeige im Warenkorb und im Checkout.
export async function getStampPreview(zwischensumme) {
  const karte = await getStampCard();
  if (!karte || !TREUE.active) return null;

  if (zwischensumme < TREUE.min_order_value) {
    return {
      qualifiziert: false,
      fehlbetrag: runde(TREUE.min_order_value - zwischensumme),
      stempel_stand: karte.stamps_count,
      target_stamps: TREUE.target_stamps
    };
  }
  return {
    qualifiziert: true,
    naechster_stempel: karte.stamps_count + 1,
    target_stamps: TREUE.target_stamps,
    karte_wird_voll: karte.stamps_count + 1 >= TREUE.target_stamps
  };
}

export async function getVouchers() {
  const liste = await store.get(KEYS.vouchers, []);
  const heute = new Date().toISOString().slice(0, 10);
  // Abgelaufene Gutscheine beim Lesen markieren
  let geaendert = false;
  liste.forEach(g => {
    if (g.status === 'offen' && g.valid_until < heute) {
      g.status = 'verfallen';
      geaendert = true;
    }
  });
  if (geaendert) await store.set(KEYS.vouchers, liste);
  return liste;
}

export async function getOpenVouchers() {
  const liste = await getVouchers();
  return liste.filter(g => g.status === 'offen');
}

// Prueft einen Code, ohne ihn einzuloesen
export async function checkVoucher(code) {
  const liste = await getVouchers();
  const gutschein = liste.find(
    g => g.code.toUpperCase() === String(code).trim().toUpperCase()
  );
  if (!gutschein) return { gueltig: false, grund: 'unbekannt' };
  if (gutschein.status === 'eingeloest') return { gueltig: false, grund: 'bereits_eingeloest' };
  if (gutschein.status === 'verfallen') return { gueltig: false, grund: 'verfallen' };
  return { gueltig: true, gutschein };
}

export async function redeemVoucher(code, orderId = null) {
  const pruefung = await checkVoucher(code);
  if (!pruefung.gueltig) return pruefung;

  const liste = await store.get(KEYS.vouchers, []);
  const i = liste.findIndex(g => g.id === pruefung.gutschein.id);
  liste[i].status = 'eingeloest';
  liste[i].redeemed_order_id = orderId;
  await store.set(KEYS.vouchers, liste);
  return { gueltig: true, gutschein: liste[i] };
}

// ---------------------------------------------------------------
// Favoriten
// ---------------------------------------------------------------

export async function getFavorites() {
  return store.get(KEYS.favorites, []);
}

export async function isFavorite(product_id) {
  const liste = await getFavorites();
  return liste.some(f => f.product_id === product_id);
}

export async function toggleFavorite(product_id) {
  const liste = await getFavorites();
  const profil = await getProfile();
  const i = liste.findIndex(f => f.product_id === product_id);
  if (i > -1) {
    liste.splice(i, 1);
    await store.set(KEYS.favorites, liste);
    return false;
  }
  liste.push({
    id: neueId('fav'),
    profile_id: profil ? profil.id : null,
    product_id,
    created_at: new Date().toISOString()
  });
  await store.set(KEYS.favorites, liste);
  return true;
}

// ---------------------------------------------------------------
// Reservierungen
// ---------------------------------------------------------------

export async function getReservations() {
  const liste = await store.get(KEYS.reservations, []);
  return liste.slice().sort(
    (a, b) => new Date(b.reservation_date) - new Date(a.reservation_date)
  );
}

export async function createReservation(reservierung) {
  const liste = await store.get(KEYS.reservations, []);
  const profil = await getProfile();
  const neu = {
    id: neueId('res'),
    profile_id: profil ? profil.id : null,
    reservation_date: reservierung.reservation_date,
    reservation_time: reservierung.reservation_time,
    guests: Number(reservierung.guests) || 2,
    first_name: reservierung.first_name || '',
    last_name: reservierung.last_name || '',
    phone: reservierung.phone || '',
    email: reservierung.email || '',
    note: reservierung.note || null,
    status: 'angefragt',
    created_at: new Date().toISOString()
  };
  liste.push(neu);
  await store.set(KEYS.reservations, liste);
  return neu;
}

export async function cancelReservation(id) {
  const liste = await store.get(KEYS.reservations, []);
  const i = liste.findIndex(r => r.id === id);
  if (i === -1) return null;
  liste[i].status = 'storniert';
  await store.set(KEYS.reservations, liste);
  return liste[i];
}

// ---------------------------------------------------------------
// Demo-Banner und Navigation
// Wird von jeder Seite aufgerufen, damit das Markup nicht in jede
// HTML-Datei kopiert werden muss.
// ---------------------------------------------------------------

export async function renderDemoBanner(zielId = 'demo-banner') {
  const ziel = document.getElementById(zielId);
  if (!ziel) return;

  const session = await getSession();
  const profil = await getProfile();

  if (session && profil) {
    ziel.innerHTML = `
      <div class="demo-banner__inner">
        <span class="demo-banner__text">
          Demo-Modus: angemeldet als ${profil.first_name} ${profil.last_name}
        </span>
        <span class="demo-banner__actions">
          <button type="button" class="demo-banner__link" data-demo="reset">Zurücksetzen</button>
          <span class="demo-banner__sep">·</span>
          <button type="button" class="demo-banner__link" data-demo="logout">Abmelden</button>
        </span>
      </div>`;
  } else {
    ziel.innerHTML = `
      <div class="demo-banner__inner">
        <span class="demo-banner__text">Demo-Modus: nicht angemeldet</span>
        <span class="demo-banner__actions">
          <button type="button" class="demo-banner__link" data-demo="login">Als Demo-Kunde anmelden</button>
        </span>
      </div>`;
  }

  ziel.querySelectorAll('[data-demo]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const aktion = btn.dataset.demo;
      if (aktion === 'reset') await resetDemo();
      if (aktion === 'logout') await logout();
      if (aktion === 'login') await login();
      window.location.reload();
    });
  });
}

// Setzt den Konto-Link in der Navigation
export async function renderAccountNav(zielId = 'nav-konto') {
  const ziel = document.getElementById(zielId);
  if (!ziel) return;

  const session = await getSession();
  const profil = await getProfile();

  if (session && profil) {
    ziel.innerHTML = `
      <a href="konto.html" class="nav__konto" aria-label="Mein Konto">
        <span class="nav__konto-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"></path>
          </svg>
        </span>
        <span class="nav__konto-name">${profil.first_name}</span>
      </a>`;
  } else {
    ziel.innerHTML = `<a href="anmelden.html" class="nav__konto">Anmelden</a>`;
  }
}

// Baut auf Mobile ein Burger-Menue. Die Nav-Elemente bleiben im DOM,
// sie werden nur per CSS ein- und ausgeblendet. Damit funktioniert es
// auf allen Seiten, unabhaengig von deren Nav-Aufbau.
export function renderBurger() {
  const inner = document.querySelector('.nav__inner');
  const nav = document.querySelector('.nav');
  if (!inner || !nav || inner.querySelector('.nav__burger')) return;

  // Bringt die Seite bereits ein eigenes Hamburger-Menue mit, wird
  // keines eingefuegt. Sonst haette die Seite zwei davon.
  if (document.querySelector('.nav__hamburger, .nav__mobile-menu')) return;

  // Nichts zu tun, wenn es weder Links noch Aktionen gibt
  const hatInhalt = inner.querySelector('.nav__links') || inner.querySelector('.nav__aktionen');
  if (!hatInhalt) return;

  const btn = document.createElement('button');
  btn.className = 'nav__burger';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Menü öffnen');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>`;

  btn.addEventListener('click', () => {
    const offen = nav.classList.toggle('nav--offen');
    btn.setAttribute('aria-expanded', offen ? 'true' : 'false');
    btn.setAttribute('aria-label', offen ? 'Menü schließen' : 'Menü öffnen');
  });

  // Beim Klick auf einen Link im Panel wieder schliessen
  inner.addEventListener('click', (e) => {
    if (e.target.closest('.nav__links a, .nav__aktionen a')) {
      nav.classList.remove('nav--offen');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  inner.appendChild(btn);
}

// Bequemer Sammelaufruf fuer jede Seite
export async function setupSeite() {
  await initAuth();
  await renderDemoBanner();
  await renderAccountNav();
  renderBurger();
}
