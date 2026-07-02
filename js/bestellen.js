// bestellen.js — Stadtimbiss Bestellseite (Kategorie-Filter, Warenkorb, UI)

import { addToCart, getCart, getCartTotal, getCartCount } from './cart.js';

// Warenkorb-Anzeige aktualisieren
function renderCart() {
  const cart = getCart();
  const itemsEl = document.getElementById('cart-items');
  const emptyEl = document.getElementById('cart-empty');
  const summaryEl = document.getElementById('cart-summary');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');

  // Badge immer aktualisieren (auch auf Mobile, wo Sidebar fehlt)
  if (countEl) {
    countEl.textContent = getCartCount();
    countEl.style.display = getCartCount() > 0 ? 'flex' : 'none';
  }

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    emptyEl.style.display = 'block';
    summaryEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  summaryEl.style.display = 'block';

  const subtotal = getCartTotal();
  subtotalEl.textContent = subtotal.toFixed(2).replace('.', ',') + ' €';
  totalEl.textContent = (subtotal + 2.50).toFixed(2).replace('.', ',') + ' €';

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item__name">${item.name}</span>
      <span class="cart-item__qty">×${item.qty}</span>
      <span class="cart-item__price">${(item.price * item.qty).toFixed(2).replace('.', ',')} €</span>
    </div>
  `).join('');
}

// "Hinzufügen"-Buttons
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    addToCart({
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: parseFloat(btn.dataset.price)
    });
    renderCart();
    renderCartMobile();
    // Visuelles Feedback
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

// Lieferung/Abholung Toggle
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

// URL-Parameter auslesen für Modus
const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');
if (mode) {
  const targetBtn = document.querySelector(`[data-mode="${mode}"]`);
  if (targetBtn) targetBtn.click();
}

// IntersectionObserver für aktive Kategorie
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

// ---------- Warenkorb Slide-in (Mobile) ----------
// Warenkorb-Button (Nav)
document.getElementById('cart-toggle')?.addEventListener('click', openCartDrawer);

// FAB
document.getElementById('cart-fab')?.addEventListener('click', openCartDrawer);

// Schließen
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

  // FAB
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

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item__name">${item.name}</span>
      <span class="cart-item__qty">×${item.qty}</span>
      <span class="cart-item__price">${(item.price * item.qty).toFixed(2).replace('.', ',')} €</span>
    </div>
  `).join('');
}

// Initial rendern
renderCart();
renderCartMobile();
