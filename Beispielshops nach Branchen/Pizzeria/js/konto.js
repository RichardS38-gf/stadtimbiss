// konto.js — Oberflaeche des Kundenbereichs
// Greift ausschliesslich ueber auth.js auf Daten zu, niemals direkt
// auf localStorage.

import {
  setupSeite,
  getSession,
  getProfile,
  getOrders,
  getLastOrder,
  getStampCard,
  getOpenVouchers,
  getVouchers,
  getDefaultAddress,
  getDefaultPaymentMethod,
  reorder,
  TREUE
} from './auth.js';

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

  // Sticky Nav Shadow
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
  });
}

start();
