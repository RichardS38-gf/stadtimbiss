# Stadtimbiss — Phase 4: Warenkorb Slide-in + Checkout + Danke-Seite

## Kontext

Projekt: Stadtimbiss — Restaurant-Bestellshop Frontend-Demo
Arbeitsordner: `C:\Users\richa\OneDrive - MANERI UG\General\Firmen\Unsortiert\Richie unsortiert\ClaudeCode Workspace\Restaurant Online Shop`
Phase 1, 2 und 3 sind abgeschlossen. Warenkorb-Logik (`js/cart.js`) existiert bereits.

Lies vor dem Start: `js/cart.js`, `css/bestellen.css`, `bestellen.html`

---

## Aufgabe A — Warenkorb Slide-in (Mobile)

Auf Mobile (< 1024px) ist die Sidebar versteckt. Stattdessen: ein Slide-in Panel von unten beim Klick auf den Warenkorb-Button.

### HTML in bestellen.html ergänzen

Am Ende des `<body>` einfügen:

```html
<!-- Warenkorb Slide-in (Mobile) -->
<div class="cart-overlay" id="cart-overlay"></div>
<div class="cart-drawer" id="cart-drawer">
  <div class="cart-drawer__header">
    <h3>Deine Bestellung</h3>
    <button class="cart-drawer__close" id="cart-close">✕</button>
  </div>
  <div class="cart-drawer__body">
    <div class="cart-items" id="cart-items-mobile"></div>
    <div class="cart-empty" id="cart-empty-mobile">
      <p>Noch keine Artikel im Warenkorb.</p>
    </div>
  </div>
  <div class="cart-drawer__footer" id="cart-summary-mobile">
    <div class="cart-summary__row">
      <span>Zwischensumme</span>
      <span id="cart-subtotal-mobile">0,00 €</span>
    </div>
    <div class="cart-summary__row">
      <span>Lieferung</span>
      <span>2,50 €</span>
    </div>
    <div class="cart-summary__row cart-summary__total">
      <span>Gesamt</span>
      <span id="cart-total-mobile">0,00 €</span>
    </div>
    <a href="checkout.html" class="btn btn--primary btn--full">
      Zur Kasse →
    </a>
  </div>
</div>

<!-- Floating Cart Button (Mobile only) -->
<button class="cart-fab" id="cart-fab">
  🛒 Warenkorb
  <span class="cart-fab__count" id="cart-fab-count">0</span>
  <span class="cart-fab__price" id="cart-fab-price">0,00 €</span>
</button>
```

### CSS in bestellen.css ergänzen

```css
/* Overlay */
.cart-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200;
}
.cart-overlay.active { display: block; }

/* Drawer von unten */
.cart-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-bg-soft);
  z-index: 201;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}
.cart-drawer.active { transform: translateY(0); }

.cart-drawer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-line);
}

.cart-drawer__close {
  font-size: 1.25rem;
  color: var(--color-muted);
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.25rem;
}

.cart-drawer__footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--color-line);
}

/* Floating Action Button */
.cart-fab {
  display: none;
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background: var(--color-accent);
  color: white;
  padding: 0.875rem 1.25rem;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  z-index: 150;
  box-shadow: 0 4px 20px rgba(230,57,70,0.4);
  min-height: 54px;
}

.cart-fab.visible { display: flex; }

.cart-fab__count {
  background: white;
  color: var(--color-accent);
  font-weight: 800;
  font-size: 0.8rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}

.cart-fab__price {
  font-weight: 800;
}

/* Auf Desktop: Drawer und FAB verstecken */
@media (min-width: 1024px) {
  .cart-fab { display: none !important; }
  .cart-drawer { display: none !important; }
  .cart-overlay { display: none !important; }
}
```

### JS in bestellen.js ergänzen

```javascript
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

// renderCart() und renderCartMobile() nach jedem addToCart aufrufen
```

---

