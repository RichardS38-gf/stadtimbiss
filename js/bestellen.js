// bestellen.js — Stadtimbiss Bestellseite

import { addToCart, getCart, getCartTotal, getCartCount, updateQty, removeFromCart } from './cart.js';

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

    btn.textContent = '✓ Hinzugefügt';
    btn.style.background = '#2a9d4e';
    btn.style.borderColor = '#2a9d4e';
    setTimeout(() => {
      btn.textContent = '+ Hinzufügen';
      btn.style.background = '';
      btn.style.borderColor = '';
    }, 1000);
  });
});

// ---------- Event-Delegation einbinden ----------
bindCartEvents(document.getElementById('cart-items'));
bindCartEvents(document.getElementById('cart-items-mobile'));

// ---------- Lieferung/Abholung Toggle ----------
const modeBtns = document.querySelectorAll('.mode-btn');
const modeInfo = document.getElementById('mode-info');

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('mode-btn--active'));
    btn.classList.add('mode-btn--active');
    if (modeInfo) {
      modeInfo.textContent = btn.dataset.mode === 'lieferung'
        ? 'Lieferung in ca. 35 Min · Mindestbestellwert 8,00 €'
        : 'Abholung in ca. 15 Min · Musterstraße 1, Braunschweig';
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

// ---------- Sticky Nav Shadow ----------
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
});

// ---------- Initial ----------
renderCart();
renderCartMobile();
