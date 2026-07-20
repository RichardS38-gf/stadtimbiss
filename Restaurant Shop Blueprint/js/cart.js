// cart.js — Stadtimbiss Warenkorb-Logik

const CART_KEY = 'stadtimbiss_cart';

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

export function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

export function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = qty;
    if (item.qty <= 0) return removeFromCart(id);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

export function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}