## Aufgabe B — checkout.html

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kasse — Stadtimbiss</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/tokens.css?v=1">
  <link rel="stylesheet" href="css/base.css?v=1">
  <link rel="stylesheet" href="css/layout.css?v=1">
  <link rel="stylesheet" href="css/components.css?v=1">
  <link rel="stylesheet" href="css/checkout.css?v=1">
</head>
```

### Aufbau checkout.html

**Navigation:** Gleicher Header wie immer, kein Warenkorb-Button (wir sind schon im Checkout).

**Fortschrittsanzeige (3 Schritte):**
```html
<div class="checkout-steps">
  <div class="step step--active">1 Adresse</div>
  <div class="step">2 Zahlung</div>
  <div class="step">3 Bestätigung</div>
</div>
```

**Zweispaltiges Layout auf Desktop (Formular links, Bestellübersicht rechts):**

**Linke Spalte — Formular:**

Sektion "Lieferadresse":
- Vorname (required)
- Nachname (required)
- Straße + Hausnummer (required)
- PLZ (required, maxlength=5)
- Stadt (required)
- Telefon (required)
- E-Mail (required)

Sektion "Anmerkungen":
- Textarea "Anmerkungen zur Bestellung (optional)"

Sektion "Zahlungsart":
- Radio-Buttons:
  - 💵 Bar bei Lieferung (vorausgewählt)
  - 💳 EC-Karte bei Lieferung
  - 📱 PayPal (deaktiviert mit Badge "Bald verfügbar")

Submit-Button: `.btn.btn--primary.btn--full` "Jetzt bestellen →" → führt zu `danke.html` (kein echtes Absenden)

**Rechte Spalte — Bestellübersicht:**
- "Deine Bestellung" Header
- Artikel aus localStorage (JS liest cart.js)
- Zwischensumme, Lieferung, Gesamt
- Kleiner Hinweis: "Bezahlung bei Lieferung"

**CSS checkout.css:**
- Formular: saubere Labels über Inputs, border 1px solid `var(--color-line)`, padding 0.75rem, width 100%
- Focus: border-color `var(--color-accent)`, outline none
- Zweispaltig ab 1024px (Formular 60%, Sidebar 38%)
- Checkout-Steps: flex, gap, aktiver Step in `var(--color-accent)`

---

## Aufgabe C — danke.html

Einfache, saubere Seite:

```html
<!-- Hauptinhalt -->
<main class="danke-main">
  <div class="danke-icon">✓</div>
  <h1>Vielen Dank!</h1>
  <p>Deine Bestellung wurde aufgenommen. Wir bereiten dein Essen vor.</p>
  <div class="danke-info">
    <div class="danke-info__item">
      <strong>Bestellnummer</strong>
      <span>#2025-1337</span>
    </div>
    <div class="danke-info__item">
      <strong>Voraussichtliche Lieferzeit</strong>
      <span>ca. 35 Minuten</span>
    </div>
    <div class="danke-info__item">
      <strong>Zahlungsart</strong>
      <span>Bar bei Lieferung</span>
    </div>
  </div>
  <a href="index.html" class="btn btn--outline">← Zurück zur Startseite</a>
</main>
```

**CSS:**
- `.danke-icon`: Großer grüner Kreis mit ✓, animiert einblenden (scale 0 → 1, 0.5s ease)
- `.danke-main`: zentriert, max-width 480px, padding oben/unten großzügig
- `.danke-info`: Karte mit border, jedes Item flex space-between
- Animation: `@keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }`

**JS:** `clearCart()` aus cart.js aufrufen beim Laden der Seite.

---

## Erwartetes Ergebnis

- Warenkorb-Drawer auf Mobile funktioniert (aufklappen, schließen, Overlay)
- FAB erscheint sobald Artikel im Warenkorb
- `checkout.html` vollständig mit Formular und Bestellübersicht
- `danke.html` mit Animation
- `css/checkout.css` mit allen Styles
- Git-Push: `git add -A && git commit -m "Phase 4: Warenkorb, Checkout, Danke" && git push`
- Kurze Rückmeldung an Florian. Warten auf Go für Phase 5.
