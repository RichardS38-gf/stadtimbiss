// konto.js — Oberflaeche des Kundenbereichs
// Greift ausschliesslich ueber auth.js auf Daten zu, niemals direkt
// auf localStorage.

import {
  setupSeite,
  getSession,
  getProfile,
  updateProfile,
  deleteAccount,
  exportData,
  getOrders,
  getLastOrder,
  getStampCard,
  getOpenVouchers,
  getVouchers,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
  getPaymentMethods,
  setDefaultPaymentMethod,
  getDefaultPaymentMethod,
  getFavorites,
  toggleFavorite,
  getReservations,
  cancelReservation,
  reorder,
  TREUE
} from './auth.js';
import { addToCart } from './cart.js';
import { KATALOG } from './demo-daten.js';

// ---------------------------------------------------------------
// Formatierung
// ---------------------------------------------------------------
function euro(betrag) {
  return Number(betrag).toFixed(2).replace('.', ',') + ' €';
}

function datum(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

const ZAHLART_TEXT = {
  bar: 'Bar bei Lieferung',
  ec: 'EC-Karte bei Lieferung',
  paypal: 'PayPal',
  card: 'Kreditkarte'
};

const MODUS_TEXT = {
  lieferung: 'Lieferung',
  abholung: 'Abholung'
};

// Escaped Nutzertexte, damit eingegebene Namen kein Markup einschleusen
function sicher(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : String(text);
  return div.innerHTML;
}

// ---------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------
function tabsAktivieren() {
  const tabs = document.querySelectorAll('.konto-tab');
  const panels = document.querySelectorAll('.konto-panel');

  function zeige(name) {
    tabs.forEach(t => t.classList.toggle('konto-tab--active', t.dataset.tab === name));
    panels.forEach(p => p.classList.toggle('konto-panel--active', p.dataset.panel === name));
    history.replaceState(null, '', '#' + name);
  }

  tabs.forEach(t => {
    t.addEventListener('click', () => zeige(t.dataset.tab));
  });

  // Direkteinstieg per Anker, z.B. konto.html#stempelkarte
  const start = window.location.hash.replace('#', '');
  if (start && document.querySelector(`.konto-panel[data-panel="${start}"]`)) {
    zeige(start);
  }
}

// ---------------------------------------------------------------
// Stempelkarte
// ---------------------------------------------------------------
function stempelkarteHTML(karte, { neuerStempel = false } = {}) {
  if (!karte) return '';

  const voll = karte.stamps_count >= karte.target_stamps;
  const slots = [];

  for (let i = 0; i < karte.target_stamps; i++) {
    const gefuellt = i < karte.stamps_count;
    const istNeu = neuerStempel && i === karte.stamps_count - 1;
    slots.push(`
      <div class="stamp-slot ${gefuellt ? 'stamp-slot--filled' : ''} ${istNeu ? 'stamp-slot--neu' : ''}">
        ${gefuellt ? `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
               stroke="currentColor" stroke-width="3" stroke-linecap="round"
               stroke-linejoin="round" aria-hidden="true">
            <polyline points="4 12 10 18 20 6"></polyline>
          </svg>` : ''}
      </div>`);
  }

  const hinweis = voll
    ? `<p class="stamp-card__hinweis"><strong>Deine Belohnung wartet.</strong> ${sicher(TREUE.reward_description)} bei der nächsten Bestellung.</p>`
    : karte.verbleibend === 1
      ? `<p class="stamp-card__hinweis">Nur noch <strong>eine Bestellung</strong> bis zu deiner Belohnung.</p>`
      : `<p class="stamp-card__hinweis">Noch <strong>${karte.verbleibend} Bestellungen</strong> bis zu deiner Belohnung.</p>`;

  return `
    <div class="stamp-card ${voll ? 'stamp-card--voll' : ''}">
      <div class="stamp-card__kopf">
        <span class="stamp-card__titel">Stempelkarte</span>
        <span class="stamp-card__stand">${karte.stamps_count} von ${karte.target_stamps}</span>
      </div>
      <div class="stamp-grid">${slots.join('')}</div>
      ${hinweis}
      <p class="konto-hinweis">
        Ein Stempel je Bestellung ab ${euro(TREUE.min_order_value)} Warenwert.
        Belohnung: ${sicher(TREUE.reward_description)}.
      </p>
    </div>`;
}

// ---------------------------------------------------------------
// Bestellungen
// ---------------------------------------------------------------
function bestellungHTML(bestellung) {
  const anzahl = bestellung.items.reduce((s, p) => s + p.qty, 0);
  const gestempelt = bestellung.subtotal >= TREUE.min_order_value && bestellung.discount === 0;

  const positionen = bestellung.items.map(p => `
    <div class="order-pos">
      <span class="order-pos__name">${sicher(p.name)}</span>
      <span class="order-pos__qty">${p.qty} ×</span>
      <span class="order-pos__preis">${euro(p.unit_price * p.qty)}</span>
    </div>`).join('');

  return `
    <article class="order-row" data-order="${bestellung.id}">
      <div class="order-row__kopf">
        <div class="order-row__meta">
          <div class="order-row__nummer">${sicher(bestellung.order_number)}</div>
          <div class="order-row__datum">
            ${datum(bestellung.placed_at)} · ${anzahl} ${anzahl === 1 ? 'Artikel' : 'Artikel'}
          </div>
          <div class="order-row__badges">
            <span class="order-badge">${MODUS_TEXT[bestellung.mode] || bestellung.mode}</span>
            <span class="order-badge">${ZAHLART_TEXT[bestellung.payment_type] || bestellung.payment_type}</span>
            ${gestempelt
              ? '<span class="order-badge order-badge--stempel">Stempel erhalten</span>'
              : '<span class="order-badge">Kein Stempel</span>'}
          </div>
        </div>
        <div class="order-row__summe">${euro(bestellung.total)}</div>
      </div>

      <div class="order-row__aktionen">
        <button class="btn btn--primary btn--sm" data-reorder="${bestellung.id}">
          Nochmal bestellen
        </button>
        <button class="order-row__toggle" data-toggle="${bestellung.id}">
          Details anzeigen
        </button>
      </div>

      <div class="order-row__details" data-details="${bestellung.id}">
        ${positionen}
        <div class="order-pos order-pos--summe">
          <span class="order-pos__name">Zwischensumme</span>
          <span class="order-pos__qty"></span>
          <span class="order-pos__preis">${euro(bestellung.subtotal)}</span>
        </div>
        ${bestellung.delivery_fee > 0 ? `
        <div class="order-pos">
          <span class="order-pos__name">Lieferung</span>
          <span class="order-pos__qty"></span>
          <span class="order-pos__preis">${euro(bestellung.delivery_fee)}</span>
        </div>` : ''}
        ${bestellung.discount > 0 ? `
        <div class="order-pos">
          <span class="order-pos__name">Rabatt</span>
          <span class="order-pos__qty"></span>
          <span class="order-pos__preis">- ${euro(bestellung.discount)}</span>
        </div>` : ''}
        <div class="order-pos order-pos--summe">
          <span class="order-pos__name">Gesamt</span>
          <span class="order-pos__qty"></span>
          <span class="order-pos__preis">${euro(bestellung.total)}</span>
        </div>
      </div>
    </article>`;
}

function bestellEventsBinden(container) {
  if (!container) return;

  container.addEventListener('click', async (e) => {
    const toggleBtn = e.target.closest('[data-toggle]');
    if (toggleBtn) {
      const id = toggleBtn.dataset.toggle;
      const details = container.querySelector(`[data-details="${id}"]`);
      const offen = details.classList.toggle('order-row__details--offen');
      toggleBtn.textContent = offen ? 'Details ausblenden' : 'Details anzeigen';
      return;
    }

    const reorderBtn = e.target.closest('[data-reorder]');
    if (reorderBtn) {
      const ok = await reorder(reorderBtn.dataset.reorder);
      if (ok) {
        reorderBtn.textContent = 'In den Warenkorb gelegt';
        reorderBtn.disabled = true;
        setTimeout(() => { window.location.href = 'bestellen.html'; }, 700);
      }
    }
  });
}

// ---------------------------------------------------------------
// Gutscheine
// ---------------------------------------------------------------
function gutscheinHTML(gutschein) {
  const aktiv = gutschein.status === 'offen';
  return `
    <div class="voucher-card ${aktiv ? '' : 'voucher-card--inaktiv'}">
      <div class="voucher-card__code">${sicher(gutschein.code)}</div>
      <p class="voucher-card__text">${sicher(gutschein.description)}</p>
      <p class="voucher-card__gueltig">
        ${aktiv
          ? 'Gültig bis ' + datum(gutschein.valid_until)
          : gutschein.status === 'eingeloest' ? 'Bereits eingelöst' : 'Abgelaufen'}
      </p>
    </div>`;
}

// ---------------------------------------------------------------
// Übersicht befuellen
// ---------------------------------------------------------------
async function uebersichtRendern() {
  const karte = await getStampCard();
  document.getElementById('uebersicht-stempel').innerHTML = stempelkarteHTML(karte);

  const letzte = await getLastOrder();
  const letzteEl = document.getElementById('uebersicht-letzte');
  if (letzte) {
    const anzahl = letzte.items.reduce((s, p) => s + p.qty, 0);
    letzteEl.innerHTML = `
      <div class="order-row__nummer">${sicher(letzte.order_number)}</div>
      <div class="order-row__datum" style="margin-bottom:var(--space-3)">
        ${datum(letzte.placed_at)} · ${anzahl} Artikel · ${euro(letzte.total)}
      </div>
      <button class="btn btn--primary btn--sm" data-reorder="${letzte.id}">
        Nochmal bestellen
      </button>`;
  } else {
    letzteEl.innerHTML = '<p class="konto-leer">Noch keine Bestellung.</p>';
  }

  const gutscheine = await getOpenVouchers();
  const gutEl = document.getElementById('uebersicht-gutscheine');
  gutEl.innerHTML = gutscheine.length
    ? gutscheine.map(gutscheinHTML).join('')
    : '<p class="konto-leer">Keine offenen Gutscheine.</p>';

  const adresse = await getDefaultAddress();
  const adrEl = document.getElementById('uebersicht-adresse');
  adrEl.innerHTML = adresse
    ? `<div class="address-card__label">${sicher(adresse.label)}</div>
       <p class="address-card__text">
         ${sicher(adresse.first_name)} ${sicher(adresse.last_name)}<br>
         ${sicher(adresse.street)}<br>
         ${sicher(adresse.postal_code)} ${sicher(adresse.city)}
       </p>`
    : '<p class="konto-leer">Keine Adresse hinterlegt.</p>';

  const zahlung = await getDefaultPaymentMethod();
  const zahlEl = document.getElementById('uebersicht-zahlung');
  zahlEl.innerHTML = zahlung
    ? `<p class="address-card__text">${ZAHLART_TEXT[zahlung.type] || zahlung.type}${
        zahlung.last4 ? ' ' + sicher(zahlung.brand) + ' ' + sicher(zahlung.last4) : ''
      }</p>`
    : '<p class="konto-leer">Keine Zahlungsart hinterlegt.</p>';

  bestellEventsBinden(letzteEl);
}

// ---------------------------------------------------------------
// Bestellungen befuellen
// ---------------------------------------------------------------
async function bestellungenRendern() {
  const liste = await getOrders();
  const el = document.getElementById('bestellungen-liste');
  el.innerHTML = liste.length
    ? liste.map(bestellungHTML).join('')
    : '<p class="konto-leer">Noch keine Bestellungen vorhanden.</p>';
  bestellEventsBinden(el);
}

// ---------------------------------------------------------------
// Stempelkarte, grosse Ansicht plus Regeln
// ---------------------------------------------------------------
const TREUE_REGELN = [
  'Ein Stempel je abgeschlossener Bestellung.',
  `Die Zwischensumme muss mindestens ${'MINDESTWERT'} betragen, Lieferkosten zählen nicht mit.`,
  'Der Betrag der Bestellung spielt sonst keine Rolle, es gibt immer genau einen Stempel.',
  'Auf Bestellungen mit bereits eingelöstem Rabatt oder Gutschein gibt es keinen Stempel.',
  'Wird eine Bestellung storniert, wird der Stempel wieder abgezogen.',
  'Gutscheine sind an das Konto gebunden und nicht übertragbar.',
  `Gutscheine verfallen nach ${'GUELTIGKEIT'} Tagen.`,
  'Wir können das Programm beenden, ausgegebene Gutscheine bleiben bis zum Ablauf gültig.'
];

async function stempelkarteRendern() {
  const karte = await getStampCard();
  document.getElementById('stempel-gross').innerHTML = stempelkarteHTML(karte);

  const alle = await getVouchers();
  document.getElementById('stempel-gutscheine').innerHTML = alle.length
    ? alle.map(gutscheinHTML).join('')
    : '<p class="konto-leer">Noch keine Gutscheine.</p>';

  document.getElementById('stempel-regeln').innerHTML = TREUE_REGELN
    .map(r => r
      .replace('MINDESTWERT', euro(TREUE.min_order_value))
      .replace('GUELTIGKEIT', TREUE.voucher_validity_days))
    .map(r => `<li>${r}</li>`)
    .join('');
}

// ---------------------------------------------------------------
// Adressen
// ---------------------------------------------------------------
function adresseHTML(adresse) {
  return `
    <div class="address-card ${adresse.is_default ? 'address-card--default' : ''}">
      <div class="address-card__label">
        ${sicher(adresse.label)}
        ${adresse.is_default ? '<span class="badge">Standard</span>' : ''}
      </div>
      <p class="address-card__text">
        ${sicher(adresse.first_name)} ${sicher(adresse.last_name)}<br>
        ${sicher(adresse.street)}<br>
        ${sicher(adresse.postal_code)} ${sicher(adresse.city)}
        ${adresse.phone ? '<br>' + sicher(adresse.phone) : ''}
        ${adresse.delivery_note ? '<br><em>' + sicher(adresse.delivery_note) + '</em>' : ''}
      </p>
      <div class="address-card__aktionen">
        <button class="link-btn" data-adr-edit="${adresse.id}">Bearbeiten</button>
        ${!adresse.is_default
          ? `<button class="link-btn" data-adr-default="${adresse.id}">Als Standard</button>
             <button class="link-btn link-btn--still" data-adr-del="${adresse.id}">Löschen</button>`
          : ''}
      </div>
    </div>`;
}

async function adressenRendern() {
  const liste = await getAddresses();
  const el = document.getElementById('adressen-liste');
  el.innerHTML = liste.length
    ? liste.map(adresseHTML).join('')
    : '<p class="konto-leer">Noch keine Adresse hinterlegt.</p>';
}

function modalOeffnen(adresse = null) {
  const modal = document.getElementById('adress-modal');
  const form = document.getElementById('adress-form');
  form.reset();
  form.elements.id.value = adresse ? adresse.id : '';
  document.getElementById('adress-modal-titel').textContent =
    adresse ? 'Adresse bearbeiten' : 'Neue Adresse';
  if (adresse) {
    form.elements.label.value = adresse.label || '';
    form.elements.first_name.value = adresse.first_name || '';
    form.elements.last_name.value = adresse.last_name || '';
    form.elements.street.value = adresse.street || '';
    form.elements.postal_code.value = adresse.postal_code || '';
    form.elements.city.value = adresse.city || '';
    form.elements.phone.value = adresse.phone || '';
    form.elements.delivery_note.value = adresse.delivery_note || '';
  }
  modal.classList.add('konto-modal--offen');
  document.body.style.overflow = 'hidden';
}

function modalSchliessen() {
  document.getElementById('adress-modal').classList.remove('konto-modal--offen');
  document.body.style.overflow = '';
}

function adressEventsBinden() {
  const liste = document.getElementById('adressen-liste');

  document.getElementById('adresse-neu')
    .addEventListener('click', () => modalOeffnen(null));
  document.getElementById('adress-modal-close')
    .addEventListener('click', modalSchliessen);
  document.getElementById('adress-modal-abbrechen')
    .addEventListener('click', modalSchliessen);
  document.getElementById('adress-modal')
    .addEventListener('click', (e) => {
      if (e.target.id === 'adress-modal') modalSchliessen();
    });

  liste.addEventListener('click', async (e) => {
    const edit = e.target.closest('[data-adr-edit]');
    if (edit) {
      const alle = await getAddresses();
      modalOeffnen(alle.find(a => a.id === edit.dataset.adrEdit));
      return;
    }
    const std = e.target.closest('[data-adr-default]');
    if (std) {
      await setDefaultAddress(std.dataset.adrDefault);
      await adressenRendern();
      await uebersichtRendern();
      return;
    }
    const del = e.target.closest('[data-adr-del]');
    if (del) {
      if (!confirm('Diese Adresse wirklich löschen?')) return;
      await deleteAddress(del.dataset.adrDel);
      await adressenRendern();
      await uebersichtRendern();
    }
  });

  document.getElementById('adress-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const daten = Object.fromEntries(new FormData(form).entries());
    if (daten.id) {
      await updateAddress(daten.id, daten);
    } else {
      delete daten.id;
      await addAddress(daten);
    }
    modalSchliessen();
    await adressenRendern();
    await uebersichtRendern();
  });
}

