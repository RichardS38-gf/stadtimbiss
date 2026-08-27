// bestellen.js — Pommes Paul Bestellseite

import { addToCart, getCart, getCartTotal, getCartCount, updateQty, removeFromCart } from './cart.js';
import { setupSeite, getStampPreview, isFavorite, toggleFavorite, TREUE } from './auth.js';
import { iconsEinsetzen } from './icons.js';

// ---------- Cart-Item HTML ----------
function cartItemHTML(item) {
  return `
    <div class="cart-item" data-id="${item.id}">
      <span class="cart-item__name">${item.name}</span>
      <div class="cart-item__controls">
        <input
          class="cart-item__qty-input"
          type="number"
          min="0"
          value="${item.qty}"
          data-id="${item.id}"
          aria-label="Menge für ${item.name}"
        >
        <button class="cart-item__remove" data-id="${item.id}" aria-label="${item.name} entfernen">✕</button>
      </div>
      <span class="cart-item__price">${(item.price * item.qty).toFixed(2).replace('.', ',')} €</span>
    </div>
  `;
}

// ---------- Event-Delegation für Qty + Remove ----------
function bindCartEvents(container) {
  if (!container) return;

  container.addEventListener('change', e => {
    if (e.target.classList.contains('cart-item__qty-input')) {
      const id = e.target.dataset.id;
      const qty = parseInt(e.target.value, 10);
      if (isNaN(qty) || qty < 0) return;
      if (qty === 0) {
        removeFromCart(id);
      } else {
        updateQty(id, qty);
      }
      renderCart();
      renderCartMobile();
    }
  });

  container.addEventListener('click', e => {
    if (e.target.classList.contains('cart-item__remove')) {
      const id = e.target.dataset.id;
      removeFromCart(id);
      renderCart();
      renderCartMobile();
    }
  });
}

// ---------- Desktop Sidebar ----------
function renderCart() {
  const cart = getCart();
  const itemsEl = document.getElementById('cart-items');
  const emptyEl = document.getElementById('cart-empty');
  const summaryEl = document.getElementById('cart-summary');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');

  if (countEl) {
    countEl.textContent = getCartCount();
    countEl.style.display = getCartCount() > 0 ? 'flex' : 'none';
  }

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (summaryEl) summaryEl.style.display = 'block';

  const subtotal = getCartTotal();
  if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2).replace('.', ',') + ' €';
  if (totalEl) totalEl.textContent = (subtotal + 2.50).toFixed(2).replace('.', ',') + ' €';

  itemsEl.innerHTML = cart.map(cartItemHTML).join('');
}

// ---------- Mobile Drawer ----------
function renderCartMobile() {
  const cart = getCart();
  const itemsEl = document.getElementById('cart-items-mobile');
  const emptyEl = document.getElementById('cart-empty-mobile');
  const summaryEl = document.getElementById('cart-summary-mobile');
  const subtotalEl = document.getElementById('cart-subtotal-mobile');
  const totalEl = document.getElementById('cart-total-mobile');
  const fabEl = document.getElementById('cart-fab');
  const fabCount = document.getElementById('cart-fab-count');
  const fabPrice = document.getElementById('cart-fab-price');

  const count = getCartCount();
  const subtotal = getCartTotal();

  if (fabEl) {
    fabEl.classList.toggle('visible', count > 0);
    if (fabCount) fabCount.textContent = count;
    if (fabPrice) fabPrice.textContent = (subtotal + 2.50).toFixed(2).replace('.', ',') + ' €';
  }

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (summaryEl) summaryEl.style.display = 'block';
  if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2).replace('.', ',') + ' €';
  if (totalEl) totalEl.textContent = (subtotal + 2.50).toFixed(2).replace('.', ',') + ' €';

  itemsEl.innerHTML = cart.map(cartItemHTML).join('');
}

// ---------- "Hinzufügen"-Buttons ----------
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    addToCart({
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: parseFloat(btn.dataset.price)
    });
    renderCart();
    renderCartMobile();

    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.classList.remove('bounce');
      void badge.offsetWidth;
      badge.classList.add('bounce');
    }

    btn.textContent = '✓';
    btn.style.background = '#2a9d4e';
    btn.style.borderColor = '#2a9d4e';
    setTimeout(() => {
      btn.textContent = '+';
      btn.style.background = '';
      btn.style.borderColor = '';
    }, 1000);
  });
});

// ---------- Event-Delegation einbinden ----------
bindCartEvents(document.getElementById('cart-items'));
bindCartEvents(document.getElementById('cart-items-mobile'));

// ---------- Lieferung/Abholung Toggle ----------
const modeBtns = document.querySelectorAll('.mode-btn, .mode-card');
const modeInfo = document.getElementById('mode-info');

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => {
      b.classList.remove('mode-btn--active');
      b.classList.remove('mode-card--active');
    });
    btn.classList.add(btn.classList.contains('mode-card') ? 'mode-card--active' : 'mode-btn--active');
    if (modeInfo) {
      modeInfo.textContent = btn.dataset.mode === 'lieferung'
        ? 'Lieferung in ca. 35 Min · Mindestbestellwert 12,00 €'
        : 'Abholung in ca. 15 Min · Bochumer Straße 112, Gelsenkirchen';
    }
  });
});

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');
if (mode) {
  const targetBtn = document.querySelector(`[data-mode="${mode}"]`);
  if (targetBtn) targetBtn.click();
}

// ---------- IntersectionObserver Kategorienleiste ----------
const sections = document.querySelectorAll('.menu-section');
const catLinks = document.querySelectorAll('.cat-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      catLinks.forEach(l => l.classList.remove('cat-link--active'));
      const active = document.querySelector(`.cat-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('cat-link--active');
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(s => observer.observe(s));

// ---------- Mobile Drawer öffnen/schließen ----------
document.getElementById('cart-toggle')?.addEventListener('click', openCartDrawer);
document.getElementById('cart-fab')?.addEventListener('click', openCartDrawer);
document.getElementById('cart-close')?.addEventListener('click', closeCartDrawer);
document.getElementById('cart-overlay')?.addEventListener('click', closeCartDrawer);

function openCartDrawer() {
  document.getElementById('cart-drawer').classList.add('active');
  document.getElementById('cart-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  renderCartMobile();
}

function closeCartDrawer() {
  document.getElementById('cart-drawer').classList.remove('active');
  document.getElementById('cart-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ---------- Stempel-Hinweis im Warenkorb ----------
// Zeigt an, was die aktuelle Bestellung fuer die Stempelkarte bedeutet.
// Unter dem Mindestbestellwert der staerkere Anreiz: was noch fehlt.
async function renderStempelHinweis() {
  const vorschau = await getStampPreview(getCartTotal());
  const ziele = [
    document.getElementById('stempel-hinweis'),
    document.getElementById('stempel-hinweis-mobile')
  ];

  ziele.forEach(el => {
    if (!el) return;
    if (!vorschau || getCartCount() === 0) {
      el.innerHTML = '';
      return;
    }
    if (!vorschau.qualifiziert) {
      el.innerHTML = `
        <div class="stamp-hint">
          <span class="stamp-hint__zahl">${vorschau.stempel_stand}/${vorschau.target_stamps}</span>
          <span>Noch <strong>${vorschau.fehlbetrag.toFixed(2).replace('.', ',')} €</strong>
          bis zum nächsten Stempel</span>
        </div>`;
      return;
    }
    el.innerHTML = vorschau.karte_wird_voll
      ? `<div class="stamp-hint">
           <span class="stamp-hint__zahl">${vorschau.target_stamps}/${vorschau.target_stamps}</span>
           <span>Diese Bestellung macht deine Karte <strong>voll</strong>.
           ${TREUE.reward_description} wartet danach auf dich.</span>
         </div>`
      : `<div class="stamp-hint">
           <span class="stamp-hint__zahl">${vorschau.naechster_stempel}/${vorschau.target_stamps}</span>
           <span>Diese Bestellung bringt dir Stempel
           <strong>${vorschau.naechster_stempel} von ${vorschau.target_stamps}</strong></span>
         </div>`;
  });
}

// ---------- Favoriten-Herz an den Produktkarten ----------
async function herzenAufbauen() {
  const karten = document.querySelectorAll('.menu-card');

  for (const karte of karten) {
    const btn = karte.querySelector('.add-to-cart');
    if (!btn) continue;
    const id = btn.dataset.id;
    const aktiv = await isFavorite(id);

    const herz = document.createElement('button');
    herz.className = 'fav-herz' + (aktiv ? ' fav-herz--aktiv' : '');
    herz.type = 'button';
    herz.dataset.fav = id;
    herz.setAttribute('aria-label', aktiv ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen');
    herz.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round"
           stroke-linejoin="round" aria-hidden="true">
        <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path>
      </svg>`;

    herz.addEventListener('click', async () => {
      const jetztAktiv = await toggleFavorite(id);
      herz.classList.toggle('fav-herz--aktiv', jetztAktiv);
      herz.setAttribute('aria-label', jetztAktiv ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen');
    });

    karte.appendChild(herz);
  }
}

// ---------- Sticky Nav Shadow ----------
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
});

// ---------- Initial ----------
renderCart();
renderCartMobile();

// Kundenkonto: Auto-Login, Demo-Banner, Konto-Link, Favoriten, Stempel
setupSeite().then(() => {
  iconsEinsetzen();
  herzenAufbauen();
  renderStempelHinweis();
});

// Stempel-Hinweis bei jeder Warenkorb-Aenderung neu berechnen
document.addEventListener('click', () => setTimeout(renderStempelHinweis, 50));
document.addEventListener('change', () => setTimeout(renderStempelHinweis, 50));