// ---------------------------------------------------------------
// Zahlungsarten
// ---------------------------------------------------------------
async function zahlungRendern() {
  const liste = await getPaymentMethods();
  const el = document.getElementById('zahlung-liste');
  el.innerHTML = liste.length
    ? liste.map(p => `
      <div class="address-card ${p.is_default ? 'address-card--default' : ''}">
        <div class="address-card__label">
          ${ZAHLART_TEXT[p.type] || sicher(p.type)}
          ${p.is_default ? '<span class="badge">Standard</span>' : ''}
        </div>
        <p class="address-card__text">
          ${p.last4 ? sicher(p.brand) + ' ' + sicher(p.last4) : 'Zahlung bei Übergabe'}
        </p>
        ${!p.is_default
          ? `<div class="address-card__aktionen">
               <button class="link-btn" data-pay-default="${p.id}">Als Standard</button>
             </div>`
          : ''}
      </div>`).join('')
    : '<p class="konto-leer">Keine Zahlungsart hinterlegt.</p>';

  el.onclick = async (e) => {
    const btn = e.target.closest('[data-pay-default]');
    if (!btn) return;
    await setDefaultPaymentMethod(btn.dataset.payDefault);
    await zahlungRendern();
    await uebersichtRendern();
  };
}

// ---------------------------------------------------------------
// Favoriten
// ---------------------------------------------------------------
async function favoritenRendern() {
  const liste = await getFavorites();
  const el = document.getElementById('favoriten-liste');

  const vorhanden = liste.filter(f => KATALOG[f.product_id]);

  el.innerHTML = vorhanden.length
    ? vorhanden.map(f => {
        const artikel = KATALOG[f.product_id];
        return `
          <div class="fav-card">
            <img class="fav-card__img" src="${artikel.img}" alt="${sicher(artikel.name)}" loading="lazy">
            <div class="fav-card__body">
              <div class="fav-card__name">${sicher(artikel.name)}</div>
              <div class="fav-card__preis">${euro(artikel.price)}</div>
              <div class="fav-card__aktionen">
                <button class="btn btn--primary btn--sm" data-fav-cart="${f.product_id}">
                  In den Warenkorb
                </button>
                <button class="link-btn link-btn--still" data-fav-del="${f.product_id}">
                  Entfernen
                </button>
              </div>
            </div>
          </div>`;
      }).join('')
    : '<p class="konto-leer">Noch keine Favoriten. Tippe beim Bestellen auf das Herz.</p>';

  el.onclick = async (e) => {
    const cart = e.target.closest('[data-fav-cart]');
    if (cart) {
      const id = cart.dataset.favCart;
      const artikel = KATALOG[id];
      addToCart({ id, name: artikel.name, price: artikel.price });
      cart.textContent = 'Hinzugefügt';
      setTimeout(() => { cart.textContent = 'In den Warenkorb'; }, 1200);
      return;
    }
    const del = e.target.closest('[data-fav-del]');
    if (del) {
      await toggleFavorite(del.dataset.favDel);
      await favoritenRendern();
    }
  };
}

// ---------------------------------------------------------------
// Reservierungen
// ---------------------------------------------------------------
const RES_STATUS = {
  angefragt: 'Angefragt',
  bestaetigt: 'Bestätigt',
  abgelehnt: 'Abgelehnt',
  storniert: 'Storniert'
};

async function reservierungenRendern() {
  const liste = await getReservations();
  const el = document.getElementById('reservierungen-liste');
  const heute = new Date().toISOString().slice(0, 10);

  el.innerHTML = liste.length
    ? liste.map(r => {
        const vergangen = r.reservation_date < heute;
        const stornierbar = !vergangen && r.status !== 'storniert';
        return `
          <div class="res-row ${vergangen ? 'res-row--vergangen' : ''}">
            <div>
              <div class="res-row__datum">
                ${datum(r.reservation_date)} um ${sicher(r.reservation_time)} Uhr
              </div>
              <div class="res-row__meta">
                ${r.guests} ${r.guests === 1 ? 'Person' : 'Personen'}
                ${r.note ? ' · ' + sicher(r.note) : ''}
              </div>
            </div>
            <div class="res-row__status">
              <span class="order-badge">${RES_STATUS[r.status] || sicher(r.status)}</span>
              ${stornierbar
                ? `<div style="margin-top:var(--space-2)">
                     <button class="link-btn link-btn--still" data-res-cancel="${r.id}">Stornieren</button>
                   </div>`
                : ''}
            </div>
          </div>`;
      }).join('')
    : '<p class="konto-leer">Noch keine Reservierungen.</p>';

  el.onclick = async (e) => {
    const btn = e.target.closest('[data-res-cancel]');
    if (!btn) return;
    if (!confirm('Reservierung wirklich stornieren?')) return;
    await cancelReservation(btn.dataset.resCancel);
    await reservierungenRendern();
  };
}

// ---------------------------------------------------------------
// Einstellungen
// ---------------------------------------------------------------
async function einstellungenRendern() {
  const profil = await getProfile();
  if (!profil) return;

  const form = document.getElementById('profil-form');
  form.elements.first_name.value = profil.first_name || '';
  form.elements.last_name.value = profil.last_name || '';
  form.elements.email.value = profil.email || '';
  form.elements.phone.value = profil.phone || '';
  form.elements.birth_date.value = profil.birth_date || '';
  document.getElementById('p-marketing').checked = !!profil.marketing_consent;

  form.onsubmit = async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const daten = Object.fromEntries(new FormData(form).entries());
    await updateProfile(daten);
    const status = document.getElementById('profil-status');
    status.textContent = 'Gespeichert.';
    setTimeout(() => { status.textContent = ''; }, 2500);
    const neu = await getProfile();
    document.getElementById('konto-gruss').textContent = `Hallo ${neu.first_name}`;
  };

  document.getElementById('p-marketing').onchange = async (e) => {
    await updateProfile({ marketing_consent: e.target.checked });
  };

  document.getElementById('daten-export').onclick = async () => {
    const daten = await exportData();
    const blob = new Blob([JSON.stringify(daten, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meine-daten.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  document.getElementById('konto-loeschen').onclick = async () => {
    const sicherheit = confirm(
      'Konto wirklich löschen? Profil, Adressen, Bestellhistorie und Stempelkarte werden entfernt.'
    );
    if (!sicherheit) return;
    await deleteAccount();
    window.location.href = 'index.html';
  };
}

// ---------------------------------------------------------------
// Start
// ---------------------------------------------------------------
async function start() {
  await setupSeite();

  const session = await getSession();
  const profil = await getProfile();

  if (!session || !profil) {
    // Ausgeloggt: Tabs ausblenden, Hinweisbereich zeigen
    document.querySelector('.konto-tabs').style.display = 'none';
    document.querySelectorAll('.konto-panel').forEach(p => {
      p.classList.remove('konto-panel--active');
    });
    document.getElementById('panel-ausgeloggt').classList.add('konto-panel--active');
    document.getElementById('konto-gruss').textContent = 'Mein Konto';
    return;
  }

  document.getElementById('konto-gruss').textContent = `Hallo ${profil.first_name}`;
  document.getElementById('konto-sub').textContent =
    `Kunde seit ${datum(profil.created_at)} · ${profil.email}`;

  tabsAktivieren();
  await uebersichtRendern();
  await bestellungenRendern();
  await stempelkarteRendern();
  await adressenRendern();
  adressEventsBinden();
  await zahlungRendern();
  await favoritenRendern();
  await reservierungenRendern();
  await einstellungenRendern();

  // Sticky Nav Shadow
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
  });
}

start();
